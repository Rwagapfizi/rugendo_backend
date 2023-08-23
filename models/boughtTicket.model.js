const pool = require('../utils/mysql');

class BoughtTicket {
    constructor(id, customerID, ticketFormatID, date, plaqueNumber, paymentMethodUsed) {
        this.id = id;
        this.customerID = customerID;
        this.ticketFormatID = ticketFormatID;
        this.date = date;
        this.plaqueNumber = plaqueNumber;
        this.paymentMethodUsed = paymentMethodUsed;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM BoughtTickets';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching bought tickets:', error);
                return callback(error, null);
            }

            const boughtTickets = results.map(row => new BoughtTicket(
                row.id,
                row.customerID,
                row.ticketFormatID,
                row.date,
                row.plaqueNumber,
                row.paymentMethodUsed
            ));
            callback(null, boughtTickets);
        });
    }

    static create(boughtTicketData, callback) {
        const query = 'INSERT INTO BoughtTickets SET ?';
        pool.query(query, boughtTicketData, (error, result) => {
            if (error) {
                console.error('Error creating bought ticket:', error);
                return callback(error, null);
            }

            const newBoughtTicket = new BoughtTicket(
                result.insertId,
                boughtTicketData.customerID,
                boughtTicketData.ticketFormatID,
                boughtTicketData.date,
                boughtTicketData.plaqueNumber,
                boughtTicketData.paymentMethodUsed
            );
            callback(null, newBoughtTicket);
        });
    }

    static getById(ticketID, callback) {
        const query = 'SELECT * FROM boughttickets WHERE id = ?';
        pool.query(query, [ticketID], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.length === 0) {
                return callback(null, null); // No bought ticket found
            }
            const boughtTicketData = results[0];
            const boughtTicket = new BoughtTicket(
                boughtTicketData.id,
                boughtTicketData.customerID,
                boughtTicketData.ticketFormatID,
                boughtTicketData.date,
                boughtTicketData.plaqueNumber,
                boughtTicketData.paymentMethodUsed
            );
            callback(null, boughtTicket);
        });
    }

    // static getAllByCustomerID(customerID, callback) {
    //     const query = 'SELECT bt.*, tf.originLocation, tf.destinationLocation, tf.ticketTime, tf.price, tf.distance, tf.duration FROM boughttickets bt ' +
    //                   'INNER JOIN ticketformats tf ON bt.ticketFormatID = tf.id ' +
    //                   'WHERE bt.customerID = ?';
    //     pool.query(query, [customerID], (error, results) => {
    //         if (error) {
    //             return callback(error);
    //         }
    //         const boughtTickets = results.map(row => new BoughtTicket(
    //             row.boughtTicketID,
    //             row.customerID,
    //             row.ticketFormatID,
    //             row.date,
    //             row.plaqueNumber,
    //             row.paymentMethodUsed,
    //             {
    //                 id: row.ticketFormatID,
    //                 originLocation: row.originLocation,
    //                 destinationLocation: row.destinationLocation,
    //                 ticketTime: row.ticketTime,
    //                 price: row.price,
    //                 distance: row.distance,
    //                 duration: row.duration
    //             }
    //         ));
    //         callback(null, boughtTickets);
    //     });
    // } 

    static getAllByCustomerID(customerID, callback) {
        const query = `
          SELECT bt.*, tf.originLocation, tf.destinationLocation, tf.ticketTime, tf.price, tf.distance, tf.duration, c.companyName
          FROM boughtTickets bt
          INNER JOIN ticketFormats tf ON bt.ticketFormatID = tf.id
          INNER JOIN companies c ON tf.companyID = c.companyID
          WHERE bt.customerID = ?
        `;

        pool.query(query, [customerID], (error, results) => {
            if (error) {
                return callback(error);
            }

            const boughtTickets = results.map(row => ({
                // Map the retrieved data to the required format
                // Include ticketFormat and company details
                id: row.id,
                customerID: row.customerID,
                ticketFormatID: row.ticketFormatID,
                date: row.date,
                plaqueNumber: row.plaqueNumber,
                paymentMethodUsed: row.paymentMethodUsed,
                // Include ticketFormat details
                ticketFormat: {
                    originLocation: row.originLocation,
                    destinationLocation: row.destinationLocation,
                    ticketTime: row.ticketTime,
                    price: row.price,
                    distance: row.distance,
                    duration: row.duration,
                },
                // Include company details
                company: {
                    companyName: row.companyName,
                },
            }));

            callback(null, boughtTickets);
        });
    }

    static getAllByTicketFormatIDs(ticketFormatIDs, callback) {
        if (ticketFormatIDs.length === 0) {
            return callback(null, []); // Return an empty array if no ticketFormatIDs provided
        }

        const placeholders = ticketFormatIDs.map(() => '?').join(',');
        const query = `SELECT * FROM boughttickets WHERE ticketFormatID IN (${placeholders})`;

        pool.query(query, ticketFormatIDs, (error, results) => {
            if (error) {
                return callback(error);
            }
            const boughtTickets = results.map(row => new BoughtTicket(
                row.id,
                row.customerID,
                row.ticketFormatID,
                row.date,
                row.plaqueNumber,
                row.paymentMethodUsed
            ));
            callback(null, boughtTickets);
        });
    }

    static getAllByWorkerCompanyID(companyID, callback) {
        const query = `
            SELECT bt.*
            FROM boughttickets bt
            INNER JOIN ticketformats tf ON bt.ticketFormatID = tf.id
            WHERE tf.companyID = ?
        `;
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                return callback(error);
            }
            const boughtTickets = results.map(row => new BoughtTicket(
                row.ticketID,
                row.customerID,
                row.ticketFormatID,
                row.date,
                row.plaqueNumber,
                row.paymentMethodUsed,
                row.companyID
            ));
            callback(null, boughtTickets);
        });
    }



    static deleteByID(boughtTicketID, callback) {
        const query = 'DELETE FROM BoughtTickets WHERE id = ?';
        pool.query(query, [boughtTicketID], (error, result) => {
            if (error) {
                console.error('Error deleting bought ticket by ID:', error);
                return callback(error, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, null); // No bought ticket found
            }

            return callback(null, { id: boughtTicketID }); // Return the deleted bought ticket's ID
        });
    }
}

module.exports = BoughtTicket;
