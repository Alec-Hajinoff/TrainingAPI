import React from "react";
import { render, screen } from "@testing-library/react";
import DeveloperDashboard from "../DeveloperDashboard";

jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout-component">MockLogout</div>
));

describe("DeveloperDashboard Component", () => {
  test("renders dashboard with all new sections", () => {
    render(<DeveloperDashboard />);

    expect(
      screen.getByText("Getting Started with TrainingApi"),
    ).toBeInTheDocument();

    expect(screen.getByText("1. API Access Information")).toBeInTheDocument();
    expect(
      screen.getByText("2. Making Requests to the API"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("3. What to Expect in the Response"),
    ).toBeInTheDocument();
    expect(screen.getByText("4. Error Responses")).toBeInTheDocument();
    expect(screen.getByText("5. Need Help?")).toBeInTheDocument();

    expect(screen.getByTestId("logout-component")).toBeInTheDocument();
  });

  test("renders welcome message and service description", () => {
    render(<DeveloperDashboard />);

    const trainingApiElement = screen.getByText("TrainingApi");
    expect(trainingApiElement).toBeInTheDocument();
    expect(trainingApiElement.tagName).toBe("STRONG");

    expect(
      screen.getByText(
        /a standardised API for discovering and retrieving instructor-led technology workshops/i,
      ),
    ).toBeInTheDocument();
  });

  test("displays public API access information", () => {
    render(<DeveloperDashboard />);

    expect(
      screen.getByText(/No API key is required to retrieve workshop data/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Public API Access:/i)).toBeInTheDocument();
  });

  test("shows updated API usage examples without authentication", () => {
    render(<DeveloperDashboard />);

    expect(
      screen.getByText("https://trainingapi.com/TrainingAPI/courses.php"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("curl https://trainingapi.com/TrainingAPI/courses.php"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /fetch\('https:\/\/trainingapi.com\/TrainingAPI\/courses\.php'\)/,
      ),
    ).toBeInTheDocument();
  });

  test("shows response format and error examples", () => {
    render(<DeveloperDashboard />);

    expect(screen.getByText(/"success": true,/)).toBeInTheDocument();
    expect(screen.getByText(/"courses": \[/)).toBeInTheDocument();

    expect(
      screen.getByText(
        /"message": "No workshops available at the moment. You can request a custom programme."/,
      ),
    ).toBeInTheDocument();
  });

  test("provides correct contact information", () => {
    render(<DeveloperDashboard />);

    const emailLink = screen.getByRole("link", {
      name: "team@trainingapi.com",
    });
    expect(emailLink).toHaveAttribute("href", "mailto:team@trainingapi.com");
  });
});
