require('dotenv').config()
const express = require('express');
const Bus = require('../models/bus.model');
const Company = require('../models/company.model')
const TicketFormat = require('../models/ticketFormat.model');
const app = express()
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY

// Controller methods for the buses resource
const busController = {
    getAllBuses: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to get all Buses'
        Bus.getAll((error, buses) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch buses.' });
            }
            res.status(200).json(buses);
        });
    },

    getBusByID: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to get a Bus by ID'
        const busID = req.params.id;
        Bus.getById(busID, (error, bus) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch bus.' });
            }
            if (!bus) {
                return res.status(404).json({ message: 'Bus not found.' });
            }
            res.status(200).json(bus);
        });
    },

    getBusesByCompanyID: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to get all Buses by CompanyID'
        const companyID = req.params.companyID;
        Bus.getByCompanyID(companyID, (error, buses) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch buses.' });
            }
            res.status(200).json(buses);
        });
    },

    addBus: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to add a bus'
        const { plaqueNumber, maxCapacity, model, password, companyID } = req.body;

        // Check if all required fields are present
        if (!plaqueNumber || !maxCapacity || !model || !password || !companyID) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        Bus.getByPlaqueNumber(plaqueNumber, (error, existingPlaque) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to log in.' });
            }

            if (existingPlaque) {
                return res.status(400).json({ message: 'Plaque Number already exists' });
            }

            // Hash the password before storing it
            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    return res.status(500).json({ error: 'Failed to hash the password' });
                }

                const newBusData = {
                    plaqueNumber,
                    maxCapacity,
                    model,
                    password: hashedPassword, // Store the hashed password
                    companyID,
                };

                Bus.create(newBusData, (error, newBus) => {
                    if (error) {
                        return res.status(500).json({ error: 'Failed to create a new bus.' });
                    }
                    // res.status(201).json(newBus);
                    res.status(201).json({
                        message: 'Bus registered successfully',
                        newBus: newBus,
                    });
                });
            });
        });
    },

    getAllAssignments: (req, res) => {
        // #swagger.tags = ['Assign Bus']
        // #swagger.description = 'Endpoint to get all Assignments'
        Bus.getAssignments((error, assignments) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch Assignments.' });
            }
            res.status(200).json(assignments);
        });
    },

    getAssignmentByID: (req, res) => {
        // #swagger.tags = ['Assign Bus']
        // #swagger.description = 'Endpoint to get an Assignment by ID'

        const assignID = req.params.id;
        Bus.getAssignmentByID(assignID, (error, assignment) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch assignment.' });
            }

            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found.' });
            }
            res.status(200).json(assignment);
        });
    },

    getDriverData: (req, res) => {
        // #swagger.tags = ['Assign Bus']
        // #swagger.description = 'Endpoint to get Driver Data by BusID'

        const busID = req.params.busID;
        const todayDate = moment().format('YYYY-MM-DD');
        // console.log("Bus ID: ", busID)
        Bus.getDriverInfo(todayDate, busID, (error, assignments) => {
            // console.log("Assignment: ", assignment)
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch assignments.' });
            }

            if (!assignments) {
                return res.status(200).json({ message: 'Assignments not found.' });
            }
            
            res.status(200).json({ assignments });
        });
    },

    assignBus: (req, res) => {
        // #swagger.tags = ['Assign Bus']
        // #swagger.description = 'Endpoint to assign a ticket to a bus'
        const { boughtTicketID, busID } = req.body;

        Bus.getById(busID, (error, bus) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to log in.' });
            }

            if (!bus) {
                return res.status(400).json({ message: 'Bus doesn\'t exist' });
            }

            const assignmentData = {
                boughtTicketID,
                busID,
            };

            Bus.assignToBus(assignmentData, (error, assignmentResponse) => {
                if (error) {
                    return res.status(500).json({ error: 'Failed to create a new bus.' });
                }
                // res.status(201).json(newBus);
                res.status(201).json({
                    message: 'Bus registered successfully',
                    assignmentResponse: assignmentResponse,
                });
            });
        });
    },

    loginBus: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to login with a bus account'
        const { plaqueNumber, password } = req.body;

        if (!plaqueNumber || !password) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        Bus.getByPlaqueNumber(plaqueNumber, (error, bus) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to log in.' });
            }
            if (!bus) {
                return res.status(401).json({ error: 'Plaque Number doesn\'t exist' });
            }

            // Compare the provided password with the hashed password in the database
            bcrypt.compare(password, bus.password, (compareError, isMatch) => {
                if (compareError) {
                    return res.status(500).json({ error: 'Failed to compare passwords.' });
                }

                if (!isMatch) {
                    return res.status(401).json({ error: 'Wrong Password' });
                }

                // Create and send JWT token
                const payload = {
                    id: bus.id,
                    plaqueNumber: bus.plaqueNumber,
                    // role: user.role,
                    companyID: bus.companyID
                };

                // const secretKey = process.env.JWT_SECRET_KEY // Replace with your actual secret key
                const options = {
                    expiresIn: '24h' // Token expiration time
                };

                // const token = jwt.sign(payload, secretKey, options);

                jwt.sign(payload, jwtSecretKey, options, (jwtError, token) => {
                    if (jwtError) {
                        console.error('Error generating JWT:', jwtError);
                        return res.status(500).json({ error: 'Login failed' });
                    }

                    res.cookie('busToken', token, { httpOnly: true }); // Set the JWT token as a cookie
                    res.cookie('busID', bus.id, { httpOnly: true, secure: true }); // Set the user ID cookie
                    res.cookie('busPlaqueNumber', bus.plaqueNumber, { httpOnly: true, secure: true }); // Set the user role cookie
                    res.cookie('busCompanyID', bus.companyID, { httpOnly: true, secure: true }); // Set the user role cookie

                    res.status(200).json({ message: 'Login successful', token, bus });
                });

                // res.status(200).json(bus);
            });
        });
    },

    getBoughtTicketsForTodayByBusID: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to get Bought Tickets for today\'s date by BusID'

        // Get today's date in the format YYYY-MM-DD
        const busID = req.params.busID;
        const companyID = req.params.companyID;
        const todayDate = moment().format('YYYY-MM-DD');

        // Fetch all bought tickets for today's date
        Bus.getAllByDateAndBusID(todayDate, busID, companyID, (error, boughtTickets) => {
            if (error) {
                console.error('Error fetching bought tickets for today:', error);
                return res.status(500).json({ error: 'Failed to fetch bought tickets for today' });
            }

            if (boughtTickets.length === 0) {
                // console.log("No tickets today")
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
                            maxCapacity: format.maxCapacity,
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
    },

    getLast7DaysRevenueByBusID: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to get the total revenue for each of the last 7 days by a bus'

        // Calculate the start and end dates for the last 7 days
        const companyID = req.params.companyID;
        const busID = req.params.busID;
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
            Bus.getAllByDateAndBusID(date, busID, companyID, (error, boughtTickets) => {
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
    },

    getBoughtTicketsForCurrentMonthByCompanyID: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to get Bought Tickets for the current month by BusID'

        // Get the current month in the format YYYY-MM
        const companyID = req.params.companyID;
        const busID = req.params.busID;
        const currentMonth = moment().format('YYYY-MM');

        // Fetch all bought tickets for the current month
        Bus.getAllByMonthAndBusID(currentMonth, busID, companyID, (error, boughtTickets) => {
            if (error) {
                console.error('Error fetching bought tickets for the current month:', error);
                return res.status(500).json({ error: 'Failed to fetch bought tickets for the current month' });
            }

            if (boughtTickets.length === 0) {
                // console.log(`No tickets in ${currentMonth}`)
                return res.status(200).json({ message: 'No tickets bought for the current month' });
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
                        res.status(200).json({ ticketsForCurrentMonth });
                    }
                });
            };

            // Fetch ticket format details for each ticket bought in the current month
            boughtTickets.forEach((ticket) => {
                fetchTicketFormatDetails(ticket);
            });
        });
    },

    getLast6MonthsRevenue: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to get the total revenue for each of the last 6 months using BusID'

        // Calculate the start and end dates for the last 6 months
        const companyID = req.params.companyID;
        const busID = req.params.busID;
        const endDate = moment().format('YYYY-MM'); // Current year and month
        const startDate = moment().subtract(5, 'months').format('YYYY-MM'); // 6 months ago

        // console.log(startDate, endDate);

        // Initialize an array to store the monthly revenue objects
        const monthlyRevenues = [];

        // Function to format a date as YYYY-MM
        const formatDateAsYYYYMM = (date) => moment(date).format('YYYY-MM');

        // Function to fetch bought tickets for a specific month
        const fetchBoughtTicketsForMonth = (month) => {
            Bus.getAllByMonthAndBusID(month, busID, companyID, (error, boughtTickets) => {
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
    },

    updateBusByID: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to update a Bus by ID'
        const busID = req.params.id;
        const updatedBusData = req.body;
        Bus.updateById(busID, updatedBusData, (error, updatedBus) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to update the bus.' });
            }
            if (!updatedBus) {
                return res.status(404).json({ message: 'Bus not found.' });
            }
            res.status(200).json(updatedBus);
        });
    },

    deleteBusByID: (req, res) => {
        // #swagger.tags = ['Buses']
        // #swagger.description = 'Endpoint to delete a Bus by ID'
        const busID = req.params.id;
        Bus.deleteById(busID, (error, deletedBus) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to delete the bus.' });
            }
            if (!deletedBus) {
                return res.status(404).json({ message: 'Bus not found.' });
            }
            res.status(200).json(deletedBus);
        });
    },
};

module.exports = busController;
