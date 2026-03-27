import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Return from '../components/list/Return.jsx';
import ListButtonConfig from '../components/list/ListButtonConfig.jsx';
import DisplayDailyList from '../components/list/DailyListDisplayManager.jsx';
import MultiSelectButton from '../components/list/multiSelectButton.jsx';
import { useCalendarHandlers } from '../hooks/useCalendarHandlers.js';
import Send from '../components/list/send.jsx';
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
import Checkbox from "../components/Checkbox.jsx";
import GreenButton from "../components/GreenButton.jsx";



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

const Calendar = () => {
  const { user } = useAuth();
  const [todoInput, setTodoInput] = useState('');
  const [todoTime, setTodoTime] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayMenus, setDayMenus] = useState(createEmptyWeekMenus());
  const [itemTimes, setItemTimes] = useState({});
  const [focusDayShort, setFocusDayShort] = useState(null);

  const getTimeKey = (dayName, itemText, occurrenceIndex) => `${dayName}::${itemText}::${occurrenceIndex}`;

  const handlers = useCalendarHandlers({
    user,
    dayMenus,
    setDayMenus,
    setItemTimes,
    setFocusDayShort,
    setTodoInput,
    setTodoTime,
    getTimeKey,
    DAY_KEY_TO_FULL,
    DAYS_SHORT,
    DAYS_FULL,
    addEntry,
    updateEntryTime,
    updateEntry,
    deleteEntry,
    getEntriesByDay,
  });

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const loadSavedEntries = async () => {
      try {
        const { entriesByDay, timesByKey } = await getEntriesByDay(user.uid);
        if (isMounted) {
          setDayMenus(entriesByDay);
          setItemTimes(timesByKey);
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
    const navigate = useNavigate();


  return (
    <>
      <div className="mx-auto max-w-6xl bg-[#1B2851] mt-20 px-6 pb-6 pt-5 rounded-xl shadow-2xl shadow-black">
            <div className="relative flex items-center justify-center pb-6 pt-2">
                <div className="absolute left-0 scale-75 origin-left">
                    <GreenButton text="← Back" onClick={() => navigate('/')} />
                </div>

                <h2 className="text-2xl font-bold text-[#EBB537] shrikhand-regular">
                    Calendar
                </h2>

          <div className='absolute right-0 flex flex-col gap-2 items-end mt-10'>
            <Send />
              <div className='scale-65'>
            <Recieve /></div>
          </div>
        </div>
          <div className='mt-20'>
        <DisplayDailyList
          dayMenus={dayMenus}
          onDeleteItem={(day, index) => handlers.handleDeleteTodo(day, index, dayMenus, setDayMenus, setItemTimes, user)}
          onEditItem={(day, index, newText) => handlers.handleEditTodo(day, index, newText, dayMenus, setDayMenus, user)}
          onEditTime={(day, index, newTime) => handlers.handleEditTime(day, index, newTime, dayMenus, setItemTimes, user)}
          forcedDay={focusDayShort}
          itemTimes={itemTimes}
        /></div>
        <div className="mr-auto mt-4 flex w-full max-w-4xl flex-col gap-4 lg:flex-row lg:items-start">
            <div className='ml-10'>
                <ListButtonConfig
            value={todoInput}
            onChange={setTodoInput}
            onSubmit={() => handlers.handleSubmitTodo(todoInput, todoTime, selectedDays, dayMenus, setDayMenus, setItemTimes, setFocusDayShort, setTodoInput, setTodoTime, user)}
            timeValue={todoTime}
            onTimeChange={(event) => setTodoTime(event.target.value)}
          /></div>
          <div className="flex flex-col">
            <MultiSelectButton
              selectedDays={selectedDays}
              onToggleDay={(dayKey) => handlers.handleToggleDay(dayKey, selectedDays, setSelectedDays)}
            />
          </div>
        </div></div>
    </>
  );
};

export default Calendar;