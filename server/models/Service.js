const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    contact_info: { type: String },
    is_verified: { type: Boolean, default: false }
}, { timestamps: true });

// Index for efficient sorted queries (Day 2: fixes unsorted recommendation bug)
serviceSchema.index({ rating: -1, reviewCount: -1 });

module.exports = mongoose.model('Service', serviceSchema);
