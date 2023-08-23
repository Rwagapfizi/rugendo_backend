const express = require('express');
const router = express.Router();
const checkUserRole = require('../middlewares/checkUserRole.middleware');
const TicketFormatController = require('../controllers/ticketFormat.controller');

// Create a new ticket format
router.post('/ticket-formats/add',checkUserRole(['WORKER']), TicketFormatController.createTicketFormat);

// Get all ticket formats
router.get('/ticket-formats', TicketFormatController.getAllTicketFormats);

// Delete a ticket format by ID
router.delete('/ticket-formats/delete/:id', checkUserRole(['WORKER']), TicketFormatController.deleteTicketFormatByID);

module.exports = router;
