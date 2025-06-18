const express = require('express');
const router = express.Router();
const { 
  addFeedback,
  getApprovedFeedback,
  approveFeedback,
  getAllFeedback
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getApprovedFeedback)
  .post(protect, addFeedback);

router.route('/admin')
  .get(protect, admin, getAllFeedback);

router.route('/:id/approve')
  .put(protect, admin, approveFeedback);

module.exports = router;