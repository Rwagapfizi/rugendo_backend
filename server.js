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
// const employeeRoutes = require('./routes/employee.routes')

const port = process.env.SERVER_PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(userRoutes)
app.use(companyRoutes)
app.use(ticketFormatRoutes)
app.use(BoughtTicketRoutes)
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

pool.getConnection((error, connection) => {
    if (error) {
        console.error('Failed to connect to MySQL:', error);
        return;
    }
    console.log('Connected to MySQL database');

    // Release the connection
    // connection.release();

    // Start the server
    app.listen(port, () => {
        console.log(`Node API is running on port ${port}`);
    });
}); 