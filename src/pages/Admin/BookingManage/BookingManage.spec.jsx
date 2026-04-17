import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookingManage from "./BookingManage";
import { AuthContext } from "../../../contexts/AuthContext";

vi.mock("../../../services/bookingService", () => ({
  bookingService: {
    getAllBookings: vi.fn(),
    updateBooking: vi.fn(),
    DeleteBooking: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

// eslint-disable-next-line import/first
import { bookingService } from "../../../services/bookingService";
// eslint-disable-next-line import/first
import Swal from "sweetalert2";
// eslint-disable-next-line import/first
import { toast } from "react-toastify";

function renderWithProviders(ui, { user } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <AuthContext.Provider value={{ user, token: "t", login: vi.fn(), logout: vi.fn(), updateUser: vi.fn() }}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </AuthContext.Provider>
  );
}

describe("Admin - BookingManage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("render bảng booking từ API", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          quantity: 2,
          guests: 3,
          check_in: "2026-03-27 10:00:00",
          check_out: "2026-03-28 10:00:00",
          total_price: 1000000,
          status: "confirmed",
          payment_status: "bonding",
          user: { name: "Customer A", email: "c@ex.com", phone: "0123" },
        },
      ],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    expect(await screen.findByText("Tổng tiền")).toBeInTheDocument();
    expect(await screen.findByText("1")).toBeInTheDocument(); // booking id cell
  });

  test("đổi trạng thái booking gọi bookingService.updateBooking", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [
        {
          id: 2,
          quantity: 1,
          guests: 2,
          check_in: "2026-03-27 10:00:00",
          check_out: "2026-03-28 10:00:00",
          total_price: 500000,
          status: "confirmed",
          payment_status: "bonding",
          user: { name: "Customer B" },
        },
      ],
    });

    bookingService.updateBooking.mockResolvedValueOnce({});

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    // There are 2 selects per row: payment + booking status.
    const selects = await screen.findAllByRole("combobox");
    const bookingStatusSelect = selects[1];

    fireEvent.change(bookingStatusSelect, { target: { value: "completed" } });

    await waitFor(() =>
      expect(bookingService.updateBooking).toHaveBeenCalledWith(2, { status: "completed" })
    );
  });

  test("bấm xem chi tiết mở sidebar", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [
        {
          id: 3,
          quantity: 1,
          guests: 2,
          check_in: "2026-03-27 10:00:00",
          check_out: "2026-03-28 10:00:00",
          total_price: 500000,
          status: "confirmed",
          payment_status: "bonding",
          user: { name: "Customer C" },
        },
      ],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("3");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));

    const headings = await screen.findAllByRole("heading", { name: "Chi tiết đặt phòng" });
    expect(headings.length).toBeGreaterThan(0);
    expect(await screen.findByText("Đặt phòng #3")).toBeInTheDocument();
  });

  test("xóa booking: confirm Swal rồi gọi DeleteBooking", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [
        {
          id: 4,
          quantity: 1,
          guests: 2,
          check_in: "2026-03-27 10:00:00",
          check_out: "2026-03-28 10:00:00",
          total_price: 500000,
          status: "confirmed",
          payment_status: "bonding",
          user: { name: "Customer D" },
        },
      ],
    });

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    bookingService.DeleteBooking.mockResolvedValueOnce({});

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("4");

    fireEvent.click(screen.getByTitle("Xóa"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    await waitFor(() => expect(bookingService.DeleteBooking).toHaveBeenCalledWith(4));
  });

  test("xử lý lỗi API khi update booking", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ id: 5, user: { name: "User" }, total_price: 100 }],
    });
    bookingService.updateBooking.mockRejectedValueOnce(new Error("Update failed"));
    renderWithProviders(<BookingManage />);
    
    // Đổi status -> error toast
    const selects = await screen.findAllByRole("combobox");
    if(selects.length > 1) {
        fireEvent.change(selects[1], { target: { value: "completed" } });
        await waitFor(() => expect(toast.error).toHaveBeenCalled());
    }
  });

  test("bấm render danh sách trống", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [],
    });
    renderWithProviders(<BookingManage />);
    expect(await screen.findByText("Không tìm thấy đặt phòng nào")).toBeInTheDocument();
  });

});

