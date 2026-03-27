import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { useUsers } from '../../hooks/useUsers';
import { getChatId } from '../../firebase/chatManager';
import YellowButton from '../YellowButton';

const Recieve = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { users } = useUsers(currentUser?.uid);
  const [status, setStatus] = useState('');

  const handleRecieve = async () => {
    if (!currentUser) return;
    setStatus('Checking...');
    // Try to find the most recent sender who sent JSON
    let found = false;
    let lastJson = null;
    let lastSender = null;
    const db = getDatabase();
    for (const user of users) {
      const chatId = getChatId(currentUser.uid, user.uid);
      const messagesRef = ref(db, `chats/${chatId}/messages`);
      const snapshot = await get(messagesRef);
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          const msg = child.val();
          if (msg.uid === user.uid && isJson(msg.text)) {
            lastJson = msg.text;
            lastSender = user.name;
            found = true;
          }
        });
      }
      if (found) break;
    }
    if (found && lastJson) {
      // Download JSON
      const blob = new Blob([lastJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shared_tasks.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus(`Downloaded from ${lastSender}!`);
    } else {
      alert('No data available from any sender.');
      setStatus('No data available.');
    }
  };

  function isJson(str) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <YellowButton text="Recieve List" onClick={handleRecieve} />
      {status && <span style={{ color: '#EBB537', fontWeight: 600, marginLeft: 8 }}>{status}</span>}
    </div>
  );
};

export default Recieve;
