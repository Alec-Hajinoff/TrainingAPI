import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import LogoutComponent from "../LogoutComponent";
import { logoutUser } from "../ApiService";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../ApiService", () => ({
  logoutUser: jest.fn(),
}));

jest.mock("../LogoutComponent.css", () => ({}));

describe("LogoutComponent", () => {
  let mockNavigate;
  let consoleErrorSpy;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    consoleErrorSpy.mockRestore();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <LogoutComponent />
      </MemoryRouter>,
    );
  };

  test("renders logout button with correct styling and text", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /logout/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("logout-button");
    expect(button).toHaveTextContent("Logout");
  });

  test("calls logoutUser and navigates to home on successful logout", async () => {
    logoutUser.mockResolvedValueOnce();
    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("logs the specific error message when logout API fails", async () => {
    const errorMessage = "Logout request timed out";
    logoutUser.mockRejectedValueOnce(new Error(errorMessage));
    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorMessage);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("logs fallback error message when error object has no message", async () => {
    logoutUser.mockRejectedValueOnce(null); // Simulate a non-standard error
    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "An unknown error occurred during logout",
      );
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("waits for the async logoutUser call to complete before navigating", async () => {
    let resolveLogout;
    const logoutPromise = new Promise((resolve) => {
      resolveLogout = resolve;
    });
    logoutUser.mockReturnValueOnce(logoutPromise);

    renderComponent();
    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    expect(mockNavigate).not.toHaveBeenCalled();

    resolveLogout();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("button is accessible and focusable", () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /logout/i });

    button.focus();
    expect(button).toHaveFocus();
    expect(button).toBeEnabled();
  });
});
