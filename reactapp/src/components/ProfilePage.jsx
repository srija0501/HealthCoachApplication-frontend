import React, { useEffect, useState } from "react";
import { getApplicationByUserId, updateApplication } from "../api/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (user.id) {
      getApplicationByUserId(user.id)
        .then((data) => {
          if (data.length > 0) {
            const app = data[0];
            setApplicationData(app);
            setFormData({
              fullName: app.fullName || "",
              phoneNumber: app.phoneNumber || "",
              address: app.address || "",
              experienceYears: app.experienceYears || 0,
              program: app.program || "FITNESS",
            });
          }
        })
        .catch((err) =>
          console.error("Error fetching application:", err)
        );
    }
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experienceYears" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const saveProfile = () => {
    if (!applicationData) return;

    const updatePayload = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      experienceYears: formData.experienceYears,
      program: formData.program,
    };

    updateApplication(applicationData.id, updatePayload)
      .then((data) => {
        setApplicationData(data);
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setErrorMessage("");
      })
      .catch((err) => {
        console.error("Error updating application:", err);
        setErrorMessage(
          err.response?.data?.message || "Failed to update profile"
        );
        setSuccessMessage("");
      });
  };

  if (!applicationData) {
    return (
      <div className="profile-container">
        <div className="profile-overlay" />
        <div className="container text-center profile-loading">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3 text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          {/* Welcome */}
          <div className="text-center mb-4">
            <h4 className="fw-bold text-success">
              Welcome, {applicationData.fullName || applicationData.applicantName}
            </h4>
            <p className="text-muted">{user.email}</p>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {/* Applicant Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">Applicant Name (User)</label>
            <input
              className="form-control"
              value={applicationData.applicantName || ""}
              disabled
            />
          </div>

          {/* Full Name, Phone, Program */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Full Name</label>
              <input
                name="fullName"
                className="form-control"
                value={isEditing ? formData.fullName : applicationData.fullName || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Phone Number</label>
              <input
                name="phoneNumber"
                className="form-control"
                value={isEditing ? formData.phoneNumber : applicationData.phoneNumber || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Program</label>
              <select
                name="program"
                className="form-control"
                value={formData.program}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="FITNESS">Fitness</option>
                <option value="MENTAL_WELLNESS">Mental Wellness</option>
                <option value="NUTRITION">Nutrition</option>
                <option value="YOGA">Yoga</option>
                <option value="LIFESTYLE">Lifestyle</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="mb-3">
            <label className="form-label fw-bold">Address</label>
            <textarea
              name="address"
              className="form-control"
              rows={3}
              value={isEditing ? formData.address : applicationData.address || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {/* Experience */}
          <div className="mb-3">
            <label className="form-label fw-bold">Years of Experience</label>
            <input
              type="number"
              name="experienceYears"
              className="form-control"
              value={isEditing ? formData.experienceYears : applicationData.experienceYears || 0}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {/* Submission Date */}
          <div className="mb-3">
            <label className="form-label fw-bold">Submission Date</label>
            <input
              className="form-control"
              value={
                applicationData.submissionDate
                  ? new Date(applicationData.submissionDate).toLocaleString()
                  : ""
              }
              disabled
            />
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="form-label fw-bold">Status</label>
            <input
              className="form-control"
              value={applicationData.status || ""}
              disabled
            />
          </div>

          {/* Documents */}
          <div className="mb-4">
            <label className="form-label fw-bold">Documents</label>
            <ul className="list-group">
              {applicationData.documents && applicationData.documents.length > 0 ? (
                applicationData.documents.map((doc) => (
                  <li
                    key={doc.id || doc.fileName}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <a
                      href={`https://healthcoachapplication-backend.onrender.com/documents/download/${doc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fw-bold text-success"
                    >
                      {doc.fileName}
                    </a>
                    <span className="badge bg-success">{doc.fileType}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">No documents uploaded</li>
              )}
            </ul>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-4">
            {isEditing ? (
              <>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: applicationData.fullName,
                      phoneNumber: applicationData.phoneNumber,
                      address: applicationData.address,
                      experienceYears: applicationData.experienceYears,
                      program: applicationData.program,
                    });
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={saveProfile}>
                  Save Changes
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
