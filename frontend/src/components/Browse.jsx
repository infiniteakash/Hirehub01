import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Browse = () => {
    useGetAllJobs();
    const {allJobs, jobsLoading, jobsError} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                        jobsLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 animate-pulse'>
                                    <div className='h-4 w-1/2 bg-gray-200 rounded mb-3'></div>
                                    <div className='h-3 w-1/3 bg-gray-200 rounded mb-4'></div>
                                    <div className='h-5 w-3/4 bg-gray-200 rounded mb-2'></div>
                                    <div className='h-3 w-full bg-gray-200 rounded mb-4'></div>
                                    <div className='h-6 w-1/2 bg-gray-200 rounded'></div>
                                </div>
                            ))
                        ) : jobsError ? (
                            <span>{jobsError}</span>
                        ) : allJobs.length <= 0 ? (
                            <span>No Job Available</span>
                        ) : (
                            allJobs.map((job) => (
                                <Job key={job._id} job={job}/>
                            ))
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse