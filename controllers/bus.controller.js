require('dotenv').config()
const express = require('express');
const app = express()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY
const Bus = require('../models/bus.model');

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

        const busID = req.params.id;
        Bus.getDriverData(busID, (error, assignment) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch assignments.' });
            }

            if (!assignment) {
                return res.status(404).json({ message: 'Assignments not found.' });
            }
            res.status(200).json(assignment);
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
                return res.status(401).json({ message: 'Plaque Number doesn\'t exist' });
            }

            // Compare the provided password with the hashed password in the database
            bcrypt.compare(password, bus.password, (compareError, isMatch) => {
                if (compareError) {
                    return res.status(500).json({ error: 'Failed to compare passwords.' });
                }

                if (!isMatch) {
                    return res.status(401).json({ message: 'Wrong Password' });
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
