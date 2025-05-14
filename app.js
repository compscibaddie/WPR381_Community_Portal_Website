const express = require('express');
const path = require('path');
const app = express();
const pageRoutes = require('./routes/pageRoutes');
const nodemailer = require('nodemailer')//for email sending
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
require('./config/passport')(passport);

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

// DB connection
mongoose.connect('mongodb://localhost:27017/community_portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'yourSecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('pages/home', { 
    title: 'Home',
    currentPage: 'home', 
    events: events,
    user: req.session.user // 👈 this is important
  });
});

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set views folder for EJS templates
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like images and CSS)
console.log('Static file directory: ', path.join(__dirname, 'public'))
app.use(express.static(path.join(__dirname, 'public')));


// Middleware to parse form data
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Use the routes defined in pageRoutes.js
app.use('/', pageRoutes);

//storage for submissions
const submissions = [];

//transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kekanaitumeleng25@gmail.com', //change here to test
    pass: 'hoht ouud sbwr kmqf'
  }
})

app.post('/submit', async (req, res) => {
  const{name, email, message} = req.body;
  submissions.push({name, email, message});
  console.log(`Form Submission: ${name}, ${email}, ${message}`) //log the submittions

  //email for the organization
  const organizationMail = {
    from: `${email}`,
    to: 'kekanaitumeleng25@gmail.com',//add personal email for testing
    subject: 'New Form Submission',
    html: `<p>You have received a new contact form submission:</p>
               <ul>
                   <li>Name: ${name}</li>
                   <li>Email: ${email}</li>
                   <li>Message: ${message}</li>
               </ul>`
  }
  //email for the user
  const userMail = {
    from: 'kekanaitumeleng25@gmail.com', //add personal email to test
    to: `${email}`,
    subject: 'Thank you for Contacting Us',
    html: `<p>Dear ${name},</p>
               <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
               <p>Your message was:</p>
               <p>${message}</p>
               <p>Sincerely,<br>The Community Portal Team</p>`
  }
  try{
        //send email to our organisation
        await transporter.sendMail(organizationMail);
        console.log('Email sent to organization');

        //email to the user
        await transporter.sendMail(userMail)
        console.log('Email sent to the user')

        res.status(200).json({ success: true }); // Send JSON on success
    } catch(err) {
        console.error(`Error sending email: ${err}`)
        res.status(500).json({success: false, message: 'Error sending email. Please try again later.'})
        // res.redirect('/contact?error=true') // No redirect here, the client handles the error
    }
})
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});