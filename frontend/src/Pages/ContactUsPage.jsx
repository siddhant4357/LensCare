import { useState } from 'react';

const ContactUsPage = () => {
  // Remove all form state and handlers
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-2">Contact Us</h1>
        <p className="text-center text-gray-600 mb-8">We'd love to hear from you.</p>
        
        <div className="max-w-4xl mx-auto"> {/* Changed from grid to single column */}
          {/* Contact Information */}
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
              <p className="text-gray-600 mb-6">
                Have questions about our products or services? Need help with your order or appointment?
                Our customer support team is here to assist you.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-gray-600">(123) 456-7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-600">support@lenscare.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Vision Street<br />
                      Eyecare City, EC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
              <div className="border-t border-b border-gray-200">
                <div className="py-3 flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="py-3 flex justify-between border-t border-gray-200">
                  <span className="font-medium">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="py-3 flex justify-between border-t border-gray-200">
                  <span className="font-medium">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">FAQs</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium mb-1">Do you offer free eye exams?</h3>
                  <p className="text-gray-600 text-sm">We offer complimentary eye exams with the purchase of a complete pair of prescription glasses.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">What is your return policy?</h3>
                  <p className="text-gray-600 text-sm">We offer a 30-day satisfaction guarantee. If you're not completely satisfied, we'll make it right.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Do you accept insurance?</h3>
                  <p className="text-gray-600 text-sm">Yes, we accept most major vision insurance plans. Please contact us for specific details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;