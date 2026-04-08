const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');
const Review = require('../models/Review');

dotenv.config();

const servicesData = [
  {
    name: 'CoolBreeze AC Services',
    category: 'AC Repair',
    location: 'Mumbai',
    price: '₹500 - ₹1200',
    rating: 4.8,
    reviewCount: 2,
    contact_info: '+91 9876543210',
    is_verified: true
  },
  {
    name: 'Ramesh Electricals',
    category: 'Electrician',
    location: 'Delhi',
    price: '₹300 Per Hour',
    rating: 4.2,
    reviewCount: 1,
    contact_info: '+91 8888888888',
    is_verified: true
  },
  {
    name: 'PureDrop RO Service',
    category: 'Water Purifier',
    location: 'Bangalore',
    price: '₹400 Fixed',
    rating: 4.9,
    reviewCount: 5,
    contact_info: '+91 9999999999',
    is_verified: true
  },
  {
    name: 'Glow Up Home Salon',
    category: 'Salon',
    location: 'Mumbai',
    price: '₹1500 - ₹3000',
    rating: 4.5,
    reviewCount: 3,
    contact_info: '+91 7777777777',
    is_verified: false
  },
  {
    name: 'Sharma Math Tutors',
    category: 'Tutor',
    location: 'Delhi',
    price: '₹5000/Month',
    rating: 4.7,
    reviewCount: 10,
    contact_info: '+91 6666666666',
    is_verified: true
  },
  {
    name: 'Anita Maid Cleaning',
    category: 'Maid',
    location: 'Hyderabad',
    price: '₹2000/Month',
    rating: 4.1,
    reviewCount: 4,
    contact_info: '+91 5555555555',
    is_verified: false
  },
  {
    name: 'Speedy Mechanics 24/7',
    category: 'Mechanic',
    location: 'Bangalore',
    price: '₹800+',
    rating: 4.6,
    reviewCount: 8,
    contact_info: '+91 4444444444',
    is_verified: true
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://soorajidpcse_db_user:jntuhroot@m0.h368xus.mongodb.net/nearnest')
  .then(async () => {
    console.log('MongoDB connected for seeding...');
    
    await Service.deleteMany({});
    await Review.deleteMany({});
    
    const createdServices = await Service.insertMany(servicesData);
    
    await Review.create({
        service_id: createdServices[0]._id,
        text: 'The AC repair was super quick and the technician was very polite. Highly recommended in Mumbai!',
        rating: 5,
        ai_sentiment_score: 'Positive'
    });
    
    console.log('Database seeded successfully completely with Indian dummy data!');
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
