import React from "react";
import { render, screen } from "@testing-library/react";
import AdminDashboard from "../AdminDashboard";

jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout-component">MockLogout</div>
));

describe("AdminDashboard", () => {
  test("renders welcome text", () => {
    render(<AdminDashboard />);

    expect(
      screen.getByText(
        /Welcome to the admin dashboard\. Here you can manage the platform,/i
      )
    ).toBeInTheDocument();
  });

  test("renders the main dashboard heading", () => {
    render(<AdminDashboard />);

    expect(
      screen.getByRole("heading", { name: /Admin Dashboard/i })
    ).toBeInTheDocument();
  });

  test("renders all feature list items", () => {
    render(<AdminDashboard />);

    const features = [
      "User & Provider Management",
      "Platform Analytics & Reports",
      "System Configuration & Settings",
      "Content Moderation Tools",
      "Approval Workflows",
    ];

    features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  test("renders the LogoutComponent", () => {
    render(<AdminDashboard />);

    expect(screen.getByTestId("logout-component")).toBeInTheDocument();
  });
});
