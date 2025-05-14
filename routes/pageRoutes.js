const express = require('express');
const router = express.Router();

// In-memory storage (temporary)
let contactSubmissions = [];

// Sample data
const teamInfo = [
  { name: 'Anele Nkayi', role: 'Team Leader' },
  { name: 'Jan Saayman', role: 'Frontend Developer' },
  { name: 'Itumeleng Kekana', role: 'Backend Developer' },
  { name: 'Tiisetso Keraetswe', role: 'Data Manager' }
];

function dateConverter(dateString) {
  const date = new Date(dateString);

  const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', options);

  return formattedDate;
}

const events = [
  {
    title: 'Kelvin Momo Exclusive',
    date: dateConverter('2025-05-23'),
    location: 'Pretoria',
    image: 'images/pic1.jpg',
    link: 'https://computicket.com/event/kelvin_momo_exclusive_/66e21ff5-0f58-47a1-a125-9da11984a3b8'
  },
  {
    title: 'Easy Sunday Soul Session Picnic',
    date: dateConverter('2025-06-29'),
    location: 'Pretoria',
    image: 'images/pic2.jpg',
    link: 'https://computicket.com/event/easy_sunday_soul_sessions_picnic_pretoria/3c1a3c30-6f50-475c-99e9-c7b3373b80d2'
  },
  {
    title: 'Spirit Of Praise 11 Live Recording',
    date: dateConverter('2025-06-28'),
    location: 'Pretoria',
    image: 'images/pic3.jpeg',
    link: 'https://computicket.com/event/spirit_of_praise_11_live_recording/7322327'
  },
  {
    title: 'Mother\'s Day Celebration',
    date: dateConverter('2025-05-17'),
    location: 'Pretoria',
    image: 'images/pic4.jpg',
    link: 'https://computicket.com/event/pretoria_mother_s_day_celebration_/23e66998-4ce9-452e-83d1-4d4e8a23db52'
  },
  {
    title: 'Zoo Womens Day Celebration',
    date: dateConverter('2025-08-09'),
    location: 'Pretoria',
    image: 'images/pic5.jpg',
    link: 'https://computicket.com/event/pretoria_zoo_womens_day_celebration/1175a212-a239-4254-8797-3e6f6ac0a601'
  },
  {
    title: 'Doek On Fleek Mothers Day',
    date: dateConverter('2025-06-01'),
    location: 'Pretoria',
    image: 'images/pic6.jpg',
    link: 'https://computicket.com/event/doek_on_fleek_mothers_day_pretoria/04c4e02b-8366-45aa-8dfb-eb349c790f0A'
  },
  {
    title: 'Women\'s Month Celebration',
    date: dateConverter('2025-08-09'),
    location: 'Pretoria',
    image: 'images/pic7.jpg',
    link: 'https://computicket.com/event/pretoria_women_s_month_celebration_/c43caa01-64f8-4bd6-be81-4857698a996b'
  },
  {
    title: 'Doek On Fleek Womens Day Picnic',
    date: dateConverter('2025-08-23'),
    location: 'Pretoria',
    image: 'images/pic8.jpg',
    link: 'https://computicket.com/event/doek_on_fleek_womens_day_picnic_pretoria/8518a37d-024c-4d80-9e09-781e02daa9f6'
  },
  {
    title: 'Doek On Fleek Gospel Picnic',
    date: dateConverter('2025-10-11'),
    location: 'Pretoria',
    image: 'images/pic9.jpg',
    link: 'https://computicket.com/event/doek_on_fleek_gospel_picnic_pretoria/cfd16fc7-b321-45c8-93f6-e31541b95f15'
  },
  {
    title: 'Summer Picnic With Ntando & Friends',
    date: dateConverter('2025-05-24'),
    location: 'Pretoria',
    image: 'images/pic10.jpg',
    link: 'https://computicket.com/event/pretoria_summer_picnic_with_ntando_friends/783bd8e3-c8b4-444f-b364-aef77a1e738M'
  },
  {
    title: 'Pitori Kota Festival - Fountains Valley',
    date: dateConverter('2025-11-29'),
    location: 'Pretoria',
    image: 'images/pic11.jpg',
    link: 'https://computicket.com/event/pitori_kota_festival_fountains_valley_pretoria_/70bb93cf-b3ce-499d-82d7-e80b89b72715'
  },
  {
    title: 'Jolly Picnic Saturday',
    date: dateConverter('2025-07-19'),
    location: 'Pretoria',
    image: 'images/pic12.jpg',
    link: 'https://computicket.com/event/pretoria_jolly_picnic_saturday_/ce15d0c5-e974-427b-a01c-fde571aeeb21'
  },
];

router.get('/', (req, res) => {
  res.render('pages/home', { 
    currentPage: 'home',
    title: 'Home - Community Portal',
    events : events, 
    user: req.session.user
  });
});

router.get('/about', (req, res) => {
  res.render('pages/about', { 
    currentPage: 'about',
    title: 'About Us - Community Portal',
    team: teamInfo, 
    user: req.session.user
  });
});

router.get('/events', (req, res) => {
  const searchQuery = req.query.search?.toLowerCase() || '';

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery)
  );

   // Sort by date (soonest first)
  filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.render('pages/events', { 
    currentPage: 'events',
    title: 'Events - Community Portal',
    u_events: events,
    events: filteredEvents,
    search: req.query.search, // send it back to keep input filled
    user: req.session.user 
  });
});

router.get('/contact', (req, res) => {
  res.render('pages/contact', { 
    currentPage: 'contact',
    title: 'Contact Us - Community Portal', 
    user: req.session.user
  });
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  contactSubmissions.push({ name, email, message });
  res.redirect('/thankyou');
});

router.get('/thankyou', (req, res) => {
  res.render('pages/thankyou', { 
    currentPage: 'thankyou', 
    title: 'Thank You', 
    user: req.session.user });
});

module.exports = router;