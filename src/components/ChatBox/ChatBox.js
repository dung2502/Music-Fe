import { Button, Card, Container, Flex, Group, Typography } from "lvq";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import "./ChatBox.css";

export function ChatBox({ openChat, callCloseChat, messages = [] }) {
    const [isOpenChat, setIsOpenChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setIsOpenChat(openChat);
    }, [openChat]);

    useEffect(() => {
        setChatMessages(prev => {
            if (messages.length > prev.length) return messages;
            return prev;
        });
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        const fakeMsg = {
            senderName: "Bạn",
            content: newMessage,
            createDate: new Date().toISOString(),
        };

        setChatMessages([...chatMessages, fakeMsg]);
        setNewMessage("");

        try {
            const response = await fetch("http://localhost:5678/webhook/d387ab48-11ee-40f1-9707-b5ab29e439ae", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify([
                    {
                        sessionId: "843b75156d5a4551809ca2e5607df509",
                        action: "sendMessage",
                        chatInput: newMessage
                    }
                ])
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Đọc response dưới dạng text
            const text = await response.text();
            console.log("N8n response:", text);

            // Xử lý response text
            if (text) {
                // Loại bỏ dấu { } ở đầu và cuối nếu có
                const cleanText = text.replace(/^\{|\}$/g, '').trim();
                
                const aiMessage = {
                    senderName: "AI Assistant",
                    content: cleanText,
                    createDate: new Date().toISOString(),
                };
                setChatMessages(prev => [...prev, aiMessage]);
            } else {
                console.log("Empty response from n8n");
            }

        } catch (error) {
            console.error("Lỗi gửi tin nhắn tới n8n:", error);
            const errorMsg = {
                senderName: "System",
                content: "Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
                createDate: new Date().toISOString(),
            };
            setChatMessages(prev => [...prev, errorMsg]);
        }
    };

    const timeAgo = (dateTimeString) => {
        const now = new Date();
        const messageDate = new Date(dateTimeString);
        const differenceInSeconds = Math.floor((now - messageDate) / 1000);

        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
            { label: 'giây', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(differenceInSeconds / interval.seconds);
            if (count >= 1) return `${count} ${interval.label} trước`;
        }

        return 'Vừa mới';
    };

    return (
        <Container withShadow={false}
                   className={isOpenChat ? 'chatbox active-chatbox' : 'chatbox'}>
            {/* Header */}
            <Flex justifyContent="between" alignItems="center" className="chatbox-header"
                  gd={{ padding: "10px", backgroundColor: "#3e2949", color: "#fff" }}>
                <Typography tag="h3">Tin nhắn</Typography>
                <Button
                    theme="reset"
                    icon={<IoIosArrowDown size={22} />}
                    gd={{
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        width: "36px",
                        height: "36px"
                    }}
                    onClick={() => callCloseChat(false)}
                />
            </Flex>
            <Group className="chatbox-content">
                {chatMessages.map((msg, index) => {
                    const isUser = msg.senderName === "Bạn";
                    return (
                        <Flex
                            key={index}
                            alignItems="start"
                            gap={2}
                            justifyContent={isUser ? "end" : "start"}
                            gd={{ marginBottom: "10px" }}
                        >
                            <div
                                style={{
                                    maxWidth: isUser ? "65%" : "75%",
                                    padding: isUser ? "6px 10px" : "8px 12px",
                                    backgroundColor: isUser ? "#e0f7fa" : "#fff",
                                    borderRadius: 10,
                                    alignSelf: isUser ? "flex-end" : "flex-start",
                                    boxShadow: isUser ? "none" : "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                            >
                                <Flex justifyContent="between" style={{ marginBottom: "4px" }}>
                                    <Typography tag="strong" gd={{ fontSize: "0.8rem", color: "#000" }}>
                                        {msg.senderName}
                                    </Typography>
                                    <Typography tag="span" gd={{ fontSize: "0.7rem", color: "#888" }}>
                                        {timeAgo(msg.createDate)}
                                    </Typography>
                                </Flex>
                                <Typography
                                    tag="p"
                                    gd={{
                                        fontSize: "0.85rem",
                                        color: "#333",
                                        margin: 0,
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        lineHeight: "1.4",
                                        overflow: "visible",
                                        textAlign: isUser ? "right" : "left"
                                    }}
                                >
                                    {msg.content}
                                </Typography>
                            </div>
                        </Flex>
                    );
                })}

                <div ref={messagesEndRef} />
            </Group>

            <Flex direction="column" gd={{ padding: "10px", borderTop: "1px solid #ddd" }}>
                <textarea
                    rows={2}
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        resize: "none",
                        marginBottom: "8px"
                    }}
                />
                <Button text="Gửi" theme="primary" onClick={handleSendMessage} />
            </Flex>
        </Container>
    );
}
