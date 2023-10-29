const pool = require('../utils/mysql');
// const moment = require('moment');
const moment = require('moment-timezone');

class BoughtTicket {
    constructor(id, customerID, ticketFormatID, ticketDate, plaqueNumber, paymentMethodUsed, timeBought, status) {
        this.id = id;
        this.customerID = customerID;
        this.ticketFormatID = ticketFormatID;
        this.ticketDate = ticketDate;
        this.plaqueNumber = plaqueNumber;
        this.paymentMethodUsed = paymentMethodUsed;
        this.timeBought = timeBought;
        this.status = status
    }

    static getAll(callback) {
        const query = 'SELECT * FROM boughttickets';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching bought tickets:', error);
                return callback(error, null);
            }

            const boughtTickets = results.map(row => new BoughtTicket(
                row.id,
                row.customerID,
                row.ticketFormatID,
                row.ticketDate,
                row.plaqueNumber,
                row.paymentMethodUsed,
                row.timeBought,
                row.status
            ));
            callback(null, boughtTickets);
        });
    }

    static create(boughtTicketData, callback) {
        const query = 'INSERT INTO boughttickets SET ?';
        pool.query(query, boughtTicketData, (error, result) => {
            if (error) {
                console.error('Error creating bought ticket:', error);
                return callback(error, null);
            }

            // console.log(result)
            const newBoughtTicket = new BoughtTicket(
                result.insertId,
                boughtTicketData.customerID,
                boughtTicketData.ticketFormatID,
                boughtTicketData.ticketDate,
                boughtTicketData.plaqueNumber,
                boughtTicketData.paymentMethodUsed,
                // result.insertTimeBought
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
                boughtTicketData.ticketDate,
                boughtTicketData.plaqueNumber,
                boughtTicketData.paymentMethodUsed,
                boughtTicketData.timeBought,
                boughtTicketData.status
            );
            callback(null, boughtTicket);
        });
    }

    static getAllByCustomerID(customerID, callback) {
        const query = `
          SELECT bt.*, loc_origin.location_name AS originLocation,
          loc_dest.location_name AS destinationLocation,
          tf.ticketTime, tf.price, tf.distance, tf.duration, tf.priceStandard, pa.description, b.plaqueNumber, b.maxCapacity, c.companyName
          
          FROM boughttickets bt
          INNER JOIN ticketformats tf ON bt.ticketFormatID = tf.id
          INNER JOIN companies c ON tf.companyID = c.companyID
          JOIN buses b ON tf.busID = b.id
          LEFT JOIN priceStandards pa ON tf.priceStandard = pa.id
          JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
          JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
          WHERE bt.customerID = ?
        `;

        pool.query(query, [customerID], (error, results) => {
            if (error) {
                return callback(error);
            }

            const boughtTickets = results.map(row => {

                // Parse the `ticketDate` string into a JavaScript Date object
                const date = new Date(row.ticketDate);

                // Add 2 hours to the date
                date.setHours(date.getHours() + 2);

                // Format the modified date back to a string
                const formattedTicketDate = date.toISOString();
                return {
                    // Map the retrieved data to the required format
                    // Include ticketFormat and company details
                    id: row.id,
                    customerID: row.customerID,

                    ticketFormatID: row.ticketFormatID,
                    // ticketDate: row.ticketDate,
                    ticketDate: row.ticketDate,
                    // ticketDate: moment(row.ticketDate).tz('Africa/Kigali').format(),
                    // ticketDate: Date(row.ticketDate).setHours(Date(row.ticketDate).getHours() + 2).toISOString(),
                    plaqueNumber: row.plaqueNumber,
                    paymentMethodUsed: row.paymentMethodUsed,
                    timeBought: row.timeBought,
                    status: row.status,
                    // Include ticketFormat details
                    ticketFormat: {
                        originLocation: row.originLocation,
                        destinationLocation: row.destinationLocation,
                        ticketTime: row.ticketTime,
                        price: row.price,
                        distance: row.distance,
                        duration: row.duration,
                        priceStandard: row.priceStandard,
                        route: row.description,
                        plaqueNumber: row.plaqueNumber,
                        maxCapacity: row.maxCapacity,
                    },
                    // Include company details
                    company: {
                        companyName: row.companyName,
                    },
                }
            });


            // console.log(customerID)
            callback(null, boughtTickets);
        });
    }

    static getByIDAndCustomerID(ticketID, customerID, callback) {
        const query = `
          SELECT bt.*,loc_origin.location_name AS originLocation,
          loc_dest.location_name AS destinationLocation,
          tf.ticketTime, tf.price, tf.distance, tf.duration, tf.priceStandard, pa.description, b.plaqueNumber, b.maxCapacity, c.companyName
          
          FROM boughttickets bt
          INNER JOIN ticketformats tf ON bt.ticketFormatID = tf.id
          INNER JOIN companies c ON tf.companyID = c.companyID
          JOIN buses b ON tf.busID = b.id
          LEFT JOIN priceStandards pa ON tf.priceStandard = pa.id
          JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
          JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
          WHERE bt.id = ? AND bt.customerID = ?
        `;

        pool.query(query, [ticketID, customerID], (error, results) => {
            if (error) {
                return callback(error);
            }

            if (results.length === 0) {
                // No matching ticket found
                return callback(null, null);
            }

            const row = results[0];

            // Convert the database date (which may be in UTC) to your desired timezone
            const ticketDate = moment(row.ticketDate).tz('Africa/Kigali').format();

            // Parse the date string into a JavaScript Date object
            // const date = new Date(row.ticketDate);

            // // Add 2 hours to the date
            // date.setHours(date.getHours() + 2);

            // // Format the date as a string
            // const formattedTicketDate = date.toISOString();

            // const boughtTickets = results.map(row => ({
            const boughtTicket = {
                // Map the retrieved data to the required format
                // Include ticketFormat and company details
                id: row.id,
                customerID: row.customerID,
                ticketFormatID: row.ticketFormatID,
                // ticketDate: row.ticketDate,
                ticketDate: ticketDate,
                plaqueNumber: row.plaqueNumber,
                paymentMethodUsed: row.paymentMethodUsed,
                timeBought: row.timeBought,
                status: row.status,
                // Include ticketFormat details
                ticketFormat: {
                    originLocation: row.originLocation,
                    destinationLocation: row.destinationLocation,
                    ticketTime: row.ticketTime,
                    price: row.price,
                    distance: row.distance,
                    duration: row.duration,
                    priceStandard: row.priceStandard,
                    route: row.description,
                    plaqueNumber: row.plaqueNumber,
                    maxCapacity: row.maxCapacity,
                },
                // Include company details
                company: {
                    companyName: row.companyName,
                },
            };

            // console.log(boughtTicket)

            callback(null, boughtTicket);
        });
    }

    static getAllByCompanyID(companyID, callback) {
        const query = `
            SELECT bt.*, us.firstName, us.lastName, us.telephone, us.nationalID, loc_origin.location_name AS originLocation,
            loc_dest.location_name AS destinationLocation,
            tf.ticketTime, tf.price, tf.distance, tf.duration, tf.priceStandard, pa.description, b.plaqueNumber, b.maxCapacity, c.companyName
            
            FROM boughttickets bt
            INNER JOIN ticketformats tf ON bt.ticketFormatID = tf.id
            INNER JOIN companies c ON tf.companyID = c.companyID
            INNER JOIN users us ON bt.customerID = us.id
            JOIN buses b ON tf.busID = b.id
            LEFT JOIN priceStandards pa ON tf.priceStandard = pa.id
            JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
            JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
            WHERE tf.companyID = ?
        `;

        pool.query(query, [companyID], (error, results) => {
            if (error) {
                return callback(error, null);
            }

            const boughtTickets = results.map(row => ({
                id: row.id,
                customerID: row.customerID,
                customerNames: `${row.firstName} ${row.lastName}`,
                customerTelephone: row.telephone,
                customerNID: row.nationalID,
                // },
                // ticketFormatID: row.ticketFormatID,
                ticketDate: row.ticketDate,
                paymentMethodUsed: row.paymentMethodUsed,
                timeBought: row.timeBought,
                location: `From ${row.originLocation} to ${row.destinationLocation}`,
                ticketTime: row.ticketTime,
                status: row.status,
                priceStandard: row.priceStandard,
                route: row.description,
                plaqueNumber: row.plaqueNumber,
                maxCapacity: row.maxCapacity,
                price: row.price,
            }));

            callback(null, boughtTickets);
        });
    }

    static getAllByTodaysDateAndCompanyID(date, companyID, callback) {
        const query = `
            SELECT bt.*, us.firstName, us.lastName, us.telephone, us.nationalID, loc_origin.location_name AS originLocation,
            loc_dest.location_name AS destinationLocation,
            tf.ticketTime, tf.price, tf.distance, tf.duration, tf.priceStandard, pa.description, b.plaqueNumber, b.maxCapacity, c.companyName
            
            FROM boughttickets bt
            INNER JOIN ticketformats tf ON bt.ticketFormatID = tf.id
            INNER JOIN companies c ON tf.companyID = c.companyID
            INNER JOIN users us ON bt.customerID = us.id
            JOIN buses b ON tf.busID = b.id
            LEFT JOIN priceStandards pa ON tf.priceStandard = pa.id
            JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
            JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
            WHERE tf.companyID = ? AND bt.ticketDate = '${date}'
        `;

        // console.log(query)
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                return callback(error, null);
            }


            const boughtTickets = results.map(row => {

                // console.log(row)
                return {
                    id: row.id,
                    customerID: row.customerID,
                    customerNames: `${row.firstName} ${row.lastName}`,
                    customerTelephone: row.telephone,
                    customerNID: row.nationalID,
                    // },
                    // ticketFormatID: row.ticketFormatID,
                    ticketDate: row.ticketDate,
                    paymentMethodUsed: row.paymentMethodUsed,
                    timeBought: row.timeBought,
                    location: `From ${row.originLocation} to ${row.destinationLocation}`,
                    ticketTime: row.ticketTime,
                    status: row.status,
                    priceStandard: row.priceStandard,
                    route: row.description,
                    plaqueNumber: row.plaqueNumber,
                    maxCapacity: row.maxCapacity,
                    price: row.price,
                }
            });

            callback(null, boughtTickets);
        });
    }

    static getAllAssignedByTodaysDateAndCompanyID(date, companyID, callback) {
        const query = `
            SELECT bt.*, us.firstName, us.lastName, us.telephone, us.nationalID, loc_origin.location_name AS originLocation,
            loc_dest.location_name AS destinationLocation,
            tf.ticketTime, tf.price, tf.distance, tf.duration, tf.priceStandard, pa.description, b.plaqueNumber, b.maxCapacity, c.companyName
            bus.plaqueNumber AS plaque
            
            FROM boughttickets bt
            INNER JOIN ticketformats tf ON bt.ticketFormatID = tf.id
            INNER JOIN companies c ON tf.companyID = c.companyID
            INNER JOIN users us ON bt.customerID = us.id
            INNER JOIN ticketAssignments ta ON bt.id = ta.boughtTicketID
            INNER JOIN buses bus ON ta.busID = bus.id
            LEFT JOIN priceStandards pa ON tf.priceStandard = pa.id
            JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
            JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
            WHERE tf.companyID = ? AND bt.ticketDate = '${date}'
        `;

        // console.log(query)
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                return callback(error, null);
            }


            const boughtTickets = results.map(row => {

                // console.log(row)
                return {
                    id: row.id,
                    customerID: row.customerID,
                    customerNames: `${row.firstName} ${row.lastName}`,
                    customerTelephone: row.telephone,
                    customerNID: row.nationalID,
                    // },
                    // ticketFormatID: row.ticketFormatID,
                    ticketDate: row.ticketDate,
                    paymentMethodUsed: row.paymentMethodUsed,
                    timeBought: row.timeBought,
                    location: `From ${row.originLocation} to ${row.destinationLocation}`,
                    ticketTime: row.ticketTime,
                    status: row.status,
                    priceStandard: row.priceStandard,
                    route: row.description,
                    plaqueNumber: row.plaqueNumber,
                    maxCapacity: row.maxCapacity,
                    price: row.price,
                }
            });

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
                row.ticketDate,
                row.plaqueNumber,
                row.paymentMethodUsed,
                row.timeBought,
                row.status,
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

            if (results.length === 0) {
                return callback(null, null); // No bought ticket found
            }

            const boughtTickets = results.map(row => new BoughtTicket(
                row.ticketID,
                row.customerID,
                row.ticketFormatID,
                row.ticketDate,
                row.plaqueNumber,
                row.paymentMethodUsed,
                row.timeBought,
                row.status,
                row.companyID
            ));
            callback(null, boughtTickets);
        });
    }

    static getAllByDate(date, callback) {
        const query = 'SELECT * FROM boughttickets WHERE ticketDate = ?';
        pool.query(query, [date], (error, results) => {
            if (error) {
                console.error('Error fetching bought tickets for date:', error);
                return callback(error, null);
            }

            const boughtTickets = results.map((row) => new BoughtTicket(
                row.id,
                row.customerID,
                row.ticketFormatID,
                row.ticketDate,
                row.plaqueNumber,
                row.paymentMethodUsed,
                row.timeBought,
                row.status,
            ));
            callback(null, boughtTickets);
        });
    }

    static getAllByDateAndCompanyID(date, companyID, callback) {
        const query = `
            SELECT bt.* FROM boughttickets bt
            JOIN ticketformats tf on bt.ticketFormatID = tf.id
            WHERE Date(bt.timeBought) = "${date}" AND tf.companyID = ?
        `;
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                console.error('Error fetching bought tickets for date:', error);
                return callback(error, null);
            }

            // console.log(results)

            // if (results.length === 0) {
            //     return callback(null, null);
            // }

            const boughtTickets = results.map((row) => new BoughtTicket(
                row.id,
                row.customerID,
                row.ticketFormatID,
                row.ticketDate,
                row.plaqueNumber,
                row.paymentMethodUsed,
                row.timeBought,
                row.status
            ));
            callback(null, boughtTickets);
        });
    }

    static getAllByTicketDateAndCompanyID(date, companyID, callback) {

        // const date = new Date('2023-09-30');
        const query = `
        SELECT bt.* FROM boughttickets bt
        JOIN ticketformats tf on bt.ticketFormatID = tf.id
        WHERE Date(bt.ticketDate) = "${date}" AND tf.companyID = ?
        `;

        // console.log(date)
        pool.query(query, [companyID], (error, results) => {
            if (error) {
                console.error('Error fetching bought tickets for date:', error);
                return callback(error, null);
            }

            // console.log(results)

            if (results.length === 0) {
                return callback(null, null);
            }

            const boughtTickets = results.map((row) => new BoughtTicket(
                row.id,
                row.customerID,
                row.ticketFormatID,
                row.ticketDate,
                row.plaqueNumber,
                row.paymentMethodUsed,
                row.timeBought,
                row.status
            ));
            callback(null, boughtTickets);
        });
    }

    static getAllByMonthAndCompanyID(month, companyID, callback) {
        // Extract the year and month from the provided month string (YYYY-MM)
        const year = month.split('-')[0];
        const monthNumber = month.split('-')[1];
        // const monthNumber = '08';
        // console.log(monthNumber)

        // Create a date range for the current month
        const startDate = `${year}-${monthNumber}-01`;
        // console.log("Start Date: ", startDate)
        const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        // console.log("End Date: ", endDate)

        const query = `
            SELECT bt.* FROM boughttickets bt
            JOIN ticketformats tf ON bt.ticketFormatID = tf.id
            WHERE DATE(bt.timeBought) >= ? AND DATE(bt.timeBought) <= ? AND tf.companyID = ?
        `;

        pool.query(query, [startDate, endDate, companyID], (error, results) => {
            if (error) {
                console.error('Error fetching bought tickets for the current month:', error);
                return callback(error, null);
            }

            // console.log(results)

            const boughtTickets = results.map((row) => new BoughtTicket(
                row.id,
                row.customerID,
                row.ticketFormatID,
                row.ticketDate,
                row.plaqueNumber,
                row.paymentMethodUsed,
                row.timeBought,
                row.status
            ));
            callback(null, boughtTickets);
        });
    }

    static deleteByID(boughtTicketID, callback) {
        const query = 'DELETE FROM boughttickets WHERE id = ?';
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

    static updateTicketDate(ticketID, newTicketDate, callback) {
        const query = 'UPDATE boughttickets SET ticketDate = ? WHERE id = ?';
        pool.query(query, [newTicketDate, ticketID], (error, result) => {
            if (error) {
                return callback(error, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, null); // No matching ticket found
            }

            callback(null, { id: ticketID, ticketDate: newTicketDate });
        });
    }

    static updateStatusToCancelled(ticketID, callback) {
        const query = 'UPDATE BoughtTickets SET status = ? WHERE id = ?';
        pool.query(query, ['CANCELLED', ticketID], (error, result) => {
            if (error) {
                return callback(error, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, null); // No matching ticket found
            }

            callback(null, { id: ticketID, status: 'CANCELLED' });
        });
    }
}

module.exports = BoughtTicket;
