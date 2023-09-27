require('dotenv').config()
const User = require('../models/user.model')
const Company = require('../models/company.model')
const TicketFormat = require('../models/ticketFormat.model')
const BoughtTicket = require('../models/boughtTicket.model');
const express = require('express');
const moment = require('moment');
const app = express()
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY

const createBoughtTicket = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to create a Bought Ticket'

    // Check if the user is logged in
    const authToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized, you have to be logged in to buy a ticket.' });
    }

    jwt.verify(authToken, jwtSecretKey, (verifyError, decoded) => {
        // console.log(decoded)
        if (verifyError) {
            // Handle verification error
            res.status(401).json({ error: 'Unauthorized', verifyError: verifyError });
        } else {
            // Token is valid, proceed with fetching user details
            const userID = decoded.id;
            // console.log("UserID: ", userID);
            // Set the customerID to the ID of the logged-in customer
            const customerID = userID;

            const { ticketFormatID, ticketDate, plaqueNumber, paymentMethodUsed } = req.body;

            // console.log(req.body)
            // console.log(ticketDate)
            // Validate the date format YYYY-MM-DD
            const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(ticketDate);
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

                    // console.log(ticketFormat)
                    // Fetch company details using the companyID from the ticket format
                    Company.getById(ticketFormat.companyID, (companyError, company) => {
                        // console.log(company)
                        if (companyError) {
                            console.error('Failed to fetch company details:', companyError);
                            res.status(500).json({ error: 'Failed to fetch company details' });
                        } else {

                            const newBoughtTicket = {
                                customerID,
                                ticketFormatID,
                                ticketDate,
                                plaqueNumber,
                                paymentMethodUsed,
                                // timeBought
                            };

                            BoughtTicket.create(newBoughtTicket, (createError, result) => {
                                if (createError) {
                                    console.error('Failed to create bought ticket:', createError);
                                    res.status(500).json({ error: 'Failed to create bought ticket' });
                                } else {
                                    const boughtTicketResult = {
                                        id: result.id,
                                        customerID: result.customerID,
                                        customerNames: `${customer.firstName} ${customer.lastName}`,
                                        ticketFormatID: result.ticketFormatID,
                                        ticketDate: result.ticketDate,
                                        timeBought: result.timeBought,
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
        }
    });

};

const getBoughtTicketsForToday = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get Bought Tickets for today\'s date'

    // Get today's date in the format YYYY-MM-DD
    const todayDate = moment().format('YYYY-MM-DD');
    // console.log(todayDate);

    // Fetch all bought tickets for today's date
    BoughtTicket.getAllByDate(todayDate, (error, boughtTickets) => {
        if (error) {
            console.error('Error fetching bought tickets for today:', error);
            return res.status(500).json({ error: 'Failed to fetch bought tickets for today' });
        }

        if (boughtTickets.length === 0) {
            return res.status(404).json({ message: 'No tickets bought for today' });
        }

        // Map the bought tickets to include ticket format details
        const ticketsForToday = [];

        // Function to fetch ticket format details for a ticket
        const fetchTicketFormatDetails = (ticket) => {
            TicketFormat.getById(ticket.ticketFormatID, (formatError, format) => {
                if (formatError) {
                    console.error('Error fetching ticket format details:', formatError);
                    return res.status(500).json({ error: 'Failed to fetch ticket format details' });
                }

                if (!format) {
                    return res.status(404).json({ error: 'Ticket format not found' });
                }

                const ticketWithFormat = {
                    id: ticket.id,
                    customerID: ticket.customerID,
                    ticketFormatID: ticket.ticketFormatID,
                    ticketDate: ticket.ticketDate,
                    plaqueNumber: ticket.plaqueNumber,
                    paymentMethodUsed: ticket.paymentMethodUsed,
                    timeBought: ticket.timeBought,
                    ticketFormat: {
                        originLocation: format.originLocation,
                        destinationLocation: format.destinationLocation,
                        ticketTime: format.ticketTime,
                        price: format.price,
                        distance: format.distance,
                        duration: format.duration,
                        plaqueNumber: format.plaqueNumber,
                        maxSeats: format.maxSeats,
                    },
                };

                ticketsForToday.push(ticketWithFormat);

                // Check if all tickets have been processed
                if (ticketsForToday.length === boughtTickets.length) {
                    res.status(200).json(ticketsForToday);
                }
            });
        };

        // Fetch ticket format details for each ticket bought today
        boughtTickets.forEach((ticket) => {
            fetchTicketFormatDetails(ticket);
        });
    });
};

const getBoughtTicketsForTodayByCompanyID = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get Bought Tickets for today\'s date by CompanyID'

    // Get today's date in the format YYYY-MM-DD
    const companyID = req.params.companyID;
    const todayDate = moment().format('YYYY-MM-DD');
    // const todayDate = '2023-09-20';
    // console.log(todayDate);

    // Fetch all bought tickets for today's date
    BoughtTicket.getAllByDateAndCompanyID(todayDate, companyID, (error, boughtTickets) => {
        if (error) {
            console.error('Error fetching bought tickets for today:', error);
            return res.status(500).json({ error: 'Failed to fetch bought tickets for today' });
        }

        if (boughtTickets.length === 0) {
            return res.status(200).json({ message: 'No tickets bought for today' });
        }

        // Map the bought tickets to include ticket format details
        const ticketsForToday = [];

        // Function to fetch ticket format details for a ticket
        const fetchTicketFormatDetails = (ticket) => {
            TicketFormat.getById(ticket.ticketFormatID, (formatError, format) => {
                if (formatError) {
                    console.error('Error fetching ticket format details:', formatError);
                    return res.status(500).json({ error: 'Failed to fetch ticket format details' });
                }

                if (!format) {
                    return res.status(404).json({ error: 'Ticket format not found' });
                }

                const ticketWithFormat = {
                    id: ticket.id,
                    customerID: ticket.customerID,
                    ticketFormatID: ticket.ticketFormatID,
                    ticketDate: ticket.ticketDate,
                    plaqueNumber: ticket.plaqueNumber,
                    paymentMethodUsed: ticket.paymentMethodUsed,
                    timeBought: ticket.timeBought,
                    ticketFormat: {
                        originLocation: format.originLocation,
                        destinationLocation: format.destinationLocation,
                        ticketTime: format.ticketTime,
                        price: format.price,
                        distance: format.distance,
                        duration: format.duration,
                        plaqueNumber: format.plaqueNumber,
                        maxSeats: format.maxSeats,
                    },
                };

                ticketsForToday.push(ticketWithFormat);

                // Check if all tickets have been processed
                if (ticketsForToday.length === boughtTickets.length) {
                    res.status(200).json({ ticketsForToday });
                }
            });
        };

        // Fetch ticket format details for each ticket bought today
        boughtTickets.forEach((ticket) => {
            fetchTicketFormatDetails(ticket);
        });
    });
};

const getLast7DaysRevenue = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get the total revenue for each of the last 7 days'

    // Calculate the start and end dates for the last 7 days
    const companyID = req.params.companyID;
    const endDate = moment().format('YYYY-MM-DD'); // Today's date
    const startDate = moment().subtract(6, 'days').format('YYYY-MM-DD'); // 6 days ago

    // Initialize an object to store the daily revenue
    // const dailyRevenue = {};

    // Initialize an array to store the daily revenue objects
    const dailyRevenues = [];

    // Function to format a date as MM-DD
    const formatDateAsMMDD = (date) => moment(date).format('MM-DD');

    // Function to fetch bought tickets for a specific date
    const fetchBoughtTicketsForDate = (date) => {
        // console.log(date)
        BoughtTicket.getAllByDateAndCompanyID(date, companyID, (error, boughtTickets) => {
            if (error) {
                console.error(`Error fetching bought tickets for ${date}:`, error);
                return res.status(500).json({ error: `Failed to fetch bought tickets for ${date}` });
            }

            // Initialize an array to store promises for fetching ticket format details
            const formatPromises = [];

            // Calculate the total revenue for the current day
            const totalRevenue = boughtTickets.reduce((total, ticket) => {
                // Create a promise to fetch ticket format details for each ticket
                const formatPromise = new Promise((resolve) => {
                    TicketFormat.getById(ticket.ticketFormatID, (formatError, format) => {
                        if (formatError) {
                            console.error('Error fetching ticket format details:', formatError);
                            resolve(0); // Resolve with 0 revenue if there's an error
                        } else {
                            resolve(format.price || 0); // Resolve with the ticket price or 0
                        }
                    });
                });

                formatPromises.push(formatPromise);

                return total;
            }, 0);

            // Wait for all format promises to resolve
            Promise.all(formatPromises).then((prices) => {
                const dailyTotalRevenue = prices.reduce((dailyTotal, price) => dailyTotal + price, 0);

                // Store the date and daily total revenue in the dailyRevenues array
                // dailyRevenues.push({ date, dailyRevenue: dailyTotalRevenue });

                // Store the date (formatted as MM-DD) and daily total revenue in the dailyRevenues array
                dailyRevenues.push({ date: formatDateAsMMDD(date), dailyRevenue: dailyTotalRevenue });


                // Check if all days have been processed
                if (dailyRevenues.length === 7) {
                    res.status(200).json(dailyRevenues);
                }
            });
        });
    };

    // Loop through each day in the last 7 days and fetch bought tickets
    for (let date = moment(startDate); date.isSameOrBefore(endDate); date.add(1, 'days')) {
        const currentDate = date.format('YYYY-MM-DD');
        fetchBoughtTicketsForDate(currentDate);
    }
};

const getLast5MonthsRevenue = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get the total revenue for each of the last 5 months'

    // Calculate the start and end dates for the last 5 months
    const companyID = req.params.companyID;
    const endDate = moment().format('YYYY-MM-DD'); // Today's date
    const startDate = moment().subtract(5, 'months').format('YYYY-MM-DD'); // 5 months ago

    // console.log(startDate, endDate)

    // Initialize an array to store the monthly revenue objects
    const monthlyRevenues = [];

    // Function to format a date as YYYY-MM
    const formatDateAsYYYYMM = (date) => moment(date).format('YYYY-MM');

    // Function to fetch bought tickets for a specific month
    const fetchBoughtTicketsForMonth = (month) => {
        BoughtTicket.getAllByMonthAndCompanyID(month, companyID, (error, boughtTickets) => {
            if (error) {
                console.error(`Error fetching bought tickets for ${month}:`, error);
                return res.status(500).json({ error: `Failed to fetch bought tickets for ${month}` });
            }

            // Initialize an array to store promises for fetching ticket format details
            const formatPromises = [];

            // Calculate the total revenue for the current month
            const totalRevenue = boughtTickets.reduce((total, ticket) => {
                // Create a promise to fetch ticket format details for each ticket
                const formatPromise = new Promise((resolve) => {
                    TicketFormat.getById(ticket.ticketFormatID, (formatError, format) => {
                        if (formatError) {
                            console.error('Error fetching ticket format details:', formatError);
                            resolve(0); // Resolve with 0 revenue if there's an error
                        } else {
                            resolve(format.price || 0); // Resolve with the ticket price or 0
                        }
                    });
                });

                formatPromises.push(formatPromise);

                return total;
            }, 0);

            // Wait for all format promises to resolve
            Promise.all(formatPromises).then((prices) => {
                const monthlyTotalRevenue = prices.reduce((monthlyTotal, price) => monthlyTotal + price, 0);

                // Store the date (formatted as YYYY-MM) and monthly total revenue in the monthlyRevenues array
                monthlyRevenues.push({ month: formatDateAsYYYYMM(month), monthlyRevenue: monthlyTotalRevenue });

                // Check if all months have been processed
                if (monthlyRevenues.length === 5) {
                    res.status(200).json(monthlyRevenues);
                }
            });
        });
    };

    // Loop through each month in the last 5 months and fetch bought tickets
    for (let month = moment(startDate); month.isSameOrBefore(endDate, 'month'); month.add(1, 'month')) {
        const currentMonth = month.format('YYYY-MM');
        fetchBoughtTicketsForMonth(currentMonth);
    }
};

const getLast6MonthsRevenue = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get the total revenue for each of the last 6 months'

    // Calculate the start and end dates for the last 6 months
    const companyID = req.params.companyID;
    const endDate = moment().format('YYYY-MM'); // Current year and month
    const startDate = moment().subtract(5, 'months').format('YYYY-MM'); // 6 months ago

    // console.log(startDate, endDate);

    // Initialize an array to store the monthly revenue objects
    const monthlyRevenues = [];

    // Function to format a date as YYYY-MM
    const formatDateAsYYYYMM = (date) => moment(date).format('YYYY-MM');

    // Function to fetch bought tickets for a specific month
    const fetchBoughtTicketsForMonth = (month) => {
        BoughtTicket.getAllByMonthAndCompanyID(month, companyID, (error, boughtTickets) => {
            if (error) {
                console.error(`Error fetching bought tickets for ${month}:`, error);
                return res.status(500).json({ error: `Failed to fetch bought tickets for ${month}` });
            }

            // Initialize an array to store promises for fetching ticket format details
            const formatPromises = [];

            // Calculate the total revenue for the current month
            const totalRevenue = boughtTickets.reduce((total, ticket) => {
                // Create a promise to fetch ticket format details for each ticket
                const formatPromise = new Promise((resolve) => {
                    TicketFormat.getById(ticket.ticketFormatID, (formatError, format) => {
                        if (formatError) {
                            console.error('Error fetching ticket format details:', formatError);
                            resolve(0); // Resolve with 0 revenue if there's an error
                        } else {
                            resolve(format.price || 0); // Resolve with the ticket price or 0
                        }
                    });
                });

                formatPromises.push(formatPromise);

                return total;
            }, 0);

            // Wait for all format promises to resolve
            Promise.all(formatPromises).then((prices) => {
                const monthlyTotalRevenue = prices.reduce((monthlyTotal, price) => monthlyTotal + price, 0);

                // Store the date (formatted as YYYY-MM) and monthly total revenue in the monthlyRevenues array
                monthlyRevenues.push({ month: formatDateAsYYYYMM(month), monthlyRevenue: monthlyTotalRevenue });

                // Check if all months have been processed
                if (monthlyRevenues.length === 6) {
                    res.status(200).json(monthlyRevenues);
                }
            });
        });
    };

    // Loop through each month in the last 6 months and fetch bought tickets
    for (let month = moment(startDate); month.isSameOrBefore(endDate, 'month'); month.add(1, 'month')) {
        const currentMonth = month.format('YYYY-MM');
        fetchBoughtTicketsForMonth(currentMonth);
    }
};

const getBoughtTicketsForCurrentMonthByCompanyID = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get Bought Tickets for the current month by CompanyID'

    // Get the current month in the format YYYY-MM
    const companyID = req.params.companyID;
    const currentMonth = moment().format('YYYY-MM');

    // Fetch all bought tickets for the current month
    BoughtTicket.getAllByMonthAndCompanyID(currentMonth, companyID, (error, boughtTickets) => {
        if (error) {
            console.error('Error fetching bought tickets for the current month:', error);
            return res.status(500).json({ error: 'Failed to fetch bought tickets for the current month' });
        }

        if (boughtTickets.length === 0) {
            return res.status(404).json({ message: 'No tickets bought for the current month' });
        }

        // Map the bought tickets to include ticket format details
        const ticketsForCurrentMonth = [];

        // Function to fetch ticket format details for a ticket
        const fetchTicketFormatDetails = (ticket) => {
            TicketFormat.getById(ticket.ticketFormatID, (formatError, format) => {
                if (formatError) {
                    console.error('Error fetching ticket format details:', formatError);
                    return res.status(500).json({ error: 'Failed to fetch ticket format details' });
                }

                if (!format) {
                    return res.status(404).json({ error: 'Ticket format not found' });
                }

                const ticketWithFormat = {
                    id: ticket.id,
                    customerID: ticket.customerID,
                    ticketFormatID: ticket.ticketFormatID,
                    ticketDate: ticket.ticketDate,
                    plaqueNumber: ticket.plaqueNumber,
                    paymentMethodUsed: ticket.paymentMethodUsed,
                    timeBought: ticket.timeBought,
                    ticketFormat: {
                        originLocation: format.originLocation,
                        destinationLocation: format.destinationLocation,
                        ticketTime: format.ticketTime,
                        price: format.price,
                        distance: format.distance,
                        duration: format.duration,
                    },
                };

                ticketsForCurrentMonth.push(ticketWithFormat);

                // Check if all tickets have been processed
                if (ticketsForCurrentMonth.length === boughtTickets.length) {
                    res.status(200).json(ticketsForCurrentMonth);
                }
            });
        };

        // Fetch ticket format details for each ticket bought in the current month
        boughtTickets.forEach((ticket) => {
            fetchTicketFormatDetails(ticket);
        });
    });
};

const getBoughtTicketsByDate = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get all bought tickets of the given companyID in the given date
    const { companyID, selectedDate } = req.params;

    // Implement this logic based on your data model
    // You may need to adjust the database query to match your schema
    // Map the bought tickets to include ticket format details
    const ticketsForGivenDate = [];

    // Assuming you have a model method like BoughtTicket.getByDateAndCompanyID
    BoughtTicket.getAllByTicketDateAndCompanyID(selectedDate, companyID, (error, boughtTickets) => {
        if (error) {
            console.error(`Error fetching bought tickets for ${selectedDate}:`, error);
            return res.status(500).json({ error: `Failed to fetch bought tickets for ${selectedDate}` });
        }

        if (!boughtTickets) {
            // Ticket not found or not owned by the user
            return res.status(200).json({ message: 'Ticket not found' });
        }

        const fetchTicketFormatDetails = (ticket) => {
            // TicketFormat.getById(ticket.ticketFormatID, (formatError, format) => {
            //     if (formatError) {
            //         console.error('Error fetching ticket format details:', formatError);
            //         return res.status(500).json({ error: 'Failed to fetch ticket format details' });
            //     }

            //     if (!format) {
            //         return res.status(404).json({ error: 'Ticket format not found' });
            //     }

            const ticketWithFormat = {
                id: ticket.id,
                customerID: ticket.customerID,
                ticketFormatID: ticket.ticketFormatID,
                ticketDate: ticket.ticketDate,
                plaqueNumber: ticket.plaqueNumber,
                paymentMethodUsed: ticket.paymentMethodUsed,
                timeBought: ticket.timeBought,
                // seatsLeft: 30
            };

            ticketsForGivenDate.push(ticketWithFormat);

            // Check if all tickets have been processed
            if (ticketsForGivenDate.length === boughtTickets.length) {
                res.status(200).json(ticketsForGivenDate);
            }
            // });
        };

        // const boughtTicketsResult = {
        //     id: boughtTickets.id,
        //     customerID: boughtTickets.customerID,
        //     ticketFormatID: boughtTickets.ticketFormatID,
        //     ticketDate: boughtTickets.ticketDate,
        //     plaqueNumber: boughtTickets.plaqueNumber,
        //     paymentMethodUsed: boughtTickets.paymentMethodUsed,
        //     timeBought: boughtTickets.timeBought,
        //     // seatsLeft: 30
        // }
        // Return the fetched bought tickets in the response
        boughtTickets.forEach((ticket) => {
            fetchTicketFormatDetails(ticket);
        });
        // res.status(200).json(boughtTickets);
        // res.status(200).json(boughtTicketsResult);
    });
};

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

const getBoughtTicketsByCompanyID = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get all bought tickets of the given companyID'
    const { companyID } = req.params;

    BoughtTicket.getAllByCompanyID(companyID, (error, boughtTickets) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch boughtTickets' });
        }

        if (!boughtTickets || boughtTickets.length === 0) {
            return res.status(404).json({ message: 'No boughtTickets found for the provided companyID' });
        }

        res.status(200).json(boughtTickets);
    });
};

const generateReceipts = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to generate receipts for tickets bought by the logged-in user'

    // Get the ID of the logged-in user from the cookie
    // Check if the user is logged in
    const authToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    // console.log("UserID: ", authToken);
    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized, you have to be logged in to buy a ticket.' });
    }

    jwt.verify(authToken, jwtSecretKey, (verifyError, decoded) => {
        // console.log(decoded)
        if (verifyError) {
            // Handle verification error
            res.status(401).json({ error: 'Unauthorized', verifyError: verifyError });
        } else {
            // Token is valid, proceed with fetching user details
            const userID = decoded.id;

            const loggedInUserID = userID; // Assuming the user ID is stored in the userID cookie

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
                            id,
                            ticketDate,
                            paymentMethodUsed,
                            timeBought,
                            status,
                            ticketFormat: {
                                originLocation,
                                destinationLocation,
                                ticketTime,
                                price,
                                distance,
                                duration,
                                plaqueNumber,
                                maxSeats,
                            },
                            company: { companyName },
                        } = ticket;

                        const receipt = {
                            ticketID: id,
                            buyerNames: `${user.firstName} ${user.lastName}`,
                            companyName,
                            location: `From ${originLocation} To ${destinationLocation}`,
                            ticketDate,
                            timeBought,
                            paymentMethodUsed,
                            ticketTime,
                            price,
                            distance,
                            duration,
                            plaqueNumber,
                            maxSeats,
                            status
                        };

                        receipts.push(receipt);
                    }

                    res.status(200).json(receipts);
                });
            });
        }
    });
};

const generateSingleReceipt = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to generate a receipt for a specific ticket bought by the logged-in user'

    // Get the ID of the logged-in user from the cookie
    // Check if the user is logged in
    const authToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized, you have to be logged in to generate a receipt.' });
    }

    // Get the ID of the specific ticket you want to generate a receipt for
    const ticketID = req.params.id; // Assuming you pass the ticket ID as a route parameter

    jwt.verify(authToken, jwtSecretKey, (verifyError, decoded) => {
        // console.log(decoded)
        if (verifyError) {
            // Handle verification error
            res.status(401).json({ error: 'Unauthorized', verifyError: verifyError });
        } else {
            // Token is valid, proceed with fetching user details
            const userID = decoded.id;
            // console.log("UserID: ", userID);
            const loggedInUserID = userID; // Assuming the user ID is stored in the userID cookie

            // Fetch the logged-in user's details using User.getByID
            User.getUserById(loggedInUserID, (userError, user) => {
                if (userError) {
                    console.error('Error fetching user details:', userError);
                    return res.status(500).json({ error: 'Failed to generate the receipt' });
                }

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Fetch the specific bought ticket linked to the logged-in user
                BoughtTicket.getByIDAndCustomerID(ticketID, loggedInUserID, (error, ticket) => {
                    if (error) {
                        console.error('Error fetching the ticket:', error);
                        return res.status(500).json({ error: 'Failed to generate the receipt' });
                    }

                    if (!ticket) {
                        // Ticket not found or not owned by the user
                        return res.status(404).json({ message: 'Ticket not found or not owned by you' });
                    }

                    // Generate the receipt for the specific ticket
                    const {
                        id,
                        ticketDate,
                        paymentMethodUsed,
                        timeBought,
                        status,
                        ticketFormat: {
                            originLocation,
                            destinationLocation,
                            ticketTime,
                            price,
                            distance,
                            duration,
                            plaqueNumber,
                            maxSeats,
                        },
                        company: { companyName },
                    } = ticket;

                    const receipt = {
                        ticketID: id,
                        buyerNames: `${user.firstName} ${user.lastName}`,
                        companyName,
                        location: `From ${originLocation} To ${destinationLocation}`,
                        ticketDate,
                        timeBought,
                        paymentMethodUsed,
                        ticketTime,
                        price,
                        distance,
                        duration,
                        plaqueNumber,
                        maxSeats,
                        status
                    };

                    // You can send the receipt as a response
                    res.status(200).json(receipt);
                });
            });
        }
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

const getBoughtTicketByID = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to get a Bought Ticket by ID'

    const ticketID = req.params.id;
    BoughtTicket.getById(ticketID, (error, boughtTicket) => {
        if (error) {
            console.error('Failed to fetch bought tickets:', error);
            res.status(500).json({ error: 'Failed to fetch bought tickets' });
        } else {
            res.status(200).json(boughtTicket);
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

const cancelBoughtTicketByID = (req, res) => {
    // #swagger.tags = ['Bought Ticket']
    // #swagger.description = 'Endpoint to cancel a Bought Ticket by ID'
    const ticketID = req.params.id; // Get the ticket ID from the request parameters

    // Update the status to "CANCELLED" in the database
    BoughtTicket.updateStatusToCancelled(ticketID, (error, updatedTicket) => {
        if (error) {
            console.error('Error updating ticket status:', error);
            return res.status(500).json({ error: 'Failed to update ticket status' });
        }

        if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket status updated to CANCELLED' });
    });
};

module.exports = {
    createBoughtTicket,
    getAllBoughtTickets,
    deleteBoughtTicketByID,
    getAllCompanyTickets,
    generateReceipts,
    generateSingleReceipt,
    getBoughtTicketsForToday,
    getBoughtTicketsForTodayByCompanyID,
    getBoughtTicketsForCurrentMonthByCompanyID,
    getLast7DaysRevenue,
    getLast5MonthsRevenue,
    getLast6MonthsRevenue,
    getBoughtTicketsByDate,
    getBoughtTicketByID,
    getBoughtTicketsByCompanyID,
    cancelBoughtTicketByID
};
