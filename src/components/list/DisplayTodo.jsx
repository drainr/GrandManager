import React, { useState } from 'react';
import WeeklyBar from './weeklybar.jsx';

const dayMenus = {
	Sun: ['placeholder', 'placeholder', 'placeholder'],
	Mon: ['placeholder', 'placeholder', 'placeholder'],
	Tue: ['placeholder', 'placeholder', 'placeholder'],
	Wed: ['placeholder', 'placeholder', 'placeholder'],
	Thu: ['placeholder', 'placeholder', 'placeholder'],
	Fri: ['placeholder', 'placeholder', 'placeholder'],
	Sat: ['placeholder', 'placeholder', 'placeholder'],
};

const DisplayTodo = () => {
    const [activeDay, setActiveDay] = useState(null);
    const [menuVersion, setMenuVersion] = useState(0);
    const fullWeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const weekDaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const displayedDay = activeDay ?? weekDaysShort[todayIndex];
    const menuItems = dayMenus[displayedDay] || [];


	const handleDayClick = (day) => {
		setActiveDay((prevDay) => (prevDay === day ? null : day));
		setMenuVersion((prev) => prev + 1);
	};


	const menuTitle = `${displayedDay}'S TO DO LIST`;


	return (
		<div className="mx-auto w-full max-w-5xl bg-[#1B2851] p-2 shadow-sm">
			<WeeklyBar
				weekDays={weekDaysShort}
				todayIndex={todayIndex}
				activeDay={activeDay}
				onDayClick={handleDayClick}
			/>

			<div className="mt-3 border border-gray-200 bg-white p-4 shadow-sm">
				<div
					key={menuVersion}
					className="space-y-3"
					style={{ animation: 'weeklyBarDrop 240ms ease-out' }}
				>
					<h3 className="text-left text-sm font-extrabold uppercase tracking-wide  bg-white! sm:text-base">{menuTitle}</h3>
					<ul className="menu menu-xl bg-white! w-56">
						{menuItems.map((item) => (
							<li key={item}>
								<a className="bg-white! hover:bg-white! active:bg-white! focus:bg-white!">{item}</a>
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

export default DisplayTodo;
