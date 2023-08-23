const express = require('express');
const router = express.Router();
const checkUserRole = require('../middlewares/checkUserRole.middleware');
const BoughtTicketController = require('../controllers/boughtTicket.controller');

// Create a new bought ticket
router.post('/bought-tickets/add', BoughtTicketController.createBoughtTicket);

// Get all tickets bought by Customer
router.get('/bought-tickets', BoughtTicketController.getAllBoughtTickets);

// Generate Receipts
router.get('/bought-tickets/receipts', BoughtTicketController.generateReceipt);

//Get all bought tickets from company of logged in Worker
router.get('/bought-tickets/company', checkUserRole(['WORKER']), BoughtTicketController.getAllCompanyTickets);

// Delete a bought ticket by ID
router.delete('/bought-tickets/delete/:id', checkUserRole(['WORKER']), BoughtTicketController.deleteBoughtTicketByID);

module.exports = router;
