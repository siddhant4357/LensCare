import { useState } from 'react';
import { uploadFrame } from '../../services/frameService';
import { toast } from 'react-toastify';

const AdminUploadFrame = () => {
  const [frameData, setFrameData] = useState({
    name: '',
    brand: '',
    shape: '',
    price: '',
    description: '',
    features: '',
    stock: ''
  });
  
  const [colors, setColors] = useState([
    { name: 'Black', hex: '#000000', selected: false },
    { name: 'Tortoise', hex: '#8B4513', selected: false },
    { name: 'Crystal', hex: '#F5F5F5', selected: false },
    { name: 'Gold', hex: '#FFD700', selected: false },
    { name: 'Silver', hex: '#C0C0C0', selected: false },
    { name: 'Blue', hex: '#0000FF', selected: false }
  ]);

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Available brands and shapes for dropdown
  const brands = ['RayBan', 'Oakley', 'Gucci', 'Prada', 'Versace', 'Tom Ford', 'Persol'];
  const shapes = ['Round', 'Square', 'Aviator', 'Rectangle', 'Cat Eye', 'Oval', 'Oversized'];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFrameData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };
  
  const handleColorToggle = (index) => {
    const updatedColors = [...colors];
    updatedColors[index].selected = !updatedColors[index].selected;
    setColors(updatedColors);
  };
  
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 5 images
      const selectedFiles = filesArray.slice(0, 5);
      
      const imagesList = selectedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setImages(imagesList);
      
      // Clear error when field is edited
      if (errors.images) {
        setErrors(prevErrors => ({
          ...prevErrors,
          images: undefined
        }));
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!frameData.name.trim()) newErrors.name = 'Name is required';
    if (!frameData.brand) newErrors.brand = 'Brand is required';
    if (!frameData.shape) newErrors.shape = 'Shape is required';
    
    if (!frameData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(frameData.price)) || parseFloat(frameData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!frameData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(parseInt(frameData.stock)) || parseInt(frameData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (!frameData.description.trim()) newErrors.description = 'Description is required';
    
    if (colors.filter(color => color.selected).length === 0) {
      newErrors.colors = 'At least one color must be selected';
    }
    
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      try {
        setIsSubmitting(true);
        
        // Prepare data for submission
        const frameToSubmit = {
          ...frameData,
          colors: colors,
          images: images
        };
        
        // Upload frame to the server
        await uploadFrame(frameToSubmit);
        
        // Show success message
        toast.success('Frame uploaded successfully!');
        
        // Reset form
        setFrameData({
          name: '',
          brand: '',
          shape: '',
          price: '',
          description: '',
          features: '',
          stock: ''
        });
        setColors(colors.map(color => ({ ...color, selected: false })));
        setImages([]);
        
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error.response?.data?.message || 'Failed to upload frame');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const removeImage = (index) => {
    const newImages = [...images];
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upload New Frame</h1>
      
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <span>Frame uploaded successfully!</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Frame Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={frameData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
              placeholder="e.g., Classic Round"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand*
            </label>
            <select
              id="brand"
              name="brand"
              value={frameData.brand}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            {errors.brand && (
              <p className="mt-1 text-sm text-red-500">{errors.brand}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="shape" className="block text-sm font-medium text-gray-700 mb-1">
              Shape*
            </label>
            <select
              id="shape"
              name="shape"
              value={frameData.shape}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.shape ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
            >
              <option value="">Select Shape</option>
              {shapes.map(shape => (
                <option key={shape} value={shape}>{shape}</option>
              ))}
            </select>
            {errors.shape && (
              <p className="mt-1 text-sm text-red-500">{errors.shape}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)*
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={frameData.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
              placeholder="e.g., 129.99"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity*
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={frameData.stock}
            onChange={handleChange}
            min="0"
            className={`w-full px-3 py-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
            placeholder="e.g., 50"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={frameData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-black`}
            placeholder="Provide a detailed description of the frame..."
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
            Features (one per line)
          </label>
          <textarea
            id="features"
            name="features"
            rows="3"
            value={frameData.features}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Lightweight design&#10;High-quality materials&#10;UV protection"
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">Enter each feature on a new line</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Colors*
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, index) => (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorToggle(index)}
                className={`flex items-center px-3 py-2 rounded-md border ${color.selected ? 'border-black bg-gray-100' : 'border-gray-300'}`}
              >
                <span className="w-5 h-5 rounded-full mr-2" style={{ backgroundColor: color.hex }}></span>
                <span>{color.name}</span>
              </button>
            ))}
          </div>
          {errors.colors && (
            <p className="mt-1 text-sm text-red-500">{errors.colors}</p>
          )}
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images*
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="images" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 5MB (max 5 images)
                </p>
              </div>
            </label>
          </div>
          {errors.images && (
            <p className="mt-1 text-sm text-red-500">{errors.images}</p>
          )}
          
          {/* Preview uploaded images */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image.preview} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-black text-white rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </div>
            ) : 'Upload Frame'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUploadFrame;