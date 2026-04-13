import React from "react";
import { render, screen } from "@testing-library/react";
import ForProviders from "../ForProviders";

jest.mock("../ForProviders.css", () => ({}));
jest.mock("bootstrap-icons/font/bootstrap-icons.css", () => ({}));

describe("ForProviders Component", () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  test("renders the main hero title and description", () => {
    render(<ForProviders />);

    expect(
      screen.getByText(
        /Deliver your workshops under a single, trusted training brand/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /TrainingApi works with providers to deliver high-quality/i,
      ),
    ).toBeInTheDocument();
  });

  test("scrolls to the top of the page on mount", () => {
    render(<ForProviders />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test("renders the 'How the model works' section", () => {
    render(<ForProviders />);
    expect(screen.getByText(/How the model works/i)).toBeInTheDocument();
    expect(
      screen.getByText(/TrainingApi is not an open marketplace/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Workshops are presented under the TrainingApi brand/i),
    ).toBeInTheDocument();
  });

  test("renders all benefit cards", () => {
    render(<ForProviders />);
    expect(
      screen.getByText(/Focus on delivery, not sales/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Structured, ongoing visibility/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Access to organisational demand/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Operate within a clear standard/i),
    ).toBeInTheDocument();
  });

  test("renders the assessment process steps", () => {
    render(<ForProviders />);
    expect(screen.getByText(/Initial review/i)).toBeInTheDocument();
    expect(screen.getByText(/Discovery call/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/Approval & onboarding/i)).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  test("renders focus area cards", () => {
    render(<ForProviders />);
    expect(
      screen.getByText(/AI for Business Applications/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cloud Fundamentals \(AWS & Azure\)/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Prompt Engineering/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Automation & Workflow Optimisation/i),
    ).toBeInTheDocument();
  });

  test("renders the contact email link correctly", () => {
    render(<ForProviders />);
    const emailLink = screen.getByRole("link", {
      name: /team@trainingapi.com/i,
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:team@trainingapi.com");
  });

  test("renders the criteria for providers", () => {
    render(<ForProviders />);
    expect(
      screen.getByText(/Experience delivering instructor-led training/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ability to run hands-on, practical sessions/i),
    ).toBeInTheDocument();
  });
});
