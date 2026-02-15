import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs, jobsLoading, jobsError} = useSelector(store=>store.job);
   
    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'><span className='text-[#6A38C2]'>Latest & Top </span> Job Openings</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
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
                        allJobs?.slice(0,6).map((job) => <LatestJobCards key={job._id} job={job}/> )
                    )
                }
            </div>
        </div>
    )
}

export default LatestJobs