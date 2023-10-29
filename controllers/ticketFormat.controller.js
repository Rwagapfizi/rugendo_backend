const TicketFormat = require('../models/ticketFormat.model');
const Company = require('../models/company.model')

const createTicketFormat = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to create a Ticket Format'
    const { originLocationID, destinationLocationID, ticketTime, distance, duration, price, companyID, busID, priceStandard } = req.body;

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
            originLocation: originLocationID,
            destinationLocation: destinationLocationID,
            ticketTime,
            distance,
            duration,
            price,
            companyID,
            busID,
            priceStandard
        };

        // console.log("Ticket Controller: ", newTicketFormat)

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
            res.status(200).json(ticketFormats);
        }
    });
};

const getTicketFormatByID = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to get a Ticket Format by ID'
    const ticketFormatID = req.params.id;

    TicketFormat.getById(ticketFormatID, (error, ticketFormat) => {
        if (error) {
            console.error('Failed to fetch ticket formats:', error);
            res.status(500).json({ error: 'Failed to fetch ticket formats' });
        } else {
            res.status(200).json(ticketFormat);
        }
    });
};

const getDetailedTicketFormats = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to get all Ticket Formats in Details'
    TicketFormat.getAllDetailed((error, ticketFormats) => {
    // TicketFormat.getAll((error, ticketFormats) => {
        
        if (error) {
            console.error('Failed to fetch ticket formats:', error);
            res.status(500).json({ error: 'Failed to fetch ticket formats' });
        } else {
            res.status(200).json(ticketFormats);
        }
    });
};

const getDetailedTicketFormatByID = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to get all Ticket Formats in Details'
    const ticketFormatID = req.params.id;
    TicketFormat.getDetailedByID(ticketFormatID, (error, ticketFormat) => {
    // TicketFormat.getAll((error, ticketFormats) => {
        
        if (error) {
            console.error('Failed to fetch ticket formats:', error);
            res.status(500).json({ error: 'Failed to fetch ticket formats' });
        } else {
            res.status(200).json(ticketFormat);
        }
    });
};

const getTicketFormatsByCompany = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to get all Ticket Formats owned by given Company ID'
    const companyID = req.params.companyID;
    const ticketsWithSeats = []
    TicketFormat.getAllByCompanyID(companyID, (error, ticketFormats) => {
        if (error) {
            console.error('Failed to fetch ticket formats:', error);
            res.status(500).json({ error: 'Failed to fetch ticket formats' });
        } else {
            const fetchTicketFormatDetails = (ticket) => {

                const ticketWithFormat = {
                    id: ticket.id,
                    originLocationID: ticket.originLocationID,
                    originLocation: ticket.originLocation,
                    destinationLocationID: ticket.destinationLocationID,
                    destinationLocation: ticket.destinationLocation,
                    ticketTime:ticket.ticketTime,
                    distance: ticket.distance,
                    duration: ticket.duration,
                    price: ticket.price,
                    companyID: ticket.companyID,
                    busID: ticket.busID,
                    route: ticket.route,
                    priceStandard: ticket.priceStandard,
                    plaqueNumber: ticket.plaqueNumber,
                    maxCapacity: ticket.maxCapacity,
                    // seatsLeft: 30,
                };

                ticketsWithSeats.push(ticketWithFormat);

                // Check if all tickets have been processed
                if (ticketsWithSeats.length === ticketFormats.length) {
                    res.status(200).json(ticketsWithSeats);
                }
                // });
            };

            ticketFormats.forEach((ticket) => {
                fetchTicketFormatDetails(ticket);
            });
        }
    });
};

const updateTicketFormatByID = (req, res) => {
    // #swagger.tags = ['Ticket Format']
    // #swagger.description = 'Endpoint to update a Ticket Format by its ID'
    const ticketFormatID = req.params.id;
    const { ticketTime, busID, companyID } = req.body;

    // Check if the company with the given companyID exists
    Company.getById(companyID, (companyError, existingCompany) => {
        if (companyError) {
            console.error('Failed to fetch company:', companyError);
            return res.status(500).json({ error: 'Failed to update ticket format' });
        }

        if (!existingCompany) {
            return res.status(400).json({ error: 'Company with the given ID does not exist' });
        }

        const updatedTicketFormat = {
            ticketTime,
            busID
        };

        TicketFormat.updateByID(ticketFormatID, updatedTicketFormat, (updateError, updatedTicketFormat) => {
            if (updateError) {
                console.error('Failed to update ticket format:', updateError);
                res.status(500).json({ error: 'Failed to update ticket format' });
            } else if (!updatedTicketFormat) {
                res.status(404).json({ error: 'Ticket format not found' });
            } else {
                // res.status(200).json({ message: 'Ticket format updated successfully', updatedTicketFormat: updatedTicketFormat });
                // Fetch the updated ticket format to return in the response
                TicketFormat.getById(ticketFormatID, (fetchError, fetchedUpdatedTicketFormat) => {
                    if (fetchError) {
                        console.error('Failed to fetch updated ticket format:', fetchError);
                        res.status(500).json({ error: 'Failed to update ticket format' });
                    } else {
                        res.status(200).json({ message: 'Ticket format updated successfully', updatedTicketFormat: fetchedUpdatedTicketFormat });
                    }
                });
            }
        });
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
    getTicketFormatByID,
    deleteTicketFormatByID,
    getDetailedTicketFormats,
    getDetailedTicketFormatByID,
    getTicketFormatsByCompany,
    updateTicketFormatByID
};
