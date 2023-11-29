const pool = require('../utils/mysql');

class TicketFormat {
    constructor(id, originLocation, destinationLocation, ticketTime, distance, duration, price, companyID, busID, priceStandard, status) {
        this.id = id;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.ticketTime = ticketTime;
        this.distance = distance;
        this.duration = duration;
        this.price = price;
        this.companyID = companyID;
        this.busID = busID;
        this.priceStandard = priceStandard;
        this.status = status;
    }

    static getAll(callback) {
        const query = `SELECT * FROM ticketformats`;
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching ticket formats:', error);
                return callback(error, null);
            }

            const ticketFormats = results.map(row => new TicketFormat(
                row.id,
                row.originLocation,
                row.destinationLocation,
                row.ticketTime,
                row.distance,
                row.duration,
                row.price,
                row.companyID,
                row.busID,
                row.priceStandard,
                row.status,
            ));
            callback(null, ticketFormats);
        });
    }

    static getAllDetailed(callback) {
        const query = `
        SELECT
            tf.id,
            loc_origin.location_name AS originLocation,
            loc_dest.location_name AS destinationLocation,
            tf.ticketTime,
            tf.distance,
            tf.duration,
            tf.price,
            tf.companyID,
            tf.busID,
            tf.priceStandard,
            tf.status,
            b.plaqueNumber,
            b.maxCapacity,
            c.companyName
        FROM
            ticketformats tf
            JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
            JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
            JOIN buses b ON tf.busID = b.id
            LEFT JOIN companies c ON tf.companyID = c.companyID
        `;

        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching ticket formats:', error);
                return callback(error, null);
            }
            // console.log(results)
            callback(null, results);
        });
    }

    static getDetailedByID(ticketFormatID, callback) {
        const query = `
        SELECT
            tf.id,
            loc_origin.location_name AS originLocation,
            loc_dest.location_name AS destinationLocation,
            tf.ticketTime,
            tf.distance,
            tf.duration,
            tf.price,
            tf.companyID,
            tf.busID,
            tf.priceStandard,
            tf.status,
            pa.description as route,
            b.plaqueNumber,
            b.maxCapacity,
            c.companyName
        FROM
            ticketformats tf
            JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
            JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
            JOIN buses b ON tf.busID = b.id
            LEFT JOIN priceStandards pa ON tf.priceStandard = pa.ID
            LEFT JOIN companies c ON tf.companyID = c.companyID
            WHERE tf.id = ?
        `;

        pool.query(query, [ticketFormatID], (error, results) => {
            if (error) {
                console.error('Error fetching ticket formats:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No ticket format found
            }

            const ticketFormat = results[0];
            callback(null, ticketFormat);

            // callback(null, results);
        });
    }

    static getById(ticketFormatID, callback) {
        const query = `
        SELECT tf.*,
        pa.description,
        b.plaqueNumber,
        b.maxCapacity 
        FROM ticketformats tf
        JOIN buses b ON tf.busID = b.id
        LEFT JOIN priceStandards pa ON tf.priceStandard = pa.ID
        WHERE tf.id = ?`;
        pool.query(query, [ticketFormatID], (error, results) => {
            if (error) {
                console.error('Error fetching ticket format by ID:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No ticket format found
            }

            const ticketFormatData = results[0];
            const ticketFormat = {
                id: ticketFormatData.id,
                originLocation: ticketFormatData.originLocation,
                destinationLocation: ticketFormatData.destinationLocation,
                ticketTime: ticketFormatData.ticketTime,
                distance: ticketFormatData.distance,
                duration: ticketFormatData.duration,
                price: ticketFormatData.price,
                companyID: ticketFormatData.companyID,
                busID: ticketFormatData.busID,
                priceStandard: ticketFormatData.priceStandard,
                status: ticketFormatData.status,
                route: ticketFormatData.description,
                plaqueNumber: ticketFormatData.plaqueNumber,
                maxCapacity: ticketFormatData.maxCapacity,
            };
            callback(null, ticketFormat);
        });
    }

    static create(ticketFormatData, callback) {
        const query = 'INSERT INTO ticketformats SET ?';
        // console.log("Ticket Model before Query: ", ticketFormatData)
        pool.query(query, ticketFormatData, (error, result) => {
            if (error) {
                console.error('Error creating ticket format:', error);
                return callback(error, null);
            }
            
            const newTicketFormat = new TicketFormat(
                result.insertId,
                ticketFormatData.originLocation,
                ticketFormatData.destinationLocation,
                ticketFormatData.ticketTime,
                ticketFormatData.distance,
                ticketFormatData.duration,
                ticketFormatData.price,
                ticketFormatData.companyID,
                // ticketFormatData.plaqueNumber,
                ticketFormatData.busID,
                ticketFormatData.priceStandard,
                ticketFormatData.status,
            );

            // console.log("Ticket Model after query: ", newTicketFormat);
            
            callback(null, newTicketFormat);
        });
    }

    static getAllByCompanyID(companyID, callback) {
        // const query = 'SELECT * FROM ticketformats WHERE companyID = ?';
        const query = `
        SELECT
        tf.id,
        tf.originLocation as originLocationID,
        loc_origin.location_name AS originLocation,
        tf.destinationLocation as destinationLocationID,
        loc_dest.location_name AS destinationLocation,
        tf.ticketTime,
        tf.distance,
        tf.duration,
        tf.price,
        tf.companyID,
        tf.busID,
        tf.priceStandard,
        tf.status,
        pa.description,
        b.plaqueNumber,
        b.maxCapacity,
        c.companyName
            FROM
        ticketformats tf
        JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
        JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
        JOIN buses b ON tf.busID = b.id
        LEFT JOIN priceStandards pa ON tf.priceStandard = pa.ID
        LEFT JOIN companies c ON tf.companyID = c.companyID
        where tf.companyID = ?
        `;
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                return callback(error);
            }
            // const ticketFormats = results.map(row => new TicketFormat(
            //     row.id,
            //     row.originLocation,
            //     row.destinationLocation,
            //     row.ticketTime,
            //     row.distance,
            //     row.duration,
            //     row.price,
            //     row.companyID
            // ));

            const ticketFormats = results.map(row => ({
                id: row.id,
                originLocationID: row.originLocationID,
                originLocation: row.originLocation,
                destinationLocationID: row.destinationLocationID,
                destinationLocation: row.destinationLocation,
                ticketTime: row.ticketTime,
                distance: row.distance,
                duration: row.duration,
                price: row.price,
                companyID: row.companyID,
                busID: row.busID,
                priceStandard: row.priceStandard,
                status: row.status,
                route: row.description,
                plaqueNumber: row.plaqueNumber,
                maxCapacity: row.maxCapacity,
            }));

            callback(null, ticketFormats);
        });
    }

    static getAllByLocationsAndCompanyID(originLocationID, destinationLocationID, companyID, callback) {
        // const query = 'SELECT * FROM ticketformats WHERE companyID = ?';
        const query = `
            SELECT
            tf.id,
            tf.originLocation as originLocationID,
            loc_origin.location_name AS originLocation,
            tf.destinationLocation as destinationLocationID,
            loc_dest.location_name AS destinationLocation,
            tf.ticketTime,
            tf.distance,
            tf.duration,
            tf.price,
            tf.companyID,
            tf.busID,
            tf.priceStandard,
            tf.status,
            pa.description,
            b.plaqueNumber,
            b.maxCapacity,
            c.companyName
                FROM
            ticketformats tf
            JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
            JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
            JOIN buses b ON tf.busID = b.id
            LEFT JOIN priceStandards pa ON tf.priceStandard = pa.ID
            LEFT JOIN companies c ON tf.companyID = c.companyID
            where tf.companyID = ? AND tf.originLocation = ? AND tf.destinationLocation = ?
        `;
        pool.query(query, [companyID, originLocationID, destinationLocationID], (error, results) => {
            if (error) {
                return callback(error);
            }
            // const ticketFormats = results.map(row => new TicketFormat(
            //     row.id,
            //     row.originLocation,
            //     row.destinationLocation,
            //     row.ticketTime,
            //     row.distance,
            //     row.duration,
            //     row.price,
            //     row.companyID
            // ));

            const ticketFormats = results.map(row => ({
                id: row.id,
                originLocationID: row.originLocationID,
                originLocation: row.originLocation,
                destinationLocationID: row.destinationLocationID,
                destinationLocation: row.destinationLocation,
                ticketTime: row.ticketTime,
                distance: row.distance,
                duration: row.duration,
                price: row.price,
                companyID: row.companyID,
                busID: row.busID,
                priceStandard: row.priceStandard,
                status: row.status,
                route: row.description,
                plaqueNumber: row.plaqueNumber,
                maxCapacity: row.maxCapacity,
            }));

            callback(null, ticketFormats);
        });
    }

    static updateByID(id, updatedTicketFormat, callback) {
        const query = `
            UPDATE ticketformats
            SET ticketTime = ?,
                busID = ?,
                status = ?
            WHERE id = ?
        `;

        const { ticketTime, busID, status } = updatedTicketFormat;
        const values = [ticketTime, busID, status, id];

        pool.query(query, values, (error, result) => {
            if (error) {
                console.error('Error updating ticket format:', error);
                return callback(error, null);
            }
            if (result.affectedRows === 0) {
                return callback(null, null); // No ticket format found for the given ID
            }
            callback(null, { id, ...updatedTicketFormat });
        });
    }


    static deleteByID(ticketFormatID, callback) {
        const query = `
            DELETE FROM ticketformats WHERE id = ?;
            `;
        pool.query(query, [ticketFormatID], (error, result) => {
            if (error) {
                console.error('Error deleting ticket format by ID:', error);
                return callback(error, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, null); // No ticket format found
            }

            return callback(null, { id: ticketFormatID }); // Return the deleted ticket format's ID
        });
    }
}

module.exports = TicketFormat;
