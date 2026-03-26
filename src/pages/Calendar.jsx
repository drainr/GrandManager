import React, { useEffect, useState } from 'react';
import ListButtonConfig from '../components/list/ListButtonConfig.jsx';
import DisplayDailyList from '../components/list/DailyListDisplayManager.jsx';
import MultiSelectButton from '../components/list/multiSelectButton.jsx';

// database to store/remove list items
import {
  addEntry,
  createEmptyWeekMenus,
  deleteEntry,
  getEntriesByDay,
} from '../firebase/databaseManager.js';

const DEFAULT_LIST_ID = 'default';
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
  const [todoInput, setTodoInput] = useState('');
  const [todoTime, setTodoTime] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayMenus, setDayMenus] = useState(createEmptyWeekMenus());
  const [itemTimes, setItemTimes] = useState({});
  const [focusDayShort, setFocusDayShort] = useState(null);

  const getTimeKey = (dayName, itemText, occurrenceIndex) => `${dayName}::${itemText}::${occurrenceIndex}`;

  useEffect(() => {
    let isMounted = true;

    const loadSavedEntries = async () => {
      try {
        const savedMenus = await getEntriesByDay(DEFAULT_LIST_ID);
        if (isMounted) {
          setDayMenus(savedMenus);
        }
      } catch (error) {
        console.error('Failed to load saved todo entries:', error);
      }
    };

    loadSavedEntries();

    return () => {
      isMounted = false;
    };
  }, []);

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

      if (todoTime) {
        newTimedEntries.push({
          key: getTimeKey(day, trimmedTodo, occurrenceIndex),
          value: todoTime,
        });
      }
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
      await Promise.all(
        targetDays.map((day) => addEntry(DEFAULT_LIST_ID, day, trimmedTodo))
      );
    } catch (error) {
      console.error('Failed to save todo entry:', error);
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
      await deleteEntry(DEFAULT_LIST_ID, day, itemToDelete, sameTextBeforeIndex);
    } catch (error) {
      console.error('Failed to delete todo entry:', error);
    }
  };

  return (
    <div className="p-6 bg-[#1B2851] shadow-2xl max-w-6xl mx-auto">
      <DisplayDailyList dayMenus={dayMenus} onDeleteItem={handleDeleteTodo} forcedDay={focusDayShort} itemTimes={itemTimes} />

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