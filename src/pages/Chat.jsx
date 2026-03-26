import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { listenToMessages, sendMessage, getChatId, getUsers } from '../firebase/chatManager';
import BlueButton from '../components/BlueButton';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const bottomRef = useRef(null);

  const chatId = selectedUser && currentUser ? getChatId(currentUser.uid, selectedUser.uid) : null;

  // Fetch all users on mount
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const allUsers = await getUsers();
      const otherUsers = allUsers.filter((u) => u.uid !== currentUser.uid);
      setUsers(otherUsers);
    };

    fetchUsers();
  }, [currentUser]);

  // Listen to messages when a user is selected
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser, selectedUser, chatId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const senderName = currentUser.displayName || currentUser.email || 'User';
    await sendMessage(chatId, currentUser.uid, senderName, newMessage.trim());
    setNewMessage('');
  };

  const handleSelectUser = (e) => {
    const uid = e.target.value;
    if (!uid) {
      setSelectedUser(null);
      setMessages([]);
      return;
    }
    const user = users.find((u) => u.uid === uid);
    setSelectedUser(user);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#405BA4] pt-14">
      {/* Chat Header */}
      <div className="bg-[#1B2851] p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/')}
            className="text-white text-sm hover:text-[#EBB537] transition-colors"
          >
            ← Dashboard
          </button>
          <h2 className="text-xl font-bold text-[#EBB537] shrikhand-regular">
            Chat
          </h2>
          <div className="w-20"></div>
        </div>
        {/* User Selection Dropdown */}
        <div className="max-w-xs mx-auto">
          <select
            className="select select-bordered w-full bg-[#405BA4] text-white border-gray-500 focus:border-[#EBB537] focus:outline-none"
            onChange={handleSelectUser}
            value={selectedUser?.uid || ''}
          >
            <option value="">Select someone to chat with...</option>
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {!selectedUser && (
          <p className="text-center text-gray-300 mt-10">
            Select a person above to start chatting.
          </p>
        )}

        {selectedUser && messages.length === 0 && (
          <p className="text-center text-gray-300 mt-10">
            No messages yet. Say hello to {selectedUser.name}!
          </p>
        )}

        {messages.map((msg) => {
          const isSent = msg.uid === currentUser.uid;
          return (
            <div
              key={msg.id}
              className={`chat ${isSent ? 'chat-end' : 'chat-start'}`}
            >
              <div className="chat-header text-gray-300 text-xs mb-1">
                {msg.senderName || 'Unknown'}
                {msg.createdAt && (
                  <time className="text-xs opacity-50 ml-2">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                )}
              </div>
              <div
                className={`chat-bubble ${
                  isSent
                    ? 'bg-[#4d2c72] text-white'
                    : 'bg-[#1B2851] text-white'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Message Input — only show when a user is selected */}
      {selectedUser && (
        <div className="bg-[#1B2851] p-4">
          <div className="flex gap-2 items-center max-w-3xl mx-auto">
            <input
              type="text"
              className="input input-bordered flex-1 bg-[#405BA4] text-white border-gray-500 placeholder-gray-400 focus:outline-none focus:border-[#EBB537]"
              placeholder={`Message ${selectedUser.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSend(e);
                }
              }}
            />
            <BlueButton text="Send" onClick={handleSend} small />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;