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

const Calendar = () => {
  const [todoInput, setTodoInput] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayMenus, setDayMenus] = useState(createEmptyWeekMenus());

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

    if (!trimmedTodo || selectedDays.length === 0) {
      return;
    }

    setDayMenus((prevMenus) => {
      const updatedMenus = { ...prevMenus };

      selectedDays.forEach((day) => {
        updatedMenus[day] = [...(updatedMenus[day] || []), trimmedTodo];
      });

      return updatedMenus;
    });

    setTodoInput('');

    try {
      await Promise.all(
        selectedDays.map((day) => addEntry(DEFAULT_LIST_ID, day, trimmedTodo))
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
    <div className="min-h-screen p-4">
      <DisplayDailyList dayMenus={dayMenus} onDeleteItem={handleDeleteTodo} />

      <div className="mr-auto mt-4 flex w-full max-w-4xl flex-col gap-4 lg:flex-row lg:items-start">
        <ListButtonConfig value={todoInput} onChange={setTodoInput} onSubmit={handleSubmitTodo} />
        <div className="flex flex-col">
          <MultiSelectButton selectedDays={selectedDays} onToggleDay={handleToggleDay} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;