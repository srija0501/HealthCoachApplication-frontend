import './App.css';
import HomePage from './components/HomePage';
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ApplicationForm from './components/ApplicationForm';
import ApplicantDashboard from './components/ApplicantDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import ApplicationDetails from './components/ApplicationDetails';
import Guidelines from './components/Guidelines';

// NEW layout for applicant (with sidebar)
import ApplicantLayout from './components/ApplicantLayout';

function PrivateRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Applicant routes with sidebar layout */}
          <Route
            path="/applicant"
            element={
              <PrivateRoute roles={["APPLICANT"]}>
                <ApplicantLayout />
              </PrivateRoute>
            }
          >
            <Route path="applicant-dashboard" element={<ApplicantDashboard />} />
            <Route path="apply" element={<ApplicationForm />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="guidelines" element={<Guidelines />} />
          </Route>

          {/* Application details (Applicant only) */}
          <Route
            path="application/:id"
            element={
              <PrivateRoute roles={["APPLICANT","REVIEWER"]}>
                <ApplicationDetails />
              </PrivateRoute>
            }
          />

          {/* Reviewer */}
          <Route
            path="/reviewer-dashboard"
            element={
              <PrivateRoute roles={["REVIEWER"]}>
                <ReviewerDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
