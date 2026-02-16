const express = require('express');
const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint to keep server alive
// @access  Public
router.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

module.exports = router;
