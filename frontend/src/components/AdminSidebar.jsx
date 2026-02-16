import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { getImageUrl } from '../utils/imageUrl';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadChats, setUnreadChats] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl);

    socket.emit('adminConnected', {
      adminId: 'sidebar',
      adminName: 'Admin Sidebar'
    });

    const handleConversations = (conversations) => {
      const unreadCount = Object.values(conversations).filter(
        conv => conv.unread
      ).length;

      setUnreadChats(unreadCount);
    };

    socket.on('allConversations', handleConversations);

    return () => {
      socket.off('allConversations', handleConversations);
      socket.disconnect();
    };
  }, []);

  const isActive = (path) => {
    const active = location.pathname.startsWith(path);
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return active;
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/products', label: 'Products', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
    { path: '/admin/appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/admin/users', label: 'Users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/admin/chat', label: 'Customer Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', badge: unreadChats > 0 ? unreadChats : null },
    { path: '/admin/feedback', label: 'Feedback', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  ];

  return (
    <>
      {/* Sidebar for larger screens and mobile when open */}
      <div className={`fixed inset-y-0 left-0 z-40 transition-all duration-300
        ${collapsed ? 'w-20' : 'w-72'} 
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-gradient-to-br from-white to-gray-50 shadow-xl border-r border-gray-200`}>

        <div className="h-full flex flex-col">
          {/* Sidebar Header with Logo */}
          <div className="px-5 py-6 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white relative">
            {/* Close button for mobile - INSIDE HEADER */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden absolute right-5 p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {!collapsed && (
              <Link to="/admin" className="flex items-center space-x-2">
                <img src="/logo.svg" alt="LensCare Admin" className="h-8 w-auto" />
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Admin</span>
              </Link>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${!collapsed ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* User Profile Section */}
          {!collapsed && (
            <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture.startsWith('http')
                      ? user.profilePicture
                      : getImageUrl(user.profilePicture)}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-bold text-gray-600">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 pt-5 pb-4 overflow-y-auto scrollbar-thin">
            <div className="px-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-300 relative 
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <svg
                    className="flex-shrink-0 h-6 w-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {!collapsed && (
                    <span className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="px-3 pb-5 pt-2 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center px-3 py-3 text-sm text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-300"
            >
              <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {!collapsed && <span>Back to Site</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center px-3 py-3 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300"
            >
              <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger menu button - only visible on mobile when sidebar is closed */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-black text-white hover:bg-gray-800 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
};

export default AdminSidebar;