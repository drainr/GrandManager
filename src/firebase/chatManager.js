import {
    get,
    onValue,
    push,
    ref,
    set,
    serverTimestamp,
    query,
    orderByChild,
    limitToLast
} from 'firebase/database';
import { rtdb } from './firebase.js';

// Generate a consistent chat ID between two users
const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('_');
};

// Get reference to a chat's messages
const getChatMessagesRef = (chatId) => ref(rtdb, `chats/${chatId}/messages`);

// Save a user to the database
export const saveUser = async (uid, name, email) => {
    const userRef = ref(rtdb, `users/${uid}`);
    await set(userRef, {
        name: name || email,
        email,
        uid,
    });
};

// Fetch all users
export const getUsers = async () => {
    const usersRef = ref(rtdb, 'users');
    const snapshot = await get(usersRef);
    const users = [];

    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            users.push({
                uid: child.key,
                ...child.val(),
            });
        });
    }

    return users;
};

// Send a message
export const sendMessage = async (chatId, uid, senderName, content) => {
    const messagesRef = getChatMessagesRef(chatId);

    const baseMessage = {
        uid,
        senderName,
        createdAt: serverTimestamp(),
    };

    const message =
        typeof content === 'string'
            ? {
                ...baseMessage,
                type: 'text',
                text: content,
            }
            : {
                ...baseMessage,
                ...content,
            };

    await push(messagesRef, message);
};

// Listen to messages in real time
export const listenToMessages = (chatId, callback, messageLimit = 50) => {
    const messagesRef = getChatMessagesRef(chatId);
    const messagesQuery = query(
        messagesRef,
        orderByChild('createdAt'),
        limitToLast(messageLimit)
    );

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
        const messages = [];
        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                messages.push({
                    id: child.key,
                    ...child.val(),
                });
            });
        }
        callback(messages);
    });

    return unsubscribe;
};

export { getChatId };