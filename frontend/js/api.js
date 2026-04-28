/**
 * ════════════════════════════════════════════════════════════════
 * API CLIENT - Frontend API Communication
 * ════════════════════════════════════════════════════════════════
 *
 * This module handles all HTTP requests to the backend API.
 * Use these functions instead of fetch() directly.
 *
 * All functions return: { success: true/false, data: {...}, message: "..." }
 */

const API_BASE_URL = "http://localhost:5000/api"; // Change for production

// ════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════

/**
 * Get JWT token from localStorage
 */
function getToken() {
  return localStorage.getItem("authToken");
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall(endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return {
        success: false,
        message: data.message || "API Error",
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error("Network Error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
      error: error.message,
    };
  }
}

// ════════════════════════════════════════════════════════════════
// AUTHENTICATION APIs
// ════════════════════════════════════════════════════════════════

/**
 * Admin login
 */
async function adminLogin(username, password) {
  const response = await apiCall("/auth/admin-login", "POST", {
    username,
    password,
  });
  if (response.success) {
    localStorage.setItem("authToken", response.data.token);
    localStorage.setItem("userType", "admin");
    localStorage.setItem("currentUser", JSON.stringify(response.data.user));
  }
  return response;
}

/**
 * Student login
 */
async function studentLogin(username, password) {
  const response = await apiCall("/auth/student-login", "POST", {
    username,
    password,
  });
  if (response.success) {
    localStorage.setItem("authToken", response.data.token);
    localStorage.setItem("userType", "student");
    localStorage.setItem("currentUser", JSON.stringify(response.data.user));
    localStorage.setItem("currentStudentId", response.data.student._id);
  }
  return response;
}

/**
 * Student registration
 */
async function registerStudent(
  username,
  password,
  name,
  phone,
  aadhaar,
  address,
) {
  return await apiCall("/auth/register", "POST", {
    username,
    password,
    name,
    phone,
    aadhaar,
    address,
  });
}

/**
 * Get current user
 */
async function getCurrentUser() {
  return await apiCall("/auth/me", "GET");
}

/**
 * Logout
 */
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userType");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentStudentId");
}

// ════════════════════════════════════════════════════════════════
// STUDENT APIs
// ════════════════════════════════════════════════════════════════

/**
 * Get all students
 */
async function getAllStudents() {
  return await apiCall("/students", "GET");
}

/**
 * Get student by ID
 */
async function getStudentById(studentId) {
  return await apiCall(`/students/${studentId}`, "GET");
}

/**
 * Add new student
 */
async function addStudent(studentData) {
  return await apiCall("/students", "POST", studentData);
}

/**
 * Update student
 */
async function updateStudent(studentId, studentData) {
  return await apiCall(`/students/${studentId}`, "PUT", studentData);
}

/**
 * Delete student
 */
async function deleteStudent(studentId) {
  return await apiCall(`/students/${studentId}`, "DELETE");
}

/**
 * Get student dashboard
 */
async function getStudentDashboard(studentId) {
  return await apiCall(`/students/${studentId}/dashboard`, "GET");
}

// ════════════════════════════════════════════════════════════════
// SEAT APIs
// ════════════════════════════════════════════════════════════════

/**
 * Get all seats
 */
async function getAllSeats() {
  return await apiCall("/seats", "GET");
}

/**
 * Add new seat
 */
async function addSeat(seatNumber, monthlyRate = 1200) {
  return await apiCall("/seats", "POST", { seatNumber, monthlyRate });
}

/**
 * Update seat
 */
async function updateSeat(seatId, seatData) {
  return await apiCall(`/seats/${seatId}`, "PUT", seatData);
}

/**
 * Delete seat
 */
async function deleteSeat(seatId) {
  return await apiCall(`/seats/${seatId}`, "DELETE");
}

/**
 * Assign seat to student
 */
async function assignSeat(seatId, studentId) {
  return await apiCall(`/seats/assign/${seatId}/${studentId}`, "POST");
}

/**
 * Release seat
 */
async function releaseSeat(seatId) {
  return await apiCall(`/seats/release/${seatId}`, "POST");
}

// ════════════════════════════════════════════════════════════════
// FEE APIs
// ════════════════════════════════════════════════════════════════

/**
 * Get all fees
 */
async function getAllFees() {
  return await apiCall("/fees", "GET");
}

/**
 * Get fees for student
 */
async function getStudentFees(studentId) {
  return await apiCall(`/fees/student/${studentId}`, "GET");
}

/**
 * Add fee record
 */
async function addFee(feeData) {
  return await apiCall("/fees", "POST", feeData);
}

/**
 * Update fee
 */
async function updateFee(feeId, feeData) {
  return await apiCall(`/fees/${feeId}`, "PUT", feeData);
}

/**
 * Delete fee
 */
async function deleteFee(feeId) {
  return await apiCall(`/fees/${feeId}`, "DELETE");
}

/**
 * Get due fees
 */
async function getDueFees() {
  return await apiCall("/fees/due", "GET");
}

// ════════════════════════════════════════════════════════════════
// REPORT APIs
// ════════════════════════════════════════════════════════════════

/**
 * Get dashboard statistics
 */
async function getDashboardStats() {
  return await apiCall("/reports/dashboard", "GET");
}

/**
 * Get student summary
 */
async function getStudentSummary() {
  return await apiCall("/reports/students", "GET");
}

/**
 * Get revenue summary
 */
async function getRevenueSummary() {
  return await apiCall("/reports/revenue", "GET");
}

/**
 * Get occupancy report
 */
async function getOccupancyReport() {
  return await apiCall("/reports/occupancy", "GET");
}

/**
 * Get booking history
 */
async function getBookingHistory() {
  return await apiCall("/reports/bookings", "GET");
}

// ════════════════════════════════════════════════════════════════
// EXPORT ALL FUNCTIONS
// ════════════════════════════════════════════════════════════════

const api = {
  // Auth
  adminLogin,
  studentLogin,
  registerStudent,
  getCurrentUser,
  logout,

  // Students
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentDashboard,

  // Seats
  getAllSeats,
  addSeat,
  updateSeat,
  deleteSeat,
  assignSeat,
  releaseSeat,

  // Fees
  getAllFees,
  getStudentFees,
  addFee,
  updateFee,
  deleteFee,
  getDueFees,

  // Reports
  getDashboardStats,
  getStudentSummary,
  getRevenueSummary,
  getOccupancyReport,
  getBookingHistory,
};

// Make available globally (if using as script tag)
if (typeof window !== "undefined") {
  window.api = api;
}
