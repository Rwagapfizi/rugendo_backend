require('dotenv').config()
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./autogened-swagger.json');
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pool = require('./utils/mysql')
const userRoutes = require('./routes/user.routes')
const companyRoutes = require('./routes/company.routes')
const ticketFormatRoutes = require('./routes/ticketFormat.routes')
const BoughtTicketRoutes = require('./routes/boughtTicket.routes')
const LocationRoutes = require('./routes/location.routes')
const MomoRoutes = require('./routes/momoProxy.routes')
const DeliveriesRoutes = require('./routes/delivery.routes')
const BusesRoutes = require('./routes/bus.routes')

const port = process.env.SERVER_PORT || 5000;

// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cors({ credentials: true, origin: '*' }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(userRoutes)
app.use(companyRoutes)
app.use(ticketFormatRoutes)
app.use(BoughtTicketRoutes)
app.use(LocationRoutes)
// app.use(DeliveriesRoutes)
app.use(MomoRoutes)
app.use(BusesRoutes)
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

pool.getConnection((error, connection) => {
    if (error) {
        console.error('Failed to connect to MySQL:', error);
        return;
    }
    console.log('Connected to MySQL database');

    // Start the server
    app.listen(port, () => {
        console.log(`Node API is running on port ${port}`);
    });
}); 