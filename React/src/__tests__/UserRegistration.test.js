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
      () => mockNavigate
    );
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UserRegistration />
      </BrowserRouter>
    );
  };

  const getRadioByLabel = (labelText) => {
    const labelElement = screen.getByText(labelText);

    const label = labelElement.closest("label");
    return label.querySelector('input[type="radio"]');
  };

  describe("Initial render and admin check", () => {
    it("should show all user types while checking admin status", async () => {
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
        expect(screen.getByText(/Provider/i)).toBeInTheDocument();
        expect(screen.getByText(/Developer/i)).toBeInTheDocument();
        expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
      });
    });

    it("should show admin option when no admin exists", async () => {
      checkAdminExists.mockResolvedValue({ success: true, adminExists: false });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Provider/i)).toBeInTheDocument();
        expect(screen.getByText(/Developer/i)).toBeInTheDocument();
        expect(screen.getByText(/Admin/i)).toBeInTheDocument();
      });
    });

    it("should handle admin check error gracefully", async () => {
      checkAdminExists.mockRejectedValue(new Error("API Error"));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Provider/i)).toBeInTheDocument();
        expect(screen.getByText(/Developer/i)).toBeInTheDocument();
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
        expect(
          screen.getByPlaceholderText(/Organisation name/i)
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(/Email address/i)
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(/Choose a strong password/i)
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /Register/i })
        ).toBeInTheDocument();
      });
    });

    it("should update form data on input change", async () => {
      renderComponent();

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(/Organisation name/i);
        const emailInput = screen.getByPlaceholderText(/Email address/i);
        const passwordInput = screen.getByPlaceholderText(
          /Choose a strong password/i
        );

        fireEvent.change(nameInput, {
          target: { name: "name", value: "Test Org" },
        });
        fireEvent.change(emailInput, {
          target: { name: "email", value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
          target: { name: "password", value: "password123" },
        });

        expect(nameInput.value).toBe("Test Org");
        expect(emailInput.value).toBe("test@example.com");
        expect(passwordInput.value).toBe("password123");
      });
    });

    it("should show error when no user type is selected", async () => {
      renderComponent();

      await waitFor(() => {
        const submitButton = screen.getByRole("button", { name: /Register/i });

        fireEvent.click(submitButton);

        expect(
          screen.getByText(/Please select a user type/i)
        ).toBeInTheDocument();
        expect(registerUser).not.toHaveBeenCalled();
      });
    });

    it("should show error when password is too short", async () => {
      renderComponent();

      await waitFor(() => {
        const providerRadio = getRadioByLabel("Provider");
        fireEvent.click(providerRadio);

        fireEvent.change(screen.getByPlaceholderText(/Organisation name/i), {
          target: { name: "name", value: "Test Org" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
          target: { name: "email", value: "test@example.com" },
        });
        fireEvent.change(
          screen.getByPlaceholderText(/Choose a strong password/i),
          {
            target: { name: "password", value: "123" },
          }
        );

        const submitButton = screen.getByRole("button", { name: /Register/i });
        fireEvent.click(submitButton);

        expect(
          screen.getByText(/Password must be at least 8 characters long/i)
        ).toBeInTheDocument();
        expect(registerUser).not.toHaveBeenCalled();
      });
    });

    it("should clear user type error when a user type is selected", async () => {
      renderComponent();

      await waitFor(() => {
        const submitButton = screen.getByRole("button", { name: /Register/i });

        fireEvent.click(submitButton);
        expect(
          screen.getByText(/Please select a user type/i)
        ).toBeInTheDocument();

        const providerRadio = getRadioByLabel("Provider");
        fireEvent.click(providerRadio);

        expect(
          screen.queryByText(/Please select a user type/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Form submission", () => {
    beforeEach(() => {
      checkAdminExists.mockResolvedValue({ success: true, adminExists: true });
    });

    it("should submit form successfully with valid data", async () => {
      registerUser.mockResolvedValue({ success: true });

      renderComponent();

      await waitFor(() => {
        const providerRadio = getRadioByLabel("Provider");
        fireEvent.click(providerRadio);

        fireEvent.change(screen.getByPlaceholderText(/Organisation name/i), {
          target: { name: "name", value: "Test Org" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
          target: { name: "email", value: "test@example.com" },
        });
        fireEvent.change(
          screen.getByPlaceholderText(/Choose a strong password/i),
          {
            target: { name: "password", value: "password123" },
          }
        );

        const submitButton = screen.getByRole("button", { name: /Register/i });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(registerUser).toHaveBeenCalledWith({
          name: "Test Org",
          email: "test@example.com",
          password: "password123",
          userType: "provider",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/RegisteredPage");
      });
    });

    it("should show loading spinner during submission", async () => {
      let resolvePromise;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      registerUser.mockReturnValue(pendingPromise);

      renderComponent();

      await waitFor(async () => {
        const providerRadio = getRadioByLabel("Provider");
        fireEvent.click(providerRadio);

        fireEvent.change(screen.getByPlaceholderText(/Organisation name/i), {
          target: { name: "name", value: "Test Org" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
          target: { name: "email", value: "test@example.com" },
        });
        fireEvent.change(
          screen.getByPlaceholderText(/Choose a strong password/i),
          {
            target: { name: "password", value: "password123" },
          }
        );

        const submitButton = screen.getByRole("button", { name: /Register/i });
        fireEvent.click(submitButton);
      });

      const submitButton = screen.getByRole("button", { name: /Register/i });
      expect(submitButton).toBeDisabled();

      const spinner = submitButton.querySelector(".spinner-border");
      expect(spinner).toBeInTheDocument();

      await act(async () => {
        resolvePromise({ success: true });
      });

      expect(submitButton).not.toBeDisabled();
    });

    it("should show error message when registration fails", async () => {
      registerUser.mockResolvedValue({
        success: false,
        message: "Email already exists",
      });

      renderComponent();

      await waitFor(() => {
        const providerRadio = getRadioByLabel("Provider");
        fireEvent.click(providerRadio);

        fireEvent.change(screen.getByPlaceholderText(/Organisation name/i), {
          target: { name: "name", value: "Test Org" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
          target: { name: "email", value: "test@example.com" },
        });
        fireEvent.change(
          screen.getByPlaceholderText(/Choose a strong password/i),
          {
            target: { name: "password", value: "password123" },
          }
        );

        const submitButton = screen.getByRole("button", { name: /Register/i });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it("should show generic error message when API call fails", async () => {
      registerUser.mockRejectedValue(new Error("Network error"));

      renderComponent();

      await waitFor(() => {
        const providerRadio = getRadioByLabel("Provider");
        fireEvent.click(providerRadio);

        fireEvent.change(screen.getByPlaceholderText(/Organisation name/i), {
          target: { name: "name", value: "Test Org" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
          target: { name: "email", value: "test@example.com" },
        });
        fireEvent.change(
          screen.getByPlaceholderText(/Choose a strong password/i),
          {
            target: { name: "password", value: "password123" },
          }
        );

        const submitButton = screen.getByRole("button", { name: /Register/i });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  describe("Accessibility and tooltips", () => {
    beforeEach(() => {
      checkAdminExists.mockResolvedValue({ success: true, adminExists: true });
    });

    it("should have aria-live attribute for error messages", async () => {
      renderComponent();

      await waitFor(() => {
        const errorElement = document.querySelector('[aria-live="polite"]');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveAttribute("aria-live", "polite");
        expect(errorElement).toHaveAttribute("id", "error-message");
      });
    });

    it("should have tooltip titles for user types", async () => {
      renderComponent();

      await waitFor(() => {
        const questionMarks = screen.getAllByText("?");
        expect(questionMarks).toHaveLength(2);

        questionMarks.forEach((mark) => {
          expect(mark).toHaveAttribute("title");
          expect(mark.getAttribute("title").length).toBeGreaterThan(0);
        });
      });
    });
  });
});
