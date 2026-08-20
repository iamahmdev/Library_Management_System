# 📚 Library Management System

A comprehensive Library Management System built with **Node.js**, **Express**, **MongoDB**, **React**, and **Vite**. This system provides complete authentication functionality including login, registration, password reset, and email notifications.

## 🚀 Features

### Authentication System
- ✅ **User Registration** (Students)
- ✅ **User Login** (Admin & Students)
- ✅ **Forgot Password** with email reset links
- ✅ **Password Reset** with token verification
- ✅ **JWT Authentication** with HTTP-only cookies
- ✅ **Admin Panel** access
- ✅ **Student Dashboard** access
- ✅ **HTML Email Templates** with Roboto font
- ✅ **Email Service** integration (Mailtrap)

### Security Features
- ✅ **Password Hashing** (bcryptjs)
- ✅ **JWT Tokens** with 7-day expiry
- ✅ **CORS Protection**
- ✅ **Input Validation**
- ✅ **Secure Cookie Configuration**

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - File upload service
- **Multer** - File handling middleware

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Styling (custom design)

---

## 📁 Project Structure

```
Library_Management_System/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js  # Authentication logic
│   │   ├── book.controller.js
│   │   └── borrow.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── multer.js          # File upload middleware
│   ├── models/
│   │   ├── book.model.js
│   │   ├── borrow.model.js
│   │   └── user.model.js      # User schema
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js     # Authentication routes
│   │   ├── book.routes.js
│   │   └── borrow.routes.js
│   ├── utils/
│   │   ├── generateToken.js   # JWT token generation
│   │   └── sendEmail.js       # Email service
│   ├── .env                   # Environment variables
│   ├── .env.example          # Environment template
│   ├── index.js              # Server entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/           # Static assets
    │   ├── components/       # Reusable components
    │   ├── context/
    │   │   └── AppContext.jsx # Global state management
    │   ├── pages/
    │   │   └── Auth/         # Authentication pages
    │   │       ├── Login.jsx
    │   │       ├── Register.jsx
    │   │       ├── ForgotPassword.jsx
    │   │       └── ResetPassword.jsx
    │   ├── utils/
    │   │   └── axiosInstance.jsx # HTTP client setup
    │   ├── App.jsx          # Main app component
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Global styles
    ├── .env                 # Frontend environment variables
    ├── vite.config.js       # Vite configuration
    └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd Library_Management_System
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configure Backend Environment (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:5174
MONGO_URI=mongodb://localhost:27017/dbahmad
JWT_SECRET_KEY=your_jwt_secret_key_here

# Admin Credentials
ADMIN_EMAIL=admin@library.com
ADMIN_PASSWORD=Admin@123456

# Mailtrap SMTP Credentials
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
MAILTRAP_FROM_EMAIL=noreply@library.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 3. Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install
```

#### Configure Frontend Environment (.env)
```env
VITE_BASE_URL=http://localhost:5000/api
```

### 4. Database Setup

Ensure MongoDB is running locally or configure Atlas connection in backend `.env`

### 5. Start Application

```bash
# Terminal 1: Start Backend
cd backend
npm run start

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

**Application URLs:**
- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:5000`

---

## 🔐 Authentication Flow

### 1. Login Process
- **Admin Login:** Use credentials from `.env` file
- **Student Login:** Must register first or use existing account
- **JWT Token:** Stored in HTTP-only cookie (7-day expiry)
- **Success:** Shows success message (no redirect for now)

### 2. Registration Process
- **Student Registration:** Name, Email, Password required
- **Password Hashing:** bcryptjs with salt rounds 10
- **Success:** Redirects to `/login` page

### 3. Forgot Password Process
- **Email Required:** Must be registered user
- **Token Generation:** 32-byte random hex token
- **Token Hashing:** SHA256 hashed and stored in database
- **Email Sent:** HTML template with reset link
- **Expiry:** 15 minutes token validity

### 4. Password Reset Process
- **Token Verification:** Extracted from URL parameters
- **New Password:** Minimum 6 characters required
- **Success:** Redirects to `/login` page

---

## 📧 Email Configuration

### Mailtrap Setup
1. Create account at [Mailtrap.io](https://mailtrap.io)
2. Get SMTP credentials from inbox settings
3. Update backend `.env` with credentials
4. Test with forgot password functionality

### Email Templates
- **HTML Support:** Full HTML email templates
- **Styling:** Inline CSS with Roboto font
- **Responsive:** Mobile-friendly design
- **Branding:** Custom library management branding

---

## 🎨 UI/UX Design

### Design System
- **Framework:** Custom Tailwind-like classes
- **Colors:** Indigo primary (#4f46e5)
- **Typography:** System fonts with good readability
- **Components:** Consistent form design across all auth pages
- **Responsive:** Mobile-first responsive design

### Page Structure
All authentication pages follow the same structure:
- **Header:** Logo and title
- **Form Card:** Input fields and submit button
- **Footer:** Additional links and branding
- **Notifications:** Toast messages for feedback

---

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register           # Student registration
POST   /login              # User login (admin/student)
POST   /logout             # User logout
POST   /forgot-password    # Send reset email
POST   /reset-password/:token # Reset password with token
GET    /me                 # Get current user profile
```

### Admin Routes (`/api/admin`)
```
# Additional admin endpoints (configured but not detailed)
```

### Book Routes (`/api/books`)
```
# Book management endpoints (configured but not detailed)
```

### Borrow Routes (`/api/borrow`)
```
# Book borrowing endpoints (configured but not detailed)
```

---

## 👤 User Roles & Access

### Admin Access
- **Email:** `admin@library.com`
- **Password:** `Admin@123456`
- **Dashboard:** `/admin/dashboard`
- **Privileges:** Full system access

### Student Access
- **Registration:** Required through `/register`
- **Dashboard:** `/student`
- **Privileges:** Limited to student functions

---

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem:** Access blocked by CORS policy
**Solution:** 
- Ensure backend allows frontend URL in CORS
- Check ports match in configuration
- Restart backend after CORS changes

#### 2. Database Connection
**Problem:** MongoDB connection failed
**Solution:**
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure database name is correct

#### 3. Email Not Sending
**Problem:** Reset emails not delivered
**Solution:**
- Verify Mailtrap credentials
- Check email configuration in `.env`
- Review backend logs for email errors

#### 4. JWT Token Issues
**Problem:** Authentication not working
**Solution:**
- Verify JWT secret in `.env`
- Check cookie settings
- Clear browser cookies

#### 5. Frontend Not Loading
**Problem:** Vite development server issues
**Solution:**
- Check port availability (5174)
- Clear node_modules and reinstall
- Verify .env configuration

---

## 📝 Development Notes

### Code Structure
- **Consistent Patterns:** All auth pages follow same structure
- **Error Handling:** Comprehensive try-catch blocks
- **Validation:** Both frontend and backend validation
- **Security:** Secure coding practices implemented

### Authentication Strategy
- **JWT Tokens:** Stored in HTTP-only cookies
- **Password Security:** bcryptjs hashing
- **Token Expiry:** 7-day validity with refresh capability
- **CORS Security:** Configured for specific origins

### Email System
- **HTML Templates:** Professional email design
- **Fallback Support:** Plain text alternative
- **Token Security:** Hashed tokens with expiry
- **Error Handling:** Graceful email delivery failures

---

## 🚀 Deployment Considerations

### Environment Variables
- Update `FRONTEND_URL` for production domain
- Use secure JWT secrets (64+ characters)
- Configure production email service (not Mailtrap)
- Set secure cookie options for HTTPS

### Security Checklist
- [ ] Strong JWT secret key
- [ ] HTTPS in production
- [ ] Secure cookie settings
- [ ] Input sanitization
- [ ] Rate limiting (recommended)
- [ ] Environment variable security

---

## 👥 Team Information

This project demonstrates a complete authentication system implementation with modern web technologies. The codebase follows best practices for:

- **Security:** Password hashing, JWT tokens, CORS protection
- **User Experience:** Intuitive UI, proper error messages, email notifications
- **Code Quality:** Consistent structure, error handling, documentation
- **Scalability:** Modular architecture, reusable components

---

## 📄 License

This project is for educational and demonstration purposes.

---

**For any questions or issues, refer to the troubleshooting section or check the backend logs for detailed error information.**