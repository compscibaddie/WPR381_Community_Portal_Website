const express = require('express');
const router = express.Router();

// In-memory storage (temporary)
let contactSubmissions = [];

// Sample data
const teamInfo = [
  { name: 'Anele Nkayi', role: 'Team Lead' },
  { name: 'Jan Saayman', role: 'Frontend Developer' },
  { name: 'Itumeleng Kekana', role: 'Backend Developer' },
  { name: 'Tiisetso Keraetswe', role: 'Data Manager' }
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

router.get('/', (req, res) => {
  res.render('pages/home', { 
    currentPage: 'home',
    title: 'Home - Community Portal'
  });
});

router.get('/about', (req, res) => {
  res.render('pages/about', { 
    currentPage: 'about',
    title: 'About Us - Community Portal',
    team: teamInfo
  });
});

router.get('/events', (req, res) => {
  res.render('pages/events', { 
    currentPage: 'events',
    title: 'Events - Community Portal',
    events: events
  });
});

router.get('/contact', (req, res) => {
  res.render('pages/contact', { 
    currentPage: 'contact',
    title: 'Contact Us - Community Portal'
  });
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  contactSubmissions.push({ name, email, message });
  res.redirect('/thankyou');
});

router.get('/thankyou', (req, res) => {
  res.render('pages/thankyou', { title: 'Thank You' });
});

module.exports = router;