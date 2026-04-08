const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    ai_sentiment_score: { type: String, default: 'Neutral' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
