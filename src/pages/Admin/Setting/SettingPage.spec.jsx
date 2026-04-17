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

// Mock toàn bộ api.js để chặn mọi request network
vi.mock("../../../services/api.js", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { is_maintenance: false } }),
    post: vi.fn().mockResolvedValue({ data: { is_maintenance: false, message: "OK" } }),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

import { authService } from "../../../services/authService";
import { dashboardService } from "../../../services/dashBoardService";
import { bookingService } from "../../../services/bookingService";
import { hotelService } from "../../../services/hotelService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

describe("Admin - SettingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("render stats và cập nhật sau khi load", async () => {
    // Trả về array trực tiếp — đúng với hotels?.length trong SettingPage.jsx
    authService.getAllUsers.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    dashboardService.getDashboardRevenue.mockResolvedValueOnce(123456);
    bookingService.getAllBookings.mockResolvedValueOnce({ data: [{ id: 1 }] });
    hotelService.getAllHotels.mockResolvedValueOnce([{ id: 1 }, { id: 2 }, { id: 3 }]); // ✅ array trực tiếp

    render(<SettingPage />);

    // Lúc đang loading, hiển thị "-"
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();  // totalUsers
      expect(screen.getByText("3")).toBeInTheDocument();  // totalHotels
      expect(screen.getByText("1")).toBeInTheDocument();  // totalBookings
    });
  });

  test("bấm chỉnh sửa: input enabled, bấm lưu confirm Swal và toast success", async () => {
    authService.getAllUsers.mockResolvedValueOnce([]);
    dashboardService.getDashboardRevenue.mockResolvedValueOnce(0);
    bookingService.getAllBookings.mockResolvedValueOnce({ data: [] });
    hotelService.getAllHotels.mockResolvedValueOnce([]); // ✅ array trực tiếp

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

  test("xử lý lỗi khi load dữ liệu", async () => {
    authService.getAllUsers.mockRejectedValueOnce(new Error("Net error"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    render(<SettingPage />);
    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
  });

});