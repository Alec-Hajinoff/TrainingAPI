import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import CourseList from "../CourseList";
import { fetchUserCourses, updateCourse, deleteCourse } from "../ApiService";

// Mock the API service
jest.mock("../ApiService", () => ({
  fetchUserCourses: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
}));

describe("CourseList Component", () => {
  // Sample mock data for testing
  const mockCourses = [
    {
      id: 1,
      course_title: "Introduction to React",
      subject_area: "Technology, Digital & Cyber",
      subject: "Software Engineering",
      delivery_type: "Virtual",
      country_of_delivery: "United States",
      duration: "10.5",
      total_price: "299.99",
      description: "Learn React basics",
      learning_outcomes: "Build basic React applications",
      provider_name: "Tech Academy",
      contact_email: "contact@techacademy.com",
      contact_phone: "+1234567890",
      provider_website: "https://techacademy.com",
      provider_users_id: 123
    },
    {
      id: 2,
      course_title: "Financial Modeling",
      subject_area: "Accounting & Finance",
      subject: "Financial Modelling",
      delivery_type: "In-person",
      country_of_delivery: "United Kingdom",
      duration: "20.0",
      total_price: "599.99",
      description: "Advanced financial modeling techniques",
      learning_outcomes: "Create complex financial models",
      provider_name: "Finance Institute",
      contact_email: "info@financeinstitute.com",
      contact_phone: "+441234567890",
      provider_website: "financeinstitute.com",
      provider_users_id: 124
    }
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    fetchUserCourses.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<CourseList refreshTrigger={false} />);
    
    expect(screen.getByText("Your Courses")).toBeInTheDocument();
    expect(screen.getByText("Loading courses...")).toBeInTheDocument();
  });

  test("renders error state when API fails", async () => {
    fetchUserCourses.mockRejectedValue(new Error("Network error"));
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Failed to load courses. Please try again.")).toBeInTheDocument();
    });
    
    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });

  test("renders empty state when no courses", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: []
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Your Courses (0)")).toBeInTheDocument();
    });
    
    expect(screen.getByText("You haven't created any courses yet.")).toBeInTheDocument();
  });

  test("renders courses list correctly", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: mockCourses
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Your Courses (2)")).toBeInTheDocument();
    });
    
    // Check if course titles are displayed
    expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    expect(screen.getByText("Financial Modeling")).toBeInTheDocument();
    
    // Check if subject information is displayed
    expect(screen.getByText(/Technology, Digital & Cyber > Software Engineering/)).toBeInTheDocument();
    expect(screen.getByText(/Accounting & Finance > Financial Modelling/)).toBeInTheDocument();
    
    // Check if Edit and Delete buttons are present for each course
    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  test("displays course details correctly", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Check course details
    expect(screen.getByText("Virtual")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("10.5 hours")).toBeInTheDocument();
    expect(screen.getByText("£299.99 (excl. VAT)")).toBeInTheDocument();
    expect(screen.getByText("Learn React basics")).toBeInTheDocument();
    expect(screen.getByText("Build basic React applications")).toBeInTheDocument();
    
    // Check provider information
    expect(screen.getByText("Provider Information")).toBeInTheDocument();
    expect(screen.getByText("Tech Academy")).toBeInTheDocument();
    expect(screen.getByText("contact@techacademy.com")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
    
    // Check website link
    const websiteLink = screen.getByText("techacademy.com");
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink.closest('a')).toHaveAttribute('href', 'https://techacademy.com');
  });

  test("enters edit mode when Edit button is clicked", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Click Edit button
    fireEvent.click(screen.getByText("Edit"));
    
    // Should show form inputs with current values
    // Using getByDisplayValue to find inputs with specific values
    const titleTextarea = screen.getByDisplayValue("Introduction to React");
    expect(titleTextarea).toBeInTheDocument();
    
    const descriptionTextarea = screen.getByDisplayValue("Learn React basics");
    expect(descriptionTextarea).toBeInTheDocument();
    
    const learningOutcomesTextarea = screen.getByDisplayValue("Build basic React applications");
    expect(learningOutcomesTextarea).toBeInTheDocument();
    
    // Should show Cancel and Save Changes buttons
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  test("cancels edit mode when Cancel button is clicked", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Enter edit mode
    fireEvent.click(screen.getByText("Edit"));
    
    // Verify edit mode
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    
    // Click Cancel
    fireEvent.click(screen.getByText("Cancel"));
    
    // Should exit edit mode
    await waitFor(() => {
      expect(screen.queryByText("Save Changes")).not.toBeInTheDocument();
    });
    
    // Should show Edit button again
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  test("updates form fields in edit mode", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Enter edit mode
    fireEvent.click(screen.getByText("Edit"));
    
    // Get form elements by their name attribute instead
    const titleTextarea = screen.getByRole('textbox', { name: /course title/i });
    fireEvent.change(titleTextarea, { target: { value: "Advanced React Hooks" } });
    expect(titleTextarea.value).toBe("Advanced React Hooks");
    
    // For duration and price inputs, get by display value first, then change
    const durationInput = screen.getByDisplayValue("10.5");
    fireEvent.change(durationInput, { target: { value: "15.5" } });
    expect(durationInput.value).toBe("15.5");
    
    const priceInput = screen.getByDisplayValue("299.99");
    fireEvent.change(priceInput, { target: { value: "399.99" } });
    expect(priceInput.value).toBe("399.99");
  });

  test("handles successful course update", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    updateCourse.mockResolvedValue({
      success: true,
      message: "Course updated successfully"
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Enter edit mode
    fireEvent.click(screen.getByText("Edit"));
    
    // Submit form - get the form by finding an element within it
    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);
    
    // Check if updateCourse was called
    await waitFor(() => {
      expect(updateCourse).toHaveBeenCalled();
    });
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText("Course updated successfully!")).toBeInTheDocument();
    });
  });

  test("handles failed course update", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    updateCourse.mockResolvedValue({
      success: false,
      message: "Update failed: Course not found"
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Enter edit mode
    fireEvent.click(screen.getByText("Edit"));
    
    // Submit form
    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);
    
    // Check error message
    await waitFor(() => {
      expect(screen.getByText("Update failed: Course not found")).toBeInTheDocument();
    });
  });

  test("shows confirmation dialog when deleting course", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    // Mock window.confirm
    const mockConfirm = jest.spyOn(window, 'confirm');
    mockConfirm.mockImplementation(() => false); // User cancels deletion
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Click Delete button
    fireEvent.click(screen.getByText("Delete"));
    
    expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete this course?");
    mockConfirm.mockRestore();
  });

  test("handles successful course deletion", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    deleteCourse.mockResolvedValue({
      success: true,
      message: "Course deleted successfully"
    });
    
    // Mock window.confirm to return true
    const mockConfirm = jest.spyOn(window, 'confirm');
    mockConfirm.mockImplementation(() => true);
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Click Delete button
    fireEvent.click(screen.getByText("Delete"));
    
    // Check if deleteCourse was called with correct ID
    await waitFor(() => {
      expect(deleteCourse).toHaveBeenCalledWith(1);
    });
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText("Course deleted successfully!")).toBeInTheDocument();
    });
    
    mockConfirm.mockRestore();
  });

      test("handles subject area and subject dropdown dependency", async () => {
    fetchUserCourses.mockResolvedValue({
      success: true,
      courses: [mockCourses[0]]
    });
    
    render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Introduction to React")).toBeInTheDocument();
    });
    
    // Enter edit mode
    fireEvent.click(screen.getByText("Edit"));
    
    // Get subject area dropdown using querySelector with name attribute
    const subjectAreaDropdown = document.querySelector('select[name="subject_area"]');
    
    // Change subject area
    fireEvent.change(subjectAreaDropdown, { 
      target: { value: "Accounting & Finance" }
    });
    
    // Get subject dropdown
    const subjectDropdown = document.querySelector('select[name="subject"]');
    
    expect(subjectDropdown).toBeInTheDocument();
    // The subject dropdown should now have options for Accounting & Finance
    // We can check that it contains the right options
    expect(subjectDropdown.innerHTML).toContain("AAT"); // An option from Accounting & Finance
  });
  
  test("refreshes courses when refreshTrigger changes", async () => {
    fetchUserCourses
      .mockResolvedValueOnce({
        success: true,
        courses: [mockCourses[0]]
      })
      .mockResolvedValueOnce({
        success: true,
        courses: [mockCourses[0], mockCourses[1]]
      });
    
    const { rerender } = render(<CourseList refreshTrigger={false} />);
    
    await waitFor(() => {
      expect(screen.getByText("Your Courses (1)")).toBeInTheDocument();
    });
    
    // Change refreshTrigger to trigger a reload
    rerender(<CourseList refreshTrigger={true} />);
    
    // Should call fetchUserCourses again
    await waitFor(() => {
      expect(fetchUserCourses).toHaveBeenCalledTimes(2);
    });
    
    // Should show updated course count
    await waitFor(() => {
      expect(screen.getByText("Your Courses (2)")).toBeInTheDocument();
    });
  });
});