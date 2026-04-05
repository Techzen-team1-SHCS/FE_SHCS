import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import HotelManage from "./HotelManage";

vi.mock("../../../services/hotelService", () => ({
  hotelService: {
    getAllHotels: vi.fn(),
    getHotelById: vi.fn(),
    getDeleteHotel: vi.fn(),
    updateHotel: vi.fn(),
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
    showLoading: vi.fn(),
  },
}));

// eslint-disable-next-line import/first
import { hotelService } from "../../../services/hotelService";
// eslint-disable-next-line import/first
import Swal from "sweetalert2";

describe("Admin - HotelManage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("fetch và render danh sách hotels", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce([
      { id: 1, name: "Hotel A", province: "Hanoi", price: 100000, hotel_class: 40, description: "Desc A" },
      { id: 2, name: "Hotel B", province: "HCM", price: 200000, hotel_class: 4, description: "Desc B" },
    ]);

    render(<HotelManage />);

    expect(await screen.findByRole("columnheader", { name: "Khách sạn" })).toBeInTheDocument();
    expect(await screen.findByText("Hotel A")).toBeInTheDocument();
    expect(screen.getByText("Hotel B")).toBeInTheDocument();
  });

  test("bấm xem chi tiết gọi getHotelById và mở sidebar", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce([
      { id: 1, name: "Hotel A", province: "Hanoi", price: 100000, hotel_class: 40, description: "Desc A", text: "Text A" },
    ]);

    hotelService.getHotelById.mockResolvedValueOnce({
      id: 1,
      name: "Hotel A",
      province: "Hanoi",
      price: 100000,
      hotel_class: 40,
      description: "Desc A",
      text: "Text A",
      amenities: ["Wifi"],
      name_nearby_place: "Lake",
      created_at: "2026-03-27T10:00:00Z",
      updated_at: "2026-03-27T10:00:00Z",
      firstimage: { url: "/img.jpg" },
      rooms: [],
    });

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));

    await waitFor(() => expect(hotelService.getHotelById).toHaveBeenCalledWith(1));
    expect(await screen.findByText("Chi tiết khách sạn")).toBeInTheDocument();
    expect(screen.getByText("Thông tin chung")).toBeInTheDocument();
    expect(screen.getAllByText("Hotel A").length).toBeGreaterThan(0);
  });

  test("bấm xóa: confirm Swal rồi gọi getDeleteHotel", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce([
      { id: 1, name: "Hotel A", province: "Hanoi", price: 100000, hotel_class: 40, description: "Desc A" },
    ]);

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    hotelService.getDeleteHotel.mockResolvedValueOnce({ status: 200, message: "Deleted" });
    hotelService.getAllHotels.mockResolvedValueOnce([]); // refetch after delete

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Xóa"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    await waitFor(() => expect(hotelService.getDeleteHotel).toHaveBeenCalledWith(1));
  });

  test("bấm chỉnh sửa: mở edit mode sau timeout và render form", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce([
      { id: 1, name: "Hotel A", province: "Hanoi", price: 100000, hotel_class: 40, description: "Desc A" },
    ]);

    hotelService.getHotelById.mockResolvedValueOnce({
      id: 1,
      name: "Hotel A",
      province: "Hanoi",
      price: 100000,
      hotel_class: 40,
      description: "Desc A",
      text: "Text A",
      amenities: ["Wifi"],
      name_nearby_place: "Lake",
    });

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    await waitFor(() => expect(hotelService.getHotelById).toHaveBeenCalledWith(1));
    // edit mode is enabled after a setTimeout(100) inside component
    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });

    expect(await screen.findByText("Chỉnh sửa khách sạn", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText("Tên khách sạn *")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hotel A")).toBeInTheDocument();
  }, 10000);
});

