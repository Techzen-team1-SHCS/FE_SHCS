import styles from "../ManageBooking.module.css"

export const getTabLabel = (tab) => {
    switch (tab) {
        case "active": return "Đang chờ";
        case "past": return "Hoàn thành";
        case "cancelled": return "Đã hủy";
        default: return tab;
    }
};

export const getTabIcon = (tab) => {
    switch (tab) {
        case "active": return "⏳";
        case "past": return "✅";
        case "cancelled": return "❌";
        default: return "📋";
    }
};

export const getStatusConfig = (status) => {
    switch (status) {
        case "pending":
            return {
                label: "Đang chờ xác nhận",
                icon: "⏳",
                color: "#FFA500",
                bgColor: "#FFF9E6",
                borderColor: "#FFD700",
                badgeStyle: styles.pendingBadge
            };
        case "completed":
            return {
                label: "Đã hoàn thành",
                icon: "✅",
                color: "#10B981",
                bgColor: "#ECFDF5",
                borderColor: "#34D399",
                badgeStyle: styles.completedBadge
            };
        case "cancelled":
            return {
                label: "Đã hủy",
                icon: "❌",
                color: "#EF4444",
                bgColor: "#FEF2F2",
                borderColor: "#FCA5A5",
                badgeStyle: styles.cancelledBadge
            };
        default:
            return {
                label: "Không xác định",
                icon: "❓",
                color: "#6B7280",
                bgColor: "#F3F4F6",
                borderColor: "#D1D5DB",
                badgeStyle: styles.unknownBadge
            };
    }
};
export const filterBookingsByTab = (bookings, activeTab) => {
    if (activeTab === "active") {
        return bookings.filter(b => b.status === "pending");
    }

    if (activeTab === "past") {
        return bookings.filter(b => b.status === "completed");
    }

    if (activeTab === "cancelled") {
        return bookings.filter(b => b.status === "cancelled");
    }

    return bookings;
};

export const calculateBookingStats = (bookings) => {
    return {
        active: bookings.filter(b => b.status === "pending").length,
        past: bookings.filter(b => b.status === "completed").length,
        cancelled: bookings.filter(b => b.status === "cancelled").length
    };
};