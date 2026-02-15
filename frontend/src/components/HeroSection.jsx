import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import PixelBlast from './PixelBlast';

const HeroSection = () => {
    const [roleQuery, setRoleQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        const combinedQuery = `${roleQuery} ${locationQuery}`.trim();
        dispatch(setSearchedQuery(combinedQuery));
        navigate("/browse");
    }

    return (
        <div className='relative text-center bg-gradient-to-b from-[#f7f5ff] to-white overflow-hidden'>
            <div style={{ width: '100%', height: '600px', position: 'absolute', top: 0, left: 0 }}>
                <PixelBlast
                    variant="square"
                    pixelSize={4}
                    color="#B19EEF"
                    patternScale={2}
                    patternDensity={1}
                    pixelSizeJitter={0}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.5}
                    edgeFade={0.25}
                    transparent
                />
            </div>
            <div className='relative z-10 max-w-5xl mx-auto flex flex-col gap-6 py-16 px-4'>
                <span className='mx-auto px-4 py-2 rounded-full bg-white text-[#6A38C2] font-semibold shadow-sm border border-gray-100'>Trusted by 2,000+ companies</span>
                <h1 className='text-5xl md:text-6xl font-bold leading-tight'>Find your next <span className='text-[#6A38C2]'>dream role</span> in minutes</h1>
                <p className='text-gray-600 text-lg'>Search curated roles from top startups and enterprises. Apply faster with one profile.</p>
                <div className='flex flex-col md:flex-row gap-3 md:gap-4 items-center bg-white shadow-lg border border-gray-200 rounded-2xl p-3 mx-auto w-full md:w-[80%]'>
                    <input
                        type="text"
                        placeholder='Role or keyword (e.g., Frontend, UX)'
                        onChange={(e) => setRoleQuery(e.target.value)}
                        className='outline-none border-none w-full px-3 py-2'
                    />
                    <div className='hidden md:block h-6 w-px bg-gray-200'></div>
                    <input
                        type="text"
                        placeholder='Location (e.g., Remote, Berlin)'
                        onChange={(e) => setLocationQuery(e.target.value)}
                        className='outline-none border-none w-full px-3 py-2'
                    />
                    <Button onClick={searchJobHandler} className="rounded-xl bg-[#6A38C2] hover:bg-[#5b30a6] px-6 w-full md:w-auto">
                        <Search className='h-5 w-5 mr-2' /> Search
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection