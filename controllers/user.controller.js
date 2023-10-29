require('dotenv').config()
const express = require('express');
const app = express()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY
const User = require('../models/user.model');
const Company = require('../models/company.model');

// Validate email format
const isValidEmail = (email) => {
    // Regular expression for basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Validate phone number format
// const isValidPhoneNumber = (phoneNumber) => {
//     // Regular expression for basic phone number format validation
//     // This example assumes a simple numeric phone number format (e.g., 123-456-7890)
//     const phoneRegex = /^\d{10}$/;
//     return phoneRegex.test(phoneNumber);
// };

const createUser = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Endpoint to create a User'
    const { firstName, lastName, email, telephone, nationalID, password, role, companyID } = req.body;

    // Check if all required fields are present
    if (!firstName || !lastName || !email || !telephone || !nationalID || !password || !role) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Additional validation logic for specific fields if needed
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // if (!isValidPhoneNumber(telephone)) {
    //     return res.status(400).json({ error: 'Invalid telephone number' });
    // }

    // Check if the email, telephone, or nationalID already exist
    User.getUserByEmail(email, (emailError, existingEmailUser) => {
        if (emailError) {
            console.error('Error checking email:', emailError);
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (existingEmailUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        User.getUserByTelephone(telephone, (telephoneError, existingTelephoneUser) => {
            if (telephoneError) {
                console.error('Error checking telephone:', telephoneError);
                return res.status(500).json({ error: 'An error occurred' });
            }

            if (existingTelephoneUser) {
                return res.status(400).json({ error: 'Telephone already exists' });
            }

            User.getUserByNationalID(nationalID, (nationalIDError, existingNationalIDUser) => {
                if (nationalIDError) {
                    console.error('Error checking national ID:', nationalIDError);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                if (existingNationalIDUser) {
                    return res.status(400).json({ error: 'National ID already exists' });
                }

                // Continue with user creation
                bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                    if (hashError) {
                        console.error('Failed to hash password:', hashError);
                        return res.status(500).json({ error: 'Failed to register user' });
                    }
                    const newUser = {
                        firstName,
                        lastName,
                        email,
                        telephone,
                        nationalID,
                        password: hashedPassword,
                        role
                    };

                    // Check if the user is a "WORKER" role
                    if (role === 'WORKER') {
                        // Fetch the company with the provided companyID
                        Company.getById(companyID, (companyError, company) => {
                            if (companyError || !company) {
                                res.status(400).json({ error: 'Invalid company ID' });
                            } else {
                                newUser.companyID = companyID; // Set the companyID
                                // Create a new user in the database
                                User.create(newUser, (createError, result) => {
                                    if (createError) {
                                        console.error('Failed to register user:', createError);
                                        res.status(500).json({ error: 'Failed to register user' });
                                    } else {
                                        res.status(201).json({ message: 'User registered successfully', user: result });
                                    }
                                });
                            }
                        });
                    } else if (role === "CUSTOMER") {
                        newUser.companyID = 0; // Set companyID to 0 for CUSTOMER role
                        // If role is "CUSTOMER", create user directly without checking companyID
                        User.create(newUser, (createError, result) => {
                            if (createError) {
                                console.error('Failed to register user:', createError);
                                res.status(500).json({ error: 'Failed to register user' });
                            } else {
                                res.status(201).json({ message: 'User registered successfully', user: result });
                            }
                        });
                    } else {
                        res.status(400).json({ error: 'Invalid role. User\'s role should either be CUSTOMER or WORKER' });
                    }
                });
            });
        });
    });
}

const login = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Endpoint for user login'
    const { email, password } = req.body;
    // console.log(email);

    // Find user by email
    User.getUserByEmail(email, (getUserError, user) => {
        if (getUserError) {
            console.error('Error fetching user by email:', getUserError);
            return res.status(500).json({ error: 'Login failed' });
        }

        // console.log(user);

        if (!user) {
            return res.status(401).json({ error: 'Email doesn\'t exist' });
        }

        // Validate password
        bcrypt.compare(password, user.password, (compareError, isMatch) => {
            if (compareError) {
                console.error('Error comparing passwords: ', compareError);
                return res.status(500).json({ error: 'Login failed' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Wrong password' });
            }

            // Create and send JWT token
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
                companyID: user.companyID
            };

            const secretKey = process.env.JWT_SECRET_KEY // Replace with your actual secret key
            const options = {
                expiresIn: '24h' // Token expiration time
            };

            // const token = jwt.sign(payload, secretKey, options);

            jwt.sign(payload, secretKey, options, (jwtError, token) => {
                if (jwtError) {
                    console.error('Error generating JWT:', jwtError);
                    return res.status(500).json({ error: 'Login failed' });
                }

                res.clearCookie('authToken');
                res.clearCookie('userID');
                res.clearCookie('userRole');
                res.clearCookie('userCompanyID');

                res.cookie('authToken', token, { httpOnly: true }); // Set the JWT token as a cookie
                res.cookie('userID', user.id, { httpOnly: true, secure: true }); // Set the user ID cookie
                res.cookie('userRole', user.role, { httpOnly: true, secure: true }); // Set the user role cookie
                res.cookie('userCompanyID', user.companyID, { httpOnly: true, secure: true }); // Set the user role cookie

                res.status(200).json({ message: 'Login successful', token });
            });
        });
    });
};

const logoutUser = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Endpoint to log out user'

    // Clear the authentication-related cookies
    if (req.cookies.authToken || req.cookies.userRole) {
        res.clearCookie('authToken');
        res.clearCookie('userRole');
        res.status(200).json({ message: 'Logout successful' });
    } else {
        res.status(401).json({ message: 'You were not logged in' });
    }

};

const getUserDetails = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Endpoint to get details of the logged-in user'

    // Retrieve the token from the cookie
    const authToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    // console.log(authToken)

    // Verify and decode the token
    jwt.verify(authToken, jwtSecretKey, (verifyError, decoded) => {
        // console.log(decoded)
        if (verifyError) {
            // Handle verification error
            res.status(401).json({ error: 'Unauthorized', verifyError: verifyError });
        } else {
            // Token is valid, proceed with fetching user details
            const userID = decoded.id; // Use the decoded token payload as needed

            // Fetch user details using userID and any appropriate method
            User.getUserById(userID, (error, user) => {
                if (error) {
                    console.error('Failed to fetch user details:', error);
                    res.status(500).json({ error: 'Failed to fetch user details' });
                } else {
                    // console.log(user)
                    if (user.role === 'CUSTOMER') {
                        // If the user is a CUSTOMER, only show basic user details
                        const userDetails = {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            telephone: user.telephone,
                            nationalID: user.nationalID,
                            role: user.role,
                        };

                        res.status(200).json(userDetails);
                    } else if (user.role === 'WORKER') {
                        // If the user is a WORKER, fetch company details using user.companyID
                        Company.getById(user.companyID, (companyError, company) => {
                            if (companyError) {
                                console.error('Failed to fetch company details:', companyError);
                                res.status(500).json({ error: 'Failed to fetch company details' });
                            } else {
                                // Combine user and company details
                                const userDetails = {
                                    id: user.id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email,
                                    telephone: user.telephone,
                                    nationalID: user.nationalID,
                                    role: user.role,
                                    company: {
                                        companyID: company.companyID,
                                        companyName: company.companyName,
                                        companyLocation: company.companyLocation,
                                        workLocations: company.workLocations,
                                    },
                                };
                                res.status(200).json(userDetails);
                            }
                        });
                    }
                }
            });
        }
    });
};


const getAllUsers = async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Endpoint to get all users'
    User.getAll((error, users) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(users);
    });
}

const deleteUserById = (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Endpoint to delete a User by ID'

    const userId = req.params.id; // Assuming the ID is provided in the URL parameter

    // Delete the user by ID
    User.deleteById(userId, (deleteError, deletedUser) => {
        if (deleteError) {
            console.error('Failed to delete user:', deleteError);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    });
};

module.exports = {
    createUser,
    getAllUsers,
    deleteUserById,
    login,
    getUserDetails,
    logoutUser
};
