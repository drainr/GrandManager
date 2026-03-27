import React from 'react';
import { useNavigate } from 'react-router-dom';
import RedButton from '../components/RedButton';
import { logout } from '../firebase/auth';
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="fixed top-0 left-0 w-full p-2 bg-[#4d2c72] shadow-xl flex items-center justify-between z-50">
            <h1 className="text-sm shrikhand-regular text-[#EBB537]">GrandManager</h1>
            <div className="dropdown dropdown-end mr-4">

                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar overflow-hidden">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                        <CgProfile className="w-full h-full text-[#EBB537]"/>
                    </div>
                </div>

                <ul
                    tabIndex={0}
                    className="flex justify-center menu menu-sm dropdown-content bg-[#EBB537] text-white rounded-box z-[1] mt-3 p-2 shadow-2xl border border-[#4d2c72]"
                >
                    <li >
                        <RedButton text='Logout' onClick={handleLogout}/>
                    </li>
                </ul>
        </div>
        </div>
    );
};

export default Navbar;