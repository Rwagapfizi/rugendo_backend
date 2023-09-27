const pool = require('../utils/mysql');

class Delivery {
    constructor(id, senderID, ticketFormatID, description, receiverName, receiverPhone, deliveryDate, timeForDelivery, timePaid) {
        this.id = id;
        this.senderID = senderID;
        this.ticketFormatID = ticketFormatID;
        this.description = description;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.deliveryDate = deliveryDate;
        this.timeForDelivery = timeForDelivery;
        this.timePaid = timePaid;
    }

    static getAll(callback) {
        const query = 'SELECT * FROM deliveries';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching deliveries:', error);
                return callback(error, null);
            }

            // console.log(results)
            const deliveries = results.map(row => new Delivery(
                row.ID,
                row.SenderID,
                row.TicketFormatID,
                row.Description,
                row.ReceiverName,
                row.ReceiverPhone,
                row.DeliveryDate,
                row.TimeForDelivery,
                row.timePaid
            ));
            callback(null, deliveries);
        });
    }

    static getByID(id, callback) {
        const query = 'SELECT * FROM deliveries WHERE id = ?';
        pool.query(query, [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }
            const row = results[0];
            const delivery = new Delivery(
                row.ID,
                row.SenderID,
                row.TicketFormatID,
                row.Description,
                row.ReceiverName,
                row.ReceiverPhone,
                row.DeliveryDate,
                row.TimeForDelivery,
                row.timePaid
            );
            callback(null, delivery);
        });
    }

    static getDeliveryDetailsByID(deliveryID, callback) {
        const query = `
            SELECT d.*,
            us.firstName, us.lastName, us.telephone,
                loc_origin.location_name AS OriginLocation,
                loc_dest.location_name AS DestinationLocation,
                tf.plaqueNumber,
                c.companyName
            FROM deliveries d
                INNER JOIN ticketformats tf ON d.ticketFormatID = tf.id
                INNER JOIN companies c ON tf.companyID = c.companyID
                INNER JOIN users us ON d.senderID = us.id
                JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
                JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
            WHERE d.id = ?
        `;

        pool.query(query, [deliveryID], (error, results) => {
            if (error) {
                console.error('Error fetching delivery details:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No delivery found with the given ID
            }

            const deliveryData = results[0];

            const delivery = {
                ID: deliveryData.ID,
                senderID: deliveryData.SenderID,
                senderNames: `${deliveryData.firstName} ${deliveryData.lastName}`,
                senderTelephone: deliveryData.telephone,
                senderNID: deliveryData.nationalID,
                ticketFormatID: deliveryData.TicketFormatID,
                description: deliveryData.Description,
                receiverName: deliveryData.ReceiverName,
                receiverPhone: deliveryData.ReceiverPhone,
                deliveryDate: deliveryData.DeliveryDate,
                timeForDelivery: deliveryData.TimeForDelivery,
                timePaid: deliveryData.timePaid,
                plaqueNumber: deliveryData.plaqueNumber,
                originLocation: deliveryData.OriginLocation,
                destinationLocation: deliveryData.DestinationLocation,
                companyName: deliveryData.companyName,
            };

            // console.log(delivery)

            callback(null, delivery);
        });
    }

    static getAllByCompanyID(companyID, callback) {
        const query = `
            SELECT d.*,
                us.firstName, us.lastName, us.telephone,
                loc_origin.location_name AS originLocation,
                loc_dest.location_name AS destinationLocation,
                tf.plaqueNumber,
                c.companyName
            FROM deliveries d
                INNER JOIN ticketformats tf ON d.ticketFormatID = tf.id
                INNER JOIN companies c ON tf.companyID = c.companyID
                INNER JOIN users us ON d.senderID = us.id
                JOIN locations loc_origin ON tf.originLocation = loc_origin.location_id
                JOIN locations loc_dest ON tf.destinationLocation = loc_dest.location_id
            WHERE tf.companyID = ?
        `;

        pool.query(query, [companyID], (error, results) => {
            if (error) {
                return callback(error, null);
            }

            const deliveries = results.map(deliveryData => ({
                ID: deliveryData.ID,
                senderID: deliveryData.SenderID,
                senderNames: `${deliveryData.firstName} ${deliveryData.lastName}`,
                senderTelephone: deliveryData.telephone,
                senderNID: deliveryData.nationalID,
                ticketFormatID: deliveryData.TicketFormatID,
                description: deliveryData.Description,
                receiverName: deliveryData.ReceiverName,
                receiverTelephone: deliveryData.ReceiverPhone,
                deliveryDate: deliveryData.DeliveryDate,
                timeForDelivery: deliveryData.TimeForDelivery,
                timePaid: deliveryData.timePaid, 
                plaqueNumber: deliveryData.plaqueNumber,
                location: `From ${deliveryData.originLocation} to ${deliveryData.destinationLocation}`,
                companyName: deliveryData.companyName,
            }));

            callback(null, deliveries);
        });
    }

    static create(newDelivery, callback) {
        const query = `
            INSERT INTO deliveries (SenderID, TicketFormatID, Description, ReceiverName, ReceiverPhone, DeliveryDate, TimeForDelivery) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const { SenderID, TicketFormatID, Description, ReceiverName, ReceiverPhone, DeliveryDate, TimeForDelivery } = newDelivery;
        const values = [SenderID, TicketFormatID, Description, ReceiverName, ReceiverPhone, DeliveryDate, TimeForDelivery];

        pool.query(query, values, (error, result) => {
            if (error) {
                return callback(error, null);
            }
            const createdDelivery = new Delivery(
                result.insertId,
                SenderID,
                TicketFormatID,
                Description,
                ReceiverName,
                ReceiverPhone,
                DeliveryDate,
                TimeForDelivery
            );
            callback(null, createdDelivery);
        });
    }

    static deleteByID(id, callback) {
        const query = 'DELETE FROM deliveries WHERE id = ?';
        pool.query(query, [id], (error, result) => {
            if (error) {
                return callback(error, null);
            }
            if (result.affectedRows === 0) {
                return callback(null, null); // No delivery found
            }
            callback(null, { id });
        });
    }
}

module.exports = Delivery;
