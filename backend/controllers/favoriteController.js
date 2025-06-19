const Favorite = require('../models/favoriteModel');
const Frame = require('../models/frameModel');

// @desc    Add a product to favorites
// @route   POST /api/user/favorites
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    // Validate product exists
    const product = await Frame.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({ 
      user: req.user._id, 
      product: productId 
    });
    
    if (existingFavorite) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }
    
    // Add to favorites
    const favorite = new Favorite({
      user: req.user._id,
      product: productId
    });
    
    await favorite.save();
    res.status(201).json({ message: 'Product added to favorites' });
    
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user favorites
// @route   GET /api/user/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('product');
    
    // Format the response to just send the product information
    const products = favorites.map(favorite => favorite.product);
    
    res.json(products);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove a product from favorites
// @route   DELETE /api/user/favorites/:id
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const productId = req.params.id;
    
    const favorite = await Favorite.findOne({ 
      user: req.user._id, 
      product: productId 
    });
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    await favorite.deleteOne();
    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addToFavorites,
  getFavorites,
  removeFromFavorites
};