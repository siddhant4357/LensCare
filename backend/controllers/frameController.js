const Frame = require('../models/frameModel');

// @desc    Get all frames
// @route   GET /api/frames
// @access  Public
const getFrames = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword || '';
    const prioritySort = req.query.prioritySort !== 'false'; // Default to true

    // Build query
    const query = {};
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { shape: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Define sort order based on prioritySort parameter
    let sortOrder = {};
    if (prioritySort) {
      // Sort by priority first (descending), then by creation date
      sortOrder = { priority: -1, createdAt: -1 };
    } else {
      // Default sort by creation date
      sortOrder = { createdAt: -1 };
    }

    // Execute query with pagination
    const frames = await Frame.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Frame.countDocuments(query);
    const pages = Math.ceil(total / limit);

    res.json({
      frames,
      page,
      pages,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const { name, brand, shape, price, description, features, stock, colors, priority } = req.body;

    // Get image paths from Cloudinary
    const images = req.files.map(file => file.path);

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
      priority: Number(priority) || 0, // Add priority with default 0
    });

    const createdFrame = await frame.save();
    res.status(201).json(createdFrame);
  } catch (error) {
    console.error('Create frame error:', error);
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
        const newImages = req.files.map(file => file.path);
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

// @desc    Update frame priority
// @route   PUT /api/frames/:id/priority
// @access  Private/Admin
const updateFramePriority = async (req, res) => {
  try {
    const { priority } = req.body;

    // Validate priority
    if (priority === undefined || priority === null) {
      return res.status(400).json({ message: 'Priority is required' });
    }

    // Convert to number and validate
    const priorityNum = Number(priority);
    if (isNaN(priorityNum)) {
      return res.status(400).json({ message: 'Priority must be a valid number' });
    }

    const frame = await Frame.findById(req.params.id);

    if (!frame) {
      return res.status(404).json({ message: 'Frame not found' });
    }

    // Set priority as a number
    frame.priority = priorityNum;
    const updatedFrame = await frame.save();

    res.json(updatedFrame);
  } catch (error) {
    console.error('Priority update error:', error);
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
  updateFramePriority,
};