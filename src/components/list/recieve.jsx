import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { useUsers } from '../../hooks/useUsers';
import { getChatId } from '../../firebase/chatManager';
import YellowButton from '../YellowButton';
// recieve data from user 
const Recieve = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { users } = useUsers(currentUser?.uid);
  const [status, setStatus] = useState('');

  // handle download helper
  const handleRecieve = async () => {
    if (!currentUser) return;
    setStatus('Checking...');
    //grab recent json message from any sender
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
      // Download as json
      const blob = new Blob([lastJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shared_tasks.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus(`Downloaded!`);
      setTimeout(() => {
        setStatus('');
      }, 2000);
    } else {
      alert('No data available from any sender.');
      setStatus('No data available.');
      setTimeout(() => {
        setStatus('');
      }, 2000);
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'column' }}>
      <YellowButton text="Recieve List" onClick={handleRecieve} width={180} height={50} />
        <div className='flex flex-column p-3'>
      {status && <span style={{ color: '#EBB537', fontWeight: 600 }}>{status}</span>}
    </div></div>
  );
}

export default Recieve;
