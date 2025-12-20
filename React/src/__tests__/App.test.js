import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../Header", () => () => <div data-testid="header">HeaderMock</div>);
jest.mock("../Footer", () => () => <div data-testid="footer">FooterMock</div>);
jest.mock("../MainRegLog", () => () => <div>MainRegLogMock</div>);
jest.mock("../RegisteredPage", () => () => <div>RegisteredPageMock</div>);
jest.mock("../ProviderDashboard", () => () => <div>ProviderDashboardMock</div>);
jest.mock("../DeveloperDashboard", () => () => (
  <div>DeveloperDashboardMock</div>
));
jest.mock("../AdminDashboard", () => () => <div>AdminDashboardMock</div>);
jest.mock("../LogoutComponent", () => () => <div>LogoutComponentMock</div>);

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");

  return {
    ...original,

    BrowserRouter: ({ children }) => <div>{children}</div>,

    useLocation: jest.fn(),

    Routes: ({ children }) => <div>{children}</div>,

    Route: ({ element, path }) => {
      const { pathname } = require("react-router-dom").useLocation();
      return pathname === path ? element : null;
    },
  };
});

import { useLocation } from "react-router-dom";

describe("App routing", () => {
  const renderAt = (pathname) => {
    useLocation.mockReturnValue({ pathname });
    return render(<App />);
  };

  test("renders Header and Footer on all routes", () => {
    renderAt("/");
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("renders MainRegLog on '/' route", () => {
    renderAt("/");
    expect(screen.getByText("MainRegLogMock")).toBeInTheDocument();
  });

  test("renders RegisteredPage on '/RegisteredPage' route", () => {
    renderAt("/RegisteredPage");
    expect(screen.getByText("RegisteredPageMock")).toBeInTheDocument();
  });

  test("renders ProviderDashboard on '/ProviderDashboard' route", () => {
    renderAt("/ProviderDashboard");
    expect(screen.getByText("ProviderDashboardMock")).toBeInTheDocument();
  });

  test("renders DeveloperDashboard on '/DeveloperDashboard' route", () => {
    renderAt("/DeveloperDashboard");
    expect(screen.getByText("DeveloperDashboardMock")).toBeInTheDocument();
  });

  test("renders AdminDashboard on '/AdminDashboard' route", () => {
    renderAt("/AdminDashboard");
    expect(screen.getByText("AdminDashboardMock")).toBeInTheDocument();
  });

  test("renders LogoutComponent on '/LogoutComponent' route", () => {
    renderAt("/LogoutComponent");
    expect(screen.getByText("LogoutComponentMock")).toBeInTheDocument();
  });
});
