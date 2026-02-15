import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import PillNav from '../PillNav'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }
    };

    const logoUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%236A38C2" rx="8"/%3E%3Ctext x="50%25" y="50%25" font-size="20" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle"%3EHH%3C/text%3E%3C/svg%3E';

    const getItems = () => {
        if (user?.role === 'recruiter') {
            return [
                { label: 'Home', href: '/' },
                { label: 'Companies', href: '/admin/companies' },
                { label: 'Jobs', href: '/admin/jobs' }
            ];
        } else if (user?.role === 'student') {
            return [
                { label: 'Home', href: '/' },
                { label: 'Jobs', href: '/jobs' },
                { label: 'Browse', href: '/browse' },
                { label: 'Resume', href: '/resume-parser' }
            ];
        } else {
            return [
                { label: 'Home', href: '/' },
                { label: 'Jobs', href: '/jobs' },
                { label: 'Browse', href: '/browse' },
                { label: 'Login', href: '/login' }
            ];
        }
    };

    const items = getItems();
    const homeItem = { label: 'HireHub', href: '/' };
    const allItems = [homeItem, ...items];

    // Add profile/logout items at the end if user is logged in
    if (user) {
        allItems.push({ label: 'Profile', href: '/profile' });
        allItems.push({ label: 'Logout', href: '#', onClick: logoutHandler });
    } else {
        allItems.push({ label: 'Signup', href: '/signup' });
    }

    return (
        <PillNav
            logo={logoUrl}
            logoAlt="HireHub"
            items={allItems}
            activeHref={pathname}
            className="hirehub-nav"
            ease="power2.easeOut"
            baseColor="#060010"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            initialLoadAnimation={true}
        />
    );
};

export default Navbar;