import { get, push, ref, serverTimestamp } from 'firebase/database';
import { rtdb } from './firebase.js';

// default week data
const EMPTY_WEEK_MENUS = {
  Sunday: [],
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

// database path
const getEntriesRef = (listId) => ref(rtdb, `lists/${listId}/entries`);

// create empty week copy
export const createEmptyWeekMenus = () => {
  const weekMenusCopy = {};

  Object.entries(EMPTY_WEEK_MENUS).forEach(([day, items]) => {
    weekMenusCopy[day] = [...items];
  });

  return weekMenusCopy;
};

// stores data
export const addEntry = async (listId, day, text) => {
  await push(getEntriesRef(listId), {
    day,
    text,
    date: new Date().toISOString(),
    createdAt: serverTimestamp(),
  });
};

// retrieve data
export const getEntriesByDay = async (listId) => {
  const snapshot = await get(getEntriesRef(listId));
  const entriesByDay = createEmptyWeekMenus();

  //fallback if no data
  if (!snapshot.exists()) {
    return entriesByDay;
  }

  const rawEntries = snapshot.val();

  // group by day
  Object.values(rawEntries).forEach((entry) => {
    if (entry?.day && entry?.text && entriesByDay[entry.day]) {
      entriesByDay[entry.day].push(entry.text);
    }
  });

  return entriesByDay;
};
