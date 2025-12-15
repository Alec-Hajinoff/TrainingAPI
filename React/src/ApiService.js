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

// inputDataFunction() is the API call to send to the backend, data submitted by provider.

export const inputDataFunction = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/course_input.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in inputDataFunction:", error);
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

export const generateApiKey = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/generate_api_key.php",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating API key:", error);
    throw new Error("Failed to generate API key");
  }
};

// fetchUserCourses() fetches all courses from the database to be displayed in the UI.

export const fetchUserCourses = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/fetch_courses.php",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
};

// updateCourse() allows a provider to make changes to an existing course.

export const updateCourse = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/update_course.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw new Error("Failed to update course");
  }
};

// deleteCourse() allows a provider to delete an existing course.

export const deleteCourse = async (courseId) => {
  try {
    const formData = new FormData();
    formData.append("course_id", courseId);

    const response = await fetch(
      "http://localhost:8001/TrainingAPI/delete_course.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw new Error("Failed to delete course");
  }
};

// checkAdminExists() calls the PHP app to query the database to see if an admin account already exists. We then use this to show the appropriate radio buttons on user sign up.

export const checkAdminExists = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/check_admin_exists.php",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    throw new Error("Failed to check admin account status");
  }
};
