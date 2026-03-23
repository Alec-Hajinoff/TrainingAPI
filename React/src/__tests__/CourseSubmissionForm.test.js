import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CourseSubmissionForm from "../CourseSubmissionForm";
import { inputDataFunction } from "../ApiService";

jest.mock("../ApiService", () => ({
  inputDataFunction: jest.fn(),
}));

describe("CourseSubmissionForm Component", () => {
  const fillFormWithValidData = async () => {
    const titleTextarea = screen.getByLabelText(/Workshop title \*/i);
    fireEvent.change(titleTextarea, {
      target: { value: "Introduction to React" },
    });

    const descriptionTextarea = screen.getByLabelText(/Description \*/i);
    fireEvent.change(descriptionTextarea, {
      target: { value: "Learn React basics" },
    });

    const outcomesTextarea = screen.getByLabelText(/Learning outcomes \*/i);
    fireEvent.change(outcomesTextarea, {
      target: { value: "Build basic React apps" },
    });

    const subjectAreaSelect = screen.getByLabelText(/Subject area \*/i);
    fireEvent.change(subjectAreaSelect, {
      target: { value: "Software Engineering" },
    });

    await waitFor(() => {
      const subjectSelect = screen.getByLabelText(/Subject \*/i);
      expect(subjectSelect).not.toBeDisabled();
    });

    const subjectSelect = screen.getByLabelText(/Subject \*/i);
    fireEvent.change(subjectSelect, {
      target: { value: "JavaScript Development" },
    });

    const deliverySelect = screen.getByLabelText(/Delivery type \*/i);
    fireEvent.change(deliverySelect, { target: { value: "Virtual" } });

    const countrySelect = screen.getByLabelText(/Country of delivery \*/i);
    fireEvent.change(countrySelect, { target: { value: "Global" } });

    const durationInput = screen.getByLabelText(/Duration \(hours\) \*/i);
    fireEvent.change(durationInput, { target: { value: "10.5" } });

    const priceInput = screen.getByLabelText(
      /Total price £ \(excluding VAT\) \*/i,
    );
    fireEvent.change(priceInput, { target: { value: "299.99" } });

    const providerInput = screen.getByLabelText(
      /Provider or independent instructor name \*/i,
    );
    fireEvent.change(providerInput, { target: { value: "Tech Academy" } });

    const emailInput = screen.getByLabelText(/Contact email \*/i);
    fireEvent.change(emailInput, {
      target: { value: "contact@techacademy.com" },
    });

    const phoneInput = screen.getByLabelText(/Contact phone \*/i);
    fireEvent.change(phoneInput, { target: { value: "+123456789012" } });

    const websiteInput = screen.getByLabelText(
      /Provider or independent instructor website \*/i,
    );
    fireEvent.change(websiteInput, {
      target: { value: "https://techacademy.com" },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form with all required fields", () => {
    render(<CourseSubmissionForm />);

    expect(screen.getByLabelText(/Workshop title \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Learning outcomes \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject area \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Delivery type \*/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Country of delivery \*/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration \(hours\) \*/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Total price £ \(excluding VAT\) \*/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Provider or independent instructor name \*/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact phone \*/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Provider or independent instructor website \*/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    ).toBeInTheDocument();
  });

  test("disables subject dropdown when no subject area is selected", () => {
    render(<CourseSubmissionForm />);

    const subjectSelect = screen.getByLabelText(/Subject \*/i);
    expect(subjectSelect).toBeDisabled();
  });

  test("enables subject dropdown when subject area is selected", async () => {
    render(<CourseSubmissionForm />);

    const subjectAreaSelect = screen.getByLabelText(/Subject area \*/i);
    fireEvent.change(subjectAreaSelect, {
      target: { value: "Software Engineering" },
    });

    await waitFor(() => {
      const subjectSelect = screen.getByLabelText(/Subject \*/i);
      expect(subjectSelect).not.toBeDisabled();
    });
  });

  test("clears subject when subject area is changed", async () => {
    render(<CourseSubmissionForm />);

    const subjectAreaSelect = screen.getByLabelText(/Subject area \*/i);
    fireEvent.change(subjectAreaSelect, {
      target: { value: "Software Engineering" },
    });

    await waitFor(() => {
      const subjectSelect = screen.getByLabelText(/Subject \*/i);
      expect(subjectSelect).not.toBeDisabled();
    });

    const subjectSelect = screen.getByLabelText(/Subject \*/i);
    fireEvent.change(subjectSelect, {
      target: { value: "JavaScript Development" },
    });

    fireEvent.change(subjectAreaSelect, {
      target: { value: "Cybersecurity" },
    });

    await waitFor(() => {
      expect(subjectSelect.value).toBe("");
    });
  });

  test("shows validation errors when form is submitted empty", async () => {
    render(<CourseSubmissionForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    );

    await waitFor(() => {
      const errorMessages = screen.getAllByText("This field is required");
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  test("validates email format", async () => {
    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    const emailInput = screen.getByLabelText(/Contact email \*/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeInTheDocument();
    });
  });

  test("validates URL format", async () => {
    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    const websiteInput = screen.getByLabelText(
      /Provider or independent instructor website \*/i,
    );
    fireEvent.change(websiteInput, { target: { value: "not-a-valid-url" } });

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid URL/)).toBeInTheDocument();
    });
  });

  test("validates positive numbers for duration and price", async () => {
    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    const durationInput = screen.getByLabelText(/Duration \(hours\) \*/i);
    fireEvent.change(durationInput, { target: { value: "-5" } });

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid positive number"),
      ).toBeInTheDocument();
    });
  });

  test("shows loading state when submitting", async () => {
    inputDataFunction.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100);
        }),
    );

    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Saving your course, please wait…"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    ).toBeDisabled();
  });

  test("handles successful form submission", async () => {
    inputDataFunction.mockResolvedValue({
      success: true,
      message: "Course submitted successfully!",
    });

    const mockOnCourseAdded = jest.fn();
    render(<CourseSubmissionForm onCourseAdded={mockOnCourseAdded} />);

    await fillFormWithValidData();

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Course submitted successfully!"),
      ).toBeInTheDocument();
    });

    expect(mockOnCourseAdded).toHaveBeenCalled();
    expect(inputDataFunction).toHaveBeenCalled();
  });

  test("handles failed form submission", async () => {
    inputDataFunction.mockResolvedValue({
      success: false,
      message: "Server error: Could not create workshop",
    });

    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Server error: Could not create workshop"),
      ).toBeInTheDocument();
    });
  });

  test("clears success and error messages when form data changes", async () => {
    inputDataFunction.mockResolvedValue({
      success: true,
      message: "Course submitted successfully!",
    });

    render(<CourseSubmissionForm />);

    await fillFormWithValidData();
    fireEvent.click(
      screen.getByRole("button", { name: /Submit your workshop/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Course submitted successfully!"),
      ).toBeInTheDocument();
    });

    const titleTextarea = screen.getByLabelText(/Workshop title \*/i);
    fireEvent.change(titleTextarea, {
      target: { value: "Updated Workshop Title" },
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Course submitted successfully!"),
      ).not.toBeInTheDocument();
    });
  });

  test("resets form when resetForm method is called", async () => {
    const ref = React.createRef();
    render(<CourseSubmissionForm ref={ref} />);

    const titleTextarea = screen.getByLabelText(/Workshop title \*/i);
    fireEvent.change(titleTextarea, { target: { value: "Test Workshop" } });

    const emailInput = screen.getByLabelText(/Contact email \*/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(titleTextarea.value).toBe("Test Workshop");
    expect(emailInput.value).toBe("test@example.com");

    ref.current.resetForm();

    await waitFor(() => {
      expect(titleTextarea.value).toBe("");
      expect(emailInput.value).toBe("");
    });
  });
});
