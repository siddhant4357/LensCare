import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFrames, deleteFrame, updateFramePriority } from '../../services/frameService';
import { toast } from 'react-toastify';

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link 
          to="/admin/products/create" 
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </Link>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={`http://localhost:5000${product.images[0]}`} 
                                alt={product.name} 
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-500">No img</div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.shape}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.brand}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price?.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.stock || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${product.priority > 5 ? 'bg-green-100 text-green-800' : 
                            product.priority > 0 ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {product.priority || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openPriorityModal(product)}
                          className="text-black hover:underline mr-3"
                        >
                          Set Priority
                        </button>
                        <Link to={`/admin/products/edit/${product._id}`} className="text-black hover:underline mr-3">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Priority Modal */}
      {isPriorityModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Set Priority: {selectedProduct.name}</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Higher priority products (higher numbers) will appear first on the homepage and in product listings.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={priorityValue || 0}
                onChange={handlePriorityChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closePriorityModal}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePrioritySubmit}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
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