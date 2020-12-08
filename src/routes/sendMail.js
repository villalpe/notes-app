const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const { isAuthenticated } = require('../helpers/auth'); //este es un middleware

router.get('/notes/sendM', isAuthenticated, (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'villalpe5@gmail.com',
      pass: 'Ap5tndp18'
    }
  });
  
  var mailOptions = {
    from: 'villalpe5@gmail.com',
    to: 'villalpe5@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});



