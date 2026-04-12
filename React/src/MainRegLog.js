import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./MainRegLog.css";
import Main from "./Main.js";
import UserRegistration from "./UserRegistration.js";
import UserLogin from "./UserLogin.js";
import Courses from "./Courses.js";
import WorkshopRequests from "./WorkshopRequests.js";
import MyAccountLink from "./MyAccountLink.js";
import { myAccountLink } from "./ApiService";

function MainRegLog() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const lastCheckRef = useRef(0);

  useEffect(() => {
    const checkSession = async () => {
      const now = Date.now();
      if (now - lastCheckRef.current < 1000) {
        return;
      }
      lastCheckRef.current = now;

      console.log("Checking session...");
      setCheckingSession(true);
      try {
        const data = await myAccountLink();
        console.log("Session check result:", data);
        setIsLoggedIn(data.logged_in === true);
      } catch (error) {
        console.error("Session check error:", error);
        setIsLoggedIn(false);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [location.key]);

  if (checkingSession) {
    return (
      <div className="container text-center">
        <div className="row">
          <div className="col-12">
            <div className="my-account-loading">
              <div className="spinner-my-account"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-12 col-md-9">
          <Main />
          <Courses />
          <WorkshopRequests />
        </div>
        <div className="col-12 col-md-3">
          {isLoggedIn ? (
            <MyAccountLink />
          ) : (
            <>
              <p className="footer">New user? Please register:</p>
              <UserRegistration />
              <p className="footer">Existing user? Please login:</p>
              <UserLogin />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainRegLog;
