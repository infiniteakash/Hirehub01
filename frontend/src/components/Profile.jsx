import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import axios from 'axios'
import { RESUME_DOWNLOAD_END_POINT, RESUME_LIST_END_POINT } from '@/utils/constant'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [resumes, setResumes] = useState([]);
    const {user} = useSelector(store=>store.auth);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await axios.get(RESUME_LIST_END_POINT, { withCredentials: true });
                if (res.data.success) {
                    setResumes(res.data.resumes || []);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (user) {
            fetchResumes();
        }
    }, [user]);

    const handleDownload = async (resume) => {
        if (!resume?.fileId) return;
        try {
            const res = await axios.get(`${RESUME_DOWNLOAD_END_POINT}/${resume.fileId}`, {
                withCredentials: true,
                responseType: "blob"
            });
            const blobUrl = window.URL.createObjectURL(res.data);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = resume.filename || "resume";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <h1 className='font-bold text-lg mb-4'>Resume history</h1>
                {resumes.length > 0 ? (
                    <div className='space-y-3'>
                        {resumes.map((resume) => (
                            <div key={resume._id} className='flex flex-col gap-2 rounded-xl border border-gray-100 p-4 md:flex-row md:items-center md:justify-between'>
                                <div>
                                    <p className='font-medium text-gray-900'>{resume.filename}</p>
                                    <p className='text-sm text-gray-500'>Saved {resume.createdAt?.split("T")[0]}</p>
                                    <div className='mt-2 flex flex-wrap gap-2'>
                                        {(resume.parsedData?.skills || []).slice(0, 6).map((skill) => (
                                            <Badge key={`${resume._id}-${skill}`} variant='secondary'>{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button variant='outline' onClick={() => handleDownload(resume)}>Download</Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-sm text-gray-500'>No resumes saved yet.</p>
                )}
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile