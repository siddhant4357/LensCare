import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, isAdmin, logout } from '../services/authService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUrl';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminRoute) {
    return (
      <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-2xl border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/admin" className="text-3xl font-black tracking-tight hover:scale-105 transition-transform duration-300">
            <span className="text-white">Lens</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">Care</span>
            <span className="text-sm font-normal ml-2 text-gray-400">Admin</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
      ? 'bg-black/95 backdrop-blur-lg shadow-2xl border-b border-gray-800/50'
      : 'bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl border-b border-gray-800'
      }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
        <div className="absolute top-2 right-10 transform rotate-12">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor" className="text-white">
            <path d="M10 10a7.5 7.5 0 0 1 15 0 7.5 7.5 0 0 1 15 0M2.5 10h5M32.5 10h5M17.5 10h5" />
          </svg>
        </div>
        <div className="absolute top-6 left-1/4 transform -rotate-45">
          <svg width="30" height="15" viewBox="0 0 30 15" fill="currentColor" className="text-white">
            <path d="M7.5 7.5a5 5 0 0 1 10 0 5 5 0 0 1 10 0M2.5 7.5h5M22.5 7.5h5M12.5 7.5h5" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          {/* Logo */}
          <Link to="/" className="relative group">
            <div className="text-3xl font-black tracking-tight transform transition-all duration-300 group-hover:scale-110">
              <span className="text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                Lens
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white animate-pulse">
                Care
              </span>
            </div>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-500"></div>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all duration-300 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 group-hover:bg-gray-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
              <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 group-hover:bg-gray-300 top-3 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 group-hover:bg-gray-300 ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
            </div>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {/* Desktop Navigation */}
            <nav className="flex space-x-8">
              {[
                { path: '/', label: 'Home', icon: '🏠' },
                { path: '/products', label: 'Frames', icon: '👓' },
                { path: '/book-appointment', label: 'Book Appointment', icon: '📅' },
                { path: '/contact', label: 'Contact Us', icon: '📞' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 font-semibold transition-all duration-300 hover:text-white group rounded-lg hover:bg-white/10 ${location.pathname === item.path ? 'text-white bg-white/10' : 'text-gray-300'
                    }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-500 ${location.pathname === item.path ? 'w-full' : ''
                    }`}></div>
                </Link>
              ))}
            </nav>

            {/* User Authentication */}
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 group"
                >
                  <div className="relative">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture.startsWith('http')
                          ? user.profilePicture
                          : getImageUrl(user.profilePicture)}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 group-hover:border-white transition-colors duration-300"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border-2 border-gray-600 group-hover:border-white transition-colors duration-300">
                        <span className="text-white font-bold text-sm">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
                  </div>
                  <span className="hidden lg:block text-gray-300 font-medium group-hover:text-white transition-colors duration-300">{user?.name}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-all duration-300 group-hover:text-white ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 py-3 w-64 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden animate-fade-in-up">
                    <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center space-x-3">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture.startsWith('http')
                              ? user.profilePicture
                              : getImageUrl(user.profilePicture)}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border-2 border-gray-200">
                            <span className="text-white font-bold">
                              {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {[
                      {
                        to: '/profile', label: 'My Profile', icon: (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )
                      },
                      {
                        to: '/favorites', label: 'My Favorites', icon: (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )
                      }
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 transform hover:translate-x-1"
                      >
                        <div className="text-gray-500">{item.icon}</div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}

                    {isAdmin() && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 border-t border-gray-100 transform hover:translate-x-1"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border-t border-gray-100 transform hover:translate-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-6 py-2 text-gray-300 hover:text-white font-semibold transition-all duration-300 rounded-lg hover:bg-white/10 transform hover:scale-105">
                  Log in
                </Link>
                <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-white to-gray-100 text-black rounded-full font-bold hover:from-gray-100 hover:to-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="py-6 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm rounded-b-2xl mt-2">
            <nav className="flex flex-col space-y-2">
              {[
                { path: '/', label: 'Home', icon: '🏠' },
                { path: '/products', label: 'Frames', icon: '👓' },
                { path: '/book-appointment', label: 'Book Appointment', icon: '📅' },
                { path: '/contact', label: 'Contact Us', icon: '📞' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-6 py-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl mx-4 transform hover:translate-x-2 ${location.pathname === item.path ? 'text-white bg-white/10 translate-x-2' : ''
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {isAuthenticated() ? (
                <>
                  <div className="border-t border-gray-700/50 my-4 mx-4"></div>
                  <div className="px-6 py-4 mx-4">
                    <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture.startsWith('http')
                            ? user.profilePicture
                            : getImageUrl(user.profilePicture)}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border-2 border-gray-600">
                          <span className="text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {[
                    { to: '/profile', label: 'My Profile', icon: '👤' },
                    { to: '/favorites', label: 'My Favorites', icon: '❤️' }
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center space-x-3 px-6 py-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl mx-4 transform hover:translate-x-2"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}

                  {isAdmin() && (
                    <Link to="/admin" className="flex items-center space-x-3 px-6 py-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl mx-4 transform hover:translate-x-2">
                      <span className="text-lg">⚙️</span>
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-6 py-4 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300 rounded-xl mx-4 transform hover:translate-x-2"
                  >
                    <span className="text-lg">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-700/50 my-4 mx-4"></div>
                  <Link to="/login" className="flex items-center space-x-3 px-6 py-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl mx-4 transform hover:translate-x-2">
                    <span className="text-lg">🔑</span>
                    <span className="font-medium">Log in</span>
                  </Link>
                  <Link to="/register" className="flex items-center space-x-3 px-6 py-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl mx-4 transform hover:translate-x-2">
                    <span className="text-lg">✨</span>
                    <span className="font-medium">Sign up</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;