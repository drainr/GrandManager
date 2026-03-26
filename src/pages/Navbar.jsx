import React from 'react';
import { useNavigate } from 'react-router-dom';
import RedButton from '../components/RedButton';
import { logout } from '../firebase/auth';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="fixed top-0 left-0 w-full p-2 bg-[#4d2c72] shadow-xl flex items-center justify-between z-50">
            <h1 className="text-sm shrikhand-regular text-[#EBB537]">GrandManager</h1>
            <RedButton text="Log Out" onClick={handleLogout} />
        </div>
    );
};

export default Navbar;