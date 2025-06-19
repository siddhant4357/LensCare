import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFrames } from '../services/frameService';
import axios from 'axios';

const HomePage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredFrames, setFeaturedFrames] = useState([]);
  const [framesLoading, setFramesLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get('/api/feedback');
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedFrames = async () => {
      try {
        setFramesLoading(true);
        const data = await getFrames(1, 4, '', true);
        // Ensure we only take 4 frames even if API returns more
        setFeaturedFrames(data.frames.slice(0, 4));
      } catch (error) {
        console.error('Error fetching frames:', error);
      } finally {
        setFramesLoading(false);
      }
    };

    fetchTestimonials();
    fetchFeaturedFrames();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Your Vision, Our Priority
          </h1>
          <p className="text-xl text-center max-w-2xl mb-10">
            Experience premium eye care services and high-quality optical products tailored to your unique needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary bg-white text-black hover:bg-gray-200">
              Explore Frames
            </Link>
            <Link to="/book-appointment" className="btn-secondary border border-white hover:bg-white hover:text-black">
              Book Eye Test
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LensCare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
              <p className="text-gray-600">All our products are carefully selected to ensure the highest quality and durability.</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Service</h3>
              <p className="text-gray-600">Our efficient processes ensure you get your glasses in the shortest possible time.</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Care</h3>
              <p className="text-gray-600">Our team of certified optometrists provide professional eye care and advice.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products - Updated with real data */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Frames</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {framesLoading ? (
              // Loading skeletons - show exactly 4
              Array(4).fill().map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="h-64 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Only show up to 4 frames
              featuredFrames.slice(0, 4).map((frame) => (
                <div key={frame._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                  <div className="h-64 bg-gray-200 relative overflow-hidden">
                    {frame.images && frame.images.length > 0 ? (
                      <img 
                        src={`http://localhost:5000${frame.images[0]}`} 
                        alt={frame.name} 
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{frame.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{frame.brand}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">${frame.price.toFixed(2)}</span>
                      <Link to={`/products/${frame._id}`} className="text-black hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary bg-black text-white hover:bg-gray-800">
              View All Frames
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : testimonials.length > 0 ? (
              testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    {testimonial.user.profilePicture ? (
                      <img
                        src={testimonial.user.profilePicture.startsWith('http') 
                          ? testimonial.user.profilePicture 
                          : testimonial.user.profilePicture.startsWith('/') 
                            ? `http://localhost:5000${testimonial.user.profilePicture}`
                            : `http://localhost:5000/${testimonial.user.profilePicture}`}
                        alt={testimonial.user.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl text-gray-600">{testimonial.user.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{testimonial.user.name}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{testimonial.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No testimonials available yet.</p>
              </div>
            )}
          </div>
          
          {/* Add feedback button for logged in users */}
          <div className="mt-8 text-center">
            <Link 
              to="/feedback" 
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Share Your Experience
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Vision?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule an eye test today and discover our premium collection of frames.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book-appointment" className="btn-primary bg-white text-black hover:bg-gray-200">
              Book Appointment
            </Link>
            <Link to="/products" className="btn-secondary border border-white hover:bg-white hover:text-black">
              Browse Frames
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;