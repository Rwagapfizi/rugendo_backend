const pool = require('../utils/mysql');

// class Station {
//     constructor(stationID, stationName, stationLocation) {
//         this.stationID = stationID;
//         this.stationName = stationName;
//         this.stationLocation = stationLocation;
//     }

//     static getAllStations(callback) {
//         const query = 'SELECT * FROM stations';
//         pool.query(query, (error, results) => {
//             if (error) {
//                 console.error('Error fetching stations:', error);
//                 return callback(error, null);
//             }

//             const stations = results.map(stationData => {
//                 return new Station(
//                     stationData.station_id,
//                     stationData.station_name,
//                     stationData.station_location
//                 );
//             });

//             callback(null, stations);
//         });
//     }

//     static createStation(stationName, stationLocation, callback) {
//         const query = 'INSERT INTO stations (station_name, station_location) VALUES (?, ?)';
//         pool.query(query, [stationName, stationLocation], (error, result) => {
//             if (error) {
//                 console.error('Error creating station:', error);
//                 return callback(error, null);
//             }

//             callback(null, result.insertId);
//         });
//     }

//     static deleteStationByID(stationID, callback) {
//         const query = 'DELETE FROM stations WHERE station_id = ?';
//         pool.query(query, [stationID], (error, result) => {
//             if (error) {
//                 console.error('Error deleting station:', error);
//                 return callback(error, null);
//             }

//             callback(null, result.affectedRows > 0);
//         });
//     }

//     // ... other methods ...
// }

class Location {
    constructor(locationID, locationName) {
        this.locationID = locationID;
        this.locationName = locationName;
    }

    static getAllLocations(callback) {
        const query = 'SELECT * FROM locations';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching locations:', error);
                return callback(error, null);
            }

            const locations = results.map(locationData => {
                return new Location(
                    locationData.location_id,
                    locationData.location_name
                );
            });

            callback(null, locations);
        });
    }

    static getByID(id, callback) {
        const query = 'SELECT * FROM locations where location_id = ?';
        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error('Error fetching locations:', error);
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }

            const row = results[0];

            const location = new Location(
                row.location_id,
                row.location_name
            );

            callback(null, location);
        });
    }

    static getPriceByLocations(fromLocationID, toLocationID, callback) {
        const query = 'SELECT * FROM priceStandards where fromLocation = ? AND toLocation = ?';
        pool.query(query, [fromLocationID, toLocationID], (error, results) => {
            if (error) {
                console.error('Error fetching locations:', error);
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }

            // const row = results[0];

            const priceInfo = results.map(row => ({
                ID: row.ID,
                fromLocation: row.fromLocation,
                toLocation: row.toLocation,
                price: row.price,
                description: row.description,
            }));

            callback(null, priceInfo);
        });
    }

    static createLocation(locationName, callback) {
        const query = 'INSERT INTO locations (location_name) VALUES (?)';
        pool.query(query, [locationName], (error, result) => {
            if (error) {
                console.error('Error creating location:', error);
                return callback(error, null);
            }

            callback(null, result.insertId);
        });
    }

    static deleteLocationByID(locationID, callback) {
        const query = 'DELETE FROM locations WHERE location_id = ?';
        pool.query(query, [locationID], (error, result) => {
            if (error) {
                console.error('Error deleting location:', error);
                return callback(error, null);
            }

            callback(null, result.affectedRows > 0);
        });
    }
}

class RoutesStop {
    constructor(ID, fromLocation, toLocation, stops) {
        this.ID = ID;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.stops = stops;
    }

    static getAllRoutesStops(callback) {
        const query = 'SELECT * FROM routesStops';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching routes stops:', error);
                return callback(error, null);
            }

            const routesStops = results.map(routesStopData => {
                return new RoutesStop(
                    routesStopData.ID,
                    routesStopData.fromLocation,
                    routesStopData.toLocation,
                    routesStopData.stops,
                );
            });

            callback(null, routesStops);
        });
    }

    static getByID(id, callback) {
        const query = 'SELECT * FROM routesStops where ID= ?';
        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error('Error fetching routes stops:', error);
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }

            const row = results[0];

            const routeStop = new RoutesStop(
                row.ID,
                row.fromLocation,
                row.toLocation,
                row.stops,
            );

            callback(null, routeStop);
        });
    }

    static getByLocations(fromLocationID, toLocationID, callback) {
        const query = 'SELECT * FROM routesStops where fromLocation = ? AND toLocation = ?';
        pool.query(query, [fromLocationID, toLocationID], (error, results) => {
            if (error) {
                console.error('Error fetching routes stops:', error);
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No delivery found
            }

            const row = results[0];

            const routeStop = new RoutesStop(
                row.ID,
                row.fromLocation,
                row.toLocation,
                row.stops,
            );

            callback(null, routeStop);
        });
    }

    static createRoutesStop(routesStopData, callback) {
        const query = `INSERT INTO routesStops(fromLocation, toLocation, stops) VALUES (?, ?, ?)`;
        pool.query(query, [routesStopData.fromLocation, routesStopData.toLocation, routesStopData.stops], (error, result) => {
            if (error) {
                console.error('Error creating routes stop:', error);
                return callback(error, null);
            }

            const newRoutesStop = new RoutesStop(
                result.insertId,
                routesStopData.fromLocation, 
                routesStopData.toLocation, 
                routesStopData.stops
            )

            callback(null, newRoutesStop);
        });
    }

    static deleteRoutesStopByID(ID, callback) {
        const query = 'DELETE FROM routesStops WHERE ID = ?';
        pool.query(query, [ID], (error, result) => {
            if (error) {
                console.error('Error deleting routes stop:', error);
                return callback(error, null);
            }

            callback(null, result.affectedRows > 0);
        });
    }
}

// module.exports = { Station, Location };
module.exports = { Location, RoutesStop };