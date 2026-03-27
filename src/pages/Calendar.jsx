import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import ListButtonConfig from '../components/list/ListButtonConfig.jsx';
import DisplayDailyList from '../components/list/DailyListDisplayManager.jsx';
import MultiSelectButton from '../components/list/multiSelectButton.jsx';

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

  const handleToggleDay = (dayKey) => {
    setSelectedDays((prevSelected) =>
      prevSelected.includes(dayKey)
        ? prevSelected.filter((day) => day !== dayKey)
        : [...prevSelected, dayKey]
    );
  };

  const handleSubmitTodo = async () => {
    const trimmedTodo = todoInput.trim();
    const selectedFullDays = selectedDays
      .map((dayKey) => DAY_KEY_TO_FULL[dayKey])
      .filter(Boolean);
    const fallbackTodayShort = DAYS_SHORT[new Date().getDay()];
    const fallbackTodayDay = DAYS_FULL[new Date().getDay()];
    const targetDays = selectedFullDays.length > 0 ? selectedFullDays : [fallbackTodayDay];
    const targetFocusDay = selectedDays[0] || fallbackTodayShort;

    if (!trimmedTodo) {
      return;
    }

    const updatedMenus = { ...dayMenus };
    const newTimedEntries = [];

    targetDays.forEach((day) => {
      const dayItems = updatedMenus[day] || [];
      const occurrenceIndex = dayItems.filter((entry) => entry === trimmedTodo).length;
      updatedMenus[day] = [...dayItems, trimmedTodo];
      newTimedEntries.push({
        key: getTimeKey(day, trimmedTodo, occurrenceIndex),
        value: todoTime,
      });
    });

    setDayMenus(updatedMenus);

    if (newTimedEntries.length > 0) {
      setItemTimes((prev) => {
        const next = { ...prev };

        newTimedEntries.forEach(({ key, value }) => {
          next[key] = value;
        });

        return next;
      });
    }

    setFocusDayShort(targetFocusDay);
    setTodoInput('');
    setTodoTime('');

    try {
      if (!user) return;
      await Promise.all(
        targetDays.map((day) => addEntry(user.uid, day, trimmedTodo, todoTime))
      );
    } catch (error) {
      console.error('Failed to save todo entry:', error);
    }
  };

  // Handler for editing time and saving to DB
  const handleEditTime = async (day, index, newTime) => {
    const dayItems = dayMenus[day] || [];
    const itemText = dayItems[index];
    if (!itemText || !user) return;
    const matchIndex = dayItems.slice(0, index).filter((item) => item === itemText).length;
    setItemTimes((prev) => {
      const key = getTimeKey(day, itemText, matchIndex);
      return { ...prev, [key]: newTime };
    });
    try {
      await updateEntryTime(user.uid, day, itemText, newTime, matchIndex);
    } catch (error) {
      console.error('Failed to update time:', error);
    }
  };

  const handleDeleteTodo = async (day, index) => {
    const dayItems = dayMenus[day] || [];
    const itemToDelete = dayItems[index];

    if (!itemToDelete) {
      return;
    }

    const sameTextBeforeIndex = dayItems
      .slice(0, index)
      .filter((item) => item === itemToDelete).length;

    setItemTimes((prev) => {
      const next = { ...prev };
      const deletedKey = getTimeKey(day, itemToDelete, sameTextBeforeIndex);
      delete next[deletedKey];

      let shiftIndex = sameTextBeforeIndex + 1;
      while (Object.prototype.hasOwnProperty.call(next, getTimeKey(day, itemToDelete, shiftIndex))) {
        next[getTimeKey(day, itemToDelete, shiftIndex - 1)] = next[getTimeKey(day, itemToDelete, shiftIndex)];
        delete next[getTimeKey(day, itemToDelete, shiftIndex)];
        shiftIndex += 1;
      }

      return next;
    });

    setDayMenus((prevMenus) => {
      const updatedDayItems = (prevMenus[day] || []).filter((_, itemIndex) => itemIndex !== index);

      return {
        ...prevMenus,
        [day]: updatedDayItems,
      };
    });

    try {
      if (!user) return;
      await deleteEntry(user.uid, day, itemToDelete, sameTextBeforeIndex);
    } catch (error) {
      console.error('Failed to delete todo entry:', error);
    }
  };

  // Edit handler for tasks
  const handleEditTodo = async (day, index, newText) => {
    const dayItems = dayMenus[day] || [];
    const oldText = dayItems[index];
    if (!oldText || !newText.trim() || oldText === newText) return;
    // Find which occurrence of the text this is
    const matchIndex = dayItems.slice(0, index).filter((item) => item === oldText).length;
    // Update local state
    setDayMenus((prevMenus) => {
      const updatedDayItems = [...(prevMenus[day] || [])];
      updatedDayItems[index] = newText;
      return { ...prevMenus, [day]: updatedDayItems };
    });
    // Update in database
    try {
      if (!user) return;
      await updateEntry(user.uid, day, oldText, newText, matchIndex);
    } catch (error) {
      console.error('Failed to update todo entry:', error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl bg-[#1B2851] px-6 pb-6 pt-24 shadow-2xl">
      <DisplayDailyList dayMenus={dayMenus} onDeleteItem={handleDeleteTodo} onEditItem={handleEditTodo} onEditTime={handleEditTime} forcedDay={focusDayShort} itemTimes={itemTimes} />

      <div className="mr-auto mt-4 flex w-full max-w-4xl flex-col gap-4 lg:flex-row lg:items-start">
        <ListButtonConfig
          value={todoInput}
          onChange={setTodoInput}
          onSubmit={handleSubmitTodo}
          timeValue={todoTime}
          onTimeChange={(event) => setTodoTime(event.target.value)}
        />
        <div className="flex flex-col">
          <MultiSelectButton selectedDays={selectedDays} onToggleDay={handleToggleDay} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;