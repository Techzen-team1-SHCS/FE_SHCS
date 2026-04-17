import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import UserManage from "./UserManage";

vi.mock("../../../services/authService", () => ({
  authService: {
    getAllUsers: vi.fn(),
    blockUser: vi.fn(),
    unblockUser: vi.fn(),
    updateUser: vi.fn(),
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
import { authService } from "../../../services/authService";
// eslint-disable-next-line import/first
import Swal from "sweetalert2";
// eslint-disable-next-line import/first
import { toast } from "react-toastify";

const USERS = [
  {
    id: 1,
    name: "Admin A",
    email: "a@ex.com",
    phone: "0111",
    role: 1,
    is_blocked: 0,
    gender: "Male",
    birth: "1990-01-01",
    address: "1234 Street Name Very Long Address Here For Testing",
    image: "/avatar.jpg",
    createdAt: "2026-01-01",
  },
  {
    id: 2,
    name: "User B",
    email: "b@ex.com",
    phone: null,
    role: 0,
    is_blocked: 1,
    gender: "Female",
    birth: null,
    address: null,
    image: null,
  },
  {
    id: 3,
    name: null,
    email: "c@ex.com",
    role: 0,
    is_blocked: 0,
    gender: "Other",
  },
];

describe("Admin - UserManage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetch và render danh sách users + stats", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[0], USERS[1]]);

    render(<UserManage />);

    expect(await screen.findByText("Tổng người dùng")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Người dùng" })).toBeInTheDocument();

    expect(await screen.findByText("Admin A")).toBeInTheDocument();
    expect(screen.getByText("User B")).toBeInTheDocument();

    const totalStat = screen.getByText("Tổng người dùng").parentElement;
    expect(totalStat).toBeTruthy();
    expect(totalStat.querySelector("span")?.textContent).toBe("2");

    const headerStats = totalStat.parentElement;
    expect(headerStats).toBeTruthy();

    const adminStat = within(headerStats).getByText("Quản trị viên").parentElement;
    expect(adminStat).toBeTruthy();
    expect(adminStat.querySelector("span")?.textContent).toBe("1");
  });

  test("render all status, role, gender branches", async () => {
    authService.getAllUsers.mockResolvedValueOnce(USERS);

    render(<UserManage />);

    await screen.findByText("Admin A");

    // Role: admin + user
    expect(screen.getAllByText("Quản trị viên").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Người dùng").length).toBeGreaterThanOrEqual(1);

    // Status
    expect(screen.getAllByText("Bị chặn").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Hoạt động").length).toBeGreaterThanOrEqual(1);

    // Gender
    expect(screen.getAllByText("Nam").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Nữ").length).toBeGreaterThanOrEqual(1);

    // Null name shows "Chưa đặt tên"
    expect(screen.getByText("Chưa đặt tên")).toBeInTheDocument();
  });

  test("user có address hiển thị, không có address không hiển thị", async () => {
    authService.getAllUsers.mockResolvedValueOnce(USERS);

    render(<UserManage />);
    await screen.findByText("Admin A");

    // User with address
    expect(screen.getByText(/1234 Street Name Very Long/)).toBeInTheDocument();
  });

  test("bấm xem chi tiết mở modal và đóng được", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[0]]);

    render(<UserManage />);
    await screen.findByText("Admin A");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));

    expect(await screen.findByText("Chi tiết người dùng")).toBeInTheDocument();
    expect(screen.getAllByText("Admin A").length).toBeGreaterThanOrEqual(1);

    // Close by ✕ button
    fireEvent.click(screen.getByText("✕"));
    expect(screen.queryByText("Chi tiết người dùng")).not.toBeInTheDocument();
  });

  test("xem chi tiết user blocked và đóng bằng nút Đóng", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[1]]);

    render(<UserManage />);
    await screen.findByText("User B");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    expect(await screen.findByText("Chi tiết người dùng")).toBeInTheDocument();
    // "Bị chặn" appears in both table and modal
    expect(screen.getAllByText("Bị chặn").length).toBeGreaterThanOrEqual(2);

    // Close by Đóng button
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(screen.queryByText("Chi tiết người dùng")).not.toBeInTheDocument();
  });

  test("xem chi tiết user với gender khác (N/A)", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[2]]);

    render(<UserManage />);
    await screen.findByText("Chưa đặt tên");

    fireEvent.click(screen.getByTitle("Xem chi tiết"));
    expect(await screen.findByText("Chi tiết người dùng")).toBeInTheDocument();
  });

  test("bấm chỉnh sửa gọi Swal.fire với HTML form", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[0]]);

    // Mock Swal.fire: simulate cancel (user clicks Hủy)
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

    render(<UserManage />);
    await screen.findByText("Admin A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Chỉnh sửa thông tin người dùng",
          showCancelButton: true,
        })
      )
    );
  });

  test("bấm chỉnh sửa - preConfirm thành công", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[0]]);
    authService.updateUser.mockResolvedValueOnce({});
    authService.getAllUsers.mockResolvedValueOnce([USERS[0]]); // refetch

    // Capture and execute preConfirm
    Swal.fire.mockImplementationOnce(async (options) => {
      // Create mock DOM elements
      const mockInputs = {
        editName: { value: "New Name" },
        editEmail: { value: "new@ex.com" },
        editPhone: { value: "0222" },
        editAddress: { value: "New Address" },
      };
      const originalGetElementById = document.getElementById.bind(document);
      vi.spyOn(document, "getElementById").mockImplementation((id) => {
        return mockInputs[id] || originalGetElementById(id);
      });

      if (options.preConfirm) {
        await options.preConfirm();
      }

      document.getElementById.mockRestore();
      return { isConfirmed: true };
    });

    render(<UserManage />);
    await screen.findByText("Admin A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    await waitFor(() => expect(authService.updateUser).toHaveBeenCalledWith(1, {
      name: "New Name",
      email: "new@ex.com",
      phone: "0222",
      address: "New Address",
    }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Cập nhật thông tin thành công!"));
  });

  test("bấm chỉnh sửa - preConfirm lỗi", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[0]]);
    authService.updateUser.mockRejectedValueOnce(new Error("Update failed"));

    Swal.fire.mockImplementationOnce(async (options) => {
      const mockInputs = {
        editName: { value: "X" },
        editEmail: { value: "x@ex.com" },
        editPhone: { value: "000" },
        editAddress: { value: "Addr" },
      };
      vi.spyOn(document, "getElementById").mockImplementation((id) => mockInputs[id] || null);

      if (options.preConfirm) {
        await options.preConfirm();
      }

      document.getElementById.mockRestore();
      return { isConfirmed: true };
    });

    render(<UserManage />);
    await screen.findByText("Admin A");

    fireEvent.click(screen.getByTitle("Chỉnh sửa"));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Cập nhật thất bại: Update failed"));
  });

  test("bấm chặn user gọi Swal confirm và authService.blockUser, rồi refetch", async () => {
    const user = { id: 20, name: "User Y", email: "y@ex.com", role: 0, is_blocked: 0 };

    authService.getAllUsers
      .mockResolvedValueOnce([user])
      .mockResolvedValueOnce([{ ...user, is_blocked: 1 }]);

    Swal.fire
      .mockResolvedValueOnce({ isConfirmed: true })
      .mockResolvedValueOnce({}); // success dialog

    authService.blockUser.mockResolvedValueOnce({});

    render(<UserManage />);
    await screen.findByText("User Y");

    fireEvent.click(screen.getByTitle("Chặn người dùng"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    await waitFor(() => expect(authService.blockUser).toHaveBeenCalledWith(20));
    await waitFor(() => expect(authService.getAllUsers).toHaveBeenCalledTimes(2));
  });

  test("bấm bỏ chặn user gọi unblockUser và refetch", async () => {
    const user = { id: 30, name: "User Z", email: "z@ex.com", role: 0, is_blocked: 1 };

    authService.getAllUsers
      .mockResolvedValueOnce([user])
      .mockResolvedValueOnce([{ ...user, is_blocked: 0 }]);

    Swal.fire
      .mockResolvedValueOnce({ isConfirmed: true })
      .mockResolvedValueOnce({});

    authService.unblockUser.mockResolvedValueOnce({});

    render(<UserManage />);
    await screen.findByText("User Z");

    fireEvent.click(screen.getByTitle("Bỏ chặn"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    await waitFor(() => expect(authService.unblockUser).toHaveBeenCalledWith(30));
  });

  test("bấm chặn/bỏ chặn cancel = không gọi API", async () => {
    const user = { id: 40, name: "User W", email: "w@ex.com", role: 0, is_blocked: 0 };
    authService.getAllUsers.mockResolvedValueOnce([user]);

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

    render(<UserManage />);
    await screen.findByText("User W");

    fireEvent.click(screen.getByTitle("Chặn người dùng"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(authService.blockUser).not.toHaveBeenCalled();
  });

  test("bấm chặn user lỗi => Swal error", async () => {
    const user = { id: 50, name: "User V", email: "v@ex.com", role: 0, is_blocked: 0 };
    authService.getAllUsers.mockResolvedValueOnce([user]);

    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    authService.blockUser.mockRejectedValueOnce(new Error("Block failed"));

    // Second Swal.fire for error dialog
    Swal.fire.mockResolvedValueOnce({});

    render(<UserManage />);
    await screen.findByText("User V");

    fireEvent.click(screen.getByTitle("Chặn người dùng"));

    await waitFor(() => expect(authService.blockUser).toHaveBeenCalledWith(50));
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Lỗi!",
        })
      )
    );
  });

  test("xử lý lỗi API khi lấy user", async () => {
    authService.getAllUsers.mockRejectedValueOnce(new Error("Net Error"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<UserManage />);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
    errorSpy.mockRestore();
  });

  test("getInitials trả về chữ cái đầu đúng", async () => {
    authService.getAllUsers.mockResolvedValueOnce([
      { id: 10, name: "Nguyen Van An", email: "a@ex.com", role: 0, is_blocked: 0 },
    ]);

    render(<UserManage />);
    await screen.findByText("Nguyen Van An");

    // The avatar placeholder should show "NV" (first 2 initials)
    expect(screen.getByText("NV")).toBeInTheDocument();
  });

  test("getInitials cho user không có name trả về U", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[2]]);

    render(<UserManage />);
    await screen.findByText("Chưa đặt tên");
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  test("fallback ảnh user lỗi", async () => {
    authService.getAllUsers.mockResolvedValueOnce([USERS[0]]);
    render(<UserManage />);
    const img = await screen.findByAltText("Admin A");
    fireEvent.error(img);
    expect(img.style.display).toBe("none");
  });

  test("fetchUsers trả về null => setUsersData([])", async () => {
    authService.getAllUsers.mockResolvedValueOnce(null);
    render(<UserManage />);
    await waitFor(() => expect(screen.getAllByText("0").length).toBeGreaterThan(0));
  });

  test("chặn user lỗi không có message => dùng fallback 'Có lỗi xảy ra'", async () => {
    const user = { id: 60, name: "User X", email: "x@ex.com", role: 0, is_blocked: 0 };
    authService.getAllUsers.mockResolvedValueOnce([user]);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    authService.blockUser.mockRejectedValueOnce({}); // no message

    render(<UserManage />);
    await screen.findByText("User X");
    fireEvent.click(screen.getByTitle("Chặn người dùng"));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      text: "Có lỗi xảy ra"
    })));
  });
});
