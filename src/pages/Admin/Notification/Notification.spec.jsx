import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Notification from "./Notification";

vi.mock("../../../services/notificationService", () => ({
  notificationService: {
    getNotifications: vi.fn(),
    getPendingHotels: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    approveHotel: vi.fn(),
    rejectHotel: vi.fn(),
  },
}));

import { notificationService } from "../../../services/notificationService";

describe("Admin - Notification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loading rồi render pending hotels + notifications", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      {
        id: 1,
        name: "Hotel Pending",
        description: "Desc",
        province: "Hanoi",
        price: 1000,
        user: { name: "Mgr" },
      },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 10,
        type: "system",
        title: "System update",
        desc: "Hello",
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);

    render(<Notification />);

    expect(screen.getByText("Notifications")).toBeInTheDocument();

    expect(
      await screen.findByText(
        (t) => t.includes("Pending Hotel Approvals") && t.includes("(1)"),
        {},
        { timeout: 6000 }
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Hotel Pending")).toBeInTheDocument();
    expect(screen.getByText("System update")).toBeInTheDocument();
  }, 15000);

  test("click notification unread sẽ gọi markAsRead", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 11,
        type: "system",
        title: "Unread noti",
        desc: "Hello",
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);
    notificationService.markAsRead.mockResolvedValueOnce({});

    render(<Notification />);

    fireEvent.click(await screen.findByText("Unread noti", {}, { timeout: 6000 }));

    await waitFor(() => expect(notificationService.markAsRead).toHaveBeenCalledWith(11));
  }, 15000);

  test("click notification đã read KHÔNG gọi markAsRead", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 12,
        type: "system",
        title: "Read noti",
        desc: "Hello",
        read: true,
        created_at: new Date().toISOString(),
      },
    ]);

    render(<Notification />);

    fireEvent.click(await screen.findByText("Read noti", {}, { timeout: 6000 }));

    expect(notificationService.markAsRead).not.toHaveBeenCalled();
  }, 15000);

  test("markAsRead lỗi không crash", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 13,
        type: "system",
        title: "Error noti",
        desc: "Hello",
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);
    notificationService.markAsRead.mockRejectedValueOnce(new Error("Mark fail"));

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Notification />);
    fireEvent.click(await screen.findByText("Error noti", {}, { timeout: 6000 }));

    await waitFor(() => expect(errSpy).toHaveBeenCalled());
    errSpy.mockRestore();
  }, 15000);

  test("mark all as read gọi API", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 14,
        type: "system",
        title: "Noti 1",
        desc: "Hello",
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);
    notificationService.markAllAsRead.mockResolvedValueOnce({});

    render(<Notification />);

    const markAllBtn = await screen.findByRole(
      "button",
      { name: "Mark all as read" },
      { timeout: 6000 }
    );
    fireEvent.click(markAllBtn);

    await waitFor(() => expect(notificationService.markAllAsRead).toHaveBeenCalled());
  }, 15000);

  test("mark all as read lỗi không crash", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 15,
        type: "system",
        title: "Noti err",
        desc: "Hello",
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);
    notificationService.markAllAsRead.mockRejectedValueOnce(new Error("Mark all fail"));

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Notification />);
    const markAllBtn = await screen.findByRole("button", { name: "Mark all as read" }, { timeout: 6000 });
    fireEvent.click(markAllBtn);

    await waitFor(() => expect(errSpy).toHaveBeenCalled());
    errSpy.mockRestore();
  }, 15000);

  test("hiển thị danh sách trống khi không có data", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([]);

    render(<Notification />);

    expect(await screen.findByText("No notifications yet", {}, { timeout: 6000 })).toBeInTheDocument();
  });

  test("bấm approve hotel thành công", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      { id: 1, name: "Hotel 1", province: "HN" },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([]);
    notificationService.approveHotel.mockResolvedValueOnce({});
    notificationService.getNotifications.mockResolvedValueOnce([
      { id: 100, type: "hotel_approved", title: "Hotel approved", desc: "OK", read: true, created_at: new Date().toISOString() },
    ]);

    render(<Notification />);

    const approveBtn = await screen.findByRole("button", { name: "✓ Approve" }, { timeout: 6000 });
    fireEvent.click(approveBtn);

    await waitFor(() => expect(notificationService.approveHotel).toHaveBeenCalledWith(1));
    // Hotel should be removed from pending list
    await waitFor(() => expect(screen.queryByText("Hotel 1")).not.toBeInTheDocument());
  }, 15000);

  test("bấm approve hotel gọi API và báo lỗi nếu có", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      { id: 1, name: "Hotel 1", province: "HN" },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([]);

    notificationService.approveHotel.mockRejectedValueOnce({
      response: { data: { message: "Approve failed" } },
    });

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<Notification />);

    const approveBtn = await screen.findByRole("button", { name: "✓ Approve" }, { timeout: 6000 });
    fireEvent.click(approveBtn);

    await waitFor(() => expect(notificationService.approveHotel).toHaveBeenCalledWith(1));
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("Lỗi duyệt khách sạn: Approve failed"));
    alertSpy.mockRestore();
  }, 15000);

  test("xử lý reject hotel thành công", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      { id: 2, name: "Hotel 2", province: "HCM" },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([]);
    notificationService.rejectHotel.mockResolvedValueOnce({});
    notificationService.getNotifications.mockResolvedValueOnce([]);

    render(<Notification />);

    const rejectBtn = await screen.findByRole("button", { name: "✕ Reject" }, { timeout: 6000 });
    fireEvent.click(rejectBtn);

    expect(await screen.findByText("Reject Hotel")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText("Reason for rejection...");
    fireEvent.change(textarea, { target: { value: "Not good enough" } });

    fireEvent.click(screen.getByRole("button", { name: "Confirm Rejection" }));

    await waitFor(() => expect(notificationService.rejectHotel).toHaveBeenCalledWith(2, "Not good enough"));
    await waitFor(() => expect(screen.queryByText("Hotel 2")).not.toBeInTheDocument());
  }, 15000);

  test("xử lý reject hotel với reason (show modal -> fill -> confirm -> catch error)", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      { id: 2, name: "Hotel 2", province: "HCM" },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([]);

    notificationService.rejectHotel.mockRejectedValueOnce(new Error("Net Error"));

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<Notification />);

    // Click Reject button
    const rejectBtn = await screen.findByRole("button", { name: "✕ Reject" }, { timeout: 6000 });
    fireEvent.click(rejectBtn);

    // Modal appears
    expect(await screen.findByText("Reject Hotel")).toBeInTheDocument();

    // Fill reason
    const textarea = screen.getByPlaceholderText("Reason for rejection...");
    fireEvent.change(textarea, { target: { value: "Not enough info" } });

    // Cancel modal first (for coverage of setShowRejectModal(null))
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);

    // Click Reject again
    fireEvent.click(screen.getByRole("button", { name: "✕ Reject" }));
    fireEvent.change(screen.getByPlaceholderText("Reason for rejection..."), { target: { value: "Test reject" } });

    // Confirm
    const confirmBtn = screen.getByRole("button", { name: "Confirm Rejection" });
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(notificationService.rejectHotel).toHaveBeenCalledWith(2, "Test reject"));
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("Lỗi từ chối khách sạn: Net Error"));
    alertSpy.mockRestore();
  }, 15000);

  test("reject hotel mà không nhập reason => dùng default reason", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      { id: 3, name: "Hotel 3", province: "DN" },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([]);
    notificationService.rejectHotel.mockResolvedValueOnce({});
    notificationService.getNotifications.mockResolvedValueOnce([]);

    render(<Notification />);

    const rejectBtn = await screen.findByRole("button", { name: "✕ Reject" }, { timeout: 6000 });
    fireEvent.click(rejectBtn);

    // Don't fill reason, just confirm
    fireEvent.click(screen.getByRole("button", { name: "Confirm Rejection" }));

    await waitFor(() =>
      expect(notificationService.rejectHotel).toHaveBeenCalledWith(3, "Admin không chấp nhận")
    );
  }, 15000);

  test("bấm Refresh gọi lại fetchAllData", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      { id: 1, name: "Hotel 1", province: "HN" },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([
      { id: 10, type: "system", title: "Noti", desc: "D", created_at: new Date().toISOString() },
    ]);

    render(<Notification />);

    const refreshBtn = await screen.findByRole("button", { name: "Refresh" }, { timeout: 6000 });

    // Setup for refetch
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([]);

    fireEvent.click(refreshBtn);

    // fetchAllData has a 1500ms delay, so we need to wait longer
    await waitFor(() => {
      expect(notificationService.getPendingHotels).toHaveBeenCalledTimes(2);
    }, { timeout: 10000 });
  }, 20000);

  test("fetchAllData lỗi => set empty arrays", async () => {
    notificationService.getPendingHotels.mockRejectedValueOnce(new Error("Fetch fail"));
    notificationService.getNotifications.mockRejectedValueOnce(new Error("Fetch fail"));

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Notification />);

    expect(await screen.findByText("No notifications yet", {}, { timeout: 6000 })).toBeInTheDocument();
    errSpy.mockRestore();
  }, 15000);

  test("formatTimeAgo các nhánh thời gian", async () => {
    const now = new Date();
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 1,
        type: "system",
        title: "Noti recent",
        desc: "D",
        created_at: now.toISOString(), // < 1 min ago => "Just now"
        time: "10:00",
      },
      {
        id: 2,
        type: "booking",
        title: "Noti minutes",
        desc: "D",
        created_at: new Date(now - 5 * 60000).toISOString(), // 5 mins ago
      },
      {
        id: 3,
        type: "payment",
        title: "Noti hours",
        desc: "D",
        created_at: new Date(now - 3 * 3600000).toISOString(), // 3 hours ago
      },
      {
        id: 4,
        type: "cancel_booking",
        title: "Noti days",
        desc: "D",
        created_at: new Date(now - 2 * 86400000).toISOString(), // 2 days ago
      },
      {
        id: 5,
        type: "Registration_Successful",
        title: "Noti weeks",
        description: "D via description field",
        created_at: new Date(now - 10 * 86400000).toISOString(), // 10 days ago
      },
    ]);

    render(<Notification />);

    expect(await screen.findByText("Noti recent", {}, { timeout: 6000 })).toBeInTheDocument();
    expect(screen.getByText("Noti minutes")).toBeInTheDocument();
    expect(screen.getByText("Noti hours")).toBeInTheDocument();
    expect(screen.getByText("Noti days")).toBeInTheDocument();
    expect(screen.getByText("Noti weeks")).toBeInTheDocument();
    // Verify formatTimeAgo output exists
    expect(screen.getAllByText("Just now").length).toBeGreaterThanOrEqual(1);
  }, 15000);

  test("notification với type không có trong NOTIFICATION_TYPES", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 20,
        type: "unknown_type",
        title: "Unknown Type",
        desc: "D",
        created_at: new Date().toISOString(),
      },
    ]);

    render(<Notification />);
    expect(await screen.findByText("Unknown Type", {}, { timeout: 6000 })).toBeInTheDocument();
  }, 15000);

  test("notification dùng _id thay vì id", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        _id: "abc",
        type: "system",
        title: "Mongo ID noti",
        desc: "D",
        created_at: new Date().toISOString(),
      },
    ]);

    render(<Notification />);
    expect(await screen.findByText("Mongo ID noti", {}, { timeout: 6000 })).toBeInTheDocument();
  }, 15000);

  test("pending hotel không có user => hiển thị Unknown Manager", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      { id: 5, name: "No User Hotel", province: "HN", price: 500 },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([]);

    render(<Notification />);
    expect(
      await screen.findByText((content) => content.includes("Unknown Manager"), {}, { timeout: 6000 })
    ).toBeInTheDocument();
  }, 15000);

  test("notification dùng date thay vì created_at", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 30,
        type: "system",
        title: "Date field noti",
        desc: "D",
        date: new Date().toISOString(),
      },
    ]);

    render(<Notification />);
    expect(await screen.findByText("Date field noti", {}, { timeout: 6000 })).toBeInTheDocument();
  }, 15000);

  test("notification fallback title/desc", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 50,
        type: "system",
      },
    ]);

    render(<Notification />);
    // Just check it doesn't crash
    expect(await screen.findByText("system", {}, { timeout: 6000 })).toBeInTheDocument();
  }, 15000);

  test("approve hotel error fallback message", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
        { id: 10, name: "Hotel X", province: "HN" },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([]);
    notificationService.approveHotel.mockRejectedValueOnce(new Error("Unknown error"));

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Notification />);
    const approveBtn = await screen.findByRole("button", { name: "✓ Approve" }, { timeout: 6000 });
    fireEvent.click(approveBtn);

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("Lỗi duyệt khách sạn: Unknown error"));
    alertSpy.mockRestore();
  }, 15000);

  test("handleMarkAllAsRead error branches", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([{ id: 40, is_read: false }]);
    notificationService.markAllAsRead.mockRejectedValueOnce(new Error("Err"));

    render(<Notification />);
    const btn = await screen.findByText("Mark all as read", {}, { timeout: 6000 });
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    fireEvent.click(btn);
    await waitFor(() => expect(errSpy).toHaveBeenCalled());
    errSpy.mockRestore();
  }, 15000);
});
