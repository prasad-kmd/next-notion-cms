import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../utils/test-utils";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeDisabled();
  });
});
