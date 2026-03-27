import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { useUsers } from '../../hooks/useUsers';
import { getChatId, sendMessage } from '../../firebase/chatManager';
import { groupEntriesByDay, formatExportJSON } from '../../utils/exportHelpers';
import BlueButton from "../BlueButton.jsx";
import Recieve from "./recieve.jsx";

const Send = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { users } = useUsers(currentUser?.uid);
  const [selectedUser, setSelectedUser] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (uid) => {
    if (!uid || !currentUser) return;
    setStatus('Sending...');
    const db = getDatabase();
    const userRef = ref(db, `lists/${currentUser.uid}`);
    const snapshot = await get(userRef);
    const data = snapshot.exists() ? snapshot.val() : {};
    const grouped = groupEntriesByDay(data.entries);
    const json = formatExportJSON(grouped);
    const chatId = getChatId(currentUser.uid, uid);
    await sendMessage(chatId, currentUser.uid, currentUser.displayName || currentUser.email, json);
    setStatus('Sent!');
  };

  const handleSelect = async (e) => {
    const uid = e.target.value;
    setSelectedUser(uid);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <select
        className="select select-bordered select-sm w-full bg-[#405BA4] text-white border-gray-500 focus:border-[#EBB537] focus:outline-none"
        onChange={handleSelect}
        value={selectedUser}
      >
        <option value="">Send task list to...</option>
        {users.map(user => (
          <option key={user.uid} value={user.uid}>{user.name}</option>
        ))}

      </select>
        <div className='scale-65'>
        <BlueButton text='send' onClick={handleSend} />
            <div className='p-5'>
        <Recieve />
            </div>
        </div>
      {status && <span style={{ color: '#EBB537', fontWeight: 600 }}>{status}</span>}
    </div>
  );
};

export default Send;
