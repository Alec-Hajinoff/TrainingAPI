import {
  registerUser,
  loginUser,
  inputDataFunction,
  logoutUser,
  generateApiKey,
  fetchUserCourses,
  updateCourse,
  deleteCourse,
  checkAdminExists,
} from "../ApiService";

describe("TrainingApiService helpers", () => {
  const originalFetch = global.fetch;
  let consoleErrorSpy;

  beforeEach(() => {
    global.fetch = jest.fn();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test("registerUser posts JSON and returns parsed data", async () => {
    const formData = { name: "Alec", email: "test@example.com" };
    const mockBody = { success: true };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockBody),
    });

    const result = await registerUser(formData);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/form_capture.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      }
    );
    expect(result).toEqual(mockBody);
  });

  test("registerUser throws generic error on failure", async () => {
    global.fetch.mockRejectedValue(new Error("Network down"));

    await expect(registerUser({})).rejects.toThrow("An error occurred.");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("loginUser posts credentials and returns parsed data", async () => {
    const formData = { email: "user@example.com", password: "Password123" };
    const mockBody = { status: "ok" };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockBody),
    });

    const result = await loginUser(formData);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/login_capture.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );
    expect(result).toEqual(mockBody);
  });

  test("loginUser throws generic error on failure", async () => {
    global.fetch.mockRejectedValue(new Error("Server offline"));

    await expect(loginUser({})).rejects.toThrow("An error occurred.");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("inputDataFunction posts FormData and returns parsed JSON", async () => {
    const formData = new FormData();
    formData.append("course", "React Basics");

    const mockBody = { success: true };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockBody),
    });

    const result = await inputDataFunction(formData);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/course_input.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );
    expect(result).toEqual(mockBody);
  });

  test("inputDataFunction forwards detailed error message", async () => {
    global.fetch.mockRejectedValue(new Error("Upload failed"));

    await expect(inputDataFunction(new FormData())).rejects.toThrow(
      "Failed to create agreement: Upload failed"
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("logoutUser succeeds when backend responds OK", async () => {
    global.fetch.mockResolvedValue({ ok: true });

    await expect(logoutUser()).resolves.toBeUndefined();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/logout_component.php",
      {
        method: "POST",
        credentials: "include",
      }
    );
  });

  test("logoutUser throws when backend response is not OK", async () => {
    global.fetch.mockResolvedValue({ ok: false });

    await expect(logoutUser()).rejects.toThrow(
      "An error occurred during logout."
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("generateApiKey posts request and returns parsed JSON", async () => {
    const mockBody = { apiKey: "abc123" };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockBody),
    });

    const result = await generateApiKey();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/generate_api_key.php",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    expect(result).toEqual(mockBody);
  });

  test("generateApiKey throws on failure", async () => {
    global.fetch.mockRejectedValue(new Error("Keygen error"));

    await expect(generateApiKey()).rejects.toThrow(
      "Failed to generate API key"
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("fetchUserCourses fetches courses and returns parsed JSON", async () => {
    const mockBody = { courses: [] };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockBody),
    });

    const result = await fetchUserCourses();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/fetch_courses.php",
      {
        method: "GET",
        credentials: "include",
      }
    );
    expect(result).toEqual(mockBody);
  });

  test("fetchUserCourses throws on failure", async () => {
    global.fetch.mockRejectedValue(new Error("DB error"));

    await expect(fetchUserCourses()).rejects.toThrow("Failed to fetch courses");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("updateCourse posts FormData and returns parsed JSON", async () => {
    const formData = new FormData();
    formData.append("title", "Updated Course");

    const mockBody = { success: true };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockBody),
    });

    const result = await updateCourse(formData);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/update_course.php",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );
    expect(result).toEqual(mockBody);
  });

  test("updateCourse throws on failure", async () => {
    global.fetch.mockRejectedValue(new Error("Update failed"));

    await expect(updateCourse(new FormData())).rejects.toThrow(
      "Failed to update course"
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("deleteCourse posts courseId and returns parsed JSON", async () => {
    const mockBody = { deleted: true };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockBody),
    });

    const result = await deleteCourse("123");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/delete_course.php",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: expect.any(FormData),
      })
    );

    expect(result).toEqual(mockBody);
  });

  test("deleteCourse throws on failure", async () => {
    global.fetch.mockRejectedValue(new Error("Delete failed"));

    await expect(deleteCourse("123")).rejects.toThrow(
      "Failed to delete course"
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test("checkAdminExists fetches admin status and returns parsed JSON", async () => {
    const mockBody = { exists: true };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockBody),
    });

    const result = await checkAdminExists();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8001/TrainingAPI/check_admin_exists.php",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    expect(result).toEqual(mockBody);
  });

  test("checkAdminExists throws on failure", async () => {
    global.fetch.mockRejectedValue(new Error("Query failed"));

    await expect(checkAdminExists()).rejects.toThrow(
      "Failed to check admin account status"
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
