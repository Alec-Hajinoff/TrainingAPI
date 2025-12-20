import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CourseSubmissionForm from "../CourseSubmissionForm";
import { inputDataFunction } from "../ApiService";

jest.mock("../ApiService", () => ({
  inputDataFunction: jest.fn(),
}));

describe("CourseSubmissionForm Component", () => {
  const fillFormWithValidData = async () => {
    const titleTextarea = screen.getByLabelText("Course Title *");
    fireEvent.change(titleTextarea, {
      target: { value: "Introduction to React" },
    });

    const descriptionTextarea = screen.getByLabelText("Description *");
    fireEvent.change(descriptionTextarea, {
      target: { value: "Learn React basics" },
    });

    const outcomesTextarea = screen.getByLabelText("Learning Outcomes *");
    fireEvent.change(outcomesTextarea, {
      target: { value: "Build basic React apps" },
    });

    const subjectAreaSelect = screen.getByLabelText("Subject Area *");
    fireEvent.change(subjectAreaSelect, {
      target: { value: "Technology, Digital & Cyber" },
    });

    await waitFor(() => {
      const subjectSelect = screen.getByLabelText("Subject *");
      expect(subjectSelect).not.toBeDisabled();
    });

    const subjectSelect = screen.getByLabelText("Subject *");
    fireEvent.change(subjectSelect, {
      target: { value: "Software Engineering" },
    });

    const deliverySelect = screen.getByLabelText("Delivery Type *");
    fireEvent.change(deliverySelect, { target: { value: "Virtual" } });

    const countrySelect = screen.getByLabelText("Country of Delivery *");
    fireEvent.change(countrySelect, { target: { value: "United States" } });

    const durationInput = screen.getByLabelText("Duration (hours) *");
    fireEvent.change(durationInput, { target: { value: "10.5" } });

    const priceInput = screen.getByLabelText("Total Price (excluding VAT) *");
    fireEvent.change(priceInput, { target: { value: "299.99" } });

    const providerInput = screen.getByLabelText("Provider Name *");
    fireEvent.change(providerInput, { target: { value: "Tech Academy" } });

    const emailInput = screen.getByLabelText("Contact Email *");
    fireEvent.change(emailInput, {
      target: { value: "contact@techacademy.com" },
    });

    const phoneInput = screen.getByLabelText("Contact Phone *");
    fireEvent.change(phoneInput, { target: { value: "+1234567890" } });

    const websiteInput = screen.getByLabelText("Provider Website *");
    fireEvent.change(websiteInput, {
      target: { value: "https://techacademy.com" },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form with all required fields", () => {
    render(<CourseSubmissionForm />);

    expect(screen.getByLabelText("Course Title *")).toBeInTheDocument();
    expect(screen.getByLabelText("Description *")).toBeInTheDocument();
    expect(screen.getByLabelText("Learning Outcomes *")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject Area *")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject *")).toBeInTheDocument();
    expect(screen.getByLabelText("Delivery Type *")).toBeInTheDocument();
    expect(screen.getByLabelText("Country of Delivery *")).toBeInTheDocument();
    expect(screen.getByLabelText("Duration (hours) *")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Total Price (excluding VAT) *")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Provider Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Email *")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Phone *")).toBeInTheDocument();
    expect(screen.getByLabelText("Provider Website *")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  test("disables subject dropdown when no subject area is selected", () => {
    render(<CourseSubmissionForm />);

    const subjectSelect = screen.getByLabelText("Subject *");
    expect(subjectSelect).toBeDisabled();
  });

  test("enables subject dropdown when subject area is selected", async () => {
    render(<CourseSubmissionForm />);

    const subjectAreaSelect = screen.getByLabelText("Subject Area *");
    fireEvent.change(subjectAreaSelect, {
      target: { value: "Technology, Digital & Cyber" },
    });

    await waitFor(() => {
      const subjectSelect = screen.getByLabelText("Subject *");
      expect(subjectSelect).not.toBeDisabled();
    });
  });

  test("clears subject when subject area is changed", async () => {
    render(<CourseSubmissionForm />);

    const subjectAreaSelect = screen.getByLabelText("Subject Area *");
    fireEvent.change(subjectAreaSelect, {
      target: { value: "Technology, Digital & Cyber" },
    });

    await waitFor(() => {
      const subjectSelect = screen.getByLabelText("Subject *");
      expect(subjectSelect).not.toBeDisabled();
    });

    const subjectSelect = screen.getByLabelText("Subject *");
    fireEvent.change(subjectSelect, {
      target: { value: "Software Engineering" },
    });

    fireEvent.change(subjectAreaSelect, {
      target: { value: "Accounting & Finance" },
    });

    await waitFor(() => {
      expect(subjectSelect.value).toBe("");
    });
  });

  test("shows validation errors when form is submitted empty", async () => {
    render(<CourseSubmissionForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      const errorMessages = screen.getAllByText("This field is required");
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  test("validates email format", async () => {
    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    const emailInput = screen.getByLabelText("Contact Email *");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });
  });

  test("validates URL format", async () => {
    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    const websiteInput = screen.getByLabelText("Provider Website *");
    fireEvent.change(websiteInput, { target: { value: "not-a-valid-url" } });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid URL/)).toBeInTheDocument();
    });
  });

  test("validates positive numbers for duration and price", async () => {
    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    const durationInput = screen.getByLabelText("Duration (hours) *");
    fireEvent.change(durationInput, { target: { value: "-5" } });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid positive number")
      ).toBeInTheDocument();
    });
  });

  test("validates positive numbers for price", async () => {
    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    const priceInput = screen.getByLabelText("Total Price (excluding VAT) *");
    fireEvent.change(priceInput, { target: { value: "0" } });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid positive number")
      ).toBeInTheDocument();
    });
  });

  test("shows loading state when submitting", async () => {
    inputDataFunction.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100);
        })
    );

    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Saving your course, please wait…")
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  test("handles successful form submission", async () => {
    inputDataFunction.mockResolvedValue({
      success: true,
      message: "Course created successfully",
    });

    const mockOnCourseAdded = jest.fn();
    render(<CourseSubmissionForm onCourseAdded={mockOnCourseAdded} />);

    await fillFormWithValidData();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Course submitted successfully!")
      ).toBeInTheDocument();
    });

    expect(mockOnCourseAdded).toHaveBeenCalled();

    expect(inputDataFunction).toHaveBeenCalled();
  });

  test("handles failed form submission", async () => {
    inputDataFunction.mockResolvedValue({
      success: false,
      message: "Server error: Could not create course",
    });

    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Server error: Could not create course")
      ).toBeInTheDocument();
    });
  });

  test("handles API exception", async () => {
    inputDataFunction.mockRejectedValue(new Error("Network error"));

    render(<CourseSubmissionForm />);

    await fillFormWithValidData();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  test("clears validation errors when user starts typing", async () => {
    render(<CourseSubmissionForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      const errorMessages = screen.getAllByText("This field is required");
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    const titleTextarea = screen.getByLabelText("Course Title *");
    const titleFormGroup = titleTextarea.closest(".form-group");

    expect(titleTextarea).toHaveClass("is-invalid");
    expect(
      titleFormGroup.querySelector(".invalid-feedback")
    ).toBeInTheDocument();

    fireEvent.change(titleTextarea, { target: { value: "New Course" } });

    await waitFor(() => {
      expect(titleTextarea).not.toHaveClass("is-invalid");
    });

    await waitFor(() => {
      expect(
        titleFormGroup.querySelector(".invalid-feedback")
      ).not.toBeInTheDocument();
    });

    const remainingErrors = screen.getAllByText("This field is required");
    expect(remainingErrors.length).toBeGreaterThan(0);
  });

  test("resets form when resetForm method is called", async () => {
    const ref = React.createRef();
    render(<CourseSubmissionForm ref={ref} />);

    const titleTextarea = screen.getByLabelText("Course Title *");
    fireEvent.change(titleTextarea, { target: { value: "Test Course" } });

    const emailInput = screen.getByLabelText("Contact Email *");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(titleTextarea.value).toBe("Test Course");
    expect(emailInput.value).toBe("test@example.com");

    ref.current.resetForm();

    await waitFor(() => {
      expect(titleTextarea.value).toBe("");
    });

    await waitFor(() => {
      expect(emailInput.value).toBe("");
    });
  });

  test("clears success and error messages when form data changes", async () => {
    inputDataFunction.mockResolvedValue({
      success: true,
      message: "Course submitted successfully!",
    });

    render(<CourseSubmissionForm />);

    await fillFormWithValidData();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Course submitted successfully!")
      ).toBeInTheDocument();
    });

    const titleTextarea = screen.getByLabelText("Course Title *");
    fireEvent.change(titleTextarea, {
      target: { value: "Updated Course Title" },
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Course submitted successfully!")
      ).not.toBeInTheDocument();
    });
  });
});
