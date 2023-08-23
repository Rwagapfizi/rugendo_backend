const pool = require('../utils/mysql');

class TicketFormat {
    constructor(id, originLocation, destinationLocation, ticketTime, distance, duration, price, companyID) {
        this.id = id;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.ticketTime = ticketTime;
        this.distance = distance;
        this.duration = duration;
        this.price = price;
        this.companyID = companyID;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM TicketFormats';
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
            ));
            callback(null, ticketFormats);
        });
    }

    static getById(ticketFormatID, callback) {
        const query = 'SELECT * FROM TicketFormats WHERE id = ?';
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
                ticketFormatData.companyID
            );
            callback(null, ticketFormat);
        });
    }

    static create(ticketFormatData, callback) {
        const query = 'INSERT INTO TicketFormats SET ?';
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
            );
            callback(null, newTicketFormat);
        });
    }

    static getAllByCompanyID(companyID, callback) {
        const query = 'SELECT * FROM ticketformats WHERE companyID = ?';
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                return callback(error);
            }
            const ticketFormats = results.map(row => new TicketFormat(
                row.id,
                row.originLocation,
                row.destinationLocation,
                row.ticketTime,
                row.distance,
                row.duration,
                row.price,
                row.companyID
            ));
            callback(null, ticketFormats);
        });
    }

    static deleteByID(ticketFormatID, callback) {
        const query = 'DELETE FROM TicketFormats WHERE id = ?';
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
