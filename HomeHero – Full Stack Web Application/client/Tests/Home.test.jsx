import "@testing-library/jest-dom"; // Import jest-dom for custom matchers
import { describe, it, expect } from "vitest"; // Import from Vitest
import { render, screen } from "@testing-library/react"; // Import rendering utilities
import HomeT from "../src/Components/HomeT"; // Adjust the path to your Home component
import React from "react";

describe("Home Component", () => {
  it("should not render the specified text when not available", () => {
    render(<HomeT />); // Render the Home component

    const text = screen.queryByText(/specific text/i); // Replace "specific text" with the actual text you are looking for
    expect(text).not.toBeInTheDocument(); // Assert that the text is not present
  });
});
