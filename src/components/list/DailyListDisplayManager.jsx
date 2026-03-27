import React, { useState } from 'react';
import WeeklyBar from './WeeklyBarConfig.jsx';
import RedButton from '../RedButton.jsx';
import SetTime from './settime.jsx';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Keep list rows constrained to container width so right-side labels stay visible.
const LIST_WIDTH = 'w-full';
const SCROLL_THRESHOLD = 6;


const DisplayDailyList = ({ dayMenus, onDeleteItem, onEditItem, forcedDay, itemTimes }) => {
        const [editIndex, setEditIndex] = useState(null);
        const [editValue, setEditValue] = useState("");
        // Start editing a task
        const handleEditStart = (index, value) => {
            setEditIndex(index);
            setEditValue(value);
        };

        // Save edit (on blur or Enter)
        const handleEditSave = (dayName, index, oldValue) => {
            if (editValue.trim() && editValue !== oldValue) {
                onEditItem?.(dayName, index, editValue);
            }
            setEditIndex(null);
            setEditValue("");
        };
    const [activeDay, setActiveDay]       = useState(null);
    const [menuVersion, setMenuVersion]   = useState(0);
    const effectiveActiveDay = activeDay ?? forcedDay;

	//day config
    const todayIndex      = new Date().getDay();
    const selectedShort   = effectiveActiveDay ?? DAYS_SHORT[todayIndex];
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

    const handleDeleteClick = (dayName, index) => {
        const shouldDelete = window.confirm('Are you sure you want to delete?');
        if (!shouldDelete) return;
        onDeleteItem?.(dayName, index);
    };

    const getItemOccurrenceIndex = (items, index, itemText) =>
        items.slice(0, index).filter((entry) => entry === itemText).length;

    const getItemKey = (dayName, itemText, occurrenceIndex) => `${dayName}::${itemText}::${occurrenceIndex}`;

    return (
        <div className="mx-auto w-full max-w-5xl bg-[#1B2851] p-2 shadow-sm">
            <WeeklyBar
                weekDays={DAYS_SHORT}
                todayIndex={todayIndex}
                activeDay={effectiveActiveDay}
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
                    <ul className={`bg-[#405BA4] ${LIST_WIDTH} columns-1 flex flex-col flex-nowrap gap-2`}>
                        {menuItems.map((item, index) => {
                            const occurrenceIndex = getItemOccurrenceIndex(menuItems, index, item);
                            const itemKey = getItemKey(selectedFull, item, occurrenceIndex);
                            const itemTime = itemTimes?.[itemKey] || '';

                            return (
                                <li key={`${item}-${index}`} className="w-full">
                                    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
                                        {editIndex === index ? (
                                            <input
                                                className="block min-w-0 rounded bg-[#405BA4] px-4 py-3 text-white text-2xl w-full focus:bg-white/10 outline-none"
                                                value={editValue}
                                                autoFocus
                                                onChange={e => setEditValue(e.target.value)}
                                                onBlur={() => handleEditSave(selectedFull, index, item)}
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") {
                                                        handleEditSave(selectedFull, index, item);
                                                    } else if (e.key === "Escape") {
                                                        setEditIndex(null);
                                                        setEditValue("");
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span
                                                className="block min-w-0 truncate rounded bg-[#405BA4] px-4 py-3 text-white text-2xl transition-colors duration-150 hover:bg-white/10 cursor-pointer"
                                                onClick={() => handleEditStart(index, item)}
                                            >
                                                {item}
                                            </span>
                                        )}
                                        <div className="min-w-44 whitespace-nowrap rounded-md px-3 py-2 text-center">
                                            {itemTime ? (
                                                <div className="rounded-md bg-white/15 px-2 py-1">
                                                    <SetTime value={itemTime} showInput={false} dayName={selectedFull} />
                                                </div>
                                            ) : null}
                                        </div>
										{/* delete item button */}
                                        <RedButton text="DELETE" onClick={() => handleDeleteClick(selectedFull, index)} />
                                    </div>
                                </li>
                            );
                        })}
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