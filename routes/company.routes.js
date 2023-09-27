const express = require('express');
const CompanyController = require('../controllers/company.controller');
const checkUserRole = require('../middlewares/checkUserRole.middleware');
const router = express.Router();

router.post('/companies/add', checkUserRole(['WORKER']),CompanyController.createCompany);
router.get('/companies/getCompanies', CompanyController.getAllCompanies);
router.get('/companies/:id', CompanyController.getCompanyByID);
router.delete('/companies/delete/:id', checkUserRole(['WORKER']), CompanyController.deleteCompanyByCompanyID);
// ... other company routes

module.exports = router;
