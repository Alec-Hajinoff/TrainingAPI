import React from "react";
import { render, screen } from "@testing-library/react";
import AdminDashboard from "../AdminDashboard";

jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout-component">MockLogout</div>
));
jest.mock("../WorkshopsRequested", () => () => (
  <div data-testid="workshops-requested">MockWorkshopsRequested</div>
));
jest.mock("../CoursesAdmin", () => () => (
  <div data-testid="courses-admin">MockCoursesAdmin</div>
));

describe("AdminDashboard", () => {
  test("renders welcome text", () => {
    render(<AdminDashboard />);

    expect(
      screen.getByText(
        /Welcome to the admin dashboard\. Here you can manage the platform,/i,
      ),
    ).toBeInTheDocument();
  });

  test("renders the LogoutComponent", () => {
    render(<AdminDashboard />);

    expect(screen.getByTestId("logout-component")).toBeInTheDocument();
  });

  test("renders WorkshopsRequested component", () => {
    render(<AdminDashboard />);

    expect(screen.getByTestId("workshops-requested")).toBeInTheDocument();
  });

  test("renders CoursesAdmin component", () => {
    render(<AdminDashboard />);

    expect(screen.getByTestId("courses-admin")).toBeInTheDocument();
  });
});
