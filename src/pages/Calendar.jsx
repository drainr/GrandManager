import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Return from '../components/list/Return.jsx';
import Export from '../components/list/export.jsx';
import ListButtonConfig from '../components/list/ListButtonConfig.jsx';
import DisplayDailyList from '../components/list/DailyListDisplayManager.jsx';
import MultiSelectButton from '../components/list/multiSelectButton.jsx';
import { useCalendarHandlers } from '../hooks/useCalendarHandlers.js';

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


  return (
    <div className="mx-auto max-w-6xl bg-[#1B2851] px-6 pb-6 pt-24 shadow-2xl">
      {/* Return and Export buttons */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginRight: 'auto' }}>
          <Return />
          <Export />
        </div>
      </div>
      <DisplayDailyList
        dayMenus={dayMenus}
        onDeleteItem={(day, index) => handlers.handleDeleteTodo(day, index, dayMenus, setDayMenus, setItemTimes, user)}
        onEditItem={(day, index, newText) => handlers.handleEditTodo(day, index, newText, dayMenus, setDayMenus, user)}
        onEditTime={(day, index, newTime) => handlers.handleEditTime(day, index, newTime, dayMenus, setItemTimes, user)}
        forcedDay={focusDayShort}
        itemTimes={itemTimes}
      />

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
  );
};

export default Calendar;