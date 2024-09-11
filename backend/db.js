import mysql from 'mysql2';
import 'dotenv/config';


/*console.log("Database configuration:");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Database Name:", process.env.DB_NAME);
console.log("Port:", process.env.DB_PORT);*/



const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise()

export default pool;