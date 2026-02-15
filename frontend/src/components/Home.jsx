import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/jobSlice'

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear search query first to ensure fresh data
    dispatch(setSearchedQuery(""));
  }, [dispatch]);
  
  // Call the hook after clearing search query
  useGetAllJobs();
  
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [navigate, user?.role]);
  
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  )
}

export default Home