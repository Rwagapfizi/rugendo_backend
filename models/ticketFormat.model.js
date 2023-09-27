const pool = require('../utils/mysql');

class TicketFormat {
    constructor(id, originLocation, destinationLocation, ticketTime, distance, duration, price, companyID, plaqueNumber, maxSeats) {
        this.id = id;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.ticketTime = ticketTime;
        this.distance = distance;
        this.duration = duration;
        this.price = price;
        this.companyID = companyID;
        this.plaqueNumber = plaqueNumber;
        this.maxSeats = maxSeats;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM ticketformats';
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
                row.plaqueNumber,
                row.maxSeats,
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
        tf.plaqueNumber,
        tf.maxSeats,
        c.companyName
    FROM
        ticketformats tf
        JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
        JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
        LEFT JOIN companies c ON tf.companyID = c.companyID
        `;

        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching ticket formats:', error);
                return callback(error, null);
            }
            console.log(results)
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
        tf.plaqueNumber,
        tf.maxSeats,
        c.companyName
    FROM
        ticketformats tf
        JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
        JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
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
            // const ticketFormat = new TicketFormat(
            //     ticketFormatData.id,
            //     ticketFormatData.originLocation,
            //     ticketFormatData.destinationLocation,
            //     ticketFormatData.ticketTime,
            //     ticketFormatData.distance,
            //     ticketFormatData.duration,
            //     ticketFormatData.price,
            //     ticketFormatData.companyName
            // );
            callback(null, ticketFormat);

            // callback(null, results);
        });
    }

    static getById(ticketFormatID, callback) {
        const query = 'SELECT * FROM ticketformats WHERE id = ?';
        pool.query(query, [ticketFormatID], (error, results) => {
            if (error) {
                console.error('Error fetching ticket format by ID:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No ticket format found
            }

            const ticketFormatData = results[0];
            const ticketFormat = new TicketFormat(
                ticketFormatData.id,
                ticketFormatData.originLocation,
                ticketFormatData.destinationLocation,
                ticketFormatData.ticketTime,
                ticketFormatData.distance,
                ticketFormatData.duration,
                ticketFormatData.price,
                ticketFormatData.companyID,
                ticketFormatData.plaqueNumber,
                ticketFormatData.maxSeats,
            );
            callback(null, ticketFormat);
        });
    }

    static create(ticketFormatData, callback) {
        const query = 'INSERT INTO ticketformats SET ?';
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
                ticketFormatData.plaqueNumber,
                ticketFormatData.maxSeats,
            );
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
        tf.plaqueNumber,
        tf.maxSeats
            FROM
        ticketformats tf
        JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
        JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
        where companyID = ?
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
                plaqueNumber: row.plaqueNumber,
                maxSeats: row.maxSeats,
            }));

            callback(null, ticketFormats);
        });
    }

    static updateByID(id, updatedTicketFormat, callback) {
        const query = `
            UPDATE ticketformats
            SET ticketTime = ?,
                duration = ?,
                price = ?,
                plaqueNumber = ?,
                maxSeats = ?
            WHERE id = ?
        `;

        const { ticketTime, duration, price, plaqueNumber, maxSeats } = updatedTicketFormat;
        const values = [ticketTime, duration, price, plaqueNumber, maxSeats, id];

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
