import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { CameraProvider } from './context/CameraContext'; 
import HomePage from './Pages/HomePage';
import ProductListingPage from './Pages/ProductListingPage';
import ProductDetailPage from './Pages/ProductDetailPage';
import BookAppointmentPage from './Pages/BookAppointmentPage';
import ContactUsPage from './Pages/ContactUsPage';
import AdminDashboard from './Pages/Admin/Dashboard';
import AdminManageAppointments from './Pages/Admin/ManageAppointments';
import AdminManageUsers from './Pages/Admin/ManageUsers';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ProfilePage from './Pages/ProfilePage'; // Add this import
import Chat from './components/Chat';
import FeedbackPage from './Pages/FeedbackPage';
import AdminChatPage from './Pages/Admin/AdminChatPage';
import ManageFeedbackPage from './Pages/Admin/ManageFeedbackPage';
import AdminCreateProduct from './Pages/Admin/AdminCreateProduct';
import AdminManageProducts from './Pages/Admin/ManageProducts'; // Add this import
import FavoritesPage from './Pages/FavoritesPage'; // Add import at the top

const App = () => {
  return (
    <CameraProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductListingPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="book-appointment" element={<BookAppointmentPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            
            {/* Add Protected Profile Route */}
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            {/* Add this route with the other protected routes */}
            <Route path="favorites" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
          </Route>
          
          <Route path="/admin" element={
            <AdminRoute>
              <Layout admin={true} />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminManageAppointments />} />
            <Route path="users" element={<AdminManageUsers />} />
            <Route path="chat" element={<AdminChatPage />} />
            <Route path="feedback" element={<ManageFeedbackPage />} />
            <Route path="products" element={<AdminManageProducts />} /> {/* Add this line */}
            <Route path="products/create" element={<AdminCreateProduct />} />
          </Route>
        </Routes>
        
        <Chat />
      </Router>
    </CameraProvider>
  );
};

export default App;