import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import SettingPage from "./SettingPage";

vi.mock("../../../services/authService", () => ({
  authService: { getAllUsers: vi.fn() },
}));
vi.mock("../../../services/dashBoardService", () => ({
  dashboardService: { getDashboardRevenue: vi.fn() },
}));
vi.mock("../../../services/bookingService", () => ({
  bookingService: { getAllBookings: vi.fn() },
}));
vi.mock("../../../services/hotelService", () => ({
  hotelService: { getAllHotels: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn() },
}));

// eslint-disable-next-line import/first
import { authService } from "../../../services/authService";
// eslint-disable-next-line import/first
import { dashboardService } from "../../../services/dashBoardService";
// eslint-disable-next-line import/first
import { bookingService } from "../../../services/bookingService";
// eslint-disable-next-line import/first
import { hotelService } from "../../../services/hotelService";
// eslint-disable-next-line import/first
import Swal from "sweetalert2";
// eslint-disable-next-line import/first
import { toast } from "react-toastify";

describe("Admin - SettingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("render stats và cập nhật sau khi load", async () => {
    authService.getAllUsers.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    dashboardService.getDashboardRevenue.mockResolvedValueOnce(123456);
    bookingService.getAllBookings.mockResolvedValueOnce({ data: [{ id: 1 }] });
    hotelService.getAllHotels.mockResolvedValueOnce([{ id: 1 }, { id: 2 }, { id: 3 }]);

    render(<SettingPage />);

    // loading shows "-"
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument(); // total users
      expect(screen.getByText("3")).toBeInTheDocument(); // total hotels
      expect(screen.getByText("1")).toBeInTheDocument(); // total bookings
    });
  });

  test("bấm chỉnh sửa: input enabled, bấm lưu confirm Swal và toast success", async () => {
    authService.getAllUsers.mockResolvedValueOnce([]);
    dashboardService.getDashboardRevenue.mockResolvedValueOnce(0);
    bookingService.getAllBookings.mockResolvedValueOnce({ data: [] });
    hotelService.getAllHotels.mockResolvedValueOnce([]);

    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    render(<SettingPage />);

    const siteNameInput = screen.getByDisplayValue("SHCS Hotel Booking");
    expect(siteNameInput).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /chỉnh sửa/i }));

    expect(siteNameInput).not.toBeDisabled();

    fireEvent.change(siteNameInput, { target: { value: "New Name" } });

    fireEvent.click(screen.getByRole("button", { name: /lưu/i }));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});

