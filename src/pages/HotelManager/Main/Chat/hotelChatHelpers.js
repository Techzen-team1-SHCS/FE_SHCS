export const PAGE_SIZE = 25;
export const VIRTUAL_WINDOW = 40;

export const getInitial = (value, fallback = 'H') => {
    const text = String(value || '').trim();
    return (text[0] || fallback).toUpperCase();
};

export const formatRelativeTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('vi-VN');
};

export const formatClockTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const buildThreadPreview = (thread) => {
    const lastMessage = String(thread?.last_message || '').trim();
    if (!lastMessage) return 'Chưa có tin nhắn';
    return lastMessage.length > 120 ? `${lastMessage.slice(0, 120)}...` : lastMessage;
};

export const getThreadStatus = (thread) => {
    const unreadCount = Number(thread?.hm_unread_count || 0);
    const hasLastMessage = Boolean(thread?.last_message);
    const lastReadAt = thread?.hm_last_read_at ? new Date(thread.hm_last_read_at).getTime() : 0;
    const lastMessageAt = thread?.last_message_at ? new Date(thread.last_message_at).getTime() : 0;

    if (unreadCount > 0) {
        return {
            key: 'chua_phan_hoi',
            label: 'Chưa phản hồi',
            tone: 'danger',
        };
    }

    if (hasLastMessage && lastMessageAt > lastReadAt) {
        return {
            key: 'dang_doc',
            label: 'Đang đọc',
            tone: 'warning',
        };
    }

    return {
        key: 'da_tra_loi',
        label: 'Đã trả lời',
        tone: 'success',
    };
};

export const groupThreadsByHotel = (threads) => {
    const grouped = threads.reduce((acc, thread) => {
        const key = thread.hotel?.id || 'unknown';
        if (!acc[key]) {
            acc[key] = {
                hotel: thread.hotel,
                threads: [],
                unreadCount: 0,
            };
        }

        acc[key].threads.push(thread);
        acc[key].unreadCount += Number(thread.hm_unread_count || 0);
        return acc;
    }, {});

    return Object.values(grouped).map((group) => ({
        ...group,
        threads: group.threads.sort((a, b) => {
            const aTime = new Date(a.last_message_at || a.updated_at || 0).getTime();
            const bTime = new Date(b.last_message_at || b.updated_at || 0).getTime();
            return bTime - aTime;
        }),
    }));
};
