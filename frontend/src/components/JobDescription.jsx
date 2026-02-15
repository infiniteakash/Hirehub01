import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { MapPin, DollarSign, Users, Calendar, Briefcase, Building2, ExternalLink, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [isSaved, setIsSaved] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    // Professional company images for carousel
    const companyImages = [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1552664888-a94fe4c3ff92?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1552664673-30e2daf07f37?w=500&h=300&fit=crop'
    ];

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % companyImages.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + companyImages.length) % companyImages.length);
    };

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-10'>
            {/* Hero Section with Background */}
            <div className='relative mb-8 h-64 rounded-lg overflow-hidden shadow-lg'>
                <div 
                    className='absolute inset-0 bg-cover bg-center'
                    style={{
                        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                >
                    <img 
                        src='https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=300&fit=crop'
                        alt='hero'
                        className='w-full h-full object-cover opacity-40'
                    />
                </div>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600/80 to-transparent flex items-center px-8'>
                    <div className='text-white'>
                        <p className='text-sm font-semibold opacity-90 mb-2'>Featured Opportunity</p>
                        <h1 className='text-4xl font-bold mb-2'>{singleJob?.title}</h1>
                        <p className='text-purple-100 text-lg'>{singleJob?.company?.name}</p>
                    </div>
                </div>
            </div>

            <div className='max-w-6xl mx-auto px-4'>
                {/* Header Section with Company Logo */}
                <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
                    <div className='flex items-start justify-between mb-6'>
                        <div className='flex items-center gap-6'>
                            <div className='bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl'>
                                <Avatar className='w-24 h-24'>
                                    <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                                </Avatar>
                            </div>
                            <div className='flex-1'>
                                <p className='text-purple-600 text-sm font-semibold uppercase mb-1'>Featured Job</p>
                                <h1 className='font-bold text-4xl text-gray-900 mb-3'>{singleJob?.title}</h1>
                                <div className='flex items-center gap-2 text-gray-600 mb-4'>
                                    <Building2 size={18} />
                                    <span className='font-semibold'>{singleJob?.company?.name}</span>
                                </div>
                                <div className='flex items-center gap-4 flex-wrap'>
                                    <Badge className='text-blue-700 font-bold bg-blue-100' variant="ghost">
                                        {singleJob?.position} Positions
                                    </Badge>
                                    <Badge className='text-orange-700 font-bold bg-orange-100' variant="ghost">
                                        {singleJob?.jobType}
                                    </Badge>
                                    <Badge className='text-purple-700 font-bold bg-purple-100' variant="ghost">
                                        ₹{singleJob?.salary} LPA
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <Button
                                onClick={() => setIsSaved(!isSaved)}
                                variant="outline"
                                size="icon"
                                className={`rounded-full ${isSaved ? 'bg-red-50 text-red-600' : ''}`}
                            >
                                <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                            </Button>
                            <Button
                                onClick={() => toast.success('Job link copied!')}
                                variant="outline"
                                size="icon"
                                className='rounded-full'
                            >
                                <Share2 size={20} />
                            </Button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`flex-1 rounded-lg py-6 text-lg font-semibold transition-all ${
                                isApplied 
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                            }`}
                        >
                            {isApplied ? '✓ Already Applied' : 'Apply Now'}
                        </Button>
                        <Button
                            variant="outline"
                            className='px-8 rounded-lg py-6 text-lg font-semibold'
                        >
                            Save Job
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left Content - Job Details */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Quick Info Cards */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-5 border-l-4 border-blue-600 relative overflow-hidden'>
                                <img src='https://images.unsplash.com/photo-1553531088-dd8f65a0cfc2?w=100&h=100&fit=crop' alt='location' className='absolute -right-4 -bottom-4 opacity-10 w-24 h-24' />
                                <div className='flex items-center gap-2 mb-2 relative z-10'>
                                    <MapPin size={20} className='text-blue-600' />
                                    <p className='text-gray-600 text-sm font-semibold'>Location</p>
                                </div>
                                <p className='font-bold text-gray-900 text-lg relative z-10'>{singleJob?.location}</p>
                            </div>

                            <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-5 border-l-4 border-purple-600 relative overflow-hidden'>
                                <img src='https://images.unsplash.com/photo-1552664673-30e2daf07f37?w=100&h=100&fit=crop' alt='experience' className='absolute -right-4 -bottom-4 opacity-10 w-24 h-24' />
                                <div className='flex items-center gap-2 mb-2 relative z-10'>
                                    <Briefcase size={20} className='text-purple-600' />
                                    <p className='text-gray-600 text-sm font-semibold'>Experience</p>
                                </div>
                                <p className='font-bold text-gray-900 text-lg relative z-10'>{singleJob?.experienceLevel} Years</p>
                            </div>

                            <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-5 border-l-4 border-green-600 relative overflow-hidden'>
                                <img src='https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=100&h=100&fit=crop' alt='salary' className='absolute -right-4 -bottom-4 opacity-10 w-24 h-24' />
                                <div className='flex items-center gap-2 mb-2 relative z-10'>
                                    <DollarSign size={20} className='text-green-600' />
                                    <p className='text-gray-600 text-sm font-semibold'>Salary Range</p>
                                </div>
                                <p className='font-bold text-gray-900 text-lg relative z-10'>₹{singleJob?.salary} LPA</p>
                            </div>

                            <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-5 border-l-4 border-orange-600 relative overflow-hidden'>
                                <img src='https://images.unsplash.com/photo-1552664888-a94fe4c3ff92?w=100&h=100&fit=crop' alt='applicants' className='absolute -right-4 -bottom-4 opacity-10 w-24 h-24' />
                                <div className='flex items-center gap-2 mb-2 relative z-10'>
                                    <Users size={20} className='text-orange-600' />
                                    <p className='text-gray-600 text-sm font-semibold'>Applicants</p>
                                </div>
                                <p className='font-bold text-gray-900 text-lg relative z-10'>{singleJob?.applications?.length} Applied</p>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className='bg-white rounded-lg shadow-md p-8 relative overflow-hidden border-l-4 border-blue-600'>
                            <div className='absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full -ml-16 -mt-16 opacity-50'></div>
                            <h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10'>
                                <div className='p-2 bg-blue-100 rounded-lg'>
                                    <Briefcase className='text-blue-600' size={24} />
                                </div>
                                Job Description
                            </h2>
                            <p className='text-gray-700 leading-relaxed text-lg mb-6 relative z-10'>
                                {singleJob?.description}
                            </p>
                        </div>

                        {/* Requirements Section */}
                        <div className='bg-white rounded-lg shadow-md p-8 relative overflow-hidden'>
                            <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50'></div>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10'>
                                <div className='p-2 bg-green-100 rounded-lg'>
                                    <CheckCircle className='text-green-600' size={24} />
                                </div>
                                Key Requirements
                            </h2>
                            <div className='grid grid-cols-1 gap-3 relative z-10'>
                                {singleJob?.requirements && singleJob.requirements.length > 0 ? (
                                    singleJob.requirements.map((req, idx) => (
                                        <div key={idx} className='flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg border-l-4 border-green-500 hover:shadow-md transition'>
                                            <div className='w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold'>
                                                ✓
                                            </div>
                                            <p className='text-gray-700 font-medium'>{req}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-gray-600 italic'>Requirements details not specified</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className='bg-white rounded-lg shadow-md p-8'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Additional Information</h2>
                            <div className='grid grid-cols-2 gap-6'>
                                <div>
                                    <p className='text-gray-500 text-sm font-semibold mb-2'>Posted Date</p>
                                    <div className='flex items-center gap-2'>
                                        <Calendar size={20} className='text-blue-600' />
                                        <p className='font-semibold text-gray-900'>{singleJob?.createdAt?.split("T")[0]}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-gray-500 text-sm font-semibold mb-2'>Job Type</p>
                                    <p className='font-semibold text-gray-900'>{singleJob?.jobType}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Company Info */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Company Info Card */}
                        <div className='bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 rounded-lg shadow-md overflow-hidden border-2 border-purple-200'>
                            {/* Header Background with Pattern */}
                            <div className='h-24 bg-gradient-to-r from-purple-600 to-purple-700 relative overflow-hidden'>
                                <div className='absolute inset-0 opacity-10'>
                                    <img src='https://images.unsplash.com/photo-1552664673-30e2daf07f37?w=300&h=100&fit=crop' alt='header' className='w-full h-full object-cover' />
                                </div>
                                <div className='absolute inset-0 bg-gradient-to-r from-purple-600/90 to-purple-700/90'></div>
                            </div>

                            <div className='p-8 -mt-12 relative z-10'>
                                <div className='flex justify-center mb-4'>
                                    <div className='p-4 bg-white rounded-full shadow-lg border-4 border-purple-200'>
                                        <Avatar className='w-20 h-20'>
                                            <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                                        </Avatar>
                                    </div>
                                </div>

                                <div className='text-center mb-6'>
                                    <h4 className='text-lg font-bold text-gray-900 mb-1'>{singleJob?.company?.name}</h4>
                                    <p className='text-gray-600 text-xs uppercase tracking-wider font-semibold'>Verified Company</p>
                                </div>

                                <p className='text-gray-700 text-sm leading-relaxed mb-6 text-center'>
                                    {singleJob?.company?.description || 'A leading organization committed to excellence and innovation.'}
                                </p>

                                {/* Company Details */}
                                <div className='space-y-3 mb-6 pb-6 border-b border-purple-200'>
                                    {singleJob?.company?.location && (
                                        <div className='flex items-start gap-3 p-2 rounded hover:bg-purple-100 transition'>
                                            <MapPin size={18} className='text-purple-600 flex-shrink-0 mt-1' />
                                            <p className='text-gray-700 text-sm'>{singleJob?.company?.location}</p>
                                        </div>
                                    )}
                                    {singleJob?.company?.website && (
                                        <div className='flex items-start gap-3 p-2 rounded hover:bg-purple-100 transition'>
                                            <ExternalLink size={18} className='text-purple-600 flex-shrink-0 mt-1' />
                                            <a 
                                                href={singleJob?.company?.website} 
                                                target='_blank' 
                                                rel='noopener noreferrer'
                                                className='text-purple-600 text-sm font-semibold hover:underline break-all'
                                            >
                                                {singleJob?.company?.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Company Action Buttons */}
                                <Button variant="outline" className='w-full mb-2 rounded-lg border-purple-300 hover:bg-purple-50'>
                                    <Building2 size={16} className='mr-2' />
                                    View Company Profile
                                </Button>
                                <Button className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg'>
                                    <Heart size={16} className='mr-2' />
                                    Follow Company
                                </Button>
                            </div>
                        </div>

                        {/* Company Gallery/Slides */}
                        <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200 overflow-hidden'>
                            <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                <div className='p-2 bg-blue-100 rounded-lg'>
                                    <span className='text-2xl'>🏢</span>
                                </div>
                                Company Gallery
                            </h3>
                            <div className='relative group'>
                                <div className='bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-48 overflow-hidden shadow-lg'>
                                    <img 
                                        src={companyImages[currentSlide]} 
                                        alt={`Gallery ${currentSlide + 1}`}
                                        className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
                                    />
                                    <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity'></div>
                                </div>
                                
                                {/* Slider Controls */}
                                <button
                                    onClick={handlePrevSlide}
                                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition shadow-lg'
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={handleNextSlide}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition shadow-lg'
                                >
                                    <ChevronRight size={24} />
                                </button>

                                {/* Slide Indicators */}
                                <div className='flex justify-center gap-2 mt-4'>
                                    {companyImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`h-2 rounded-full transition-all ${
                                                idx === currentSlide 
                                                    ? 'bg-purple-600 w-8' 
                                                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200 relative overflow-hidden'>
                            <div className='absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-100 to-transparent rounded-full opacity-30'></div>
                            <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10'>
                                <div className='p-2 bg-purple-100 rounded-lg'>
                                    <Users size={20} className='text-purple-600' />
                                </div>
                                Position Stats
                            </h3>
                            <div className='space-y-4 relative z-10'>
                                <div className='p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-100'>
                                    <p className='text-gray-600 text-sm font-semibold mb-3'>📍 Positions Available</p>
                                    <div className='w-full bg-gray-200 rounded-full h-3'>
                                        <div 
                                            className='bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500'
                                            style={{width: '60%'}}
                                        ></div>
                                    </div>
                                    <p className='text-gray-700 font-bold mt-2'>{singleJob?.position} Open Positions</p>
                                </div>
                                <div className='p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-100'>
                                    <p className='text-gray-600 text-sm font-semibold mb-3'>📊 Application Progress</p>
                                    <div className='w-full bg-gray-200 rounded-full h-3'>
                                        <div 
                                            className='bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500'
                                            style={{width: `${Math.min((singleJob?.applications?.length || 0) * 10, 100)}%`}}
                                        ></div>
                                    </div>
                                    <p className='text-gray-700 font-bold mt-2'>{singleJob?.applications?.length} Applications Received</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper component for icons
function CheckCircle({ className }) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
    )
}

export default JobDescription