import React, { useState } from 'react';
import WeeklyBar from './weeklybar.jsx';

const dayMenus = {
	Sunday: ['placeholder', 'placeholder', 'placeholder'],
	Monday: ['placeholder', 'placeholder', 'placeholder'],
	Tuesday: ['placeholder', 'placeholder', 'placeholder'],
	Wednesday: ['placeholder', 'placeholder', 'placeholder'],
	Thursday: ['placeholder', 'placeholder', 'placeholder'],
	Friday: ['placeholder', 'placeholder', 'placeholder'],
	Saturday: ['placeholder', 'placeholder', 'placeholder'],
};

const DisplayTodo = () => {
	const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const todayIndex = new Date().getDay();
	const [activeDay, setActiveDay] = useState(null);
	const [menuVersion, setMenuVersion] = useState(0);

	const handleDayClick = (day) => {
		setActiveDay((prevDay) => (prevDay === day ? null : day));
		setMenuVersion((prev) => prev + 1);
	};

	const defaultDay = weekDays[todayIndex];
	const displayedDay = activeDay ?? defaultDay;
	const menuTitle = `${displayedDay}'S TO DO LIST`;
	const menuItems = dayMenus[displayedDay];

	return (
		<div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-2 shadow-sm">
			<WeeklyBar
				weekDays={weekDays}
				todayIndex={todayIndex}
				activeDay={activeDay}
				onDayClick={handleDayClick}
			/>

			<div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
				<div
					key={menuVersion}
					className="space-y-3"
					style={{ animation: 'weeklyBarDrop 240ms ease-out' }}
				>
					<h3 className="text-left text-sm font-extrabold uppercase tracking-wide  bg-white! sm:text-base">{menuTitle}</h3>
					<ul className="menu menu-xl bg-white! rounded-box w-56">
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
