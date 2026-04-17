import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import BookingSidebarContent from "./BookingSidebarContent";

describe("BookingSidebarContent", () => {
  const defaultBooking = {
    id: 101,
    user: { name: "Nguyen Van A", email: "a@gmail.com", phone: "0123" },
    check_in: "2024-05-01T14:00:00Z",
    check_out: "2024-05-03T12:00:00Z",
    quantity: 2,
    guests: 4,
    status: "confirmed",
    payment_status: "paid",
    total_price: 2000000,
    cancel_fee: 0,
    cancel_free_days: 3,
    pre_checkin_email_sent: true,
    created_at: "2024-04-10T10:00:00Z",
    updated_at: "2024-04-11T10:00:00Z"
  };

  test("không render nếu không có booking", () => {
    const { container } = render(<BookingSidebarContent booking={null} />);
    expect(container.firstChild).toBeNull();
  });

  test("render đúng thông tin booking", () => {
    render(<BookingSidebarContent booking={defaultBooking} />);
    expect(screen.getByText("Đặt phòng #101")).toBeInTheDocument();
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByText("Đã xác nhận")).toBeInTheDocument(); // status
    expect(screen.getByText("Đã thanh toán")).toBeInTheDocument(); // payment
    expect(screen.getByText("✅ Email xác nhận đã được gửi")).toBeInTheDocument();
  });

  test("hiển thị đúng các trạng thái booking khác nhau", () => {
    const { rerender } = render(<BookingSidebarContent booking={{...defaultBooking, status: "checked-in", payment_status: "canceled"}} />);
    expect(screen.getByText("Đã nhận phòng")).toBeInTheDocument();
    // Payment status text may overlap, so use getAll (because "Đã hủy" could be both status and payment_status)
    expect(screen.getAllByText("Đã hủy")[0]).toBeInTheDocument(); 

    rerender(<BookingSidebarContent booking={{...defaultBooking, status: "completed", payment_status: "unpaid"}} />);
    expect(screen.getByText("Đã hoàn thành")).toBeInTheDocument();
    expect(screen.getByText("Chưa thanh toán")).toBeInTheDocument();

    rerender(<BookingSidebarContent booking={{...defaultBooking, status: "canceled", payment_status: "pending"}} />);
    expect(screen.getByText("Chờ thanh toán")).toBeInTheDocument();

    rerender(<BookingSidebarContent booking={{...defaultBooking, status: "unknown_status", payment_status: "unknown_payment"}} />);
    expect(screen.getByText("unknown_status")).toBeInTheDocument();
    expect(screen.getByText("unknown_payment")).toBeInTheDocument();
  });

  test("xử lý rỗng checkIn, checkOut, date, fee", () => {
    const booking = {
        id: 102,
        total_price: 1000000,
        cancel_fee: 500000, // Nhánh có cancel_fee
    };
    render(<BookingSidebarContent booking={booking} />);
    // nights = 0, guests = N/A
    expect(screen.getAllByText("N/A")[0]).toBeInTheDocument();
    expect(screen.getByText("Đang xác nhận")).toBeInTheDocument(); // getStatusText null
    expect(screen.getByText("Chưa thanh toán")).toBeInTheDocument(); // getPaymentText null
  });

  test("ảnh user lỗi fallback sang initials", () => {
    const booking = { id: 103, user: { name: "Binh Bui", image: "error.jpg" } };
    render(<BookingSidebarContent booking={booking} />);
    const img = document.querySelector('img');
    if (img) {
      fireEvent.error(img);
    }
    expect(screen.getByText("BB")).toBeInTheDocument(); // initials
  });
  
  test("xử lý tên user rỗng", () => {
    const booking = { id: 104, user: null };
    render(<BookingSidebarContent booking={booking} />);
    expect(screen.getByText("U")).toBeInTheDocument(); // getInitials null
  });
});
