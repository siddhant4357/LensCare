const express = require('express');
const router = express.Router();
const { 
  getFrames, 
  getFrameById, 
  createFrame, 
  updateFrame, 
  deleteFrame,
  createFrameReview,
  updateFramePriority
} = require('../controllers/frameController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.route('/').get(getFrames);
router.route('/:id').get(getFrameById);

// Protected routes (admin only)
router.route('/')
  .post(protect, admin, upload.array('images', 5), createFrame);

// Priority update - Make sure this is BEFORE any routes with similar patterns
router.put('/:id/priority', protect, admin, updateFramePriority);

// Then other routes
router.route('/:id')
  .put(protect, admin, upload.array('images', 5), updateFrame)
  .delete(protect, admin, deleteFrame);

// Reviews
router.route('/:id/reviews')
  .post(protect, createFrameReview);

module.exports = router;