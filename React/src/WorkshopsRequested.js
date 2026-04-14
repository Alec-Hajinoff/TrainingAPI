import React, { useState, useEffect } from "react";
import { workshopsRequested, deleteWorkshopRequested } from "./ApiService";
import "./WorkshopsRequested.css";

function WorkshopsRequested() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    setDeleteMessage({ type: "", text: "" });
    try {
      const data = await workshopsRequested();
      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setError(data.message || "Failed to load requests");
      }
    } catch (err) {
      setError("Failed to load workshop requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (confirmDeleteId !== requestId) {
      setConfirmDeleteId(requestId);
      // Auto-reset confirmation after 5 seconds
      setTimeout(() => {
        setConfirmDeleteId((prevId) => (prevId === requestId ? null : prevId));
      }, 5000);
      return;
    }

    setDeleteMessage({ type: "", text: "" });

    try {
      const data = await deleteWorkshopRequested(requestId);
      if (data.success) {
        setRequests(requests.filter((req) => req.id !== requestId));
        setDeleteMessage({
          type: "success",
          text: "Workshop request deleted successfully!",
        });
        setTimeout(() => setDeleteMessage({ type: "", text: "" }), 3000);
      } else {
        setDeleteMessage({
          type: "error",
          text: data.message || "Failed to delete request",
        });
      }
    } catch (err) {
      setDeleteMessage({
        type: "error",
        text: "Failed to delete request. Please try again.",
      });
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading)
    return <div className="alert alert-info">Loading requests...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="workshops-requested-container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Workshop Requests ({requests.length})</h4>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={loadRequests}
        >
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="alert alert-light border">
          No workshop requests found.
        </div>
      ) : (
        <div className="request-list">
          {requests.map((request) => (
            <div key={request.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="card-title text-primary">
                      <strong>Organisation:</strong> {request.organisation}
                    </h5>
                    <p className="mb-0">
                      <strong>Name:</strong> {request.name},{" "}
                      <strong>Email:</strong> {request.email}
                    </p>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteRequest(request.id)}
                    >
                      Delete
                    </button>
                    {confirmDeleteId === request.id && (
                      <span className="delete-confirm-text animate-fade-in">
                        Sure?
                      </span>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-7">
                    <p className="mb-1">
                      <strong>Requirement Description:</strong>
                    </p>
                    <p className="text-dark border-start ps-3 py-1 bg-light">
                      {request.requirement_description}
                    </p>
                    {request.additional_details && (
                      <>
                        <p className="mb-1 mt-2">
                          <strong>Additional Details:</strong>
                        </p>
                        <p className="text-muted italic">
                          {request.additional_details}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="col-md-5 border-start">
                    <p className="mb-1">
                      <strong>Technology Area:</strong>{" "}
                      {request.technology_area}
                    </p>
                    <p className="mb-1">
                      <strong>Team Size:</strong> {request.team_size}
                    </p>
                    <p className="mb-1">
                      <strong>Preferred Timing:</strong>{" "}
                      {request.preferred_timing}
                    </p>
                    <p className="mb-1 text-muted">
                      <strong>Created At:</strong>{" "}
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteMessage.text && (
        <div
          className={`alert ${
            deleteMessage.type === "success" ? "alert-success" : "alert-danger"
          } mt-3`}
        >
          {deleteMessage.text}
        </div>
      )}
    </div>
  );
}

export default WorkshopsRequested;
