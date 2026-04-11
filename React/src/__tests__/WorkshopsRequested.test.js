import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import WorkshopsRequested from "../WorkshopsRequested";
import { workshopsRequested, deleteWorkshopRequested } from "../ApiService";

jest.mock("../ApiService", () => ({
  workshopsRequested: jest.fn(),
  deleteWorkshopRequested: jest.fn(),
}));

describe("WorkshopsRequested Component", () => {
  const mockRequests = [
    {
      id: 1,
      organisation: "Innovate Ltd",
      name: "Alice Smith",
      email: "alice@innovate.com",
      status: "pending",
      requirement_description: "Custom Python for Data Science workshop.",
      additional_details: "Focus on Pandas and Scikit-learn.",
      technology_area: "Python / Data Science",
      team_size: "6–10",
      preferred_timing: "Within 1 month",
      created_at: "2023-10-27T10:00:00Z",
    },
    {
      id: 2,
      organisation: "Cloud Systems",
      name: "Bob Jones",
      email: "bob@cloudsys.io",
      status: "approved",
      requirement_description: "AWS Cloud Practitioner basics.",
      additional_details: "",
      technology_area: "Cloud / AWS / Azure",
      team_size: "20+",
      preferred_timing: "Flexible",
      created_at: "2023-10-28T14:30:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); // Enable fake timers for timeout tests
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders loading state initially", () => {
    workshopsRequested.mockImplementation(() => new Promise(() => {}));
    render(<WorkshopsRequested />);

    expect(screen.getByText(/Loading requests.../i)).toBeInTheDocument();
  });

  test("renders error message when API fails", async () => {
    workshopsRequested.mockRejectedValue(new Error("API Error"));
    render(<WorkshopsRequested />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Failed to load workshop requests. Please try again./i,
        ),
      ).toBeInTheDocument();
    });
  });

  test("renders empty state when no requests are returned", async () => {
    workshopsRequested.mockResolvedValue({ success: true, requests: [] });
    render(<WorkshopsRequested />);

    await waitFor(() => {
      expect(screen.getByText(/Workshop Requests \(0\)/i)).toBeInTheDocument();
      expect(
        screen.getByText(/No workshop requests found./i),
      ).toBeInTheDocument();
    });
  });

  test("renders list of workshop requests correctly", async () => {
    workshopsRequested.mockResolvedValue({
      success: true,
      requests: mockRequests,
    });
    render(<WorkshopsRequested />);

    await waitFor(() => {
      expect(screen.getByText(/Workshop Requests \(2\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Innovate Ltd/i)).toBeInTheDocument();
    expect(screen.getByText(/Alice Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Custom Python for Data Science workshop./i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Cloud Systems/i)).toBeInTheDocument();
    expect(screen.getByText(/approved/i)).toBeInTheDocument();
  });

  test("calls loadRequests again when Refresh button is clicked", async () => {
    workshopsRequested.mockResolvedValue({
      success: true,
      requests: [mockRequests[0]],
    });
    render(<WorkshopsRequested />);

    await waitFor(() => {
      expect(screen.getByText(/Workshop Requests \(1\)/i)).toBeInTheDocument();
    });

    workshopsRequested.mockResolvedValueOnce({
      success: true,
      requests: mockRequests,
    });

    const refreshButton = screen.getByRole("button", { name: /Refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(workshopsRequested).toHaveBeenCalledTimes(2);
      expect(screen.getByText(/Workshop Requests \(2\)/i)).toBeInTheDocument();
    });
  });

  test("handles deletion flow: confirmation then deletion", async () => {
    workshopsRequested.mockResolvedValue({
      success: true,
      requests: mockRequests,
    });
    deleteWorkshopRequested.mockResolvedValue({ success: true });

    render(<WorkshopsRequested />);

    await waitFor(() => {
      expect(screen.getByText(/Workshop Requests \(2\)/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });

    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText(/Sure\?/i)).toBeInTheDocument();
    expect(deleteWorkshopRequested).not.toHaveBeenCalled();

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteWorkshopRequested).toHaveBeenCalledWith(mockRequests[0].id);
      expect(
        screen.getByText(/Workshop request deleted successfully!/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Workshop Requests \(1\)/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Sure\?/i)).not.toBeInTheDocument();
  });

  test("shows error message when deletion fails", async () => {
    workshopsRequested.mockResolvedValue({
      success: true,
      requests: [mockRequests[0]],
    });
    deleteWorkshopRequested.mockResolvedValue({
      success: false,
      message: "API Deletion Failure",
    });

    render(<WorkshopsRequested />);

    await waitFor(() => {
      expect(screen.getByText(/Workshop Requests \(1\)/i)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: /Delete/i });

    fireEvent.click(deleteButton); // Show "Sure?"
    fireEvent.click(deleteButton); // Confirm

    await waitFor(() => {
      expect(screen.getByText(/API Deletion Failure/i)).toBeInTheDocument();
    });
  });

  test("resets delete confirmation after 5 seconds", async () => {
    workshopsRequested.mockResolvedValue({
      success: true,
      requests: [mockRequests[0]],
    });
    render(<WorkshopsRequested />);

    await waitFor(() => {
      expect(screen.getByText(/Workshop Requests \(1\)/i)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);
    expect(screen.getByText(/Sure\?/i)).toBeInTheDocument();

    // Advance timers by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText(/Sure\?/i)).not.toBeInTheDocument();
  });
});
