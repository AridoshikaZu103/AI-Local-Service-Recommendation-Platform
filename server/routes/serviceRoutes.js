const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Review = require('../models/Review');
const axios = require('axios');

// ──────────────────────────────────────────────
//  GET /api/services — All services, SORTED (Day 2 Fix)
// ──────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { category, location, sort } = req.query;
        let query = {};
        if (category) query.category = new RegExp(category, 'i');
        if (location) query.location = new RegExp(location, 'i');

        // Deterministic sort order (fixes "unpredictable recommendation" bug)
        let sortOrder = { rating: -1, reviewCount: -1 };
        if (sort === 'rating_asc') sortOrder = { rating: 1, reviewCount: -1 };
        if (sort === 'newest') sortOrder = { createdAt: -1 };

        const services = await Service.find(query).sort(sortOrder);
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ──────────────────────────────────────────────
//  GET /api/services/ranked — AI Trust Score ranking (NEW Day 2)
// ──────────────────────────────────────────────
router.get('/ranked', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 3, 20);
        const services = await Service.find({}).sort({ rating: -1, reviewCount: -1 });

        // Gather sentiment breakdown for each service
        const servicesWithSentiment = await Promise.all(
            services.map(async (svc) => {
                const reviews = await Review.find({ service_id: svc._id });
                const total = reviews.length;
                const positive = reviews.filter(r => r.ai_sentiment_score === 'Positive').length;
                return {
                    _id: svc._id,
                    name: svc.name,
                    category: svc.category,
                    location: svc.location,
                    price: svc.price,
                    rating: svc.rating,
                    reviewCount: svc.reviewCount,
                    contact_info: svc.contact_info,
                    is_verified: svc.is_verified,
                    sentimentBreakdown: { positive, total }
                };
            })
        );

        // Call Python AI for trust score computation
        let ranked;
        try {
            const PYTHON_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:5001';
            const aiRes = await axios.post(`${PYTHON_URL}/rank`, {
                services: servicesWithSentiment
            });
            ranked = aiRes.data.ranked;
        } catch (aiErr) {
            // Graceful fallback: sort by rating if Python is offline
            console.warn('Python AI offline, falling back to rating-based sort:', aiErr.message);
            ranked = servicesWithSentiment
                .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
                .map(s => ({ ...s, ai_score: null }));
        }

        res.json(ranked.slice(0, limit));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ──────────────────────────────────────────────
//  GET /api/services/:id — Single service + reviews
// ──────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ error: 'Not found' });

        const reviews = await Review.find({ service_id: req.params.id }).sort({ createdAt: -1 });
        res.json({ service, reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ──────────────────────────────────────────────
//  POST /api/services/:id/reviews — Add review with AI sentiment
// ──────────────────────────────────────────────
router.post('/:id/reviews', async (req, res) => {
    try {
        const { text, rating } = req.body;

        let sentiment = 'Neutral';
        try {
            const PYTHON_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:5001';
            const aiRes = await axios.post(`${PYTHON_URL}/analyze`, { text });
            sentiment = aiRes.data.sentiment;
        } catch (aiErr) {
            console.error('Python AI Server warning:', aiErr.message);
        }

        const newReview = new Review({
            service_id: req.params.id,
            text,
            rating,
            ai_sentiment_score: sentiment
        });

        await newReview.save();

        const service = await Service.findById(req.params.id);
        const currentTotal = service.rating * service.reviewCount;
        service.reviewCount += 1;
        service.rating = (currentTotal + Number(rating)) / service.reviewCount;
        await service.save();

        res.status(201).json({ review: newReview, sentiment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ──────────────────────────────────────────────
//  POST /api/services/chat — Chatbot NLP Search, SORTED (Day 2 Fix)
// ──────────────────────────────────────────────
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Ask Python to extract intent
        const PYTHON_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:5001';
        const aiRes = await axios.post(`${PYTHON_URL}/extract_intent`, { text: message });
        const { category, location } = aiRes.data;

        let query = {};
        if (category) query.category = new RegExp(category, 'i');
        if (location) query.location = new RegExp(location, 'i');

        let services = [];
        let botResponse = "I couldn't quite understand what service or location you are looking for. Try saying 'I need an electrician in Delhi'.";

        if (category || location) {
            // Day 2 Fix: Sort by rating descending so best results appear first
            services = await Service.find(query)
                .sort({ rating: -1, reviewCount: -1 })
                .limit(3);

            if (services.length > 0) {
                botResponse = `Here is what I found for **${category || 'services'}** near **${location || 'you'}** (sorted by AI ranking):`;
            } else {
                botResponse = `I'm sorry, I couldn't find any exact matches for that in our current database. Try a different city like Mumbai or Delhi!`;
            }
        }

        res.json({
            reply: botResponse,
            services: services
        });

    } catch (error) {
        console.error("Chat error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
