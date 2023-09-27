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

// module.exports = { Station, Location };
module.exports = { Location };