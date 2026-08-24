# Library Management System

A full-stack Library Management System built with React.js, Node.js, Express.js, and MongoDB (Localhost).

## User Roles & Capabilities

### 🔑 Admin Capabilities (Complete Administrative Control)

**Authentication & Profile Management:**
- Admin logs in using pre-configured credentials from environment variables (admin@library.com)
- Admin profile is managed through environment settings, not database
- Admin can view their profile information
- Admin can logout securely

**Book Management (Complete CRUD Operations):**
- Admin can create new books with cover image upload to Cloudinary
- Admin can view all books in the library with search and filter options
- Admin can update book details including title, description, category, language, and copies
- Admin can delete books (only if not currently borrowed by any student)
- Admin can view detailed statistics of all books in the system

**Student Management:**
- Admin can view all registered students in the system
- Admin can view individual student profiles and details
- Admin can delete student accounts from the system
- Admin can track student borrowing history and current status

**Borrowing System Oversight:**
- Admin can view all borrowed books across all students
- Admin can see which student borrowed which book and when
- Admin can track overdue books and identify late returns
- Admin can monitor return dates and borrowing patterns
- Admin receives complete borrowing statistics and analytics

**Dashboard & Analytics:**
- Admin gets comprehensive dashboard with key metrics
- Total books count and available copies tracking
- Currently borrowed books statistics
- Total registered students count
- Overdue books monitoring and alerts
- Books categorized by type for inventory management
- Recent borrowing activity trends (last 7 days)

### 📚 Student Capabilities (Library User Functions)

**Authentication & Profile Management:**
- Students can register new accounts with email verification
- Students can login with email and password
- Students can view and manage their own profile
- Students can request password reset via email
- Students can logout securely

**Book Discovery & Browsing:**
- Students can browse all available books in the library
- Students can search books by title with keyword matching
- Students can filter books by category and language
- Students can view detailed information about each book
- Students can see real-time availability status of books

**Borrowing System:**
- Students can borrow available books (when copies are available)
- Students can set custom due dates or use default 14-day period
- Students are prevented from borrowing unavailable books
- System automatically updates book availability upon borrowing

**Return System:**
- Students can return their borrowed books
- Students can only return books they personally borrowed
- System prevents returning already returned books
- System automatically updates book availability upon return

**Personal Library Management:**
- Students can view all their currently borrowed books
- Students can see their complete borrowing history
- Students can track due dates for their borrowed books
- Students can identify which books are overdue

**Dashboard & Personal Analytics:**
- Students get personalized dashboard with their statistics
- Currently borrowed books count and details
- Overdue books tracking and notifications
- Total borrowing history across all time
- Recently borrowed books (last 30 days activity)
- Returned books count and punctuality tracking
- Available books count in the entire library system

## Tech Stack

**Frontend:**
- React.js 19 + Vite
- Tailwind CSS 4
- Axios for API calls
- React Router for navigation
- React Hot Toast for notifications
- Lucide React for icons

**Backend:**
- Node.js
- Express.js
- MongoDB (Local)
- JWT Authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Nodemailer for emails
- Multer for file uploads

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v16 or later)
- MongoDB (Local installation)
- Git

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Library_Management_System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
FRONTEND_URL=http://localhost:5174

# MongoDB - LOCAL ONLY
MONGO_URI=mongodb://localhost:27017/library_management_local

JWT_SECRET_KEY=my_secret_key_123

# Admin Credentials
ADMIN_EMAIL=admin@library.com
ADMIN_PASSWORD=Admin@123456

# Mailtrap SMTP Credentials (for email functionality)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
MAILTRAP_FROM_EMAIL=noreply@library.com

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Frontend `.env` file already configured:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_BASE_URL=http://localhost:5000/api
```

### 4. Database Setup
Make sure MongoDB is running locally on your machine:
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or use MongoDB Compass to connect to localhost:27017
```

## Running the Application

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5174`

## Default Admin Login
- Email: `admin@library.com`
- Password: `Admin@123456`

## Complete API Endpoints Guide

### 🔐 Authentication Endpoints

#### Register Student Account
```http
POST /api/auth/register
```
**Purpose:** Create new student account  
**Access:** Public (anyone can register)  
**Required Body:**
```json
{
  "name": "Student Name",
  "email": "student@example.com", 
  "password": "securePassword123"
}
```
**Usage:** Students use this to create their library account

---

#### User Login (Admin & Students)
```http
POST /api/auth/login
```
**Purpose:** Login for both admin and students  
**Access:** Public  
**Required Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Admin Login:** Use `admin@library.com` / `Admin@123456`  
**Student Login:** Use registered student credentials

---

#### Get Current User Profile
```http
GET /api/auth/me
```
**Purpose:** Get logged-in user's profile information  
**Access:** Authenticated users only  
**Headers:** `Authorization: Bearer <token>`  
**Usage:** Check if user is logged in and get their details

---

#### User Logout
```http
POST /api/auth/logout
```
**Purpose:** Logout current user and clear session  
**Access:** Authenticated users only  
**Usage:** Securely logout from the system

---

#### Forgot Password
```http
POST /api/auth/forgot-password
```
**Purpose:** Send password reset email to user  
**Access:** Public  
**Required Body:**
```json
{
  "email": "user@example.com"
}
```
**Usage:** When student forgets password, they get reset email

---

#### Reset Password
```http
POST /api/auth/reset-password/:token
```
**Purpose:** Reset password using email token  
**Access:** Public (with valid token)  
**Required Body:**
```json
{
  "password": "newSecurePassword123"
}
```
**Usage:** Student clicks email link and sets new password

---

### 📖 Book Management Endpoints

#### Get All Books (Browse Library)
```http
GET /api/books
```
**Purpose:** Browse all books with search and filters  
**Access:** All authenticated users  
**Query Parameters:**
- `keyword` - Search by book title
- `category` - Filter by book category  
- `language` - Filter by book language
- `available=true` - Show only available books
- `available=false` - Show only unavailable books

**Example:** `/api/books?keyword=javascript&category=programming&available=true`  
**Usage:** Students browse books, Admin manages inventory

---

#### Get Single Book Details
```http
GET /api/books/:id
```
**Purpose:** Get detailed information about specific book  
**Access:** All authenticated users  
**Usage:** View book details before borrowing or for information

---

#### Create New Book (Admin Only)
```http
POST /api/books
```
**Purpose:** Add new book to library with image upload  
**Access:** Admin only  
**Content-Type:** `multipart/form-data`  
**Required Fields:**
- `title` - Book title
- `description` - Book description
- `category` - Book category
- `language` - Book language (default: English)
- `totalCopies` - Number of copies
- `coverImage` - Book cover image file

**Usage:** Admin adds new books to the library system

---

#### Update Book Details (Admin Only)
```http
PUT /api/books/:id
```
**Purpose:** Update existing book information  
**Access:** Admin only  
**Content-Type:** `multipart/form-data`  
**Optional Fields:** Same as create, update only provided fields  
**Usage:** Admin edits book information or replaces cover image

---

#### Delete Book (Admin Only)
```http
DELETE /api/books/:id
```
**Purpose:** Remove book from library  
**Access:** Admin only  
**Restriction:** Cannot delete books currently borrowed by students  
**Usage:** Admin removes outdated or damaged books

---

#### Get Book Statistics (Admin Only)
```http
GET /api/books/stats
```
**Purpose:** Get comprehensive library statistics  
**Access:** Admin only  
**Returns:**
- Total books count
- Available books count  
- Currently borrowed count
- Total students
- Overdue books count
- Books by category breakdown
- Recent borrowing trends

**Usage:** Admin dashboard analytics and reporting

---

### 📚 Borrowing System Endpoints

#### Borrow a Book (Students Only)
```http
POST /api/borrow/:bookId
```
**Purpose:** Student borrows an available book  
**Access:** Students only  
**Required Body:**
```json
{
  "dueDate": "2024-03-15" // Optional, defaults to 14 days
}
```
**Restrictions:** 
- Book must be available (availableCopies > 0)
- Only students can borrow books

**Usage:** Student borrows book from library

---

#### Return Borrowed Book (Students Only)
```http
POST /api/borrow/return
```
**Purpose:** Student returns their borrowed book  
**Access:** Students only  
**Required Body:**
```json
{
  "borrowId": "507f1f77bcf86cd799439011"
}
```
**Restrictions:**
- Can only return own borrowed books
- Cannot return already returned books

**Usage:** Student returns book to library

---

#### Get My Borrowed Books (Students Only)
```http
GET /api/borrow/my
```
**Purpose:** Student views their borrowing history  
**Access:** Students only  
**Returns:** All books borrowed by logged-in student (current & past)  
**Usage:** Student tracks their borrowed books and due dates

---

#### Get All Borrowing Records (Admin Only)
```http
GET /api/borrow/all
```
**Purpose:** Admin views all borrowing activity  
**Access:** Admin only  
**Returns:** Complete borrowing records across all students  
**Usage:** Admin monitors all library borrowing activity

---

#### Get Overdue Books (Admin Only)
```http
GET /api/borrow/overdue
```
**Purpose:** Admin views all overdue books  
**Access:** Admin only  
**Returns:** Books not returned by due date  
**Usage:** Admin tracks late returns and sends reminders

---

#### Get Student Dashboard Stats (Students Only)
```http
GET /api/borrow/dashboard
```
**Purpose:** Student's personal library statistics  
**Access:** Students only  
**Returns:**
- Currently borrowed books count
- Overdue books count
- Total borrowing history
- Returned books count
- Recent activity (30 days)
- Available books in library

**Usage:** Student dashboard showing personal stats

---

### 👥 Student Management Endpoints (Admin Only)

#### Get All Students
```http
GET /api/admin/students
```
**Purpose:** Admin views all registered students  
**Access:** Admin only  
**Returns:** List of all students with their details  
**Usage:** Admin manages student accounts and monitors users

---

#### Get Single Student Details  
```http
GET /api/admin/students/:id
```
**Purpose:** Admin views specific student's profile  
**Access:** Admin only  
**Returns:** Detailed student information  
**Usage:** Admin checks individual student details

---

#### Delete Student Account
```http
DELETE /api/admin/students/:id
```
**Purpose:** Admin removes student from system  
**Access:** Admin only  
**Usage:** Admin deletes inactive or problematic student accounts

---

## 🔑 Authentication Requirements

**For Admin Endpoints:** Use admin credentials (`admin@library.com` / `Admin@123456`)  
**For Student Endpoints:** Use registered student credentials  
**Token Usage:** Include `Authorization: Bearer <token>` header for authenticated requests

## Project Structure
```
Library_Management_System/
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.js         # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utility functions
│   │   └── App.jsx      # Main App component
│   └── public/          # Static assets
└── README.md
```

## React + Vite Setup (Frontend)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Troubleshooting

1. **MongoDB Connection Issues:**
   - Make sure MongoDB is running locally
   - Check if the port 27017 is available
   - Verify the MONGO_URI in .env file

2. **CORS Issues:**
   - Make sure frontend URL matches in backend CORS configuration
   - Check if both servers are running on correct ports

3. **Authentication Issues:**
   - Clear browser cookies and localStorage
   - Check JWT_SECRET_KEY in .env file

4. **Image Upload Issues:**
   - Verify Cloudinary credentials in .env file
   - Check internet connection for Cloudinary uploads

## License

This project is licensed under the MIT License.
