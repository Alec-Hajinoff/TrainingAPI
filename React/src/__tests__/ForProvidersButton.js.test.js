import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import ForProvidersButton from "../ForProvidersButton";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../ForProvidersButton.css", () => ({}));

describe("ForProvidersButton Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ForProvidersButton />
      </MemoryRouter>,
    );
  };

  test("renders the label and button correctly", () => {
    renderComponent();

    expect(
      screen.getByText(/Are you a training provider or instructor\?/i),
    ).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /→ For providers/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn-for-providers");
  });

  test("navigates to /ForProviders when the button is clicked", () => {
    renderComponent();

    const button = screen.getByRole("button", { name: /→ For providers/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/ForProviders");
  });

  test("is accessible and focusable", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /→ For providers/i });

    button.focus();
    expect(button).toHaveFocus();
    expect(button).toBeEnabled();
  });
});
