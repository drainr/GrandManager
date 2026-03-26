import React from 'react';
import GreenButton from "../GreenButton.jsx";
import PurpleButton from "../PurpleButton.jsx";

// weekly bar at top
const WeeklyBar = ({ weekDays,activeDay,todayIndex, onDayClick }) => {
  return (
        <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
                const isSelected =activeDay === day || (activeDay === null && index === todayIndex);
                const ButtonComponent = isSelected ? GreenButton : PurpleButton;
                return (
                <div key={day} className="flex justify-center">
                    <ButtonComponent text={day} onClick={() => onDayClick(day)} />
                </div>);
})}
        </div>
    );
};

export default WeeklyBar;
