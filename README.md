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

## Complete API Documentation

### 🔐 Authentication Endpoints
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `POST` | `/api/auth/register` | Register new student account | Public |
| `POST` | `/api/auth/login` | Login for both admin and students | Public |
| `POST` | `/api/auth/logout` | Logout current user | Authenticated |
| `GET` | `/api/auth/me` | Get current user profile | Authenticated |
| `POST` | `/api/auth/forgot-password` | Send password reset email | Public |
| `POST` | `/api/auth/reset-password/:token` | Reset password with token | Public |

### 📖 Book Management Endpoints
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `GET` | `/api/books` | Get all books (with search/filter) | All Users |
| `GET` | `/api/books/:id` | Get single book details | All Users |
| `POST` | `/api/books` | Create new book with image upload | Admin Only |
| `PUT` | `/api/books/:id` | Update book details | Admin Only |
| `DELETE` | `/api/books/:id` | Delete book (if not borrowed) | Admin Only |
| `GET` | `/api/books/stats` | Get complete book statistics | Admin Only |

### 📚 Borrowing System Endpoints
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `POST` | `/api/borrow/:bookId` | Borrow a book | Students Only |
| `POST` | `/api/borrow/return` | Return borrowed book | Students Only |
| `GET` | `/api/borrow/my` | Get my borrowed books | Students Only |
| `GET` | `/api/borrow/all` | Get all borrowing records | Admin Only |
| `GET` | `/api/borrow/overdue` | Get all overdue books | Admin Only |
| `GET` | `/api/borrow/dashboard` | Get student dashboard stats | Students Only |

### 👥 Student Management Endpoints  
| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `GET` | `/api/admin/students` | Get all registered students | Admin Only |
| `GET` | `/api/admin/students/:id` | Get single student details | Admin Only |
| `DELETE` | `/api/admin/students/:id` | Delete student account | Admin Only |

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
