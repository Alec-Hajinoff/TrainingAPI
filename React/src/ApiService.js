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
      },
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
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

// passwordResetLink() sends a user's email address to the backend to email the user a password reset link.

export const passwordResetLink = async (email) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/password_reset_link.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("passwordResetLink error:", error);

    return { success: true };
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
      },
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
      },
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout.");
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
      },
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
      },
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
      },
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
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    throw new Error("Failed to check admin account status");
  }
};

// coursesGet() fetches all courses from the database for the display in the UI.

export const coursesGet = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/courses.php",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in coursesGet:", error);
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
};

// coursesGetAdmin() fetches all courses from the database for the display in the damin dashboard.

export const coursesGetAdmin = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/courses_admin.php",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in coursesGet:", error);
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
};

// workshopRequests() sends custom training request data to the backend.

export const workshopRequests = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/workshop_requests.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in workshopRequests:", error);
    throw new Error(`Failed to submit request: ${error.message}`);
  }
};

// workshopsRequested() fetches all custom training requests for admin review.

export const workshopsRequested = async () => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/workshops_requested.php",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in workshopsRequested:", error);
    throw new Error(`Failed to fetch workshop requests: ${error.message}`);
  }
};

// updateCourseAdmin() allows an administrator to make changes to any workshop.

export const updateCourseAdmin = async (formData) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/update_course_admin.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating course by admin:", error);
    throw new Error("Failed to update course");
  }
};

// deleteCourseAdmin() allows an administrator to delete any workshop.

export const deleteCourseAdmin = async (courseId) => {
  try {
    const formData = new FormData();
    formData.append("course_id", courseId);

    const response = await fetch(
      "http://localhost:8001/TrainingAPI/delete_course_admin.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting course by admin:", error);
    throw new Error("Failed to delete course");
  }
};

// verifyEmail() verifies a user's email using the token from the URL sent to the user by email.

export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/verify_email.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw new Error("An error occurred during email verification.");
  }
};

// passwordResetToken() verifies if a password reset token is valid and not expired.

export const passwordResetToken = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/password_reset_token.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("passwordResetToken error:", error);
    return {
      valid: false,
      message: "An error occurred while verifying the token.",
    };
  }
};

// updatePassword() updates the user's password and clears the reset token.

export const updatePassword = async (token, newPassword) => {
  try {
    const response = await fetch(
      "http://localhost:8001/TrainingAPI/update_password.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: token,
          password: newPassword,
        }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updatePassword error:", error);
    return {
      success: false,
      message: "An error occurred while updating the password.",
    };
  }
};

// deleteWorkshopRequested() allows an administrator to delete a workshop request.

export const deleteWorkshopRequested = async (requestId) => {
  try {
    const formData = new FormData();
    formData.append("request_id", requestId);

    const response = await fetch(
      "http://localhost:8001/TrainingAPI/delete_workshop_requested.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting workshop request:", error);
    throw new Error("Failed to delete workshop request");
  }
};
