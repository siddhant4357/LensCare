import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFrameById, getFrames } from '../services/frameService';
import { isAuthenticated } from '../services/authService';
import { toast } from 'react-toastify';
import VirtualTryOn from '../components/VirtualTryOn';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import axios from 'axios';
import { addToFavorites } from '../services/favoriteService';
import { getImageUrl } from '../utils/imageUrl';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [tryOnModalOpen, setTryOnModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        if (!id) {
          toast.error('Invalid product ID');
          navigate('/products');
          return;
        }
        
        const data = await getFrameById(id);
        if (!data) {
          toast.error('Product not found');
          navigate('/products');
          return;
        }
        
        setProduct({
          ...data,
          reviews: data.reviews || []
        });
        
        fetchSimilarProducts(data);
      } catch (error) {
        toast.error('Failed to load product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  const fetchSimilarProducts = async (currentProduct) => {
    try {
      setRecommendationsLoading(true);
      const data = await getFrames(1, 8, currentProduct.brand);
      const frames = Array.isArray(data.frames) ? data.frames : [];
      const otherFrames = frames.filter(frame => frame._id !== currentProduct._id);
      
      const scoredFrames = otherFrames.map(frame => {
        let score = 0;
        if (frame.brand === currentProduct.brand) score += 3;
        if (frame.shape === currentProduct.shape) score += 2;
        const priceMin = currentProduct.price * 0.8;
        const priceMax = currentProduct.price * 1.2;
        if (frame.price >= priceMin && frame.price <= priceMax) score += 1;
        return { ...frame, similarityScore: score };
      });
      
      const sortedFrames = scoredFrames.sort((a, b) => b.similarityScore - a.similarityScore);
      setSimilarProducts(sortedFrames.slice(0, 4));
    } catch (error) {
      console.error('Error fetching similar products:', error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const handleVirtualTryOnMessage = (message, type) => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleCloseModal = () => {
    setTryOnModalOpen(false);
    setTimeout(() => {}, 100);
  };

  const handleAddToFavorites = async () => {
    try {
      if (!isAuthenticated()) {
        toast.info('Please log in to add products to favorites');
        navigate('/login');
        return;
      }
      
      await addToFavorites(product._id);
      toast.success('Added to favorites');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.info('This product is already in your favorites');
        } else if (error.response.status === 401) {
          toast.info('Please log in to add products to favorites');
          navigate('/login');
        } else {
          toast.error(`Failed to add to favorites: ${error.response.data?.message || 'Unknown error'}`);
        }
      } else {
        toast.error('Failed to add to favorites: Network error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">Sorry, the product you are looking for does not exist.</p>
        <Link to="/products" className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-all duration-300">
          Return to Products
        </Link>
      </div>
    );
  }

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

      {/* Slimmer Hero Section with Light Background */}
      <section className="relative py-3 bg-gradient-to-r from-gray-100 to-white border-b border-gray-200">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="animate-fade-in-up">
              <nav className="mb-2">
                <ol className="flex text-sm items-center">
                  <li className="mr-2">
                    <Link to="/" className="text-gray-500 hover:text-black transition-colors duration-300">Home</Link>
                  </li>
                  <li className="mx-2 text-gray-400">/</li>
                  <li className="mr-2">
                    <Link to="/products" className="text-gray-500 hover:text-black transition-colors duration-300">Frames</Link>
                  </li>
                  <li className="mx-2 text-gray-400">/</li>
                  <li className="font-medium text-gray-700">{product.name}</li>
                </ol>
              </nav>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {product.name}
              </h1>
             
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Product Images */}
              <div className="lg:w-1/2 animate-fade-in-up">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl overflow-hidden h-[500px] mb-6 group">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={getImageUrl(product.images[selectedImage])} 
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`bg-gray-100 rounded-xl cursor-pointer h-24 overflow-hidden transform transition-all duration-300 
                          ${selectedImage === index ? 'ring-2 ring-black scale-105' : 'hover:scale-105'}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:w-1/2 animate-fade-in-up">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl overflow-hidden p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <svg key={index} className={`h-5 w-5 ${index < 4.5 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-2">
                      ({product.reviews?.length || 0} reviews)
                    </span>
                  </div>

                  <div className="text-3xl font-black mb-8">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-700 to-gray-500">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Frame Info */}
                  <div className="mb-8">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <span className="text-gray-500 text-sm block mb-1">Brand</span>
                        <span className="font-semibold text-lg">{product.brand}</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <span className="text-gray-500 text-sm block mb-1">Shape</span>
                        <span className="font-semibold text-lg">{product.shape}</span>
                      </div>
                    
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mb-8 space-y-4">
                    <button 
                      onClick={handleAddToFavorites}
                      className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Add to Favorites
                    </button>
                    
                    {/* Virtual Try-On Button */}
                    <button
                      onClick={() => setTryOnModalOpen(true)}
                      disabled={!product.images || product.images.length === 0}
                      className="w-full border-2 border-black text-black py-4 rounded-full font-bold text-lg hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Try On Virtually
                    </button>
                    
                    <Link to="/book-appointment" className="block w-full text-center bg-gradient-to-r from-gray-700 via-gray-800 to-black text-white py-4 rounded-full font-bold text-lg hover:from-black hover:to-gray-700 transition-all duration-300 transform hover:scale-105">
                      Book a Fitting Appointment
                    </Link>
                  </div>

                  {/* Tab Navigation */}
                  <div>
                    <div className="flex mb-4">
                      <button
                        onClick={() => setActiveTab('description')}
                        className={`py-3 px-6 rounded-full font-medium text-sm transition-all duration-300 transform mr-4
                          ${activeTab === 'description' 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Description
                      </button>
                      <button
                        onClick={() => setActiveTab('features')}
                        className={`py-3 px-6 rounded-full font-medium text-sm transition-all duration-300 transform
                          ${activeTab === 'features' 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Features
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      {activeTab === 'description' && (
                        <div className="animate-fade-in-up">
                          <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                      )}
                      {activeTab === 'features' && (
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 animate-fade-in-up">
                          {product.features?.map((feature, index) => (
                            <li key={index} className="leading-relaxed">{feature}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
              You May Also
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-gray-600 ml-3">
                Like
              </span>
            </h2>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover more frames that match your style</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {recommendationsLoading ? (
              Array(4).fill().map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (Array.isArray(similarProducts) && similarProducts.length > 0) ? (
              similarProducts.map((frame) => (
                <div key={frame._id} className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-lg transform hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="h-64 bg-gray-100 relative overflow-hidden">
                    {frame.images && frame.images.length > 0 ? (
                      <img 
                        src={getImageUrl(frame.images[0])} 
                        alt={frame.name} 
                        className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-6xl text-gray-300">👓</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {frame.shape}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-1 group-hover:text-black transition-colors duration-300">{frame.name}</h3>
                    <p className="text-gray-500 mb-4 font-medium">{frame.brand}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-2xl">${frame.price.toFixed(2)}</span>
                      <Link 
                        to={`/products/${frame._id}`} 
                        className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-105"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-xl">No similar products found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Try on More Styles?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule an appointment with our experts for a personalized fitting experience
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

      {tryOnModalOpen && (
        <VirtualTryOnModal
          frame={product}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;