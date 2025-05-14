const express = require('express');
const router = express.Router();
const Event = require('../models/event'); // Adjust path if needed

// Show events page
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.render('pages/events', {
      events: events,
      user: req.user // Important: Pass user to the view
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Handle event submission
router.post('/events', async (req, res) => {
  if (!req.user) {
    return res.status(403).send('Unauthorized');
  }

  const { title, description, date } = req.body;
  try {
    const newEvent = new Event({ title, description, date });
    await newEvent.save();
    res.redirect('/events');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving event');
  }
});

module.exports = router;