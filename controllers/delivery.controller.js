const Delivery = require('../models/delivery.model');

const getAllDeliveries = (req, res) => {
    // #swagger.tags = ['Delivery']
    // #swagger.description = 'Endpoint to get all Deliveries'
    Delivery.getAll((error, deliveries) => {
        if (error) {
            console.error('Failed to fetch deliveries:', error);
            res.status(500).json({ error: 'Failed to fetch deliveries' });
        } else {
            res.status(200).json(deliveries);
        }
    });
};

const getDeliveryByID = (req, res) => {
    // #swagger.tags = ['Delivery']
    // #swagger.description = 'Endpoint to get a Delivery by ID'
    const deliveryID = req.params.id;
    Delivery.getByID(deliveryID, (error, delivery) => {
        if (error) {
            console.error('Error fetching delivery by ID:', error);
            res.status(500).json({ error: 'Failed to fetch delivery' });
        } else if (!delivery) {
            res.status(404).json({ error: 'Delivery not found' });
        } else {
            res.status(200).json(delivery);
        }
    });
};

const getDetailedDeliveryByID = (req, res) => {
    // #swagger.tags = ['Delivery']
    // #swagger.description = 'Endpoint to get a Detailed Delivery by ID'
    const deliveryID = req.params.id;
    Delivery.getDeliveryDetailsByID(deliveryID, (error, delivery) => {
        if (error) {
            console.error('Error fetching delivery by ID:', error);
            res.status(500).json({ error: 'Failed to fetch detailed delivery' });
        } else if (!delivery) {
            res.status(404).json({ error: 'Delivery not found' });
        } else {
            res.status(200).json(delivery);
        }
    });
};

const getDeliveriesByCompanyID = (req, res) => {
    // #swagger.tags = ['Delivery']
    // #swagger.description = 'Endpoint to get all deliveries of the given companyID'
    const { companyID } = req.params;

    Delivery.getAllByCompanyID(companyID, (error, deliveries) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch deliveries' });
        }

        if (!deliveries || deliveries.length === 0) {
            return res.status(404).json({ message: 'No deliveries found for the provided companyID' });
        }

        res.status(200).json( deliveries );
    });
};

const createDelivery = (req, res) => {
    // #swagger.tags = ['Delivery']
    // #swagger.description = 'Endpoint to create a Delivery'
    const { SenderID, TicketFormatID, Description, ReceiverName, ReceiverPhone, DeliveryDate, TimeForDelivery } = req.body;

    const newDelivery = {
        SenderID,
        TicketFormatID,
        Description,
        ReceiverName,
        ReceiverPhone,
        DeliveryDate,
        TimeForDelivery
    };

    Delivery.create(newDelivery, (createError, createdDelivery) => {
        if (createError) {
            console.error('Failed to create delivery:', createError);
            res.status(500).json({ error: 'Failed to create delivery' });
        } else {
            res.status(201).json({ message: 'Delivery created successfully', delivery: createdDelivery });
        }
    });
};

const deleteDeliveryByID = (req, res) => {
    // #swagger.tags = ['Delivery']
    // #swagger.description = 'Endpoint to delete a Delivery by its ID'
    const deliveryID = req.params.id;

    Delivery.deleteByID(deliveryID, (deleteError, deletedDelivery) => {
        if (deleteError) {
            console.error('Failed to delete delivery:', deleteError);
            res.status(500).json({ error: 'Failed to delete delivery' });
        } else if (!deletedDelivery) {
            res.status(404).json({ error: 'Delivery not found' });
        } else {
            res.status(200).json({ message: 'Delivery deleted successfully' });
        }
    });
};

module.exports = {
    getAllDeliveries,
    getDeliveryByID,
    getDetailedDeliveryByID,
    getDeliveriesByCompanyID,
    createDelivery,
    deleteDeliveryByID
};
