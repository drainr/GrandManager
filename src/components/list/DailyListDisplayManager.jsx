import React, { useState } from 'react';
import WeeklyBar from './WeeklyBarConfig.jsx';
import RedButton from '../RedButton.jsx';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Tailwind class that controls how wide list items are 
const LIST_WIDTH = 'w-130';
const SCROLL_THRESHOLD = 6;


const DisplayDailyList = ({ dayMenus, onDeleteItem }) => {
    const [activeDay, setActiveDay]       = useState(null);
    const [menuVersion, setMenuVersion]   = useState(0);

	//day config
    const todayIndex      = new Date().getDay();
    const selectedShort   = activeDay ?? DAYS_SHORT[todayIndex];
    const selectedIndex   = DAYS_SHORT.indexOf(selectedShort);
    const selectedFull    = DAYS_FULL[selectedIndex];

    const menuItems    = dayMenus[selectedFull] || [];
    const shouldScroll = menuItems.length > SCROLL_THRESHOLD;
    const menuTitle    = `${selectedFull}'S TO DO LIST`;

	// handle selecting a day
    const handleDayClick = (day) => {
        setActiveDay((prev) => (prev === day ? null : day));
        setMenuVersion((prev) => prev + 1);
    };

    return (
        <div className="mx-auto w-full max-w-5xl bg-[#1B2851] p-2 shadow-sm">
            <WeeklyBar
                weekDays={DAYS_SHORT}
                todayIndex={todayIndex}
                activeDay={activeDay}
                onDayClick={handleDayClick}
            />

            <div
			// Content panel — scrollable once item is over 6
                className={`mt-3 border bg-[#405BA4] p-4 shadow-sm ${shouldScroll ? 'overflow-y-auto overflow-x-hidden' : ''}`}
                style={shouldScroll ? { maxHeight: '26rem' } : undefined}
            >
                <div

                    key={menuVersion}
                    className="space-y-3"
                    style={{ animation: 'weeklyBarDrop 240ms ease-out' }}
                >
                    <h3 className="text-left text-sm font-extrabold uppercase tracking-wide bg-[#405BA4] sm:text-base">
                        {menuTitle}
                    </h3>
					{/* item list display using daisyui */}
                    <ul className={`menu menu-xl bg-[#405BA4] ${LIST_WIDTH} columns-1 flex flex-col flex-nowrap`}>
                        {menuItems.map((item, index) => (
                            <li key={`${item}-${index}`} className="w-full">
                                <div className="flex w-full items-center justify-between gap-3">
                                    <a className="block flex-1 bg-[#405BA4] hover:bg-white! active:bg-white! focus:bg-white!">
                                        {item}
                                    </a>
									{/* delete item button */}
                                    <RedButton text="DELETE" onClick={() => onDeleteItem?.(selectedFull, index)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style>{`
                @keyframes weeklyBarDrop {
                    from { opacity: 0; transform: translateY(-12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default DisplayDailyList;