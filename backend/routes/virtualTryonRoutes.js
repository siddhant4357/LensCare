const express = require('express');
const router = express.Router();

// Simple route that just confirms the API is working
// No image processing or Python execution
router.post('/process', (req, res) => {
  res.json({ 
    success: true,
    message: 'Virtual try-on is now client-side only'
  });
});

module.exports = router;