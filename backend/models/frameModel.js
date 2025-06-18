
const mongoose = require('mongoose');

const frameSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    shape: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
      }
    ],
    images: [
      {
        type: String,
        required: true,
      }
    ],
    reviews: [
      {
        user: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Frame = mongoose.model('Frame', frameSchema);

module.exports = Frame;