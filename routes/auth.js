const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const user = require('../models/user');

// Signup GET
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up', currentPage: 'signup' });
});

// Signup POST
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', {
      title: 'Sign Up',
      currentPage: 'signup',
      error: 'Email already exists. Please try another one.'
    });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await newUser.save();
    req.session.user = newUser; // Store user in session
    res.redirect('/'); // Redirect to home page after signup
    console.log('Received signup data:', req.body);
  } catch (err) {
  console.error('Signup error:', err); // check console for exact issue
  res.render('signup', {
    title: 'Sign Up',
    currentPage: 'signup',
    error: err.message // show actual error for now
  });
}
  }
);

// Login GET
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', currentPage: 'login', user: req.session.user });
});

// Login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        title: 'Login',
        error: 'Account not found. Please sign up.',
        currentPage: 'login'
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', {
        title: 'Login',
        currentPage: 'login',
        error: 'Invalid username or password'
      });
    }

    // Success - store user in session
    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { 
        title: 'Login',
        currentPage: 'login',
        error: 'Something went wrong. Please try again' });
  }
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/login');
    });
  });
});

module.exports = router;