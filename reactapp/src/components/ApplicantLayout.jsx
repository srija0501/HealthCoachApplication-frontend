import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ApplicantDashboard.css"; // Custom CSS if you want to override styles

function ApplicantLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="d-flex flex-column justify-content-between text-white p-3"
        style={{
          width: "250px",
          background:"linear-gradient(135deg, #2c7856ff 0%, #51C4A7 100%)",
          minHeight: "100vh",
        }}
      >
        {/* Top Section */}
        <div>
          <h4 className="fw-bold mb-4 text-center">Health Coach Portal</h4>

          {/* User Info */}
          <div
            className="d-flex align-items-center p-2 rounded mb-4"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          >
            <div
              className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "45px",
                height: "45px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="ms-2">
              <h6 className="m-0">{user.name || "Applicant"}</h6>
              <small className="text-light">Applicant</small>
            </div>
          </div>

          {/* Navigation */}
          <div className="list-group" style={{ background: "#0b0f0eff" }}>
            <button
              className="list-group-item list-group-item-action border-0"
              onClick={() => navigate("/applicant/applicant-dashboard")}
            >
              <i className="bi bi-house-door me-2"></i> Dashboard
            </button>
            <button
              className="list-group-item list-group-item-action border-0"
              onClick={() => navigate("/applicant/apply")}
            >
              <i className="bi bi-file-earmark-plus me-2"></i> Submit Application
            </button>
            <button
              className="list-group-item list-group-item-action border-0"
              onClick={() => navigate("/applicant/profile")}
            >
              <i className="bi bi-person-circle me-2"></i> Manage Application
            </button>
            <button
              className="list-group-item list-group-item-action border-0"
              onClick={() => navigate("/applicant/guidelines")}
            >
              <i className="bi bi-journal-text me-2"></i> Guidelines
            </button>
          </div>
        </div>

        {/* Logout */}
        <div>
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
}

export default ApplicantLayout;
