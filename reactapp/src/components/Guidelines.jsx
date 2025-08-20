import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ApplicantGuidelines() {
  const navigate = useNavigate();

  const guidelines = [
    "Fill in all required details accurately before submitting your application.",
    "Upload clear and valid documents (certificates, resume, etc.).",
    "Ensure documents meet the specified file size and format requirements.",
    "Provide accurate contact details for communication.",
    "Double-check your application before final submission.",
    "You can track your application status on your dashboard.",
    "For any issues, contact support through the provided channels."
  ];

  return (
    <div className="container mt-5">

      {/* Main Card */}
      <div className="card shadow-lg border-0">
        {/* Card Header */}
        <div
          className="card-header text-white py-4"
          style={{  background: "linear-gradient(135deg, #2c7856ff 0%, #51C4A7 100%)" }}
        >
          <h3 className="fw-bold mb-1">Applicant Guidelines</h3>
          <p className="mb-0 small text-white-50">
            Please read these instructions carefully before applying.
          </p>
        </div>

        {/* Card Body */}
        <div className="card-body bg-light">
          <ul className="list-group list-group-flush">
            {guidelines.map((rule, index) => (
              <li
                key={index}
                className="list-group-item border-0 bg-transparent d-flex align-items-start"
              >
                <span
                  className="badge bg-success rounded-pill me-3 shadow-sm"
                  style={{ minWidth: "30px", fontSize: "13px" }}
                >
                  {index + 1}
                </span>
                <span style={{ fontSize: "15px", lineHeight: "1.6" }}>
                  {rule}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
