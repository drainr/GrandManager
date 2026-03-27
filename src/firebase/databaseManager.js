import { update } from 'firebase/database';
// update item text
export const updateEntry = async (listId, day, oldText, newText, matchIndex = 0) => {
  const snapshot = await get(getEntriesRef(listId));
  if (!snapshot.exists()) return;
  const rawEntries = snapshot.val();
  const matchingKeys = Object.entries(rawEntries)
    .filter(([, entry]) => entry?.day === day && entry?.text === oldText)
    .map(([entryKey]) => entryKey);
  const targetKey = matchingKeys[matchIndex];
  if (!targetKey) return;
  await update(ref(rtdb, `lists/${listId}/entries/${targetKey}`), { text: newText });
};
import { get, push, ref, remove, serverTimestamp } from 'firebase/database';
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

// delete item
export const deleteEntry = async (listId, day, text, matchIndex = 0) => {
  const snapshot = await get(getEntriesRef(listId));

  if (!snapshot.exists()) {
    return;
  }

  const rawEntries = snapshot.val();
  const matchingKeys = Object.entries(rawEntries)
    .filter(([, entry]) => entry?.day === day && entry?.text === text)
    .map(([entryKey]) => entryKey);

  const targetKey = matchingKeys[matchIndex];

  if (!targetKey) {
    return;
  }

  await remove(ref(rtdb, `lists/${listId}/entries/${targetKey}`));
};
