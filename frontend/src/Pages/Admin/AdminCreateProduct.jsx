import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createFrame } from '../../services/frameService';

const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: 'These stylish frames offer the perfect combination of comfort and durability. Designed with premium materials and careful attention to detail, they provide all-day wearability while maintaining a fashionable look. The lightweight construction ensures they sit comfortably on your face, and the high-quality hinges guarantee long-lasting performance.',
    material: '',
    shapeType: '', // Will be mapped to shape
    image: null,
    priority: 0,
    // Add these missing fields
    stock: '10', // Default value
    features: 'High quality\nDurable\nComfortable' // Example features
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file upload
    const productData = new FormData();

    // Map shapeType to shape (what the backend expects)
    productData.append('shape', formData.shapeType);

    // Add all other text fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && key !== 'image' && key !== 'shapeType') {
        productData.append(key, formData[key]);
      }
    });

    // Add a default colors array
    const defaultColors = [
      { name: 'Black', hex: '#000000', selected: true }
    ];
    productData.append('colors', JSON.stringify(defaultColors));

    // Add the image file with field name 'images'
    if (formData.image) {
      productData.append('images', formData.image);
    }

    try {
      setLoading(true);
      await createFrame(productData);
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error('Failed to create product: ' + (error.response?.data?.message || 'Unknown error'));
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 text-gray-900">
              Create New
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-gray-600 ml-3">
                Product
              </span>
            </h1>
            <div className="w-20 h-1 bg-black mb-4"></div>
            <p className="text-gray-600 max-w-3xl">
              Add a new frame to your collection. Complete all required fields for best results.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 rounded-lg bg-white shadow-md hover:bg-gray-50 border border-gray-200 text-gray-700 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl border border-gray-100">
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="sm:col-span-2">
                <h2 className="text-xl font-bold mb-4 text-gray-900 pb-2 border-b border-gray-200">Basic Information</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand*
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-8 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority (0-10)
                </label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  min="0"
                  max="10"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Higher priority products appear first on the homepage
                </p>
              </div>

              {/* Product Details */}
              <div className="sm:col-span-2 mt-4">
                <h2 className="text-xl font-bold mb-4 text-gray-900 pb-2 border-b border-gray-200">Product Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material*
                </label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">-- Select Material --</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Metal">Metal</option>
                  <option value="Titanium">Titanium</option>
                  <option value="Wood">Wood</option>
                  <option value="Acetate">Acetate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shape*
                </label>
                <select
                  name="shapeType"
                  value={formData.shapeType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">-- Select Shape --</option>
                  <option value="Round">Round</option>
                  <option value="Square">Square</option>
                  <option value="Rectangle">Rectangle</option>
                  <option value="Cat-eye">Cat-eye</option>
                  <option value="Aviator">Aviator</option>
                  <option value="Geometric">Geometric</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-black transition-colors duration-300 cursor-pointer">
                  <div className="space-y-1 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          id="image-upload"
                          name="image"
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    {previewImage && (
                      <p className="text-xs text-green-600 font-medium mt-2">✓ Image selected</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  rows="4"
                  placeholder="Describe the product in detail"
                  required
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  rows="3"
                  placeholder="Enter features, one per line"
                ></textarea>
              </div>

              {/* Add a hidden stock field */}
              <input type="hidden" name="stock" value={formData.stock} />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Product
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateProduct;