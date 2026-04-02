import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Added this
import { getEntriesByDay } from "../firebase/TodoTaskManager";
import { updateEntryChecked } from "../firebase/checkmanager.js";
import "/src/App.css";
import GreenButton from "../components/GreenButton.jsx";
import PurpleButton from "../components/PurpleButton.jsx";
import Checkbox from "../components/Checkbox.jsx";
import Weblist from "../components/weblist/Weblist.jsx";
import { useMessagePreview } from "../hooks/useMessagePreview.js";
import { useFamily } from "../hooks/useFamily.js";
import Footer from "./Footer.jsx";
import WeatherCard from "../components/weather/WeatherCard.jsx";
import BlueButton from "../components/BlueButton.jsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const auth = getAuth(); // Initialize auth
    const currentUser = auth.currentUser;

    const [dayMenu, setDayMenus] = useState({});
    const [todaysTodos, setTodaysTodos] = useState([]);
    const [checkedByKey, setCheckedByKey] = useState({});
    const DAYS_FULL = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const DEFAULT_LIST_ID = currentUser?.uid || "default";
    const todayIndex = new Date().getDay();
    const todayFull = DAYS_FULL[todayIndex];

    const { familyCode } = useFamily(currentUser?.uid);
    const { previews } = useMessagePreview(currentUser?.uid, familyCode);

    const getItemOccurrenceIndex = (items, index, itemText) =>
        items.slice(0, index).filter((entry) => entry === itemText).length;

    const getItemKey = (dayName, itemText, occurrenceIndex) =>
        `${dayName}::${itemText}::${occurrenceIndex}`;

    const handleToggleTodoChecked = async (day, index, checked) => {
        const dayItems = dayMenu[day] || [];
        const itemText = dayItems[index];
        if (!itemText || !currentUser) return;

        const matchIndex = dayItems
            .slice(0, index)
            .filter((item) => item === itemText).length;
        const key = getItemKey(day, itemText, matchIndex);

        setCheckedByKey((prev) => ({
            ...prev,
            [key]: checked,
        }));

        await updateEntryChecked(
            currentUser.uid,
            day,
            itemText,
            checked,
            matchIndex,
        );
    };

    useEffect(() => {
        const loadTodos = async () => {
            const { entriesByDay, checkedByKey: loadedCheckedByKey } =
                await getEntriesByDay(DEFAULT_LIST_ID);
            setDayMenus(entriesByDay);
            setCheckedByKey(loadedCheckedByKey);
            setTodaysTodos(entriesByDay[todayFull] || []);
        };
        loadTodos();
    }, [todayFull]);


    const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const [suggestions, setSuggestions] = useState([]);
    const [loc1, setLoc1] = useState("Sarasota");
    const [loc2, setLoc2] = useState("Thousand Oaks, CA");
    const handleSearch = async (query) => {

        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        const response = await fetch(
            `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${query}`
        );
        const data = await response.json();
        setSuggestions(data); // Returns an array of objects: { name, region, country }
    };


    return (
        <>
            <div className="dashboard-container flex flex-col align-top min-h-screen w-screen">
                <div className="dashboard-top-section flex flex-row items-start justify-center mt-20 p-10 gap-8">
                    <div className="weblist-container w-100">
                        <Weblist />
                    </div>

                    <div className=" weather-container flex flex-col gap-4">
                        <WeatherCard
                            location={loc1}
                            onLocationChange={(newLoc) => setLoc1(newLoc)}
                        />
                        <WeatherCard
                            location={loc2}
                            onLocationChange={(newLoc) => setLoc2(newLoc)}
                        />
                    </div>
                </div>

                <div className="dashboard-bottom-section flex flex-row gap-10 justify-center p-10">
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

                        <BlueButton text={"Go to Chat"} onClick={() => navigate("/chat")} />
                    </div>

                    <div className="bg-[#EBB537] p-6 rounded-xl w-80 shadow-2xl shadow-black border border-[#4d2c72]">
                        <h1 className="shrikhand-regular text-[#4d2c72] text-xl mb-2">
                            Today's To-Dos!
                        </h1>
                        <p className="text-[#1B2851] text-md shrikhand-regular mb-4 underline decoration-[#4d2c72]">
                            {todayFull}
                        </p>

                        <div className="min-h-30">
                            {todaysTodos.length === 0 ? (
                                <p className="text-red-900 font-bold">No tasks today</p>
                            ) : (
                                <>
                                    {todaysTodos.slice(0, 3).map((todo, i) => {
                                        const occurrenceIndex = getItemOccurrenceIndex(
                                            todaysTodos,
                                            i,
                                            todo,
                                        );
                                        const itemKey = getItemKey(
                                            todayFull,
                                            todo,
                                            occurrenceIndex,
                                        );
                                        const isChecked = Boolean(checkedByKey?.[itemKey]);

                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-2 h-min"
                                            >
                                                <div className="shrink-0 flex items-center">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onChange={(nextChecked) =>
                                                            handleToggleTodoChecked(todayFull, i, nextChecked)
                                                        }
                                                    />
                                                </div>
                                                <p
                                                    className={`font-medium leading-none mt-3 p-0 flex items-center ${isChecked ? "line-through text-[#1B2851]/60" : "text-[#1B2851]"}`}
                                                >
                                                    {todo}
                                                </p>
                                            </div>
                                        );
                                    })}
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