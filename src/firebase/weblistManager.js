import { ref, onValue, set, off } from "firebase/database";
import { rtdb } from './firebase.js';

// Get reference to a user's specific bookmarks
const getBookmarksRef = (uid) => ref(rtdb, `users/${uid}/bookmarks`);

// Fetch/Listen to bookmarks in real time
export const listenToBookmarks = (uid, callback) => {
  if (!uid) return () => {}; // Guard for logged-out state
  
  const bookmarksRef = getBookmarksRef(uid);
  
  const unsubscribe = onValue(bookmarksRef, (snapshot) => {
    const data = snapshot.val();
    // Return empty array if no bookmarks exist yet
    callback(data || []);
  });

  return unsubscribe;
};

// Update/Save bookmarks
export const updateBookmarks = async (uid, bookmarks) => {
  if (!uid) return { success: false, error: "No UID provided" };
  
  try {
    const bookmarksRef = getBookmarksRef(uid);
    await set(bookmarksRef, bookmarks);
    return { success: true };
  } catch (error) {
    console.error("Error saving bookmarks:", error);
    return { success: false, error };
  }
};