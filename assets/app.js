/*
╔════════════════════════════════════════════════════════════════════╗
║           LIBRARY MANAGEMENT SYSTEM - JavaScript Code             ║
║                                                                    ║
║  This file contains all the logic for the library management UI.  ║
║  Read the sections below to understand how the app works.         ║
╚════════════════════════════════════════════════════════════════════╝

STRUCTURE:
1️⃣  DARK MODE - Switch between light/dark theme
2️⃣  DUMMY DATA - Sample students, seats, fees (not real)
3️⃣  STATE VARIABLES - Track current page, user, login status
4️⃣  MAIN RENDER FUNCTION - Shows the correct page based on state
5️⃣  LOGIN PAGES - Admin and Student login screens
6️⃣  ADMIN DASHBOARD - Admin can manage everything
7️⃣  STUDENT DASHBOARD - Student can see their own info
8️⃣  OTHER PAGES - Students, Seats, Fees, Reports management
*/

// ══════════════════════════════════════════════════════════════════
// 1️⃣ DARK MODE - Toggle between Light and Dark Theme
// ══════════════════════════════════════════════════════════════════

// Load dark mode preference from browser storage
function initDarkMode() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("dark-mode");
  }
}

// Switch between light mode and dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode); // Remember preference
}

// Apply dark mode on page load
initDarkMode();

// ══════════════════════════════════════════════════════════════════
// 2️⃣ DUMMY DATA - Sample Data (No Real Database)
// ══════════════════════════════════════════════════════════════════

// List of students (demo data)
const dummyStudents = [
  {
    id: 1,
    name: "Amit Sharma",
    phone: "9876543210",
    address: "Delhi",
    aadhaar: "1234-5678-9012",
    photo: "",
    joiningDate: "2024-01-10",
    seat: 2,
    feeStatus: "Paid",
  },
  {
    id: 2,
    name: "Priya Singh",
    phone: "9123456780",
    address: "Mumbai",
    aadhaar: "2345-6789-0123",
    photo: "",
    joiningDate: "2024-02-15",
    seat: 5,
    feeStatus: "Due",
  },
  {
    id: 3,
    name: "Rahul Verma",
    phone: "9988776655",
    address: "Lucknow",
    aadhaar: "3456-7890-1234",
    photo: "",
    joiningDate: "2024-03-01",
    seat: 1,
    feeStatus: "Paid",
  },
];

// List of 10 seats and their status
const dummySeats = Array.from({ length: 10 }, (_, i) => ({
  number: i + 1,
  status: dummyStudents.some((s) => s.seat === i + 1)
    ? "Occupied"
    : "Available",
  student: dummyStudents.find((s) => s.seat === i + 1)?.name || "",
}));

// Fee records for students
const dummyFees = [
  {
    id: 1,
    student: "Amit Sharma",
    amount: 1200,
    date: "2024-04-01",
    status: "Paid",
  },
  {
    id: 2,
    student: "Priya Singh",
    amount: 1200,
    date: "2024-04-01",
    status: "Due",
  },
  {
    id: 3,
    student: "Rahul Verma",
    amount: 1200,
    date: "2024-04-01",
    status: "Paid",
  },
];

// Admin login credentials
const adminUser = { username: "admin", password: "admin123" };

// ══════════════════════════════════════════════════════════════════
// 3️⃣ STATE VARIABLES - Keep track of current app state
// ══════════════════════════════════════════════════════════════════

let currentPage = "login"; // Which page to show
let loggedIn = false; // Is user logged in?
let userType = null; // 'admin' or 'student'
let currentStudentId = null; // Which student (if student logged in)

// ══════════════════════════════════════════════════════════════════
// 4️⃣ MAIN RENDER FUNCTION - Decides what to show
// ══════════════════════════════════════════════════════════════════

// This is the MAIN function that controls everything
// It checks the state and decides which page/screen to display
function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  if (!loggedIn) {
    if (userType === null) {
      renderLoginSelection(app); // Show: Choose Admin or Student
    } else {
      renderLogin(app); // Show: Login form
    }
  } else if (userType === "admin") {
    renderLayout(app); // Show: Admin dashboard
  } else if (userType === "student") {
    renderStudentLayout(app); // Show: Student dashboard
  }
}

// ══════════════════════════════════════════════════════════════════
// 5️⃣ LOGIN PAGES - Choose Admin/Student and Login
// ══════════════════════════════════════════════════════════════════

// Screen 1: Choose Admin or Student Login
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

// Screen 2: Show Login Form (Admin or Student)
// This shows username/password fields based on user type
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
        Password: <code>9876543210</code><br>
        <hr class="my-2">
        Or try:<br>
        Phone/Aadhaar: <code>9123456780</code><br>
        Password: <code>9123456780</code>
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
                <button type="submit" class="btn btn-primary w-100">Login</button>
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
  document.getElementById("loginForm").onsubmit = function (e) {
    e.preventDefault();
    const username = this.username.value;
    const password = this.password.value;

    if (isAdmin) {
      if (username === adminUser.username && password === adminUser.password) {
        loggedIn = true;
        currentPage = "dashboard";
        render();
      } else {
        this.password.value = "";
        this.password.classList.add("is-invalid");
        setTimeout(() => this.password.classList.remove("is-invalid"), 1200);
      }
    } else {
      // Student login
      const student = dummyStudents.find(
        (s) =>
          (s.phone === username || s.aadhaar === username) &&
          s.phone === password,
      );
      if (student) {
        loggedIn = true;
        currentStudentId = student.id;
        currentPage = "student-dashboard";
        render();
      } else {
        this.password.value = "";
        this.password.classList.add("is-invalid");
        setTimeout(() => this.password.classList.remove("is-invalid"), 1200);
      }
    }
  };
}

// ══════════════════════════════════════════════════════════════════
// 6️⃣ ADMIN DASHBOARD - Main area with sidebar and content
// ══════════════════════════════════════════════════════════════════

// Show: Admin dashboard with sidebar + main content area
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
                    <span class="me-2"><i class="fa fa-user-circle"></i> Admin</span>
                </div>
            </div>
            <div id="pageContent" class="fade-in"></div>
        </div>
    </div>
    `;
  document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      currentPage = link.getAttribute("data-page");
      render();
    };
  });
  document.getElementById("logoutBtn").onclick = () => {
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

// ══════════════════════════════════════════════════════════════════
// 7️⃣ STUDENT DASHBOARD - Student's personal dashboard
// ══════════════════════════════════════════════════════════════════

// Show: Student's personal information and dashboard
function renderStudentLayout(app) {
  const student = dummyStudents.find((s) => s.id === currentStudentId);
  if (!student) {
    loggedIn = false;
    userType = null;
    render();
    return;
  }

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
    loggedIn = false;
    userType = null;
    currentStudentId = null;
    render();
  };
  renderStudentPageContent(student);
}

function renderStudentPageContent(student) {
  const el = document.getElementById("studentPageContent");
  if (!el) return;

  const fee = dummyFees.find((f) => f.student === student.name);

  el.innerHTML = `
    <div class="page-header">
        <h2 class="page-title"><i class="fa fa-graduation-cap me-2"></i>Student Dashboard</h2>
    </div>
    
    <div class="row g-4 mb-4">
        <div class="col-lg-4">
            <div class="card p-4 text-center">
                <div class="mb-3">
                    ${student.photo ? `<img src="${student.photo}" class="avatar" style="width:120px;height:120px;">` : `<i class="fa fa-user-circle fa-5x text-secondary"></i>`}
                </div>
                <div class="fw-bold fs-5 mb-1">${student.name}</div>
                <div class="text-muted small">ID: ${student.id}</div>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card stat-card stat-card-blue mb-3">
                <div class="row">
                    <div class="col-md-6">
                        <div class="stat-card-label"><i class="fa fa-calendar me-2"></i>Joining Date</div>
                        <div class="stat-card-value" style="font-size: 1.5rem;">${student.joiningDate}</div>
                    </div>
                    <div class="col-md-6">
                        <div class="stat-card-label"><i class="fa fa-chair me-2"></i>Seat Number</div>
                        <div class="stat-card-value" style="font-size: 1.5rem;">${student.seat || "Unassigned"}</div>
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
                        <div class="fw-bold text-monospace">${student.aadhaar}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row g-4 mb-4">
        <div class="col-lg-8">
            <div class="card p-4">
                <h5 class="mb-3"><i class="fa fa-map-marker-alt me-2"></i>Address</h5>
                <p class="mb-0 text-muted">${student.address}</p>
            </div>
        </div>
        
        <div class="col-lg-4">
            <div class="card stat-card stat-card-${student.feeStatus === "Paid" ? "green" : "red"}">
                <div class="stat-card-label"><i class="fa fa-money-bill me-2"></i>Fee Status</div>
                <div class="stat-card-value" style="font-size: 1.5rem; text-transform: uppercase;">${student.feeStatus}</div>
                <div class="text-muted small mt-2">Amount: ₹${fee ? fee.amount : 1200}</div>
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

function pageTitle(page) {
  switch (page) {
    case "dashboard":
      return "Dashboard";
    case "students":
      return "Student Management";
    case "seats":
      return "Seat Management";
    case "fees":
      return "Fee Management";
    case "reports":
      return "Reports";
    case "student-dashboard":
      return "Student Dashboard";
    default:
      return "";
  }
}

function renderPageContent() {
  const el = document.getElementById("pageContent");
  switch (currentPage) {
    case "dashboard":
      renderDashboard(el);
      break;
    case "students":
      renderStudents(el);
      break;
    case "seats":
      renderSeats(el);
      break;
    case "fees":
      renderFees(el);
      break;
    case "reports":
      renderReports(el);
      break;
    case "student-dashboard":
      renderStudentDashboard(el);
      break;
    default:
      el.innerHTML = "";
  }
}

// ══════════════════════════════════════════════════════════════════
// 8️⃣ ADMIN PAGES - Dashboard, Students, Seats, Fees, Reports
// ══════════════════════════════════════════════════════════════════

// Page: Dashboard - Shows summary statistics
function renderDashboard(el) {
  // Calculate statistics from data
  const totalStudents = dummyStudents.length;
  const availableSeats = dummySeats.filter(
    (s) => s.status === "Available",
  ).length;
  const occupiedSeats = dummySeats.filter(
    (s) => s.status === "Occupied",
  ).length;
  const pendingFees = dummyFees.filter((f) => f.status === "Due").length;
  const totalFeesCollected = dummyFees
    .filter((f) => f.status === "Paid")
    .reduce((sum, f) => sum + f.amount, 0);

  el.innerHTML = `
    <div class="page-header">
        <h2 class="page-title"><i class="fa fa-chart-line me-2"></i>Admin Dashboard</h2>
    </div>
    <div class="row g-4 mb-4">
        <div class="col-md-3 col-6">
            <div class="card stat-card stat-card-blue">
                <div class="stat-card-icon text-primary"><i class="fa fa-users"></i></div>
                <div class="stat-card-value">${totalStudents}</div>
                <div class="stat-card-label">Total Students</div>
            </div>
        </div>
        <div class="col-md-3 col-6">
            <div class="card stat-card stat-card-green">
                <div class="stat-card-icon text-success"><i class="fa fa-check-circle"></i></div>
                <div class="stat-card-value">${availableSeats}</div>
                <div class="stat-card-label">Available Seats</div>
            </div>
        </div>
        <div class="col-md-3 col-6">
            <div class="card stat-card stat-card-yellow">
                <div class="stat-card-icon text-warning"><i class="fa fa-chair"></i></div>
                <div class="stat-card-value">${occupiedSeats}</div>
                <div class="stat-card-label">Occupied Seats</div>
            </div>
        </div>
        <div class="col-md-3 col-6">
            <div class="card stat-card stat-card-red">
                <div class="stat-card-icon text-danger"><i class="fa fa-exclamation-circle"></i></div>
                <div class="stat-card-value">${pendingFees}</div>
                <div class="stat-card-label">Pending Fees</div>
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
                            <div class="text-muted small">Fees Collected</div>
                            <div class="fw-bold fs-4 text-success">₹${totalFeesCollected}</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-3">
                            <div class="text-muted small">Pending Amount</div>
                            <div class="fw-bold fs-4 text-danger">₹${dummyFees.filter((f) => f.status === "Due").reduce((sum, f) => sum + f.amount, 0)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card p-4">
                <h5 class="mb-3"><i class="fa fa-performance-chart me-2 text-primary"></i>Occupancy Rate</h5>
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted">Seat Utilization</span>
                        <span class="fw-bold">${Math.round((occupiedSeats / dummySeats.length) * 100)}%</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${(occupiedSeats / dummySeats.length) * 100}%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="card p-4 welcome-card">
        <h5 class="mb-2"><i class="fa fa-lightbulb me-2"></i>Quick Access</h5>
        <p class="mb-0">Use the sidebar menu to manage students, allocate seats, collect fees, and view detailed reports. System runs on demo data.</p>
    </div>
    `;
}

// Page: Student Management - Add and view students
function renderStudents(el) {
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
                        <input type="text" class="form-control" name="aadhaar" required pattern="[0-9\-]{14}">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Photo</label>
                        <input type="file" class="form-control" name="photo" accept="image/*">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Joining Date</label>
                        <input type="date" class="form-control" name="joiningDate" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 mt-2">Add Student</button>
                </form>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card p-3">
                <h6 class="mb-3">Student List</h6>
                <div class="table-responsive">
                    <table class="table align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Aadhaar</th>
                                <th>Joining Date</th>
                                <th>Seat</th>
                                <th>Fee Status</th>
                            </tr>
                        </thead>
                        <tbody id="studentTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `;
  renderStudentTable();
  document.getElementById("addStudentForm").onsubmit = function (e) {
    e.preventDefault();
    const form = this;
    const newStudent = {
      id: dummyStudents.length + 1,
      name: form.name.value,
      phone: form.phone.value,
      address: form.address.value,
      aadhaar: form.aadhaar.value,
      photo: "",
      joiningDate: form.joiningDate.value,
      seat: "",
      feeStatus: "Due",
    };
    if (form.photo.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        newStudent.photo = e.target.result;
        dummyStudents.push(newStudent);
        render();
      };
      reader.readAsDataURL(form.photo.files[0]);
    } else {
      dummyStudents.push(newStudent);
      render();
    }
  };
}

function renderStudentTable() {
  const tbody = document.getElementById("studentTableBody");
  if (!tbody) return;
  tbody.innerHTML = dummyStudents
    .map(
      (s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${s.photo ? `<img src="${s.photo}" class="avatar" alt="photo">` : `<i class="fa fa-user-circle fa-2x text-secondary"></i>`}</td>
            <td>${s.name}</td>
            <td>${s.phone}</td>
            <td>${s.address}</td>
            <td>${s.aadhaar}</td>
            <td>${s.joiningDate}</td>
            <td>${s.seat || "-"}</td>
            <td><span class="badge ${s.feeStatus === "Paid" ? "bg-success" : "bg-warning text-dark"}">${s.feeStatus}</span></td>
        </tr>
    `,
    )
    .join("");
}

// Page: Seat Management - View and assign seats
function renderSeats(el) {
  el.innerHTML = `
    <div class="card p-3 mb-3">
        <h6 class="mb-3">Seat Allocation</h6>
        <div class="row g-3">
            ${dummySeats
              .map(
                (seat) => `
                <div class="col-6 col-md-3">
                    <div class="card p-2 text-center ${seat.status === "Available" ? "border-success" : "border-warning"}" style="border-width:2px;">
                        <div class="fs-4 mb-2"><i class="fa fa-chair"></i></div>
                        <div class="fw-bold">Seat ${seat.number}</div>
                        <div class="mb-2">
                            <span class="badge ${seat.status === "Available" ? "bg-success" : "bg-warning text-dark"}">${seat.status}</span>
                        </div>
                        <div class="mb-2">${seat.student || "-"}</div>
                        <button class="btn btn-sm btn-outline-primary w-100" onclick="assignSeat(${seat.number})">${seat.status === "Available" ? "Assign" : "Change"}</button>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    </div>
    <div id="assignSeatModal"></div>
    `;
}

window.assignSeat = function (seatNumber) {
  const seat = dummySeats.find((s) => s.number === seatNumber);
  const modal = document.getElementById("assignSeatModal");
  modal.innerHTML = `
    <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.2);">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Assign Seat ${seatNumber}</h5>
                    <button type="button" class="btn-close" onclick="closeAssignSeatModal()"></button>
                </div>
                <div class="modal-body">
                    <form id="assignSeatForm">
                        <div class="mb-2">
                            <label class="form-label">Select Student</label>
                            <select class="form-select" name="studentId" required>
                                <option value="">-- Select --</option>
                                ${dummyStudents.map((s) => `<option value="${s.id}" ${s.seat === seatNumber ? "selected" : ""}>${s.name}</option>`).join("")}
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Assign</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
  document.getElementById("assignSeatForm").onsubmit = function (e) {
    e.preventDefault();
    const studentId = +this.studentId.value;
    dummyStudents.forEach((s) => {
      if (s.seat === seatNumber) s.seat = "";
    });
    if (studentId) {
      dummyStudents.forEach((s) => {
        if (s.id === studentId) s.seat = seatNumber;
      });
    }
    updateSeats();
    closeAssignSeatModal();
    render();
  };
};
window.closeAssignSeatModal = function () {
  document.getElementById("assignSeatModal").innerHTML = "";
};

function updateSeats() {
  dummySeats.forEach((seat) => {
    const student = dummyStudents.find((s) => s.seat === seat.number);
    seat.status = student ? "Occupied" : "Available";
    seat.student = student ? student.name : "";
  });
}

// Page: Fee Management - Track and manage fees
function renderFees(el) {
  el.innerHTML = `
    <div class="row g-4">
        <div class="col-lg-4">
            <div class="card p-3 mb-3">
                <h6 class="mb-3">Enter Fee Details</h6>
                <form id="addFeeForm">
                    <div class="mb-2">
                        <label class="form-label">Student Name</label>
                        <select class="form-select" name="student" required>
                            <option value="">-- Select --</option>
                            ${dummyStudents.map((s) => `<option value="${s.name}">${s.name}</option>`).join("")}
                        </select>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Amount</label>
                        <input type="number" class="form-control" name="amount" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Payment Date</label>
                        <input type="date" class="form-control" name="date" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Status</label>
                        <select class="form-select" name="status" required>
                            <option value="Paid">Paid</option>
                            <option value="Due">Due</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 mt-2">Add Fee</button>
                </form>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card p-3">
                <h6 class="mb-3">Fee Records</h6>
                <div class="table-responsive">
                    <table class="table align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="feeTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `;
  renderFeeTable();
  document.getElementById("addFeeForm").onsubmit = function (e) {
    e.preventDefault();
    const form = this;
    const newFee = {
      id: dummyFees.length + 1,
      student: form.student.value,
      amount: +form.amount.value,
      date: form.date.value,
      status: form.status.value,
    };
    dummyFees.push(newFee);
    // Update student fee status
    const student = dummyStudents.find((s) => s.name === newFee.student);
    if (student) student.feeStatus = newFee.status;
    render();
  };
}

function renderFeeTable() {
  const tbody = document.getElementById("feeTableBody");
  if (!tbody) return;
  tbody.innerHTML = dummyFees
    .map(
      (f, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${f.student}</td>
            <td>₹${f.amount}</td>
            <td>${f.date}</td>
            <td><span class="badge ${f.status === "Paid" ? "bg-success" : "bg-warning text-dark"}">${f.status}</span></td>
        </tr>
    `,
    )
    .join("");
}

// Page: Reports - View statistics and summaries
function renderReports(el) {
  // Calculate statistics
  const totalStudents = dummyStudents.length;
  const feesCollected = dummyFees
    .filter((f) => f.status === "Paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingFees = dummyFees
    .filter((f) => f.status === "Due")
    .reduce((sum, f) => sum + f.amount, 0);
  el.innerHTML = `
    <div class="row g-4">
        <div class="col-md-4">
            <div class="card p-3 text-center">
                <div class="fs-2 text-primary"><i class="fa fa-users"></i></div>
                <div class="fw-bold fs-4">${totalStudents}</div>
                <div class="text-muted">Total Students</div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card p-3 text-center">
                <div class="fs-2 text-success"><i class="fa fa-money-bill"></i></div>
                <div class="fw-bold fs-4">₹${feesCollected}</div>
                <div class="text-muted">Fees Collected</div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card p-3 text-center">
                <div class="fs-2 text-danger"><i class="fa fa-money-bill"></i></div>
                <div class="fw-bold fs-4">₹${pendingFees}</div>
                <div class="text-muted">Pending Fees</div>
            </div>
        </div>
    </div>
    <div class="card p-4 mt-4">
        <h6>Summary Table</h6>
        <div class="table-responsive">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Seat</th>
                        <th>Fee Status</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${dummyStudents
                      .map((s) => {
                        const fee = dummyFees.find((f) => f.student === s.name);
                        return `<tr>
                            <td>${s.name}</td>
                            <td>${s.seat || "-"}</td>
                            <td><span class="badge ${s.feeStatus === "Paid" ? "bg-success" : "bg-warning text-dark"}">${s.feeStatus}</span></td>
                            <td>₹${fee ? fee.amount : "-"}</td>
                        </tr>`;
                      })
                      .join("")}
                </tbody>
            </table>
        </div>
    </div>
    `;
}

function renderStudentDashboard(el) {
  // For demo, show first student
  const student = dummyStudents[0];
  el.innerHTML = `
    <div class="row g-4">
        <div class="col-md-4">
            <div class="card p-3 text-center">
                <div class="mb-2">
                    ${student.photo ? `<img src="${student.photo}" class="avatar" style="width:80px;height:80px;">` : `<i class="fa fa-user-circle fa-4x text-secondary"></i>`}
                </div>
                <div class="fw-bold fs-5 mb-1">${student.name}</div>
                <div class="text-muted">Aadhaar: ${student.aadhaar}</div>
            </div>
        </div>
        <div class="col-md-8">
            <div class="card p-3">
                <h6>Student Details</h6>
                <div class="row mb-2">
                    <div class="col-6">Seat Number:</div>
                    <div class="col-6 fw-bold">${student.seat || "-"}</div>
                </div>
                <div class="row mb-2">
                    <div class="col-6">Joining Date:</div>
                    <div class="col-6 fw-bold">${student.joiningDate}</div>
                </div>
                <div class="row mb-2">
                    <div class="col-6">Fee Status:</div>
                    <div class="col-6 fw-bold"><span class="badge ${student.feeStatus === "Paid" ? "bg-success" : "bg-warning text-dark"}">${student.feeStatus}</span></div>
                </div>
                <div class="row mb-2">
                    <div class="col-6">Phone:</div>
                    <div class="col-6 fw-bold">${student.phone}</div>
                </div>
                <div class="row mb-2">
                    <div class="col-6">Address:</div>
                    <div class="col-6 fw-bold">${student.address}</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ══════════════════════════════════════════════════════════════════
// START THE APP
// ══════════════════════════════════════════════════════════════════

// Call render() to show the initial login screen
render();

/*
═══════════════════════════════════════════════════════════════════

  HOW THE APP FLOWS:

  1. User Opens Page
     ↓ render() is called
     ↓ Shows: "Choose Admin or Student"
  
  2. User Clicks Admin Login
     ↓ selectLoginType('admin') is called
     ↓ userType = 'admin'
     ↓ render() is called again
     ↓ Shows: Admin Login Form
  
  3. User Enters Credentials
     ↓ Checks: username === 'admin' && password === 'admin123'
     ↓ If correct: loggedIn = true
     ↓ render() is called again
     ↓ Shows: Admin Dashboard with Sidebar
  
  4. User Clicks Menu Item
     ↓ currentPage = 'students' (or 'seats', 'fees', etc)
     ↓ render() → renderLayout() → renderPageContent()
     ↓ Shows: Student Management page
  
  5. User Clicks Logout
     ↓ loggedIn = false
     ↓ userType = null
     ↓ render() is called
     ↓ Shows: Login Selection again

═══════════════════════════════════════════════════════════════════
*/
