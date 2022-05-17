/* Connection with the database usign mariadb */

const mariadb = require('mariadb');
const dotenv = require('dotenv');
dotenv.config({ path: ".env" });


/* Pool of connection */
const pool = mariadb.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0
});

exports.getConnection = async(next) => {
    await pool.getConnection()
        .then(conn => {
            return next(conn);
        })
        .catch(err => {
            console.log(err);
        })
}