const User = require('../models/user.model')
const Company = require('../models/company.model')
const TicketFormat = require('../models/ticketFormat.model')
const BoughtTicket = require('../models/boughtTicket.model');

// const createBoughtTicket = (req, res) => {
//     // #swagger.tags = ['Bought Ticket']
//     // #swagger.description = 'Endpoint to create a Bought Ticket'

//     // Check if the user is logged in
//     if (!req.cookies.authToken || !req.cookies.userRole) {
//         return res.status(401).json({ error: 'Unauthorized, you have to be logged in to buy a ticket.' });
//     }

//     // Set the customerID to the ID of the logged-in customer
//     const customerID = req.cookies.userID;

//     const { ticketFormatID, date, plaqueNumber, paymentMethodUsed } = req.body;

//     // Validate the date format YYYY-MM-DD
//     const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);
//     if (!isValidDateFormat) {
//         return res.status(400).json({ error: 'Invalid date format. Expected format: YYYY-MM-DD' });
//     }

//     // Validate the customerID
//     User.getUserById(customerID, (customerError, customer) => {
//         if (customerError) {
//             console.error('Error fetching customer by ID:', customerError);
//             return res.status(500).json({ error: 'Failed to create bought ticket' });
//         }

//         if (!customer) {
//             return res.status(400).json({ error: 'Customer with the given ID does not exist' });
//         }

//         // Validate the ticketFormatID
//         TicketFormat.getById(ticketFormatID, (ticketFormatError, ticketFormat) => {
//             if (ticketFormatError) {
//                 console.error('Error fetching ticket format by ID:', ticketFormatError);
//                 return res.status(500).json({ error: 'Failed to create bought ticket' });
//             }

//             if (!ticketFormat) {
//                 return res.status(400).json({ error: 'Ticket format with the given ID does not exist' });
//             }

//             // console.log(ticketFormat)

//             // Fetch company details using the companyID from the ticket format
//             Company.getById(ticketFormat.companyID, (companyError, company) => {
//                 if (companyError) {
//                     console.error('Error fetching company details:', companyError);
//                     return res.status(500).json({ error: 'Failed to create bought ticket' });
//                 }

//                 console.log(company)

//                 const newBoughtTicket = {
//                     customerID,
//                     ticketFormatID,
//                     date,
//                     plaqueNumber,
//                     paymentMethodUsed
//                 };

//                 BoughtTicket.create(newBoughtTicket, (createError, result) => {
//                     if (createError) {
//                         console.error('Failed to create bought ticket:', createError);
//                         res.status(500).json({ error: 'Failed to create bought ticket' });
//                     } else {
//                         const boughtTicketResult = {
//                             customerID: result.customerID,
//                             ticketFormatID: result.ticketFormatID,
//                             date: result.date,
//                             plaqueNumber: result.plaqueNumber,
//                             paymentMethodUsed: result.paymentMethodUsed,
//                             company: {
//                                 companyID: company.companyID,
//                                 companyName: company.companyName,
//                                 companyLocation: company.companyLocation,
//                             },
//                         };
//                         // res.status(201).json({
//                         //     message: 'Bought ticket created successfully',
//                         //     boughtTicket: result,
//                         //     company: {
//                         //         companyID: company.companyID,
//                         //         companyName: company.companyName,
//                         //         companyLocation: company.companyLocation
//                         //     }
//                         // });
//                         res.status(201).json({
//                             message: 'Bought ticket created successfully',
//                             boughtTicket: boughtTicketResult,
//                         });
//                     }
//                 });
//             });
//         });
//     });
// };

const createBoughtTicket = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to create a Bought Ticket'

    // Check if the user is logged in
    if (!req.cookies.authToken || !req.cookies.userRole) {
        return res.status(401).json({ error: 'Unauthorized, you have to be logged in to buy a ticket.' });
    }

    // Set the customerID to the ID of the logged-in customer
    const customerID = req.cookies.userID;

    const { ticketFormatID, date, plaqueNumber, paymentMethodUsed } = req.body;

    // Validate the date format YYYY-MM-DD
    const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!isValidDateFormat) {
        return res.status(400).json({ error: 'Invalid date format. Expected format: YYYY-MM-DD' });
    }

    // Validate the customerID
    User.getUserById(customerID, (customerError, customer) => {
        if (customerError) {
            console.error('Error fetching customer by ID:', customerError);
            return res.status(500).json({ error: 'Failed to create bought ticket' });
        }

        if (!customer) {
            return res.status(400).json({ error: 'Customer with the given ID does not exist' });
        }

        // Validate the ticketFormatID
        TicketFormat.getById(ticketFormatID, (ticketFormatError, ticketFormat) => {
            if (ticketFormatError) {
                console.error('Error fetching ticket format by ID:', ticketFormatError);
                return res.status(500).json({ error: 'Failed to create bought ticket' });
            }

            if (!ticketFormat) {
                return res.status(400).json({ error: 'Ticket format with the given ID does not exist' });
            }
 
            console.log(ticketFormat)
            // Fetch company details using the companyID from the ticket format
            Company.getById(ticketFormat.companyID, (companyError, company) => {
                console.log(company)
                if (companyError) {
                    console.error('Failed to fetch company details:', companyError);
                    res.status(500).json({ error: 'Failed to fetch company details' });
                } else {

                    const newBoughtTicket = {
                        customerID,
                        ticketFormatID,
                        date,
                        plaqueNumber,
                        paymentMethodUsed,
                    };

                    BoughtTicket.create(newBoughtTicket, (createError, result) => {
                        if (createError) {
                            console.error('Failed to create bought ticket:', createError);
                            res.status(500).json({ error: 'Failed to create bought ticket' });
                        } else {
                            const boughtTicketResult = {
                                customerID: result.customerID,
                                customerNames: `${customer.firstName} ${customer.lastName}`,
                                ticketFormatID: result.ticketFormatID,
                                date: result.date,
                                plaqueNumber: result.plaqueNumber,
                                paymentMethodUsed: result.paymentMethodUsed,
                                company: {
                                    companyID: company.companyID,
                                    companyName: company.companyName,
                                    companyLocation: company.companyLocation,
                                },
                            };
                            res.status(201).json({
                                message: 'Bought ticket created successfully',
                                boughtTicket: boughtTicketResult,
                            });
                        }
                    });
                }
            });
        });
    });
};


// const getAllCompanyTickets = (req, res) => {
//     // #swagger.tags = ['Bought Ticket']
//     // #swagger.description = 'Endpoint to get bought Tickets from the Company of the logged in Worker'

//     // Check if the user is logged in (authenticated)
//     if (!req.cookies.authToken || !req.cookies.userRole) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const userCompanyID = req.cookies.userCompanyID;

//     // if (userRole === 'WORKER') {

//     // Fetch all ticketFormatIDs associated with the logged-in companyID
//     TicketFormat.getAllByCompanyID(userCompanyID, (error, ticketFormats) => {
//         if (error) {
//             console.error('Error fetching ticket formats:', error);
//             res.status(500).json({ error: 'Failed to fetch ticket formats' });
//         } else {
//             const ticketFormatIDs = ticketFormats.map(format => format.id);

//             // Fetch all bought tickets corresponding to the ticketFormatIDs
//             BoughtTicket.getAllByTicketFormatIDs(ticketFormatIDs, (boughtTicketError, boughtTickets) => {
//                 if (boughtTicketError) {
//                     console.error('Error fetching bought tickets:', boughtTicketError);
//                     res.status(500).json({ error: 'Failed to fetch bought tickets' });
//                 } else {
//                     res.status(200).json(boughtTickets);
//                 }
//             });
//         }
//     });
//     // } else {
//     //     res.status(403).json({ error: 'Forbidden' }); // User is not authorized to access bought tickets
//     // }
// };

const getAllCompanyTickets = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get all bought tickets of the logged-in worker\'s company'

    // Check if the user is logged in as a worker
    if (req.cookies.userRole !== 'WORKER') {
        return res.status(403).json({ error: 'Forbidden, access restricted to workers' });
    }

    // console.log(req.cookies);

    const companyID = req.cookies.userCompanyID; // Fetch the companyID from the logged-in user's cookies

    // Fetch all bought tickets by the company ID of the logged-in worker
    BoughtTicket.getAllByWorkerCompanyID(companyID, (error, boughtTickets) => {
        if (error) {
            console.error('Error fetching bought tickets:', error);
            res.status(500).json({ error: 'Failed to fetch bought tickets' });
        } else {
            res.status(200).json(boughtTickets);
        }
    });
};

const generateReceipt = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to generate receipts for tickets bought by the logged-in user'

    // Get the ID of the logged-in user from the cookie
    const loggedInUserID = req.cookies.userID; // Assuming the user ID is stored in the userID cookie

    // Fetch the logged-in user's details using User.getByID
    User.getUserById(loggedInUserID, (userError, user) => {
        if (userError) {
            console.error('Error fetching user details:', userError);
            return res.status(500).json({ error: 'Failed to generate receipts' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all bought tickets linked to the logged-in user
        BoughtTicket.getAllByCustomerID(loggedInUserID, (error, tickets) => {
            if (error) {
                console.error('Error fetching bought tickets:', error);
                return res.status(500).json({ error: 'Failed to generate receipts' });
            }

            if (tickets.length === 0) {
                // No tickets bought by the user
                return res.status(404).json({ message: 'You haven\'t bought any tickets yet' });
            }

            // Create an array to store receipts for each ticket
            const receipts = [];

            // Loop through each bought ticket and generate a receipt
            for (const ticket of tickets) {
                const {
                    date,
                    paymentMethodUsed,
                    ticketFormat: {
                        originLocation,
                        destinationLocation,
                        ticketTime,
                        price,
                        distance,
                        duration,
                    },
                    company: { companyName },
                } = ticket;

                const receipt = {
                    buyerNames: `${user.firstName} ${user.lastName}`,
                    companyName,
                    location: `FROM ${originLocation} TO ${destinationLocation}`,
                    date,
                    paymentMethodUsed,
                    ticketTime,
                    price,
                    distance,
                    duration,
                };

                receipts.push(receipt);
            }

            res.status(200).json(receipts);
        });
    });
};


const getAllBoughtTickets = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get all Bought Ticket'
    BoughtTicket.getAll((error, boughtTickets) => {
        if (error) {
            console.error('Failed to fetch bought tickets:', error);
            res.status(500).json({ error: 'Failed to fetch bought tickets' });
        } else {
            res.status(200).json({ boughtTickets });
        }
    });
};

const deleteBoughtTicketByID = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to delete a Bought Ticket by ID'
    const boughtTicketID = req.params.id;

    BoughtTicket.deleteByID(boughtTicketID, (deleteError, deletedBoughtTicket) => {
        if (deleteError) {
            console.error('Failed to delete bought ticket:', deleteError);
            res.status(500).json({ error: 'Failed to delete bought ticket' });
        } else if (!deletedBoughtTicket) {
            res.status(404).json({ error: 'Bought ticket not found' });
        } else {
            res.status(200).json({ message: 'Bought ticket deleted successfully' });
        }
    });
};

module.exports = {
    createBoughtTicket,
    getAllBoughtTickets,
    deleteBoughtTicketByID,
    getAllCompanyTickets,
    generateReceipt
};
