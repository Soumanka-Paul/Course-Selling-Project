# 🎓 Course Selling Platform (MERN Stack)

> A full-stack MERN application enabling users to purchase courses and admins to manage content and verify UPI-based payments with secure authentication.

---

## 🧠 Project Type

Full Stack Web Application | MERN | Authentication | Admin Dashboard

---

## 🚀 Overview

A full-stack **Course Selling Web Application** where users can explore and purchase courses, and admins can manage courses and verify payments.

This project demonstrates real-world concepts like **authentication, role-based access control, payment workflow, and cloud integration**, making it highly relevant for campus placements.

---

## 🛠️ Tech Stack (MERN)

### 💻 Frontend

* React.js (Vite)
* Tailwind CSS

### 🌐 Backend

* Node.js
* Express.js

### 🗄️ Database

* MongoDB

### 🔐 Authentication

* JWT (JSON Web Token)
* Cookie-based session handling

### ☁️ Cloud

* Cloudinary (media upload & storage)

---

## ✨ Features

### 👤 User

* 🔍 Browse and explore courses
* 🎥 Watch course preview videos
* 💳 Purchase courses via UPI
* 📦 Access purchased courses
* 🔐 Secure authentication system

---

### 🛠️ Admin Panel

* ➕ Create new courses
* ✏️ Edit course details
* ❌ Delete courses
* 👀 View user payment submissions
* ✅ Verify / ❌ Reject payments
* 📊 Manage platform content

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* Tokens stored in HTTP-only cookies
* Middleware-based route protection
* Role-based access control (User / Admin)

---

## 💳 Payment Workflow

1. User selects a course
2. Makes payment via UPI
3. Submits payment proof
4. Admin reviews payment
5. Access granted or rejected

---

## 🔗 API Highlights

* Auth APIs (Login / Register / Logout)
* Course APIs (Create, Update, Delete, Fetch)
* Payment APIs (Submit payment, Verify/Reject)
* Protected routes using middleware

---

## 📁 Project Structure

```
Course-Selling-Project/
│
├── backend/
│   ├── controllers/     
│   ├── middleware/      
│   ├── models/          
│   ├── routes/          
│   ├── .env             
│   ├── index.js         
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/       
│   │   ├── assets/      
│   │   ├── components/  
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles       
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/Soumanka-Paul/Course-Selling-Project.git
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
```

---

### 4️⃣ Environment Variables (.env)

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 5️⃣ Run the Application

#### Start Backend

```
npm run dev
```

#### Start Frontend

```
npm run dev
```

---

## 📌 Key Highlights

* Developed a full-stack MERN application with real-world architecture
* Implemented secure authentication using JWT and HTTP-only cookies
* Designed role-based access control (User & Admin)
* Built a manual UPI payment verification workflow
* Integrated Cloudinary for media storage
* Followed MVC pattern for scalable backend
* Created responsive UI using Tailwind CSS

---

## 👨‍💻 Author

**Soumanka Paul**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
