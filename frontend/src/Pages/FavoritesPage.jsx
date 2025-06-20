import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import { toast } from 'react-toastify';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication first before making API call
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        // Filter out any null or invalid items
        setFavorites(data.filter(item => item && item._id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, [navigate]);

  const handleRemoveFavorite = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites(favorites.filter(fav => fav._id !== id));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
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
      
      {/* Favorites Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
              My
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-gray-600 ml-3">
                Favorites
              </span>
            </h1>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your personal collection of eyewear favorites</p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg animate-fade-in-up">
                <div className="text-8xl mb-6 animate-pulse">💔</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your favorites list is empty</h2>
                <p className="text-xl text-gray-500 mb-8">Discover our collection and add items to your favorites</p>
                <Link to="/products" className="group relative px-10 py-4 bg-black text-white rounded-full font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-xl transform hover:-translate-y-1">
                  <span className="relative z-10">Browse Products</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map(favorite => favorite && (
                  <div 
                    key={favorite._id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
                  >
                    <div className="h-64 bg-gray-200 relative overflow-hidden">
                      {favorite && favorite.images && favorite.images.length > 0 ? (
                        <img 
                          src={`http://localhost:5000${favorite.images[0]}`} 
                          alt={favorite.name} 
                          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                      <button 
                        onClick={() => handleRemoveFavorite(favorite._id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-300 transform"
                        aria-label="Remove from favorites"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl">{favorite.name || 'Unnamed Product'}</h3>
                        <span className="bg-black text-white px-3 py-1 text-xs rounded-full font-medium">{favorite.shape || 'N/A'}</span>
                      </div>
                      <p className="text-gray-600 mb-3">{favorite.brand || 'Unknown Brand'}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="font-black text-2xl">${favorite.price ? favorite.price.toFixed(2) : '0.00'}</span>
                        <Link 
                          to={`/products/${favorite._id}`} 
                          className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Additional Options Button */}
            {!loading && favorites.length > 0 && (
              <div className="flex justify-center mt-12">
                <Link to="/products" className="group relative px-8 py-3 bg-black text-white rounded-full font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-xl transform hover:-translate-y-1">
                  <span className="relative z-10">Discover More Products</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FavoritesPage;