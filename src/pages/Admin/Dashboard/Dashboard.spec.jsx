import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Dashboard from "./Dashboard";

vi.mock("../../../components/Admin/Dashboard/DashboardCard", () => ({
  default: () => <div>DashboardCard</div>,
}));
vi.mock("../../../components/Admin/Charts/GuestVisitsChart/GuestVisitsChart", () => ({
  default: () => <div>GuestVisitsChart</div>,
}));
vi.mock("../../../components/Admin/Charts/MostBookedChart/MostBookedChart", () => ({
  default: () => <div>MostBookedChart</div>,
}));
vi.mock("../../../components/Admin/RightPanel/RightPanel", () => ({
  default: () => <div>RightPanel</div>,
}));
vi.mock("../../../components/Admin/BookingTable/BookingTable", () => ({
  default: () => <div>BookingTable</div>,
}));
vi.mock("../../../components/Admin/RecentBookTable/RecentBookTable", () => ({
  default: () => <div>RecentBookTable</div>,
}));

describe("Admin - Dashboard", () => {
  test("render các widget chính", () => {
    render(<Dashboard />);

    expect(screen.getByText("DashboardCard")).toBeInTheDocument();
    expect(screen.getByText("GuestVisitsChart")).toBeInTheDocument();
    expect(screen.getByText("MostBookedChart")).toBeInTheDocument();
    expect(screen.getByText("RightPanel")).toBeInTheDocument();
    expect(screen.getByText("BookingTable")).toBeInTheDocument();
    expect(screen.getByText("RecentBookTable")).toBeInTheDocument();
  });
});

