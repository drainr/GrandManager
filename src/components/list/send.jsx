import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { pdf } from '@react-pdf/renderer';
import { useUsers } from '../../hooks/useUsers.js';
import { getChatId, sendMessage } from '../../firebase/chatManager.js';
import YellowButton from "../YellowButton.jsx";
import DownloadToDos from "./DownloadToDos.jsx";
import {useNavigate} from "react-router-dom";
import {useFamily} from "../../hooks/useFamily.js";
import PurpleButton from "../PurpleButton.jsx";
import GreenButton from "../GreenButton.jsx";
import Footer from "../../pages/Footer.jsx";

const Send = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const [status, setStatus] = useState('');

    const navigate = useNavigate();

    const {
        familyCode,
        familyName,
        loading: familyLoading,
    } = useFamily(currentUser?.uid);

    const [selectedUser, setSelectedUser] = useState(null);
    const { users } = useUsers(currentUser?.uid, familyCode);

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


    const buildPdfEntries = (entries = {}) => {
        const grouped = {
            Sunday: [],
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
        };

        Object.values(entries).forEach((item) => {
            if (item.day && grouped[item.day]) {
                grouped[item.day].push({
                    entry: item.entry || '',
                    time: item.time || '',
                });
            }
        });

        return grouped;
    };

    const handleSendPdf = async () => {
        if (!selectedUser || !currentUser) return;

        try {
            setStatus('Loading tasks...');

            const db = getDatabase();
            const userRef = ref(db, `lists/${currentUser.uid}`);
            const snapshot = await get(userRef);
            const data = snapshot.exists() ? snapshot.val() : {};

            const pdfEntries = buildPdfEntries(data.entries || {});
            console.log('pdfEntries:', pdfEntries);

            setStatus('Generating PDF...');

            const blob = await pdf(
                <DownloadToDos
                    groupedEntries={pdfEntries}
                    listTitle="Weekly To-Do List"
                />
            ).toBlob();

            console.log('PDF blob created:', blob);

            setStatus('Uploading PDF...');

            const storage = getStorage();
            const fileName = `weekly-todo-${Date.now()}.pdf`;
            const fileRef = storageRef(storage, `pdfs/${currentUser.uid}/${fileName}`);

            await uploadBytes(fileRef, blob, {
                contentType: 'application/pdf',
            });

            console.log('Upload finished');

            setStatus('Getting download link...');

            const fileUrl = await getDownloadURL(fileRef);
            console.log('fileUrl:', fileUrl);

            setStatus('Sending message...');

            const chatId = getChatId(currentUser.uid, selectedUser.uid);

            const pdfMessageText = `Shared a PDF: ${fileName}\n${fileUrl}`;

            await sendMessage(
                chatId,
                currentUser.uid,
                currentUser.displayName || currentUser.email,
                pdfMessageText
            );

            console.log('Message sent');
            setStatus('PDF sent!');
        } catch (error) {
            console.error('handleSendPdf error:', error);
            setStatus(`Failed to send PDF.`);
        }
    };


    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexDirection: 'column',
                marginRight: 5,
            }}
        >
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

            <div className="flex flex-col gap-3 p-3">
                <YellowButton text="Send PDF" onClick={handleSendPdf} width={110} height={50} />
            </div>

            <div className="flex flex-column p-3">
                {status && <span style={{ color: '#EBB537', fontWeight: 600 }}>{status}</span>}
            </div>
        </div>
    );
};

export default Send;