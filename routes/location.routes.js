const express = require('express');
const router = express.Router();
const stationController = require('../controllers/location.controller');

// // Get all stations
// router.get('/stations', stationController.getAllStations);

// // Create a new station
// router.post('/stations/add', stationController.createStation);

// // Delete a station by ID
// router.delete('/stations/:id', stationController.deleteStationByID);

// Get all locations
router.get('/locations', stationController.getAllLocations);

// Get location by ID
router.get('/location/:id', stationController.getLocationByID);

// Get prices standards from Locations
router.get('/prices/:fromLocationID/:toLocationID', stationController.getPricesFromLocations);

// Create a new location
router.post('/locations/add', stationController.createLocation);

// Delete a location by ID
router.delete('/locations/delete/:id', stationController.deleteLocationByID);

module.exports = router;
