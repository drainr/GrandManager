import React from 'react';
import GreenButton from "../components/GreenButton.jsx";
import BlueButton from "../components/BlueButton.jsx";
import YellowButton from "../components/YellowButton.jsx";
import RedButton from "../components/RedButton.jsx";
import Calendar from "./Calendar.jsx";

const Dashboard = () => {
    return (
        <div className="flex bg-[#364A85]">
            <div className="flex flex-col">
                 <Calendar/>
            </div>
        </div>
    );
};

export default Dashboard;