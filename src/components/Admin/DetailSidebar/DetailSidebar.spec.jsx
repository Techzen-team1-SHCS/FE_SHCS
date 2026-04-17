import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import DetailSidebar from "./DetailSidebar";

describe("DetailSidebar", () => {
  test("không render nếu isOpen là false", () => {
    const { container } = render(<DetailSidebar isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  test("render đúng tiêu đề và children khi isOpen là true", () => {
    render(
      <DetailSidebar isOpen={true} title="Test Title">
        <div data-testid="child">Nội dung</div>
      </DetailSidebar>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  test("gọi onClose khi nhấn nút đóng hoặc overlay", () => {
    const mockOnClose = vi.fn();
    const { container } = render(
      <DetailSidebar isOpen={true} onClose={mockOnClose} title="Title" />
    );
    
    // Nút x
    const closeBtn = screen.getByLabelText("Đóng sidebar");
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Overlay (lấy lớp phủ đầu tiên đứng trước .sidebar)
    const overlay = container.firstChild;
    if (overlay) fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  test("render đúng class của các type", () => {
    const { rerender } = render(<DetailSidebar isOpen={true} type="hotel" onClose={() => {}} />);
    expect(document.querySelector('[class*="sidebarHotel"]')).toBeInTheDocument();

    rerender(<DetailSidebar isOpen={true} type="user" onClose={() => {}} />);
    expect(document.querySelector('[class*="sidebarUser"]')).toBeInTheDocument();

    rerender(<DetailSidebar isOpen={true} type="booking" onClose={() => {}} />);
    expect(document.querySelector('[class*="sidebarBooking"]')).toBeInTheDocument();

    rerender(<DetailSidebar isOpen={true} type="unknown" onClose={() => {}} />);
    expect(document.querySelector('[class*="sidebarDefault"]')).toBeInTheDocument();
  });
});
