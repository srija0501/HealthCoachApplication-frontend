import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getReviewerNotifications,
  getPendingApplications,
  getStatusCounts,
  updateApplicationStatus,
  getApplicationById
} from "../api/api"; 

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const user =
    JSON.parse(localStorage.getItem("user")) || { id: 1, name: "Reviewer" };

  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!user.id) return;

    // ✅ Fetch stats
    getStatusCounts()
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching status counts", err));

    // ✅ Fetch notifications from backend
    getReviewerNotifications(user.id)
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications", err));

    // ✅ Fetch pending applications
    getPendingApplications()
      .then((data) => setPendingApplications(data))
      .catch((err) => console.error("Error fetching pending applications", err));
  }, [user.id]);

  const handleApprove = async (appId) => {
    try {
      await updateApplicationStatus(appId, "APPROVED");
      setPendingApplications((prev) => prev.filter((app) => app.id !== appId));
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Application has been approved",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      Swal.fire("Error", "Failed to approve application", "error");
    }
  };

  const handleView = async (id) => {
  try {
    const app = await getApplicationById(id); // ✅ secured API call
    // Save application in state or session storage before navigating
    localStorage.setItem("currentApplication", JSON.stringify(app));
    navigate(`/application/${id}`);
  } catch (err) {
    console.error("Error fetching application", err);
    Swal.fire("Error", "Failed to load application details", "error");
  }
};


const handleReject = async (appId) => {
  const { value: reason } = await Swal.fire({
    title: "Rejection Reason",
    input: "textarea",
    inputPlaceholder: "Enter the reason for rejection...",
    showCancelButton: true,
    confirmButtonText: "Submit",
    confirmButtonColor: "#dc3545",
  });

  if (reason) {
    try {
      // ✅ Call backend to update status
      await updateApplicationStatus(appId, "REJECTED", reason); // pass reason if your API supports it

      // ✅ Remove from frontend state
      setPendingApplications((prev) => prev.filter((app) => app.id !== appId));

      Swal.fire({
        icon: "success",
        title: "Application Rejected",
        text: "Rejection reason has been saved",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      console.error("Error rejecting application", err);
      Swal.fire("Error", "Failed to reject application", "error");
    }
  }
};


 

 // ✅ Get start and end of current week (Monday → Sunday)
const today = new Date();
const firstDayOfWeek = new Date(today);
firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
firstDayOfWeek.setHours(0, 0, 0, 0);

const lastDayOfWeek = new Date(firstDayOfWeek);
lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Sunday
lastDayOfWeek.setHours(23, 59, 59, 999);

// ✅ Filter notifications for this week
const weeklyNotifications = notifications.filter((n) => {
  if (!n.timestamp) return false;
   const notifDate = Array.isArray(n.timestamp)
  ? new Date(
      n.timestamp[0],      // year
      n.timestamp[1] - 1,  // month (0-based in JS)
      n.timestamp[2],      // day
      n.timestamp[3] || 0, // hour
      n.timestamp[4] || 0, // minute
      n.timestamp[5] || 0  // second
    )
  : new Date(n.timestamp);
  return notifDate >= firstDayOfWeek && notifDate <= lastDayOfWeek;
});


  return (
    <div className="d-flex">
     {/* Sidebar */}
<div
  className="text-white p-3 vh-100 d-flex flex-column justify-content-between"
  style={{
    width: "250px",
    background: "linear-gradient(180deg, #2c786c, #51c4a7)",
  }}
>
  <div>
    <h4 className="mb-4">Reviewer Portal</h4>

    {/* Menu Items */}
    <div className="list-group">
      <button className="list-group-item list-group-item-action border-0 active bg-success text-white">
        Dashboard
      </button>
      <div
        className="d-flex align-items-center p-2 rounded mt-2"
        style={{ cursor: "pointer" }}
        onClick={() => alert("Help Clicked")}
      >
        <i className="bi bi-question-circle me-2"></i>
        <span>Help</span>
      </div>
      <div
        className="d-flex align-items-center p-2 rounded"
        style={{ cursor: "pointer" }}
        onClick={() => alert("Settings Clicked")}
      >
        <i className="bi bi-gear me-2"></i>
        <span>Settings</span>
      </div>
    </div>
  </div>

  {/* Bottom Section: Profile + Logout */}
  <div>
    {/* Profile Section */}
    <div
      className="d-flex align-items-center p-2 rounded mb-3"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div
        className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center"
        style={{ width: "40px", height: "40px", fontWeight: "bold" }}
      >
        {user.name?.charAt(0).toUpperCase() || "R"}
      </div>
      <div className="ms-2">
        <h6 className="m-0">{user.name || "Reviewer"}</h6>
        <small className="text-light">Regular Reviewer</small>
      </div>
    </div>

    {/* Logout Button */}
    <button
      className="logout-btn"
      onClick={handleLogout}
    >
      <i className="bi bi-box-arrow-right"></i>
      Logout
    </button>
  </div>
</div>


      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        {/* Welcome */}
        <div className="mb-4">
          <h2 className="text-success">
            Welcome back, {user.name || "Reviewer"}!
          </h2>
          <p className="text-muted">
            Manage and review pending applications efficiently
          </p>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card text-center shadow-sm border-0">
              <div className="card-body">
                <h5 className="text-muted">Pending Reviews</h5>
                <h2 className="text-warning">{stats.pending || 0}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm border-0">
              <div className="card-body">
                <h5 className="text-muted">Approved</h5>
                <h2 className="text-success">{stats.approved || 0}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm border-0">
              <div className="card-body">
                <h5 className="text-muted">Rejected</h5>
                <h2 className="text-danger">{stats.rejected || 0}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
            <h4 className="text-success m-0">Pending Applications</h4>

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: "250px" }}
              />
              <select
                className="form-select w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="today">Submitted Today</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>

          <table className="table table-hover shadow-sm bg-white rounded">
            <thead className="table-success">
              <tr>
                <th>Name</th>
                <th>Program</th>
                <th>Submission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplications
                .filter((app) =>
                  searchTerm
                    ? app.applicantName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      app.program
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : true
                )
                .map((app) => (
                  <tr key={app.id}>
                    <td title={`Email: ${app.email}\nPhone: ${app.phone}`}>
                      {app.applicantName}
                    </td>
                    <td>{app.program}</td>
                    <td>{app.submissionDate}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                       onClick={() => handleView(app.id)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApprove(app.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(app.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

       {/* Notifications */}
<div className="notifications-section">
  <h3>Notifications (This Week)</h3>
  {weeklyNotifications.length > 0 ? (
    <ul>
      {weeklyNotifications.map((n, index) => (
       <li key={index}>
  <strong>
    {n.timestamp
      ? (Array.isArray(n.timestamp)
          ? new Date(
              n.timestamp[0],
              n.timestamp[1] - 1,
              n.timestamp[2],
              n.timestamp[3] || 0,
              n.timestamp[4] || 0,
              n.timestamp[5] || 0
            ).toLocaleString()
          : new Date(n.timestamp).toLocaleString())
      : "Unknown Date"}
  </strong>{" "}
  – {n.message || "No message provided"}
</li>
      ))}
    </ul>
  ) : (
    <p>No notifications this week</p>
  )}
</div>

      </div>
    </div>
  );
}
