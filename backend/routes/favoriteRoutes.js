const express = require('express');
const router = express.Router();
const { 
  addToFavorites, 
  getFavorites, 
  removeFromFavorites 
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

router.route('/')
  .get(getFavorites)
  .post(addToFavorites);

router.route('/:id')
  .delete(removeFromFavorites);

module.exports = router;