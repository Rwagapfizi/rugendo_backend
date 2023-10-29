require('dotenv').config()
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');

// Create access token for MOMO API
router.post('/mtn-token', async (req, res) => {
    try {
        const headers = {
            'Authorization': process.env.MOMO_AUTH_TOKEN, // Replace with your actual MTN auth token
            'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY, // Replace with your actual subscription key
            'Content-Type': 'application/json',
        };

        const response = await fetch('https://mtndeveloperapi.portal.mtn.co.rw/collection/token/', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body),
        });

        // console.log("Request header: ", headers)

        if (response.ok) {
            const data = await response.json();
            // console.log("Response: ", data)
            res.status(200).json(data);
        } else {
            console.error('Failed to fetch access token:', response.status, response.statusText);
            res.status(response.status).send(response.statusText);
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).send('Internal Server Error');
    }
});  

router.post('/requestToPay', async (req, res) => {
    try {
        // Define the headers here
        const headers = {
            'Authorization': `${req.headers.authorization}`, // Pass the authorization header from the frontend
            'X-Reference-Id': req.headers['x-reference-id'], // Pass the X-Reference-Id header from the frontend
            'X-Target-Environment': 'mtnrwanda',
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY,
        };
        // console.log("Request Body: ",req.body) 
        // console.log("Request header: ", headers)


        // Make the POST request to the MTN API
        const response = await fetch('https://mtndeveloperapi.portal.mtn.co.rw/collection/v1_0/requesttopay', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body),
        });

        // console.log("Response: ", response)
        // Check the status code
        if (response.status === 202) {
            
            const data = {
                'Status': response.status
            }
            // console.log("Response Data: ", data)
            res.status(202).json(data);
            
        } else {
            console.error('Failed to request buy:', response.status, response.statusText);
            res.status(response.status).send(response.statusText);
        }
        // res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error proxying MTN requestToPay request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch payment status by referenceId
router.get('/mtn-payment-status/:referenceId', async (req, res) => {
    try {
        // Get the referenceId from the request parameters
        const { referenceId } = req.params;

        // Implement logic to fetch payment status from the MTN API based on the referenceId
        const headers = {
            'Authorization': `${req.headers.authorization}`, // Pass the authorization header from the frontend
            // 'X-Reference-Id': req.headers['x-reference-id'], // Pass the X-Reference-Id header from the frontend
            'X-Target-Environment': 'mtnrwanda',
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY,
        };
        const apiUrl = `https://mtndeveloperapi.portal.mtn.co.rw/collection/v1_0/requesttopay/${referenceId}`;

        // console.log("Reference ID:", referenceId);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });
        // console.log("Response: ", response)

        if (response.status === 200) {
            const data = await response.json();
            // console.log("Response Data: ", data)
            res.status(200).json(data); // Assuming the payment status is available in the 'status' property
        } else {
            console.error('Failed to fetch payment status from MTN API:', response.status, response.statusText);
            res.status(500).json({ error: 'Failed to fetch payment status from MTN API' });
        }
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for sending a ticket by email
router.post('/send-to-email', async (req, res) => {
    try {
        const { emailData } = req.body;

        const email = req.headers['email'];
        const emailSubject = req.headers['subject'];
        // console.log("Headers: ", req.headers)
        // console.log(email)
        // Create a transporter object
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Use your email service provider
            auth: {
                user: process.env.SENDER_EMAIL, // Replace with your email
                pass: process.env.SENDER_EMAIL_PASSWORD, // Replace with your password or use environment variables
            },
            tls: {
                rejectUnauthorized: false, // Accept self-signed certificates
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Replace with your email
            to: email, // Recipient's email address
            subject: emailSubject,
            html: emailData,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            // console.log(info)
            if (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Failed to send the email.' });
            } else {
                // console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Email sent successfully.' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
