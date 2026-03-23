import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import UserLogin from "../UserLogin";
import { loginUser } from "../ApiService";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../ApiService", () => ({
  loginUser: jest.fn(),
}));

jest.mock("../UserLogin.css", () => ({}));

describe("UserLogin Component", () => {
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
        <UserLogin />
      </MemoryRouter>,
    );
  };

  it("renders login form with all fields", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  describe("Form Validation", () => {
    it("shows error for invalid email format", async () => {
      renderComponent();

      const emailInput = screen.getByPlaceholderText("Email address");
      fireEvent.change(emailInput, {
        target: { name: "email", value: "invalid-email" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter a valid email address/i),
        ).toBeInTheDocument();
      });
    });

    it("shows error for short password", async () => {
      renderComponent();

      const emailInput = screen.getByPlaceholderText("Email address");
      const passwordInput = screen.getByPlaceholderText("Password");

      fireEvent.change(emailInput, {
        target: { name: "email", value: "test@example.com" },
      });
      fireEvent.change(passwordInput, {
        target: { name: "password", value: "short" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Password must be at least 8 characters long/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Login Success Scenarios", () => {
    const successTestCases = [
      { type: "provider", path: "/ProviderDashboard" },
      { type: "developer", path: "/DeveloperDashboard" },
      { type: "admin", path: "/AdminDashboard" },
    ];

    successTestCases.forEach(({ type, path }) => {
      it(`navigates to ${path} for ${type} users`, async () => {
        loginUser.mockResolvedValueOnce({ status: "success", user_type: type });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText("Email address"), {
          target: { name: "email", value: "user@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
          target: { name: "password", value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Login/i }));

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(path);
        });
      });
    });
  });

  describe("Login Error Scenarios", () => {
    it("shows error message and clears password when login fails", async () => {
      loginUser.mockResolvedValueOnce({ status: "error" });

      renderComponent();

      const passwordInput = screen.getByPlaceholderText("Password");
      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { name: "email", value: "test@example.com" },
      });
      fireEvent.change(passwordInput, {
        target: { name: "password", value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Login/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Sign in failed. Please try again./i),
        ).toBeInTheDocument();
        expect(passwordInput.value).toBe("");
      });
    });
  });

  describe("Loading State", () => {
    it("shows spinner and disables button when loading", async () => {
      loginUser.mockReturnValueOnce(new Promise(() => {}));

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /Login/i });

      fireEvent.change(screen.getByPlaceholderText("Email address"), {
        target: { name: "email", value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { name: "password", value: "password123" },
      });

      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      const spinner = document.getElementById("spinnerLogin");
      expect(spinner.style.display).toBe("inline-block");
    });
  });
});
