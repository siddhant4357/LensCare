import { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../services/authService';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../services/userService';

const ProfilePage = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  
  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      
      if (profileImage) {
        formDataToSend.append('profilePicture', profileImage);
      }
      
      const updatedUser = await updateUserProfile(formDataToSend);
      
      const updatedUserData = {
        ...user,
        ...updatedUser,
        email: user.email
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-gray-600 ml-3">
              Profile
            </span>
          </h1>
          <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Manage your personal information and preferences</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-500 mb-12">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center mb-12">
                <div className="mb-8 md:mb-0 md:mr-12">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 border-4 border-white shadow-lg transition-transform duration-500 group-hover:scale-105">
                      {previewUrl ? (
                        <img
                          src={previewUrl.startsWith('http') 
                            ? previewUrl 
                            : previewUrl.startsWith('/') 
                              ? `http://localhost:5000${previewUrl}`
                              : previewUrl}
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                          <span className="text-5xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-2 right-2 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 hover:scale-110 transition-all duration-300"
                      aria-label="Change profile picture"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
                  <p className="text-gray-600 mb-3">{user?.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                      user?.role === 'admin' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800' : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                    } shadow-sm`}>
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                    <span className="inline-block px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm">
                      Active Account
                    </span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 group-hover:border-gray-400"
                      required
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={user?.email || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                        disabled
                        readOnly
                      />
                      <div className="absolute right-4 top-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Email address cannot be changed</p>
                  </div>
                  
                  <div className="group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 group-hover:border-gray-400"
                    />
                  </div>
                  
                  <div className="group">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 group-hover:border-gray-400"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative px-8 py-4 bg-black text-white rounded-full font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating Profile...
                        </div>
                      ) : 'Save Changes'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Additional Account Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg p-8 transform hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium">{user?.role === 'admin' ? 'Administrator' : 'Standard'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;