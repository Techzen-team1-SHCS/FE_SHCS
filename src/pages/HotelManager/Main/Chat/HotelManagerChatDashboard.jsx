import { useEffect, useRef, useState, useCallback } from 'react';

const HotelManagerChatDashboard = () => {
    const [threads, setThreads] = useState([]);
    const [selectedThread, setSelectedThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loadingThread, setLoadingThread] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const token = localStorage.getItem('token');
    const scrollRef = useRef(null);

    const loadThreads = useCallback(async () => {
        if (!token) {
            setError('Chưa đăng nhập. Vui lòng đăng nhập để xem chat.');
            return;
        }

        try {
            const res = await fetch(`${apiBase}/api/auth/hotel-chats/hm/threads`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(res.status === 401 ? 'Unauthorized: cần đăng nhập' : (text || 'Load threads failed'));
            }

            const data = await res.json();
            setThreads(data.threads || []);
            setSelectedThread((prevThread) => prevThread || data.threads?.[0] || null);
        } catch (err) {
            console.error('Load HM threads error', err);
            setError(err.message || 'Lỗi tải hội thoại');
        }
    }, [token, apiBase]);

    const loadMessages = useCallback(async (threadId) => {
        if (!threadId) return;
        setLoadingThread(true);
        try {
            const res = await fetch(`${apiBase}/api/auth/hotel-chats/threads/${threadId}/messages`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(res.status === 401 ? 'Unauthorized: cần đăng nhập' : (text || 'Load messages failed'));
            }

            const data = await res.json();
            setMessages(data.messages || []);
            setSelectedThread(data.thread);
        } catch (err) {
            console.error('Load messages error', err);
            setError(err.message || 'Lỗi tải tin nhắn');
        } finally {
            setLoadingThread(false);
        }
    }, [token, apiBase]);

    useEffect(() => {
        loadThreads();
    }, [loadThreads]);

    useEffect(() => {
        if (selectedThread?.id) {
            loadMessages(selectedThread.id);
        }
    }, [selectedThread?.id, loadMessages]);

    useEffect(() => {
        if (!selectedThread?.id) return;
        if (!window.Echo || !window.Pusher) return;

        const channel = window.Echo.private(`hotel-chat.${selectedThread.id}`);

        channel.listen('.HotelChatMessageSent', (event) => {
            if (!event?.message) return;
            setMessages((prev) => [...prev, event.message]);
        });

        return () => {
            channel.stopListening('.HotelChatMessageSent');
            window.Echo.leave(`hotel-chat.${selectedThread.id}`);
        };
    }, [selectedThread?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!messageText.trim() || !selectedThread) return;
        setSending(true);
        try {
            const res = await fetch(`${apiBase}/api/auth/hotel-chats/threads/${selectedThread.id}/messages`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: messageText.trim() }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(res.status === 401 ? 'Unauthorized: cần đăng nhập' : (text || 'Send failed'));
            }

            const data = await res.json();
            setMessages((prev) => [...prev, data.data]);
            setMessageText('');
        } catch (err) {
            console.error('Send message HM', err);
            setError(err.message || 'Gửi tin nhắn thất bại');
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: 1, height: 'calc(100vh - 90px)' }}>
            <div style={{ width: 320, border: '1px solid #ddd', background: '#fff', padding: 12 }}>
                <h3>Danh sách chat</h3>
                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                {threads.length === 0 && <p>Không có thread nào</p>}
                <div style={{ display: 'grid', gap: 8 }}>
                    {threads.map((t) => (
                        <button
                            key={t.id}
                            style={{
                                textAlign: 'left',
                                padding: 10,
                                borderRadius: 8,
                                border: t.id === selectedThread?.id ? '2px solid #2f80ed' : '1px solid #ccc',
                                background: t.id === selectedThread?.id ? '#eaf2ff' : '#fff',
                                cursor: 'pointer',
                            }}
                            onClick={() => setSelectedThread(t)}
                        >
                            <div><strong>Hotel:</strong> {t.hotel?.name || 'N/A'}</div>
                            <div><strong>Khách:</strong> {t.user?.name || 'Không tên'}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{t.last_message || 'Chưa có tin nhắn'}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, border: '1px solid #ddd', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    <h3 style={{ margin: 0 }}>Chat room</h3>
                    {selectedThread && (
                        <p style={{ margin: '4px 0 0', color: '#555' }}>
                            {selectedThread.hotel?.name} - {selectedThread.user?.name}
                        </p>
                    )}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 12 }} ref={scrollRef}>
                    {loadingThread && <div>Đang tải tin nhắn...</div>}
                    {!loadingThread && messages.length === 0 && <div>Chưa có tin nhắn. Gửi một tin nhắn để bắt đầu.</div>}
                    {messages.map((msg) => (
                        <div key={msg.id} style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: msg.sender_type === 'hm' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ background: msg.sender_type === 'hm' ? '#e8f0ff' : '#f3f4f6', padding: '8px 10px', borderRadius: 8, maxWidth: '70%' }}>{msg.content}</div>
                            <span style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))}
                </div>

                <div style={{ borderTop: '1px solid #eee', padding: 12, display: 'flex', gap: 8 }}>
                    <input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={selectedThread ? 'Nhập tin nhắn...' : 'Chọn thread trước'}
                        disabled={!selectedThread || sending}
                        style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
                    />
                    <button onClick={sendMessage} disabled={!selectedThread || !messageText.trim() || sending} style={{ padding: '10px 16px', borderRadius: 6, border: 'none', background: '#2f80ed', color: '#fff', cursor: 'pointer' }}>
                        {sending ? 'Đang gửi...' : 'Gửi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelManagerChatDashboard;
