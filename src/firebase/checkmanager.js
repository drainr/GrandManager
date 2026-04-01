import { get, ref, update } from 'firebase/database';
import { rtdb } from './firebase.js';

const getEntriesRef = (listId) => ref(rtdb, `lists/${listId}/entries`);

// Find the specific duplicate task instance by day/text and occurrence index.
const findMatchingEntryKey = (rawEntries, day, text, matchIndex = 0) => {
  const matchingKeys = Object.entries(rawEntries)
    .filter(([, entry]) => entry?.day === day && entry?.text === text)
    .map(([entryKey]) => entryKey);

  return matchingKeys[matchIndex];
};

export const updateEntryChecked = async (listId, day, text, checked, matchIndex = 0) => {
  // Load current entries so we can resolve the exact record key to update.
  const snapshot = await get(getEntriesRef(listId));
  if (!snapshot.exists()) return;

  const rawEntries = snapshot.val();
  const targetKey = findMatchingEntryKey(rawEntries, day, text, matchIndex);
  if (!targetKey) return;

  // Persist checked/unchecked state for the matched todo entry.
  await update(ref(rtdb, `lists/${listId}/entries/${targetKey}`), { checked });
};