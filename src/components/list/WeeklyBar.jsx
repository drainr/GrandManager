import React from 'react';
import YellowButton from "../YellowButton.jsx";
import PurpleButton from "../PurpleButton.jsx";

const WeeklyBar = ({ weekDays, todayIndex, activeDay, onDayClick }) => {
  return (
        <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
                <div key={day} className="flex justify-center">
                    <PurpleButton text={day} onClick={() => onDayClick(day)} />
                </div>
            ))}
        </div>
    );
};

export default WeeklyBar;
