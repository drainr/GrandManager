import React from 'react';
import YellowButton from "../YellowButton.jsx";
import PurpleButton from "../PurpleButton.jsx";
import RedButton from "../RedButton.jsx";
import GreenButton from "../GreenButton.jsx";

const WeeklyBar = ({ weekDays, todayIndex, activeDay, onDayClick }) => {
  return (
        <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
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
