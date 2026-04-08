const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const serviceRoutes = require('./routes/serviceRoutes');

dotenv.config();

const app = express();

// CORS: allow Vercel frontend + localhost for dev
app.use(cors({
  origin: [
    'https://ai-local-service-recommendation-pla.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://soorajidpcse_db_user:jntuhroot@m0.h368xus.mongodb.net/nearnest')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'NearNest Server' });
});

app.use('/api/services', serviceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});
