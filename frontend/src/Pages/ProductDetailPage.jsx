import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFrameById, getFrames } from '../services/frameService';
import { isAuthenticated } from '../services/authService'; // Add this import
import { toast } from 'react-toastify';
import VirtualTryOn from '../components/VirtualTryOn';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import axios from 'axios';
import { addToFavorites } from '../services/favoriteService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedColor, setSelectedColor] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [tryOnModalOpen, setTryOnModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Check if ID exists before making the API call
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
          reviews: data.reviews || [] // Ensure reviews is always an array
        });
        
        // Set default selected color
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        
        // Fetch similar products
        fetchSimilarProducts(data);
      } catch (error) {
        toast.error('Failed to load product details');
        console.error('Error loading product:', error);
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
      // Get frames with the same brand or shape
      const data = await getFrames(1, 8, currentProduct.brand);
      // Filter out current product and sort by similarity
      const otherFrames = data.frames.filter(frame => frame._id !== currentProduct._id);
      
      // Score each product for similarity based on various attributes
      const scoredFrames = otherFrames.map(frame => {
        let score = 0;
        
        // Brand match (highest weight)
        if (frame.brand === currentProduct.brand) score += 3;
        
        // Shape match
        if (frame.shape === currentProduct.shape) score += 2;
        
        // Price range match (within 20% of current product price)
        const priceMin = currentProduct.price * 0.8;
        const priceMax = currentProduct.price * 1.2;
        if (frame.price >= priceMin && frame.price <= priceMax) score += 1;
        
        return { ...frame, similarityScore: score };
      });
      
      // Sort by similarity score (descending)
      const sortedFrames = scoredFrames.sort((a, b) => b.similarityScore - a.similarityScore);
      
      // Take top 4 similar products
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

  // Safe method to close modal
  const handleCloseModal = () => {
    setTryOnModalOpen(false);
    // Give time for the modal to clean up resources
    setTimeout(() => {
      // console.log("Modal closed and resources cleaned up"); // Remove this line
    }, 100);
  };

  // Update the handleAddToFavorites function
  const handleAddToFavorites = async () => {
    try {
      // Check if user is logged in
      if (!isAuthenticated()) {
        toast.info('Please log in to add products to favorites');
        navigate('/login');
        return;
      }
      
      await addToFavorites(product._id);
      toast.success('Added to favorites');
    } catch (error) {
      console.error('Add to favorites error:', error);
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
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">Sorry, the product you are looking for does not exist.</p>
        <Link to="/products" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-sm">
            <li className="mr-2">
              <Link to="/" className="text-gray-500 hover:text-black">Home</Link>
            </li>
            <li className="mx-2 text-gray-500">/</li>
            <li className="mr-2">
              <Link to="/products" className="text-gray-500 hover:text-black">Frames</Link>
            </li>
            <li className="mx-2 text-gray-500">/</li>
            <li className="font-medium text-black">{product.name}</li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images with Virtual Try-on integration */}
          <div className="md:w-1/2">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 mb-4 relative">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={`http://localhost:5000${product.images[0]}`} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail images if you have more than one product image */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className="bg-gray-100 rounded cursor-pointer h-24 overflow-hidden"
                    onClick={() => {/* Handle thumbnail click */}}
                  >
                    <img 
                      src={`http://localhost:5000${image}`} 
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} className={`h-5 w-5 ${index < 4.5 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69L5.98 3.927c.3-.921 1.603-.921 1.902 0z"></path>
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                ({product.reviews && product.reviews.length || 0} reviews)
              </span>
            </div>

            <div className="text-2xl font-bold mb-6">${product.price}</div>

            {/* Frame Info */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-gray-600 block mb-1">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">Shape</span>
                  <span className="font-medium">{product.shape}</span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-gray-600 block mb-2">Colors</span>
                <div className="flex space-x-3">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor.name === color.name ? 'border-black' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <span className="block mt-2 text-sm">{selectedColor.name}</span>
                )}
              </div>
            </div>

            {/* Add to Favorites and Book Appointment */}
            <div className="mb-8">
              <button 
                onClick={handleAddToFavorites}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 mb-4"
              >
                Add to Favorites
              </button>
              
              {/* Virtual Try-On Button */}
              <button
                onClick={() => setTryOnModalOpen(true)}
                disabled={!product.images || product.images.length === 0}
                className="w-full border border-black text-black py-3 rounded-md hover:bg-gray-100 mb-4 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Try On Virtually
              </button>
              
              <Link to="/book-appointment" className="block w-full text-center border border-black text-black py-3 rounded-md hover:bg-gray-100">
                Book a Fitting Appointment
              </Link>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'features' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Features
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

       

        {/* Recommended Products - Updated with real similar products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendationsLoading ? (
              // Loading skeletons
              Array(4).fill().map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
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
            ) : similarProducts.length > 0 ? (
              similarProducts.map((frame) => (
                <div key={frame._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {frame.images && frame.images.length > 0 ? (
                      <img 
                        src={`http://localhost:5000${frame.images[0]}`} 
                        alt={frame.name} 
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{frame.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{frame.brand}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">${frame.price.toFixed(2)}</span>
                      <Link to={`/products/${frame._id}`} className="text-black hover:underline">
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
                <p className="text-gray-500">No similar products found.</p>
              </div>
            )}
          </div>
        </div>

        {tryOnModalOpen && (
          <VirtualTryOnModal
            frame={product}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;