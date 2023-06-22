const mysql = require('mysql');
const { promisify } = require('util');

require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit : 100,
    host            : "localhost",
    user            : "root",
    password        : "",
    database        : "petshop"
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (connection) connection.release();
    console.log('Base de datos conectada');
    return;
});

//Convirtiendo a promesas lo que antes eran coldbacks
pool.query = promisify(pool.query);

module.exports = pool; 
