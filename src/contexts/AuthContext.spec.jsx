import { act, renderHook } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("khởi tạo với dữ liệu từ localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ id: 1, name: "Admin" }));
    localStorage.setItem("token", "fake-token");

    const { result } = renderHook(() => useContext(AuthContext), { wrapper: AuthProvider });

    expect(result.current.user).toEqual({ id: 1, name: "Admin" });
    expect(result.current.token).toBe("fake-token");
  });

  test("xử lý lỗi JSON khi parse user từ localStorage", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("user", "invalid-json");

    const { result } = renderHook(() => useContext(AuthContext), { wrapper: AuthProvider });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("user")).toBeNull(); // Đã bị xoá vì lỗi
    expect(errorSpy).toHaveBeenCalled();
  });

  test("bỏ qua khi localStorage là undefined string", () => {
    localStorage.setItem("user", "undefined");
    localStorage.setItem("token", "undefined");

    const { result } = renderHook(() => useContext(AuthContext), { wrapper: AuthProvider });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  test("login thiết lập user, token và localStorage", () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper: AuthProvider });

    act(() => {
      result.current.login({ id: 2, name: "User2" }, "new-token");
    });

    expect(result.current.user).toEqual({ id: 2, name: "User2" });
    expect(result.current.token).toBe("new-token");
    expect(localStorage.getItem("token")).toBe("new-token");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({ id: 2, name: "User2" });
  });

  test("logout xoá user, token và localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ id: 1 }));
    localStorage.setItem("token", "t");
    const { result } = renderHook(() => useContext(AuthContext), { wrapper: AuthProvider });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  test("updateUser cập nhật dữ liệu user hiện tại", () => {
    localStorage.setItem("user", JSON.stringify({ id: 1, name: "OldName" }));
    const { result } = renderHook(() => useContext(AuthContext), { wrapper: AuthProvider });

    act(() => {
      result.current.updateUser({ name: "NewName", extra: "info" });
    });

    expect(result.current.user).toEqual({ id: 1, name: "NewName", extra: "info" });
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({ id: 1, name: "NewName", extra: "info" });
  });
});