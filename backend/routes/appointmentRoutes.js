const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getAppointments, 
  getAppointmentById, 
  updateAppointmentStatus, 
  deleteAppointment 
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Create appointment - public route
router.route('/').post(createAppointment);

// Admin routes
router.route('/')
  .get(protect, admin, getAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, admin, updateAppointmentStatus)
  .delete(protect, admin, deleteAppointment);

module.exports = router;