import "@testing-library/jest-dom"; // Import jest-dom for custom matchers

import { describe, it, expect } from "vitest"; // Import expect from Vitest

import { render, screen } from "@testing-library/react"; // Import rendering utilities

import ListProductsT from "../src/Components/ListProductsT";

import React from "react";

describe("ListProducts", () => {
    it("should render the ListProducts component", () => {
      render(<ListProductsT />); // Render the ListProducts component in the virtual DOM provided by the testing library
  
      //Assertion: check if there is an h1 element
  
      const button = screen.getByRole('button');
  
      expect(button).toBeInTheDocument();
    });
  });
  