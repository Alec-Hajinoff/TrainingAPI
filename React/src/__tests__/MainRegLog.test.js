import React from "react";
import { render, screen } from "@testing-library/react";
import MainRegLog from "../MainRegLog";

jest.mock("../Main", () => () => (
  <div data-testid="main-component">Main Component</div>
));
jest.mock("../UserRegistration", () => () => (
  <div data-testid="user-registration">User Registration</div>
));
jest.mock("../UserLogin", () => () => (
  <div data-testid="user-login">User Login</div>
));
jest.mock("../Courses", () => () => (
  <div data-testid="courses-component">Courses Component</div>
));
jest.mock("../WorkshopRequests", () => () => (
  <div data-testid="workshop-requests">Workshop Requests</div>
));

jest.mock("../MainRegLog.css", () => ({}));

describe("MainRegLog Component", () => {
  beforeEach(() => {
    render(<MainRegLog />);
  });

  it("renders without crashing and includes all components", () => {
    expect(screen.getByTestId("main-component")).toBeInTheDocument();
    expect(screen.getByTestId("courses-component")).toBeInTheDocument();
    expect(screen.getByTestId("workshop-requests")).toBeInTheDocument();
    expect(screen.getByTestId("user-registration")).toBeInTheDocument();
    expect(screen.getByTestId("user-login")).toBeInTheDocument();
  });

  describe("Layout Structure", () => {
    it("has two column divs with correct Bootstrap classes", () => {
      const mainColumn = document.querySelector(".col-12.col-md-9");
      expect(mainColumn).toBeInTheDocument();

      const sidebarColumn = document.querySelector(".col-12.col-md-3");
      expect(sidebarColumn).toBeInTheDocument();
    });
  });

  describe("Main Content Column", () => {
    it("renders Main, Courses, and WorkshopRequests in the left column", () => {
      const leftColumn = document.querySelector(".col-12.col-md-9");

      expect(leftColumn).toContainElement(screen.getByTestId("main-component"));
      expect(leftColumn).toContainElement(
        screen.getByTestId("courses-component"),
      );
      expect(leftColumn).toContainElement(
        screen.getByTestId("workshop-requests"),
      );
    });
  });

  describe("Sidebar Column", () => {
    it("renders registration and login sections with correct prompts", () => {
      expect(
        screen.getByText("New user? Please register:"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Existing user? Please login:"),
      ).toBeInTheDocument();

      const sidebar = document.querySelector(".col-12.col-md-3");
      const children = Array.from(sidebar.children);

      expect(children.length).toBe(4);
      expect(children[0]).toHaveTextContent("New user? Please register:");
      expect(children[1]).toHaveAttribute("data-testid", "user-registration");
      expect(children[2]).toHaveTextContent("Existing user? Please login:");
      expect(children[3]).toHaveAttribute("data-testid", "user-login");
    });
  });

  describe("Accessibility and Styling", () => {
    it("has text-center class for alignment", () => {
      const container = document.querySelector(".container.text-center");
      expect(container).toBeInTheDocument();
    });

    it("applies footer class to registration and login prompts", () => {
      const prompts = screen.getAllByText(/Please (register|login):/);
      prompts.forEach((prompt) => {
        expect(prompt).toHaveClass("footer");
      });
    });
  });
});
