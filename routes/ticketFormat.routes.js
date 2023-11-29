const express = require('express');
const router = express.Router();
const checkUserRole = require('../middlewares/checkUserRole.middleware');
const TicketFormatController = require('../controllers/ticketFormat.controller');

// Create a new ticket format
router.post('/ticket-formats/add', checkUserRole(['WORKER']), TicketFormatController.createTicketFormat);

// Get all ticket formats
router.get('/ticket-formats', TicketFormatController.getAllTicketFormats);

// Get all ticket formats
router.get('/ticket-formats/:id', TicketFormatController.getTicketFormatByID);

// Express route
router.get('/ticket-formats/by-company/:companyID', TicketFormatController.getTicketFormatsByCompany);

// Express route
router.get('/ticket-formats/locate/:companyID/:origin/:destination', TicketFormatController.getTicketFormatsByLocationsAndCompany);

// Get all ticket formats with details
router.get('/ticket-formats/detailed/all', TicketFormatController.getDetailedTicketFormats);

// Get a ticket formats with details by ID
router.get('/ticket-formats/detailed/:id', TicketFormatController.getDetailedTicketFormatByID);

// Update a ticket format by ID
router.put('/ticket-formats/update/:id', TicketFormatController.updateTicketFormatByID);

// Delete a ticket format by ID
router.delete('/ticket-formats/delete/:id', checkUserRole(['WORKER']), TicketFormatController.deleteTicketFormatByID);

module.exports = router;
