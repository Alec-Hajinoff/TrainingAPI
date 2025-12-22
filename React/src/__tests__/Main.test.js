import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "../Main";

jest.mock("bootstrap-icons/font/bootstrap-icons.css", () => ({}));
jest.mock("../Main.css", () => ({}));

describe("Main Component", () => {
  beforeEach(() => {
    render(<Main />);
  });

  it("renders without crashing", () => {
    expect(screen.getByText(/TrainingApi standardises/i)).toBeInTheDocument();
  });

  describe("Value Proposition Section", () => {
    it("renders the main description", () => {
      const description = screen.getByText(
        /TrainingApi standardises course data from multiple training providers/i
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("main-description");
    });

    it("renders the target audience description", () => {
      const audienceText = screen.getByText(
        /The platform is designed for Learning and Development teams/i
      );
      expect(audienceText).toBeInTheDocument();
      expect(audienceText).toHaveClass("target-audience");
    });
  });

  describe("Key Benefits Section", () => {
    it("renders the section title", () => {
      const title = screen.getByRole("heading", { name: /Key Benefits/i });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("section-title");
    });

    it("renders all three benefit cards", () => {
      expect(
        screen.getByText("Use your existing providers")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Expand your course options")
      ).toBeInTheDocument();
      expect(screen.getByText("Keep data consistent")).toBeInTheDocument();

      const icons = document.querySelectorAll(".benefit-icon i");
      expect(icons).toHaveLength(3);

      expect(icons[0]).toHaveClass("bi-people-fill");
      expect(icons[1]).toHaveClass("bi-collection-fill");
      expect(icons[2]).toHaveClass("bi-clipboard-data-fill");
    });

    it("renders benefit descriptions", () => {
      const descriptions = screen.getAllByText(
        /Ask your current training suppliers|Access additional, ready-to-integrate courses|All courses follow a common structure/i
      );
      expect(descriptions).toHaveLength(3);

      descriptions.forEach((desc) => {
        expect(desc).toHaveClass("benefit-description");
      });
    });
  });

  describe("Get Started Steps Section", () => {
    it("renders the section title", () => {
      const title = screen.getByRole("heading", {
        name: /Get started in three steps/i,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("section-title");
    });

    it("renders all three step cards with correct numbers", () => {
      const stepNumbers = document.querySelectorAll(".step-number");
      expect(stepNumbers).toHaveLength(3);
      expect(stepNumbers[0]).toHaveTextContent("1");
      expect(stepNumbers[1]).toHaveTextContent("2");
      expect(stepNumbers[2]).toHaveTextContent("3");

      expect(screen.getByText("Connect your LMS")).toBeInTheDocument();
      expect(screen.getByText("Invite providers")).toBeInTheDocument();
      expect(screen.getByText("Publish to learners")).toBeInTheDocument();

      const stepDescriptions = screen.getAllByText(
        /Use a single, standard integration|Existing suppliers publish and maintain|External courses appear in your LMS/i
      );
      expect(stepDescriptions).toHaveLength(3);

      stepDescriptions.forEach((desc) => {
        expect(desc).toHaveClass("step-description");
      });
    });
  });

  describe("Layout and Structure", () => {
    it("has a container with correct class", () => {
      const container = document.querySelector(".container");
      expect(container).toBeInTheDocument();
    });

    it("has proper Bootstrap grid classes", () => {
      const rows = document.querySelectorAll(".row");
      expect(rows.length).toBeGreaterThan(0);

      const col12 = document.querySelectorAll(".col-12");
      expect(col12.length).toBeGreaterThan(0);

      const colMd4 = document.querySelectorAll(".col-md-4");
      expect(colMd4.length).toBeGreaterThan(0);
    });

    it("has correct spacing classes", () => {
      const mbElements = document.querySelectorAll("[class*='mb-']");
      expect(mbElements.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      const h2Headings = screen.getAllByRole("heading", { level: 2 });
      expect(h2Headings).toHaveLength(2);
      expect(h2Headings[0]).toHaveTextContent("Key Benefits");
      expect(h2Headings[1]).toHaveTextContent("Get started in three steps");

      const h3Headings = screen.getAllByRole("heading", { level: 3 });
      expect(h3Headings).toHaveLength(6);
    });

    it("has semantic HTML structure", () => {
      const benefitCards = document.querySelectorAll(".benefit-card");
      expect(benefitCards).toHaveLength(3);

      const stepCards = document.querySelectorAll(".step-card");
      expect(stepCards).toHaveLength(3);
    });
  });

  describe("Content Verification", () => {
    it("contains all expected text content", () => {
      expect(
        screen.getByText(
          /TrainingApi standardises course data from multiple training providers/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /The platform is designed for Learning and Development teams/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /Ask your current training suppliers to publish their courses once to TrainingApi/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /Access additional, ready-to-integrate courses from other providers on the platform/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /All courses follow a common structure, making it easier to manage catalogues/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /Use a single, standard integration to access all courses/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /Existing suppliers publish and maintain their courses directly on the platform/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /External courses appear in your LMS like any internal programme/i
        )
      ).toBeInTheDocument();
    });
  });
});
