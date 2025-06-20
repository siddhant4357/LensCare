import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const Layout = () => {
  const location = useLocation();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  // Set page title based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin') setPageTitle('Dashboard');
    else if (path.includes('/admin/products')) setPageTitle('Product Management');
    else if (path.includes('/admin/users')) setPageTitle('User Management');
    else if (path.includes('/admin/appointments')) setPageTitle('Appointments');
    else if (path.includes('/admin/chat')) setPageTitle('Customer Chat');
    else if (path.includes('/admin/feedback')) setPageTitle('Customer Feedback');
    else setPageTitle('Admin Panel');
    
    setIsAdminRoute(path.startsWith('/admin'));
    
    // Auto-close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // For admin routes, use a dedicated layout
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        
        <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className={`transition-all duration-300 lg:ml-72 ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <AdminHeader toggleSidebar={toggleSidebar} pageTitle={pageTitle} />
          <div className="min-h-[calc(100vh-64px)] p-4 md:p-6 lg:p-8 pt-20 lg:pt-24">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  // For regular routes, use the standard layout
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;