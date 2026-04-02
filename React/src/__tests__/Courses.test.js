import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Courses from "../Courses";
import { coursesGet } from "../ApiService";

jest.mock("../ApiService", () => ({
  coursesGet: jest.fn(),
}));

describe("Courses Component", () => {
  const mockCourses = [
    {
      id: 1,
      course_title: "Modern Data Architecture",
      subject_area: "Data Engineering & Data Platforms",
      subject: "Modern Data Architecture",
      delivery_type: "Virtual",
      country_of_delivery: "Global",
      duration: "12.0",
      total_price: "500.00",
      description: "Learn about modern data platforms.",
      learning_outcomes: "Design scalable data architectures.",
      provider_name: "Data Experts",
      contact_email: "info@dataexperts.com",
      contact_phone: "123456789",
      provider_website: "dataexperts.com",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

  test("renders loading state initially", () => {
    coursesGet.mockImplementation(() => new Promise(() => {}));
    render(<Courses />);

    expect(screen.getByText(/Available workshops/i)).toBeInTheDocument();
    expect(screen.getByText("Loading catalog...")).toBeInTheDocument();
  });

  test("renders empty state when API fails", async () => {
    coursesGet.mockRejectedValue(new Error("Network Error"));

    render(<Courses />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (0)")).toBeInTheDocument();
      expect(
        screen.getByText(/No workshops available at the moment/i),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Download CSV/i }),
    ).toBeDisabled();
  });

  test("renders empty state message when no courses are found", async () => {
    coursesGet.mockResolvedValue({
      success: true,
      courses: [],
    });

    render(<Courses />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (0)")).toBeInTheDocument();
      expect(
        screen.getByText(/No workshops available at the moment/i),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Download CSV/i }),
    ).toBeDisabled();
  });

  test("renders course list correctly with data", async () => {
    coursesGet.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    render(<Courses />);

    await waitFor(() => {
      expect(screen.getByText("Available workshops (1)")).toBeInTheDocument();
    });

    expect(screen.getByText("Modern Data Architecture")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Data Engineering & Data Platforms > Modern Data Architecture/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Virtual")).toBeInTheDocument();
    expect(screen.getByText("Global")).toBeInTheDocument();
    expect(screen.getByText("12.0 hours")).toBeInTheDocument();
    expect(screen.getByText("£500.00 (excl. VAT)")).toBeInTheDocument();
    expect(
      screen.getByText("Learn about modern data platforms."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Design scalable data architectures."),
    ).toBeInTheDocument();
    expect(screen.getByText("Data Experts")).toBeInTheDocument();
    expect(screen.getByText("info@dataexperts.com")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();

    const websiteLink = screen.getByText("dataexperts.com");
    expect(websiteLink.closest("a")).toHaveAttribute(
      "href",
      "https://dataexperts.com",
    );
  });

  test("executes CSV download flow", async () => {
    coursesGet.mockResolvedValue({
      success: true,
      courses: mockCourses,
    });

    render(<Courses />);

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
