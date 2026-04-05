import { useEffect, useRef, useState } from 'react';

const HotelManagerChat = ({ hotelId }) => {
    const [open, setOpen] = useState(false);
    const [thread, setThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const scrollRef = useRef(null);
    const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!open || !hotelId) return;

        let isMounted = true;
        const fetchThread = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiBase}/api/auth/hotel-chats/hotels/${hotelId}/thread`, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(res.status === 401 ? 'Unauthorized' : (text || 'Không thể tạo thread'));
                }

                const data = await res.json();

                if (!isMounted) return;
                setThread(data.thread);

                const messagesRes = await fetch(`${apiBase}/api/auth/hotel-chats/threads/${data.thread.id}/messages`, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!messagesRes.ok) {
                    const text = await messagesRes.text();
                    throw new Error(messagesRes.status === 401 ? 'Unauthorized' : (text || 'Không thể lấy tin nhắn'));
                }

                const messagesData = await messagesRes.json();

                if (!isMounted) return;
                setMessages(messagesData.messages || []);
            } catch (error) {
                console.error('HotelManagerChat', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchThread();

        return () => {
            isMounted = false;
        };
    }, [open, hotelId, apiBase, token]);

    useEffect(() => {
        if (!thread?.id) return;
        if (!window.Echo || !window.Pusher) return;

        const channel = window.Echo.private(`hotel-chat.${thread.id}`);

        channel.listen('.HotelChatMessageSent', (event) => {
            if (!event?.message) return;
            setMessages((prev) => [...prev, event.message]);
        });

        return () => {
            channel.stopListening('.HotelChatMessageSent');
            window.Echo.leave(`hotel-chat.${thread.id}`);
        };
    }, [thread]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || !thread) return;
        setSending(true);
        try {
            const payload = { content: input.trim() };
            const res = await fetch(`${apiBase}/api/auth/hotel-chats/threads/${thread.id}/messages`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Gửi tin nhắn thất bại');
            setMessages((prev) => [...prev, data.data]);
            setInput('');
        } catch (err) {
            console.error('HotelManagerChat sendMessage', err);
            alert(err.message || 'Gửi tin nhắn thất bại');
        } finally {
            setSending(false);
        }
    };

    const toggleOpen = () => setOpen((state) => !state);

    const view = (
        <>
            <div
                className="hotel-chat-icon"
                onClick={toggleOpen}
                title="Chat với Hotel Manager"
            >
                <div className="hotel-chat-icon-inner">
                    <span style={{ fontSize: '28px' }}>💬</span>
                </div>
                <span className="hotel-chat-pulse"></span>
            </div>

            {open && (
                <div className="hotel-chat-box">
                    <div className="hotel-chat-header">
                        <div className="hotel-chat-header-info">
                            <div className="hotel-chat-avatar">
                                <span style={{ fontSize: '24px' }}>🏨</span>
                            </div>
                            <div className="hotel-chat-title">
                                <h3>Hotel Manager</h3>
                                <p>{sending ? 'Đang gửi...' : 'Đang trực tuyến'}</p>
                            </div>
                        </div>
                        <button className="hotel-chat-close" onClick={() => setOpen(false)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="hotel-chat-messages" ref={scrollRef}>
                        {loading && <div className="hotel-chat-loading-msg">Đang tải...</div>}
                        {!loading && messages.length === 0 && (
                            <div className="hotel-msg hotel-welcome">
                                <div className="hotel-msg-content">
                                    <div className="hotel-msg-text">
                                        <strong>👋 Xin chào!</strong>
                                        <p>Đây là cửa sổ chat với lễ tân khách sạn. Hãy để lại tin nhắn của bạn.</p>
                                    </div>
                                    <div className="hotel-msg-time">Bây giờ</div>
                                </div>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`hotel-msg ${msg.sender_type === 'user' ? 'hotel-user' : 'hotel-hm'}`}
                            >
                                <div className="hotel-msg-content">
                                    <div className="hotel-msg-text">
                                        {msg.content}
                                    </div>
                                    <div className="hotel-msg-time">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hotel-chat-footer">
                        <div className="hotel-input-container">
                            <input
                                type="text"
                                placeholder="Nhập tin nhắn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                disabled={sending}
                            />
                            <button
                                className="hotel-send-btn"
                                onClick={sendMessage}
                                disabled={sending || !input.trim()}
                            >
                                {sending ? (
                                    <div className="hotel-sending-dots">
                                        <span className="hotel-sending-dot"></span>
                                        <span className="hotel-sending-dot"></span>
                                        <span className="hotel-sending-dot"></span>
                                    </div>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="hotel-chat-hint">
                            {sending ? 'Đang gửi tin nhắn...' : 'Nhấn Enter để gửi'}
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                :root {
                    --hm-primary-color: #4361ee;
                    --hm-primary-light: #4895ef;
                    --hm-secondary-color: #3a0ca3;
                    --hm-bot-color: #f0f4ff;
                    --hm-user-color: #4361ee;
                    --hm-text-color: #333;
                    --hm-light-text: #6c757d;
                    --hm-border-radius: 16px;
                    --hm-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    --hm-transition: all 0.3s ease;
                }

                /* Icon nút chat */
                .hotel-chat-icon {
                    position: fixed;
                    bottom: 110px;
                    right: 30px;
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, var(--hm-primary-color), var(--hm-secondary-color));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 8px 25px rgba(67, 97, 238, 0.4);
                    z-index: 999;
                    transition: var(--hm-transition);
                    overflow: hidden;
                }

                .hotel-chat-icon:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 30px rgba(67, 97, 238, 0.5);
                }

                .hotel-chat-icon-inner {
                    width: 55px;
                    height: 55px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hotel-chat-pulse {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: var(--hm-primary-color);
                    animation: hm-pulse 2s infinite;
                    z-index: -1;
                }

                @keyframes hm-pulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }

                /* Khung chat */
                .hotel-chat-box {
                    position: fixed;
                    bottom: 30px;
                    right: 130px;
                    width: 420px;
                    height: 600px;
                    background: white;
                    border-radius: var(--hm-border-radius);
                    box-shadow: var(--hm-shadow);
                    display: flex;
                    flex-direction: column;
                    z-index: 998;
                    overflow: hidden;
                    animation: hm-slideUp 0.4s ease-out;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                @keyframes hm-slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Header */
                .hotel-chat-header {
                    background: linear-gradient(135deg, var(--hm-primary-color), var(--hm-secondary-color));
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }

                .hotel-chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .hotel-chat-avatar {
                    width: 45px;
                    height: 45px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hotel-chat-title h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }

                .hotel-chat-title p {
                    margin: 3px 0 0;
                    font-size: 13px;
                    opacity: 0.9;
                }

                .hotel-chat-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--hm-transition);
                }

                .hotel-chat-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                /* Body */
                .hotel-chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #f9fafc;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                /* Tin nhắn */
                .hotel-msg {
                    max-width: 100%;
                    display: flex;
                    animation-duration: 0.3s;
                    animation-fill-mode: both;
                }

                .hotel-msg.hotel-hm {
                    align-self: flex-start;
                    animation-name: hm-fadeInLeft;
                }

                .hotel-msg.hotel-user {
                    align-self: flex-end;
                    animation-name: hm-fadeInRight;
                    max-width: 80%;
                }

                @keyframes hm-fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes hm-fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .hotel-msg-content {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .hotel-msg.hotel-hm .hotel-msg-content {
                    align-items: flex-start;
                }

                .hotel-msg.hotel-user .hotel-msg-content {
                    align-items: flex-end;
                }

                .hotel-msg-text {
                    padding: 14px 18px;
                    border-radius: 20px;
                    font-size: 14px;
                    line-height: 1.6;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                .hotel-msg.hotel-hm .hotel-msg-text {
                    background: var(--hm-bot-color);
                    color: var(--hm-text-color);
                    border-bottom-left-radius: 5px;
                }

                .hotel-msg.hotel-user .hotel-msg-text {
                    background: var(--hm-user-color);
                    color: white;
                    border-bottom-right-radius: 5px;
                }

                .hotel-msg.hotel-welcome .hotel-msg-text {
                    background: white;
                    border: 1px solid #e9ecef;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
                }

                .hotel-msg.hotel-welcome .hotel-msg-text p {
                    margin: 8px 0 0;
                    color: var(--hm-light-text);
                    font-weight: normal;
                }

                .hotel-msg-time {
                    font-size: 11px;
                    color: var(--hm-light-text);
                    padding: 0 5px;
                    margin-top: 4px;
                }

                .hotel-chat-loading-msg {
                    color: var(--hm-light-text);
                    font-size: 14px;
                    text-align: center;
                    padding: 20px;
                }

                /* Footer */
                .hotel-chat-footer {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #f1f3f9;
                    flex-shrink: 0;
                }

                .hotel-input-container {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .hotel-chat-footer input {
                    flex: 1;
                    padding: 15px 20px;
                    border: 1px solid #e9ecef;
                    border-radius: 30px;
                    font-size: 14px;
                    outline: none;
                    transition: var(--hm-transition);
                    background: #f9fafc;
                }

                .hotel-chat-footer input:focus {
                    border-color: var(--hm-primary-light);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
                }

                .hotel-chat-footer input:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .hotel-send-btn {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, var(--hm-primary-color), var(--hm-primary-light));
                    color: white;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--hm-transition);
                    flex-shrink: 0;
                }

                .hotel-send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
                }

                .hotel-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .hotel-chat-hint {
                    font-size: 11px;
                    color: var(--hm-light-text);
                    text-align: center;
                    margin: 0;
                    opacity: 0.8;
                }

                /* Sending dots animation */
                .hotel-sending-dots {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                }

                .hotel-sending-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: white;
                    animation: hm-sending 1.4s infinite ease-in-out;
                }

                .hotel-sending-dot:nth-child(1) { animation-delay: -0.32s; }
                .hotel-sending-dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes hm-sending {
                    0%, 80%, 100% { 
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                /* Scrollbar */
                .hotel-chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .hotel-chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .hotel-chat-messages::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }

                .hotel-chat-messages::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }

                /* Responsive */
                @media (max-width: 480px) {
                    .hotel-chat-box {
                        width: 95vw;
                        height: 80vh;
                        bottom: 100px;
                        right: 2.5vw;
                        left: 2.5vw;
                    }
                    
                    .hotel-chat-icon {
                        bottom: 20px;
                        right: 20px;
                    }
                    
                    .hotel-msg.hotel-user {
                        max-width: 85%;
                    }
                }
            `}</style>
        </>
    );

    return view;
};

export default HotelManagerChat;
