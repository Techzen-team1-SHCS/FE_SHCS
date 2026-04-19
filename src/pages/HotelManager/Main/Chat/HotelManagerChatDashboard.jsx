import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
    FiMessageSquare,
    FiSearch,
    FiSend,
    FiClock,
    FiAlertCircle,
    FiWifi,
    FiRefreshCw,
    FiChevronRight,
    FiChevronDown,
    FiInbox,
    FiCheck,
    FiFilter,
    FiEye,
} from 'react-icons/fi';
import './HotelManagerChatDashboard.css';
import {
    PAGE_SIZE,
    VIRTUAL_WINDOW,
    buildThreadPreview,
    formatClockTime,
    formatRelativeTime,
    getInitial,
    getThreadStatus,
    groupThreadsByHotel,
} from './hotelChatHelpers';

const AUTO_SCROLL_THRESHOLD = 120;

const HotelManagerChatDashboard = () => {
    const [threads, setThreads] = useState([]);
    const [expandedHotels, setExpandedHotels] = useState({});
    const [selectedThread, setSelectedThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loadingThread, setLoadingThread] = useState(false);
    const [sending, setSending] = useState(false);
    const [loadingThreads, setLoadingThreads] = useState(false);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [messagePage, setMessagePage] = useState(1);
    const [messagePagination, setMessagePagination] = useState(null);
    const [messageLoadingMore, setMessageLoadingMore] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const scrollRef = useRef(null);
    const topSentinelRef = useRef(null);
    const followScrollRef = useRef(true);
    const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const token = localStorage.getItem('token');
    const selectedThreadId = selectedThread?.id;

    const loadThreads = useCallback(async () => {
        if (!token) {
            setError('Chưa đăng nhập. Vui lòng đăng nhập để xem chat.');
            return;
        }

        setLoadingThreads(true);
        setError(null);
        try {
            const res = await fetch(`${apiBase}/auth/hotel-chats/hm/threads`, {
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
            const nextThreads = data.threads || [];
            setThreads(nextThreads);
            setSelectedThread((prev) => prev || nextThreads[0] || null);
        } catch (err) {
            console.error('Load HM threads error', err);
            setError('Lỗi tải hội thoại');
        } finally {
            setLoadingThreads(false);
        }
    }, [token, apiBase]);

    const loadMessages = useCallback(async (threadId, page = 1, append = false) => {
        if (!threadId) return;
        if (append) setMessageLoadingMore(true);
        else setLoadingThread(true);
        setError(null);
        try {
            const res = await fetch(`${apiBase}/auth/hotel-chats/threads/${threadId}/messages?page=${page}&per_page=${PAGE_SIZE}`, {
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
            setMessagePagination(data.pagination || null);
            setSelectedThread(data.thread || null);
            setMessages((prev) => {
                const incoming = Array.isArray(data.messages) ? data.messages : [];
                const merged = append ? [...incoming, ...prev] : incoming;
                const map = new Map();
                merged.forEach((msg) => map.set(String(msg.id), msg));
                return Array.from(map.values()).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            });
            setMessagePage(page);
        } catch (err) {
            console.error('Load messages error', err);
            setError(err.message || 'Lỗi tải tin nhắn');
        } finally {
            setLoadingThread(false);
            setMessageLoadingMore(false);
        }
    }, [token, apiBase]);

    useEffect(() => { loadThreads(); }, [loadThreads]);
    useEffect(() => { if (selectedThreadId) loadMessages(selectedThreadId, 1, false); }, [selectedThreadId, loadMessages]);

    useEffect(() => {
        if (token && window.Echo?.connector?.options?.auth) {
            window.Echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
        }
    }, [token]);

    const patchThread = useCallback((threadId, patchFn) => {
        setThreads((prev) => prev.map((thread) => (String(thread.id) === String(threadId) ? patchFn(thread) : thread)));
    }, []);

    const markThreadHandled = useCallback((threadId) => {
        patchThread(threadId, (thread) => ({
            ...thread,
            hm_unread_count: 0,
            hm_last_read_at: new Date().toISOString(),
        }));
    }, [patchThread]);

    useEffect(() => {
        if (!selectedThreadId || !window.Echo || !window.Pusher) return;

        const channel = window.Echo.private(`hotel-chat.${selectedThreadId}`);
        channel.listen('.HotelChatMessageSent', (event) => {
            if (!event?.message) return;
            const isMine = event.message.sender_type === 'hm';
            setMessages((prev) => {
                if (prev.some((m) => String(m.id) === String(event.message.id))) return prev;
                const next = [...prev, event.message].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                return next.length > VIRTUAL_WINDOW ? next : next;
            });

            patchThread(event.thread_id || event.message.thread_id, (thread) => ({
                ...thread,
                last_message: event.message.content,
                last_message_at: event.message.created_at,
                hm_unread_count: isMine ? thread.hm_unread_count : Number(thread.hm_unread_count || 0) + 1,
            }));

            if (!isMine && followScrollRef.current) {
                requestAnimationFrame(() => {
                    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                });
            }
        });

        return () => {
            channel.stopListening('.HotelChatMessageSent');
            window.Echo.leave(`hotel-chat.${selectedThreadId}`);
        };
    }, [selectedThreadId, patchThread]);

    useEffect(() => {
        if (!threads.length || !window.Echo) return;
        const managerId = threads[0]?.hm_id;
        if (!managerId) return;

        const managerChannel = window.Echo.private(`hotel-manager.${managerId}`);
        managerChannel.listen('.HotelChatMessageSent', (event) => {
            if (!event?.message) return;
            const isMine = event.message.sender_type === 'hm';
            patchThread(event.thread_id || event.message.thread_id, (thread) => ({
                ...thread,
                last_message: event.message.content,
                last_message_at: event.message.created_at,
                hm_unread_count: isMine ? thread.hm_unread_count : Number(thread.hm_unread_count || 0) + 1,
            }));
        });

        return () => {
            managerChannel.stopListening('.HotelChatMessageSent');
            window.Echo.leave(`hotel-manager.${managerId}`);
        };
    }, [threads, patchThread]);

    const filteredThreads = useMemo(() => {
        const q = searchText.trim().toLowerCase();
        return threads.filter((thread) => {
            const statusKey = getThreadStatus(thread).key;
            const matchesStatus = statusFilter === 'all' ? true : statusKey === statusFilter;
            const haystack = [thread.hotel?.name, thread.user?.name, thread.last_message].filter(Boolean).join(' ').toLowerCase();
            const matchesSearch = !q || haystack.includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [searchText, threads, statusFilter]);

    const groupedThreads = useMemo(() => groupThreadsByHotel(filteredThreads), [filteredThreads]);

    useEffect(() => {
        if (!scrollRef.current) return;
        if (followScrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return undefined;

        const onScroll = () => {
            const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
            followScrollRef.current = distanceFromBottom < AUTO_SCROLL_THRESHOLD;
        };

        el.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const root = scrollRef.current;
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry?.isIntersecting && messagePagination?.has_more && !messageLoadingMore && selectedThreadId) {
                const nextPage = messagePage + 1;
                const currentScrollHeight = root?.scrollHeight || 0;
                const currentScrollTop = root?.scrollTop || 0;
                loadMessages(selectedThreadId, nextPage, true).then(() => {
                    requestAnimationFrame(() => {
                        if (root) {
                            const delta = (root.scrollHeight || 0) - currentScrollHeight;
                            root.scrollTop = currentScrollTop + delta;
                        }
                    });
                });
            }
        }, { root, threshold: 0.1 });

        const el = topSentinelRef.current;
        if (el) observer.observe(el);
        return () => observer.disconnect();
    }, [messagePagination, messageLoadingMore, loadMessages, messagePage, selectedThreadId]);

    const visibleMessages = useMemo(() => {
        if (messages.length <= VIRTUAL_WINDOW) return messages;
        return messages.slice(-VIRTUAL_WINDOW);
    }, [messages]);

    const sendMessage = useCallback(async () => {
        if (!messageText.trim() || !selectedThread) return;
        setSending(true);
        setError(null);
        try {
            const res = await fetch(`${apiBase}/auth/hotel-chats/threads/${selectedThread.id}/messages`, {
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
            setMessages((prev) => {
                if (prev.some((m) => String(m.id) === String(data.data.id))) return prev;
                return [...prev, data.data];
            });
            markThreadHandled(selectedThread.id);
            setMessageText('');
        } catch (err) {
            console.error('Send message HM', err);
            setError(err.message || 'Gửi tin nhắn thất bại');
        } finally {
            setSending(false);
        }
    }, [apiBase, messageText, selectedThread, token, markThreadHandled]);

    const toggleHotelGroup = useCallback((hotelId) => {
        setExpandedHotels((prev) => ({ ...prev, [hotelId]: !prev[hotelId] }));
    }, []);

    const totalUnread = useMemo(() => threads.reduce((sum, t) => sum + Number(t.hm_unread_count || 0), 0), [threads]);

    return (
        <div className="hm-chat-dashboard">
            <aside className="hm-chat-sidebar">
                <div className="hm-chat-sidebar-header">
                    <div>
                        <div className="hm-chat-kicker">Hotel Manager Inbox</div>
                        <h2>Hội thoại khách hàng</h2>
                        <p>Giống kiểu Messenger, gọn cho quản lý nhiều khách sạn cùng lúc.</p>
                    </div>
                    <button className="hm-icon-button" onClick={loadThreads} disabled={loadingThreads} title="Làm mới danh sách">
                        <FiRefreshCw className={loadingThreads ? 'hm-spin' : ''} />
                    </button>
                </div>

                <label className="hm-search-box">
                    <FiSearch />
                    <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Tìm khách, khách sạn, nội dung..."
                    />
                </label>

                <div className="hm-status-strip">
                    <button className={`hm-status-chip ${statusFilter === 'all' ? 'success' : ''}`} onClick={() => setStatusFilter('all')}>
                        <FiFilter /> Tất cả
                    </button>
                    <button className={`hm-status-chip danger ${statusFilter === 'chua_phan_hoi' ? 'danger' : ''}`} onClick={() => setStatusFilter('chua_phan_hoi')}>
                        <FiInbox /> Chưa phản hồi
                    </button>
                    <button className={`hm-status-chip warning ${statusFilter === 'dang_doc' ? 'warning' : ''}`} onClick={() => setStatusFilter('dang_doc')}>
                        <FiEye /> Đang đọc
                    </button>
                    <button className={`hm-status-chip success ${statusFilter === 'da_tra_loi' ? 'success' : ''}`} onClick={() => setStatusFilter('da_tra_loi')}>
                        <FiCheck /> Đã trả lời
                    </button>
                </div>

                {error && (
                    <div className="hm-alert hm-alert-error">
                        <FiAlertCircle />
                        <span>{error}</span>
                    </div>
                )}

                <div className="hm-sidebar-stats">
                    <div className="hm-stat-card">
                        <FiMessageSquare />
                        <strong>{threads.length}</strong>
                        <span>Cuộc trò chuyện</span>
                    </div>
                    <div className="hm-stat-card">
                        <FiInbox />
                        <strong>{totalUnread}</strong>
                        <span>Chưa đọc</span>
                    </div>
                </div>

                <div className="hm-thread-list">
                    {loadingThreads && <div className="hm-empty-state">Đang tải danh sách chat...</div>}
                    {!loadingThreads && groupedThreads.length === 0 && (
                        <div className="hm-empty-state">
                            <FiMessageSquare />
                            <span>Không có hội thoại phù hợp.</span>
                        </div>
                    )}

                    {groupedThreads.map((group) => {
                        const hotelId = group.hotel?.id || 'unknown';
                        const isExpanded = expandedHotels[hotelId] ?? true;
                        return (
                            <div key={hotelId} className="hm-thread-group">
                                <button className="hm-group-header" onClick={() => toggleHotelGroup(hotelId)}>
                                    <div className="hm-group-title">
                                        <span className="hm-group-badge">{getInitial(group.hotel?.name)}</span>
                                        <div>
                                            <strong>{group.hotel?.name || 'Khách sạn chưa rõ'}</strong>
                                            <p>{group.threads.length} cuộc trò chuyện</p>
                                        </div>
                                    </div>
                                    <div className="hm-group-actions">
                                        {group.unreadCount > 0 && <span className="hm-unread-pill">{group.unreadCount}</span>}
                                        {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="hm-group-threads">
                                        {group.threads.map((thread) => {
                                            const isActive = thread.id === selectedThread?.id;
                                            const status = getThreadStatus(thread);
                                            return (
                                                <button
                                                    key={thread.id}
                                                    className={`hm-thread-item ${isActive ? 'active' : ''}`}
                                                    onClick={() => setSelectedThread(thread)}
                                                >
                                                    <div className="hm-thread-avatar">{getInitial(thread.user?.name, 'K')}</div>
                                                    <div className="hm-thread-meta">
                                                        <div className="hm-thread-topline">
                                                            <strong>{thread.user?.name || 'Khách ẩn danh'}</strong>
                                                            <div className="hm-thread-topline-right">
                                                                {thread.hm_unread_count > 0 && <span className="hm-unread-dot">{thread.hm_unread_count}</span>}
                                                                {thread.last_message_at && <span><FiClock /> {formatRelativeTime(thread.last_message_at)}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="hm-thread-subline">{thread.hotel?.name || 'N/A'}</div>
                                                        <div className="hm-thread-preview">{buildThreadPreview(thread)}</div>
                                                        <div className="hm-thread-footnote">
                                                            <span className={`hm-status-tag ${status.tone}`}>{status.label}</span>
                                                            <span>•</span>
                                                            <span>{thread.last_message_at ? `Cập nhật lúc ${formatClockTime(thread.last_message_at)}` : 'Chưa có hoạt động'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="hm-thread-actions">
                                                        <button
                                                            type="button"
                                                            className="hm-thread-action mark"
                                                            title="Đánh dấu đã xử lý"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                markThreadHandled(thread.id);
                                                            }}
                                                        >
                                                            <FiCheck />
                                                        </button>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>

            <main className="hm-chat-panel">
                <header className="hm-chat-panel-header">
                    <div>
                        <div className="hm-panel-title">Chat room</div>
                        <h3>{selectedThread ? `${selectedThread.hotel?.name || 'N/A'} • ${selectedThread.user?.name || 'Khách ẩn danh'}` : 'Chọn một hội thoại'}</h3>
                        <p>{selectedThread ? 'Đang xem toàn bộ lịch sử trao đổi của khách.' : 'Chọn một cuộc trò chuyện để bắt đầu.'}</p>
                    </div>
                    <div className="hm-connection-pill"><FiWifi /> Live</div>
                </header>

                <section className="hm-chat-messages" ref={scrollRef}>
                    <div ref={topSentinelRef} />
                    {messageLoadingMore && <div className="hm-load-more">Đang tải thêm tin nhắn cũ...</div>}
                    {loadingThread && <div className="hm-empty-state">Đang tải tin nhắn...</div>}
                    {!loadingThread && !selectedThread && (
                        <div className="hm-empty-state hm-empty-hero">
                            <FiMessageSquare />
                            <h4>Chọn một cuộc trò chuyện</h4>
                            <p>Giao diện này giúp bạn theo dõi và phản hồi khách hàng theo từng khách sạn một cách nhanh hơn.</p>
                        </div>
                    )}

                    {visibleMessages.map((msg) => {
                        const isManager = msg.sender_type === 'hm';
                        return (
                            <article key={msg.id} className={`hm-message-row ${isManager ? 'outgoing' : 'incoming'}`}>
                                <div className="hm-message-bubble">
                                    <div className="hm-message-content">{msg.content}</div>
                                    <div className="hm-message-time">{formatClockTime(msg.created_at)}</div>
                                </div>
                            </article>
                        );
                    })}
                </section>

                <footer className="hm-chat-composer">
                    <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={selectedThread ? 'Nhập phản hồi của bạn...' : 'Chọn hội thoại trước'}
                        disabled={!selectedThread || sending}
                        rows={2}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                    <div className="hm-composer-actions">
                        <span className="hm-composer-hint">Enter để gửi, Shift + Enter để xuống dòng</span>
                        <button onClick={sendMessage} disabled={!selectedThread || !messageText.trim() || sending}>
                            {sending ? 'Đang gửi...' : <><FiSend /> Gửi phản hồi</>}
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default HotelManagerChatDashboard;
