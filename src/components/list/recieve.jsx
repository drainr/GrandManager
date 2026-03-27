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
};

export default RecieveCalendar;
