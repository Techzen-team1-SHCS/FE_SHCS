import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  test("hiển thị text và gọi onClick khi bấm", () => {
    const onClick = vi.fn();

    render(<Button props="OK" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

