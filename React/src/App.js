//import logo from './logo.svg';
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import MainRegLog from "./MainRegLog";
import Footer from "./Footer";
import RegisteredPage from "./RegisteredPage";
import CreateAction from "./CreateAction";
import LogoutComponent from "./LogoutComponent";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainRegLog />} />
          <Route path="RegisteredPage" element={<RegisteredPage />} />
          <Route path="CreateAction" element={<CreateAction />} />
          <Route path="LogoutComponent" element={<LogoutComponent />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
