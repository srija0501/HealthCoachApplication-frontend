import React from "react";
import { useNavigate } from "react-router-dom";

function Footer({ role }) {
  const navigate = useNavigate();

  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">
          {/* Logo & About */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Health Coach Validation</h5>
            <p className="text-light">
              Promoting excellence in health and wellness coaching.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Quick Links</h6>
            <p className="mb-1" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
              Login
            </p>
            <p className="mb-1" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
              Register
            </p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Contact</h6>
            <p className="mb-1">validation@healthcoaches.org</p>
            <p className="mb-1">+1 (800) 555-WELL</p>
            <p>123 Wellness Way, Suite 200</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4 border-top border-light pt-3">
          © {new Date().getFullYear()} Health Coach Validation System. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
