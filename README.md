# Library Management System - Code Structure

## 📁 Project Files

- **index.html** - Main HTML page (entry point)
- **assets/styles.css** - All styling & dark mode
- **assets/app.js** - Main application logic

## 🏗️ Code Organization

### `app.js` Structure:

1. **Dark Mode** (Lines 1-20)
   - `initDarkMode()` - Load dark mode from storage
   - `toggleDarkMode()` - Switch between light/dark

2. **Dummy Data** (Lines 22-80)
   - `dummyStudents` - Student list
   - `dummySeats` - Seat availability
   - `dummyFees` - Fee records

3. **State Management** (Lines 82-100)
   - `currentPage` - Current active page
   - `loggedIn` - User login status
   - `userType` - 'admin' or 'student'
   - `currentStudentId` - If student is logged in

4. **Main Routing** (Lines 102-130)
   - `render()` - Main function that shows correct page
   - `renderLoginSelection()` - Choose Admin/Student
   - `selectLoginType()` - Set user type

5. **Login Pages** (Lines 132-200)
   - `renderLogin()` - Admin/Student login form

6. **Admin Dashboard** (Lines 202-280)
   - `renderLayout()` - Admin sidebar + content
   - `renderPageContent()` - Show selected page
   - `renderDashboard()` - Dashboard stats

7. **Student Dashboard** (Lines 282-380)
   - `renderStudentLayout()` - Student view
   - `renderStudentPageContent()` - Student info

8. **Other Pages** (Lines 382+)
   - `renderStudents()` - Student management
   - `renderSeats()` - Seat allocation
   - `renderFees()` - Fee management
   - `renderReports()` - Reports view

## 🚀 How It Works

1. **User opens app** → `render()` is called
2. **User chooses Admin/Student** → `selectLoginType()` updates `userType`
3. **User logs in** → `loggedIn = true`
4. **App shows dashboard** → `render()` displays correct page
5. **User clicks menu** → `currentPage` changes → `render()` shows new content

## 📝 Key Variables

```javascript
loggedIn; // true/false - is user logged in?
userType; // 'admin' or 'student'
currentPage; // which page to show
currentStudentId; // which student (if student logged in)
```

## 🔑 Login Credentials

**Admin:**

- Username: `admin`
- Password: `admin123`

**Students:**

- Phone/Aadhaar: `9876543210` → Password: `9876543210`
- Phone/Aadhaar: `9123456780` → Password: `9123456780`

## 🎨 File in HTML

```html
<div id="app"></div>
<!-- All content goes here -->

<!-- Bootstrap CSS -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
/>

<!-- Font Awesome Icons -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>

<!-- Custom Styles -->
<link rel="stylesheet" href="assets/styles.css" />

<!-- Our App -->
<script src="assets/app.js"></script>
```

## 🎯 Main Pages

1. **Login Page** - Admin/Student selection
2. **Dashboard** - Stats & overview
3. **Student Management** - Add/view students
4. **Seat Management** - Assign seats
5. **Fee Management** - Track payments
6. **Reports** - Summary statistics

## 🔄 Page Flow

```
Start
  ↓
Choose Login Type (Admin/Student)
  ↓
Enter Username/Password
  ↓
Success? Yes → Show Dashboard
  ↓
Select from Menu
  ↓
View/Edit Data
  ↓
Logout → Back to Login
```

---

**Notes:**

- All data is **temporary** (refreshing page resets)
- No backend/database needed
- Uses **Bootstrap 5** for responsive design
- **Dark mode** saves to localStorage
