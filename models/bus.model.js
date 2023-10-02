const pool = require('../utils/mysql');

class Bus {
    constructor(id, plaqueNumber, maxCapacity, model, password, companyID) {
        this.id = id;
        this.plaqueNumber = plaqueNumber;
        this.maxCapacity = maxCapacity;
        this.model = model;
        this.password = password;
        this.companyID = companyID;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM buses';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching buses:', error);
                return callback(error, null);
            }

            const buses = results.map(row => new Bus(
                row.id,
                row.plaqueNumber,
                row.maxCapacity,
                row.model,
                row.password,
                row.companyID
            ));
            callback(null, buses);
        });
    }

    static getById(busId, callback) {
        const query = 'SELECT * FROM buses WHERE id = ?';
        pool.query(query, [busId], (error, results) => {
            if (error) {
                return callback(error);
            }

            if (results.length === 0) {
                return callback(null, null); // No bus found
            }

            const busData = results[0];
            const bus = new Bus(
                busData.id,
                busData.plaqueNumber,
                busData.maxCapacity,
                busData.model,
                busData.password,
                busData.companyID
            );

            callback(null, bus);
        });
    }

    static getByCompanyID(companyID, callback) {
        const query = 'SELECT * FROM buses WHERE companyID = ?';
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                return callback(error);
            }

            const buses = results.map(row => new Bus(
                row.id,
                row.plaqueNumber,
                row.maxCapacity,
                row.model,
                row.password,
                row.companyID
            ));

            callback(null, buses);
        });
    }

    static login(busData, callback) {
        const query = 'SELECT * FROM buses WHERE plaqueNumber = ? AND password = ?';
        pool.query(query, [busData.plaqueNumber, busData.password], (error, results) => {
            if (error) {
                return callback(error);
            }

            if (results.length === 0) {
                return callback(null, null); // No matching bus found
            }

            const busData = results[0];
            const bus = new Bus(
                busData.id,
                busData.plaqueNumber,
                busData.maxCapacity,
                busData.model,
                busData.password,
                busData.companyID
            );

            callback(null, bus);
        });
    }

    static create(busData, callback) {
        const query = 'INSERT INTO buses SET ?';
        pool.query(query, busData, (error, result) => {
            if (error) {
                console.error('Error creating bus:', error);
                return callback(error, null);
            }

            const newBus = new Bus(
                result.insertId,
                busData.plaqueNumber,
                busData.maxCapacity,
                busData.model,
                busData.password,
                busData.companyID
            );
            callback(null, newBus);
        });
    }

    static getAssignments(callback) {
        const query = 'SELECT * FROM ticketAssignments';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching buses:', error);
                return callback(error, null);
            }

            console.log(results)

            const assignments = results.map(row => {
                return {
                    ID: row.ID,
                    boughtTicketID: row.boughtTicketID,
                    busID: row.busID,
                }
            });
            callback(null, assignments);
        });
    }

    static getAssignmentByID(assignmentID, callback) {
        const query = 'SELECT * FROM ticketAssignments WHERE id = ?';
        pool.query(query, [assignmentID], (error, results) => {
            if (error) {
                return callback(error);
            }

            if (results.length === 0) {
                return callback(null, null); // No bus found
            }

            const assignmentData = results[0];
            const assignment = {
                ID: assignmentData.ID,
                boughtTicketID: assignmentData.boughtTicketID,
                busId: assignmentData.busID,
            };

            callback(null, assignment);
        });
    }

    static getDriverData(busID, callback) {
        const query = `
            SELECT b.plaqueNumber, GROUP_CONCAT(ta.boughtTicketID) AS assignedTickets
            FROM buses b
            LEFT JOIN ticketAssignments ta ON b.id = ta.busID
            WHERE b.id = ?
            GROUP BY b.id
        `;

        pool.query(query, [busID], (error, results) => {
            if (error) {
                console.error('Error fetching driver data for bus:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No matching bus found
            }

            const driverData = results[0];
            const driverBusData = {
                plaqueNumber: driverData.plaqueNumber,
                assignedTickets: driverData.assignedTickets ? driverData.assignedTickets.split(',').map(Number) : [],
            };

            callback(null, driverBusData);
        });
    }

    static assignToBus(assignmentData, callback) {
        const query = 'INSERT INTO ticketAssignments SET ?';
        pool.query(query, assignmentData, (error, result) => {
            if (error) {
                console.error('Error creating bus:', error);
                return callback(error, null);
            }

            const newBus = {
                ID: result.insertId,
                boughtTicketID: assignmentData.boughtTicketID,
                busId: assignmentData.busID,
            };

            callback(null, newBus);
        });
    }

    static getByPlaqueNumber(plaqueNumber, callback) {
        const query = 'SELECT * FROM buses WHERE plaqueNumber = ?';
        pool.query(query, [plaqueNumber], (error, results) => {
            if (error) {
                return callback(error);
            }

            if (results.length === 0) {
                return callback(null, null); // No matching bus found
            }

            const busData = results[0];
            const bus = new Bus(
                busData.id,
                busData.plaqueNumber,
                busData.maxCapacity,
                busData.model,
                busData.password,
                busData.companyID
            );

            callback(null, bus);
        });
    }


    static updateById(busId, updatedBusData, callback) {
        const query = 'UPDATE buses SET ? WHERE id = ?';
        pool.query(query, [updatedBusData, busId], (error, result) => {
            if (error) {
                console.error('Error updating bus by ID:', error);
                return callback(error, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, null); // No matching bus found
            }

            updatedBusData.id = busId; // Include the bus ID in the updated data
            callback(null, updatedBusData);
        });
    }

    static deleteById(busId, callback) {
        const query = 'DELETE FROM buses WHERE id = ?';
        pool.query(query, [busId], (error, result) => {
            if (error) {
                console.error('Error deleting bus by ID:', error);
                return callback(error, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, null); // No matching bus found
            }

            return callback(null, { id: busId }); // Return the deleted bus's ID
        });
    }
}

module.exports = Bus;
