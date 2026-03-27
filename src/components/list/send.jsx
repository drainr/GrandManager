import React from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef, get, set } from "firebase/database";
import { useUsers } from "../../hooks/useUsers";

const SendCalendar = () => {
	const auth = getAuth();
	const currentUser = auth.currentUser;
	const { users } = useUsers(currentUser?.uid);
	const [selectedUser, setSelectedUser] = React.useState("");
	const [status, setStatus] = React.useState("");

	const handleSend = async () => {
		if (!currentUser || !selectedUser) {
			alert("Select a user to send to.");
			return;
		}
		setStatus("Storing shared JSON copy for recipient...");
		const db = getDatabase();
		const myRef = dbRef(db, `lists/${currentUser.uid}/entries`);
		const sharedRef = dbRef(db, `sharedCalendars/${selectedUser}/latest`);
		const snapshot = await get(myRef);
		const data = snapshot.exists() ? snapshot.val() : {};
		// Only store a shared copy for the recipient (do not modify their calendar)
		await set(sharedRef, {
			from: currentUser.uid,
			fromName: currentUser.displayName || currentUser.email,
			calendar: data,
			sentAt: Date.now()
		});
		setStatus("Shared JSON copy sent to selected user!");
	};

	return (
		<div style={{display:'flex',flexDirection:'column',gap:8}}>
			<select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{padding:8}}>
				<option value="">Select user to send to...</option>
				{users.map(user => (
					<option key={user.uid} value={user.uid}>{user.name || user.email}</option>
				))}
			</select>
			<button onClick={handleSend} style={{padding:8,background:'#405BA4',color:'#fff',border:'none',borderRadius:4}}>
				Send My Calendar Directly
			</button>
			{status && <span style={{color:'#EBB537',fontWeight:600}}>{status}</span>}
		</div>
	);
};

export default SendCalendar;
