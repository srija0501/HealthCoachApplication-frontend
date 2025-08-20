import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationById,
  updateApplicationStatus,
  viewDocument,
  downloadDocument,
} from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFileAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleApprove = () => {
    updateApplicationStatus(id, "approved")
      .then(() => {
        alert("✅ Application approved!");
        navigate(-1);
      })
      .catch(() => {});
  };

  const handleReject = () => {
    updateApplicationStatus(id, "rejected", rejectionReason)
      .then(() => {
        alert("❌ Application rejected!");
        setShowRejectModal(false);
        navigate(-1);
      })
      .catch(() => {});
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="badge rounded-pill px-3 py-2 bg-success">
            <FaCheckCircle className="me-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="badge rounded-pill px-3 py-2 bg-danger">
            <FaTimesCircle className="me-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="badge rounded-pill px-3 py-2 bg-warning text-dark">
            <FaClock className="me-1" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center bg-white p-4 rounded-4 shadow-lg">
          <div
            className="spinner-border text-success mb-3"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="text-muted fw-semibold">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mt-5 text-center d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="alert alert-danger shadow-sm px-4 py-3 rounded-4">
          <FaTimesCircle className="me-2" size={"1.2rem"} />
          Application not found.
        </div>
        <button
          className="btn btn-success rounded-pill px-4 mt-3"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" /> Back
        </button>
      </div>
    );
  }

  return (
    <div
  className="container-fluid d-flex justify-content-center align-items-start"
  style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #2c7856ff 0%, #51C4A7 100%)",
    
    paddingBottom: "40px",
  }}
>
      <div className="col-lg-6 col-xl-5">
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="card-header d-flex justify-content-between align-items-center bg-success text-white py-3">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-light btn-sm me-3 rounded-pill px-2"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="me-1" /> 
              </button>
              <span className="fw-bold fs-4">Application Details</span>
            </div>
            {getStatusBadge(application.status)}
          </div>

          {/* Body */}
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-3 border rounded bg-light">
                  <strong className="text-secondary">Full Name:</strong>
                  <div className="mt-1">{application.fullName}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded bg-light">
                  <strong className="text-secondary">Applicant Name:</strong>
                  <div className="mt-1">{application.applicantName}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded bg-light">
                  <strong className="text-secondary">Phone:</strong>
                  <div className="mt-1">{application.phoneNumber}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded bg-light">
                  <strong className="text-secondary">
                    Experience (Years):
                  </strong>
                  <div className="mt-1">{application.experienceYears}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 border rounded bg-light">
                  <strong className="text-secondary">Address:</strong>
                  <div className="mt-1">{application.address}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 border rounded bg-light">
                  <strong className="text-secondary">Program:</strong>
                  <div className="mt-1">{application.program}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 border rounded bg-light">
                  <strong className="text-secondary">Submitted On:</strong>
                  <div className="mt-1">
                    {new Date(application.submissionDate).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            {application.documents?.length > 0 && (
              <div className="mt-4">
                <h5 className="fw-bold text-dark border-bottom pb-2">
                  Uploaded Documents
                </h5>
                <ul className="list-group list-group-flush">
                  {application.documents.map((doc, index) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center my-2 rounded bg-light"
                      key={index}
                    >
                      <span>
                        <FaFileAlt className="text-primary me-2" />
                        {doc.fileName}
                      </span>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => viewDocument(doc.id)}
                          className="btn btn-outline-primary btn-sm rounded-pill"
                        >
                          View
                        </button>
                        <button
                          onClick={() => downloadDocument(doc.id)}
                          className="btn btn-outline-success btn-sm rounded-pill"
                        >
                          Download
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Approve / Reject */}
            {application.status === "pending" && (
              <div className="mt-4 d-flex gap-3 justify-content-center">
                <button
                  className="btn btn-success rounded-pill px-4"
                  onClick={handleApprove}
                >
                  <FaCheckCircle className="me-2" /> Approve
                </button>
                <button
                  className="btn btn-danger rounded-pill px-4"
                  onClick={() => setShowRejectModal(true)}
                >
                  <FaTimesCircle className="me-2" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg rounded-4">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Reject Application</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-semibold">
                  Reason for rejection:
                </label>
                <textarea
                  className="form-control shadow-sm"
                  rows="3"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger rounded-pill px-4"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
