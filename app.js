const express = require('express');
const path = require('path');
const app = express();
const pageRoutes = require('./routes/pageRoutes');
const nodemailer = require('nodemailer')//for email sending

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