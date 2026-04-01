// imports
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import GreenButton from '../components/GreenButton.jsx';
import { useNavigate } from 'react-router-dom';
import ListButtonConfig from '../components/list/ListButtonConfig.jsx';
import DisplayDailyList from '../components/list/DailyListDisplayManager.jsx';
import MultiSelectButton from '../components/list/MultiSelectButton.jsx';
import { useCalendarHandlers } from '../hooks/useCalendarHandlers.js';
import Send from '../components/list/send.jsx';
import Footer from "./Footer.jsx";
import Recieve from '../components/list/recieve.jsx';
// database to store/remove list items
import {
  addEntry,
  createEmptyWeekMenus,
  deleteEntry,
  getEntriesByDay,
  updateEntry,
  updateEntryTime,
} from '../firebase/TodoTaskManager.js';
import { updateEntryChecked } from '../firebase/checkmanager.js';


// mapping of days for display and storage
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_KEY_TO_FULL = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};
// calendar page displays
const Calendar = () => {
  const { user } = useAuth();
    const navigate = useNavigate();
  const [todoInput, setTodoInput] = useState('');
  const [todoTime, setTodoTime] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayMenus, setDayMenus] = useState(createEmptyWeekMenus());
  const [itemTimes, setItemTimes] = useState({});
  const [checkedByKey, setCheckedByKey] = useState({});
  const [focusDayShort, setFocusDayShort] = useState(null);
  
  const getTimeKey = (dayName, itemText, occurrenceIndex) => `${dayName}::${itemText}::${occurrenceIndex}`;

  const handlers = useCalendarHandlers({
    user,
    dayMenus,
    setDayMenus,
    setItemTimes,
    setCheckedByKey,
    setFocusDayShort,
    setTodoInput,
    setTodoTime,
    getTimeKey,
    DAY_KEY_TO_FULL,
    DAYS_SHORT,
    DAYS_FULL,
    addEntry,
    updateEntryTime,
    updateEntryChecked,
    updateEntry,
    deleteEntry,
    getEntriesByDay,
  });

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const loadSavedEntries = async () => {
      try {
        const { entriesByDay, timesByKey, checkedByKey } = await getEntriesByDay(user.uid);
        if (isMounted) {
          setDayMenus(entriesByDay);
          setItemTimes(timesByKey);
          setCheckedByKey(checkedByKey);
        }
      } catch (error) {
        console.error('Failed to load saved todo entries:', error);
      }
    };
    loadSavedEntries();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // styling for calendar page and header row with buttons
  // content such as list, buttons, and status messages that are displayed on the calendar page
  return (
      <>
          <div className='flex flex-row juatify-center'>
              <div className="mx-auto max-w-10xl bg-[#1B2851] mt-25 px-6 p-6 rounded-xl shadow-2xl shadow-black scale-90">
                  <div className="relative flex items-center justify-center pb-10 pt-2">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 scale-75 origin-left">
                          <GreenButton text="← Back" onClick={() => navigate('/')} />
                      </div>

                      <h2 className="text-2xl font-bold text-[#EBB537] shrikhand-regular">
                          Calendar
                      </h2>

                  </div>

                  <div className='mt-5'>
                      <DisplayDailyList
                          dayMenus={dayMenus}
                          onDeleteItem={(day, index) => handlers.handleDeleteTodo(day, index, dayMenus, setDayMenus, setItemTimes, user)}
                          onEditItem={(day, index, newText) => handlers.handleEditTodo(day, index, newText, dayMenus, setDayMenus, user)}
                          onEditTime={(day, index, newTime) => handlers.handleEditTime(day, index, newTime, dayMenus, setItemTimes, user)}
                            onToggleItemChecked={(day, index, nextChecked) => handlers.handleToggleTodoChecked(day, index, nextChecked, dayMenus, setCheckedByKey, user)}
                          forcedDay={focusDayShort}
                          itemTimes={itemTimes}
                            checkedByKey={checkedByKey}
                      /></div>
                  <div className="mr-auto mt-4 flex w-full max-w-4xl flex-col gap-4 lg:flex-row lg:items-start">
                      <ListButtonConfig
                          value={todoInput}
                          onChange={setTodoInput}
                          onSubmit={() => handlers.handleSubmitTodo(todoInput, todoTime, selectedDays, dayMenus, setDayMenus, setItemTimes, setFocusDayShort, setTodoInput, setTodoTime, user)}
                          timeValue={todoTime}
                          onTimeChange={(event) => setTodoTime(event.target.value)}
                      />
                      <div className="flex flex-col">
                          <MultiSelectButton
                              selectedDays={selectedDays}
                              onToggleDay={(dayKey) => handlers.handleToggleDay(dayKey, selectedDays, setSelectedDays)}
                          />
                      </div>
                  </div>

              </div>
              <div className='absolute top-1/2 bg-[#1B2851] p-5 rounded-xl -translate-y-1/2 flex flex-col gap-1 items-end scale-90 origin-right shadow-2xl right-5 shadow-black'>
                  <Send />
                  <Recieve />
              </div>
          </div>
          <Footer />
      </>
  );
};

export default Calendar;