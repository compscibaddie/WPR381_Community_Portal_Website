const express = require('express');
const router = express.Router();

// In-memory storage (temporary)
let contactSubmissions = [];

// Sample data
const teamInfo = [
  { name: 'Alice', role: 'Team Lead' },
  { name: 'Bob', role: 'Frontend Developer' },
  { name: 'Charlie', role: 'Backend Developer' },
  { name: 'Dana', role: 'Data Manager' }
];

const events = [
  {
    title: 'Community Picnic',
    date: '2025-06-10',
    location: 'Central Park',
    image: '/images/picnic.jpg'
  },
  {
    title: 'Charity Run',
    date: '2025-07-15',
    location: 'Riverside Trail',
    image: '/images/charity-run.jpg'
  }
];

// Routes

// Home
router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Home' });
});

// About
router.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About Us', team: teamInfo });
});

// Events
router.get('/events', (req, res) => {
  res.render('pages/events', { title: 'Events', events });
});

// Contact
router.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact Us' });
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  contactSubmissions.push({ name, email, message });
  res.redirect('/thankyou');
});

// Thank You
router.get('/thankyou', (req, res) => {
  res.render('pages/thankyou', { title: 'Thank You' });
});

module.exports = router;