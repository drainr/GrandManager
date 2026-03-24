import React from 'react';
import YellowButton from "../YellowButton.jsx";
import PurpleButton from "../PurpleButton.jsx";

// weekly bar at top
const WeeklyBar = ({ weekDays, onDayClick }) => {
  return (
        <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, activeDay) => {
                const isSelected = activeDay === day;
                const ButtonComponent = isSelected ? YellowButton : PurpleButton;
                return (
                <div key={day} className="flex justify-center">
                    <ButtonComponent text={day} onClick={() => onDayClick(day)} />
                </div>);
})}
        </div>
    );
};

export default WeeklyBar;
