import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer Component", () => {
  const originalDate = global.Date;

  beforeEach(() => {
    const mockDate = new Date("2025-01-01T00:00:00Z");
    global.Date = jest.fn(() => mockDate);
    global.Date.getFullYear = jest.fn(() => 2025);
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  test("renders copyright with current year", () => {
    render(<Footer />);

    expect(screen.getByText(/© Copyright 2025 - 2025\./)).toBeInTheDocument();
  });

  test("renders company address", () => {
    render(<Footer />);

    expect(
      screen.getByText(
        /Company address: 4 Bridge Gate, London, N21 2AH, United Kingdom\./
      )
    ).toBeInTheDocument();
  });

  test("renders email address with mailto link", () => {
    render(<Footer />);

    expect(screen.getByText("team@trainingapi.com")).toBeInTheDocument();

    const emailLink = screen.getByRole("link", {
      name: "team@trainingapi.com",
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:team@trainingapi.com");
  });

  test("renders entire footer text", () => {
    render(<Footer />);

    const footerParagraph = screen.getByText(/Copyright/).closest("p");
    expect(footerParagraph).toBeInTheDocument();

    const footerText = footerParagraph.textContent;
    expect(footerText).toContain("Copyright");
    expect(footerText).toContain("2025 - 2025");
    expect(footerText).toContain(
      "Company address: 4 Bridge Gate, London, N21 2AH, United Kingdom"
    );
    expect(footerText).toContain("team@trainingapi.com");
  });

  test("has correct CSS classes", () => {
    const { container } = render(<Footer />);

    const containerDiv = container.querySelector(".container.text-center");
    expect(containerDiv).toBeInTheDocument();

    const rowDiv = container.querySelector(".row");
    expect(rowDiv).toBeInTheDocument();

    const footerParagraph = container.querySelector("p.footer");
    expect(footerParagraph).toBeInTheDocument();

    const emphasisTag = footerParagraph.querySelector("em");
    expect(emphasisTag).toBeInTheDocument();
  });

  test("handles year change correctly", () => {
    const mockDate2026 = new Date("2026-01-01T00:00:00Z");
    global.Date = jest.fn(() => mockDate2026);
    global.Date.getFullYear = jest.fn(() => 2026);

    render(<Footer />);

    expect(screen.getByText(/Copyright 2025/)).toBeInTheDocument();
  });

  test("renders email text node correctly", () => {
    render(<Footer />);

    const footerParagraph = screen.getByText(/Copyright/).closest("p");
    const footerText = footerParagraph.textContent;

    expect(footerText).toContain("Email address:");
    expect(footerText).toContain("team@trainingapi.com");
  });
});
