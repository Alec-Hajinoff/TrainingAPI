import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("../LogoutComponent", () => {
  return function MockLogoutComponent() {
    return <button data-testid="logout-button">Logout</button>;
  };
});

jest.mock("../CourseSubmissionForm", () => {
  const React = require("react");
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      resetForm: jest.fn(),
    }));

    return (
      <div data-testid="course-submission-form">
        <button
          onClick={props.onCourseAdded}
          data-testid="mock-add-course-button"
        >
          Mock Add Course
        </button>
      </div>
    );
  });
});

jest.mock("../CourseList", () => {
  return function MockCourseList({ refreshTrigger }) {
    return (
      <div data-testid="course-list">
        <span data-testid="refresh-trigger">{refreshTrigger}</span>
        Course List Component
      </div>
    );
  };
});

jest.mock("../ProviderDashboard.css", () => ({}));

import ProviderDashboard from "../ProviderDashboard";

describe("ProviderDashboard Component", () => {
  beforeEach(() => {
    render(<ProviderDashboard />);
  });

  it("renders without crashing", () => {
    expect(
      screen.getByText(/Dashboard to create and maintain/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    expect(screen.getByTestId("course-submission-form")).toBeInTheDocument();
    expect(screen.getByTestId("course-list")).toBeInTheDocument();
  });

  describe("Header Section", () => {
    it("renders dashboard subtitle", () => {
      const subtitle = screen.getByText(
        "Dashboard to create and maintain your corporate training catalogue"
      );
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass("dashboard-subtitle");
    });

    it("renders logout component in correct position", () => {
      const logoutButton = screen.getByTestId("logout-button");
      expect(logoutButton).toBeInTheDocument();

      const flexContainer = document.querySelector(
        ".d-flex.justify-content-end"
      );
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toContainElement(logoutButton);
    });
  });

  describe("Layout Structure", () => {
    it("has a container with correct classes", () => {
      const container = document.querySelector(".container.provider-dashboard");
      expect(container).toBeInTheDocument();
    });

    it("has main content with correct sections", () => {
      expect(document.querySelector(".dashboard-content")).toBeInTheDocument();
      expect(document.querySelector(".form-section")).toBeInTheDocument();
      expect(document.querySelector(".list-section")).toBeInTheDocument();
    });
  });

  describe("Course Submission Form Integration", () => {
    it("passes onCourseAdded callback to form", () => {
      const mockAddButton = screen.getByTestId("mock-add-course-button");
      const initialTrigger = screen.getByTestId("refresh-trigger");

      expect(initialTrigger).toHaveTextContent("0");
      fireEvent.click(mockAddButton);
      expect(initialTrigger).toHaveTextContent("1");
    });
  });

  describe("Course List Integration", () => {
    it("passes refreshTrigger prop to CourseList", () => {
      const refreshTrigger = screen.getByTestId("refresh-trigger");
      expect(refreshTrigger).toHaveTextContent("0");
    });

    it("updates refreshTrigger when course is added", () => {
      const mockAddButton = screen.getByTestId("mock-add-course-button");
      const refreshTrigger = screen.getByTestId("refresh-trigger");

      expect(refreshTrigger).toHaveTextContent("0");
      fireEvent.click(mockAddButton);
      expect(refreshTrigger).toHaveTextContent("1");
      fireEvent.click(mockAddButton);
      expect(refreshTrigger).toHaveTextContent("2");
    });
  });
});
