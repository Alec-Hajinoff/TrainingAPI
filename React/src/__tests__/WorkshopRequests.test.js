import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WorkshopRequests from "../WorkshopRequests";
import { workshopRequests } from "../ApiService";

jest.mock("../ApiService", () => ({
  workshopRequests: jest.fn(),
}));

describe("WorkshopRequests Component", () => {
  const fillFormWithValidData = () => {
    fireEvent.change(screen.getByLabelText(/Full name \*/i), {
      target: { name: "name", value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email address \*/i), {
      target: { name: "email", value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Organisation name \*/i), {
      target: { name: "organisation", value: "Test Corp" },
    });
    fireEvent.change(
      screen.getByLabelText(/Training requirement description \*/i),
      {
        target: {
          name: "requirement_description",
          value: "We need AI training.",
        },
      },
    );
    fireEvent.change(screen.getByLabelText(/Technology area \*/i), {
      target: {
        name: "technology_area",
        value: "Artificial Intelligence / LLMs",
      },
    });
    fireEvent.change(screen.getByLabelText(/Team size \*/i), {
      target: { name: "team_size", value: "6–10" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred timing \*/i), {
      target: { name: "preferred_timing", value: "1–3 months" },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the workshop request form with all required fields", () => {
    render(<WorkshopRequests />);

    expect(
      screen.getByText(/Don’t see the right workshop\?/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organisation name \*/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Training requirement description \*/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Technology area \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Team size \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred timing \*/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Additional context \(optional\)/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Submit your workshop request/i }),
    ).toBeInTheDocument();
  });

  test("shows validation errors when submitting an empty form", async () => {
    render(<WorkshopRequests />);

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop request/i }),
    );

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/This field is required/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  test("validates email format", async () => {
    render(<WorkshopRequests />);

    fireEvent.change(screen.getByLabelText(/Email address \*/i), {
      target: { name: "email", value: "invalid-email" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop request/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid email address/i),
      ).toBeInTheDocument();
    });
  });

  test("handles successful form submission", async () => {
    workshopRequests.mockResolvedValue({ success: true });

    render(<WorkshopRequests />);

    fillFormWithValidData();

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop request/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Workshop request submitted successfully!/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Full name \*/i).value).toBe("");
  });

  test("handles failed form submission with error message", async () => {
    workshopRequests.mockResolvedValue({
      success: false,
      message: "Submission failed. Please try again later.",
    });

    render(<WorkshopRequests />);

    fillFormWithValidData();

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop request/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Submission failed. Please try again./i),
      ).toBeInTheDocument();
    });
  });

  test("shows loading state while submitting", async () => {
    workshopRequests.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100);
        }),
    );

    render(<WorkshopRequests />);

    fillFormWithValidData();

    const submitButton = screen.getByRole("button", {
      name: /Submit your workshop request/i,
    });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Submitting.../i);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent(/Submit your workshop request/i);
    });
  });
});
