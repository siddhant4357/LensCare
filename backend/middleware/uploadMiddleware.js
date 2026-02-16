const multre = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multre({ storage });

module.exports = upload;