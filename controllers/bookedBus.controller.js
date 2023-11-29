const BookedBus = require('../models/bookedBus.model');

const bookedBusController = {
    getAllBookedBuses: (req, res) => {
        // #swagger.tags = ['Booked Buses']
        // #swagger.description = 'Endpoint to get all booked bus'
        BookedBus.getAll((error, bookedBuses) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch booked buses.' });
            }
            return res.status(200).json(bookedBuses);
        });
    },

    getBookedBusByID: (req, res) => {
        // #swagger.tags = ['Booked Buses']
        // #swagger.description = 'Endpoint to get a booked bus by ID'
        const id = req.params.id;
        BookedBus.getByID(id, (error, bus) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch booked bus.' });
            }
            if (!bus) {
                return res.status(404).json({ message: 'Booked bus not found.' });
            }
            res.status(200).json(bus);
        });
    },

    getBookedBusByCompanyID: (req, res) => {
        // #swagger.tags = ['Booked Buses']
        // #swagger.description = 'Endpoint to get a booked bus by Company ID'
        const companyID = req.params.companyID;
        BookedBus.getByCompanyID(companyID, (error, buses) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch booked bus.' });
            }
            if (!buses) {
                return res.status(404).json({ message: 'Company has no booked bus.' });
            }

            res.status(200).json(buses);
        });
    },

    getDetailedBookedBusByID : (req, res) => {
        // #swagger.tags = ['Booked Buses']
        // #swagger.description = 'Endpoint to get a Detailed Booked Bus by ID'
        const id = req.params.id;
        BookedBus.getDetailedByID(id, (error, bookedBus) => {
            if (error) {
                console.error('Error fetching booked bus by ID:', error);
                res.status(500).json({ error: 'Failed to fetch detailed booked bus' });
            } else if (!bookedBus) {
                res.status(404).json({ error: 'Booked Bus not found' });
            } else {
                res.status(200).json(bookedBus);
            }
        });
    },

    readBookedBus : (req, res) => {
        // #swagger.tags = ['Booked Buses']
        // #swagger.description = 'Endpoint to read a Booked Bus'
        const id = req.params.id;
        BookedBus.updateBookedBusToRead(id, (error, bookedBus) => {
            if (error) {
                console.error('Error fetching booked bus by ID:', error);
                res.status(500).json({ error: 'Failed to fetch detailed booked bus' });
            } else if (!bookedBus) {
                res.status(404).json({ error: 'Booked Bus not found' });
            } else {
                res.status(200).json({bookedBus, message: 'Reservation read'});
            }
        });
    },

    createBookedBus: (req, res) => {
        // #swagger.tags = ['Booked Buses']
        // #swagger.description = 'Endpoint to create a booked bus'
        const { customerID, companyID, busID, originLocationID, destinationLocationID, tripDate, numOfPeople } = req.body;
        const bookedBusData = { customerID, companyID, busID, originLocationID, destinationLocationID, tripDate, numOfPeople };

        BookedBus.create(bookedBusData, (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to create booked bus.' });
            }
            return res.status(201).json({ message: 'Private Bus booked successfully', bookedBus: result });
        });
    },

    deleteBookedBusByID: (req, res) => {
        // #swagger.tags = ['Booked Buses']
        // #swagger.description = 'Endpoint to delete a booked bus by ID'
        const id = req.params.id;
        BookedBus.deleteByID(id, (error, deletedBus) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to delete the bus.' });
            }
            if (!deletedBus) {
                return res.status(404).json({ message: 'Booked bus not found.' });
            }
            res.status(200).json(deletedBus);
        });
    },
};

module.exports = bookedBusController