const Feedback = require('../models/feedbackModel');

// @desc    Add feedback
// @route   POST /api/feedback
// @access  Private
const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const feedback = await Feedback.create({
      user: req.user._id,
      rating,
      comment
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get approved feedback for homepage
// @route   GET /api/feedback
// @access  Public
const getApprovedFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ approved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve feedback
// @route   PUT /api/feedback/:id/approve
// @access  Private/Admin
const approveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    feedback.approved = true;
    const updatedFeedback = await feedback.save();
    
    res.json(updatedFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all feedback for admin
// @route   GET /api/feedback/admin
// @access  Private/Admin
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addFeedback,
  getApprovedFeedback,
  approveFeedback,
  getAllFeedback
};