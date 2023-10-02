const swaggerAutogen = require('swagger-autogen')()

const outputFile = './autogened-swagger.json'
const endpointsFiles = [
    './routes/user.routes.js', 
    './routes/company.routes.js', 
    './routes/location.routes.js', 
    './routes/ticketFormat.routes.js', 
    './routes/boughtTicket.routes.js', 
    './routes/bus.routes.js',
    // './routes/delivery.routes.js', 
    './routes/momoProxy.routes.js',
]
const doc = {
    info: {
        version: "1.0.0",
        title: "RUGENDO API",
        description: "Made by Igor Roggy"
    },
    host: "localhost:5000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        // api_key: {
        //     type: "apiKey",
        //     name: "Authorization",
        //     in: "header"
        // },
        petstore_auth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
        },
    },
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger file generated successfully');
    require("./server.js")
})
    .catch((error) => {
        console.error('Error generating Swagger file:', error);
    });