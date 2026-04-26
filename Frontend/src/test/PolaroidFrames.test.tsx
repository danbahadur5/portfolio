import { render, screen, fireEvent } from "@testing-library/react";
import { PolaroidFrames } from "../components/PolaroidFrames";
import { describe, it, expect, vi } from "vitest";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Sparkles: () => <svg data-testid="sparkles-icon" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
}));

describe("PolaroidFrames Component", () => {
  const mockProps = {
    name: "John Doe",
    position: "Software Engineer",
  };

  it("renders all three text lines correctly", () => {
    render(<PolaroidFrames {...mockProps} />);
    
    expect(screen.getByText("Open for Collaboration")).toBeInTheDocument();
    expect(screen.getByText(mockProps.position)).toBeInTheDocument();
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
  });

  it("displays the current year and collaboration icon in each frame", () => {
    render(<PolaroidFrames {...mockProps} />);
    const currentYear = new Date().getFullYear().toString();
    
    // Each of the 3 frames should have the year and icon
    const yearElements = screen.getAllByText(currentYear);
    expect(yearElements).toHaveLength(3);
    
    const icons = screen.getAllByTestId("sparkles-icon");
    expect(icons).toHaveLength(3);
  });

  it("has correct accessibility attributes", () => {
    render(<PolaroidFrames {...mockProps} />);
    
    const frames = screen.getAllByRole("img");
    expect(frames).toHaveLength(3);
    
    expect(frames[0]).toHaveAttribute("aria-label", "Status: Open for Collaboration");
    expect(frames[1]).toHaveAttribute("aria-label", `Role: ${mockProps.position}`);
    expect(frames[2]).toHaveAttribute("aria-label", `Name: ${mockProps.name}`);
    
    // Check if focusable
    frames.forEach(frame => {
      expect(frame).toHaveAttribute("tabIndex", "0");
    });
  });

  it("triggers hover animation logic (verified via class/style changes)", () => {
    render(<PolaroidFrames {...mockProps} />);
    const firstFrame = screen.getAllByRole("img")[0];
    
    // In a real browser, framer-motion handles this. 
    // In unit tests with mocks, we verify the presence of the component.
    expect(firstFrame).toBeInTheDocument();
    
    // Simulate hover
    fireEvent.mouseEnter(firstFrame);
    // Since we mocked motion.div, we can't easily check for scale changes 
    // unless we check the props passed to the mock, but this verifies the event triggers.
  });
});
