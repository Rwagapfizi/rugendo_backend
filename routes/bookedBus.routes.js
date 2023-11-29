const express = require('express');
const router = express.Router();
const bookedBusController = require('../controllers/bookedBus.controller');

router.get('/bookedBuses/all', bookedBusController.getAllBookedBuses);
router.get('/bookedBuses/:id', bookedBusController.getBookedBusByID);
router.get('/bookedBuses/company/:companyID', bookedBusController.getBookedBusByCompanyID);
router.get('/bookedBuses/detailed/:id', bookedBusController.getDetailedBookedBusByID);
router.put('/bookedBuses/read/:id', bookedBusController.readBookedBus);
router.post('/bookedBuses/add', bookedBusController.createBookedBus);
router.post('/bookedBuses/delete/:id', bookedBusController.deleteBookedBusByID);

module.exports = router;
