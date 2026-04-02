import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import { useChat } from "../hooks/useChat";
import { useFamily } from "../hooks/useFamily";
import YellowButton from "../components/YellowButton";
import GreenButton from "../components/GreenButton";
import PurpleButton from "../components/PurpleButton";
import Footer from "./Footer.jsx";

/**
 * Chat - Page for real-time messaging between users.
 * Uses useUsers hook to fetch available contacts and
 * useChat hook to manage message state and sending.
 * 
 * Update: Added family code check to only show chat 
 * if user is in a family, otherwise prompt to join/create
 * one in settings. Also added autoscrolling for new messsages
 * and instant scrolling for on page load.
 */
const Chat = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const {
    familyCode,
    familyName,
    loading: familyLoading,
  } = useFamily(currentUser?.uid);

  const [selectedUser, setSelectedUser] = useState(null);
  const { users } = useUsers(currentUser?.uid, familyCode);
  const { messages, newMessage, setNewMessage, handleSend, bottomRef, messagesContainerRef } =
    useChat(currentUser, selectedUser);

  const handleSelectUser = (e) => {
    const uid = e.target.value;
    if (!uid) {
      setSelectedUser(null);
      return;
    }
    const user = users.find((u) => u.uid === uid);
    setSelectedUser(user);
  };

  if (!currentUser || familyLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!familyCode) {
    return (
      <div className="flex flex-col min-h-screen mt-15">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-[#1B2851] rounded-xl p-8 w-full max-w-sm shadow-2xl shadow-black border border-[#4d2c72] text-center">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#EBB537] shrikhand-regular">
                Chat
              </h2>
              <p className="text-gray-400 text-[10px]">{familyName}</p>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              To start chatting, create or join a family in Settings.
            </p>
            <div className="flex justify-center gap-4">
              <PurpleButton
                text="Go to Settings"
                onClick={() => navigate("/settings")}
              />
              <GreenButton text="← Dashboard" onClick={() => navigate("/")} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mt-15">
      <div className="flex-1 flex flex-col items-center justify-center p-4 mt-10 ">
        <div className="flex flex-col w-full max-w-md h-[550px] bg-[#405BA4] rounded-2xl shadow-2xl shadow-black overflow-hidden border border-[#1B2851]">
          <div className="bg-[#1B2851] shadow-md pb-4 pt-2">
            <div className="flex items-center justify-between px-4 mb-3">
              <div className="scale-75 origin-left">
                <GreenButton text="← Back" onClick={() => navigate("/")} />
              </div>
              <h2 className="text-xl font-bold text-[#EBB537] shrikhand-regular">
                Chat
              </h2>
              <div className="w-10"></div>
            </div>

            <div className="px-4">
              <select
                className="select select-bordered select-sm w-full bg-[#405BA4] text-white border-gray-500 focus:border-[#EBB537] focus:outline-none"
                onChange={handleSelectUser}
                value={selectedUser?.uid || ""}
              >
                <option value="">Select a contact...</option>
                {users.map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
            {!selectedUser && (
              <p className="text-center text-gray-300 mt-10">
                Select a person to start.
              </p>
            )}
            {messages.map((msg) => {
              const isSent = msg.uid === currentUser.uid;
              return (
                <div
                  key={msg.id}
                  className={`chat ${isSent ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-header text-[#EBB537] text-[10px] mb-1">
                    {msg.senderName}
                  </div>
                  <div
                    className={`chat-bubble text-sm ${isSent ? "bg-[#4d2c72]" : "bg-[#1B2851]"} text-white`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {selectedUser && (
            <div className="bg-[#1B2851] p-3 border-t border-[#405BA4]">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  className="input input-sm input-bordered flex-1 bg-[#405BA4] text-white border-gray-500 focus:outline-none"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(e)}
                />
                <div className="scale-90">
                  <YellowButton text="Send" onClick={handleSend} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;