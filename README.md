# LensCare - Premium Eyewear E-Commerce Platform 👓✨

Experience the future of eyewear shopping with Virtual Try-On, Real-time Support, and a premium curated collection.


## ⚡ Powered by MERN Stack • Virtual Try-On • Real-time Chat ⚡

---

## 🎯 System Overview

LensCare is a modern, full-stack e-commerce platform designed for eyewear enthusiasts. It bridges the gap between online and offline shopping with:

*   **👓 Virtual Try-On**: A webcam-based AR feature allowing users to see how frames look on their face in real-time.
*   **💬 Real-time Support**: Instant chat connectivity between users and admins using Socket.io.
*   **📅 Appointment Booking**: Seamless scheduling for eye checkups with specialists.
*   **🛍️ Premium Shopping Experience**: Filter by shape/price, manage favorites, and secure checkout.
*   **🛡️ Admin Dashboard**: Comprehensive management of products, users, appointments, and support tickets.
*   **☁️ Cloud Native**: Persistent image storage with Cloudinary and scalable deployment on Vercel/Render.

---

## 🚀 Key Features

### 🛍️ User Experience
*   **Responsive Design**: A glassmorphic, mobile-first UI built with React and Tailwind CSS.
*   **Advanced Filtering**: Find the perfect frame by Shape (Aviator, Wayfarer, etc.) and Price range.
*   **Favorites & Wishlist**: Save items for later.
*   **Secure Authentication**: JWT-based login/register with profile management.

### 👓 Virtual Try-On Technology
*   **Webcam Integration**: Uses the browser's MediaStream API to access the user's camera.
*   **Interactive Overlay**: Draggable and resizable frame overlay to adjust the fit perfectly on your face.
*   **Privacy First**: The camera stream is processed locally in the browser and never sent to the server.

### 💬 Real-Time Communication
*   **Live Chat**: Users can ask questions directly to admins.
*   **Admin Chat Panel**: Admins can manage multiple conversations, see online users, and receive real-time notifications.
*   **Socket.io**: Powered by WebSockets for instant message delivery.

### 📅 Service Integration
*   **Book Appointments**: Schedule eye exams directly through the platform.
*   **Status Tracking**: Track the status of your appointments (Pending, Confirmed, Completed).

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 18 + Vite
*   **Styling**: Tailwind CSS (Glassmorphism & Modern UI)
*   **State Management**: React Context API
*   **Routing**: React Router v6
*   **HTTP Client**: Axios
*   **Real-time**: Socket.io Client
*   **Notifications**: React Toastify

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Real-time**: Socket.io
*   **Image Storage**: Cloudinary (Persistent Cloud Storage)
*   **Security**: JWT, Helmet, Express-Rate-Limit, CORS

---

## 🏗️ System Architecture

### High-Level Data Flow
1.  **User Interaction**: User visits Vercel-hosted Frontend.
2.  **API Requests**: Frontend calls Render-hosted Backend API (Axios).
3.  **Real-time Events**: Socket.io establishes WebSocket connection for Chat.
4.  **Database**: Backend queries MongoDB Atlas for data.
5.  **Media**: Images (Frames, Profiles) uploaded/retrieved from Cloudinary.

---

## 🚀 Quick Start

### Prerequisites
*   Node.js 16+
*   MongoDB Atlas URI
*   Cloudinary Account (Name, API Key, Secret)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file in /backend with:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# CLIENT_URL=http://localhost:5173
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# Start Server
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file in /frontend with:
# VITE_API_URL=http://localhost:5000
# VITE_SOCKET_URL=http://localhost:5000

# Start Frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 📦 Deployment Guide

### Backend (Render)
1.  Create a **Web Service** on Render.
2.  Connect your repo.
3.  **Root Directory**: `backend`
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`
6.  **Environment Variables**: Add all variables from your backend `.env`.

### Frontend (Vercel)
1.  Import your repo to Vercel.
2.  **Root Directory**: `frontend`
3.  **Build Command**: `vite build`
4.  **Output Directory**: `dist`
5.  **Environment Variables**:
    *   `VITE_API_URL`: `https://your-backend-app.onrender.com`
    *   `VITE_SOCKET_URL`: `https://your-backend-app.onrender.com`

---

### 4. Preventing Cold Starts (Render)
Render's free tier spins down after 15 minutes of inactivity, causing a 30-60s delay on the next request. To prevent this:
1.  Register for a free account at [cron-job.org](https://cron-job.org).
2.  Create a new Cron Job.
3.  **URL**: `https://<your-backend-url>/api/health` (e.g., `https://lenscare.onrender.com/api/health`)
4.  **Schedule**: Every 14 minutes.
5.  Save. This will keep your backend active.

---

## 📄 License
MIT License - Free for personal and commercial use.

---

🎉 **Made with ❤️ by Siddhant**
