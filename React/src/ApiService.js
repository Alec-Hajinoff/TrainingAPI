//Frontend - backend communication must happen over HTTPS on production

export const registerUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/form_capture.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/login_capture.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

// createActionFunction() is the API call to send to the backend the agreement text + the file submitted by the user.

export const createActionFunction = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/create_action.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createActionFunction:", error);
    throw new Error(`Failed to create agreement: ${error.message}`);
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/logout_component.php",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout.");
  }
};
