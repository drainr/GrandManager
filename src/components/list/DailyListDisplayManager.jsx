import React, { useState } from 'react';
import WeeklyBar from './WeeklyBarConfig.jsx';

// This component shows the todo list for one day at a time.
// You can click day buttons to switch which day's todos are shown.
const DisplayDailyList = ({ dayMenus }) => {
    // If user clicks a day, store it here. If null, we use today's day.
    const [activeDay, setActiveDay] = useState(null);
	// Used to replay a small animation each time day changes.
    const [menuVersion, setMenuVersion] = useState(0);

	// Short labels for buttons and full names for data keys.
	const weekDaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const fullWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const todayIndex = new Date().getDay();
	const selectedShortDay = activeDay ?? weekDaysShort[todayIndex];
	const selectedDayIndex = weekDaysShort.indexOf(selectedShortDay);
	const selectedFullDay = fullWeekDays[selectedDayIndex];

	// Todos for the currently selected day.
	const menuItems = dayMenus[selectedFullDay] || [];
	const shouldScroll = menuItems.length > 10;


	// Click a day: select it. Click it again: go back to today's day.
	const handleDayClick = (day) => {
		setActiveDay((prevDay) => (prevDay === day ? null : day));
		setMenuVersion((prev) => prev + 1);
	};

	// Header text above the todo list.
	const menuTitle = `${selectedFullDay}'S TO DO LIST`;


	return (
		<div className="mx-auto w-full max-w-5xl bg-[#1B2851] p-2 shadow-sm">
			{/* Top weekly day selector bar */}
			<WeeklyBar
				weekDays={weekDaysShort}
				todayIndex={todayIndex}
				activeDay={activeDay}
				onDayClick={handleDayClick}
			/>

			{/* Scrollable content panel; vertical scroll appears once list length exceeds threshold */}
			<div
				className={`mt-3 border bg-[#405BA4] p-4 shadow-sm ${shouldScroll ? 'overflow-y-auto overflow-x-hidden' : ''}`}
				style={shouldScroll ? { maxHeight: '26rem' } : undefined}
			>
				<div
					key={menuVersion}
					className="space-y-3 "
					style={{ animation: 'weeklyBarDrop 240ms ease-out' }}
				>
					<h3 className="text-left text-sm font-extrabold uppercase tracking-wide  bg-[#405BA4] sm:text-base">{menuTitle}</h3>
					<ul
						className="menu menu-xl bg-[#405BA4] w-56 columns-1 flex flex-col flex-nowrap"
					>
						{menuItems.map((item, index) => (
							<li key={`${item}-${index}`}>
								<a className="bg-[#405BA4] hover:bg-white! active:bg-white! focus:bg-white!">{item}</a>
							</li>
						))}
					</ul>
				</div>
			</div>

			<style>
				{`@keyframes weeklyBarDrop {
					from {
						opacity: 0;
						transform: translateY(-12px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}`}
			</style>
		</div>
	);
};

export default DisplayDailyList;
