import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import MainRegLog from "../MainRegLog";
import { myAccountLink } from "../ApiService";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../ApiService", () => ({
  myAccountLink: jest.fn(),
}));

jest.mock("../Main", () => () => <div data-testid="main-component">Main</div>);
jest.mock("../Courses", () => () => (
  <div data-testid="courses-component">Courses</div>
));
jest.mock("../WorkshopRequests", () => () => (
  <div data-testid="workshop-requests">Workshop Requests</div>
));
jest.mock("../UserRegistration", () => () => (
  <div data-testid="user-registration">User Registration</div>
));
jest.mock("../UserLogin", () => () => (
  <div data-testid="user-login">User Login</div>
));
jest.mock("../MyAccountLink", () => () => (
  <div data-testid="my-account-link">My Account Link</div>
));
jest.mock("../ForProvidersButton", () => () => (
  <button data-testid="for-providers-button">For Providers</button>
));

jest.mock("../MainRegLog.css", () => ({}));

describe("MainRegLog Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockReturnValue({ key: "initial" });
  });

  test("renders loading state initially while checking session", () => {
    myAccountLink.mockImplementation(() => new Promise(() => {}));
    render(
      <MemoryRouter>
        <MainRegLog />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(screen.queryByTestId("main-component")).not.toBeInTheDocument();
  });

  test("renders guest view (registration/login) when user is not logged in", async () => {
    myAccountLink.mockResolvedValue({ logged_in: false });

    render(
      <MemoryRouter>
        <MainRegLog />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("main-component")).toBeInTheDocument();
    expect(screen.getByTestId("courses-component")).toBeInTheDocument();
    expect(screen.getByTestId("workshop-requests")).toBeInTheDocument();

    expect(
      screen.getByText(/New user\? Please register:/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("user-registration")).toBeInTheDocument();
    expect(
      screen.getByText(/Existing user\? Please login:/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("user-login")).toBeInTheDocument();
    expect(screen.getByTestId("for-providers-button")).toBeInTheDocument();

    expect(screen.queryByTestId("my-account-link")).not.toBeInTheDocument();
  });

  test("renders logged-in view (MyAccountLink) when user is authenticated", async () => {
    myAccountLink.mockResolvedValue({ logged_in: true });

    render(
      <MemoryRouter>
        <MainRegLog />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("my-account-link")).toBeInTheDocument();

    expect(screen.queryByTestId("user-registration")).not.toBeInTheDocument();
    expect(screen.queryByTestId("user-login")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("for-providers-button"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Please register:/i)).not.toBeInTheDocument();
  });

  test("handles session check failure by defaulting to guest view", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    myAccountLink.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <MainRegLog />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("user-registration")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test("verifies the Bootstrap grid layout classes", async () => {
    myAccountLink.mockResolvedValue({ logged_in: false });

    const { container } = render(
      <MemoryRouter>
        <MainRegLog />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    expect(container.querySelector(".col-12.col-md-9")).toBeInTheDocument();
    expect(container.querySelector(".col-12.col-md-3")).toBeInTheDocument();
    expect(
      container.querySelector(".container.text-center"),
    ).toBeInTheDocument();
  });

  test("applies the footer class to registration and login prompts", async () => {
    myAccountLink.mockResolvedValue({ logged_in: false });

    render(
      <MemoryRouter>
        <MainRegLog />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    const prompts = screen.getAllByText(/Please (register|login):/);
    prompts.forEach((prompt) => {
      expect(prompt).toHaveClass("footer");
    });
  });
});
