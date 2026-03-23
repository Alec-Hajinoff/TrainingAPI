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
    expect(
      screen.getByText(/TrainingApi delivers virtual/i),
    ).toBeInTheDocument();
  });

  describe("Value Proposition Section", () => {
    it("renders the main description", () => {
      const description = screen.getByText(
        /TrainingApi delivers virtual instructor-led technology workshops/i,
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("main-description");
    });
  });

  describe("Why TrainingAPI Section", () => {
    it("renders the section title", () => {
      const title = screen.getByRole("heading", { name: /Why TrainingAPI\?/i });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("section-title");
    });

    it("renders all three benefit cards with correct content", () => {
      expect(screen.getByText("Curated Workshops")).toBeInTheDocument();
      expect(screen.getByText("Applied Learning")).toBeInTheDocument();
      expect(screen.getByText("Skill-Gap Requests")).toBeInTheDocument();

      const icons = document.querySelectorAll(".benefit-icon i");
      expect(icons).toHaveLength(3);
      expect(icons[0]).toHaveClass("bi-display");
      expect(icons[1]).toHaveClass("bi-tools");
      expect(icons[2]).toHaveClass("bi-lightbulb-fill");
    });

    it("renders benefit descriptions", () => {
      expect(
        screen.getByText(
          /Access a structured catalogue of practical sessions/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Our programmes focus on impact/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /submit a request and we will coordinate a custom workshop/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("How it works Section", () => {
    it("renders the section title", () => {
      const title = screen.getByRole("heading", { name: /How it works/i });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("section-title");
    });

    it("renders all three step cards with correct numbers and titles", () => {
      const stepNumbers = document.querySelectorAll(".step-number");
      expect(stepNumbers).toHaveLength(3);
      expect(stepNumbers[0]).toHaveTextContent("1");
      expect(stepNumbers[1]).toHaveTextContent("2");
      expect(stepNumbers[2]).toHaveTextContent("3");

      expect(screen.getByText("Explore Catalogue")).toBeInTheDocument();
      expect(screen.getByText("Select or Request")).toBeInTheDocument();
      expect(screen.getByText("Upskill Teams")).toBeInTheDocument();
    });

    it("renders step descriptions", () => {
      expect(
        screen.getByText(/Browse upcoming virtual sessions/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Enquire about existing workshops/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Integrate sessions into your planning/i),
      ).toBeInTheDocument();
    });
  });

  describe("Layout and Accessibility", () => {
    it("has proper heading hierarchy", () => {
      const h3Headings = screen.getAllByRole("heading", { level: 3 });
      expect(h3Headings).toHaveLength(8);
    });

    it("uses semantic card classes", () => {
      expect(document.querySelectorAll(".benefit-card")).toHaveLength(3);
      expect(document.querySelectorAll(".step-card")).toHaveLength(3);
    });
  });
});
