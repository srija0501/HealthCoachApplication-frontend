import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "./Footer";
import { FaClipboardList, FaUserCheck, FaRegChartBar } from "react-icons/fa";

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // decode role if token exists
  let role = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  console.log("Token:", token);
  console.log("Role:", role);

  // redirect only if token + role exist
useEffect(() => {
  if (token && role) {
    switch (role) {
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
  }
}, [token, role, navigate]);

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const renderHeroButtons = () => (
    <div className="d-flex justify-content-center gap-3 mt-4">
      <button
        className="btn btn-success btn-lg px-4"
        onClick={() => navigate("/register")}
      >
        Register
      </button>
      <button
        className="btn btn-outline-light btn-lg px-4"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );

  return (
    <div className="homepage">
      {/* Hero Section */}
      <header
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1667762241847-37471e8c8bc0?w=1920&auto=format&fit=crop&q=80&ixlib=rb-4.1.0')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "75vh",
        }}
      >
        <div
          className="p-5 rounded"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <h1 className="display-4 fw-bold">
            Health Coach Validation System
          </h1>
          <p className="lead mt-3">
            Platform for aspiring coaches to apply & be reviewed efficiently.
          </p>
          {/* Show login/register buttons only if no token */}
          {!token && renderHeroButtons()}
          {/* If logged in, show logout */}
          {token && (
            <button
              className="btn btn-danger btn-lg mt-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Impact Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Our Impact</h2>
          <div className="row g-4">
            {[
              { value: "1243+", label: "Validated Coaches" },
              { value: "87", label: "New Validations This Month" },
              { value: "92%", label: "Approval Rate" },
              { value: "156", label: "Pending Reviews" },
            ].map((stat, idx) => (
              <div key={idx} className="col-md-3">
                <div className="p-4 text-center bg-white rounded shadow-sm">
                  <h3 className="text-success fw-bold">{stat.value}</h3>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Validation Process */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3">Our Validation Process</h2>
              <p className="lead">
                We ensure that only qualified health coaches meet the highest
                professional standards.
              </p>
              <p>
                Our rigorous process reviews qualifications, experience, and
                ethics to ensure excellence.
              </p>
              <button
                className="btn btn-success btn-lg mt-3"
                onClick={() => navigate(token ? "/apply" : "/register")}
              >
                {token ? "Submit Application" : "Register as Coach"}
              </button>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1627818653012-054f17eb0648?w=600&auto=format&fit=crop&q=60"
                alt="Validation Illustration"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Validation */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Our 3-Step Validation</h2>
          <div className="row g-4">
            {[
              {
                icon: (
                  <FaClipboardList size={40} className="text-success mb-3" />
                ),
                title: "Application Review",
                desc: "Submit your credentials for thorough evaluation by our experts.",
              },
              {
                icon: (
                  <FaUserCheck size={40} className="text-success mb-3" />
                ),
                title: "Background Verification",
                desc: "We verify certifications, work history, and ethical standards.",
              },
              {
                icon: (
                  <FaRegChartBar size={40} className="text-success mb-3" />
                ),
                title: "Continuous Monitoring",
                desc: "Regular assessments to ensure ongoing compliance and quality.",
              },
            ].map((step, idx) => (
              <div key={idx} className="col-md-4">
                <div className="p-4 h-100 bg-white rounded shadow-sm text-center">
                  {step.icon}
                  <h4 className="fw-bold">{step.title}</h4>
                  <p className="text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainer Support */}
      <section className="py-5 bg-dark text-white">
        <div className="container text-center">
          <h2 className="mb-4 fw-bold">Trainer Support Center</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <h5>Emergency Contact</h5>
              <p className="fs-5 fw-bold text-warning">+91 98765 43210</p>
            </div>
            <div className="col-md-3">
              <h5>Email Support</h5>
              <p className="fs-5">support@healthcoachsystem.com</p>
            </div>
            <div className="col-md-3">
              <h5>Working Hours</h5>
              <p className="mb-0">Mon - Fri: 9 AM – 6 PM</p>
              <p>Sat: 9 AM – 1 PM</p>
            </div>
            <div className="col-md-3">
              <h5>Office Address</h5>
              <p className="mb-0">123 Wellness Street</p>
              <p>Hyderabad, India</p>
            </div>
          </div>
        </div>
      </section>

      <Footer role={role} />
    </div>
  );
}

export default HomePage;
