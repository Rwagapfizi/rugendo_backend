const express = require('express');
const router = express.Router();
const checkUserRole = require('../middlewares/checkUserRole.middleware');
const BoughtTicketController = require('../controllers/boughtTicket.controller');

// Create a new bought ticket
router.post('/bought-tickets/add', BoughtTicketController.createBoughtTicket);

// Get all tickets bought by Customer
router.get('/bought-tickets', BoughtTicketController.getAllBoughtTickets);

// Get all tickets bought by Customer
router.get('/bought-tickets/:id', BoughtTicketController.getBoughtTicketByID);

// Generate Receipts
router.get('/bought-tickets/receipts/user', BoughtTicketController.generateReceipts);

// Generate Receipt of Bought Ticket of given ID
router.get('/bought-tickets/receipts/:id', BoughtTicketController.generateSingleReceipt);

//Get all bought tickets from company of logged in Worker
router.get('/bought-tickets/company', checkUserRole(['WORKER', 'MANAGER']), BoughtTicketController.getAllCompanyTickets);

// Route to get boughtTickets by companyID
router.get('/bought-tickets/company/:companyID', BoughtTicketController.getBoughtTicketsByCompanyID);

// Route to get boughtTickets by companyID
router.get('/bought-tickets/company/:companyID/today', BoughtTicketController.getBoughtTicketsByCompanyIDToday);

// Route to get boughtTickets by companyID
router.get('/bought-tickets/company/:companyID/today/assigned', BoughtTicketController.getAssignedBoughtTicketsByCompanyIDToday);

// Get Bought Tickets for today's date
router.get('/bought-tickets/today', BoughtTicketController.getBoughtTicketsForToday);

// Get Bought Tickets for today\'s date by Company ID
router.get('/bought-tickets/today/:companyID', BoughtTicketController.getBoughtTicketsForTodayByCompanyID);

// Get Bought Tickets for current week by Company ID
router.get('/bought-tickets/week/:companyID', BoughtTicketController.getLast7DaysRevenue);

// Get Bought Tickets for current month by Company ID
router.get('/bought-tickets/month/:companyID', BoughtTicketController.getBoughtTicketsForCurrentMonthByCompanyID);

// Get Bought Tickets for the last 5 months by Company ID
router.get('/bought-tickets/lastMonths/:companyID', BoughtTicketController.getLast6MonthsRevenue);

// Get Bought Tickets for the selected date by Company ID
router.get('/bought-tickets/boughtDate/:companyID/:date', BoughtTicketController.getBoughtTicketsByDateAndCompanyID);

// Get Bought Tickets for the selected date by Company ID
router.get('/bought-tickets/date/:companyID/:selectedDate', BoughtTicketController.getBoughtTicketsByDate);

// Route to update ticketDate by ID
router.put('/bought-tickets/update-date/:id',BoughtTicketController.updateTicketDate);

// Delete a bought ticket by ID
router.put('/bought-tickets/cancel/:id', BoughtTicketController.cancelBoughtTicketByID);

// Delete a bought ticket by ID
router.delete('/bought-tickets/delete/:id', checkUserRole(['WORKER']), BoughtTicketController.deleteBoughtTicketByID);

module.exports = router;
