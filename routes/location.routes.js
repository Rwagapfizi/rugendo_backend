const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

// // Get all stations
// router.get('/stations', stationController.getAllStations);

// // Create a new station
// router.post('/stations/add', stationController.createStation);

// // Delete a station by ID
// router.delete('/stations/:id', stationController.deleteStationByID);

// Get all locations
router.get('/locations', locationController.getAllLocations);

// Get location by ID
router.get('/location/:id', locationController.getLocationByID);

// Get prices standards from Locations
router.get('/prices/:fromLocationID/:toLocationID', locationController.getPricesFromLocations);

// Create a new location
router.post('/locations/add', locationController.createLocation);

// Delete a location by ID
router.delete('/locations/delete/:id', locationController.deleteLocationByID);

// Get all routes stops
router.get('/routesStops', locationController.getAllRoutesStops);

// Get routes stop by ID
router.get('/routesStop/:id', locationController.getRoutesStopByID);

// Get prices standards from Locations
router.get('/routesStop/locate/:fromLocationID/:toLocationID', locationController.getRoutesStopByLocationsID);

// Create a new routes stop 
router.post('/routesStops/add', locationController.createRoutesStop);

// Delete a routes stop by ID
router.delete('/routesStops/delete/:id', locationController.deleteRoutesStopByID);

module.exports = router;
