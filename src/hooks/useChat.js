import { useState, useEffect, useRef } from "react";
import {
    listenToMessages,
    sendMessage,
    getChatId,
} from "../firebase/chatManager";

export const useChat = (currentUser, selectedUser) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const bottomRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const isInitialLoad = useRef(true);

    const chatId =
        selectedUser && currentUser
            ? getChatId(currentUser.uid, selectedUser.uid)
            : null;

    useEffect(() => {
        if (!currentUser || !selectedUser || !chatId) return;

        isInitialLoad.current = true;

        const unsubscribe = listenToMessages(chatId, (msgs) => {
            setMessages(msgs);

            setTimeout(() => {
                const container = messagesContainerRef.current;
                if (!container) return;

                if (isInitialLoad.current) {
                    isInitialLoad.current = false;
                    container.scrollTop = container.scrollHeight;
                    return;
                }

                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "smooth",
                });
            }, 100);
        });

        return () => unsubscribe();
    }, [currentUser, selectedUser, chatId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId) return;

        const senderName = currentUser.displayName || currentUser.email || "User";
        await sendMessage(chatId, currentUser.uid, senderName, newMessage.trim());
        setNewMessage("");
    };

    const handleSendCustomMessage = async (messageObject) => {
        if (!chatId || !messageObject) return;

        const senderName = currentUser.displayName || currentUser.email || "User";
        await sendMessage(chatId, currentUser.uid, senderName, messageObject);
    };

    return {
        messages,
        newMessage,
        setNewMessage,
        handleSend,
        handleSendCustomMessage,
        bottomRef,
        messagesContainerRef,
    };
};