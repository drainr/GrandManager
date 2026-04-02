import React, { useEffect, useState } from 'react';
import WeeklyBar from './WeeklyBarConfig.jsx';
import RedButton from '../RedButton.jsx';
import Checkbox from "../Checkbox.jsx";

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Keep list rows constrained to container width so right-side labels stay visible.
const LIST_WIDTH = 'w-full';
const SCROLL_THRESHOLD = 6;

// Take stored HH:mm values and format for display (e.g., 8:00 PM).
const formatTime12Hour = (timeValue) => {
    const [hourStr = '', minuteStr = ''] = (timeValue || '').split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return '';
    }

    const normalizedHour = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${normalizedHour}:${String(minute).padStart(2, '0')} ${ampm}`;
};

// Determine whether a task should display as LATE for the currently viewed day.
const isTaskLate = (dayName, timeValue, nowMs) => {
    const [hourStr = '', minuteStr = ''] = (timeValue || '').split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isNaN(hour) || Number.isNaN(minute) || !DAYS_FULL.includes(dayName)) {
        return false;
    }

    const now = new Date(nowMs);
    const selectedDayIndex = DAYS_FULL.indexOf(dayName);
    const todayIndex = now.getDay();

    // Only consider a task late on its actual day.
    if (selectedDayIndex !== todayIndex) {
        return false;
    }

    // Compare at minute precision and only mark late after the set minute has passed.
    // Treat 00:00 as midnight tonight (end of day), not the start of today.
    const nowMinutes = (now.getHours() * 60) + now.getMinutes();
    const targetMinutes = (hour === 0 && minute === 0) ? 1440 : (hour * 60) + minute;
    return nowMinutes > targetMinutes;
};


const DisplayDailyList = ({ dayMenus, onDeleteItem, onEditItem, onEditTime, onToggleItemChecked, forcedDay, itemTimes, checkedByKey }) => {
        const [editIndex, setEditIndex] = useState(null);
        const [editValue, setEditValue] = useState("");
        const [editTimeKey, setEditTimeKey] = useState(null);
        const [editTimeValue, setEditTimeValue] = useState('');
        const [nowMs, setNowMs] = useState(() => Date.now());

        useEffect(() => {
            const timer = setInterval(() => {
                setNowMs(Date.now());
            }, 1000);

            return () => clearInterval(timer);
        }, []);

        // Inline task text editing handlers.
        // Start editing a task
        const handleEditStart = (index, value) => {
            setEditIndex(index);
            setEditValue(value);
        };

        // Inline task time editing handlers.
        const handleTimeEditStart = (itemKey, currentTime) => {
            setEditTimeKey(itemKey);
            setEditTimeValue(currentTime || '');
        };

        const handleTimeEditSave = (dayName, index, currentTime) => {
            const nextTime = editTimeValue || '';
            if (nextTime !== (currentTime || '')) {
                onEditTime?.(dayName, index, nextTime);
            }
            setEditTimeKey(null);
            setEditTimeValue('');
        };

        // Save edit (on blur or Enter)
        const handleEditSave = (dayName, index, oldValue) => {
            if (editValue.trim() && editValue !== oldValue) {
                onEditItem?.(dayName, index, editValue);
            }
            setEditIndex(null);
            setEditValue("");
        };

    // Active day and list metadata for the current panel.
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

    // Render selected day list with inline task and time editing.
    return (
        <div className="mx-auto w-full max-w-5xl bg-[#1B2851] p-2 shadow-md shadow-black">
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
                            // Build stable per-item keys, including duplicate task names.
                            const occurrenceIndex = getItemOccurrenceIndex(menuItems, index, item);
                            const itemKey = getItemKey(selectedFull, item, occurrenceIndex);
                            const itemTime = itemTimes?.[itemKey] || '';
                            const isChecked = Boolean(checkedByKey?.[itemKey]);
                            const showLate = itemTime ? isTaskLate(selectedFull, itemTime, nowMs) : false;

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
                                            // render checkbox and reflect checked state. styling for it too
                                        ) : (
                                            <div className="flex flex-row items-center gap-4 w-[400px]">
                                                <div className="flex-shrink-0 flex items-center justify-center -translate-y-[7px]">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onChange={(nextChecked) => onToggleItemChecked?.(selectedFull, index, nextChecked)}
                                                    />
                                                </div>

                                                <span
                                                    className={`block min-w-0 truncate rounded px-4 py-3 text-2xl leading-none transition-colors duration-150 cursor-pointer flex-1 ${isChecked ? 'bg-[#2f467e] text-white/60 line-through' : 'bg-[#405BA4] text-white hover:bg-white/10'}`}
                                                    onClick={() => handleEditStart(index, item)}
                                                >
        {item}
    </span>
                                            </div>
                                        )}
                                        <div className="min-w-44 whitespace-nowrap rounded-md px-3 py-2 text-center">
                                            {itemTime ? (
                                                <div className="rounded-md bg-white/15 px-2 py-1">
                                                    {editTimeKey === itemKey ? (
                                                        <input
                                                            type="time"
                                                            className="input time-edit-input bg-[#405BA4]! text-white! border-white/20 scheme-light"
                                                            value={editTimeValue}
                                                            autoFocus
                                                            onChange={(event) => setEditTimeValue(event.target.value)}
                                                            onBlur={() => handleTimeEditSave(selectedFull, index, itemTime)}
                                                            onKeyDown={(event) => {
                                                                if (event.key === 'Enter') {
                                                                    handleTimeEditSave(selectedFull, index, itemTime);
                                                                } else if (event.key === 'Escape') {
                                                                    setEditTimeKey(null);
                                                                    setEditTimeValue('');
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            role="button"
                                                            tabIndex={0}
                                                            className={`mt-1 cursor-pointer text-xs ${showLate ? 'font-extrabold text-red-300' : 'text-gray-200'}`}
                                                            onClick={() => handleTimeEditStart(itemKey, itemTime)}
                                                            onKeyDown={(event) => {
                                                                if (event.key === 'Enter' || event.key === ' ') {
                                                                    event.preventDefault();
                                                                    handleTimeEditStart(itemKey, itemTime);
                                                                }
                                                            }}
                                                        >
                                                            {showLate ? 'LATE' : `Time set: ${formatTime12Hour(itemTime)}`}
                                                        </span>
                                                    )}
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

                .time-edit-input::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    width: 0;
                    pointer-events: none;
                    transition: opacity 120ms ease;
                }

                .time-edit-input:focus::-webkit-calendar-picker-indicator,
                .time-edit-input:active::-webkit-calendar-picker-indicator {
                    opacity: 1;
                    width: auto;
                    pointer-events: auto;
                }
            `}</style>
        </div>
    );
};

export default DisplayDailyList;