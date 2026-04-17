import { describe, expect, test } from "vitest";
import { formatDateTime, formatVND, getNights, getFreeCancelDeadline, calculateCancelFee, getCancelPolicy } from "./dateUtils";

describe("dateUtils", () => {
  test("getNights tính đúng số đêm", () => {
    expect(getNights("2024-04-01", "2024-04-05")).toBe(4);
    expect(getNights("2024-04-01T12:00:00Z", "2024-04-02T12:00:00Z")).toBe(1);
  });

  test("getFreeCancelDeadline trả về ngày huỷ miễn phí", () => {
    // 2024-04-10 trừ 3 ngày là 2024-04-07
    const result = getFreeCancelDeadline("2024-04-10", 3);
    expect(result.toISOString()).toContain("2024-04-07");
  });

  test("calculateCancelFee sử dụng cancel_fee nếu có", () => {
    const booking = { cancel_fee: 100000 };
    expect(calculateCancelFee(booking)).toBe(100000);
  });

  test("calculateCancelFee tính theo phần trăm nếu không có cancel_fee", () => {
    const booking = { total_price: 200000 };
    expect(calculateCancelFee(booking)).toBe(100000); // Mặc định 50%
    expect(calculateCancelFee(booking, 30)).toBe(60000); // 30%
  });

  describe("getCancelPolicy", () => {
    test("không cho phép huỷ miễn phí nếu sát ngày", () => {
      const booking = {
        check_in: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        created_at: new Date().toISOString(),
        cancel_free_days: 3,
        total_price: 1000000
      };
      const policy = getCancelPolicy(booking);
      expect(policy.hasFreeCancel).toBe(false);
      expect(policy.cancelFee).toBe(500000); // 50%
      expect(policy.message).toContain("sát ngày");
    });

    test("có freeCancelFee từ backend", () => {
      const booking = {
        check_in: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        cancel_free_days: 3,
        cancel_fee: 300000,
        total_price: 1000000
      };
      const policy = getCancelPolicy(booking);
      expect(policy.cancelFee).toBe(300000);
    });

    test("cho phép huỷ miễn phí nếu cách xa ngày", () => {
      const booking = {
        check_in: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        cancel_free_days: 3,
        total_price: 1000000
      };
      const policy = getCancelPolicy(booking);
      expect(policy.hasFreeCancel).toBe(true);
      expect(policy.freeCancelDeadline).toBeInstanceOf(Date);
    });

    test("xử lý cancel_free_days mặc định là 0", () => {
      const booking = {
        check_in: new Date(Date.now()).toISOString(),
        created_at: new Date().toISOString(),
        total_price: 1000000
      };
      const policy = getCancelPolicy(booking);
      expect(policy.hasFreeCancel).toBe(true);
    });
  });
});
