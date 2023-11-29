const pool = require('../utils/mysql');

class Company {
    constructor(companyID, companyName, workLocations, companyLogo, bookingPrice, companyTelephone) {
        this.companyID = companyID;
        this.companyName = companyName;
        this.workLocations = workLocations;
        this.companyLogo = companyLogo;
        this.bookingPrice = bookingPrice;
        this.companyTelephone = companyTelephone;
    }

    static getAll(callback) {
        pool.query('SELECT * FROM companies where companyID != 0', (error, results) => {
            if (error) {
                return callback(error);
            }
            const companies = results.map(row => new Company(
                row.companyID,
                row.companyName,
                row.workLocations,
                row.companyLogo,
                row.bookingPrice,
                row.companyTelephone,
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
                companyData.workLocations,
                companyData.companyLogo,
                companyData.bookingPrice,
                companyData.companyTelephone,
            );
            callback(null, company);
        });
    }

    static getCompaniesByLocations(fromLocationID, toLocationID, callback) {
        const query = `
            SELECT c.*
            FROM companies c
            WHERE EXISTS (
                SELECT 1
                FROM ticketFormats tf
                WHERE tf.companyID = c.companyID
                AND tf.originLocation = ? 
                AND tf.destinationLocation = ?
                AND tf.status = 'PUBLIC'
            )
        `;

        pool.query(query, [fromLocationID, toLocationID], (error, results) => {
            if (error) {
                return callback(error);
            }

            const companies = results.map(row => new Company(
                row.companyID,
                row.companyName,
                row.workLocations,
                row.companyLogo,
                row.bookingPrice,
                row.companyTelephone,
            ));

            callback(null, companies);
        });
    }

    static getSchoolCompaniesByLocations(fromLocationID, toLocationID, callback) {
        const query = `
            SELECT c.*
            FROM companies c
            WHERE EXISTS (
                SELECT 1
                FROM ticketFormats tf
                WHERE tf.companyID = c.companyID
                AND tf.originLocation = ? 
                AND tf.destinationLocation = ?
                AND tf.status = 'FOR SCHOOL'
            )
        `;

        pool.query(query, [fromLocationID, toLocationID], (error, results) => {
            if (error) {
                return callback(error);
            }

            const companies = results.map(row => new Company(
                row.companyID,
                row.companyName,
                row.workLocations,
                row.companyLogo,
                row.bookingPrice,
                row.companyTelephone,
            ));

            callback(null, companies);
        });
    }

    static getCompaniesByPrivateBuses(callback) {
        const query = `
            SELECT c.*
            FROM companies c
            WHERE EXISTS (
                SELECT 1
                FROM buses b
                WHERE b.companyID = c.companyID
                AND b.status = 'PRIVATE'
            )
        `;

        pool.query(query, (error, results) => {
            if (error) {
                return callback(error);
            }

            const companies = results.map(row => new Company(
                row.companyID,
                row.companyName,
                row.workLocations,
                row.companyLogo,
                row.bookingPrice,
                row.companyTelephone,
            ));

            callback(null, companies);
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
            // console.log(result);
            const newCompany = new Company(
                companyData.companyID,
                companyData.companyName,
                companyData.workLocations,
                companyData.companyLogo,
                companyData.bookingPrice,
                companyData.companyTelephone,
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
        if (!company.companyName || !company.workLocations || !company.bookingPrice || !company.companyTelephone) {
            return false;
        }
        // Implement further validation as needed
        return true;
    }
}

module.exports = Company;
