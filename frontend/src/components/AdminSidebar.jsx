import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout, isAdmin } from '../services/authService';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const AdminSidebar = () => {
  const location = useLocation();
  const [unreadChats, setUnreadChats] = useState(0);
  
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.emit('adminConnected', { 
      adminId: 'sidebar', 
      adminName: 'Admin Sidebar' 
    });
    
    const handleConversations = (conversations) => {
      // Count unread conversations
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
    return location.pathname.startsWith(path) ? 'bg-gray-800 text-white' : 'text-gray-300';
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };
  
  return (
    <div className="bg-gray-900 text-white h-full w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-5">
        <div className="flex items-center mb-8">
          <span className="text-xl font-semibold">LensCare Admin</span>
        </div>
        
        <nav className="space-y-1">
          <Link 
            to="/admin" 
            className={`block px-4 py-2.5 rounded hover:bg-gray-800 transition ${isActive('/admin') && location.pathname === '/admin' ? 'bg-gray-800' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className={`block px-4 py-2.5 rounded hover:bg-gray-800 transition ${isActive('/admin/products')}`}
          >
            Products
          </Link>
          <Link 
            to="/admin/appointments" 
            className={`block px-4 py-2.5 rounded hover:bg-gray-800 transition ${isActive('/admin/appointments')}`}
          >
            Appointments
          </Link>
          <Link 
            to="/admin/users" 
            className={`block px-4 py-2.5 rounded hover:bg-gray-800 transition ${isActive('/admin/users')}`}
          >
            Users
          </Link>
          <Link 
            to="/admin/chat" 
            className={`block px-4 py-2.5 rounded hover:bg-gray-800 transition ${isActive('/admin/chat')} relative`}
          >
            Customer Chat
            {unreadChats > 0 && (
              <span className="absolute right-2 top-2.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadChats > 9 ? '9+' : unreadChats}
              </span>
            )}
          </Link>
          <Link 
            to="/admin/feedback" 
            className={`block px-4 py-2.5 rounded hover:bg-gray-800 transition ${isActive('/admin/feedback')}`}
          >
            Manage Feedback
          </Link>
          <hr className="my-4 border-gray-700" />
          <Link 
            to="/" 
            className="block px-4 py-2.5 rounded hover:bg-gray-800 transition"
          >
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded hover:bg-gray-800 transition text-red-400"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;