import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Chat from '../components/Chat';
import { getImageUrl } from '../utils/imageUrl';
import { useData } from '../context/DataContext';

// Static testimonials to show when no database testimonials exist
const staticTestimonials = [
  {
    _id: 'static-1',
    user: {
      name: 'Sarah Johnson',
      profilePicture: null
    },
    rating: 5,
    comment: "The service at LensCare is outstanding! I found the perfect frames that match my style perfectly. The staff was incredibly helpful and knowledgeable.",
    createdAt: new Date('2023-09-15').toISOString()
  },
  {
    _id: 'static-2',
    user: {
      name: 'Michael Chen',
      profilePicture: null
    },
    rating: 5,
    comment: "I've been wearing glasses for 20 years, and these are by far the most comfortable frames I've ever owned. The quality is exceptional!",
    createdAt: new Date('2023-10-02').toISOString()
  },
  {
    _id: 'static-3',
    user: {
      name: 'Emma Rodriguez',
      profilePicture: null
    },
    rating: 4,
    comment: "My eye exam was thorough and the doctor took time to explain everything. I appreciated the attention to detail in finding the right prescription.",
    createdAt: new Date('2023-08-28').toISOString()
  }
];

const HomePage = () => {
  const {
    testimonials,
    loading: contextLoading,
    featuredFrames,
    fetchTestimonials,
    fetchFeaturedFrames
  } = useData();

  const loading = contextLoading.testimonials;
  const framesLoading = contextLoading.featured;

  useEffect(() => {
    fetchTestimonials();
    fetchFeaturedFrames();
  }, [fetchTestimonials, fetchFeaturedFrames]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Glasses Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-20 left-10 transform rotate-12">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="currentColor" className="text-gray-900">
            <path d="M20 20a15 15 0 0 1 30 0 15 15 0 0 1 30 0M5 20h10M65 20h10M35 20h10" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-20 transform -rotate-45">
          <svg width="60" height="30" viewBox="0 0 60 30" fill="currentColor" className="text-gray-900">
            <path d="M15 15a10 10 0 0 1 20 0 10 10 0 0 1 20 0M5 15h10M45 15h10M25 15h10" />
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/4 transform rotate-45">
          <svg width="70" height="35" viewBox="0 0 70 35" fill="currentColor" className="text-gray-900">
            <path d="M17.5 17.5a12.5 12.5 0 0 1 25 0 12.5 12.5 0 0 1 25 0M5 17.5h12.5M52.5 17.5h12.5M30 17.5h10" />
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
              Clear
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 animate-pulse">
                Vision
              </span>
              <span className="block text-2xl sm:text-4xl md:text-5xl font-light text-gray-300 mt-4">
                Redefined
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              Experience premium eyewear crafted for the modern lifestyle. Where innovation meets elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/products" className="group relative px-10 py-4 bg-white text-black rounded-full font-bold text-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl transform hover:-translate-y-1">
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </Link>
              <Link to="/book-appointment" className="group relative px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 transform hover:-translate-y-1">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6">Why Choose Us</h2>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Excellence in every detail, crafted for your vision</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              {
                icon: "✓",
                title: "Premium Quality",
                description: "Meticulously selected materials and cutting-edge technology ensure exceptional durability and comfort."
              },
              {
                icon: "⚡",
                title: "Swift Service",
                description: "Streamlined processes deliver your perfect eyewear without compromising on quality or precision."
              },
              {
                icon: "👥",
                title: "Expert Care",
                description: "Certified professionals provide personalized consultations tailored to your unique vision needs."
              }
            ].map((feature, index) => (
              <div key={index} className="group text-center p-8 rounded-3xl bg-gray-50 hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-4">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500 group-hover:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6">Featured Collection</h2>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover our curated selection of premium eyewear</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {framesLoading ? (
              Array(4).fill().map((_, index) => (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="h-80 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded-full animate-pulse w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredFrames.slice(0, 4).map((frame) => (
                <div key={frame._id} className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                  <div className="h-80 bg-gray-100 relative overflow-hidden">
                    {frame.images && frame.images.length > 0 ? (
                      <img
                        src={getImageUrl(frame.images[0])}
                        alt={frame.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-6xl text-gray-300">👓</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{frame.name}</h3>
                    <p className="text-gray-500 mb-4 font-medium">{frame.brand}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-2xl">₹{frame.price.toFixed(2)}</span>
                      <Link to={`/products/${frame._id}`} className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-16">
            <Link to="/products" className="inline-block bg-black text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              View Full Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6">Client Stories</h2>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real experiences from our valued customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {loading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-3xl animate-pulse">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : (Array.isArray(testimonials) && testimonials.length > 0) ? (
              testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial._id} className="group bg-gray-50 p-8 rounded-3xl hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105">
                  <div className="flex items-center mb-6">
                    {testimonial.user.profilePicture ? (
                      <img
                        src={testimonial.user.profilePicture.startsWith('http')
                          ? testimonial.user.profilePicture
                          : getImageUrl(testimonial.user.profilePicture)}
                        alt={testimonial.user.name}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-white group-hover:border-gray-300"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-black group-hover:bg-white rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl font-bold text-white group-hover:text-black">{testimonial.user.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.user.name}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xl ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 group-hover:text-gray-600'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 group-hover:text-gray-300 leading-relaxed text-lg italic">"{testimonial.comment}"</p>
                  <p className="text-sm text-gray-400 group-hover:text-gray-500 mt-4">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <div className="text-8xl mb-4">💬</div>
                <p className="text-gray-500 text-xl">No testimonials available yet.</p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/feedback"
              className="inline-block bg-black text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              Share Your Experience
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to See Clearly?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their vision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-appointment" className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-all duration-300">
              Book Appointment
            </Link>
            <Link to="/products" className="px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300">
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Add Chat Component here */}
      <Chat />
    </div>
  );
};

export default HomePage;