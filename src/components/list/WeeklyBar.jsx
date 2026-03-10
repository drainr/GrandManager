import React from 'react';

const WeeklyBar = ({ weekDays, todayIndex, activeDay, onDayClick }) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day, index) => {
        const isToday = index === todayIndex;
        const isActive = activeDay === day;

        return (
          <button
            type="button"
            key={day}
            onClick={() => onDayClick(day)}
            className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl w-full rounded-md font-bold uppercase transition-colors ${
              isActive
                ? 'bg-success! border-success! text-white!'
                : isToday
                  ? 'btn-primary'
                  : 'bg-white! border-gray-300! text-success! hover:bg-success! hover:border-success! hover:text-white!'
            }`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

export default WeeklyBar;
