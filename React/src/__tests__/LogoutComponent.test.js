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
        <LogoutComponent />
      </MemoryRouter>
    );
  };

  it("renders a logout button", () => {
    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("logout-button");
  });

  it("calls logoutUser and navigates to home on successful logout", async () => {
    logoutUser.mockResolvedValueOnce();

    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("handles logout API error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const errorMessage = "Logout failed";
    logoutUser.mockRejectedValueOnce(new Error(errorMessage));

    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(errorMessage);
    expect(mockNavigate).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("button is clickable and triggers handleLogout", async () => {
    logoutUser.mockResolvedValueOnce();

    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    expect(button).toBeEnabled();

    fireEvent.click(button);

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
    });
  });

  it("button has correct text content", () => {
    renderComponent();

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Logout");
  });

  describe("API integration", () => {
    it("calls logoutUser without any arguments", async () => {
      logoutUser.mockResolvedValueOnce();

      renderComponent();

      const button = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(logoutUser).toHaveBeenCalledWith();
      });
    });

    it("waits for logoutUser to complete before navigating", async () => {
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
  });

  describe("Error handling", () => {
    it("does not crash when logoutUser throws", async () => {
      logoutUser.mockRejectedValueOnce(new Error("Network error"));
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      renderComponent();

      const button = screen.getByRole("button", { name: /logout/i });

      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it("handles various error types", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      logoutUser.mockRejectedValueOnce("String error");

      renderComponent();
      const button = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      cleanup();
      jest.clearAllMocks();
      consoleErrorSpy.mockRestore();
    });

    it("handles null error without crashing", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const originalLogoutUser = logoutUser;
      logoutUser.mockRejectedValueOnce(null);

      renderComponent();
      const button = screen.getByRole("button", { name: /logout/i });

      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("button has proper role and accessible name", () => {
      renderComponent();

      const button = screen.getByRole("button", { name: /logout/i });
      expect(button).toBeInTheDocument();
    });

    it("button is focusable", () => {
      renderComponent();

      const button = screen.getByRole("button", { name: /logout/i });
      button.focus();
      expect(button).toHaveFocus();
    });

    it("button can be triggered with click", () => {
      logoutUser.mockResolvedValueOnce();
      renderComponent();

      const button = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(button);
      expect(logoutUser).toHaveBeenCalled();
    });
  });
});
