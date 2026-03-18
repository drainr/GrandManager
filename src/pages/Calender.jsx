import React, { useEffect, useState } from 'react';
import ListInput from '../components/list/ListInputButton.jsx';
import DisplayDailyList from '../components/list/DailyListDisplayManager.jsx';
import MultiSelectButton from '../components/list/multiSelectButton.jsx';
import Submit from '../components/list/ListInputsubmitButton.jsx';
import { addEntry, createEmptyWeekMenus, getEntriesByDay } from '../firebase/databaseManager.js';

const DEFAULT_LIST_ID = 'default';

const Calender = () => {
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

  return (
    <div className="min-h-screen p-4">
      <DisplayDailyList dayMenus={dayMenus} />

      <div className="mr-auto mt-4 flex w-full max-w-4xl flex-col gap-4 lg:flex-row lg:items-start">
        <ListInput value={todoInput} onChange={setTodoInput} />
        <div className="flex flex-col">
          <MultiSelectButton selectedDays={selectedDays} onToggleDay={handleToggleDay} />
          <Submit onClick={handleSubmitTodo} />
        </div>
      </div>
    </div>
  );
};

export default Calender;