import React from 'react';
import GreenButton from "../components/GreenButton.jsx";
import BlueButton from "../components/BlueButton.jsx";
import YellowButton from "../components/YellowButton.jsx";
import RedButton from "../components/RedButton.jsx";
import Calendar from "./Calendar.jsx";
import InspirationalPopup from "./InspoPopUp.jsx";
import Weather from "../components/weather/Weather.jsx";
import Navbar from "./Navbar.jsx";
import { useEffect, useState } from 'react';
import { getEntriesByDay } from '../firebase/databaseManager';
import Chat from "./Chat.jsx";
import Checkbox from "../components/Checkbox.jsx";
import PurpleButton from "../components/PurpleButton.jsx";
import Weblist from "../components/weblist/Weblist.jsx";
import Footer from "./Footer.jsx";



const Dashboard = ({onDeleteItem,selectedIndex,index}) => {
    const [todaysTodos, setTodaysTodos] = useState([]);
    const DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const DEFAULT_LIST_ID = 'default';
    const selectedFull    = DAYS_FULL[selectedIndex];
    const todayIndex = new Date().getDay();
    const todayFull = DAYS_FULL[todayIndex];

    useEffect(() => {
        const loadTodos = async () => {
            const data = await getEntriesByDay(DEFAULT_LIST_ID);
            setDayMenus(data);



            setTodaysTodos(data[todayFull] || []);
        };

        loadTodos();
    }, []);
    return (
        <>
            <div className="flex flex-col align-top ">
            <Navbar />
            <div>
            </div>
                <div className='flex flex-col mt-40 p-10'>
                    <div>
                        <Weblist />
                    </div>
                </div>
            <div className="flex flex-column gap-40 ">
                <div className="bg-[#EBB537] shadow-2xl p-10">
                    <h1 className="shrikhand-regular text-[#4d2c72] p-2">New Messages</h1>

                    <div>
                        <GreenButton text="Go to Chat" />
                    </div>

                </div>
                <div className="bg-[#EBB537] shadow-2xl p-10">
                    <h1 className="shrikhand-regular text-[#4d2c72] p-2">Today's To Do's!</h1>
                    <p className="text-[#1B2851] text-lg shrikhand-regular mb-2 p-2 underline-offset-2">
                        {todayFull}
                    </p>
                    {todaysTodos.length === 0 ? (
                        <p className="text-red-900">No tasks today</p>
                    ) : (
                        <>
                            {todaysTodos.slice(0, 3).map((todo, i) => (
                                <p key={i} className="text-white truncate p-2">
                                    <Checkbox onClick={() => onDeleteItem?.(selectedFull, index)}/> {todo}
                                </p>
                            ))}

                            {todaysTodos.length > 3 && (
                                <p className="text-[#1B2851] text-sm">
                                    +{todaysTodos.length - 3} more
                                </p>
                            )}
                        </>
                    )}
                    <div className='mt-9'>
                    <PurpleButton text={"Go to Calendar"}/>
                    </div>
                </div>


            </div>
        </div>
    <div className='w-full bottom-0 mt-10 left-0'>
        <Footer/>
    </div>
        </>
    );
};

export default Dashboard;