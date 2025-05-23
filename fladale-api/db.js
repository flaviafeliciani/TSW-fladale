const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

pool.getConnection()
    .then(conn => {
        console.log("Connessione a MariaDB riuscita!");
        conn.end();
    })
    .catch(err => {
        console.error("Errore connessione:", err);
    });

module.exports = pool;
