require('dotenv').config();
const express = require('express');
const { Application } = require('../models/application');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Sequelize, sequelize } = require('sequelize');
const { sequelize2 } = require('./connection');
const staticroutes = require('./staticroutes')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rpgillooly@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

router.get('/new-application', (req, res) => {
    res.render('newapplication');
  });

  // Get a specific application by ID
  router.get('/applications/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const application = await Application.findByPk(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.json(application);
    } catch (error) {
      console.error('Error getting application by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Create a new application
  router.post('/applications', async (req, res) => {
    const newApplicationData = req.body;
    try {
      const newApplication = await Application.create(newApplicationData, {
        sequelize: sequelize2, // Use the second Sequelize instance
      });
    
    // Send email to a series of email addresses
    const emailAddresses = ['john.gillooly@irr.com', 'rpgillooly@gmail.com']; // Add your email addresses
    const subject = 'New Application Created On MarinerPropertiesRental.com!';
    const text = `A new Application has been submitted:
    <h1>Property</h1>
    <p>Address Of Property You Want to Rent: ${newApplication.addressOfPropertyYouWantToRent}</p>\n
    <h1>Their Info</h1>\n
    <p>Your Name: ${newApplication.yourName},
      Social Security Number: ${newApplication.socialSecurityNumber},
      Birth Date: ${newApplication.birthDate}</p>\n
      <h1>Present Address</h1>\n
      <p>Present Address ${newApplication.presentAddress},
      City: ${newApplication.city},
      State ${newApplication.state},
      ZIP: ${newApplication.zip},
      Phone: ${newApplication.phone},
      Email: ${newApplication.email},
      City: ${newApplication.presCity}</p>\n
      <h1>Permanent Address</h1>
      <p>Permanent Address: ${newApplication.permanentAddress},
      City: ${newApplication.permCity},
      State: ${newApplication.permState},
      ZIP: ${newApplication.permZip},
      Phone: ${newApplication.permPhone}</p>\n
      <h1>Parent/Guardian Info</h1>
      <p>Parent/Guardian Name: ${newApplication.parentGuardianName},
      Address: ${newApplication.parentAddress},
      City: ${newApplication.parentCity},
      State: ${newApplication.parentState},
      ZIP: ${newApplication.parentZip},
      Phone: ${newApplication.parentPhone}</p>\n
      <h1>Preivous Tenancy</h1>
      <p>Previous Tenant: ${newApplication.previousTenant},
      Previous Rent Amount: ${newApplication.previousRentAmount},
      Landlord/Preceptor's Name: ${newApplication.landlordPreceptorName},
      City: ${newApplication.previousCity},
      State: ${newApplication.previousState},
      ZIP: ${newApplication.previousZip},
      Phone: ${newApplication.previousPhone}</p>\n
      <h1>Source of Funds</h1>
      <p>Source Of Funds: ${newApplication.sourceOfFunds},
      Employer Name: ${newApplication.employerName},
      Source City: ${newApplication.sourceCity},
      Source State: ${newApplication.sourceState},
      Source ZIP: ${newApplication.sourceZip},
      Source Phone: ${newApplication.sourcePhone}</p>\n
      <h1>Credit Info</h1>
      <p>Bank Name: ${newApplication.bankName},
      Bank City: ${newApplication.bankCity},
      Bank State: ${newApplication.bankState},
      Account Number: ${newApplication.accountNumber},
      Average Balance: ${newApplication.averageBalance},
      Credit Card Name: ${newApplication.creditCardName},
      Credit Card Average Balance: ${newApplication.creditCardAverageBalance}</p>\n
      <h1>Personal References</h1>
      <p>Reference One
      Name: ${newApplication.referenceOneName},
      Relation: ${newApplication.referenceOneRelation},
      Years Known: ${newApplication.referenceOneYears},
      City: ${newApplication.referenceOneCity},
      Phone: ${newApplication.referenceOnePhoneNumber}</p>\n
      <p>Reference Two
      Name: ${newApplication.referenceTwoName},
      Relation: ${newApplication.referenceTwoRelation},
      Years Known: ${newApplication.referenceTwoYears},
      City: ${newApplication.referenceTwpCity},
      Phone: ${newApplication.referenceTwpPhoneNumber}</p>\n
      <p>Reference Three
      Name: ${newApplication.referenceThreeName},
      Relation: ${newApplication.referenceThreeRelation},
      Years Known: ${newApplication.referenceThreeYears},
      City: ${newApplication.referenceThreeCity},
      Phone: ${newApplication.referenceThreePhoneNumber}</p>\n
      <h1>Signature and Date:</h1>
      <p>Signature: ${newApplication.signature},
      Date: ${newApplication.date}</p>\n
      `;

    for (const emailAddress of emailAddresses) {
      const mailOptions = {
        from: 'rpgillooly@gmail.com',
        to: emailAddress,
        subject: subject,
        html: text,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
        // Redirect to a success page or do something else
        res.redirect('/about');
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  });
  
  // Update an existing application
  router.put('/applications/:id', async (req, res) => {
    const { id } = req.params;
    const updatedApplicationData = req.body;
    try {
      const application = await Application.findByPk(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      await application.update(updatedApplicationData);
      res.json(application);
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete an application by ID
  router.delete('/applications/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const application = await Application.findByPk(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      await application.destroy();
      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  module.exports = router;
  