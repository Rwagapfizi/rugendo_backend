// const { School, SchoolDestination } = require('../models/school.model');
const { School, SchoolDestination, SchoolBus } = require('../models/school.model')

const getAllSchools = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to get all schools'
    School.getAll((error, schools) => {
        if (error) {
            console.error('Error fetching schools:', error);
            return res.status(500).json({ error: 'Failed to fetch schools' });
        }

        res.status(200).json(schools);
    });
};

const getSchoolByID = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to get a School by ID'
    const schoolID = req.params.id;
    School.getByID(schoolID, (error, school) => {
        if (error) {
            console.error('Error fetching School by ID:', error);
            return res.status(500).json({ error: 'Failed to fetch School' });
        } else if (!school) {
            return res.status(404).json({ error: 'School not found' });
        } else {
            return res.status(200).json(school);
        }
    });
};

const createSchool = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to create a school'
    const { schoolName, schoolLocation } = req.body;

    School.create(schoolName, schoolLocation, (error, schoolID) => {
        if (error) {
            console.error('Error creating school:', error);
            return res.status(500).json({ error: 'Failed to create school' });
        }

        res.status(201).json({ message: 'School created successfully', schoolID });
    });
};

const deleteSchoolByID = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to delete a school by ID'
    const schoolID = req.params.id;

    School.deleteByID(schoolID, (error, deleted) => {
        if (error) {
            console.error('Error deleting school:', error);
            return res.status(500).json({ error: 'Failed to delete school' });
        }

        if (!deleted) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.status(200).json({ message: 'School deleted successfully' });
    });
};

const getAllSchoolDestinations = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to get all school destinations'
    SchoolDestination.getAll((error, destinations) => {
        if (error) {
            console.error('Error fetching destinations:', error);
            return res.status(500).json({ error: 'Failed to fetch destinations' });
        }

        res.status(200).json(destinations);
    });
};

const getSchoolDestinationByID = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to get a school destination by ID'
    const destinationID = req.params.id;
    SchoolDestination.getByID(destinationID, (error, schoolDestination) => {
        // console.log(schoolDestination)
        if (error) {
            console.error('Error fetching School Destination by ID:', error);
            return res.status(500).json({ error: 'Failed to fetch School Destination' });
        } else if (!schoolDestination) {
            return res.status(404).json({ error: 'School Destination not found' });
        } else {
            return res.status(200).json(schoolDestination);
        }
    });
};

const createSchoolDestination = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to create a school destination'
    const { destinationName, destinationLocation } = req.body;

    SchoolDestination.create(destinationName, destinationLocation, (error, destinationID) => {
        if (error) {
            console.error('Error creating School Destination:', error);
            return res.status(500).json({ error: 'Failed to create School Destination' });
        }

        return res.status(201).json({ message: 'School Destination created successfully', destinationID });
    });
};

const deleteSchoolDestinationByID = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to delete a school destination by ID'
    const destinationID = req.params.id;

    SchoolDestination.deleteByID(destinationID, (error, deleted) => {
        if (error) {
            console.error('Error deleting School Destination:', error);
            return res.status(500).json({ error: 'Failed to delete School Destination' });
        }

        if (!deleted) {
            return res.status(404).json({ error: 'School Destination not found' });
        }

        res.status(200).json({ message: 'School Destination deleted successfully' });
    });
};

const getAllSchoolBuses = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to get all booked bus'
    SchoolBus.getAll((error, schoolBuses) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch booked buses.' });
        }
        return res.status(200).json(schoolBuses);
    });
};

const getSchoolBusByID = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to get a booked bus by ID'
    const id = req.params.id;
    SchoolBus.getByID(id, (error, bus) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch booked bus.' });
        }
        if (!bus) {
            return res.status(404).json({ message: 'Booked bus not found.' });
        }
        res.status(200).json(bus);
    });
};

const getDetailedSchoolBusByID = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to get a Detailed Booked Bus by ID'
    const id = req.params.id;
    SchoolBus.getDetailedByID(id, (error, schoolBus) => {
        if (error) {
            console.error('Error fetching booked bus by ID:', error);
            res.status(500).json({ error: 'Failed to fetch detailed booked bus' });
        } else if (!schoolBus) {
            res.status(404).json({ error: 'Booked Bus not found' });
        } else {
            res.status(200).json(schoolBus);
        }
    });
}

const createSchoolBus = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to create a booked bus'
    const { customerID, companyID, busID, schoolID, destinationID, tripDate, numOfPeople } = req.body;
    const schoolBusData = { customerID, companyID, busID, schoolID, destinationID, tripDate, numOfPeople };
 
    SchoolBus.create(schoolBusData, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to create booked bus.' });
        }
        return res.status(201).json({ message: 'Private Bus booked successfully', schoolBus: result });
    });
};

const deleteSchoolBusByID = (req, res) => {
    // #swagger.tags = ['Schools']
    // #swagger.description = 'Endpoint to delete a booked bus by ID'
    const id = req.params.id;
    SchoolBus.deleteByID(id, (error, deletedBus) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to delete the bus.' });
        }
        if (!deletedBus) {
            return res.status(404).json({ message: 'Booked bus not found.' });
        }
        res.status(200).json(deletedBus);
    });
};

module.exports = {
    getAllSchools,
    getSchoolByID,
    createSchool,
    deleteSchoolByID,
    getAllSchoolDestinations,
    getSchoolDestinationByID,
    createSchoolDestination,
    deleteSchoolDestinationByID,
    getAllSchoolBuses,
    getSchoolBusByID,
    getDetailedSchoolBusByID,
    createSchoolBus,
    deleteSchoolBusByID
};

// module.exports = {
//     getAllLocations,
//     getLocationByID,
//     getPricesFromLocations,
//     createLocation,
//     deleteLocationByID
// };
