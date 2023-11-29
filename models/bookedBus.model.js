const pool = require('../utils/mysql');

class BookedBus {
    constructor(id, customerID, companyID, busID, originLocationID, destinationLocationID, tripDate, numOfPeople, timeBooked, readStatus) {
        this.id = id;
        this.customerID = customerID;
        this.companyID = companyID;
        this.busID = busID;
        this.originLocationID = originLocationID;
        this.destinationLocationID = destinationLocationID;
        this.tripDate = tripDate;
        this.numOfPeople = numOfPeople;
        this.timeBooked = timeBooked;
        this.readStatus = readStatus;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM bookedBuses';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching booked buses:', error);
                return callback(error, null);
            }

            const bookedBuses = results.map(row => new BookedBus(
                row.id,
                row.customerID,
                row.companyID,
                row.busID,
                row.originLocationID,
                row.destinationLocationID,
                row.tripDate,
                row.numOfPeople,
                row.timeBooked,
                row.readStatus
            ));
            callback(null, bookedBuses);
        });
    }

    static getByID(id, callback) {
        const query = 'SELECT * FROM bookedBuses WHERE id = ?';
        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error('Error fetching booked buses:', error);
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }

            const row = results[0];
            const bookedBus =  new BookedBus(
                row.id,
                row.customerID,
                row.companyID,
                row.busID,
                row.originLocationID,
                row.destinationLocationID,
                row.tripDate,
                row.numOfPeople,
                row.timeBooked,
                row.readStatus
            );
            callback(null, bookedBus);
        });
    }

    static getByCompanyID(companyID, callback) {
        // const query = 'SELECT * FROM bookedBuses WHERE companyID = ?';
        const query = `
            SELECT bb.*,
            us.firstName, us.lastName, us.telephone, us.nationalID,
                loc_origin.location_name AS OriginLocation,
                loc_dest.location_name AS DestinationLocation,
                b.plaqueNumber,
                c.companyName, c.companyTelephone
            FROM bookedBuses bb
                INNER JOIN buses b ON bb.busID = b.id
                INNER JOIN companies c ON bb.companyID = c.companyID
                INNER JOIN users us ON bb.customerID = us.id
                JOIN locations loc_origin ON bb.originLocationID = loc_origin.location_id
                JOIN locations loc_dest ON bb.destinationLocationID = loc_dest.location_id
            WHERE bb.companyID = ?
        `;
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                console.error('Error fetching booked buses:', error);
                return callback(error, null);
            }

            // const bookedBuses = results.map(row => new BookedBus(
            //     row.id,
            //     row.customerID,
            //     row.companyID,
            //     row.busID,
            //     row.originLocationID,
            //     row.destinationLocationID,
            //     row.tripDate,
            //     row.numOfPeople,
            //     row.timeBooked,
            //     row.readStatus
            // ));

            const bookedBuses = results.map(row => ({
                id: row.id,
                customerID: row.customerID,
                busID: row.busID,
                customerNames: `${row.firstName} ${row.lastName}`,
                customerTelephone: row.telephone,
                customerNID: row.nationalID,
                tripDate: row.tripDate,
                timeBooked: row.timeBooked,
                readStatus: row.readStatus,
                numOfPeople: row.numOfPeople,
                plaqueNumber: row.plaqueNumber,
                originLocation: row.OriginLocation,
                destinationLocation: row.DestinationLocation,
                companyName: row.companyName,
                companyTelephone: row.companyTelephone,
            }));

            callback(null, bookedBuses);
        });
    }

    static getDetailedByID(id, callback) {
        const query = `
            SELECT bb.*,
            us.firstName, us.lastName, us.telephone, us.nationalID,
                loc_origin.location_name AS OriginLocation,
                loc_dest.location_name AS DestinationLocation,
                b.plaqueNumber,
                c.companyName, c.companyTelephone
            FROM bookedBuses bb
                INNER JOIN buses b ON bb.busID = b.id
                INNER JOIN companies c ON bb.companyID = c.companyID
                INNER JOIN users us ON bb.customerID = us.id
                JOIN locations loc_origin ON bb.originLocationID = loc_origin.location_id
                JOIN locations loc_dest ON bb.destinationLocationID = loc_dest.location_id
            WHERE bb.id = ?
        `;

        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error('Error fetching booked bus details:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No delivery found with the given ID
            }

            const bookedBusData = results[0];

            const bookedBus = {
                ID: bookedBusData.id,
                customerID: bookedBusData.customerID,
                customerNames: `${bookedBusData.firstName} ${bookedBusData.lastName}`,
                customerTelephone: bookedBusData.telephone,
                customerNID: bookedBusData.nationalID,
                tripDate: bookedBusData.tripDate,
                timeBooked: bookedBusData.timeBooked,
                readStatus: bookedBusData.readStatus,
                numOfPeople: bookedBusData.numOfPeople,
                plaqueNumber: bookedBusData.plaqueNumber,
                originLocation: bookedBusData.OriginLocation,
                destinationLocation: bookedBusData.DestinationLocation,
                companyName: bookedBusData.companyName,
                companyTelephone: bookedBusData.companyTelephone,
            };

            callback(null, bookedBus);
        });
    }

    static create(bookedBusData, callback) {
        const query = 'INSERT INTO bookedBuses SET ?';
        pool.query(query, bookedBusData, (error, result) => {
            if (error) {
                console.error('Error creating booked bus:', error);
                return callback(error, null);
            }

            const newBookedBus = new BookedBus(
                result.insertId,
                bookedBusData.customerID,
                bookedBusData.companyID,
                bookedBusData.busID,
                bookedBusData.originLocationID,
                bookedBusData.destinationLocationID,
                bookedBusData.tripDate,
                bookedBusData.numOfPeople,
                bookedBusData.timeBooked
            );
            callback(null, newBookedBus);
        });
    }

    static updateBookedBusToRead(bookedBusID, callback) {
        const query = 'UPDATE BookedBuses SET readStatus = ? WHERE id = ?';
        pool.query(query, ['READ', bookedBusID], (error, result) => {
            if (error) {
                return callback(error, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, null); // No matching ticket found
            }

            callback(null, { id: bookedBusID, status: 'READ' });
        });
    }

    static deleteByID(id, callback) {
        const query = 'DELETE FROM bookedBuses WHERE id = ?';
        pool.query(query, [id], (error, result) => {
            if (error) {
                console.error('Error deleting bookedBus:', error);
                return callback(error, null);
            }

            callback(null, result.affectedRows > 0);
        });
    }
}

module.exports = BookedBus;
