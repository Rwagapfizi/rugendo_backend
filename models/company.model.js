const pool = require('../utils/mysql');

class Company {
    constructor(companyID, companyName, companyLocation) {
        this.companyID = companyID;
        this.companyName = companyName;
        this.companyLocation = companyLocation;
    }

    static getAll(callback) {
        pool.query('SELECT * FROM companies', (error, results) => {
            if (error) {
                return callback(error);
            }
            const companies = results.map(row => new Company(
                row.companyID,
                row.companyName,
                row.companyLocation,
            ));
            callback(null, companies);
        });
    }

    static getById(companyID, callback) {
        const query = 'SELECT * FROM companies WHERE companyID = ?';
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                console.error('Error fetching company by ID:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No company found
            }

            const companyData = results[0];
            const company = new Company(
                companyData.companyID,
                companyData.companyName,
                companyData.companyLocation
            );
            callback(null, company);
        });
    }

    static async isCompanyIDUnique(companyID) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) AS count FROM companies WHERE companyID = ?', [companyID], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0].count === 0); // True if count is 0 (unique)
                }
            });
        });
    }

    static create(companyData, callback) {
        pool.query('INSERT INTO companies SET ?', companyData, (error, result) => {
            if (error) {
                return callback(error);
            }
            if (!Company.validateCompany(companyData)) {
                const error = new Error('Invalid company data');
                return callback(error, null);
            }
            const newCompany = new Company(
                result.insertId,
                companyData.companyName,
                companyData.companyLocation,
            );

            // Modify the result object to include the newly inserted companyID
            // const newCompany = { ...companyData, companyID: result.insertId };
            callback(null, newCompany);
        });
    }

    

    static deleteByCompanyID(companyID, callback) {
        const query = 'DELETE FROM companies WHERE companyID = ?';
        pool.query(query, [companyID], (error, result) => {
            if (error) {
                console.error('Error deleting company by ID:', error);
                return callback(error, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, null); // No company found
            }

            return callback(null, { companyID }); // Return the deleted company's ID
        });
    }

    static validateCompany(company) {
        if (!company.companyName || !company.companyLocation) {
            return false;
        }
        // Implement further validation as needed
        return true;
    }
}

module.exports = Company;
