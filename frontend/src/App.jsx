import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { CameraProvider } from './context/CameraContext';
import { isAuthenticated } from './services/authService'; // Move this import here

// Lazy load pages instead of direct imports
const HomePage = lazy(() => import('./Pages/HomePage'));
const ProductListingPage = lazy(() => import('./Pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./Pages/ProductDetailPage'));
const BookAppointmentPage = lazy(() => import('./Pages/BookAppointmentPage'));
const ContactUsPage = lazy(() => import('./Pages/ContactUsPage'));
const AdminDashboard = lazy(() => import('./Pages/Admin/Dashboard'));
const AdminManageAppointments = lazy(() => import('./Pages/Admin/ManageAppointments'));
const AdminManageUsers = lazy(() => import('./Pages/Admin/ManageUsers'));
const LoginPage = lazy(() => import('./Pages/LoginPage'));
const RegisterPage = lazy(() => import('./Pages/RegisterPage'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage'));
const Chat = lazy(() => import('./components/Chat'));
const FeedbackPage = lazy(() => import('./Pages/FeedbackPage'));
const AdminChatPage = lazy(() => import('./Pages/Admin/AdminChatPage'));
const ManageFeedbackPage = lazy(() => import('./Pages/Admin/ManageFeedbackPage'));
const AdminCreateProduct = lazy(() => import('./Pages/Admin/AdminCreateProduct'));
const AdminManageProducts = lazy(() => import('./Pages/Admin/ManageProducts'));
const FavoritesPage = lazy(() => import('./Pages/FavoritesPage'));

const App = () => {
  return (
    <CameraProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} />
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductListingPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              {/* Protected Routes */}
              <Route path="book-appointment" element={
                <ProtectedRoute>
                  <BookAppointmentPage />
                </ProtectedRoute>
              } />
              <Route path="contact" element={<ContactUsPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="feedback" element={
                <ProtectedRoute>
                  <FeedbackPage />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
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
              <Route path="products" element={<AdminManageProducts />} />
              <Route path="products/create" element={<AdminCreateProduct />} />
            </Route>
          </Routes>
        </Suspense>
        
        {/* Only show Chat for authenticated users */}
        {isAuthenticated() && <Chat />}
      </Router>
    </CameraProvider>
  );
};

export default App;