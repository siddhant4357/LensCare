import React, { useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const AdminHeader = ({ toggleSidebar, pageTitle }) => {
  const user = getCurrentUser();
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side - Toggle & Title */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 mr-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{pageTitle || 'Dashboard'}</h1>
              <p className="text-sm text-gray-500 hidden md:block">Welcome back, {user?.name || 'Admin'}</p>
            </div>
          </div>
          
          {/* Right Side - User Profile & Quick Actions */}
          <div className="flex items-center gap-3">
           
            
           
            
            {/* User Profile */}
            <Link to="/profile" className="flex items-center ml-2">
              <div className="hidden md:block mr-3 text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@lenscare.com'}</p>
              </div>
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture.startsWith('http') 
                    ? user.profilePicture 
                    : getImageUrl(user.profilePicture)}
                  alt={user?.name} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              )}
            </Link>
            
            {/* Visit Site */}
            <Link to="/" className="hidden md:block ml-3 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium">
              Visit Site
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;