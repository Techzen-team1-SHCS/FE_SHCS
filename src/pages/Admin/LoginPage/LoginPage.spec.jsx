import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import LoginPage from "./LoginPage";
import { AuthContext } from "../../../contexts/AuthContext";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../services/authService", () => ({
  authService: {
    login: vi.fn(),
    getUserById: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// eslint-disable-next-line import/first
import { authService } from "../../../services/authService";
// eslint-disable-next-line import/first
import { toast } from "react-toastify";

function renderWithAuth(ui, { login } = {}) {
  return render(<AuthContext.Provider value={{ login: login || vi.fn() }}>{ui}</AuthContext.Provider>);
}

describe("Admin - LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockReset();
  });

  test("validate form: thiếu email/password hiển thị lỗi", async () => {
    renderWithAuth(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    expect(await screen.findByText("Email là bắt buộc")).toBeInTheDocument();
    expect(screen.getByText("Mật khẩu là bắt buộc")).toBeInTheDocument();
  });

  test("user không phải admin => toast error và không navigate", async () => {
    authService.login.mockResolvedValueOnce({
      status: 200,
      user: { id: 1, role: 0 },
      token: "t",
    });

    renderWithAuth(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@ex.com" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(navigateMock).not.toHaveBeenCalled();
  });

  test("admin login thành công => gọi context.login và navigate dashboard", async () => {
    const loginFn = vi.fn();

    authService.login.mockResolvedValueOnce({
      status: 200,
      user: { id: 1, role: 1, name: "Admin" },
      token: "t",
    });
    authService.getUserById.mockResolvedValueOnce({ user: { id: 1, role: 1, name: "Admin Full" } });

    renderWithAuth(<LoginPage />, { login: loginFn });

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@ex.com" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(authService.login).toHaveBeenCalled());
    await waitFor(() => expect(authService.getUserById).toHaveBeenCalledWith(1));
    await waitFor(() => expect(loginFn).toHaveBeenCalledWith({ id: 1, role: 1, name: "Admin Full" }, "t"));
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/admin/dashboard"));
  });

  test("validate email không hợp lệ", async () => {
    renderWithAuth(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid-email" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "12345" } });
    fireEvent.submit(screen.getByRole("button", { name: /đăng nhập/i }).closest("form"));

    await waitFor(() => {
        expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
        expect(screen.getByText("Mật khẩu phải có ít nhất 6 ký tự")).toBeInTheDocument();
    });
  });

  test("không có user hoặc token từ server => toast error", async () => {
    authService.login.mockResolvedValueOnce({
      status: 200,
      user: null,
      token: null,
    });
    renderWithAuth(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@ex.com" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Không lấy được dữ liệu người dùng. Vui lòng thử lại."));
  });

  test("nhánh lỗi API có errors object chi tiết", async () => {
    authService.login.mockRejectedValue({
      response: {
        data: {
          errors: {
            email: ["Email đã tồn tại"],
            password: "Sai mật khẩu",
          }
        }
      }
    });

    renderWithAuth(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@ex.com" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Vui lòng kiểm tra lại thông tin đăng nhập"));
    expect(await screen.findByText("Email đã tồn tại")).toBeInTheDocument();
    expect(screen.getByText("Sai mật khẩu")).toBeInTheDocument();
  });

  test("nhánh lỗi API message chung", async () => {
    authService.login.mockRejectedValue({
      response: {
        data: {
          message: "Lỗi hệ thống",
        }
      }
    });

    renderWithAuth(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@ex.com" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Lỗi hệ thống"));
  });

  test("click toggle password để ẩn/hiện mật khẩu", () => {
    renderWithAuth(<LoginPage />);
    const passwordInput = screen.getByLabelText("Mật khẩu");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = document.querySelector(".password-toggle");
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("nhập input sau khi validate thất bại => xóa lỗi tương ứng", async () => {
    renderWithAuth(<LoginPage />);

    // Trigger validation errors
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));
    expect(await screen.findByText("Email là bắt buộc")).toBeInTheDocument();
    expect(screen.getByText("Mật khẩu là bắt buộc")).toBeInTheDocument();

    // Type in email => email error should disappear
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a" } });
    expect(screen.queryByText("Email là bắt buộc")).not.toBeInTheDocument();

    // Type in password => password error should disappear
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "x" } });
    expect(screen.queryByText("Mật khẩu là bắt buộc")).not.toBeInTheDocument();
  });

  test("getUserById không có user => dùng user từ login", async () => {
    const loginFn = vi.fn();
    authService.login.mockResolvedValueOnce({
      status: 200,
      user: { id: 1, role: 1, name: "LoginUser" },
      token: "t",
    });
    authService.getUserById.mockResolvedValueOnce({}); // empty object, no .user

    renderWithAuth(<LoginPage />, { login: loginFn });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@ex.com" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(loginFn).toHaveBeenCalledWith(expect.objectContaining({ name: "LoginUser" }), "t"));
  });

  test("nhánh lỗi API dùng key error thay vì message", async () => {
    authService.login.mockRejectedValue({
      response: { data: { error: "Lỗi từ key error" } }
    });

    renderWithAuth(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@ex.com" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Lỗi từ key error"));
  });

  test("nhánh lỗi API hoàn toàn không có data => fallback message", async () => {
    authService.login.mockRejectedValue({
      response: { data: {} }
    });

    renderWithAuth(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@ex.com" } });
    fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Có lỗi xảy ra khi đăng nhập"));
  });
});

