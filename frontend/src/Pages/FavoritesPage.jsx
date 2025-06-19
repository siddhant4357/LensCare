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
        setFavorites(data);
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
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">Your favorites list is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(favorite => (
            <div key={favorite._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-64 bg-gray-200 relative overflow-hidden">
                {favorite.images && favorite.images.length > 0 ? (
                  <img 
                    src={`http://localhost:5000${favorite.images[0]}`} 
                    alt={favorite.name} 
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                )}

                <button 
                  onClick={() => handleRemoveFavorite(favorite._id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{favorite.name}</h3>
                  <span className="bg-black text-white px-2 py-1 text-xs rounded">{favorite.shape}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{favorite.brand}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${favorite.price}</span>
                  <Link to={`/products/${favorite._id}`} className="text-black hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;