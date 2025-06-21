import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFrames, deleteFrame, updateFramePriority } from '../../services/frameService';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUrl'; // FIXED: Changed from '../utils/imageUrl' to '../../utils/imageUrl'

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [priorityValue, setPriorityValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getFrames(1, 100); // Get up to 100 products
        setProducts(data.frames);
        setFilteredProducts(data.frames);
      } catch (error) {
        toast.error('Failed to fetch products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const openPriorityModal = (product) => {
    setSelectedProduct(product);
    // Ensure priorityValue is a valid number
    setPriorityValue(product.priority !== undefined && product.priority !== null ? 
      Number(product.priority) : 0);
    setIsPriorityModalOpen(true);
  };

  const closePriorityModal = () => {
    setIsPriorityModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePriorityChange = (e) => {
    // Ensure we're setting a valid number
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    setPriorityValue(isNaN(value) ? 0 : value);
  };

  const handlePrioritySubmit = async () => {
    if (!selectedProduct) return;
    
    try {
      await updateFramePriority(selectedProduct._id, priorityValue);
      
      // Update local state
      const updatedProducts = products.map(product => 
        product._id === selectedProduct._id ? { ...product, priority: priorityValue } : product
      );
      
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts.filter(product => 
        searchTerm.trim() === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      toast.success('Product priority updated successfully');
      closePriorityModal();
    } catch (error) {
      console.error('Priority update error:', error);
      toast.error('Failed to update product priority');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteFrame(id);
        setProducts(products.filter(product => product._id !== id));
        setFilteredProducts(filteredProducts.filter(product => product._id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 p-4 sm:p-6 md:p-8">
      <div className="mb-8 md:mb-12 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-2 md:mb-4 leading-tight tracking-tight">
          Product
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 ml-2 md:ml-3">
            Management
          </span>
        </h1>
        <div className="w-16 md:w-20 h-1 bg-black mb-3 md:mb-6"></div>
        <p className="text-lg md:text-xl text-gray-600">Organize and manage your product catalog</p>
      </div>
      
      {/* Search and Add Product Button Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-3 md:gap-4">
        {/* Search Bar */}
        <div className="relative w-full mb-3 lg:mb-0">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-3 md:px-4 py-2.5 md:py-3 pr-8 md:pr-10 border-0 rounded-lg md:rounded-xl bg-white shadow-md md:shadow-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Add Product Button */}
        <Link 
          to="/admin/products/create" 
          className="group relative px-4 md:px-6 py-2.5 md:py-3 bg-black text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all duration-500 hover:scale-105 hover:shadow-xl transform w-full lg:w-auto text-center whitespace-nowrap"
        >
          <span className="relative z-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        </Link>
      </div>
      
      {/* Products Content */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-t-4 border-b-4 border-black rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-t-4 border-b-4 border-gray-400 rounded-full animate-ping absolute top-0 opacity-20"></div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11v6m-3-3h6" />
                </svg>
                <p className="text-xl text-gray-500 mb-6">No products found</p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="text-black underline hover:no-underline font-medium"
                  >
                    Clear search and show all products
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full">
                {/* Table view for larger screens */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-white">
                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Brand
                            </th>
                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Stock
                            </th>
                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Priority
                            </th>
                            <th className="px-6 py-5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-5 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                    {product.images && product.images.length > 0 ? (
                                      <img 
                                        src={getImageUrl(product.images[0])} 
                                        alt={product.name} 
                                        className="h-16 w-16 object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-base font-medium text-gray-900">{product.name}</div>
                                    <div className="text-sm text-gray-500 capitalize mt-1">{product.shape}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <div className="text-base text-gray-900 font-medium">{product.brand}</div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <div className="text-base font-bold text-black">${product.price?.toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <div className="text-base text-gray-900">
                                  {product.stock > 0 ? product.stock : (
                                    <span className="text-red-600 font-medium">Out of stock</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <span className={`px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                  product.priority > 5 ? 'bg-green-100 text-green-800 border border-green-200' : 
                                  product.priority > 0 ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                                  'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                  {product.priority || 0}
                                </span>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => openPriorityModal(product)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition-all duration-200 flex items-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                   Set Priority
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg transition-all duration-200 flex items-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Card view for mobile */}
                <div className="md:hidden">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white p-4 mb-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center mb-3">
                        <div className="h-16 w-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mr-4">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={getImageUrl(product.images[0])} 
                              alt={product.name} 
                              className="h-16 w-16 object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-base truncate">{product.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{product.brand}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        <div>
                          <span className="text-xs text-gray-500">Price</span>
                          <p className="font-bold text-black">${product.price?.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Stock</span>
                          <p className="text-sm">{product.stock > 0 ? product.stock : <span className="text-red-600 font-medium">Out of stock</span>}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Priority</span>
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.priority > 5 ? 'bg-green-100 text-green-800 border border-green-200' : 
                            product.priority > 0 ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                            'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {product.priority || 0}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openPriorityModal(product)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-200 flex items-center justify-center text-xs sm:text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          Priority
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-200 flex items-center justify-center text-xs sm:text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Priority Modal */}
      {isPriorityModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 md:p-8 max-w-md w-full shadow-2xl transform transition-all animate-fade-in-up">
            <h3 className="text-xl md:text-2xl font-bold text-black mb-2">Set Product Priority</h3>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base truncate">
              {selectedProduct.name} - {selectedProduct.brand}
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
              <p className="text-blue-800 text-sm">
                Higher priority products (higher numbers) will appear first on the homepage and in product listings.
              </p>
            </div>
            
            <div className="mb-6 md:mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority (0-10)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={priorityValue || 0}
                onChange={handlePriorityChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Low</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={priorityValue || 0}
                  onChange={handlePriorityChange}
                  className="w-16 md:w-20 border border-gray-300 rounded-lg p-1 md:p-2 text-center font-bold text-sm"
                />
                <span className="text-xs text-gray-500">High</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 md:space-x-4">
              <button
                onClick={closePriorityModal}
                className="px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all duration-300 font-medium text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handlePrioritySubmit}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg md:rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm md:text-base"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;