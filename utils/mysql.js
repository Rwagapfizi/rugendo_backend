// // Import the required dependencies
require('dotenv').config()
const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'rugendo'
// });

// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('rugendo', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

// module.exports = [sequelize, pool];


module.exports = pool