// const { Station, Location } = require('../models/station.model');
const { Location, RoutesStop } = require('../models/location.model');

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

const getAllRoutesStops = (req, res) => {
    // #swagger.tags = ['Routes Stops']
    // #swagger.description = 'Endpoint to get all routes stops'
    RoutesStop.getAllRoutesStops((error, routesStops) => {
        if (error) {
            console.error('Error fetching routes stops:', error);
            return res.status(500).json({ error: 'Failed to fetch routes stops' });
        }

        res.status(200).json(routesStops);
    });
};

const getRoutesStopByID = (req, res) => {
    // #swagger.tags = ['Routes Stops']
    // #swagger.description = 'Endpoint to get a RoutesStop by ID'
    const routesStopID = req.params.id;
    RoutesStop.getByID(routesStopID, (error, routesStop) => {
        if (error) {
            console.error('Error fetching routesStop by ID:', error);
            return res.status(500).json({ error: 'Failed to fetch routes Stop' });
        } else if (!routesStop) {
            return res.status(404).json({ error: 'Routes Stop not found' });
        } else {
            return res.status(200).json(routesStop);
        }
    });
};

const getRoutesStopByLocationsID = (req, res) => {
    // #swagger.tags = ['Routes Stops']
    // #swagger.description = 'Endpoint to get a RoutesStop by ID'
    const fromLocationID = req.params.fromLocationID;
    const toLocationID = req.params.toLocationID;
    RoutesStop.getByLocations(fromLocationID, toLocationID, (error, routesStop) => {
        // if (error) {
        //     console.error('Error fetching routesStop by ID:', error);
        //     return res.status(500).json({ error: 'Failed to fetch routes Stop' });
        // } else if (!routesStop) {
        //     return res.status(404).json({ error: 'Routes Stop not found' });
        // } else {
        //     return res.status(200).json(routesStop);
        // }
        if (error) {
            console.error('Error fetching routesStop by ID:', error);
            return res.status(500).json({ error: 'Failed to fetch routes Stop' });
        } else {
            if (!routesStop) {
                RoutesStop.getByLocations(toLocationID, fromLocationID, (error, routesStop) => {
                    if (error) {
                        console.error('Error fetching routesStop by ID:', error);
                        return res.status(500).json({ error: 'Failed to fetch routes Stop' });
                    } else {
                        if (!routesStop) {
                            return res.status(404).json({ error: 'Routes Stop not found' });
                        } else {
                            return res.status(200).json(routesStop);
                        }
                    }
                })
            } else {
                return res.status(200).json(routesStop);
            }
        }
    });
};

const createRoutesStop = (req, res) => {
    // #swagger.tags = ['Routes Stops']
    // #swagger.description = 'Endpoint to create a routes Stop'
    const { fromLocation, toLocation, stops } = req.body;

    const routesStopData = { fromLocation, toLocation, stops }
    RoutesStop.createRoutesStop(routesStopData, (error, routesStop) => {
        if (error) {
            console.error('Error creating routes Stop', error);
            return res.status(500).json({ error: 'Failed to create routes Stop' });
        }

        return res.status(201).json({ message: 'Routes Stop created successfully', routesStop });
    });
};

const deleteRoutesStopByID = (req, res) => {
    // #swagger.tags = ['Routes Stops']
    // #swagger.description = 'Endpoint to delete a routesStop by ID'
    const routesStopID = req.params.id;

    RoutesStop.deleteRoutesStopByID(routesStopID, (error, deleted) => {
        if (error) {
            console.error('Error deleting routes Stop', error);
            return res.status(500).json({ error: 'Failed to delete routes Stop' });
        }

        if (!deleted) {
            return res.status(404).json({ error: 'Routes Stop not found' });
        }

        res.status(200).json({ message: 'Routes Stop deleted successfully' });
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
    deleteLocationByID,
    getAllRoutesStops,
    getRoutesStopByID,
    getRoutesStopByLocationsID,
    createRoutesStop,
    deleteRoutesStopByID
};
