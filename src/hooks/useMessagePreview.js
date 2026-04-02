import { useState, useEffect } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { rtdb } from '../firebase/firebase';
import { getChatId, getUsers } from '../firebase/chatManager';
import { getFamilyMembers } from '../firebase/familyManager';

/**
 * useMessagePreviews - Listens for the latest message in each chat
 * the current user has with other registered users.
 * Each preview: { chatId, uid, name, lastMessage, createdAt }
 */
export const useMessagePreview = (currentUid, familyCode) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    let unsubscribes = [];

    const fetchPreviews = async () => {
      // Get family member UIDs
      const memberUids = await getFamilyMembers(familyCode);

      // Get full user records and filter to family members only
      const allUsers = await getUsers();
      const familyUsers = allUsers.filter(
        (u) => u.uid !== currentUid && memberUids.includes(u.uid)
      );

      const previewMap = {};

      familyUsers.forEach((user) => {
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
        });

        unsubscribes.push(unsubscribe);
      });
    };

    fetchPreviews();

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [currentUid, familyCode]);

  return { previews };
};