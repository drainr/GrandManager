import { useState, useEffect } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { rtdb } from '../firebase/firebase';
import { getChatId, getUsers } from '../firebase/chatManager';

/**
 * useMessagePreviews - Listens for the latest message in each chat
 * the current user has with other registered users.
 * Each preview: { chatId, uid, name, lastMessage, createdAt }
 */
export const useMessagePreview = (currentUid) => {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUid) return;

    let unsubscribes = [];

    const fetchPreviews = async () => {
      const allUsers = await getUsers();
      const otherUsers = allUsers.filter((u) => u.uid !== currentUid);

      const previewMap = {};

      otherUsers.forEach((user) => {
        const chatId = getChatId(currentUid, user.uid);
        const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
        const lastMessageQuery = query(messagesRef, orderByChild('createdAt'), limitToLast(1));

        const unsubscribe = onValue(lastMessageQuery, (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((child) => {
              const msg = child.val();
              previewMap[chatId] = {
                chatId,
                uid: user.uid,
                name: user.name,
                lastMessage: msg.text,
                senderName: msg.senderName,
                senderId: msg.uid,
                createdAt: msg.createdAt,
              };
            });
          }

          // Convert map to sorted array (most recent first)
          const sorted = Object.values(previewMap).sort(
            (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
          );
          setPreviews(sorted);
          setLoading(false);
        });

        unsubscribes.push(unsubscribe);
      });

      // If no other users exist yet
      if (otherUsers.length === 0) {
        setLoading(false);
      }
    };

    fetchPreviews();

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [currentUid]);

  return { previews, loading };
};