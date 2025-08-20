import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import {
loginUser
} from "../api/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccessMessage("");

  try {
    const data = await loginUser({ email, password });
    console.log("Login response:", data);

    if (data && data.id && data.role) {
      setSuccessMessage("Login successful!");

      const userData = {
        id: data.id,
        username: data.username,
        role: data.role.toUpperCase(),
      };

      // ✅ Save user and token
      localStorage.setItem("user", JSON.stringify(userData));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ✅ Navigate based on role
      switch (userData.role) {
        case "APPLICANT":
          navigate("/applicant/applicant-dashboard");
          break;
        case "REVIEWER":
          navigate("/reviewer-dashboard");
          break;
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      setError("Invalid login response");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Invalid email or password");
  }
};


  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg, #2c7856ff 0%, #51C4A7 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}
      >
        <h2 className="text-center mb-4 text-success fw-bold">Welcome Back</h2>
        <p className="text-center text-muted mb-4">
          Login to your account to continue
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-secondary w-100 fw-semibold">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{" "}
            <a href="/register" className="text-decoration-none fw-bold">
              Register here
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
