import { useState, useEffect, useRef } from 'react';
import { listenToMessages, sendMessage, getChatId } from '../firebase/chatManager';

/**
 * useChat - Manages real-time messaging between two users via the real time database.
 */
export const useChat = (currentUser, selectedUser) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  const chatId = selectedUser && currentUser
    ? getChatId(currentUser.uid, selectedUser.uid)
    : null;

  // Listen to messages in real time when a user is selected
  useEffect(() => {
    if (!currentUser || !selectedUser || !chatId) return;

    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser, selectedUser, chatId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a message and clear the input
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const senderName = currentUser.displayName || currentUser.email || 'User';
    await sendMessage(chatId, currentUser.uid, senderName, newMessage.trim());
    setNewMessage('');
  };

  return { messages, newMessage, setNewMessage, handleSend, bottomRef };
};