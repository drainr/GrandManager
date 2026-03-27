import React from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef, get } from "firebase/database";

const RecieveCalendar = () => {
	const [status, setStatus] = React.useState("");
	const [receivedText, setReceivedText] = React.useState("");
	const timeoutRef = React.useRef();
	const handleDownload = async () => {
		const auth = getAuth();
		const currentUser = auth.currentUser;
		if (!currentUser) {
			alert("Not logged in");
			return;
		}
		const db = getDatabase();
		const sharedRef = dbRef(db, `sharedCalendars/${currentUser.uid}/latest`);
		let didFind = false;
		setStatus("");
		setReceivedText("");
		// Start a 2-second timer
		timeoutRef.current = setTimeout(() => {
			if (!didFind) {
				setStatus("No shared calendar found.");
				setReceivedText("");
				setTimeout(() => setStatus("") , 2000);
			}
		}, 2000);
		try {
			const snapshot = await get(sharedRef);
			let data = {};
			if (snapshot.exists()) {
				const shared = snapshot.val();
				data = shared.calendar || {};
				// Format as readable text grouped by day and tasks
				let text = "";
				const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				days.forEach(day => {
					const entries = Object.values(data).filter(entry => entry.day === day);
					if (entries.length > 0) {
						text += `day ${day.toLowerCase()}\n`;
						entries.forEach((entry, idx) => {
							let task = (entry.text || entry.task || '').trim();
							let time = (entry.time || '').trim();
							// Format time as 12-hour with am/pm
							if (time) {
								const [h, m] = time.split(":");
								if (h !== undefined && m !== undefined) {
									let hour = parseInt(h, 10);
									const minute = m.padStart(2, '0');
									const ampm = hour >= 12 ? 'pm' : 'am';
									hour = hour % 12;
									if (hour === 0) hour = 12;
									time = `${hour}:${minute} ${ampm}`;
								}
							}
							text += `task ${idx + 1}\t\t${task}\t\ttime ${time}\n`;
						});
						text += `~~~~~~~~~~~~\n`;
					}
				});
				setReceivedText(text.trim());
				// Also download as .txt for user
				const blob = new Blob([text], { type: "text/plain" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'received_calendar.txt';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
				setStatus("Received calendar downloaded!");
				didFind = true;
				clearTimeout(timeoutRef.current);
				setTimeout(() => setStatus("") , 2000);
			}
		} catch (err) {
			setStatus("No shared calendar found.");
			setReceivedText("");
			setTimeout(() => setStatus("") , 2000);
		}
	};

<<<<<<< HEAD
	return (
		<div style={{display:'flex',flexDirection:'column',gap:8}}>
			<button onClick={handleDownload} style={{padding:8,background:'#4CAF50',color:'#fff',border:'none',borderRadius:4}}>
				Download Received Calendar
			</button>
			{status && <span style={{color:'#4CAF50',fontWeight:600}}>{status}</span>}
			{receivedText && status !== "No shared calendar found." && (
				<textarea
					style={{marginTop:8, width:'100%', minHeight:120, background:'#e8f5e9', color:'#256029', fontFamily:'monospace', fontSize:14, border:'1px solid #4CAF50', borderRadius:4}}
					value={receivedText}
					readOnly
				/>
			)}
		</div>
	);
=======
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
>>>>>>> d538a1b01894bcc63f392cd0626142bf0b3c3419
};

export default RecieveCalendar;
