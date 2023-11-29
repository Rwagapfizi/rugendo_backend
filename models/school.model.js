const pool = require('../utils/mysql');

class School {
    constructor(schoolID, schoolName, schoolLocation) {
        this.schoolID = schoolID;
        this.schoolName = schoolName;
        this.schoolLocation = schoolLocation;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM schools';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching schools:', error);
                return callback(error, null);
            }

            const schools = results.map(schoolData => {
                return new School(
                    schoolData.schoolID,
                    schoolData.schoolName,
                    schoolData.schoolLocation
                );
            });

            callback(null, schools);
        });
    }

    static getByID(id, callback) {
        const query = 'SELECT * FROM schools WHERE schoolID = ?';
        pool.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }
            const row = results[0];
            const school = new School(
                row.schoolID,
                row.schoolName,
                row.schoolLocation,
            );
            callback(null, school);
        });
    }

    static create(schoolName, schoolLocation, callback) {
        const query = 'INSERT INTO schools (schoolName, schoolLocation) VALUES (?, ?)';
        pool.query(query, [schoolName, schoolLocation], (error, result) => {
            if (error) {
                console.error('Error creating school:', error);
                return callback(error, null);
            }

            callback(null, result.insertId);
        });
    }

    static deleteByID(schoolID, callback) {
        const query = 'DELETE FROM schools WHERE schoolID = ?';
        pool.query(query, [schoolID], (error, result) => {
            if (error) {
                console.error('Error deleting school:', error);
                return callback(error, null);
            }

            callback(null, result.affectedRows > 0);
        });
    }

    // ... other methods ...
}

class SchoolDestination {
    constructor(destinationID, destinationName, destinationLocation) {
        this.destinationID = destinationID;
        this.destinationName = destinationName;
        this.destinationLocation = destinationLocation;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM schoolDestinations';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching School Destinations:', error);
                return callback(error, null);
            }

            const schoolDestinations = results.map(schoolData => {
                return new SchoolDestination(
                    schoolData.destinationID,
                    schoolData.destinationName,
                    schoolData.destinationLocation
                );
            });

            callback(null, schoolDestinations);
        });
    }

    static getByID(id, callback) {
        const query = 'SELECT * FROM schoolDestinations WHERE destinationID = ?';
        pool.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }

            const row = results[0];
            const schoolDestination = new SchoolDestination(
                row.destinationID,
                row.destinationName,
                row.destinationLocation,
            );

            callback(null, schoolDestination);
        });
    }

    static create(destinationName, destinationLocation, callback) {
        const query = 'INSERT INTO schoolDestinations (destinationName, destinationLocation) VALUES (?, ?)';
        pool.query(query, [destinationName, destinationLocation], (error, result) => {
            if (error) {
                console.error('Error creating school destination:', error);
                return callback(error, null);
            }

            callback(null, result.insertId);
        });
    }

    static deleteByID(destinationID, callback) {
        const query = 'DELETE FROM schoolDestinations WHERE destinationID = ?';
        pool.query(query, [destinationID], (error, result) => {
            if (error) {
                console.error('Error deleting school destination:', error);
                return callback(error, null);
            }

            callback(null, result.affectedRows > 0);
        });
    }

    // ... other methods ...
}

class SchoolBus {
    constructor(id, customerID, companyID, busID, schoolID, destinationID, tripDate, numOfPeople, timeBooked) {
        this.id = id;
        this.customerID = customerID;
        this.companyID = companyID;
        this.busID = busID;
        this.schoolID = schoolID;
        this.destinationID = destinationID;
        this.tripDate = tripDate;
        this.numOfPeople = numOfPeople;
        this.timeBooked = timeBooked;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM schoolBuses';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching booked buses:', error);
                return callback(error, null);
            }

            const schoolBuses = results.map(row => new SchoolBus(
                row.id,
                row.customerID,
                row.companyID,
                row.busID,
                row.schoolID,
                row.destinationID,
                row.tripDate,
                row.numOfPeople,
                row.timeBooked
            ));
            callback(null, schoolBuses);
        });
    }

    static getByID(id, callback) {
        const query = 'SELECT * FROM schoolBuses WHERE id = ?';
        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error('Error fetching booked buses:', error);
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }

            const row = results[0];
            const schoolBus = new SchoolBus(
                row.id,
                row.customerID,
                row.companyID,
                row.busID,
                row.schoolID,
                row.destinationID,
                row.tripDate,
                row.numOfPeople,
                row.timeBooked
            );
            callback(null, schoolBus);
        });
    }

    static getDetailedByID(id, callback) {
        const query = `
            SELECT bb.*,
            us.firstName, us.lastName, us.telephone, us.nationalID,
                sc.schoolName,
                sd.destinationName,
                b.plaqueNumber,
                c.companyName, c.companyTelephone
            FROM schoolBuses bb
                INNER JOIN buses b ON bb.busID = b.id
                INNER JOIN companies c ON bb.companyID = c.companyID
                INNER JOIN users us ON bb.customerID = us.id
                JOIN schools sc ON bb.schoolID = sc.schoolID
                JOIN schoolDestinations sd ON bb.destinationID = sd.destinationID
            WHERE bb.id = ?
        `;

        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error('Error fetching booked bus details:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); 
            }

            const schoolBusData = results[0];

            const schoolBus = {
                ID: schoolBusData.id,
                customerID: schoolBusData.customerID,
                customerNames: `${schoolBusData.firstName} ${schoolBusData.lastName}`,
                customerTelephone: schoolBusData.telephone,
                customerNID: schoolBusData.nationalID,
                tripDate: schoolBusData.tripDate,
                timeBooked: schoolBusData.timeBooked,
                numOfPeople: schoolBusData.numOfPeople,
                plaqueNumber: schoolBusData.plaqueNumber,
                schoolName: schoolBusData.schoolName,
                destinationName: schoolBusData.destinationName,
                companyName: schoolBusData.companyName,
                companyTelephone: schoolBusData.companyTelephone,
            };

            callback(null, schoolBus);
        });
    }

    static create(schoolBusData, callback) {
        const query = 'INSERT INTO schoolBuses SET ?';
        pool.query(query, schoolBusData, (error, result) => {
            if (error) {
                console.error('Error creating booked bus:', error);
                return callback(error, null);
            }

            const newSchoolBus = new SchoolBus(
                result.insertId,
                schoolBusData.customerID,
                schoolBusData.companyID,
                schoolBusData.busID,
                schoolBusData.schoolID,
                schoolBusData.destinationID,
                schoolBusData.tripDate,
                schoolBusData.numOfPeople,
                schoolBusData.timeBooked
            );
            callback(null, newSchoolBus);
        });
    }

    static deleteByID(id, callback) {
        const query = 'DELETE FROM schoolBuses WHERE id = ?';
        pool.query(query, [id], (error, result) => {
            if (error) {
                console.error('Error deleting schoolBus:', error);
                return callback(error, null);
            }

            callback(null, result.affectedRows > 0);
        });
    }
}

module.exports = { School, SchoolDestination, SchoolBus };
// module.exports = { Location };