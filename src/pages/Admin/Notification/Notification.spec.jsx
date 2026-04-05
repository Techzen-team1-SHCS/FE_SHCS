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

// eslint-disable-next-line import/first
import { notificationService } from "../../../services/notificationService";

describe("Admin - Notification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loading rồi render pending hotels + notifications", async () => {
    notificationService.getPendingHotels.mockResolvedValueOnce([
      { id: 1, name: "Hotel Pending", description: "Desc", province: "Hanoi", price: 1000, user: { name: "Mgr" } },
    ]);
    notificationService.getNotifications.mockResolvedValueOnce([
      {
        id: 10,
        type: "system",
        title: "System update",
        desc: "Hello",
        read: false,
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
        read: false,
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
        read: false,
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
});

