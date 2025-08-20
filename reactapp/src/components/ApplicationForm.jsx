import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
 submitApplication,
 uploadDocuments
} from "../api/api";


// ---- GREEN-BASED THEME ----
const colors = {
  primary: '#2C786C',
  accent: '#51C4A7',
  background: '#F9FAF4',
  card: '#FFFFFF',
  textDark: '#2D4739',
  success: '#4BB543',
  danger: '#E63946'
};

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    experienceYears: 1,
    program: ''  // ✅ new field
  });

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const userId = storedUser.id;

  // ---- Handle Inputs ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ---- File Validation ----
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (
        !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)
      ) {
        setError('Only PDF, DOC, or DOCX files are allowed.');
        setIsFileTooLarge(false);
        setFile(null);
        setFileName('No file chosen');
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setIsFileTooLarge(true);
        setFile(null);
        setFileName('No file chosen');
        setError('File size should be under 5 MB.');
        return;
      }
      setFile(f);
      setFileName(f.name);
      setIsFileTooLarge(false);
      setError('');
    }
  };

  // ---- MAIN SUBMISSION HANDLER ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // 1️⃣ Submit Application
      const appRes = await submitApplication(userId, formData);
      const applicationId = appRes.id;

      // 2️⃣ Upload Document (if provided)
      if (file) {
        await uploadDocuments(applicationId, [file]); // pass as array
      }

      setSuccess("Application submitted successfully!");
      setTimeout(() => navigate("/applicant/applicant-dashboard"), 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: `
          linear-gradient(rgba(22, 34, 33, 0.25), rgba(81, 196, 167, 0.35)),
          url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&auto=format&fit=crop&q=80')
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="row justify-content-center">
        <div className="col-xl-7 col-lg-9 col-md-10">
          <div
            className="card shadow-lg border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(3px)',
              borderRadius: '25px',
              border: 'none',
              boxShadow: '0 6px 28px 0 rgba(7, 7, 7, 0.15)',
            }}
          >
            {/* HEADER */}
            <div
              className="card-header py-3 d-flex justify-content-between align-items-center"
              style={{
                background: colors.primary,
                color: 'white',
                borderBottom: `4px solid ${colors.accent}`,
                borderTopLeftRadius: '25px',
                borderTopRightRadius: '25px',
              }}
            >
              <h3 className="mb-0">
                <i className="bi bi-file-earmark-person me-2"></i>
                Health Coach Application
              </h3>
              <button
                className="btn btn-sm"
                onClick={() => navigate(-1)}
                style={{
                  background: colors.accent,
                  color: colors.textDark,
                  borderRadius: '7px',
                }}
              >
                <i className="bi bi-arrow-left me-1"></i> Back
              </button>
            </div>

            {/* BODY */}
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                  <button type="button" className="btn-close ms-auto" onClick={() => setError('')} aria-label="Close"></button>
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>{success}</div>
                  <button type="button" className="btn-close ms-auto" onClick={() => setSuccess('')} aria-label="Close"></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* PERSONAL INFO */}
                <fieldset className="mb-4 p-3" style={{ border: `1px solid ${colors.accent}`, borderRadius: '14px', background: colors.background }}>
                  <legend className="float-none w-auto px-2 fs-5" style={{ color: colors.primary, fontWeight: 600 }}>
                    <i className="bi bi-person-lines-fill me-2"></i> Personal Information
                  </legend>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="fullName" name="fullName"
                          value={formData.fullName} onChange={handleChange} required placeholder="Full Name" />
                        <label htmlFor="fullName"><i className="bi bi-person"></i> Full Name <span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber"
                          pattern="[0-9]{10}" value={formData.phoneNumber} onChange={handleChange}
                          required placeholder="9876543210" />
                        <label htmlFor="phoneNumber"><i className="bi bi-telephone"></i> Phone Number <span className="text-danger">*</span></label>
                      </div>
                      <small className="text-muted ms-1">Format: 10 digits without spaces</small>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea className="form-control" id="address" name="address" style={{ minHeight: '82px' }}
                          value={formData.address} onChange={handleChange} required placeholder="Address" />
                        <label htmlFor="address"><i className="bi bi-house-door"></i> Address <span className="text-danger">*</span></label>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* PROFESSIONAL DETAILS */}
                <fieldset className="mb-4 p-3" style={{ border: `1px solid ${colors.accent}`, borderRadius: '14px', background: colors.background }}>
                  <legend className="float-none w-auto px-2 fs-5" style={{ color: colors.primary, fontWeight: 600 }}>
                    <i className="bi bi-briefcase-fill me-2"></i> Professional Details
                  </legend>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="number" className="form-control" id="experienceYears" name="experienceYears"
                          min="1" max="50" value={formData.experienceYears} onChange={handleChange} required placeholder="Years of Experience" />
                        <label htmlFor="experienceYears"><i className="bi bi-calendar-check"></i> Years of Experience <span className="text-danger">*</span></label>
                      </div>
                      <small className="text-muted ms-1">Minimum 1 year required</small>
                    </div>

                    {/* ✅ NEW DROPDOWN FOR SPECIALIZATION */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select className="form-select" id="program" name="program"
                          value={formData.program} onChange={handleChange} required>
                          <option value="">-- Select Specialization --</option>
                          <option value="FITNESS">Fitness</option>
                          <option value="NUTRITION">Nutrition</option>
                          <option value="MENTAL_HEALTH">Mental Health</option>
                          <option value="YOGA">Yoga</option>
                        </select>
                        <label htmlFor="program"><i className="bi bi-heart-pulse"></i> Specialization <span className="text-danger">*</span></label>
                      </div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="document" className="form-label fw-semibold mt-2 mb-1" style={{ color: colors.textDark }}>
                        <i className="bi bi-file-earmark-arrow-up"></i> Upload Resume/CV
                      </label>
                      <div className="input-group">
                        <input type="file" className="form-control" id="document" onChange={handleFileChange}
                          accept=".pdf,.doc,.docx" aria-describedby="documentHelp" />
                        <span className="input-group-text">{fileName}</span>
                      </div>
                      <small className="text-muted ms-1" id="documentHelp">
                        Accepted: PDF, DOC, DOCX (max 5MB)
                      </small>
                    </div>
                  </div>
                </fieldset>

                {/* BUTTONS */}
                <hr style={{ borderTop: `1.5px solid ${colors.accent}` }} />
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button type="button" className="btn me-md-2 px-4" onClick={() => navigate(-1)}
                    style={{ background: colors.accent, color: colors.textDark, borderRadius: '8px', fontWeight: 600 }}>
                    <i className="bi bi-x-circle me-2"></i> Cancel
                  </button>
                  <button type="submit" className="btn px-4" disabled={isSubmitting || isFileTooLarge}
                    style={{ background: isSubmitting ? "#cccccc" : colors.primary, color: 'white', borderRadius: '8px', fontWeight: 600 }}>
                    {isSubmitting ? (<><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>)
                      : (<><i className="bi bi-send-check me-2"></i>Submit Application</>)}
                  </button>
                </div>
              </form>
            </div>

            {/* FOOTER */}
            <div className="card-footer py-3" style={{ backgroundColor: colors.accent, borderTop: `2px solid ${colors.primary}` }}>
              <p className="small mb-0" style={{ color: colors.textDark }}>
                <i className="bi bi-info-circle me-1"></i> Fields marked with <span className="text-danger">*</span> are required.
                Your information will be kept confidential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
