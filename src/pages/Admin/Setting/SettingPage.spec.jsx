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

function mockAllStats() {
  authService.getAllUsers.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
  dashboardService.getDashboardRevenue.mockResolvedValueOnce(123456);
  bookingService.getAllBookings.mockResolvedValueOnce({ data: [{ id: 1 }] });
  hotelService.getAllHotels.mockResolvedValueOnce([{ id: 1 }, { id: 2 }, { id: 3 }]);
}

describe("Admin - SettingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("render stats và cập nhật sau khi load", async () => {
    mockAllStats();

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
    mockAllStats();
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

  test("bấm lưu nhưng cancel Swal => không lưu", async () => {
    mockAllStats();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

    render(<SettingPage />);

    fireEvent.click(screen.getByRole("button", { name: /chỉnh sửa/i }));
    fireEvent.click(screen.getByRole("button", { name: /lưu/i }));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    // toast.success should NOT be called
    expect(toast.success).not.toHaveBeenCalled();
  });

  test("bấm chỉnh sửa rồi bấm Hủy => quay lại disabled", async () => {
    mockAllStats();

    render(<SettingPage />);

    const siteNameInput = screen.getByDisplayValue("SHCS Hotel Booking");

    fireEvent.click(screen.getByRole("button", { name: /chỉnh sửa/i }));
    expect(siteNameInput).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /hủy/i }));
    expect(siteNameInput).toBeDisabled();
  });

  test("thay đổi tất cả input settings", async () => {
    mockAllStats();

    render(<SettingPage />);

    fireEvent.click(screen.getByRole("button", { name: /chỉnh sửa/i }));

    // Email
    const emailInput = screen.getByDisplayValue("vit76404@gmail.com");
    fireEvent.change(emailInput, { target: { value: "new@email.com" } });
    expect(emailInput.value).toBe("new@email.com");

    // Phone
    const phoneInput = screen.getByDisplayValue("0774594729");
    fireEvent.change(phoneInput, { target: { value: "0111222333" } });
    expect(phoneInput.value).toBe("0111222333");

    // Max upload size
    const uploadInput = screen.getByDisplayValue("5");
    fireEvent.change(uploadInput, { target: { value: "10" } });
    expect(uploadInput.value).toBe("10");

    // Maintenance checkbox
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test("xử lý lỗi khi load dữ liệu", async () => {
    authService.getAllUsers.mockRejectedValueOnce(new Error("Net error"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<SettingPage />);
    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Lỗi khi lấy thông tin thống kê"));
    errorSpy.mockRestore();
  });

  test("handleSaveSettings: lưu thành công", async () => {
    mockAllStats();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    render(<SettingPage />);

    fireEvent.click(screen.getByRole("button", { name: /chỉnh sửa/i }));
    fireEvent.click(screen.getByRole("button", { name: /lưu/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Lưu cài đặt thành công!"));

    const siteNameInput = screen.getByDisplayValue("SHCS Hotel Booking");
    expect(siteNameInput).toBeDisabled();
  });

  test("handleSaveSettings - cover catch block", async () => {
    mockAllStats();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    
    const successSpy = vi.spyOn(toast, "success").mockImplementationOnce(() => {
        throw new Error("Random error");
    });

    render(<SettingPage />);
    fireEvent.click(screen.getByRole("button", { name: /chỉnh sửa/i }));
    fireEvent.click(screen.getByRole("button", { name: /lưu/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Lưu thất bại: Random error"));
    successSpy.mockRestore();
  });

  test("stats khi bookings trả về array trực tiếp (không có data property)", async () => {
    authService.getAllUsers.mockResolvedValueOnce([{ id: 1 }]);
    dashboardService.getDashboardRevenue.mockResolvedValueOnce(99999);
    bookingService.getAllBookings.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]); // array directly
    hotelService.getAllHotels.mockResolvedValueOnce([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

    render(<SettingPage />);

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument(); // totalUsers
      expect(screen.getByText("4")).toBeInTheDocument(); // totalHotels
      expect(screen.getByText("2")).toBeInTheDocument(); // totalBookings via bookings.length
    });
  });

  test("stats fallback to 0 when data is null/undefined", async () => {
    authService.getAllUsers.mockResolvedValueOnce(null);
    dashboardService.getDashboardRevenue.mockResolvedValueOnce(null);
    bookingService.getAllBookings.mockResolvedValueOnce(null);
    hotelService.getAllHotels.mockResolvedValueOnce(null);

    render(<SettingPage />);

    await waitFor(() => {
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThanOrEqual(3);
    });
  });
});