# 📚 Library Management System

A modern, full-stack web application for managing library operations with separate portals for administrators and students.

## 🌟 Features

### 👨‍💼 Admin Portal
- **Dashboard** - Complete statistics and analytics
- **Book Management** - Add, update, delete books with cover images
- **Student Management** - Add, update student accounts
- **Borrowing System** - Track borrowed, returned, and overdue books
- **Reports** - View all library activities and statistics

### 🎓 Student Portal  
- **Personal Dashboard** - View borrowing stats and recent activity
- **Browse Books** - Search and borrow books with custom due dates (1-30 days)
- **My Books** - Modern card-based UI to manage borrowed books
- **Return System** - Easy one-click book return functionality

### 🔐 Authentication
- **Role-based Access** - Separate admin and student interfaces
- **JWT Authentication** - Secure token-based login system
- **Password Reset** - Forgot password functionality with email
- **User Registration** - Account creation for students

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage and management
- **Nodemailer** - Email functionality

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd Library_Management_System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
MONGODB_URI=mongodb://localhost:27017/library
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Start backend server:
```bash
npm start
```
Backend runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in frontend folder:
```env
VITE_BACKEND_URL=http://localhost:5000
```

Start frontend development server:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Send reset email
- `POST /auth/reset-password/:token` - Reset password

### Books (Admin)
- `GET /books` - Get all books
- `POST /books/add` - Add new book
- `PUT /books/update/:id` - Update book
- `DELETE /books/delete/:id` - Delete book
- `GET /books/stats` - Get admin statistics

### Borrowing
- `POST /borrow/borrow` - Borrow a book
- `POST /borrow/return` - Return a book
- `GET /borrow/my` - Get user's borrowed books
- `GET /borrow/dashboard` - Get student statistics
- `GET /borrow/all` - Get all borrowed books (Admin)
- `GET /borrow/overdue` - Get overdue books (Admin)

### Admin
- `GET /admin/students` - Get all students
- `POST /admin/add-student` - Add new student
- `PUT /admin/update-student/:id` - Update student
- `DELETE /admin/delete-student/:id` - Delete student

## 🎯 Key Features

### Real-time Updates
- Automatic data refresh after every operation
- Live statistics updates
- Instant availability changes

### Modern UI/UX
- Responsive design for all devices
- Card-based layouts for better readability
- Color-coded status indicators
- Loading states and error handling

### Smart Due Date System
- Custom due date selection (1-30 days)
- Automatic overdue detection
- Visual overdue indicators

### File Upload
- Book cover image uploads
- Cloudinary integration for image storage
- Fallback icons for books without covers

## 📱 User Interfaces

### Admin Dashboard
- Total books, students, and borrowing statistics
- Recent activities overview
- Quick action buttons
- Comprehensive reporting

### Student Dashboard  
- Personal borrowing statistics
- Recent activity table with status colors
- Clean, intuitive navigation
- Quick access to all features

### Books Management
- Grid-based book browsing
- Advanced search and filtering
- Real-time availability updates
- Smooth borrowing workflow

## 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🌐 Deployment Ready
- Environment-based configuration
- Separate development and production settings
- Ready for cloud deployment (Vercel, Netlify, Heroku)
- MongoDB Atlas compatibility

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- Built with modern web technologies
- Designed for real-world library management
- Focus on user experience and performance
- Complete full-stack implementation

---

**Made with ❤️ for efficient library management**