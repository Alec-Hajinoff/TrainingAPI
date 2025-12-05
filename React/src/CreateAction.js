// When a user inputs text into the text box & uploads a file - this is the file that is responsible.

import React, { useState } from "react";
import "./CreateAction.css";
import LogoutComponent from "./LogoutComponent";
import { createActionFunction } from "./ApiService";

function CreateAction() {
  const [agreementText, setAgreementText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setAgreementText(value);
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const submitData = new FormData();
    submitData.append("agreement_text", agreementText);

    try {
      const data = await createActionFunction(submitData);

      if (data && data.success) {
        setAgreementText("");

        setSuccessMessage("Submission saved");

        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage("Submission failed. Please try again.");
        setTimeout(() => setErrorMessage(""), 4000);
      }
    } catch (error) {
      setErrorMessage(error?.message || "Submission failed. Please try again.");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div>
        <p>
          To add a sustainability action or event, type a description in the
          text box, attach any supporting document, and click Submit.
        </p>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="agreementText">
            For example: 'We installed solar panels' or 'We reduced waste by
            switching to recyclable packaging.'
          </label>

          <textarea
            id="agreementText"
            className="form-control"
            rows="10"
            name="agreement_text"
            value={agreementText}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex flex-column align-items-end mb-3">
          {successMessage && (
            <div
              id="success-message"
              className="alert alert-success mb-2"
              role="status"
              aria-live="polite"
            >
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div
              id="error-message"
              className="alert alert-danger mb-2"
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </div>
          )}
          {loading && (
            <div className="error mb-2" role="status">
              Saving your action to the blockchain, please wait…
            </div>
          )}
          <button type="submit" className="btn btn-secondary" id="loginBtnOne">
            Submit
            <span
              role="status"
              aria-hidden="true"
              id="spinnerLogin"
              style={{ display: loading ? "inline-block" : "none" }}
            ></span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAction;
