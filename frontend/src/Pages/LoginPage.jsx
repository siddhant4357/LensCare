import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!formData.password) errors.password = 'Password is required';
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        navigate('/'); // Redirect to home page after login
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Glasses Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-20 left-10 transform rotate-12">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="currentColor" className="text-gray-900">
            <path d="M20 20a15 15 0 0 1 30 0 15 15 0 0 1 30 0M5 20h10M65 20h10M35 20h10"/>
          </svg>
        </div>
        <div className="absolute top-1/3 right-20 transform -rotate-45">
          <svg width="60" height="30" viewBox="0 0 60 30" fill="currentColor" className="text-gray-900">
            <path d="M15 15a10 10 0 0 1 20 0 10 10 0 0 1 20 0M5 15h10M45 15h10M25 15h10"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/4 transform rotate-45">
          <svg width="70" height="35" viewBox="0 0 70 35" fill="currentColor" className="text-gray-900">
            <path d="M17.5 17.5a12.5 12.5 0 0 1 25 0 12.5 12.5 0 0 1 25 0M5 17.5h12.5M52.5 17.5h12.5M30 17.5h10"/>
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
              Welcome
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 ml-3">
                Back
              </span>
            </h1>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
              Sign in to your account to manage appointments and explore our collection
            </p>
          </div>
        </div>
      </section>

      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-500 hover:shadow-2xl">
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password*
                  </label>
                  <Link to="/forgot-password" className="text-sm text-black hover:text-gray-700 transition-colors duration-300">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 ${formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {formErrors.password && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>
              
              <div className="mb-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full px-8 py-4 bg-black text-white rounded-full font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : 'Sign In'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-black hover:text-gray-700 transition-colors duration-300">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;