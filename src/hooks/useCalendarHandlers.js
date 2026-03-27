// src/hooks/useCalendarHandlers.js
import { useCallback } from 'react';

export function useCalendarHandlers({ user, dayMenus, setDayMenus, setItemTimes, setFocusDayShort, setTodoInput, setTodoTime, getTimeKey, DAY_KEY_TO_FULL, DAYS_SHORT, DAYS_FULL, addEntry, updateEntryTime, updateEntry, deleteEntry, getEntriesByDay }) {
  // Toggle selected day
  const handleToggleDay = useCallback((dayKey, selectedDays, setSelectedDays) => {
    setSelectedDays((prevSelected) =>
      prevSelected.includes(dayKey)
        ? prevSelected.filter((day) => day !== dayKey)
        : [...prevSelected, dayKey]
    );
  }, []);

  // Submit new todo
  const handleSubmitTodo = useCallback(async (todoInput, todoTime, selectedDays, dayMenus, setDayMenus, setItemTimes, setFocusDayShort, setTodoInput, setTodoTime, user) => {
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
  }, [DAY_KEY_TO_FULL, DAYS_FULL, DAYS_SHORT, addEntry, getTimeKey]);

  // Edit time
  const handleEditTime = useCallback(async (day, index, newTime, dayMenus, setItemTimes, user) => {
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
  }, [getTimeKey, updateEntryTime]);

  // Delete todo
  const handleDeleteTodo = useCallback(async (day, index, dayMenus, setDayMenus, setItemTimes, user) => {
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
  }, [getTimeKey, deleteEntry]);

  // Edit todo text
  const handleEditTodo = useCallback(async (day, index, newText, dayMenus, setDayMenus, user) => {
    const dayItems = dayMenus[day] || [];
    const oldText = dayItems[index];
    if (!oldText || !newText.trim() || oldText === newText) return;
    const matchIndex = dayItems.slice(0, index).filter((item) => item === oldText).length;
    setDayMenus((prevMenus) => {
      const updatedDayItems = [...(prevMenus[day] || [])];
      updatedDayItems[index] = newText;
      return { ...prevMenus, [day]: updatedDayItems };
    });
    try {
      if (!user) return;
      await updateEntry(user.uid, day, oldText, newText, matchIndex);
    } catch (error) {
      console.error('Failed to update todo entry:', error);
    }
  }, [getTimeKey, updateEntry]);

  return {
    handleToggleDay,
    handleSubmitTodo,
    handleEditTime,
    handleDeleteTodo,
    handleEditTodo,
  };
}
