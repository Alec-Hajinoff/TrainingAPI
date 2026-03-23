import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WorkshopsRequested from "../WorkshopsRequested";
import { workshopsRequested } from "../ApiService";

jest.mock("../ApiService", () => ({
  workshopsRequested: jest.fn(),
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
    expect(screen.getByText(/PENDING/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Custom Python for Data Science workshop./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Focus on Pandas and Scikit-learn./i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Cloud Systems/i)).toBeInTheDocument();
    expect(screen.getByText(/APPROVED/i)).toBeInTheDocument();
    expect(
      screen.getByText(/AWS Cloud Practitioner basics./i),
    ).toBeInTheDocument();
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
});
