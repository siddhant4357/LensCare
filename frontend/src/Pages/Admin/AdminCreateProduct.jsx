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
    description: '',
    material: '',
    shapeType: '', // Will be mapped to shape
    image: null,
    priority: 0,
    // Add these missing fields
    stock: '10', // Default value
    features: 'High quality\nDurable\nComfortable' // Example features
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
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
    
    // For debugging
    console.log("Form data contents:");
    for (const pair of productData.entries()) {
      console.log(pair[0], pair[1]);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <select
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shape Type
              </label>
              <select
                name="shapeType"
                value={formData.shapeType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full p-2"
                accept="image/*"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority (0-10)
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                min="0"
                max="10"
              />
              <p className="mt-1 text-xs text-gray-500">
                Higher priority products appear first on the homepage and product listings
              </p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="4"
                required
              ></textarea>
            </div>
            
            {/* Add a hidden stock field */}
            <input type="hidden" name="stock" value={formData.stock} />
            
            {/* Add features field */}
            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features (one per line)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="3"
                placeholder="Enter features, one per line"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProduct;