import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TagButton } from "../components/ui/TagButton";
import React from "react";

describe("TagButton Component", () => {
  it("renders the tag name and button label correctly", () => {
    render(<TagButton tagName="Design System" buttonLabel="Click Me" />);
    
    expect(screen.getByText("Design System")).toBeInTheDocument();
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("applies truncation classes to the tag name", () => {
    render(<TagButton tagName="Very Long Tag Name That Should Truncate" buttonLabel="Action" />);
    
    const tagNameElement = screen.getByText("Very Long Tag Name That Should Truncate");
    expect(tagNameElement).toHaveClass("truncate");
  });

  it("renders with glass variant styles when specified", () => {
    const { container } = render(
      <TagButton tagName="Glass Tag" buttonLabel="Glass Button" variant="glass" />
    );
    
    // Check for glass-specific classes on the button (checking part of the class list)
    const button = screen.getByRole("button", { name: /glass button/i });
    expect(button).toHaveClass("bg-white/10");
    expect(button).toHaveClass("backdrop-blur-md");
  });

  it("maintains vertical alignment structure (flex-col)", () => {
    const { container } = render(<TagButton tagName="Test" buttonLabel="Test" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex-col");
  });
});
