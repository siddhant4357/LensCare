
const Frame = require('../models/frameModel');

// @desc    Fetch all frames
// @route   GET /api/frames
// @access  Public
const getFrames = async (req, res) => {
  try {
    const frames = await Frame.find({});
    res.json(frames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single frame
// @route   GET /api/frames/:id
// @access  Public
const getFrameById = async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);

    if (frame) {
      res.json(frame);
    } else {
      res.status(404).json({ message: 'Frame not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a frame
// @route   POST /api/frames
// @access  Private/Admin
const createFrame = async (req, res) => {
  try {
    const { name, brand, shape, price, description, features, stock, colors } = req.body;
    
    // Get image paths from multer
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const frame = new Frame({
      name,
      brand,
      shape,
      price,
      description,
      features: features.split('\n').filter(item => item.trim()),
      stock,
      colors: JSON.parse(colors),
      images,
    });

    const createdFrame = await frame.save();
    res.status(201).json(createdFrame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a frame
// @route   PUT /api/frames/:id
// @access  Private/Admin
const updateFrame = async (req, res) => {
  try {
    const { name, brand, shape, price, description, features, stock, colors } = req.body;

    const frame = await Frame.findById(req.params.id);

    if (frame) {
      frame.name = name || frame.name;
      frame.brand = brand || frame.brand;
      frame.shape = shape || frame.shape;
      frame.price = price || frame.price;
      frame.description = description || frame.description;
      frame.features = features ? features.split('\n').filter(item => item.trim()) : frame.features;
      frame.stock = stock || frame.stock;
      frame.colors = colors ? JSON.parse(colors) : frame.colors;

      // Add new images if they exist
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => `/uploads/${file.filename}`);
        frame.images = [...frame.images, ...newImages];
      }

      const updatedFrame = await frame.save();
      res.json(updatedFrame);
    } else {
      res.status(404).json({ message: 'Frame not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a frame
// @route   DELETE /api/frames/:id
// @access  Private/Admin
const deleteFrame = async (req, res) => {
  try {
    const frame = await Frame.findById(req.params.id);

    if (frame) {
      await frame.deleteOne();
      res.json({ message: 'Frame removed' });
    } else {
      res.status(404).json({ message: 'Frame not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a review
// @route   POST /api/frames/:id/reviews
// @access  Private
const createFrameReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const frame = await Frame.findById(req.params.id);

    if (frame) {
      // Add review
      const review = {
        user: req.user.name,
        rating: Number(rating),
        comment,
      };

      frame.reviews.push(review);
      await frame.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Frame not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFrames,
  getFrameById,
  createFrame,
  updateFrame,
  deleteFrame,
  createFrameReview,
};