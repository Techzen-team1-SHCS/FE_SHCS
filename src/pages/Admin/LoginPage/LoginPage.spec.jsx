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
});

