import { render, act } from "@testing-library/react";
import { describe, test, expect, vi, afterEach } from "vitest";
import CurrentTime from "./CurrentTime";

describe("CurrentTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("render ra time và date (không rỗng) sau khi mount", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-27T10:15:00Z"));

    const { container } = render(<CurrentTime />);

    const divs = container.querySelectorAll("div");
    expect(divs.length).toBeGreaterThanOrEqual(2);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(divs[0].textContent?.trim()).toBeTruthy();
    expect(divs[1].textContent?.trim()).toBeTruthy();
  });
});

