import "@testing-library/jest-dom"; // Import jest-dom for custom matchers

import { describe, it, expect } from "vitest"; // Import expect from Vitest

import { render, screen } from "@testing-library/react"; // Import rendering utilities

import About from "../src/Components/About";

import React from "react";

describe("About", () => {
  it("should render the About component", () => {
    render(<About />); // Render the About component in the virtual DOM provided by the testing library

    //Assertion: check if there is an h1 element

    const aboutElement = screen.getByRole("heading", { level: 1 });

    expect(aboutElement).toBeInTheDocument();
  });
});
