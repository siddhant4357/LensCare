import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFrames } from '../services/frameService';
import { toast } from 'react-toastify';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    brand: '',
    shape: '',
    priceRange: '',
  });
  
  // Available filter options
  const brands = ['RayBan', 'Oakley', 'Gucci', 'Prada'];
  const shapes = ['Round', 'Square', 'Aviator', 'Rectangle', 'Cat Eye', 'Oval', 'Oversized'];
  const priceRanges = [
    { label: 'Under $150', value: '0-150' },
    { label: '$150 - $200', value: '150-200' },
    { label: '$200 - $250', value: '200-250' },
    { label: 'Over $250', value: '250-1000' }
  ];
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getFrames();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    let result = products;
    
    if (filters.brand) {
      result = result.filter(product => product.brand === filters.brand);
    }
    
    if (filters.shape) {
      result = result.filter(product => product.shape === filters.shape);
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => product.price >= min && product.price <= max);
    }
    
    setFilteredProducts(result);
  }, [filters, products]);
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value // Toggle filter
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      brand: '',
      shape: '',
      priceRange: ''
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-10 w-10 text-black" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4.293 12.293a1 1 0 011.414 0L12 18.586l6.293-6.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Eyewear Collection</h1>
        
        {/* Mobile filter dialog */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            className="w-full bg-black text-white px-4 py-2 rounded-md flex items-center justify-center"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className={`w-full lg:w-1/4 lg:block ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Clear all
                </button>
              </div>
              
              {/* Brand Filter */}
              <div className="mb-8">
                <h3 className="text-md font-medium mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center">
                      <input
                        id={`brand-${brand}`}
                        name="brand"
                        type="checkbox"
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                        checked={filters.brand === brand}
                        onChange={() => handleFilterChange('brand', brand)}
                      />
                      <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-600">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Shape Filter */}
              <div className="mb-8">
                <h3 className="text-md font-medium mb-3">Shape</h3>
                <div className="space-y-2">
                  {shapes.map(shape => (
                    <div key={shape} className="flex items-center">
                      <input
                        id={`shape-${shape}`}
                        name="shape"
                        type="checkbox"
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                        checked={filters.shape === shape}
                        onChange={() => handleFilterChange('shape', shape)}
                      />
                      <label htmlFor={`shape-${shape}`} className="ml-3 text-sm text-gray-600">
                        {shape}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div>
                <h3 className="text-md font-medium mb-3">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <div key={range.value} className="flex items-center">
                      <input
                        id={`price-${range.value}`}
                        name="price"
                        type="checkbox"
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                        checked={filters.priceRange === range.value}
                        onChange={() => handleFilterChange('priceRange', range.value)}
                      />
                      <label htmlFor={`price-${range.value}`} className="ml-3 text-sm text-gray-600">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="w-full lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No products match your filters.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-black underline hover:no-underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                    <div className="h-64 bg-gray-200 relative overflow-hidden flex items-center justify-center">
                      {/* Replace with actual images when available */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <span className="bg-black text-white px-2 py-1 text-xs rounded">{product.shape}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{product.brand}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">${product.price}</span>
                        <Link to={`/products/${product._id}`} className="text-black hover:underline">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;