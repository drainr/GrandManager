import { get, ref, update } from 'firebase/database';
import { rtdb } from './firebase.js';

// Helper to get the reference to the entries for a list
const getEntriesRef = (listId) => ref(rtdb, `lists/${listId}/entries`);

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
