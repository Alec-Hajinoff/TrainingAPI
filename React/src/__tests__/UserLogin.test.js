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
      </MemoryRouter>
    );
  };

  it("renders login form with all fields", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Email address");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(emailInput).toHaveAttribute("required");

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
    expect(passwordInput).toHaveAttribute("required");
  });

  describe("Form State Management", () => {
    it("updates form data when inputs change", () => {
      renderComponent();

      const emailInput = screen.getByPlaceholderText("Email address");
      const passwordInput = screen.getByPlaceholderText("Password");

      fireEvent.change(emailInput, {
        target: { name: "email", value: "test@example.com" },
      });
      fireEvent.change(passwordInput, {
        target: { name: "password", value: "password123" },
      });

      expect(emailInput).toHaveValue("test@example.com");
      expect(passwordInput).toHaveValue("password123");
    });

    it("initializes with empty form data", () => {
      renderComponent();

      expect(screen.getByPlaceholderText("Email address")).toHaveValue("");
      expect(screen.getByPlaceholderText("Password")).toHaveValue("");
      expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();
    });
  });

  describe("Form Submission", () => {
    it("calls loginUser with form data on submit", async () => {
      const mockResponse = { status: "success", user_type: "provider" };
      loginUser.mockResolvedValueOnce(mockResponse);

      renderComponent();

      const emailInput = screen.getByPlaceholderText("Email address");
      const passwordInput = screen.getByPlaceholderText("Password");
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(emailInput, {
        target: { name: "email", value: "test@example.com" },
      });
      fireEvent.change(passwordInput, {
        target: { name: "password", value: "password123" },
      });
      fireEvent.click(submitButton);

      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("prevents default form submission", async () => {
      const mockResponse = { status: "success", user_type: "provider" };
      loginUser.mockResolvedValueOnce(mockResponse);

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(loginUser).toHaveBeenCalled();
      });
    });
  });

  describe("Login Success Scenarios", () => {
    it("navigates to ProviderDashboard for provider users", async () => {
      const mockResponse = { status: "success", user_type: "provider" };
      loginUser.mockResolvedValueOnce(mockResponse);

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/ProviderDashboard");
      });
    });

    it("navigates to DeveloperDashboard for developer users", async () => {
      const mockResponse = { status: "success", user_type: "developer" };
      loginUser.mockResolvedValueOnce(mockResponse);

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/DeveloperDashboard");
      });
    });

    it("navigates to AdminDashboard for admin users", async () => {
      const mockResponse = { status: "success", user_type: "admin" };
      loginUser.mockResolvedValueOnce(mockResponse);

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/AdminDashboard");
      });
    });
  });

  describe("Login Error Scenarios", () => {
    it("shows error message when login fails", async () => {
      const mockResponse = { status: "error" };
      loginUser.mockResolvedValueOnce(mockResponse);

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorDiv = document.getElementById("error-message-one");
        expect(errorDiv).toHaveTextContent("Sign in failed. Please try again.");
      });
    });

    it("shows error message when API throws", async () => {
      const errorMessage = "Network error";
      loginUser.mockRejectedValueOnce(new Error(errorMessage));

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorDiv = document.getElementById("error-message-one");
        expect(errorDiv).toHaveTextContent(errorMessage);
      });
    });

    it("clears previous error messages on new submission", async () => {
      loginUser.mockRejectedValueOnce(new Error("First error"));
      const { rerender } = render(
        <MemoryRouter>
          <UserLogin />
        </MemoryRouter>
      );

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorDiv = document.getElementById("error-message-one");
        expect(errorDiv).toHaveTextContent("First error");
      });

      cleanup();
      jest.clearAllMocks();

      loginUser.mockResolvedValueOnce({
        status: "success",
        user_type: "provider",
      });
      render(
        <MemoryRouter>
          <UserLogin />
        </MemoryRouter>
      );

      const newSubmitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(newSubmitButton);

      await waitFor(() => {
        const errorDiv = document.getElementById("error-message-one");
        expect(errorDiv).not.toHaveTextContent("First error");
        expect(errorDiv).toHaveTextContent("");
      });
    });
  });

  describe("Loading State", () => {
    it("shows spinner when loading", async () => {
      let resolveLogin;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      loginUser.mockReturnValueOnce(loginPromise);

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /login/i });
      const spinner = document.getElementById("spinnerLogin");

      expect(spinner.style.display).toBe("none");

      fireEvent.click(submitButton);

      expect(spinner.style.display).toBe("inline-block");

      resolveLogin({ status: "success", user_type: "provider" });

      await waitFor(() => {
        expect(spinner.style.display).toBe("none");
      });
    });

    it("button shows disabled state during loading", async () => {
      let resolveLogin;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      loginUser.mockReturnValueOnce(loginPromise);

      renderComponent();

      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.click(submitButton);

      const spinner = document.getElementById("spinnerLogin");
      expect(spinner.style.display).toBe("inline-block");

      resolveLogin({ status: "success", user_type: "provider" });

      await waitFor(() => {
        expect(spinner.style.display).toBe("none");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper placeholders", () => {
      renderComponent();

      expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });

    it("has error message with aria-live polite", () => {
      renderComponent();

      const errorDiv = document.getElementById("error-message-one");
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv).toHaveAttribute("aria-live", "polite");
      expect(errorDiv).toHaveClass("error");
    });

    it("has spinner with appropriate ARIA attributes", () => {
      renderComponent();

      const spinner = document.getElementById("spinnerLogin");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("spinner-border", "spinner-border-sm");
      expect(spinner).toHaveAttribute("role", "status");
      expect(spinner).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Form Validation", () => {
    it("has email pattern validation", () => {
      renderComponent();

      const emailInput = screen.getByPlaceholderText("Email address");
      expect(emailInput).toHaveAttribute(
        "pattern",
        "[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$"
      );
    });

    it("has required fields", () => {
      renderComponent();

      expect(screen.getByPlaceholderText("Email address")).toHaveAttribute(
        "required"
      );
      expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
        "required"
      );
    });
  });

  describe("Bootstrap Classes", () => {
    it("has correct Bootstrap form classes", () => {
      const { container } = renderComponent();

      expect(container.querySelector(".row.g-2")).toBeInTheDocument();
      expect(container.querySelector(".form-group")).toBeInTheDocument();
      expect(container.querySelector(".form-control")).toBeInTheDocument();
      expect(container.querySelector(".btn.btn-secondary")).toBeInTheDocument();
    });
  });
});
