import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Flex, Group } from 'lvq';
import { IoClose } from 'react-icons/io5';
import './ChatBoxForHelpUser.css';
import * as userService from '../../core/services/UserService';
import axiosClient from "../../utils/axiosClient";
import { isAdmin, isListener } from '../../core/services/AuthenticationService';

export function ChatBoxForHelpUser({ openChat, callCloseChat, stompClient }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [chatPartner, setChatPartner] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [role, setRole] = useState('');
    const [adminList, setAdminList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [partnerTyping, setPartnerTyping] = useState(false);
    const messageEndRef = useRef(null);
    const [hasSelectedAdmin, setHasSelectedAdmin] = useState(false);

    // Load user & role on mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);

        async function fetchRole() {
            if (await isAdmin()) setRole('admin');
            else if (await isListener()) setRole('listener');
        }
        fetchRole();
    }, []);

    // Load user list (admin view) or admin list (listener view)
    useEffect(() => {
        if (!openChat) return;

        if (role === 'admin' && currentUser?.userId) {
            axiosClient.get(`/messages/chat-users?adminId=${currentUser.userId}`)
                .then(res => setUserList(res.data || []))
                .catch(console.error);
        }

        if (role === 'listener' && !hasSelectedAdmin) {
            userService.getListAdminUsers()
                .then(res => setAdminList(Array.isArray(res) ? res : [res]))
                .catch(console.error);
        }
    }, [openChat, role, currentUser, hasSelectedAdmin]);

    // When selected user changes, load partner info & reset messages
    useEffect(() => {
        if (!selectedUserId) {
            setChatPartner(null);
            setMessages([]);
            return;
        }

        userService.getUserById(selectedUserId)
            .then(user => {
                setChatPartner(user);
                if (role === 'listener') {
                    setHasSelectedAdmin(true);
                }
            })
            .catch(() => setChatPartner(null));
    }, [selectedUserId, role]);

    // Load chat history when partner or current user changes
    useEffect(() => {
        if (!currentUser?.userId || !chatPartner?.userId) {
            setMessages([]);
            return;
        }

        axiosClient.get(`/messages/history?userId1=${currentUser.userId}&userId2=${chatPartner.userId}`)
            .then(res => {
                const formatted = res.data.map(msg => ({
                    ...msg,
                    self: msg.senderId === currentUser.userId,
                }));
                setMessages(formatted);
            })
            .catch(console.error);
    }, [chatPartner, currentUser]);

    // Subscribe to WebSocket topics for realtime chat & typing
    useEffect(() => {
        if (!stompClient || !currentUser?.userId || !chatPartner?.userId) return;

        const chatSub = stompClient.subscribe(
            `/topic/chat/${chatPartner.userId}/${currentUser.userId}`,
            (msg) => {
                const message = JSON.parse(msg.body);
                setMessages(prev => [...prev, { ...message, self: false }]);
            }
        );

        const typingSub = stompClient.subscribe(
            `/topic/chat-typing/${chatPartner.userId}/${currentUser.userId}`,
            () => {
                setPartnerTyping(true);
                // Clear typing status after 3 seconds
                setTimeout(() => setPartnerTyping(false), 3000);
            }
        );

        return () => {
            chatSub.unsubscribe();
            typingSub.unsubscribe();
        };
    }, [stompClient, currentUser, chatPartner]);

    // Auto-scroll to newest message
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message handler
    const handleSend = () => {
        if (!input.trim() || !currentUser || !chatPartner) return;

        const message = {
            senderId: currentUser.userId,
            receiverId: chatPartner.userId,
            content: input.trim(),
            timestamp: new Date().toISOString(),
            seen: false,
        };

        stompClient.send('/app/chat', {}, JSON.stringify(message));
        setMessages(prev => [...prev, { ...message, self: true }]);
        setInput('');
    };

    // Send typing indicator
    const handleTyping = () => {
        if (!stompClient || !currentUser || !chatPartner) return;

        stompClient.send('/app/typing', {}, JSON.stringify({
            senderId: currentUser.userId,
            receiverId: chatPartner.userId,
        }));
    };

    if (!openChat || !currentUser || !role) return null;

    // The list of users to show depends on role
    const listToShow = role === 'admin' ? userList : adminList;

    return (
        <div className="chat-box-container">
            <Group className="chat-box">
                <Flex className="chat-header" justifyContent="between" alignItems="center">
                    <Typography className="chat-title">
                        {role === 'admin' ? 'Hỗ trợ khách hàng' : 'Trò chuyện với Admin'}
                    </Typography>
                    <Button
                        theme="reset"
                        icon={<IoClose size={24} />}
                        onClick={callCloseChat}
                        className="close-button"
                    />
                </Flex>

                {!chatPartner ? (
                    <div className="admin-select">
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                        >
                            <option value="">-- Chọn {role === 'admin' ? 'người dùng' : 'admin'} --</option>
                            {listToShow.map(user => (
                                <option key={user.userId} value={user.userId}>
                                    {user.fullName || user.email}
                                </option>
                            ))}
                        </select>
                        {listToShow.length === 0 && (
                            <Typography className="no-users-text" style={{ marginTop: 12, color: '#666' }}>
                                {role === 'admin' ? 'Chưa có người dùng nào từng gửi tin.' : 'Không có admin khả dụng.'}
                            </Typography>
                        )}
                    </div>
                ) : (
                    <>
                        {role === 'admin' && (
                            <div className="admin-select" style={{ marginBottom: '10px' }}>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                                >
                                    <option value="">-- Chọn người dùng --</option>
                                    {userList.map(user => (
                                        <option key={user.userId} value={user.userId}>
                                            {user.fullName || user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.self ? 'self' : 'other'}`}>
                                    <div className="chat-content">{msg.content}</div>
                                    {index === messages.length - 1 && msg.self && msg.seen && (
                                        <div className="seen-status">Đã xem</div>
                                    )}
                                </div>
                            ))}
                            {partnerTyping && <div className="typing-indicator">Đang gõ...</div>}
                            <div ref={messageEndRef}></div>
                        </div>

                        <div className="chat-input">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleTyping}
                                placeholder="Nhập tin nhắn..."
                                className="chat-input-field"
                            />
                            <Button
                                theme="primary"
                                text="Gửi"
                                onClick={handleSend}
                                className="send-button"
                            />
                        </div>
                    </>
                )}
            </Group>
        </div>
    );
}
