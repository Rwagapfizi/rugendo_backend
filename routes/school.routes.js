const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/school.controller');

// Get all schools
router.get('/schools', schoolController.getAllSchools);

// Get a school by ID
router.get('/school/:id', schoolController.getSchoolByID);

// Create a new school
router.post('/schools/add', schoolController.createSchool);

// Delete a school by ID
router.delete('/schools/:id', schoolController.deleteSchoolByID);

// Get all school destinations
router.get('/schoolDestinations', schoolController.getAllSchoolDestinations);

// Get school destination by ID
router.get('/schoolDestination/:id', schoolController.getSchoolDestinationByID);

// Create a new school destination
router.post('/schoolDestinations/add', schoolController.createSchoolDestination);

// Delete a school destination by ID
router.delete('/schoolDestinations/delete/:id', schoolController.deleteSchoolDestinationByID);

router.get('/schoolBuses/all', schoolController.getAllSchoolBuses);
router.get('/schoolBuses/:id', schoolController.getSchoolBusByID);
router.get('/schoolBuses/detailed/:id', schoolController.getDetailedSchoolBusByID);
router.post('/schoolBuses/add', schoolController.createSchoolBus);
router.post('/schoolBuses/delete/:id', schoolController.deleteSchoolBusByID);

module.exports = router;


module.exports = router;
