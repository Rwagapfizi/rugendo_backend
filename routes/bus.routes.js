const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus.controller');

// Routes for the buses resource
router.get('/buses', busController.getAllBuses);
router.post('/buses/add', busController.addBus);
router.post('/buses/login', busController.loginBus);
router.get('/bus/:id', busController.getBusByID);
router.get('/buses/company/:companyID', busController.getBusesByCompanyID);
router.post('/buses/assign', busController.assignBus);
router.get('/buses/getAssigns', busController.getAllAssignments);
router.get('/buses/driverData/:busID', busController.getDriverData);
router.get('/buses/getAssigns/:id', busController.getAssignmentByID);
router.get('/bus/:busID/today/:companyID', busController.getBoughtTicketsForTodayByBusID);
router.get('/bus/:busID/week/:companyID', busController.getLast7DaysRevenueByBusID);
router.get('/bus/:busID/month/:companyID', busController.getBoughtTicketsForCurrentMonthByCompanyID);
router.get('/bus/:busID/lastMonths/:companyID', busController.getLast6MonthsRevenue);
router.put('/buses/update/:id', busController.updateBusByID);
router.delete('/buses/delete/:id', busController.deleteBusByID);

module.exports = router;
