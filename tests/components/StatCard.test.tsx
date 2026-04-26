import { describe, it, expect } from "vitest";
import { render, screen } from "../utils/test-utils";
import { StatCard } from "@/components/analytics/StatCard";
import { Activity } from "lucide-react";

describe("StatCard component", () => {
  it("renders title and value correctly", () => {
    render(<StatCard title="Total Views" value="1,234" icon={<Activity />} />);
    expect(screen.getByText("Total Views")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("shows loading state when loading prop is true", () => {
    const { container } = render(<StatCard title="Total Views" value="1,234" icon={<Activity />} loading />);
    // The animate-pulse class is on the div inside the wrapper div
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders trend information when provided", () => {
    render(
      <StatCard
        title="Total Views"
        value="1,234"
        icon={<Activity />}
        trend={{ value: 10, isUp: true }}
      />
    );
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("Total Views")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<StatCard title="Title" value="100" icon={<Activity />} description="Since yesterday" />);
    expect(screen.getByText("Since yesterday")).toBeInTheDocument();
  });
});
