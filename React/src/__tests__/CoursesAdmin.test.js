import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CoursesAdmin from "../CoursesAdmin";
import {
  coursesGetAdmin,
  updateCourseAdmin,
  deleteCourseAdmin,
} from "../ApiService";

jest.mock("../ApiService", () => ({
  coursesGetAdmin: jest.fn(),
  updateCourseAdmin: jest.fn(),
  deleteCourseAdmin: jest.fn(),
}));

describe("CoursesAdmin Component", () => {
  const mockCourses = [
    {
      id: 1,
      course_title: "Advanced Machine Learning",
      subject_area: "Artificial Intelligence & Machine Learning",
      subject: "Applied Machine Learning",
      delivery_type: "Virtual",
      country_of_delivery: "Global",
      duration: "20.0",
      total_price: "1500.00",
      description: "Deep dive into ML algorithms.",
      learning_outcomes: "Build and deploy ML models.",
      provider_name: "AI Academy",
      contact_email: "admin@aiacademy.com",
      contact_phone: "123456789",
      provider_website: "aiacademy.com",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

  test("renders loading state initially", () => {
    coursesGetAdmin.mockImplementation(() => new Promise(() => {}));
    render(<CoursesAdmin />);

    expect(screen.getByText(/Available workshops/i)).toBeInTheDocument();
    expect(screen.getByText("Loading catalog...")).toBeInTheDocument();
  });

  test("renders empty state when API fails", async () => {
    coursesGetAdmin.mockRejectedValue(new Error("API failure"));

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (0)")).toBeInTheDocument();
      expect(
        screen.getByText(
          "No workshops are currently available in the directory.",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Download CSV/i }),
    ).toBeDisabled();
  });

  test("renders empty state message when directory is empty", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: [],
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (0)")).toBeInTheDocument();
      expect(
        screen.getByText(
          "No workshops are currently available in the directory.",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Download CSV/i }),
    ).toBeDisabled();
  });

  test("renders course list and provider details correctly", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    expect(screen.getByText("Advanced Machine Learning")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Artificial Intelligence & Machine Learning > Applied Machine Learning/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Virtual")).toBeInTheDocument();
    expect(screen.getByText("Global")).toBeInTheDocument();
    expect(screen.getByText("20.0 hours")).toBeInTheDocument();
    expect(screen.getByText("£1500.00 (excl. VAT)")).toBeInTheDocument();
    expect(
      screen.getByText("Deep dive into ML algorithms."),
    ).toBeInTheDocument();
    expect(screen.getByText("Build and deploy ML models.")).toBeInTheDocument();
    expect(screen.getByText("AI Academy")).toBeInTheDocument();
    expect(screen.getByText("admin@aiacademy.com")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();

    const websiteLink = screen.getByText("aiacademy.com");
    expect(websiteLink.closest("a")).toHaveAttribute(
      "href",
      "https://aiacademy.com",
    );
  });

  test("enters edit mode when Edit button is clicked", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    expect(screen.getByText("Course Title *")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("cancels edit mode when Cancel button is clicked", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(screen.queryByText("Course Title *")).not.toBeInTheDocument();
    expect(screen.getByText("Advanced Machine Learning")).toBeInTheDocument();
  });

  test("updates course successfully", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    updateCourseAdmin.mockResolvedValue({
      success: true,
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    const titleTextarea = screen.getByDisplayValue("Advanced Machine Learning");
    fireEvent.change(titleTextarea, {
      target: { value: "Updated Machine Learning" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Workshop updated successfully!"),
      ).toBeInTheDocument();
    });

    expect(updateCourseAdmin).toHaveBeenCalled();
  });

  test("shows error on update failure", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    updateCourseAdmin.mockResolvedValue({
      success: false,
      message: "Update failed",
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  test("shows delete confirmation on first delete click", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    expect(screen.getByText("Sure?")).toBeInTheDocument();
  });

  test("deletes course on confirmation", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    deleteCourseAdmin.mockResolvedValue({
      success: true,
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Course deleted successfully!"),
      ).toBeInTheDocument();
    });

    expect(deleteCourseAdmin).toHaveBeenCalledWith(1);
  });

  test("shows error on delete failure", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    deleteCourseAdmin.mockResolvedValue({
      success: false,
      message: "Delete failed",
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });
  });

  test("triggers CSV download flow when clicked", async () => {
    coursesGetAdmin.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    render(<CoursesAdmin />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Download CSV/i }),
      ).not.toBeDisabled();
    });

    const link = {
      setAttribute: jest.fn(),
      click: jest.fn(),
      style: {},
    };
    const createElementSpy = jest
      .spyOn(document, "createElement")
      .mockReturnValue(link);
    const appendChildSpy = jest
      .spyOn(document.body, "appendChild")
      .mockImplementation(() => {});
    const removeChildSpy = jest
      .spyOn(document.body, "removeChild")
      .mockImplementation(() => {});

    fireEvent.click(screen.getByRole("button", { name: /Download CSV/i }));

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(link.setAttribute).toHaveBeenCalledWith(
      "download",
      expect.stringMatching(/catalogue_of_workshops_.*\.csv/),
    );
    expect(link.click).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
