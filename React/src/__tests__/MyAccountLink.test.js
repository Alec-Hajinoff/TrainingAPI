import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import MyAccountLink from "../MyAccountLink";
import { myAccountLink } from "../ApiService";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../ApiService", () => ({
  myAccountLink: jest.fn(),
}));

jest.mock("../MyAccountLink.css", () => ({}));

describe("MyAccountLink Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <MyAccountLink />
      </MemoryRouter>,
    );
  };

  test("renders loading state initially", () => {
    myAccountLink.mockImplementation(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/Checking your session.../i)).toBeInTheDocument();
  });

  test("renders error state and handles retry", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    myAccountLink.mockRejectedValueOnce(new Error("API Error"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/Unable to verify session status/i),
      ).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: /Retry/i });
    myAccountLink.mockResolvedValueOnce({
      logged_in: true,
      user_type: "admin",
    });

    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText(/My Account →/i)).toBeInTheDocument();
    });

    expect(myAccountLink).toHaveBeenCalledTimes(2);
    consoleSpy.mockRestore();
  });

  test("returns null and renders nothing if user is not logged in", async () => {
    myAccountLink.mockResolvedValue({ logged_in: false });
    const { container } = renderComponent();

    await waitFor(() => {
      expect(screen.queryByText(/Checking/i)).not.toBeInTheDocument();
    });

    expect(container.firstChild).toBeNull();
  });

  test("navigates to ProviderDashboard when user_type is provider", async () => {
    myAccountLink.mockResolvedValue({ logged_in: true, user_type: "provider" });
    renderComponent();

    const button = await screen.findByRole("button", { name: /My Account →/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/ProviderDashboard");
  });

  test("navigates to DeveloperDashboard when user_type is developer", async () => {
    myAccountLink.mockResolvedValue({
      logged_in: true,
      user_type: "developer",
    });
    renderComponent();

    const button = await screen.findByRole("button", { name: /My Account →/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/DeveloperDashboard");
  });

  test("navigates to AdminDashboard when user_type is admin", async () => {
    myAccountLink.mockResolvedValue({ logged_in: true, user_type: "admin" });
    renderComponent();

    const button = await screen.findByRole("button", { name: /My Account →/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/AdminDashboard");
  });

  test("navigates to home for unknown user types", async () => {
    myAccountLink.mockResolvedValue({ logged_in: true, user_type: "unknown" });
    renderComponent();

    const button = await screen.findByRole("button", { name: /My Account →/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
