import React from "react";
import { render, screen } from "@testing-library/react";
import MainRegLog from "../MainRegLog";
import Main from "../Main";
import UserRegistration from "../UserRegistration";
import UserLogin from "../UserLogin";

jest.mock("../Main", () => {
  return function MockMain() {
    return <div data-testid="main-component">Main Component</div>;
  };
});

jest.mock("../UserRegistration", () => {
  return function MockUserRegistration() {
    return <div data-testid="user-registration">User Registration</div>;
  };
});

jest.mock("../UserLogin", () => {
  return function MockUserLogin() {
    return <div data-testid="user-login">User Login</div>;
  };
});

jest.mock("../MainRegLog.css", () => ({}));

describe("MainRegLog Component", () => {
  beforeEach(() => {
    render(<MainRegLog />);
  });

  it("renders without crashing", () => {
    expect(screen.getByTestId("main-component")).toBeInTheDocument();
    expect(screen.getByTestId("user-registration")).toBeInTheDocument();
    expect(screen.getByTestId("user-login")).toBeInTheDocument();
  });

  describe("Layout Structure", () => {
    it("has a container with correct classes", () => {
      const container = document.querySelector(".container.text-center");
      expect(container).toBeInTheDocument();
    });

    it("has a row div", () => {
      const row = document.querySelector(".row");
      expect(row).toBeInTheDocument();
    });

    it("has two column divs with correct Bootstrap classes", () => {
      const mainColumn = document.querySelector(".col-12.col-md-9");
      expect(mainColumn).toBeInTheDocument();

      const sidebarColumn = document.querySelector(".col-12.col-md-3");
      expect(sidebarColumn).toBeInTheDocument();
    });
  });

  describe("Main Content Column", () => {
    it("renders the Main component", () => {
      const mainComponent = screen.getByTestId("main-component");
      expect(mainComponent).toBeInTheDocument();

      const leftColumn = document.querySelector(".col-12.col-md-9");
      expect(leftColumn).toContainElement(mainComponent);
    });
  });

  describe("Sidebar Column", () => {
    it("renders registration and login sections", () => {
      const sidebarColumn = document.querySelector(".col-12.col-md-3");
      expect(sidebarColumn).toBeInTheDocument();
    });

    it("renders registration section with prompt", () => {
      const registrationPrompt = screen.getByText("New user? Please register:");
      expect(registrationPrompt).toBeInTheDocument();
      expect(registrationPrompt).toHaveClass("footer");

      const userRegistration = screen.getByTestId("user-registration");
      expect(userRegistration).toBeInTheDocument();

      const sidebar = document.querySelector(".col-12.col-md-3");
      expect(sidebar.children[0]).toHaveTextContent(
        "New user? Please register:"
      );
      expect(sidebar.children[1]).toBe(userRegistration);
    });

    it("renders login section with prompt", () => {
      const loginPrompt = screen.getByText("Existing user? Please login:");
      expect(loginPrompt).toBeInTheDocument();
      expect(loginPrompt).toHaveClass("footer");

      const userLogin = screen.getByTestId("user-login");
      expect(userLogin).toBeInTheDocument();
    });

    it("has correct component order in sidebar", () => {
      const sidebar = document.querySelector(".col-12.col-md-3");
      const children = Array.from(sidebar.children);

      expect(children.length).toBe(4);

      expect(children[0]).toHaveTextContent("New user? Please register:");
      expect(children[1]).toHaveAttribute("data-testid", "user-registration");
      expect(children[2]).toHaveTextContent("Existing user? Please login:");
      expect(children[3]).toHaveAttribute("data-testid", "user-login");
    });
  });

  describe("Responsive Design", () => {
    it("uses responsive column classes", () => {
      const leftColumn = document.querySelector(".col-12.col-md-9");
      const rightColumn = document.querySelector(".col-12.col-md-3");

      expect(leftColumn).toBeInTheDocument();
      expect(rightColumn).toBeInTheDocument();

      expect(leftColumn.classList.contains("col-12")).toBe(true);
      expect(rightColumn.classList.contains("col-12")).toBe(true);

      expect(leftColumn.classList.contains("col-md-9")).toBe(true);
      expect(rightColumn.classList.contains("col-md-3")).toBe(true);
    });
  });

  describe("Content Verification", () => {
    it("contains all required text content", () => {
      expect(
        screen.getByText("New user? Please register:")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Existing user? Please login:")
      ).toBeInTheDocument();
    });

    it("renders all child components", () => {
      expect(screen.getByTestId("main-component")).toBeInTheDocument();
      expect(screen.getByTestId("user-registration")).toBeInTheDocument();
      expect(screen.getByTestId("user-login")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      const container = document.querySelector(".container");
      expect(container).toBeInTheDocument();

      const rows = document.querySelectorAll(".row");
      expect(rows.length).toBe(1);

      const columns = document.querySelectorAll("[class*='col-']");
      expect(columns.length).toBe(2);
    });

    it("has text-center class for alignment", () => {
      const container = document.querySelector(".container.text-center");
      expect(container).toBeInTheDocument();
    });
  });
});
