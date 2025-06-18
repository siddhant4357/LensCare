const express = require('express');
const router = express.Router();
const { 
  createNotification,
  getUserNotifications,
  markAsRead
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getUserNotifications)
  .post(protect, admin, createNotification);

router.route('/:id')
  .put(protect, markAsRead);

module.exports = router;