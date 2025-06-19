import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, isAdmin, logout } from '../services/authService';
import { toast } from 'react-toastify';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };
  
  useEffect(() => {
    // Close menus when location changes
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);
  
  // Don't show regular navigation in admin pages
  if (isAdminRoute) {
    return (
      <header className="bg-black text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/admin" className="text-2xl font-bold">
            LensCare Admin
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            LensCare
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          <div className="hidden md:flex items-center space-x-1">
            {/* Desktop Navigation */}
            <nav className="flex space-x-8 mr-8">
              <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
              <Link to="/products" className="hover:text-gray-300 transition-colors">Frames</Link>
              <Link to="/book-appointment" className="hover:text-gray-300 transition-colors">Book Appointment</Link>
              <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact Us</Link>
            </nav>
            
            {/* User Authentication */}
            {isAuthenticated() ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture.startsWith('http') 
                        ? user.profilePicture 
                        : user.profilePicture.startsWith('/') 
                          ? `http://localhost:5000${user.profilePicture}`
                          : `http://localhost:5000/${user.profilePicture}`} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    
                    {isAdmin() && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link to="/favorites" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Favorites
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-white hover:text-gray-300">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-gray-300 transition-colors py-2">Home</Link>
              <Link to="/products" className="hover:text-gray-300 transition-colors py-2">Frames</Link>
              <Link to="/book-appointment" className="hover:text-gray-300 transition-colors py-2">Book Appointment</Link>
              <Link to="/contact" className="hover:text-gray-300 transition-colors py-2">Contact Us</Link>
              
              {isAuthenticated() ? (
                <>
                  <hr className="border-gray-700" />
                  <Link to="/profile" className="hover:text-gray-300 transition-colors py-2">My Profile</Link>
                  {isAdmin() && (
                    <Link to="/admin" className="hover:text-gray-300 transition-colors py-2">Admin Dashboard</Link>
                  )}
                  <Link to="/favorites" className="hover:text-gray-300 transition-colors py-2">My Favorites</Link>
                  <button
                    onClick={handleLogout}
                    className="text-left py-2 text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <hr className="border-gray-700" />
                  <Link to="/login" className="hover:text-gray-300 transition-colors py-2">Log in</Link>
                  <Link to="/register" className="hover:text-gray-300 transition-colors py-2">Sign up</Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;