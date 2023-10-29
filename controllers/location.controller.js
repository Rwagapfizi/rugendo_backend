// const { Station, Location } = require('../models/station.model');
const { Location } = require('../models/location.model');

// const getAllStations = (req, res) => {
//     // #swagger.tags = ['Stations']
//     // #swagger.description = 'Endpoint to get all stations'
//     Station.getAllStations((error, stations) => {
//         if (error) {
//             console.error('Error fetching stations:', error);
//             return res.status(500).json({ error: 'Failed to fetch stations' });
//         }

//         res.status(200).json(stations);
//     });
// };

// const createStation = (req, res) => {
//     // #swagger.tags = ['Stations']
//     // #swagger.description = 'Endpoint to create a station'
//     const { stationName, stationLocation } = req.body;

//     Station.createStation(stationName, stationLocation, (error, stationID) => {
//         if (error) {
//             console.error('Error creating station:', error);
//             return res.status(500).json({ error: 'Failed to create station' });
//         }

//         res.status(201).json({ message: 'Station created successfully', stationID });
//     });
// };

// const deleteStationByID = (req, res) => {
//     // #swagger.tags = ['Stations']
//     // #swagger.description = 'Endpoint to delete a station by ID'
//     const stationID = req.params.id;

//     Station.deleteStationByID(stationID, (error, deleted) => {
//         if (error) {
//             console.error('Error deleting station:', error);
//             return res.status(500).json({ error: 'Failed to delete station' });
//         }

//         if (!deleted) {
//             return res.status(404).json({ error: 'Station not found' });
//         }

//         res.status(200).json({ message: 'Station deleted successfully' });
//     });
// };

const getAllLocations = (req, res) => {
    // #swagger.tags = ['Locations']
    // #swagger.description = 'Endpoint to get all locations'
    Location.getAllLocations((error, locations) => {
        if (error) {
            console.error('Error fetching locations:', error);
            return res.status(500).json({ error: 'Failed to fetch locations' });
        }

        res.status(200).json(locations);
    });
};

const getLocationByID = (req, res) => {
    // #swagger.tags = ['Locations']
    // #swagger.description = 'Endpoint to get a Location by ID'
    const locationID = req.params.id;
    Location.getByID(locationID, (error, location) => {
        if (error) {
            console.error('Error fetching location by ID:', error);
            return res.status(500).json({ error: 'Failed to fetch location' });
        } else if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        } else {
            return res.status(200).json(location);
        }
    });
};

const getPricesFromLocations = (req, res) => {
    // #swagger.tags = ['Locations']
    // #swagger.description = 'Endpoint to get prices standards of given Locations'
    const fromLocationID = req.params.fromLocationID;
    const toLocationID = req.params.toLocationID;
    Location.getPriceByLocations(fromLocationID, toLocationID, (error, priceInfo) => {
        if (error) {
            console.error('Failed to fetch price info:', error);
            return res.status(500).json({ error: 'Failed to fetch price info' });
        } else {
            if (priceInfo == null) {
                Location.getPriceByLocations(toLocationID, fromLocationID, (error, priceInfo) => {
                    if (error) {
                        console.error('Failed to fetch price info:', error);
                        return res.status(500).json({ error: 'Failed to fetch price info' });
                    } else {
                        return res.status(200).json(priceInfo);
                    }
                })
            } else {
                return res.status(200).json(priceInfo);
            }
        }
    });
};

const createLocation = (req, res) => {
    // #swagger.tags = ['Locations']
    // #swagger.description = 'Endpoint to create a location'
    const { locationName } = req.body;

    Location.createLocation(locationName, (error, locationID) => {
        if (error) {
            console.error('Error creating location:', error);
            return res.status(500).json({ error: 'Failed to create location' });
        }

        return res.status(201).json({ message: 'Location created successfully', locationID });
    });
};

const deleteLocationByID = (req, res) => {
    // #swagger.tags = ['Locations']
    // #swagger.description = 'Endpoint to delete a location by ID'
    const locationID = req.params.id;

    Location.deleteLocationByID(locationID, (error, deleted) => {
        if (error) {
            console.error('Error deleting location:', error);
            return res.status(500).json({ error: 'Failed to delete location' });
        }

        if (!deleted) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.status(200).json({ message: 'Location deleted successfully' });
    });
};

// module.exports = {
//     getAllStations,
//     createStation,
//     deleteStationByID,
//     getAllLocations,
//     createLocation,
//     deleteLocationByID
// };

module.exports = {
    getAllLocations,
    getLocationByID,
    getPricesFromLocations,
    createLocation,
    deleteLocationByID
};
