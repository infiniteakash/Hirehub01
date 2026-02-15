import { setAllJobs, setJobsError, setJobsLoading } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                dispatch(setJobsLoading(true));
                dispatch(setJobsError(null));
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                } else {
                    dispatch(setAllJobs([]));
                    dispatch(setJobsError(res.data.message || "Failed to load jobs"));
                    toast.error(res.data.message || "Failed to load jobs");
                }
            } catch (error) {
                const message = error?.response?.data?.message || error.message || "Failed to load jobs";
                dispatch(setAllJobs([]));
                dispatch(setJobsError(message));
                toast.error(message);
            }
            finally{
                dispatch(setJobsLoading(false));
            }
        }
        fetchAllJobs();
    },[dispatch, searchedQuery])
}

export default useGetAllJobs