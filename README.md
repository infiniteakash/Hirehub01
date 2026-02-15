# HireHub – Modern MERN Job Portal

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

## 🚀 Project Overview
HireHub is a modern Job Portal platform built with the MERN stack. It streamlines hiring by helping candidates discover roles quickly while enabling recruiters to post and manage job listings with ease. The platform focuses on speed, clarity, and a clean UX to deliver a production-ready experience.

**Problem solved:** Fragmented job discovery and slow hiring workflows.  
**Target audience:** Job seekers, recruiters, and hiring teams.  
**Key goals:** Fast discovery, simple applications, secure access, and scalable architecture.

## ✨ Features

### 👤 User Features
- Register / Login
- Browse and search jobs
- Apply for jobs
- Save jobs
- Search and filters

### 🏢 Recruiter Features
- Post jobs
- Manage listings
- View applicants

### 🛠 Admin Features
- Approve jobs
- Manage users

## 🧱 Tech Stack

### Frontend
- React.js
- TailwindCSS
- Axios
- React Router
- Redux Toolkit

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt

## 📂 Folder Structure

### Backend
```
/controllers
/models
/routes
/middleware
/config
/utils
```

### Frontend
```
/components
/pages
/context
/hooks
/services
/layouts
```

## ⚙️ Installation & Setup

### 1) Clone the repository
```
git clone https://github.com/your-username/jobportal-yt-main.git
cd jobportal-yt-main
```

### 2) Install dependencies
```
cd backend
npm install

cd ../frontend
npm install
```

### 3) Environment variables
Create a .env file in backend:
```
PORT=8002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create a .env file in frontend (if using env-based API URL):
```
VITE_API_URL=http://localhost:8002
```

### 4) Run the project
```
# backend
cd backend
npm run dev

# frontend
cd ../frontend
npm run dev
```

## 🔐 Environment Variables Explained
- PORT: Port for the backend server.
- MONGO_URI: MongoDB connection string.
- JWT_SECRET: Secret key used for signing tokens.
- VITE_API_URL: Base URL for frontend API requests.

## 🗄 Database Schema Overview
- **User**: Auth credentials, role, profile data.
- **Job**: Title, description, requirements, salary, type, location, company.
- **Company**: Profile, industry, size, branding, metadata.
- **Application**: Applicant, job, status, timestamps.

## 📡 API Endpoints Overview
- POST /api/v1/user/register
- POST /api/v1/user/login
- GET /api/v1/job/get
- POST /api/v1/job/post
- GET /api/v1/company/get

## 🌍 Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas

Steps:
1. Deploy backend and set environment variables.
2. Deploy frontend and point VITE_API_URL to the backend URL.
3. Ensure CORS allows the frontend domain.

## 🧪 Future Improvements
- Real-time chat between recruiters and candidates
- Notifications and activity feed
- Resume upload + parser
- OAuth login (Google, LinkedIn)
- Payment integration for recruiter plans

## 🤝 Contributing
Contributions are welcome. Please open an issue or submit a pull request.

## 📜 License
MIT License

## 👨‍💻 Author
- Your Name
- GitHub: https://github.com/your-username
- LinkedIn: https://linkedin.com/in/your-profile
