const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

router.get('/deliveries', deliveryController.getAllDeliveries);
 
router.get('/deliveries/:id', deliveryController.getDeliveryByID);

router.get('/deliveries/detailed/:id', deliveryController.getDetailedDeliveryByID);

router.get('/deliveries/company/:companyID', deliveryController.getDeliveriesByCompanyID);

router.post('/deliveries/add', deliveryController.createDelivery);

router.delete('/deliveries/:id', deliveryController.deleteDeliveryByID);

module.exports = router;
