import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Added this
import { getEntriesByDay } from "../firebase/databaseManager";

import GreenButton from "../components/GreenButton.jsx";
import PurpleButton from "../components/PurpleButton.jsx";
import Checkbox from "../components/Checkbox.jsx";
import Weblist from "../components/weblist/Weblist.jsx";
import { useMessagePreview } from "../hooks/useMessagePreview.js";
import Footer from "./Footer.jsx";
import WeatherCard from "../components/weather/WeatherCard.jsx";
import BlueButton from "../components/BlueButton.jsx";

const Dashboard = ({ onDeleteItem, selectedIndex, index }) => {
    const navigate = useNavigate();
    const auth = getAuth(); // Initialize auth
    const currentUser = auth.currentUser;

    const [dayMenu, setDayMenus] = useState({});
    const [todaysTodos, setTodaysTodos] = useState([]);
    const DAYS_FULL = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const DEFAULT_LIST_ID = "default";
    const selectedFull = DAYS_FULL[selectedIndex];
    const todayIndex = new Date().getDay();
    const todayFull = DAYS_FULL[todayIndex];

    const { previews } = useMessagePreview(currentUser?.uid);

    useEffect(() => {
        const loadTodos = async () => {
            const data = await getEntriesByDay(DEFAULT_LIST_ID);
            setDayMenus(data);
            setTodaysTodos(data[todayFull] || []);
        };
        loadTodos();
    }, [todayFull]);

    return (
        <>
           <div className="flex flex-col align-top min-h-screen w-screen">
            <div className='flex flex-row items-start justify-center mt-20 p-10 gap-8'>
                <div className='w-fit max-w-[600px]'>
                    <Weblist />
                </div>

                <div className="flex flex-col gap-4">
                    <WeatherCard location="Sarasota" />
                    <WeatherCard location="Thousand Oaks, CA" />
                </div>
            </div>

                <div className="flex flex-row gap-10 justify-center p-10">
                    <div className="bg-[#4d2c72] rounded-xl p-6 w-80 shadow-2xl shadow-black border border-[#EBB537]">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="shrikhand-regular text-[#EBB537] text-xl">
                                New Messages
                            </h1>
                        </div>

                        <div className="space-y-3 mb-6">
                            {previews && previews.length > 0 ? (
                                previews.slice(0, 3).map((preview) => (
                                    <div
                                        key={preview.chatId}
                                        className="bg-[#405BA4] p-3 rounded-lg cursor-pointer hover:bg-[#4d2c72] transition-all"
                                        onClick={() => navigate("/chat")}
                                    >
                                        <div className="flex justify-between items-start">
                      <span className="text-[#EBB537] text-[10px] font-bold uppercase">
                        {preview.name}
                      </span>
                                            <span className="text-[10px] text-gray-300 opacity-70">
                        {preview.createdAt
                            ? new Date(preview.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : ""}
                      </span>
                                        </div>
                                        <p className="text-white text-sm truncate mt-1">
                                            {preview.senderId === currentUser?.uid ? "You: " : ""}
                                            {preview.lastMessage}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm italic">
                                    No recent activity...
                                </p>
                            )}
                        </div>

                        <BlueButton
                            text={"Go to Chat"}
                            onClick={() => navigate("/chat")}
                        />
                    </div>

                    <div className="bg-[#EBB537] p-6 rounded-xl w-80 shadow-2xl shadow-black border border-[#4d2c72]">
                        <h1 className="shrikhand-regular text-[#4d2c72] text-xl mb-2">Today's To-Dos!</h1>
                        <p className="text-[#1B2851] text-md shrikhand-regular mb-4 underline decoration-[#4d2c72]">
                            {todayFull}
                        </p>

                        <div className="min-h-[120px]">
                            {todaysTodos.length === 0 ? (
                                <p className="text-red-900 font-bold">No tasks today</p>
                            ) : (
                                <>
                                    {todaysTodos.slice(0, 3).map((todo, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-2 h-min"
                                        >
                                            <div className='flex-shrink-0 flex items-center'>
                                            <Checkbox
                                                onClick={() => onDeleteItem?.(selectedFull, index)}
                                            /></div>
                                            <p className="text-[#1B2851] font-medium leading-none mt-3 p-0 flex items-center">
                                                {todo}
                                            </p>
                                        </div>
                                    ))}
                                    {todaysTodos.length > 3 && (
                                        <p className="text-[#4d2c72] text-xs font-bold mt-1">
                                            + {todaysTodos.length - 3} more tasks
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="mt-6">
                            <PurpleButton
                                text={"Go to Calendar"}
                                onClick={() => navigate("/calendar")}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;