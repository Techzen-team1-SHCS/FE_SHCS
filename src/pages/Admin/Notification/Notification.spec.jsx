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

  test("mark all as read gọi API", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 12,
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

  test("hiển thị danh sách trống khi không có data", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([]);
    notificationService.getNotifications.mockResolvedValueOnce([]);

    render(<Notification />);

    expect(await screen.findByText("No notifications yet", {}, { timeout: 6000 })).toBeInTheDocument();
  });

  test("bấm approve hotel gọi API và báo lỗi nếu có", async () => {
    const defaultPending = [
      { id: 1, name: "Hotel 1", province: "HN" }
    ];
    notificationService.getPendingHotels.mockResolvedValueOnce(defaultPending);
    notificationService.getNotifications.mockResolvedValueOnce([]);
    
    notificationService.approveHotel.mockRejectedValueOnce({
      response: { data: { message: "Approve failed" } }
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Notification />);

    const approveBtn = await screen.findByRole("button", { name: "✓ Approve" }, { timeout: 6000 });
    fireEvent.click(approveBtn);

    await waitFor(() => expect(notificationService.approveHotel).toHaveBeenCalledWith(1));
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("Lỗi duyệt khách sạn: Approve failed"));
  });

  test("xử lý reject hotel với reason (show modal -> fill -> confirm -> catch error)", async () => {
    const defaultPending = [
      { id: 2, name: "Hotel 2", province: "HCM" }
    ];
    notificationService.getPendingHotels.mockResolvedValueOnce(defaultPending);
    notificationService.getNotifications.mockResolvedValueOnce([]);
    
    notificationService.rejectHotel.mockRejectedValueOnce(new Error("Net Error"));

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

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
  });
});
