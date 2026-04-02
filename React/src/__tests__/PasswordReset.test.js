import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PasswordReset from "../PasswordReset";
import { passwordResetToken, updatePassword } from "../ApiService";
import { useNavigate, useLocation } from "react-router-dom";

jest.mock("../ApiService", () => ({
  passwordResetToken: jest.fn(),
  updatePassword: jest.fn(),
}));

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useLocation: () => ({
    search: "?token=test-token",
  }),
}));

describe("PasswordReset Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows verifying state while token is checked", () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    render(<PasswordReset />);
    expect(screen.getByText(/Verifying your link*/i)).toBeInTheDocument();
  });

  test("shows invalid token message when token invalid", async () => {
    passwordResetToken.mockResolvedValueOnce({
      valid: false,
      message: "Expired token",
    });
    render(<PasswordReset />);

    await waitFor(() => {
      expect(screen.getByText(/Expired token/i)).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Return to home page/i }),
    ).toBeInTheDocument();
  });

  test("shows reset form when token valid", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    render(<PasswordReset />);

    await waitFor(() => {
      expect(screen.getByText(/Reset your password/i)).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
  });

  test("shows password length validation error client-side", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    render(<PasswordReset />);

    await waitFor(() => {
      expect(screen.getByText(/Reset your password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    expect(
      await screen.findByText(/Password must be at least 8 characters long/i),
    ).toBeInTheDocument();
  });

  test("shows mismatch validation error", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    render(<PasswordReset />);

    await waitFor(() => {
      expect(screen.getByText(/Reset your password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "abcdefgh" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "abcdefg1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    expect(
      await screen.findByText(/Passwords do not match/i),
    ).toBeInTheDocument();
  });

  test("submits updatePassword and shows success message", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    updatePassword.mockResolvedValueOnce({ success: true });

    render(<PasswordReset />);

    await waitFor(() => {
      expect(screen.getByText(/Reset your password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "newpassword1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "newpassword1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Your password has been updated successfully/i),
      ).toBeInTheDocument();
    });

    expect(updatePassword).toHaveBeenCalledWith("test-token", "newpassword1");
    fireEvent.click(
      screen.getByRole("button", { name: /Return to home page/i }),
    );
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });

  test("shows API error message on update failure", async () => {
    passwordResetToken.mockResolvedValueOnce({ valid: true });
    updatePassword.mockResolvedValueOnce({
      success: false,
      message: "Failed to update password. Please try again.",
    });

    render(<PasswordReset />);

    await waitFor(() => {
      expect(screen.getByText(/Reset your password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "validPass10" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "validPass10" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update password/i }));

    expect(
      await screen.findByText(/Failed to update password. Please try again./i),
    ).toBeInTheDocument();
  });
});
