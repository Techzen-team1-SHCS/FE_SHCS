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

describe("Admin - UserManage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fetch và render danh sách users + stats", async () => {
    authService.getAllUsers.mockResolvedValueOnce([
      { id: 1, name: "Admin A", email: "a@ex.com", role: 1, is_blocked: 0 },
      { id: 2, name: "User B", email: "b@ex.com", role: 0, is_blocked: 1 },
    ]);

    render(<UserManage />);

    expect(await screen.findByText("Tổng người dùng")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Người dùng" })).toBeInTheDocument();

    // Render user rows content
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

  test("bấm xem chi tiết mở modal và đóng được", async () => {
    authService.getAllUsers.mockResolvedValueOnce([
      { id: 10, name: "User X", email: "x@ex.com", role: 0, is_blocked: 0 },
    ]);

    render(<UserManage />);

    await screen.findByText("User X");

    const viewBtn = screen.getByTitle("Xem chi tiết");
    fireEvent.click(viewBtn);

    expect(await screen.findByText("Chi tiết người dùng")).toBeInTheDocument();
    expect(screen.getAllByText("User X").length).toBeGreaterThanOrEqual(1);

    // close by X button
    fireEvent.click(screen.getByText("✕"));
    expect(screen.queryByText("Chi tiết người dùng")).not.toBeInTheDocument();
  });

  test("bấm chặn user gọi Swal confirm và authService.blockUser, rồi refetch", async () => {
    const user = { id: 20, name: "User Y", email: "y@ex.com", role: 0, is_blocked: 0 };

    authService.getAllUsers
      .mockResolvedValueOnce([user]) // initial fetch
      .mockResolvedValueOnce([{ ...user, is_blocked: 1 }]); // refetch after action

    Swal.fire
      .mockResolvedValueOnce({ isConfirmed: true }) // confirm dialog
      .mockResolvedValueOnce({}); // success dialog

    authService.blockUser.mockResolvedValueOnce({});

    render(<UserManage />);

    await screen.findByText("User Y");

    const banBtn = screen.getByTitle("Chặn người dùng");
    fireEvent.click(banBtn);

    // Called confirmation
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());

    // Action called
    await waitFor(() => expect(authService.blockUser).toHaveBeenCalledWith(20));

    // Refetch happens
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

    const unbanBtn = screen.getByTitle("Bỏ chặn");
    fireEvent.click(unbanBtn);

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    await waitFor(() => expect(authService.unblockUser).toHaveBeenCalledWith(30));
  });

  test("xử lý lỗi API khi lấy user", async () => {
    authService.getAllUsers.mockRejectedValueOnce(new Error("Net Error"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    render(<UserManage />);
    // Wait until the loading finishes and it catches the error
    await waitFor(() => {
        expect(errorSpy).toHaveBeenCalled();
    });
    errorSpy.mockRestore();
  });

});

