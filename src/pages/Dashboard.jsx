import React from 'react';
import GreenButton from "../components/GreenButton.jsx";
import BlueButton from "../components/BlueButton.jsx";
import YellowButton from "../components/YellowButton.jsx";
import RedButton from "../components/RedButton.jsx";
import Calendar from "./Calendar.jsx";
import InspirationalPopup from "./InspoPopUp.jsx";
import Weather from "../components/weather/Weather.jsx";
import Navbar from "./Navbar.jsx";

const Dashboard = () => {
    return (
        <>
            <div className="flex flex-col align-top">
            <Navbar />
        <div className="flex">
            <div className="flex flex-col">
                 <Calendar/>
            </div>
        </div>
            </div>
        </>
    );
};

export default Dashboard;