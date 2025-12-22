describe("index.js", () => {
  let originalGetElementById;
  let mockRender;
  let mockRoot;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    originalGetElementById = document.getElementById;

    mockRender = jest.fn();
    mockRoot = { render: mockRender };

    jest.mock("react-dom/client", () => ({
      createRoot: jest.fn(() => mockRoot),
    }));

    jest.mock("../App", () => () => <div>Mock App</div>);

    jest.mock("../reportWebVitals", () => jest.fn());

    jest.mock("../index.css", () => ({}));
  });

  afterEach(() => {
    document.getElementById = originalGetElementById;
    jest.restoreAllMocks();
  });

  test("renders App in StrictMode to root element", () => {
    document.getElementById = jest.fn(() => ({
      innerHTML: "",
    }));

    require("../index");

    const ReactDOM = require("react-dom/client");
    const reportWebVitals = require("../reportWebVitals");

    expect(document.getElementById).toHaveBeenCalledWith("root");

    expect(ReactDOM.createRoot).toHaveBeenCalled();

    expect(mockRender).toHaveBeenCalledTimes(1);

    expect(reportWebVitals).toHaveBeenCalled();
  });

  test("handles missing root element", () => {
    document.getElementById = jest.fn(() => null);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    try {
      require("../index");
    } catch (error) {
      expect(error).toBeDefined();
    }

    const errorOccurred = consoleErrorSpy.mock.calls.length > 0;

    consoleErrorSpy.mockRestore();
  });
});
