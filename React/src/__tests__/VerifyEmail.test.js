import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VerifyEmail from "../VerifyEmail";
import { verifyEmail } from "../ApiService";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("../ApiService", () => ({
  verifyEmail: jest.fn(),
}));

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("VerifyEmail Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-router-dom").useNavigate.mockImplementation(
      () => mockNavigate,
    );
  });

  const renderComponent = (searchParams = "?token=valid-token") => {
    require("react-router-dom").useLocation.mockImplementation(() => ({
      search: searchParams,
    }));

    return render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>,
    );
  };

  describe("Initial render", () => {
    it("should show loading state initially", () => {
      renderComponent();

      expect(
        screen.getByText(/Verifying your email address.../i),
      ).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Token validation", () => {
    it("should show error when no token is provided", async () => {
      renderComponent("");

      await waitFor(() => {
        expect(
          screen.getByText(/No verification token provided./i),
        ).toBeInTheDocument();
      });
    });

    it("should call verifyEmail with the token from URL", async () => {
      verifyEmail.mockResolvedValue({ success: true });
      renderComponent("?token=test-token-123");

      await waitFor(() => {
        expect(verifyEmail).toHaveBeenCalledWith("test-token-123");
      });
    });

    it("should navigate to RegisteredPage on successful verification", async () => {
      verifyEmail.mockResolvedValue({ success: true });
      renderComponent("?token=valid-token");

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/RegisteredPage");
      });
    });
  });

  describe("Error handling", () => {
    it("should show error message when verification fails", async () => {
      verifyEmail.mockResolvedValue({
        success: false,
        message: "Invalid or expired token.",
      });

      renderComponent("?token=invalid-token");

      await waitFor(() => {
        expect(
          screen.getByText(/Invalid or expired token./i),
        ).toBeInTheDocument();
      });
    });

    it("should show default error message when verification fails without custom message", async () => {
      verifyEmail.mockResolvedValue({ success: false });

      renderComponent("?token=invalid-token");

      await waitFor(() => {
        expect(
          screen.getByText(/Verification failed. Please try again./i),
        ).toBeInTheDocument();
      });
    });

    it("should show error message when API call throws an error", async () => {
      verifyEmail.mockRejectedValue(new Error("Network error"));

      renderComponent("?token=valid-token");

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });

    it("should show default error message when API call throws without message", async () => {
      verifyEmail.mockRejectedValue({});

      renderComponent("?token=valid-token");

      await waitFor(() => {
        expect(
          screen.getByText(/An error occurred during verification./i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Register button", () => {
    it("should render Register button when in error state", async () => {
      verifyEmail.mockResolvedValue({
        success: false,
        message: "Verification failed.",
      });

      renderComponent("?token=invalid-token");

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /Register a new account/i }),
        ).toBeInTheDocument();
      });
    });

    it("should navigate to home page when Register button is clicked", async () => {
      verifyEmail.mockResolvedValue({
        success: false,
        message: "Verification failed.",
      });

      renderComponent("?token=invalid-token");

      await waitFor(async () => {
        const registerButton = screen.getByRole("button", {
          name: /Register a new account/i,
        });
        fireEvent.click(registerButton);

        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have aria-live attribute on error message", async () => {
      verifyEmail.mockResolvedValue({
        success: false,
        message: "Error occurred.",
      });

      renderComponent("?token=invalid-token");

      await waitFor(() => {
        const errorMessage = screen.getByText(/Error occurred./i);
        expect(errorMessage).toHaveAttribute("aria-live", "polite");
      });
    });

    it("should have role='status' on spinner", () => {
      renderComponent("?token=valid-token");

      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
  });
});
