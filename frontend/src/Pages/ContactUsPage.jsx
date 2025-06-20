import React from 'react';
import { Link } from 'react-router-dom';

const ContactUsPage = () => {
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
              Get In 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 ml-3">
                Touch
              </span>
            </h1>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
              We'd love to hear from you. Our friendly team is here to answer all your questions.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Email Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-md hover:shadow-xl">
                <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Email</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-4">We'll respond as soon as possible</p>
                <a href="mailto:support@lenscare.com" className="font-medium text-lg group-hover:text-white">support@lenscare.com</a>
              </div>
              
              {/* Phone Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-md hover:shadow-xl">
                <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Phone</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-4">Mon-Fri from 9am to 6pm</p>
                <a href="tel:(123)456-7890" className="font-medium text-lg group-hover:text-white">(123) 456-7890</a>
              </div>
              
              {/* Address Card */}
              <div className="group bg-gray-50 rounded-3xl p-8 text-center hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-md hover:shadow-xl">
                <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Visit Us</h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-4">Come say hello at our store</p>
                <address className="not-italic font-medium text-lg group-hover:text-white">
                  123 Vision Street<br />
                  Eyecare City, EC 12345
                </address>
              </div>
            </div>
            
            {/* Business Hours Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-black mb-4">Business Hours</h2>
                <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">When you can visit our store</p>
              </div>
              
              <div className="max-w-xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-2 divide-y divide-gray-200">
                  <div className="py-5 px-6 flex items-center font-semibold text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Monday - Friday
                  </div>
                  <div className="py-5 px-6 bg-gray-50 font-medium text-lg">9:00 AM - 6:00 PM</div>
                  
                  <div className="py-5 px-6 flex items-center font-semibold text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Saturday
                  </div>
                  <div className="py-5 px-6 bg-gray-50 font-medium text-lg">10:00 AM - 4:00 PM</div>
                  
                  <div className="py-5 px-6 flex items-center font-semibold text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Sunday
                  </div>
                  <div className="py-5 px-6 bg-gray-50 font-medium text-lg text-red-600">Closed</div>
                </div>
              </div>
            </div>
            
          
            
            {/* CTA Section */}
            <div className="mt-16 text-center">
              <Link to="/book-appointment" className="group relative px-10 py-4 bg-black text-white rounded-full font-bold text-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl transform hover:-translate-y-1">
                <span className="relative z-10">Book an Appointment</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;