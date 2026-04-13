import React from "react";
import { useNavigate } from "react-router-dom";
import "./ForProvidersButton.css";

function ForProvidersButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ForProviders");
  };

  return (
    <div className="for-providers-section">
      <div className="for-providers-label">
        Are you a training provider or instructor?
      </div>
      <button type="button" className="btn-for-providers" onClick={handleClick}>
        → For providers
      </button>
    </div>
  );
}

export default ForProvidersButton;
