import React from 'react';
import GreenButton from "../components/GreenButton.jsx";
import BlueButton from "../components/BlueButton.jsx";
import YellowButton from "../components/YellowButton.jsx";
import RedButton from "../components/RedButton.jsx";

const Dashboard = () => {
    return (
        <div>
            <GreenButton />
            <BlueButton />
            <YellowButton />
            <RedButton />
        </div>
    );
};

export default Dashboard;