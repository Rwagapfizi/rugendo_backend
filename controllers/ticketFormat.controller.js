const TicketFormat = require('../models/ticketFormat.model');
const Company = require('../models/company.model')

const createTicketFormat = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to create a Ticket Format'
    const { originLocation, destinationLocation, ticketTime, distance, duration, price, companyID } = req.body;

    // Check if the company with the given companyID exists
    Company.getById(companyID, (companyError, existingCompany) => {
        if (companyError) {
            console.error('Failed to fetch company:', companyError);
            return res.status(500).json({ error: 'Failed to create ticket format' });
        }

        if (!existingCompany) {
            return res.status(400).json({ error: 'Company with the given ID does not exist' });
        }

        const newTicketFormat = {
            originLocation,
            destinationLocation,
            ticketTime,
            distance,
            duration,
            price,
            companyID
        };

        TicketFormat.create(newTicketFormat, (createError, result) => {
            if (createError) {
                console.error('Failed to create ticket format:', createError);
                res.status(500).json({ error: 'Failed to create ticket format' });
            } else {
                res.status(201).json({ message: 'Ticket format created successfully', ticketFormat: result });
            }
        });
    });
};

const getAllTicketFormats = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to get all Ticket Formats'
    TicketFormat.getAll((error, ticketFormats) => {
        if (error) {
            console.error('Failed to fetch ticket formats:', error);
            res.status(500).json({ error: 'Failed to fetch ticket formats' });
        } else {
            res.status(200).json({ ticketFormats });
        }
    });
};

const deleteTicketFormatByID = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to delete a Ticket Format by its ID'
    const ticketFormatID = req.params.id;

    TicketFormat.deleteByID(ticketFormatID, (deleteError, deletedTicketFormat) => {
        if (deleteError) {
            console.error('Failed to delete ticket format:', deleteError);
            res.status(500).json({ error: 'Failed to delete ticket format' });
        } else if (!deletedTicketFormat) {
            res.status(404).json({ error: 'Ticket format not found' });
        } else {
            res.status(200).json({ message: 'Ticket format deleted successfully' });
        }
    });
};

module.exports = {
    createTicketFormat,
    getAllTicketFormats,
    deleteTicketFormatByID
};
