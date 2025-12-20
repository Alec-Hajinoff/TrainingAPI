import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeveloperDashboard from "../DeveloperDashboard";
import { generateApiKey } from "../ApiService";

jest.mock("../ApiService", () => ({
  generateApiKey: jest.fn(),
}));

jest.mock("../LogoutComponent", () => () => (
  <div data-testid="logout-component">MockLogout</div>
));

describe("DeveloperDashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dashboard with all sections", () => {
    render(<DeveloperDashboard />);

    expect(
      screen.getByText("Getting Started with TrainingApi")
    ).toBeInTheDocument();

    expect(screen.getByText("1. Generate Your API Key")).toBeInTheDocument();
    expect(
      screen.getByText("2. Include Your API Key in Requests")
    ).toBeInTheDocument();
    expect(screen.getByText("3. Your First Request")).toBeInTheDocument();
    expect(
      screen.getByText("4. What to Expect in the Response")
    ).toBeInTheDocument();
    expect(screen.getByText("5. Error Responses")).toBeInTheDocument();
    expect(screen.getByText("6. Need Help?")).toBeInTheDocument();

    expect(screen.getByTestId("logout-component")).toBeInTheDocument();
  });

  test("renders welcome message and description", () => {
    render(<DeveloperDashboard />);

    const trainingApiElement = screen.getByText("TrainingApi");
    expect(trainingApiElement).toBeInTheDocument();
    expect(trainingApiElement.tagName).toBe("STRONG");

    const welcomeParagraph = trainingApiElement.closest("p");
    expect(welcomeParagraph).toBeInTheDocument();

    const paragraphText = welcomeParagraph.textContent;
    expect(paragraphText).toContain("Welcome to");
    expect(paragraphText).toContain("TrainingApi");
    expect(paragraphText).toContain(
      "a standardised API for discovering and retrieving professional training courses"
    );

    expect(
      screen.getByText(
        /a standardised API for discovering and retrieving professional training courses/
      )
    ).toBeInTheDocument();
  });

  test("shows generate API key button initially", () => {
    render(<DeveloperDashboard />);

    const generateButton = screen.getByRole("button", {
      name: "Generate New API Key",
    });
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).not.toBeDisabled();
  });

  test("shows confirmation when generate button is clicked", () => {
    render(<DeveloperDashboard />);

    const generateButton = screen.getByRole("button", {
      name: "Generate New API Key",
    });
    fireEvent.click(generateButton);

    expect(
      screen.getByText(/Generating a new API key invalidates your previous key/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Yes, Generate New Key" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Generate New API Key" })
    ).not.toBeInTheDocument();
  });

  test("cancels generation when cancel button is clicked", async () => {
    render(<DeveloperDashboard />);

    const generateButton = screen.getByRole("button", {
      name: "Generate New API Key",
    });
    fireEvent.click(generateButton);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Generate New API Key" })
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        /Generating a new API key invalidates your previous key/
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
  });

  test("handles successful API key generation", async () => {
    const mockApiKey = "test-api-key-12345";
    generateApiKey.mockResolvedValue({
      success: true,
      apiKey: mockApiKey,
    });

    render(<DeveloperDashboard />);

    const generateButton = screen.getByRole("button", {
      name: "Generate New API Key",
    });
    fireEvent.click(generateButton);

    const confirmButton = screen.getByRole("button", {
      name: "Yes, Generate New Key",
    });
    fireEvent.click(confirmButton);

    expect(screen.getByText("Generating...")).toBeInTheDocument();

    await waitFor(() => {
      expect(generateApiKey).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Your new API Key:")).toBeInTheDocument();
    });

    expect(screen.getByText(mockApiKey)).toBeInTheDocument();
    expect(screen.getByText(/Store this key securely/)).toBeInTheDocument();

    expect(
      screen.queryByText(
        /Generating a new API key invalidates your previous key/
      )
    ).not.toBeInTheDocument();
  });

  test("shows error when API key generation fails", async () => {
    generateApiKey.mockResolvedValue({
      success: false,
      message: "Failed to generate API key: Server error",
    });

    render(<DeveloperDashboard />);

    const generateButton = screen.getByRole("button", {
      name: "Generate New API Key",
    });
    fireEvent.click(generateButton);

    const confirmButton = screen.getByRole("button", {
      name: "Yes, Generate New Key",
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to generate API key: Server error")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Your new API Key:")).not.toBeInTheDocument();
  });

  test("handles API exception during key generation", async () => {
    generateApiKey.mockRejectedValue(new Error("Network error"));

    render(<DeveloperDashboard />);

    const generateButton = screen.getByRole("button", {
      name: "Generate New API Key",
    });
    fireEvent.click(generateButton);

    const confirmButton = screen.getByRole("button", {
      name: "Yes, Generate New Key",
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText("An error occurred while generating the API key")
      ).toBeInTheDocument();
    });
  });

  test("disables buttons during loading", async () => {
    generateApiKey.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true, apiKey: "test-key" }), 100);
        })
    );

    render(<DeveloperDashboard />);

    const generateButton = screen.getByRole("button", {
      name: "Generate New API Key",
    });
    fireEvent.click(generateButton);

    const confirmButton = screen.getByRole("button", {
      name: "Yes, Generate New Key",
    });
    fireEvent.click(confirmButton);

    expect(confirmButton).toBeDisabled();

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeDisabled();
  });

  test("shows API usage examples", () => {
    render(<DeveloperDashboard />);

    expect(
      screen.getByText("Authorization: Bearer YOUR_API_KEY")
    ).toBeInTheDocument();

    expect(
      screen.getByText("https://trainingapi.com/TrainingAPI/courses.php")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/curl -H "Authorization: Bearer YOUR_API_KEY"/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /fetch\('https:\/\/trainingapi.com\/TrainingAPI\/courses\.php'/
      )
    ).toBeInTheDocument();
  });

  test("shows response format examples", () => {
    render(<DeveloperDashboard />);

    expect(screen.getByText(/"success": true,/)).toBeInTheDocument();
    expect(screen.getByText(/"courses": \[/)).toBeInTheDocument();
    expect(
      screen.getByText(/"course_title": "Introduction to Asset Management"/)
    ).toBeInTheDocument();
  });

  test("shows error response examples", () => {
    render(<DeveloperDashboard />);

    expect(screen.getByText("5. Error Responses")).toBeInTheDocument();

    expect(
      screen.getByText("Missing or malformed API key:")
    ).toBeInTheDocument();
    expect(screen.getByText("Invalid API key:")).toBeInTheDocument();
    expect(screen.getByText("No courses found:")).toBeInTheDocument();

    const successFalseElements = screen.getAllByText(/"success": false,/);
    expect(successFalseElements.length).toBeGreaterThanOrEqual(3);

    expect(
      screen.getByText(/"message": "Authorization header missing or malformed"/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/"message": "Invalid API key"/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/"message": "No courses found"/)
    ).toBeInTheDocument();
  });

  test("shows contact information", () => {
    render(<DeveloperDashboard />);

    expect(screen.getByText("team@trainingapi.com")).toBeInTheDocument();
    const emailLink = screen.getByRole("link", {
      name: "team@trainingapi.com",
    });
    expect(emailLink).toHaveAttribute("href", "mailto:team@trainingapi.com");
  });
});
