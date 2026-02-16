import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LazyImage from '../components/LazyImage';
import { getImageUrl } from '../utils/imageUrl';
import { useData } from '../context/DataContext';

const ProductListingPage = () => {
  const { products: allProducts, fetchProducts, loading: contextLoading } = useData();
  const loading = contextLoading.products;

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Updated to store arrays of selected values
  const [filters, setFilters] = useState({
    shapes: [],
    priceRanges: [],
  });

  // Pagination states
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  // Sort state
  const [sortBy, setSortBy] = useState('priority');

  // Available filter options
  const shapes = ['Aviator', 'Wayfarer', 'Round', 'Rectangle', 'Square', 'Cat Eye'];
  const priceRanges = [
    { label: 'Under ₹200', value: '0-200' },
    { label: '₹200 - ₹400', value: '200-400' },
    { label: '₹400 - ₹750', value: '400-750' },
    { label: 'Over ₹750', value: '750-10000' }
  ];

  // Fetch products on mount (if not already cached)
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtering, Sorting, and Pagination Logic
  useEffect(() => {
    let result = [...allProducts];

    // 1. Filter
    if (filters.shapes.length > 0) {
      result = result.filter(product => filters.shapes.includes(product.shape));
    }

    if (filters.priceRanges.length > 0) {
      result = result.filter(product => {
        return filters.priceRanges.some(range => {
          const [min, max] = range.split('-').map(Number);
          return product.price >= min && product.price <= max;
        });
      });
    }

    // 2. Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Priority sort (assuming backend sends it sorted, or we sort by priority field if exists)
      // For now, keep default order or sort by _id/createdAt
    }

    // Update totals
    setTotalProductsCount(result.length);
    setTotalPages(Math.ceil(result.length / itemsPerPage));

    // 3. Paginate
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = result.slice(startIndex, startIndex + itemsPerPage);

    setDisplayedProducts(paginatedProducts);

    // Reset to page 1 if sorting/filtering changes (handled by separate useEffect dependencies?)
    // Actually, we should reset page when filters change, but not when page changes.
    // This effect runs on page change too.
  }, [allProducts, filters, sortBy, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

  // Updated to handle checkbox changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = [...prev[filterType]];

      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterType]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      shapes: [],
      priceRanges: []
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-12">
        <nav className="inline-flex rounded-2xl shadow-lg overflow-hidden">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-5 py-3 ${page === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              } font-medium transition-all duration-300`}
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-5 py-3 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-3 py-3 bg-white text-gray-700 flex items-center">
                  ...
                </span>
              )}
            </>
          )}

          {pageNumbers.map(num => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`px-5 py-3 ${num === page
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                } font-medium transition-all duration-300`}
            >
              {num}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-3 py-3 bg-white text-gray-700 flex items-center">
                  ...
                </span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-5 py-3 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-5 py-3 ${page === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              } font-medium transition-all duration-300`}
          >
            Next
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
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



      {/* Filters and Products Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Bar */}
            <div className="flex justify-between items-center mb-10 animate-fade-in-up">
              <div>
                <p className="text-gray-500">
                  Showing <span className="font-medium text-black">{displayedProducts.length}</span> products
                  {totalProductsCount > 0 && <> out of <span className="font-medium text-black">{totalProductsCount}</span></>}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">Sort by:</span>
                <select
                  className="border-0 focus:ring-0 py-1 pl-2 pr-8 text-black font-medium rounded-lg bg-transparent"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                  }}
                >
                  <option value="priority">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Mobile filter button */}
            <div className="lg:hidden mb-6 animate-fade-in-up">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full shadow-sm text-black bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1z" />
                </svg>
                {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Filters sidebar */}
              <div className={`lg:w-1/4 lg:block animate-fade-in-up ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg overflow-hidden transform hover:shadow-xl transition-all duration-500 p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Filters</h2>
                    <button
                      onClick={clearFilters}
                      className={`text-sm ${filters.shapes.length > 0 || filters.priceRanges.length > 0 ? 'text-black font-medium' : 'text-gray-400'} transition-colors duration-300`}
                      disabled={filters.shapes.length === 0 && filters.priceRanges.length === 0}
                    >
                      Clear all
                    </button>
                  </div>

                  {/* Shape Filter - UPDATED WITH CHECKBOXES */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Shape</h3>
                    <div className="space-y-2">
                      {shapes.map(shape => (
                        <div key={shape} className="flex items-center">
                          <label className="flex items-center w-full py-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.shapes.includes(shape)}
                              onChange={() => handleFilterChange('shapes', shape)}
                              className="w-4 h-4 text-black rounded-sm focus:ring-black focus:ring-1"
                            />
                            <span className="ml-3 text-gray-700">{shape}</span>
                            {/* Updated count logic to use local allProducts */}
                            {filters.shapes.includes(shape) && (
                              <span className="ml-auto text-xs text-gray-500">
                                ({allProducts.filter(p => p.shape === shape).length})
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter - UPDATED WITH CHECKBOXES */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Price</h3>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <div key={range.value} className="flex items-center">
                          <label className="flex items-center w-full py-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.priceRanges.includes(range.value)}
                              onChange={() => handleFilterChange('priceRanges', range.value)}
                              className="w-4 h-4 text-black rounded-sm focus:ring-black focus:ring-1"
                            />
                            <span className="ml-3 text-gray-700">{range.label}</span>
                            {filters.priceRanges.includes(range.value) && (
                              <span className="ml-auto text-xs text-gray-500">
                                {(() => {
                                  const [min, max] = range.value.split('-').map(Number);
                                  return `(${allProducts.filter(p => p.price >= min && p.price <= max).length})`;
                                })()}
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(filters.shapes.length > 0 || filters.priceRanges.length > 0) && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium mb-3">Active Filters</h3>
                      <div className="flex flex-wrap gap-2">
                        {filters.shapes.map(shape => (
                          <div
                            key={shape}
                            className="inline-flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1 text-sm"
                          >
                            {shape}
                            <button
                              onClick={() => handleFilterChange('shapes', shape)}
                              className="ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-600 hover:bg-gray-200"
                            >
                              <span className="sr-only">Remove</span>
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8l4-4m0 0L4 4m4 0l-4 4" />
                              </svg>
                            </button>
                          </div>
                        ))}

                        {filters.priceRanges.map(range => (
                          <div
                            key={range}
                            className="inline-flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1 text-sm"
                          >
                            {priceRanges.find(r => r.value === range)?.label || range}
                            <button
                              onClick={() => handleFilterChange('priceRanges', range)}
                              className="ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-600 hover:bg-gray-200"
                            >
                              <span className="sr-only">Remove</span>
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8l4-4m0 0L4 4m4 0l-4 4" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product grid */}
              <div className="w-full lg:w-3/4">
                {displayedProducts.length === 0 && !loading ? (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg p-16 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
                    <p className="text-gray-600 mb-6">We couldn't find any products matching your filters.</p>
                    <button
                      onClick={clearFilters}
                      className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {loading ? (
                        // Skeleton loaders
                        Array(9).fill().map((_, index) => (
                          <div key={index} className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-lg transform hover:shadow-xl transition-all duration-500 animate-pulse">
                            <div className="h-64 bg-gray-200"></div>
                            <div className="p-6">
                              <div className="h-6 bg-gray-200 rounded mb-3"></div>
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                              <div className="flex justify-between items-center">
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        displayedProducts.map(product => (
                          <div key={product._id} className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-lg transform hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up">
                            <div className="h-64 bg-gray-100 relative overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <LazyImage
                                  src={getImageUrl(product.images[0])}
                                  alt={product.name}
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
                                  {product.shape}
                                </span>
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className="font-bold text-xl mb-1 group-hover:text-black transition-colors duration-300">{product.name}</h3>
                              <p className="text-gray-500 mb-4 font-medium">{product.brand}</p>
                              <div className="flex justify-between items-center">
                                <span className="font-black text-2xl">₹{product.price.toFixed(2)}</span>
                                <Link
                                  to={`/products/${product._id}`}
                                  className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform group-hover:scale-105"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && renderPagination()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule an appointment with our experts who can help you find the perfect frames
          </p>
          <Link to="/book-appointment" className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 inline-block">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductListingPage;
