import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CourseList from "../CourseList";
import { fetchUserCourses, updateCourse, deleteCourse } from "../ApiService";

jest.mock("../ApiService", () => ({
  fetchUserCourses: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
}));

describe("CourseList Component", () => {
  const mockCourses = [
    {
      id: 1,
      course_title: "Introduction to AI",
      subject_area: "Artificial Intelligence & Machine Learning",
      subject: "Applied Machine Learning",
      delivery_type: "Virtual",
      country_of_delivery: "Global",
      duration: "10.5",
      total_price: "299.99",
      description: "Learn AI basics",
      learning_outcomes: "Build basic AI applications",
      provider_name: "AI Academy",
      contact_email: "contact@aiacademy.com",
      contact_phone: "+1234567890",
      provider_website: "aiacademy.com",
      provider_users_id: 123,
    },
    {
      id: 2,
      course_title: "Cybersecurity Fundamentals",
      subject_area: "Cybersecurity",
      subject: "Cloud Security",
      delivery_type: "In-person",
      country_of_delivery: "Global",
      duration: "20.0",
      total_price: "599.99",
      description: "Secure your infrastructure",
      learning_outcomes: "Implement security best practices",
      provider_name: "Security Institute",
      contact_email: "info@securityinst.com",
      contact_phone: "+441234567890",
      provider_website: "https://securityinst.com",
      provider_users_id: 124,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    fetchUserCourses.mockImplementation(() => new Promise(() => {}));
    render(<CourseList refreshTrigger={false} />);

    expect(screen.getByText(/Your workshops/i)).toBeInTheDocument();
    expect(screen.getByText("Loading workshops...")).toBeInTheDocument();
  });

  test("renders error state when API fails", async () => {
    fetchUserCourses.mockRejectedValue(new Error("Network error"));

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load courses. Please try again."),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Try Again" }),
    ).toBeInTheDocument();
  });

  test("renders empty state when no courses", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [],
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Your workshops (0)")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Get started by creating your first workshop."),
    ).toBeInTheDocument();
  });

  test("renders workshops list correctly", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Your workshops (2)")).toBeInTheDocument();
    });

    expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    expect(screen.getByText("Cybersecurity Fundamentals")).toBeInTheDocument();

    expect(
      screen.getByText(
        /Artificial Intelligence & Machine Learning > Applied Machine Learning/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cybersecurity > Cloud Security/),
    ).toBeInTheDocument();

    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  test("displays workshop details correctly", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]],
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    });

    expect(screen.getByText("Virtual")).toBeInTheDocument();
    expect(screen.getByText("Global")).toBeInTheDocument();
    expect(screen.getByText("10.5 hours")).toBeInTheDocument();
    expect(screen.getByText("£299.99 (excl. VAT)")).toBeInTheDocument();
    expect(screen.getByText("Learn AI basics")).toBeInTheDocument();
    expect(screen.getByText("Build basic AI applications")).toBeInTheDocument();

    expect(screen.getByText("AI Academy")).toBeInTheDocument();
    expect(screen.getByText("contact@aiacademy.com")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();

    const websiteLink = screen.getByText("aiacademy.com");
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink.closest("a")).toHaveAttribute(
      "href",
      "https://aiacademy.com",
    );
  });

  test("enters edit mode when Edit button is clicked", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]],
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    const titleTextarea = screen.getByDisplayValue("Introduction to AI");
    expect(titleTextarea).toBeInTheDocument();

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  test("cancels edit mode when Cancel button is clicked", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]],
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  test("updates form fields in edit mode", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]],
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    const titleTextarea = screen.getByDisplayValue("Introduction to AI");
    fireEvent.change(titleTextarea, {
      target: { value: "Advanced AI" },
    });
    expect(titleTextarea.value).toBe("Advanced AI");

    const durationInput = screen.getByDisplayValue("10.5");
    fireEvent.change(durationInput, { target: { value: "15.5" } });
    expect(durationInput.value).toBe("15.5");
  });

  test("handles successful workshop update", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]],
    });

    updateCourse.mockResolvedValue({
      success: true,
      message: "Course updated successfully",
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(updateCourse).toHaveBeenCalled();
      expect(
        screen.getByText("Workshop updated successfully!"),
      ).toBeInTheDocument();
    });
  });

  test("shows 'Sure?' confirmation text when first clicking Delete", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]],
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    expect(screen.getByText("Sure?")).toBeInTheDocument();
  });

  test("handles successful workshop deletion on second click", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]],
    });

    deleteCourse.mockResolvedValue({
      success: true,
      message: "Course deleted successfully",
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Delete");

    fireEvent.click(deleteButton);
    expect(screen.getByText("Sure?")).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteCourse).toHaveBeenCalledWith(1);
      expect(
        screen.getByText("Course deleted successfully!"),
      ).toBeInTheDocument();
    });
  });

  test("handles subject area and subject dropdown dependency", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]],
    });

    render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Introduction to AI")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    const subjectAreaDropdown = document.querySelector(
      'select[name="subject_area"]',
    );

    fireEvent.change(subjectAreaDropdown, {
      target: { value: "Software Engineering" },
    });

    const subjectDropdown = document.querySelector('select[name="subject"]');
    expect(subjectDropdown).toBeInTheDocument();
    expect(subjectDropdown.innerHTML).toContain("Python Programming");
  });

  test("refreshes workshops when refreshTrigger changes", async () => {
    fetchUserCourses
      .mockResolvedValueOnce({
        success: true,
        courses: [mockCourses[0]],
      })
      .mockResolvedValueOnce({
        success: true,
        courses: [mockCourses[0], mockCourses[1]],
      });

    const { rerender } = render(<CourseList refreshTrigger={false} />);

    await waitFor(() => {
      expect(screen.getByText("Your workshops (1)")).toBeInTheDocument();
    });

    rerender(<CourseList refreshTrigger={true} />);

    await waitFor(() => {
      expect(fetchUserCourses).toHaveBeenCalledTimes(2);
      expect(screen.getByText("Your workshops (2)")).toBeInTheDocument();
    });
  });
});
