import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserRegistration from "../UserRegistration";
import { registerUser, checkAdminExists } from "../ApiService";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../ApiService", () => ({
  registerUser: jest.fn(),
  checkAdminExists: jest.fn(),
}));

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("UserRegistration Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-router-dom").useNavigate.mockImplementation(
      () => mockNavigate,
    );
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UserRegistration />
      </BrowserRouter>,
    );
  };

  const getRadioByLabel = (labelText) => {
    const labelElement = screen.getByText(labelText);
    const label = labelElement.closest("label");
    return label.querySelector('input[type="radio"]');
  };

  const fillValidCommonFields = () => {
    fireEvent.change(screen.getByPlaceholderText(/Full name/i), {
      target: { name: "name", value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { name: "email", value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Choose a strong password/i), {
      target: { name: "password", value: "password123" },
    });
  };

  describe("Initial render and admin check", () => {
    it("should show all user types while checking admin status", () => {
      checkAdminExists.mockImplementation(() => new Promise(() => {}));
      renderComponent();

      expect(screen.getByText(/Provider/i)).toBeInTheDocument();
      expect(screen.getByText(/Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/Admin/i)).toBeInTheDocument();

      const adminText = screen.getByText(/Admin/i);
      const spinner = adminText.parentElement?.querySelector(".spinner-border");
      expect(spinner).toBeInTheDocument();
    });

    it("should hide admin option when admin already exists", async () => {
      checkAdminExists.mockResolvedValue({ success: true, adminExists: true });
      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Form inputs and validation", () => {
    beforeEach(() => {
      checkAdminExists.mockResolvedValue({ success: true, adminExists: true });
    });

    it("should render all form fields correctly", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Full name/i)).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(/Email address/i),
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(/Choose a strong password/i),
        ).toBeInTheDocument();
      });
    });

    it("should show error when name contains invalid characters", async () => {
      renderComponent();

      await waitFor(() => {
        fireEvent.click(getRadioByLabel("Provider"));
        fillValidCommonFields();
        fireEvent.change(screen.getByPlaceholderText(/Full name/i), {
          target: { name: "name", value: "Test123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));

        expect(
          screen.getByText(/Name can only contain letters and spaces/i),
        ).toBeInTheDocument();
      });
    });

    it("should show error when email format is invalid", async () => {
      renderComponent();

      await waitFor(() => {
        fireEvent.click(getRadioByLabel("Provider"));
        fillValidCommonFields();
        fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
          target: { name: "email", value: "invalid-email" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));

        expect(
          screen.getByText(/Please enter a valid email address/i),
        ).toBeInTheDocument();
      });
    });

    it("should show error when password is shorter than 8 characters", async () => {
      renderComponent();

      await waitFor(() => {
        fireEvent.click(getRadioByLabel("Provider"));
        fillValidCommonFields();
        fireEvent.change(
          screen.getByPlaceholderText(/Choose a strong password/i),
          {
            target: { name: "password", value: "1234567" },
          },
        );
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));

        expect(
          screen.getByText(/Password must be at least 8 characters long/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Form submission", () => {
    it("should submit form and navigate on success", async () => {
      checkAdminExists.mockResolvedValue({ success: true, adminExists: true });
      registerUser.mockResolvedValue({ success: true });

      renderComponent();

      await waitFor(() => {
        fireEvent.click(getRadioByLabel("Provider"));
        fillValidCommonFields();
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));
      });

      await waitFor(() => {
        expect(registerUser).toHaveBeenCalledWith({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          userType: "provider",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/RegisteredPage");
      });
    });

    it("should display loading spinner in button during submission", async () => {
      checkAdminExists.mockResolvedValue({ success: true, adminExists: true });
      registerUser.mockReturnValue(new Promise(() => {})); // Never resolves

      renderComponent();

      await waitFor(() => {
        fireEvent.click(getRadioByLabel("Provider"));
        fillValidCommonFields();
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));
      });

      const submitButton = screen.getByRole("button", { name: /Register/i });
      expect(submitButton).toBeDisabled();

      const spinner = submitButton.querySelector(".spinner-border");
      expect(spinner).toBeInTheDocument();

      expect(spinner.style.display).toBe("inline-block");
    });
  });
});
