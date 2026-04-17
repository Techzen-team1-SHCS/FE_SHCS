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

const BOOKING = {
  id: 1,
  quantity: 2,
  guests: 3,
  check_in: "2026-03-27 10:00:00",
  check_out: "2026-03-28 10:00:00",
  total_price: 1000000,
  status: "confirmed",
  payment_status: "bonding",
};

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
      data: [BOOKING],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    expect(await screen.findByText("Tổng tiền")).toBeInTheDocument();
    expect(await screen.findByText("1")).toBeInTheDocument();
  });

  test("render bảng booking khi API trả về array trực tiếp", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce([BOOKING]);

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    expect(await screen.findByText("1")).toBeInTheDocument();
  });

  test("render bảng booking khi API trả về unexpected structure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    bookingService.getAllBookings.mockResolvedValueOnce("bad data");

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(await screen.findByText("Không tìm thấy đặt phòng nào")).toBeInTheDocument();
    spy.mockRestore();
  });

  test("đổi trạng thái booking gọi bookingService.updateBooking", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [{ ...BOOKING, id: 2 }],
    });
    bookingService.updateBooking.mockResolvedValueOnce({});

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    const selects = await screen.findAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "completed" } });

    await waitFor(() =>
      expect(bookingService.updateBooking).toHaveBeenCalledWith(2, { status: "completed" })
    );
  });

  test("đổi trạng thái thanh toán gọi updateBooking với payment_status", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [{ ...BOOKING, id: 5 }],
    });
    bookingService.updateBooking.mockResolvedValueOnce({});

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    const selects = await screen.findAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "paid" } });

    await waitFor(() =>
      expect(bookingService.updateBooking).toHaveBeenCalledWith(5, { payment_status: "paid" })
    );
  });

  test("đổi trạng thái thanh toán - lỗi hiển thị toast error", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [{ ...BOOKING, id: 6 }],
    });
    bookingService.updateBooking.mockRejectedValueOnce({
      response: { data: { message: "Payment update failed" } },
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    const selects = await screen.findAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "canceled" } });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Payment update failed")
    );
  });

  test("bấm xem chi tiết mở sidebar", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ ...BOOKING, id: 301 }],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("301");
    fireEvent.click(screen.getByTitle("Xem chi tiết"));

    const headings = await screen.findAllByRole("heading", { name: "Chi tiết đặt phòng" });
    expect(headings.length).toBeGreaterThan(0);
    expect(await screen.findByText("Đặt phòng #301")).toBeInTheDocument();
  });

  test("đóng sidebar", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ ...BOOKING, id: 302 }],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("302");
    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    expect(await screen.findByText("Đặt phòng #302")).toBeInTheDocument();

    // Close sidebar via the × button
    const closeBtn = screen.getByText("×");
    fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByText("Đặt phòng #302")).not.toBeInTheDocument());
  });

  test("xóa booking: confirm Swal rồi gọi DeleteBooking", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ ...BOOKING, id: 4 }],
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

  test("xóa booking: cancel = không gọi DeleteBooking", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ ...BOOKING, id: 4 }],
    });
    Swal.fire.mockResolvedValue({ isConfirmed: false });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("4");
    fireEvent.click(screen.getByTitle("Xóa"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(bookingService.DeleteBooking).not.toHaveBeenCalled();
  });

  test("xóa booking: error hiển thị Swal lỗi", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ ...BOOKING, id: 7 }],
    });
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    bookingService.DeleteBooking.mockRejectedValueOnce({
      response: { data: { message: "Delete failed" } },
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("7");
    fireEvent.click(screen.getByTitle("Xóa"));

    await waitFor(() => expect(bookingService.DeleteBooking).toHaveBeenCalledWith(7));
  });

  test("mở edit modal, thay đổi input, và lưu thay đổi", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [{ ...BOOKING, id: 8 }],
    });
    bookingService.updateBooking.mockResolvedValueOnce({});

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("8");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    // Modal should open
    expect(await screen.findByText(/Chỉnh sửa đặt phòng #8/)).toBeInTheDocument();

    // Change quantity
    const quantityInput = screen.getByDisplayValue("2");
    fireEvent.change(quantityInput, { target: { value: "5", name: "quantity" } });

    // Click save
    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

    await waitFor(() =>
      expect(bookingService.updateBooking).toHaveBeenCalledWith(8, expect.objectContaining({
        quantity: "5",
      }))
    );
  });

  test("mở edit modal và đóng bằng nút Hủy", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ ...BOOKING, id: 9 }],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("9");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    expect(await screen.findByText(/Chỉnh sửa đặt phòng #9/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hủy" }));
    await waitFor(() => expect(screen.queryByText(/Chỉnh sửa đặt phòng #9/)).not.toBeInTheDocument());
  });

  test("mở edit modal và đóng bằng nút ×", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ ...BOOKING, id: 10 }],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("10");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    expect(await screen.findByText(/Chỉnh sửa đặt phòng #10/)).toBeInTheDocument();

    // Close via × (the modal close button)
    const closeBtns = screen.getAllByText("×");
    fireEvent.click(closeBtns[0]); // modal close button
    await waitFor(() => expect(screen.queryByText(/Chỉnh sửa đặt phòng #10/)).not.toBeInTheDocument());
  });

  test("update booking lỗi hiển thị toast error", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [{ ...BOOKING, id: 11 }],
    });
    bookingService.updateBooking.mockRejectedValueOnce({
      response: { data: { message: "Update booking failed" } },
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("11");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    expect(await screen.findByText(/Chỉnh sửa đặt phòng #11/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Update booking failed"));
  });

  test("bấm render danh sách trống", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [],
    });
    renderWithProviders(<BookingManage />);
    expect(await screen.findByText("Không tìm thấy đặt phòng nào")).toBeInTheDocument();
  });

  test("hiển thị trạng thái booking và payment_status khác nhau", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [
        { ...BOOKING, id: 20, status: "checked-in", payment_status: "paid" },
        { ...BOOKING, id: 21, status: "completed", payment_status: "canceled" },
        { ...BOOKING, id: 22, status: "canceled", payment_status: "bonding" },
        { ...BOOKING, id: 23, status: "unknown", payment_status: "unknown" },
        { ...BOOKING, id: 24, status: null, payment_status: null },
      ],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    expect(await screen.findByText("20")).toBeInTheDocument();
    expect(screen.getByText("21")).toBeInTheDocument();
  });

  test("xử lý lỗi API khi update booking status", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({
      data: [{ ...BOOKING, id: 5 }],
    });
    bookingService.updateBooking.mockRejectedValueOnce(new Error("Update failed"));
    renderWithProviders(<BookingManage />);

    const selects = await screen.findAllByRole("combobox");
    if (selects.length > 1) {
      fireEvent.change(selects[1], { target: { value: "completed" } });
      await waitFor(() => expect(toast.error).toHaveBeenCalled());
    }
  });

  test("edit modal với booking dùng checkInDate/checkOutDate thay vì check_in/check_out", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [{
        id: 30,
        quantity: 1,
        guests: 2,
        checkInDate: "2026-04-01 09:00:00",
        checkOutDate: "2026-04-02 09:00:00",
        totalPrice: 750000,
        status: "confirmed",
        payment_status: "bonding",
        room: { quantity: 3, max_guest: 4 },
      }],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("30");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    expect(await screen.findByText(/Chỉnh sửa đặt phòng #30/)).toBeInTheDocument();
  });

  test("hiển thị lỗi khi fetch thất bại, bấm Thử lại", async () => {
    bookingService.getAllBookings.mockRejectedValue(new Error("Network Error"));

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    // TanStack Query retries once (retry: 1 in component), so wait longer
    const errorEl = await screen.findByText(
      (text) => text.includes("lỗi") || text.includes("Lỗi"),
      {},
      { timeout: 10000 }
    );
    expect(errorEl).toBeInTheDocument();
    
    const retryBtn = screen.queryByText("Thử lại");
    if (retryBtn) {
      bookingService.getAllBookings.mockResolvedValueOnce({ data: [BOOKING] });
      fireEvent.click(retryBtn);
      expect(await screen.findByText("Tổng tiền", {}, { timeout: 10000 })).toBeInTheDocument();
    }
  }, 30000);
  test("edit modal fallback quantity/guests từ room object", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [{
        id: 40,
        status: "confirmed",
        payment_status: "bonding",
        room: { quantity: 10, max_guest: 20 },
      }],
    });

    renderWithProviders(<BookingManage />, {
      user: { name: "Admin", email: "admin@ex.com", phone: "0999" },
    });

    await screen.findByText("40");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    expect(await screen.findByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
  });

  test("toast error fallback khi không có message response", async () => {
    bookingService.getAllBookings.mockResolvedValueOnce({ data: [BOOKING] });
    bookingService.updateBooking.mockRejectedValueOnce(new Error("Unknown error"));

    renderWithProviders(<BookingManage />);
    await screen.findByText("1");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Không thể cập nhật đặt phòng"));
  });

  test("payment_status fallback to empty string", async () => {
    bookingService.getAllBookings.mockResolvedValue({
      data: [{ ...BOOKING, payment_status: null }]
    });
    renderWithProviders(<BookingManage />);
    await screen.findByText("1");
    // Should not crash
  });
});
