const express = require('express');
const app = express()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/company.model');

function generateRandom3DigitNumber() {
    return Math.floor(Math.random() * 900) + 100; // Generates a random number between 100 and 999
}

const createCompany = async(req, res) => {
    // #swagger.tags = ['Companies']
    // #swagger.description = 'Endpoint to create a Company'

    const { companyName, companyLocation } = req.body;
    let generatedCompanyID;
    let isUnique = false;

    // Generate a unique 3-digit companyID
    while (!isUnique) {
        generatedCompanyID = generateRandom3DigitNumber();
        isUnique = await Company.isCompanyIDUnique(generatedCompanyID);
    }

    const newCompany = {
        companyID: generatedCompanyID,
        companyName,
        companyLocation
    };

    // Insert the new company into the database
    Company.create(newCompany, (createError, result) => {
        if (createError) {
            console.error('Failed to create company:', createError);
            res.status(500).json({ error: 'Failed to create company' });
        } else {
            res.status(201).json({
                message: 'Company created successfully',
                companyID: generatedCompanyID, // Newly generated unique companyID
                company: result
            });
        }
    });
};

const getAllCompanies = (req, res) => {
    // #swagger.tags = ['Companies']
    // #swagger.description = 'Endpoint to get all Companies'

    Company.getAll((error, companies) => {
        if (error) {
            console.error('Failed to fetch companies:', error);
            res.status(500).json({ error: 'Failed to fetch companies' });
        } else {
            res.status(200).json(companies);
        }
    });
};

const getCompanyByID = (req, res) => {
    // #swagger.tags = ['Companies']
    // #swagger.description = 'Endpoint to get a Company by ID'
    const companyID = req.params.id;

    Company.getById(companyID, (error, company) => {
        if (error) {
            console.error('Failed to fetch companies:', error);
            res.status(500).json({ error: 'Failed to fetch companies' });
        } else {
            res.status(200).json(company);
        }
    });
};

const deleteCompanyByCompanyID = (req, res) => {
    // #swagger.tags = ['Companies']
    // #swagger.description = 'Endpoint to delete a Company by Company ID'

    const companyID = req.params.id; // Assuming the ID is provided in the URL parameter

    Company.deleteByCompanyID(companyID, (deleteError, deletedCompany) => {
        if (deleteError) {
            console.error('Failed to delete company:', deleteError);
            res.status(500).json({ error: 'Failed to delete company' });
        } else if (!deletedCompany) {
            res.status(404).json({ error: 'Company not found' });
        } else {
            res.status(200).json({ message: 'Company deleted successfully' });
        }
    });
};

// ... other user controller functions

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyByID,
    deleteCompanyByCompanyID
};
