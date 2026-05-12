/*
╔════════════════════════════════════════════════════════════════════╗
║           LIBRARY MANAGEMENT SYSTEM - JavaScript Code             ║
║                   FULLY INTEGRATED WITH BACKEND                   ║
║                                                                    ║
║  This file contains all the logic for the library management UI.  ║
║  All data comes from the backend API - No dummy data!             ║
╚════════════════════════════════════════════════════════════════════╝
*/

// ══════════════════════════════════════════════════════════════════
// 1️⃣ DARK MODE - Toggle between Light and Dark Theme
// ══════════════════════════════════════════════════════════════════

function initDarkMode() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("dark-mode");
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
}

initDarkMode();

// ══════════════════════════════════════════════════════════════════
// 2️⃣ GLOBAL STATE VARIABLES - Keep track of app state
// ══════════════════════════════════════════════════════════════════

let currentPage = "login";
let loggedIn = false;
let userType = null; // 'admin' or 'student'
let currentStudentId = null;
let currentUser = null;

// Data storage (fetched from backend)
let students = [];
let seats = [];
let fees = [];

// ══════════════════════════════════════════════════════════════════
// 3️⃣ UTILITY FUNCTIONS - Helper functions
// ══════════════════════════════════════════════════════════════════

function showLoading(element, message = "Loading...") {
  if (element) {
    element.innerHTML = `
      <div class="d-flex align-items-center justify-content-center" style="min-height: 400px;">
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted">${message}</p>
        </div>
      </div>
    `;
  }
}

function showError(element, message = "An error occurred") {
  if (element) {
    element.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fa fa-exclamation-circle me-2"></i>
        <strong>Error:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
}

function pageTitle(page) {
  const titles = {
    dashboard: "Dashboard",
    students: "Student Management",
    seats: "Seat Management",
    fees: "Fee Management",
    reports: "Reports",
  };
  return titles[page] || "";
}

// ══════════════════════════════════════════════════════════════════
// 4️⃣ MAIN RENDER FUNCTION - Controls what gets displayed
// ══════════════════════════════════════════════════════════════════

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  
  if (!loggedIn) {
    if (userType === null) {
      renderLoginSelection(app);
    } else {
      renderLogin(app);
    }
  } else if (userType === "admin") {
    renderLayout(app);
  } else if (userType === "student") {
    renderStudentLayout(app);
  }
}

// ══════════════════════════════════════════════════════════════════
// 5️⃣ LOGIN PAGES - Admin and Student login
// ══════════════════════════════════════════════════════════════════

function renderLoginSelection(app) {
  app.innerHTML = `
    <div class="d-flex align-items-center justify-content-center vh-100 fade-in">
        <div class="card p-4 shadow" style="min-width:340px; max-width:420px;">
            <div class="text-center mb-4">
                <i class="fa-solid fa-book-open fa-2x text-primary mb-2"></i>
                <h4 class="fw-bold">Library Management System</h4>
                <p class="text-muted mb-0">Choose login type</p>
            </div>
            <div class="d-grid gap-3">
                <button class="btn btn-primary btn-lg" onclick="selectLoginType('admin')">
                    <i class="fa fa-user-tie me-2"></i> Admin Login
                </button>
                <button class="btn btn-outline-primary btn-lg" onclick="selectLoginType('student')">
                    <i class="fa fa-user me-2"></i> Student Login
                </button>
            </div>
        </div>
    </div>
  `;
}

window.selectLoginType = function (type) {
  userType = type;
  render();
};

function renderLogin(app) {
  const isAdmin = userType === "admin";
  const title = isAdmin ? "Admin Login" : "Student Login";
  const placeholder = isAdmin ? "Username" : "Student Phone/Aadhaar";

  let demoContent = "";
  if (isAdmin) {
    demoContent = `
      <div class="alert alert-info small mb-0">
        <strong>Demo Credentials:</strong><br>
        Username: <code>admin</code><br>
        Password: <code>admin123</code>
      </div>
    `;
  } else {
    demoContent = `
      <div class="alert alert-info small mb-0">
        <strong>Demo Credentials:</strong><br>
        Phone/Aadhaar: <code>9876543210</code><br>
        Password: <code>9876543210</code>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="d-flex align-items-center justify-content-center vh-100 fade-in">
        <div class="card p-4 shadow" style="min-width:340px; max-width:410px;">
            <div class="text-center mb-3">
                <i class="fa-solid fa-book-open fa-2x text-primary mb-2"></i>
                <h4 class="fw-bold">${title}</h4>
            </div>
            <form id="loginForm">
                <div class="mb-3">
                    <label class="form-label">${placeholder}</label>
                    <input type="text" class="form-control" name="username" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">
                    <span id="loginBtnText">Login</span>
                    <span id="loginSpinner" class="spinner-border spinner-border-sm ms-2 d-none" role="status"></span>
                </button>
            </form>
            <hr>
            ${demoContent}
            <hr>
            <button class="btn btn-outline-secondary w-100 btn-sm" onclick="userType = null; render();">
                <i class="fa fa-arrow-left me-2"></i> Back
            </button>
        </div>
    </div>
  `;

  document.getElementById("loginForm").onsubmit = async function (e) {
    e.preventDefault();
    const username = this.username.value;
    const password = this.password.value;
    const loginBtn = document.querySelector('button[type="submit"]');
    const spinner = document.getElementById("loginSpinner");

    loginBtn.disabled = true;
    spinner.classList.remove("d-none");

    try {
      let response;
      if (isAdmin) {
        response = await adminLogin(username, password);
      } else {
        response = await studentLogin(username, password);
      }

      if (response.success) {
        loggedIn = true;
        currentUser = response.data.user;
        if (userType === "student") {
          currentStudentId = response.data.student._id;
        }
        currentPage = userType === "admin" ? "dashboard" : "student-dashboard";
        render();
      } else {
        this.password.value = "";
        this.password.classList.add("is-invalid");
        alert(response.message || "Login failed");
        setTimeout(() => this.password.classList.remove("is-invalid"), 1200);
      }
    } catch (error) {
      alert("Login error: " + error.message);
    } finally {
      loginBtn.disabled = false;
      spinner.classList.add("d-none");
    }
  };
}

// ══════════════════════════════════════════════════════════════════
// 6️⃣ ADMIN DASHBOARD - Main layout with sidebar
// ══════════════════════════════════════════════════════════════════

function renderLayout(app) {
  app.innerHTML = `
    <div class="d-flex">
        <nav class="sidebar shadow-sm" id="sidebarNav">
            <div class="text-center mb-4">
                <i class="fa-solid fa-book fa-2x text-primary"></i>
                <div class="fw-bold mt-2">Library Admin</div>
            </div>
            <ul class="nav flex-column px-2">
                <li class="nav-item"><a class="nav-link ${currentPage === "dashboard" ? "active" : ""}" href="#" data-page="dashboard"><i class="fa fa-home me-2"></i>Dashboard</a></li>
                <li class="nav-item"><a class="nav-link ${currentPage === "students" ? "active" : ""}" href="#" data-page="students"><i class="fa fa-users me-2"></i>Student Management</a></li>
                <li class="nav-item"><a class="nav-link ${currentPage === "seats" ? "active" : ""}" href="#" data-page="seats"><i class="fa fa-chair me-2"></i>Seat Management</a></li>
                <li class="nav-item"><a class="nav-link ${currentPage === "fees" ? "active" : ""}" href="#" data-page="fees"><i class="fa fa-money-bill me-2"></i>Fee Management</a></li>
                <li class="nav-item"><a class="nav-link ${currentPage === "reports" ? "active" : ""}" href="#" data-page="reports"><i class="fa fa-chart-bar me-2"></i>Reports</a></li>
                <li class="nav-item mt-4"><a class="nav-link text-danger" href="#" id="logoutBtn"><i class="fa fa-sign-out-alt me-2"></i>Logout</a></li>
            </ul>
        </nav>
        <div class="main-content flex-grow-1">
            <div class="top-navbar d-flex align-items-center justify-content-between">
                <div class="d-lg-none">
                    <button class="btn btn-outline-primary btn-sm" id="sidebarToggle"><i class="fa fa-bars"></i></button>
                </div>
                <div class="fw-bold fs-5">${pageTitle(currentPage)}</div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn theme-toggle" id="themeToggle" onclick="toggleDarkMode(); location.reload();">
                        <i class="fa fa-${document.body.classList.contains("dark-mode") ? "sun" : "moon"}"></i>
                    </button>
                    <span class="me-2"><i class="fa fa-user-circle"></i> ${currentUser?.username || "Admin"}</span>
                </div>
            </div>
            <div id="pageContent" class="fade-in"></div>
        </div>
    </div>
  `;

  document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
    link.onclick = async (e) => {
      e.preventDefault();
      currentPage = link.getAttribute("data-page");
      render();
    };
  });

  document.getElementById("logoutBtn").onclick = () => {
    logout();
    loggedIn = false;
    userType = null;
    currentPage = "login";
    render();
  };

  document.getElementById("sidebarToggle").onclick = () => {
    document.getElementById("sidebarNav").classList.toggle("open");
  };

  renderPageContent();
}

async function renderPageContent() {
  const el = document.getElementById("pageContent");
  if (!el) return;

  switch (currentPage) {
    case "dashboard":
      await renderDashboard(el);
      break;
    case "students":
      await renderStudents(el);
      break;
    case "seats":
      await renderSeats(el);
      break;
    case "fees":
      await renderFees(el);
      break;
    case "reports":
      await renderReports(el);
      break;
    default:
      el.innerHTML = "";
  }
}

// ══════════════════════════════════════════════════════════════════
// 7️⃣ ADMIN PAGES - Dashboard, Students, Seats, Fees, Reports
// ══════════════════════════════════════════════════════════════════

async function renderDashboard(el) {
  showLoading(el, "Fetching dashboard data...");

  try {
    const response = await getDashboardStats();
    if (!response.success) throw new Error(response.message);

    const data = response.data;
    el.innerHTML = `
      <div class="page-header">
          <h2 class="page-title"><i class="fa fa-chart-line me-2"></i>Admin Dashboard</h2>
      </div>
      <div class="row g-4 mb-4">
          <div class="col-md-3 col-6">
              <div class="card stat-card stat-card-blue">
                  <div class="stat-card-icon text-primary"><i class="fa fa-users"></i></div>
                  <div class="stat-card-value">${data.totalStudents}</div>
                  <div class="stat-card-label">Total Students</div>
              </div>
          </div>
          <div class="col-md-3 col-6">
              <div class="card stat-card stat-card-green">
                  <div class="stat-card-icon text-success"><i class="fa fa-check-circle"></i></div>
                  <div class="stat-card-value">${data.availableSeats}</div>
                  <div class="stat-card-label">Available Seats</div>
              </div>
          </div>
          <div class="col-md-3 col-6">
              <div class="card stat-card stat-card-yellow">
                  <div class="stat-card-icon text-warning"><i class="fa fa-chair"></i></div>
                  <div class="stat-card-value">${data.occupiedSeats}</div>
                  <div class="stat-card-label">Occupied Seats</div>
              </div>
          </div>
          <div class="col-md-3 col-6">
              <div class="card stat-card stat-card-red">
                  <div class="stat-card-icon text-danger"><i class="fa fa-exclamation-circle"></i></div>
                  <div class="stat-card-value">${data.totalDueRevenue > 0 ? "⚠️" : "✓"}</div>
                  <div class="stat-card-label">Pending Amounts</div>
              </div>
          </div>
      </div>
      
      <div class="row g-4 mb-4">
          <div class="col-md-6">
              <div class="card p-4">
                  <h5 class="mb-3"><i class="fa fa-money-bill-wave me-2 text-success"></i>Revenue Statistics</h5>
                  <div class="row">
                      <div class="col-6">
                          <div class="mb-3">
                              <div class="text-muted small">Total Revenue</div>
                              <div class="fw-bold fs-4 text-success">₹${data.totalRevenue || 0}</div>
                          </div>
                      </div>
                      <div class="col-6">
                          <div class="mb-3">
                              <div class="text-muted small">Pending Amount</div>
                              <div class="fw-bold fs-4 text-danger">₹${data.totalDueRevenue || 0}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <div class="col-md-6">
              <div class="card p-4">
                  <h5 class="mb-3"><i class="fa fa-chart me-2 text-primary"></i>Occupancy Rate</h5>
                  <div class="mb-3">
                      <div class="d-flex justify-content-between mb-2">
                          <span class="text-muted">Seat Utilization</span>
                          <span class="fw-bold">${data.occupancyRate || 0}%</span>
                      </div>
                      <div class="progress" style="height: 8px;">
                          <div class="progress-bar bg-success" role="progressbar" style="width: ${data.occupancyRate || 0}%"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;
  } catch (error) {
    showError(el, error.message);
  }
}

async function renderStudents(el) {
  el.innerHTML = `
    <div class="row g-4">
        <div class="col-lg-4">
            <div class="card p-3 mb-3">
                <h6 class="mb-3">Add Student</h6>
                <form id="addStudentForm">
                    <div class="mb-2">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" name="name" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Phone</label>
                        <input type="text" class="form-control" name="phone" required pattern="[0-9]{10}">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Address</label>
                        <input type="text" class="form-control" name="address" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Aadhaar Number</label>
                        <input type="text" class="form-control" name="aadhaar" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Student Photo <span class="text-danger">*</span></label>
                        <input type="file" class="form-control" name="photo" accept="image/*" required>
                        <small class="text-muted">Upload a clear photo of the student (JPG, PNG, etc.)</small>
                        <img id="photoPreview" style="display: none; width: 100%; margin-top: 10px; border-radius: 4px;" />
                    </div>
                    <button type="submit" class="btn btn-primary w-100 mt-2">Add Student</button>
                </form>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card p-3">
                <h6 class="mb-3">Student List</h6>
                <div id="studentListContainer">
                    <p class="text-muted">Loading...</p>
                </div>
            </div>
        </div>
    </div>
  `;

  // Load students
  try {
    const response = await getAllStudents();
    if (response.success) {
      students = response.data;
      renderStudentTable();
    }
  } catch (error) {
    console.error("Error loading students:", error);
  }

  // Handle form submission
  document.getElementById("addStudentForm").onsubmit = async function (e) {
    e.preventDefault();
    const form = this;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      // Get photo file
      const photoFile = form.photo.files[0];
      if (!photoFile) {
        alert("Photo is required!");
        btn.disabled = false;
        return;
      }

      // Convert photo to base64
      const photoBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(photoFile);
      });

      const studentData = {
        name: form.name.value,
        phone: form.phone.value,
        address: form.address.value,
        aadhaar: form.aadhaar.value,
        photo: photoBase64,
        isActive: true,
      };

      const response = await addStudent(studentData);
      if (response.success) {
        alert("Student added successfully!");
        render(); // Refresh
      } else {
        alert(response.message || "Failed to add student");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      btn.disabled = false;
    }
  };

  // Preview photo on file selection
  const photoInput = document.querySelector('input[name="photo"]');
  if (photoInput) {
    photoInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const preview = document.getElementById("photoPreview");
          preview.src = event.target.result;
          preview.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

function renderStudentTable() {
  const container = document.getElementById("studentListContainer");
  if (!container) return;

  if (students.length === 0) {
    container.innerHTML = '<p class="text-muted">No students found</p>';
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
        <table class="table align-middle">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Aadhaar</th>
                    <th>Joining Date</th>
                    <th>Fee Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${students
                  .map(
                    (s, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${s.name}</td>
                        <td>${s.phone}</td>
                        <td>${s.address}</td>
                        <td>${s.aadhaar || "-"}</td>
                        <td>${formatDate(s.joiningDate)}</td>
                        <td><span class="badge ${s.feeStatus === "Paid" ? "bg-success" : "bg-warning text-dark"}">${s.feeStatus}</span></td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="deleteStudentHandler('${s._id}', '${s.name}')">
                                <i class="fa fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    </div>
  `;

  // Attach delete handlers
  window.deleteStudentHandler = async function(studentId, studentName) {
    if (confirm(`Are you sure you want to delete ${studentName}?`)) {
      try {
        const response = await deleteStudent(studentId);
        if (response.success) {
          alert("Student deleted successfully!");
          render(); // Refresh
        } else {
          alert(response.message || "Failed to delete student");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };
}

async function renderSeats(el) {
  showLoading(el, "Loading seats...");

  try {
    const response = await getAllSeats();
    if (!response.success) throw new Error(response.message);

    seats = response.data;

    el.innerHTML = `
      <div class="card p-3 mb-3">
          <h6 class="mb-3">Seat Allocation</h6>
          <div class="row g-3" id="seatsContainer">
              ${seats
                .map(
                  (seat) => `
                  <div class="col-6 col-md-3">
                      <div class="card p-2 text-center ${seat.status === "Available" ? "border-success" : "border-warning"}" style="border-width:2px;">
                          <div class="fs-4 mb-2"><i class="fa fa-chair"></i></div>
                          <div class="fw-bold">Seat ${seat.seatNumber}</div>
                          <div class="mb-2">
                              <span class="badge ${seat.status === "Available" ? "bg-success" : "bg-warning text-dark"}">${seat.status}</span>
                          </div>
                          <div class="mb-2 small">${seat.assignedStudent?.name || "-"}</div>
                          <button class="btn btn-sm btn-outline-primary w-100" onclick="openAssignModal('${seat._id}', ${seat.seatNumber})">
                              ${seat.status === "Available" ? "Assign" : "Reassign"}
                          </button>
                      </div>
                  </div>
              `,
                )
                .join("")}
          </div>
      </div>
      <div id="assignModal"></div>
    `;
  } catch (error) {
    showError(el, error.message);
  }
}

window.openAssignModal = async function (seatId, seatNumber) {
  try {
    const response = await getAllStudents();
    if (!response.success) throw new Error(response.message);

    const studentsData = response.data;
    const modal = document.getElementById("assignModal");

    modal.innerHTML = `
      <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.2);">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Assign Seat ${seatNumber}</h5>
                      <button type="button" class="btn-close" onclick="closeAssignModal()"></button>
                  </div>
                  <div class="modal-body">
                      <form id="assignSeatForm">
                          <div class="mb-2">
                              <label class="form-label">Select Student</label>
                              <select class="form-select" name="studentId" required>
                                  <option value="">-- Select --</option>
                                  ${studentsData.map((s) => `<option value="${s._id}">${s.name}</option>`).join("")}
                              </select>
                          </div>
                          <button type="submit" class="btn btn-primary">Assign Seat</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    `;

    document.getElementById("assignSeatForm").onsubmit = async function (e) {
      e.preventDefault();
      const studentId = this.studentId.value;

      try {
        const response = await assignSeat(seatId, studentId);
        if (response.success) {
          alert("Seat assigned successfully!");
          closeAssignModal();
          render();
        } else {
          alert(response.message || "Failed to assign seat");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    };
  } catch (error) {
    alert("Error: " + error.message);
  }
};

window.closeAssignModal = function () {
  document.getElementById("assignModal").innerHTML = "";
};

async function renderFees(el) {
  el.innerHTML = `
    <div class="row g-4">
        <div class="col-lg-4">
            <div class="card p-3 mb-3">
                <h6 class="mb-3">Add Fee Record</h6>
                <form id="addFeeForm">
                    <div class="mb-2">
                        <label class="form-label">Student</label>
                        <select class="form-select" name="student" required>
                            <option value="">-- Loading --</option>
                        </select>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Amount (₹)</label>
                        <input type="number" class="form-control" name="amount" required min="1">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Month</label>
                        <input type="month" class="form-control" name="month" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Status</label>
                        <select class="form-select" name="status" required>
                            <option value="Due">Due</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 mt-2">Add Fee</button>
                </form>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card p-3">
                <h6 class="mb-3">Fee Records</h6>
                <div id="feeListContainer">
                    <p class="text-muted">Loading...</p>
                </div>
            </div>
        </div>
    </div>
  `;

  // Load students for dropdown
  try {
    const response = await getAllStudents();
    if (response.success) {
      const select = document.querySelector('select[name="student"]');
      select.innerHTML = response.data
        .map((s) => `<option value="${s._id}">${s.name}</option>`)
        .join("");
    }
  } catch (error) {
    console.error("Error loading students:", error);
  }

  // Load fees
  try {
    const response = await getAllFees();
    if (response.success) {
      fees = response.data;
      renderFeeTable();
    }
  } catch (error) {
    console.error("Error loading fees:", error);
  }

  // Handle form submission
  document.getElementById("addFeeForm").onsubmit = async function (e) {
    e.preventDefault();
    const form = this;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      const feeData = {
        student: form.student.value,
        amount: parseFloat(form.amount.value),
        month: form.month.value,
        status: form.status.value,
      };

      const response = await addFee(feeData);
      if (response.success) {
        alert("Fee record added successfully!");
        render();
      } else {
        alert(response.message || "Failed to add fee");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      btn.disabled = false;
    }
  };
}

function renderFeeTable() {
  const container = document.getElementById("feeListContainer");
  if (!container) return;

  if (fees.length === 0) {
    container.innerHTML = '<p class="text-muted">No fee records found</p>';
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
        <table class="table align-middle">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Amount</th>
                    <th>Month</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${fees
                  .map(
                    (f, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${f.student?.name || "-"}</td>
                        <td>₹${f.amount}</td>
                        <td>${f.month}</td>
                        <td><span class="badge ${f.status === "Paid" ? "bg-success" : "bg-warning text-dark"}">${f.status}</span></td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    </div>
  `;
}

async function renderReports(el) {
  showLoading(el, "Generating reports...");

  try {
    const statsResponse = await getDashboardStats();
    if (!statsResponse.success) throw new Error(statsResponse.message);

    const data = statsResponse.data;

    const studentsResponse = await getAllStudents();
    const studentsData = studentsResponse.data || [];

    el.innerHTML = `
      <div class="row g-4 mb-4">
          <div class="col-md-4">
              <div class="card p-3 text-center">
                  <div class="fs-2 text-primary"><i class="fa fa-users"></i></div>
                  <div class="fw-bold fs-4">${data.totalStudents}</div>
                  <div class="text-muted">Total Students</div>
              </div>
          </div>
          <div class="col-md-4">
              <div class="card p-3 text-center">
                  <div class="fs-2 text-success"><i class="fa fa-money-bill"></i></div>
                  <div class="fw-bold fs-4">₹${data.totalRevenue || 0}</div>
                  <div class="text-muted">Total Revenue</div>
              </div>
          </div>
          <div class="col-md-4">
              <div class="card p-3 text-center">
                  <div class="fs-2 text-danger"><i class="fa fa-money-bill"></i></div>
                  <div class="fw-bold fs-4">₹${data.totalDueRevenue || 0}</div>
                  <div class="text-muted">Pending Amount</div>
              </div>
          </div>
      </div>
      <div class="card p-4">
          <h6>Detailed Report</h6>
          <div class="table-responsive">
              <table class="table align-middle">
                  <thead>
                      <tr>
                          <th>Student Name</th>
                          <th>Phone</th>
                          <th>Fee Status</th>
                          <th>Joining Date</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${studentsData
                        .map(
                          (s) => `
                          <tr>
                              <td>${s.name}</td>
                              <td>${s.phone}</td>
                              <td><span class="badge ${s.feeStatus === "Paid" ? "bg-success" : "bg-warning text-dark"}">${s.feeStatus}</span></td>
                              <td>${formatDate(s.joiningDate)}</td>
                          </tr>
                      `,
                        )
                        .join("")}
                  </tbody>
              </table>
          </div>
      </div>
    `;
  } catch (error) {
    showError(el, error.message);
  }
}

// ══════════════════════════════════════════════════════════════════
// 8️⃣ STUDENT DASHBOARD - Student's personal dashboard
// ══════════════════════════════════════════════════════════════════

async function renderStudentLayout(app) {
  showLoading(app, "Loading student dashboard...");

  try {
    const response = await getStudentById(currentStudentId);
    if (!response.success) throw new Error(response.message);

    const student = response.data;

    app.innerHTML = `
      <div class="d-flex" style="min-height: 100vh;">
          <div style="flex: 1; padding: 2rem 1rem 1rem 1rem;">
              <div class="top-navbar d-flex align-items-center justify-content-between">
                  <div class="fw-bold fs-5"><i class="fa fa-user-circle me-2"></i>${student.name}</div>
                  <div class="d-flex align-items-center gap-2">
                      <button class="btn theme-toggle" id="themeToggle" onclick="toggleDarkMode(); location.reload();">
                          <i class="fa fa-${document.body.classList.contains("dark-mode") ? "sun" : "moon"}"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" id="logoutBtn"><i class="fa fa-sign-out-alt me-2"></i>Logout</button>
                  </div>
              </div>
              <div id="studentPageContent" class="fade-in"></div>
          </div>
      </div>
    `;

    document.getElementById("logoutBtn").onclick = () => {
      logout();
      loggedIn = false;
      userType = null;
      currentStudentId = null;
      render();
    };

    renderStudentContent(student);
  } catch (error) {
    app.innerHTML = `<div class="p-4"><div class="alert alert-danger">Error loading student data: ${error.message}</div></div>`;
  }
}

function renderStudentContent(student) {
  const el = document.getElementById("studentPageContent");
  if (!el) return;

  el.innerHTML = `
    <div class="page-header">
        <h2 class="page-title"><i class="fa fa-graduation-cap me-2"></i>Student Dashboard</h2>
    </div>
    
    <div class="row g-4 mb-4">
        <div class="col-lg-4">
            <div class="card p-4 text-center">
                <div class="mb-3">
                    ${student.photo ? `<img src="${student.photo}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #dee2e6;" />` : `<i class="fa fa-user-circle fa-5x text-secondary"></i>`}
                </div>
                <div class="fw-bold fs-5 mb-1">${student.name}</div>
                <div class="text-muted small">ID: ${student._id?.substring(0, 8)}</div>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card stat-card stat-card-blue mb-3">
                <div class="row">
                    <div class="col-md-6">
                        <div class="stat-card-label"><i class="fa fa-calendar me-2"></i>Joining Date</div>
                        <div class="stat-card-value" style="font-size: 1.5rem;">${formatDate(student.joiningDate)}</div>
                    </div>
                    <div class="col-md-6">
                        <div class="stat-card-label"><i class="fa fa-chair me-2"></i>Seat Number</div>
                        <div class="stat-card-value" style="font-size: 1.5rem;">${student.currentSeat?.seatNumber || "Unassigned"}</div>
                    </div>
                </div>
            </div>
            
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card stat-card stat-card-green">
                        <div class="stat-card-label"><i class="fa fa-phone me-2"></i>Phone</div>
                        <div class="fw-bold text-monospace">${student.phone}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card stat-card stat-card-yellow">
                        <div class="stat-card-label"><i class="fa fa-id-card me-2"></i>Aadhaar</div>
                        <div class="fw-bold text-monospace">${student.aadhaar || "-"}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row g-4 mb-4">
        <div class="col-lg-8">
            <div class="card p-4">
                <h5 class="mb-3"><i class="fa fa-map-marker-alt me-2"></i>Address</h5>
                <p class="mb-0 text-muted">${student.address || "-"}</p>
            </div>
        </div>
        
        <div class="col-lg-4">
            <div class="card stat-card stat-card-${student.feeStatus === "Paid" ? "green" : "red"}">
                <div class="stat-card-label"><i class="fa fa-money-bill me-2"></i>Fee Status</div>
                <div class="stat-card-value" style="font-size: 1.5rem; text-transform: uppercase;">${student.feeStatus}</div>
                <div class="text-muted small mt-2">Amount Due: ₹${student.totalFeesDue || 0}</div>
            </div>
        </div>
    </div>
    
    <div class="card p-4 welcome-card mb-4">
        <h5 class="mb-2"><i class="fa fa-info-circle me-2"></i>Library Guidelines</h5>
        <div class="row">
            <div class="col-md-6">
                <ul class="list-unstyled small">
                    <li class="mb-2"><i class="fa fa-check-circle me-2 text-success"></i>Maintain quiet environment</li>
                    <li class="mb-2"><i class="fa fa-check-circle me-2 text-success"></i>Keep seat organized</li>
                </ul>
            </div>
            <div class="col-md-6">
                <ul class="list-unstyled small">
                    <li class="mb-2"><i class="fa fa-check-circle me-2 text-success"></i>Pay fees on schedule</li>
                    <li class="mb-2"><i class="fa fa-check-circle me-2 text-success"></i>Follow library norms</li>
                </ul>
            </div>
        </div>
    </div>
  `;
}

// Initialize app - restore session from localStorage on refresh
async function init() {
  const token = localStorage.getItem("authToken");
  const storedUserType = localStorage.getItem("userType");
  const storedUser = localStorage.getItem("currentUser");
  const storedStudentId = localStorage.getItem("currentStudentId");

  if (token && storedUserType) {
    try {
      const response = await getCurrentUser();
      if (response.success) {
        loggedIn = true;
        userType = storedUserType;
        currentUser = storedUser ? JSON.parse(storedUser) : response.data;
        if (storedUserType === "student" && storedStudentId) {
          currentStudentId = storedStudentId;
          currentPage = "student-dashboard";
        } else {
          currentPage = "dashboard";
        }
      } else {
        logout();
      }
    } catch (e) {
      logout();
    }
  }

  render();
}

init();
