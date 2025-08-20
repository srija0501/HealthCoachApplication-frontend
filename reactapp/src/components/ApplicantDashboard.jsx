import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplicantNotifications,
  getApplicationStatus,
} from "../api/api";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-plugin-datalabels";

ChartJS.register(...registerables);

function ApplicantDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [showStatus, setShowStatus] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [stats, setStats] = useState({
    applications: 0,
    approved: 0,
    pending: 0
  });

  // Mock stats data - replace with actual API calls
  useEffect(() => {
    setStats({
      applications: 1, // This would be dynamic based on user's actual applications
      approved: applicationStatus === "APPROVED" ? 1 : 0,
      pending: applicationStatus === "PENDING" ? 1 : 0
    });
  }, [applicationStatus]);

  // Data for charts
  const statusData = {
    labels: ["Submitted", "Approved", "Pending"],
    datasets: [
      {
        data: [stats.applications, stats.approved, stats.pending],
        backgroundColor: [
          "#2C786C",
          "#51C4A7",
          "#FFD166"
        ],
        borderColor: [
          "#1A4D45",
          "#3A9D85",
          "#E6B84C"
        ],
        borderWidth: 1,
      }
    ]
  };

  const progressData = {
    labels: ["Profile", "Application", "Review"],
    datasets: [
      {
        label: "Progress",
        data: [
          applicationStatus ? 100 : 0,
          applicationStatus ? 100 : 0,
          applicationStatus === "APPROVED" ? 100 : applicationStatus === "PENDING" ? 50 : 0
        ],
        backgroundColor: "#51C4A7",
        borderRadius: 6,
      }
    ]
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user.id) return;
    setNotifLoading(true);
    try {
      const data = await getApplicantNotifications(user.id);
      const sorted = data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setNotifications(sorted);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Check application status
  const checkApplicationSubmitted = async () => {
    if (!user.id) {
      setError("User ID not found. Please log in again.");
      return false;
    }
    setLoading(true);
    setError(null);
    setShowStatus(false);

    try {
      const status = (await getApplicationStatus(user.id)).toUpperCase();
      if (status === "NOT_SUBMITTED") {
        setApplicationStatus(null);
        alert("Application is not submitted yet.");
        return false;
      }
      setApplicationStatus(status);
      return true;
    } catch (err) {
      console.error("Error checking application submission:", err);
      setError("Error checking application status");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goToProfile = async () => {
    const submitted = await checkApplicationSubmitted();
    if (submitted) {
      navigate("/applicant/profile");
    }
  };

  const fetchStatus = async () => {
    const submitted = await checkApplicationSubmitted();
    if (submitted) setShowStatus(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "APPROVED": return "success";
      case "PENDING": return "warning";
      case "REJECTED": return "danger";
      default: return "secondary";
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Welcome Banner with Stats */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm" style={{ 
            background: "linear-gradient(135deg, #2c7856ff 0%, #51C4A7 100%)",
            borderRadius: "15px"
          }}>
            <div className="card-body text-white p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">Welcome back, {user.name || user.username}!</h2>
                  <p className="mb-0">Here's what's happening with your application</p>
                </div>
                <div className="bg-white text-dark p-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ width: "70px", height: "70px" }}>
                  <i className="bi bi-person-check fs-3 text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "15px" }}>
            <div className="card-body d-flex align-items-center justify-content-around text-center">
              <div>
                <h3 className="text-success">{stats.applications}</h3>
                <p className="mb-0 text-muted small">Applications</p>
              </div>
              <div className="vr"></div>
              <div>
                <h3 className="text-success">{stats.approved}</h3>
                <p className="mb-0 text-muted small">Approved</p>
              </div>
              <div className="vr"></div>
              <div>
                <h3 className="text-warning">{stats.pending}</h3>
                <p className="mb-0 text-muted small">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-3 fw-bold text-dark">Quick Actions</h4>
        </div>
        <div className="col-xl-3 col-md-6 mb-3" onClick={() => navigate("/applicant/apply")}>
          <div className="card h-100 border-0 shadow-sm hover-effect" style={{ borderRadius: "12px" }}>
            <div className="card-body text-center p-4">
              <div className="icon-circle bg-primary-light text-primary mb-3 mx-auto">
                <i className="bi bi-file-earmark-plus fs-4"></i>
              </div>
              <h5 className="mb-1">Submit Application</h5>
              <p className="text-muted small mb-0">Fill in details and upload required documents</p>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-3" onClick={goToProfile}>
          <div className="card h-100 border-0 shadow-sm hover-effect" style={{ borderRadius: "12px" }}>
            <div className="card-body text-center p-4">
              <div className="icon-circle bg-success-light text-success mb-3 mx-auto">
                <i className="bi bi-person-lines-fill fs-4"></i>
              </div>
              <h5 className="mb-1">Manage Application</h5>
              <p className="text-muted small mb-0">Update your personal and professional info</p>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-3" onClick={fetchStatus}>
          <div className="card h-100 border-0 shadow-sm hover-effect" style={{ borderRadius: "12px" }}>
            <div className="card-body text-center p-4">
              <div className="icon-circle bg-warning-light text-warning mb-3 mx-auto">
                <i className="bi bi-clipboard-data fs-4"></i>
              </div>
              <h5 className="mb-1">Track Status</h5>
              <p className="text-muted small mb-0">Monitor your application's progress</p>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-3" onClick={() => navigate("/applicant/guidelines")}>
          <div className="card h-100 border-0 shadow-sm hover-effect" style={{ borderRadius: "12px" }}>
            <div className="card-body text-center p-4">
              <div className="icon-circle bg-info-light text-info mb-3 mx-auto">
                <i className="bi bi-journal-text fs-4"></i>
              </div>
              <h5 className="mb-1">Guidelines</h5>
              <p className="text-muted small mb-0">View application process and tips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Charts Row */}
      <div className="row mb-4">
        {/* Application Status */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "15px" }}>
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold">Application Status</h5>
            </div>
            <div className="card-body">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status"></div>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              
              {showStatus && applicationStatus && (
                <div>
                  <div className={`alert alert-${getStatusColor(applicationStatus)} mb-4`}>
                    <div className="d-flex align-items-center">
                      <i className={`bi bi-${
                        applicationStatus === "APPROVED" ? "check-circle" : 
                        applicationStatus === "PENDING" ? "hourglass" : "x-circle"
                      } fs-4 me-2`}></i>
                      <div>
                        <h5 className="mb-1">Status: {applicationStatus}</h5>
                        <p className="mb-0">
                          {applicationStatus === "APPROVED" ? 
                            "Congratulations! Your application has been approved." : 
                            applicationStatus === "PENDING" ? 
                            "Your application is under review. Please check back later." : 
                            "Your application was not approved this time."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="progress-steps">
                    <div className={`step ${applicationStatus ? "completed" : ""}`}>
                      <div className="step-circle">1</div>
                      <div className="step-label">Profile Created</div>
                    </div>
                    <div className={`step-connector ${applicationStatus ? "active" : ""}`}></div>
                    <div className={`step ${applicationStatus ? "completed" : ""}`}>
                      <div className="step-circle">2</div>
                      <div className="step-label">Application Submitted</div>
                    </div>
                    <div className={`step-connector ${applicationStatus ? "active" : ""}`}></div>
                    <div className={`step ${applicationStatus === "APPROVED" ? "completed success" : 
                                      applicationStatus === "PENDING" ? "in-progress" : ""}`}>
                      <div className="step-circle">3</div>
                      <div className="step-label">
                        {applicationStatus === "APPROVED" ? "Approved" : 
                         applicationStatus === "PENDING" ? "In Review" : "Decision"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!showStatus && !loading && (
                <div className="text-center py-4">
                  <i className="bi bi-info-circle fs-1 text-muted mb-3"></i>
                  <h5>Check Your Status</h5>
                  <p className="text-muted">Click "Track Status" to view your application progress</p>
                  <button 
                    className="btn btn-success"
                    onClick={fetchStatus}
                  >
                    <i className="bi bi-arrow-repeat me-2"></i> Refresh Status
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "15px" }}>
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold">Application Overview</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="chart-container" style={{ height: "200px" }}>
                    <Pie 
                      data={statusData}
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom'
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.label}: ${context.raw}`;
                              }
                            }
                          }
                        },
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="chart-container" style={{ height: "200px" }}>
                    <Bar 
                      data={progressData}
                      options={{
                        indexAxis: 'y',
                        scales: {
                          x: {
                            max: 100,
                            grid: {
                              display: false
                            }
                          },
                          y: {
                            grid: {
                              display: false
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="color-indicator bg-success me-2"></div>
                  <span className="small">Completed Steps</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="color-indicator bg-warning me-2"></div>
                  <span className="small">In Progress</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="color-indicator bg-secondary me-2"></div>
                  <span className="small">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications and Recent Activity */}
      <div className="row">
        {/* Notifications */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent Notifications</h5>
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => navigate("/applicant/notifications")}
              >
                View All
              </button>
            </div>
            <div className="card-body p-0">
              {notifLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="list-group list-group-flush">
                  {notifications.slice(0, 5).map((notif) => (
                    <div 
                      key={notif.id} 
                      className="list-group-item border-0 py-3 px-4 hover-effect"
                    >
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0">
                          <div className="icon-circle bg-light text-success">
                            <i className="bi bi-bell-fill"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-1">{notif.title || "Notification"}</h6>
                            <small className="text-muted">
                              {new Date(notif.timestamp).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-0 small text-muted">{notif.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-bell-slash fs-1 text-muted"></i>
                  <h5 className="mt-3">No Notifications</h5>
                  <p className="text-muted">You don't have any notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
       
      </div>
    </div>
    
   

  );
}

export default ApplicantDashboard;