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
// eslint-disable-next-line import/first
import { toast } from "react-toastify";

const mockHotelsResponse = (hotels) => hotels;

const HOTEL = {
  id: 1,
  name: "Hotel A",
  province: "Hanoi",
  price: 100000,
  hotel_class: 40,
  description: "Desc A",
  text: "Text A",
  amenities: ["Wifi", "Pool"],
  name_nearby_place: "Lake",
  created_at: "2026-03-27T10:00:00Z",
  updated_at: "2026-03-27T10:00:00Z",
  firstimage: { url: "/img.jpg" },
  rooms: [{ quantity: 5, occupied: 2 }],
};

describe("Admin - HotelManage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("fetch và render danh sách hotels", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(
      mockHotelsResponse([
        { id: 1, name: "Hotel A", province: "Hanoi", price: 100000, hotel_class: 40, description: "Desc A" },
        { id: 2, name: "Hotel B", province: "HCM", price: 200000, hotel_class: 4, description: "Desc B" },
      ])
    );

    render(<HotelManage />);

    expect(await screen.findByRole("columnheader", { name: "Khách sạn" })).toBeInTheDocument();
    expect(await screen.findByText("Hotel A")).toBeInTheDocument();
    expect(screen.getByText("Hotel B")).toBeInTheDocument();
  });

  test("bấm xem chi tiết gọi getHotelById và mở sidebar", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(
      mockHotelsResponse([HOTEL])
    );

    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));

    await waitFor(() => expect(hotelService.getHotelById).toHaveBeenCalledWith(1));
    expect(await screen.findByText("Chi tiết khách sạn")).toBeInTheDocument();
    expect(screen.getByText("Thông tin chung")).toBeInTheDocument();
    expect(screen.getAllByText("Hotel A").length).toBeGreaterThan(0);
  });

  test("xem chi tiết - đóng sidebar overlay", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    expect(await screen.findByText("Chi tiết khách sạn")).toBeInTheDocument();

    // Close via × button
    const closeBtn = screen.getByText("×");
    fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByText("Chi tiết khách sạn")).not.toBeInTheDocument());
  });

  test("xem chi tiết - hotel không có rooms", async () => {
    const hotelNoRooms = { ...HOTEL, rooms: undefined };
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([hotelNoRooms]));
    hotelService.getHotelById.mockResolvedValueOnce(hotelNoRooms);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    expect(await screen.findByText("Chi tiết khách sạn")).toBeInTheDocument();
    expect(screen.getAllByText("Trống").length).toBeGreaterThanOrEqual(1);
  });

  test("xem chi tiết khi getHotelById trả null thì toast error", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(null);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Không lấy được thông tin khách sạn"));
  });

  test("xem chi tiết khi getHotelById lỗi thì toast error", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockRejectedValueOnce({ response: { data: { message: "Hotel not found" } } });

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Hotel not found"));
  });

  test("bấm xóa: confirm Swal rồi gọi getDeleteHotel", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(
      mockHotelsResponse([HOTEL])
    );

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    hotelService.getDeleteHotel.mockResolvedValueOnce({ status: 200, message: "Deleted" });
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([]));

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Xóa"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    await waitFor(() => expect(hotelService.getDeleteHotel).toHaveBeenCalledWith(1));
  });

  test("bấm xóa: cancel = không gọi getDeleteHotel", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    Swal.fire.mockResolvedValue({ isConfirmed: false });

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    fireEvent.click(screen.getByTitle("Xóa"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(hotelService.getDeleteHotel).not.toHaveBeenCalled();
  });

  test("bấm xóa hotel đang xem => đóng sidebar", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    hotelService.getDeleteHotel.mockResolvedValueOnce({ status: 200, message: "Deleted" });
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([]));

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    // Open sidebar first
    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    await waitFor(() => expect(screen.getByText("Chi tiết khách sạn")).toBeInTheDocument());

    // Now delete from sidebar
    const deleteButtons = screen.getAllByText("🗑️ Xóa khách sạn");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(hotelService.getDeleteHotel).toHaveBeenCalledWith(1));
  });

  test("bấm xóa: lỗi hiển thị Swal error", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    hotelService.getDeleteHotel.mockRejectedValueOnce({
      response: { data: { message: "Cannot delete" } },
    });

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    fireEvent.click(screen.getByTitle("Xóa"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith("Lỗi!", "Cannot delete", "error"));
    errSpy.mockRestore();
  });

  test("bấm chỉnh sửa: mở edit mode sau timeout và render form", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(
      mockHotelsResponse([HOTEL])
    );

    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    await waitFor(() => expect(hotelService.getHotelById).toHaveBeenCalledWith(1));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });

    expect(await screen.findByText("Chỉnh sửa khách sạn", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText("Tên khách sạn *")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hotel A")).toBeInTheDocument();
  }, 10000);

  test("lưu chỉnh sửa thành công", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);
    hotelService.updateHotel.mockResolvedValueOnce({ message: "Updated successfully" });
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));

    Swal.fire.mockResolvedValue({});

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });

    await screen.findByText("Chỉnh sửa khách sạn");

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

    await waitFor(() => expect(hotelService.updateHotel).toHaveBeenCalledWith(1, expect.objectContaining({
      name: "Hotel A",
      province: "Hanoi",
    })));
  }, 10000);

  test("lưu chỉnh sửa - validate tên trống", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });

    await screen.findByText("Chỉnh sửa khách sạn");

    // Clear name
    const nameInput = screen.getByDisplayValue("Hotel A");
    fireEvent.change(nameInput, { target: { value: "", name: "name" } });

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Tên khách sạn không được để trống"));
  }, 10000);

  test("lưu chỉnh sửa - validate giá <= 0", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });
    await screen.findByText("Chỉnh sửa khách sạn");

    const priceInput = screen.getByDisplayValue("100000");
    fireEvent.change(priceInput, { target: { value: "0", name: "price" } });

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Giá phải lớn hơn 0"));
  }, 10000);

  test("lưu chỉnh sửa - validate hotel_class ngoài phạm vi", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });
    await screen.findByText("Chỉnh sửa khách sạn");

    const classInput = screen.getByDisplayValue("4"); // parsed from 40
    fireEvent.change(classInput, { target: { value: "10", name: "hotel_class" } });

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Hạng sao phải từ 1 đến 5"));
  }, 10000);

  test("cancel edit quay về view mode", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });
    await screen.findByText("Chỉnh sửa khách sạn");

    fireEvent.click(screen.getByRole("button", { name: "Hủy" }));
    expect(await screen.findByText("Chi tiết khách sạn")).toBeInTheDocument();
  }, 10000);

  test("xử lý lỗi khi fetch khách sạn", async () => {
    hotelService.getAllHotels.mockRejectedValueOnce(new Error("Net Error"));
    render(<HotelManage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Không thể tải danh sách khách sạn"));
  });

  test("xử lý lỗi khi update (toast error)", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(
      mockHotelsResponse([{ id: 1, name: "A", price: 1000, hotel_class: 40 }])
    );
    hotelService.getHotelById.mockResolvedValueOnce({ id: 1, name: "A", price: 1000, hotel_class: 40, amenities: [] });

    render(<HotelManage />);
    await screen.findByText("A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });

    hotelService.updateHotel.mockRejectedValueOnce(new Error("Update err"));

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
  });

  test("thêm và xóa amenity trong form edit", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(
      mockHotelsResponse([{ id: 1, name: "A", hotel_class: 40 }])
    );
    hotelService.getHotelById.mockResolvedValueOnce({ id: 1, name: "A", hotel_class: 40, amenities: [] });

    render(<HotelManage />);
    await screen.findByText("A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });

    const input = screen.getByPlaceholderText(/Nhập tiện nghi/);

    // Rỗng
    fireEvent.click(screen.getByRole("button", { name: "Thêm" }));
    expect(toast.error).toHaveBeenCalledWith("Vui lòng nhập tiện nghi");

    // Thêm
    fireEvent.change(input, { target: { value: "Wifi Test" } });
    fireEvent.click(screen.getByRole("button", { name: "Thêm" }));
    expect(screen.getByText("Wifi Test")).toBeInTheDocument();

    // Trùng
    fireEvent.change(input, { target: { value: "Wifi Test" } });
    fireEvent.click(screen.getByRole("button", { name: "Thêm" }));
    expect(toast.error).toHaveBeenCalledWith("Tiện nghi này đã tồn tại");

    // Xóa
    const deleteBtns = screen.getAllByTitle("Xóa");
    const deleteBtn = deleteBtns[deleteBtns.length - 1];
    fireEvent.click(deleteBtn);
    expect(screen.queryByText("Wifi Test", { selector: "span" })).not.toBeInTheDocument();
  });

  test("thêm amenity bằng Enter key", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(
      mockHotelsResponse([{ id: 1, name: "A", hotel_class: 40 }])
    );
    hotelService.getHotelById.mockResolvedValueOnce({ id: 1, name: "A", hotel_class: 40, amenities: [] });

    render(<HotelManage />);
    await screen.findByText("A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });

    const input = screen.getByPlaceholderText(/Nhập tiện nghi/);
    fireEvent.change(input, { target: { value: "Gym" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });
    expect(screen.getByText("Gym")).toBeInTheDocument();
  });

  test("render rỗng danh sách", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce([]);
    render(<HotelManage />);
    expect(await screen.findByText("Không có khách sạn nào")).toBeInTheDocument();
  });

  test("amenities dạng JSON string parse thành array", async () => {
    const hotel = { ...HOTEL, amenities: '["Wifi","Pool"]' };
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([hotel]));
    hotelService.getHotelById.mockResolvedValueOnce(hotel);

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    fireEvent.click(screen.getByTitle("Xem chi tiết"));

    expect(await screen.findByText("Chi tiết khách sạn")).toBeInTheDocument();
  });

  test("amenities invalid JSON fallback to empty", async () => {
    const hotel = { ...HOTEL, amenities: "not json" };
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([hotel]));
    hotelService.getHotelById.mockResolvedValueOnce(hotel);

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    fireEvent.click(screen.getByTitle("Xem chi tiết"));

    expect(await screen.findByText("Chi tiết khách sạn")).toBeInTheDocument();
  });

  test("hotel_class < 10 renders stars correctly", async () => {
    const hotel = { ...HOTEL, hotel_class: 3 };
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([hotel]));

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    expect(screen.getByText("3/5")).toBeInTheDocument();
  });

  test("hotel_class null renders 0/5", async () => {
    const hotel = { ...HOTEL, hotel_class: null };
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([hotel]));

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    expect(screen.getByText("0/5")).toBeInTheDocument();
  });

  test("view mode bấm chỉnh sửa switches to edit", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);

    render(<HotelManage />);
    await screen.findByText("Hotel A");

    // Open view mode
    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    expect(await screen.findByText("Chi tiết khách sạn")).toBeInTheDocument();

    // Click edit button in sidebar
    const editInSidebar = screen.getByRole("button", { name: /Chỉnh sửa/ });
    fireEvent.click(editInSidebar);

    await waitFor(() => expect(screen.getByText("Chỉnh sửa khách sạn")).toBeInTheDocument());
  });

  test("parseHotelClassFromServer với hotelClass < 10", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([{...HOTEL, hotel_class: 4}]));
    hotelService.getHotelById.mockResolvedValueOnce({...HOTEL, hotel_class: 4});

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });
    expect(await screen.findByDisplayValue("4")).toBeInTheDocument();
  });

  test("fallback ảnh khách sạn lỗi", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    render(<HotelManage />);
    const img = await screen.findByAltText("Hotel A");
    fireEvent.error(img);
    expect(img.src).toContain("/default-hotel.jpg");
  });

  test("lưu chỉnh sửa - lỗi không có message response", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);
    hotelService.updateHotel.mockRejectedValueOnce({ response: { data: {} } });

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      text: "Cập nhật thất bại, vui lòng thử lại"
    })));
  });

  test("didOpen calls showLoading", async () => {
    hotelService.getAllHotels.mockResolvedValueOnce(mockHotelsResponse([HOTEL]));
    hotelService.getHotelById.mockResolvedValueOnce(HOTEL);
    
    Swal.fire.mockImplementationOnce((options) => {
        if (options.didOpen) options.didOpen();
        return Promise.resolve({ isConfirmed: true });
    });

    render(<HotelManage />);
    await screen.findByText("Hotel A");
    fireEvent.click(screen.getByTitle("Chỉnh sửa"));
    await act(async () => { await new Promise((r) => setTimeout(r, 150)); });

    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
    expect(Swal.showLoading).toHaveBeenCalled();
  });
});
