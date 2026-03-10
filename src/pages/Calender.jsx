import React from 'react';

const Calender = () => {
  // get the day from local pc/ local time
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-2 shadow-sm">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const isToday = index === todayIndex;

            return (
              <button
                type="button"
                key={day}
                className={`btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl w-full rounded-md font-semibold transition-colors ${
                  isToday
                    ? 'btn-primary'
                    : 'bg-white! border-gray-300! text-success! hover:bg-success! hover:border-success! hover:text-white!'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calender;