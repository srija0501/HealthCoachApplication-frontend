import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getApplicationsByStatus,
  getStatusCounts,
  getApplicationsReport,
  updateApplicationStatus,
  addUser,
} from "../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4b9d61ff", "#51c4a7", "#ffb347", "#ff6b6b"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");

  // --- Users pagination state ---
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [reportData, setReportData] = useState([]);
  const [appFilter, setAppFilter] = useState("pending");
  const [activeChart, setActiveChart] = useState("bar");

  const [newReviewer, setNewReviewer] = useState({
    username: "",
    email: "",
    password: "",
    role: "REVIEWER",
  });

  useEffect(() => {
    if (activeTab === "users") loadUsers(currentPage);
    if (activeTab === "applications") loadApplicationsByStatus(appFilter);
    if (activeTab === "analytics") loadAnalytics();
  }, [activeTab, appFilter, currentPage]);

  // --- Load Users with Pagination ---
  const loadUsers = (page = 0) => {
    getAllUsers(page, pageSize)
      .then((res) => {
        setUsers(res.content || []);
        setTotalPages(res.totalPages || 0);
      })
      .catch(console.error);
  };

  const loadApplicationsByStatus = (status) => {
    getApplicationsByStatus(status).then(setApplications).catch(console.error);
  };

  const loadAnalytics = () => {
    getStatusCounts().then(setStatusCounts).catch(console.error);
    getApplicationsReport("2025-01-01", "2025-12-31")
      .then(setReportData)
      .catch(console.error);
  };

  const handleApplicationUpdate = (appId, status) => {
    updateApplicationStatus(appId, status)
      .then(() => loadApplicationsByStatus(appFilter))
      .catch(console.error);
  };
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

const handleAddReviewer = async (e) => {
  e.preventDefault();
  try {
    const reviewerData = {
      name: newReviewer.username,   // ✅ correct field name
      email: newReviewer.email,
      password: newReviewer.password,
    };
    await addUser(reviewerData);
    alert("✅ Reviewer added successfully");
    setNewReviewer({
      username: "",
      email: "",
      password: "",
    });
    loadUsers(currentPage);
  } catch (err) {
    alert(
      "❌ Failed to add reviewer: " +
        (err.response?.data?.message || "Unknown error")
    );
  }
};

  // ------------------ Render Tabs ------------------
  const renderContent = () => {
    switch (activeTab) {
      // ========== USERS ==========
      case "users":
        return (
          <div className="admin-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0 text-success fw-bold">
                <i className="bi bi-people-fill me-2"></i> User Management
              </h2>
              <div className="bg-success bg-opacity-10 px-3 py-1 rounded-pill">
                <small className="text-success fw-bold">
                  {users.length} Active Users
                </small>
              </div>
            </div>

            {/* Add Reviewer Card */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-secondary mb-3">
                  <i className="bi bi-person-plus me-2"></i>Add New Reviewer
                </h5>
                <form onSubmit={handleAddReviewer} className="row g-3">
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="usernameInput"
                        placeholder="Username"
                        value={newReviewer.username}
                        onChange={(e) =>
                          setNewReviewer({
                            ...newReviewer,
                            username: e.target.value,
                          })
                        }
                        required
                      />
                      <label htmlFor="usernameInput">Username</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="emailInput"
                        placeholder="Email"
                        value={newReviewer.email}
                        onChange={(e) =>
                          setNewReviewer({ ...newReviewer, email: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="emailInput">Email</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="passwordInput"
                        placeholder="Password"
                        value={newReviewer.password}
                        onChange={(e) =>
                          setNewReviewer({
                            ...newReviewer,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <label htmlFor="passwordInput">Password</label>
                    </div>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button
                      type="submit"
                      className="btn btn-success w-100 py-3 fw-bold"
                    >
                      <i className="bi bi-person-plus me-2"></i> Add Reviewer
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Users Table Card */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 text-secondary">
                  <i className="bi bi-table me-2"></i>User Directory
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">ID</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="ps-4 fw-bold text-muted">#{u.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-3">
                                <div className="avatar-title bg-light rounded-circle">
                                  <i className="bi bi-person-fill text-success"></i>
                                </div>
                              </div>
                              <div>
                                <h6 className="mb-0">{u.username || u.name}</h6>
                                <small className="text-muted">Member since {new Date().toLocaleDateString()}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <a href={`mailto:${u.email}`} className="text-decoration-none">
                              {u.email}
                            </a>
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill py-1 px-3 ${
                                u.role === "ADMIN"
                                  ? "bg-primary"
                                  : u.role === "REVIEWER"
                                  ? "bg-info text-dark"
                                  : "bg-secondary"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <button className="btn btn-sm btn-outline-secondary me-2">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="card-footer bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        Showing <strong>{users.length}</strong> of <strong>{totalPages * pageSize}</strong> users
                      </small>
                    </div>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-success"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      >
                        <i className="bi bi-chevron-left"></i> Previous
                      </button>
                      <button className="btn btn-sm btn-outline-success disabled">
                        Page {currentPage + 1} of {totalPages}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
                        disabled={currentPage + 1 >= totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        Next <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ========== APPLICATIONS ==========
    case "applications":
  return (
    <div className="admin-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-success fw-bold">
          <i className="bi bi-file-earmark-text me-2"></i> Application Management
        </h2>
        <div className="bg-success bg-opacity-10 px-3 py-1 rounded-pill">
          <small className="text-success fw-bold">
            {applications.length} {appFilter} applications
          </small>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body py-2">
          <div className="btn-group w-100">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                className={`btn btn-sm ${
                  appFilter === status ? "btn-success" : "btn-outline-light"
                } text-capitalize`}
                onClick={() => setAppFilter(status)}
              >
                <i
                  className={`bi bi-${
                    status === "pending"
                      ? "hourglass-split"
                      : status === "approved"
                      ? "check-circle"
                      : "x-circle"
                  } me-2`}
                  style={{ fontSize: "20px", color: "black" }}
                ></i>
                <span style={{ color: "black", fontSize: "14px" }}>{status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 text-secondary">
            <i className="bi bi-list-check me-2"></i>
            {appFilter.charAt(0).toUpperCase() + appFilter.slice(1)} Applications
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Applicant</th>
                  <th>Program</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  {/* Removed Actions column */}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="ps-4 fw-bold text-muted">#{app.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm me-3">
                          <div className="avatar-title bg-light rounded-circle">
                            <i className="bi bi-person-fill text-success"></i>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{app.applicantName || app.user?.username}</h6>
                          <small className="text-muted">{app.email || "N/A"}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">{app.program || "N/A"}</span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(app.createdAt || new Date()).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill py-1 px-3 ${
                          app.status === "pending"
                            ? "bg-warning text-dark"
                            : app.status === "approved"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {applications.length === 0 && (
          <div className="card-body text-center py-5">
            <div className="empty-state">
              <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
              <h5 className="mt-3">No {appFilter} applications found</h5>
              <p className="text-muted">
                When new {appFilter} applications arrive, they'll appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

      // ========== ANALYTICS ==========
      case "analytics":
        return (
          <div className="admin-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0 text-success fw-bold">
                <i className="bi bi-bar-chart-fill me-2"></i> Dashboard Analytics
              </h2>
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-success dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-calendar me-2"></i>2025
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item">2025</button>
                  </li>
                  <li>
                    <button className="dropdown-item">2024</button>
                  </li>
                  <li>
                    <button className="dropdown-item">2023</button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm bg-success bg-opacity-10">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-uppercase text-muted mb-2">Total Applications</h6>
                        <h3 className="mb-0">
                          {Object.values(statusCounts).reduce((a, b) => a + b, 0)}
                        </h3>
                      </div>
                      <div className="avatar-sm">
                        <div className="avatar-title bg-success rounded-circle">
                          <i className="bi bi-files"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-uppercase text-muted mb-2">Pending</h6>
                        <h3 className="mb-0">{statusCounts.pending || 0}</h3>
                      </div>
                      <div className="avatar-sm">
                        <div className="avatar-title bg-warning rounded-circle">
                          <i className="bi bi-hourglass-split"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm bg-primary bg-opacity-10">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-uppercase text-muted mb-2">Approved</h6>
                        <h3 className="mb-0">{statusCounts.approved || 0}</h3>
                      </div>
                      <div className="avatar-sm">
                        <div className="avatar-title bg-primary rounded-circle">
                          <i className="bi bi-check-circle"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart toggle */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body py-2">
                <div className="btn-group w-100">
                  <button
                    className={`btn btn-sm ${
                      activeChart === "bar" ? "btn-success" : "btn-outline-light"
                    }`}
                    onClick={() => setActiveChart("bar")}
                  >
                    <i className="bi bi-bar-chart-line me-2" style={{ color: "black" }}></i><span style={{ color: "black" , fontSize: "20px"}}>Monthly Trends</span>
                  </button>
                  <button
                    className={`btn btn-sm ${
                      activeChart === "pie" ? "btn-success" : "btn-outline-light"
                    }`}
                    onClick={() => setActiveChart("pie")}
                  >
                    <i className="bi bi-bar-chart-line me-2" style={{ color: "black" }}></i><span style={{ color: "black" , fontSize: "20px"}}>Status Distribution</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="row">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0">
                    <h5 className="mb-0">
                      {activeChart === "bar" ? "Monthly Applications" : "Status Distribution"}
                    </h5>
                  </div>
                  <div className="card-body">
                    {activeChart === "bar" && (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid rgba(0,0,0,0.1)',
                              borderRadius: '6px',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="applications"
                            name="Total Applications"
                            fill="#2c786c"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="approved"
                            name="Approved"
                            fill="#51c4a7"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="rejected"
                            name="Rejected"
                            fill="#ff6b6b"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {activeChart === "pie" && (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={Object.entries(statusCounts).map(([name, value]) => ({
                              name: name.charAt(0).toUpperCase() + name.slice(1),
                              value,
                            }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={60}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {Object.keys(statusCounts).map((_, i) => (
                              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(val) => [`${val}`, "Applications"]}
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid rgba(0,0,0,0.1)',
                              borderRadius: '6px',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Legend 
                            layout="horizontal" 
                            verticalAlign="bottom" 
                            align="center"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0">
                    <h5 className="mb-0">Quick Stats</h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      <div className="list-group-item border-0 px-0 py-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-1">Approval Rate</h6>
                            <small className="text-muted">Percentage of approved applications</small>
                          </div>
                          <div className="text-success fw-bold">
                            {statusCounts.approved && statusCounts.pending && statusCounts.rejected
                              ? Math.round(
                                  (statusCounts.approved /
                                    (statusCounts.approved + statusCounts.pending + statusCounts.rejected)) *
                                    100
                                )
                              : 0}
                            %
                          </div>
                        </div>
                        <div className="progress mt-2" style={{ height: "6px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{
                              width: `${statusCounts.approved && statusCounts.pending && statusCounts.rejected
                                ? Math.round(
                                    (statusCounts.approved /
                                      (statusCounts.approved + statusCounts.pending + statusCounts.rejected)) *
                                      100
                                  )
                                : 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="list-group-item border-0 px-0 py-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-1">Processing Time</h6>
                            <small className="text-muted">Average days to review</small>
                          </div>
                          <div className="text-primary fw-bold">2.4 days</div>
                        </div>
                      </div>
                      <div className="list-group-item border-0 px-0 py-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-1">Peak Month</h6>
                            <small className="text-muted">Highest application volume</small>
                          </div>
                          <div className="text-warning fw-bold">
                            {reportData.length > 0
                              ? reportData.reduce((max, obj) =>
                                  obj.applications > max.applications ? obj : max
                                ).month
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="admin-content">
            <div className="text-center py-5 my-5">
              <div className="avatar-lg mx-auto mb-4">
                <div className="avatar-title bg-light rounded-circle">
                  <i className="bi bi-shield-lock text-success" style={{ fontSize: "2.5rem" }}></i>
                </div>
              </div>
              <h2 className="fw-bold">Welcome to Admin Dashboard</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: "500px" }}>
                Select a section from the sidebar to view and manage applications, users, or view analytics reports.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard min-vh-100">
      <div className="d-flex">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          <div className="sidebar-header p-4" >
            <div className="d-flex align-items-center">
              <div className="avatar-sm me-3">
                <div className="avatar-title bg-white text-success rounded-circle">
                  <i className="bi bi-shield-lock"></i>
                </div>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">Admin Panel</h4>
                <small className="text-white-50">Administrator</small>
              </div>
            </div>
          </div>

          <ul className="nav nav-pills flex-column mb-auto gap-2 px-3">
            <li className="nav-item">
              <button
                className={`nav-link w-100 text-start rounded-3 ${
                  activeTab === "analytics"
                    ? "active bg-white text-success"
                    : "text-white"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                <i className="bi bi-bar-chart-fill me-2"></i> Analytics
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link w-100 text-start rounded-3 ${
                  activeTab === "users"
                    ? "active bg-white text-success"
                    : "text-white"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <i className="bi bi-people-fill me-2"></i> Manage Users
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link w-100 text-start rounded-3 ${
                  activeTab === "applications"
                    ? "active bg-white text-success"
                    : "text-white"
                }`}
                onClick={() => setActiveTab("applications")}
              >
                <i className="bi bi-file-earmark-text me-2"></i> Applications
                <i className="bi bi-chevron-right ms-auto"></i>
              </button>
            </li>
          </ul>

          <div className="sidebar-footer p-4 mt-auto">
            <div className="d-flex align-items-center">
              <div className="avatar-sm me-3">
                <div className="avatar-title bg-white text-success rounded-circle">
                  <i className="bi bi-person-fill"></i>
                </div>
              </div>
              <div>
                <h6 className="mb-0 text-white">Admin User</h6>
                <small className="text-white-50">admin@example.com</small>
              </div>
              <button
  className="btn btn-sm btn-outline-light ms-auto"
  onClick={handleLogout}
>
  <i className="bi bi-box-arrow-right"></i>
</button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="admin-main flex-grow-1">
          <div className="container-fluid py-4 px-4">{renderContent()}</div>
        </main>
      </div>

      {/* Add some custom styles */}
      <style jsx>{`
        .admin-dashboard {
          background-color: #f8f9fa;
        }
        .admin-sidebar {
          width: 280px;
          min-height: 100vh;
          background: linear-gradient(180deg, #2c786c, #51c4a7);
          color: white;
          display: flex;
          flex-direction: column;
        }
       
        .admin-content {
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.03);
        }
        .nav-link.active {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
        }
        .table {
          --bs-table-striped-bg: rgba(44, 120, 108, 0.03);
        }
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          color: #6c757d;
        }
        .avatar-sm {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-lg {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-title {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}