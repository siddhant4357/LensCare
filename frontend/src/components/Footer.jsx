import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-20 transform rotate-12">
          <svg width="60" height="30" viewBox="0 0 60 30" fill="currentColor" className="text-white">
            <path d="M15 15a10 10 0 0 1 20 0 10 10 0 0 1 20 0M5 15h10M45 15h10M25 15h10"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-16 transform -rotate-45">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="currentColor" className="text-white">
            <path d="M20 20a15 15 0 0 1 30 0 15 15 0 0 1 30 0M5 20h10M65 20h10M35 20h10"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                LensCare
              </h3>
              <div className="w-12 h-1 bg-white rounded-full mb-4"></div>
            </div>
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              Your vision, our priority. Quality eye care and premium optical products crafted for the modern lifestyle.
            </p>
           
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "Frames" },
                { to: "/book-appointment", label: "Book Appointment" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="group text-gray-300 hover:text-white text-base transition-all duration-300 flex items-center"
                  >
                    <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Help Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Help & Support</h3>
            <ul className="space-y-3">
              {[
                { to: "/contact", label: "Contact Us" },
                { href: "#", label: "FAQs" },
                { href: "#", label: "Returns Policy" },
                
              ].map((link, index) => (
                <li key={index}>
                  {link.to ? (
                    <Link 
                      to={link.to} 
                      className="group text-gray-300 hover:text-white text-base transition-all duration-300 flex items-center"
                    >
                      <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="group text-gray-300 hover:text-white text-base transition-all duration-300 flex items-center"
                    >
                      <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Connect Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Connect With Us</h3>
            <p className="text-gray-300 text-base mb-4">Follow us for the latest updates and exclusive offers</p>
            
            <div className="flex space-x-3 mb-4">
              {[
                { 
                  name: "Facebook",
                  path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                },
                { 
                  name: "Instagram",
                  path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                },
                { 
                  name: "Twitter",
                  path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                }
              ].map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="group w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="h-5 w-5 text-gray-300 group-hover:text-black transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-gray-400 text-xs">
              <p>&copy; {new Date().getFullYear()} LensCare. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6 text-xs">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Cookie Policy</a>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>for clear vision</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;