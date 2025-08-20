import axios from "axios";

const API_BASE = "http://localhost:8080";

// ================== AXIOS INSTANCE WITH TOKEN ==================
const api = axios.create({
  baseURL: API_BASE,
});

// Add Authorization header automatically if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================== AUTH & USER APIs ==================
export const loginUser = async (credentials) => {
  const res = await api.post(`/user/login`, credentials);
  const data = res.data;

  // Normalize response
  if (data.user) {
    return {
      id: data.user.id,
      username: data.user.username,
      role: data.user.role,
      token: data.token,
    };
  }

  return data; // already flat
};

export const registerUser = async (userData) => {
  const res = await api.post(`/user/register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const addUser = async (userData) => {
  const res = await api.post(`/user/addReviewer`, userData);
  return res.data;
};

export const getAllUsers = async (page = 0, size = 5) => {
  const res = await api.get(`/user/get`, { params: { page, size } });
  return res.data;
};

export const getUsersByRole = async (role) => {
  const res = await api.get(`/user/role/${role}`);
  return res.data;
};

export const updateUserProfile = async (id, updatedUser) => {
  const res = await api.put(`/user/${id}/profile`, updatedUser);
  return res.data;
};

// ------------------ Application APIs ------------------

export const getApplicationsByStatus = async (status) => {
  const res = await api.get(`/application/filterByStatus`, {
    params: { status },
  });
  return res.data;
};

export const submitApplication = async (userId, applicationData) => {
  const res = await api.post(`/application/submit/${userId}`, applicationData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const uploadDocuments = async (applicationId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await api.post(`/documents/upload/${applicationId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ------------------ Applicant APIs ------------------

export const getApplicantNotifications = (userId) =>
  api.get(`/notification/user/${userId}`).then((res) => res.data);

export const getApplicationStatus = (userId) =>
  api
    .get(`/application/${userId}/application-status`, { responseType: "text" })
    .then((res) => res.data);

export const getApplicationById = (appId) =>
  api.get(`/application/${appId}`).then((res) => res.data);

export const getApplicationByUserId = async (userId) => {
  const res = await api.get(`/application/dashboard/${userId}`);
  return res.data;
};

export const updateApplication = async (appId, payload) => {
  const res = await api.put(`/application/${appId}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ------------------ Reviewer/Admin APIs ------------------

export const getReviewerNotifications = (reviewerId) =>
  api.get(`/notification/user/${reviewerId}`).then((res) => res.data);

export const getPendingApplications = () =>
  api.get(`/application/pending`).then((res) => res.data);

export const updateApplicationStatus = async (
  applicationId,
  status,
  rejectionReason = null
) => {
  try {
    const res = await api.put(`/application/${applicationId}/status`, {
      status,
      rejectionReason,
    });
    return res.data;
  } catch (error) {
    console.error(
      "Error updating application status",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getStatusCounts = async () => {
  const res = await api.get(`/application/status-counts`);
  return res.data;
};

// ------------------ Documents ------------------

// View Document
export const viewDocument = async (docId) => {
  const res = await api.get(`/documents/view/${docId}`, {
    responseType: "blob", // important
  });

  const file = new Blob([res.data], { type: res.headers["content-type"] });
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL, "_blank");
};

// Download Document
export const downloadDocument = async (docId) => {
  const res = await api.get(`/documents/download/${docId}`, {
    responseType: "blob",
  });

  const file = new Blob([res.data], { type: res.headers["content-type"] });
  const fileURL = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", `document-${docId}.pdf`); // change extension if needed
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// ------------------ MOCK ONLY FOR REPORT ------------------
export const getApplicationsReport = async (startDate, endDate) => {
  console.warn("Using mock data for getApplicationsReport (backend missing)");
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { month: "Jan", applications: 12, approved: 8, rejected: 4 },
    { month: "Feb", applications: 18, approved: 12, rejected: 6 },
    { month: "Mar", applications: 25, approved: 20, rejected: 5 },
    { month: "Apr", applications: 10, approved: 6, rejected: 4 },
    { month: "May", applications: 30, approved: 22, rejected: 8 },
    { month: "Jun", applications: 15, approved: 10, rejected: 5 },
  ];
};
