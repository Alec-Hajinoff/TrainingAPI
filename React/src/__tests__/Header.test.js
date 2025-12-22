import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "../Header";

jest.mock("../transparent-logo.png", () => "test-logo-path.png");

describe("Header Component", () => {
  const renderHeader = () => {
    return render(
      <Router>
        <Header />
      </Router>
    );
  };

  it("renders without crashing", () => {
    renderHeader();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("displays the company logo image with correct attributes", () => {
    renderHeader();

    const logoImage = screen.getByRole("img", { name: /company logo/i });

    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "test-logo-path.png");
    expect(logoImage).toHaveAttribute("alt", "A company logo");
    expect(logoImage).toHaveAttribute("title", "A company logo");
  });

  it("has a link to the home page ('/')", () => {
    renderHeader();

    const homeLink = screen.getByRole("link");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("logo is wrapped in a link to home page", () => {
    renderHeader();

    const homeLink = screen.getByRole("link");
    const logoImage = screen.getByRole("img");

    expect(homeLink).toContainElement(logoImage);
  });

  it("has proper CSS classes applied", () => {
    const { container } = renderHeader();

    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass("container");

    expect(containerDiv.querySelector(".col-auto")).toBeInTheDocument();
    expect(containerDiv.querySelector(".row-auto")).toBeInTheDocument();
  });

  it("logo has correct id attribute", () => {
    renderHeader();

    const logoImage = screen.getByRole("img");
    expect(logoImage).toHaveAttribute("id", "logo");
  });

  it("contains a line break element", () => {
    const { container } = renderHeader();

    const brElement = container.querySelector("br");
    expect(brElement).toBeInTheDocument();
  });
});
