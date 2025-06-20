import { useState } from 'react';
import { createAppointment } from '../services/appointmentService';
import { toast } from 'react-toastify';

const BookAppointmentPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', 
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  
  // Services
  const services = [
    'Comprehensive Eye Exam',
    'Contact Lens Fitting',
    'Frame Selection & Fitting',
    'Vision Therapy Consultation',
    'Eyeglass Repair & Adjustments'
  ];

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
    
    // Required fields
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.service) errors.service = 'Service is required';
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);
        
        // Format date as expected by the server
        const appointmentData = {
          ...formData,
          // Combine date and time for the server if needed, or leave separate
        };
        
        // Submit appointment to server
        await createAppointment(appointmentData);
        
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          service: '',
          notes: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
        
      } catch (error) {
        setIsSubmitting(false);
        toast.error(error.response?.data?.message || 'Failed to book appointment');
      }
    }
  };
  
  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0];

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
              Book Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 ml-3">
                Appointment
              </span>
            </h1>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
              Schedule your eye exam or consultation with our certified professionals for personalized eye care
            </p>
          </div>
        </div>
      </section>
      
      {/* Form Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {submitSuccess && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg mb-8 flex items-center shadow-md animate-fade-in-up">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Appointment Scheduled!</h3>
                  <p>Thank you for choosing LensCare. We'll contact you shortly to confirm your appointment details.</p>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Booking</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name*
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg ${formErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300`}
                        placeholder="Your first name"
                      />
                      {formErrors.firstName && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg ${formErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300`}
                        placeholder="Your last name"
                      />
                      {formErrors.lastName && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300`}
                        placeholder="your.email@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg ${formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300`}
                        placeholder="(123) 456-7890"
                      />
                      {formErrors.phone && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Required*
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${formErrors.service ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300`}
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                    {formErrors.service && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.service}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date*
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        min={today}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg ${formErrors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300`}
                      />
                      {formErrors.date && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.date}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time*
                      </label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg ${formErrors.time ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300`}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                      {formErrors.time && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.time}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="4"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                      placeholder="Any specific requirements or concerns..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-12 py-4 bg-black text-white rounded-full text-lg font-bold hover:bg-gray-800 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : 'Book Appointment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* What to Expect Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">What to Expect</h2>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our streamlined process ensures a comfortable and effective experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 shadow-md hover:shadow-xl">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Scheduling</h3>
              <p className="text-gray-600 group-hover:text-gray-300 mb-4">Book your appointment and receive an immediate confirmation email.</p>
            </div>
            
            <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 shadow-md hover:shadow-xl">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Examination</h3>
              <p className="text-gray-600 group-hover:text-gray-300 mb-4">Our experienced optometrists will conduct a comprehensive eye examination.</p>
            </div>
            
            <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 shadow-md hover:shadow-xl">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Selection</h3>
              <p className="text-gray-600 group-hover:text-gray-300 mb-4">Choose from our wide range of frames with expert assistance.</p>
            </div>
          </div>
        </div>
      </section>
      
     
    </div>
  );
};

export default BookAppointmentPage;