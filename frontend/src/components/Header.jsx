import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-gray-300 transition-colors">Frames</Link>
            <Link to="/book-appointment" className="hover:text-gray-300 transition-colors">Book Appointment</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact Us</Link>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-gray-300 transition-colors py-2">Home</Link>
              <Link to="/products" className="hover:text-gray-300 transition-colors py-2">Frames</Link>
              <Link to="/book-appointment" className="hover:text-gray-300 transition-colors py-2">Book Appointment</Link>
              <Link to="/contact" className="hover:text-gray-300 transition-colors py-2">Contact Us</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;