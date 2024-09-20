import mysql from 'mysql2';
import 'dotenv/config';


/*console.log("Database configuration:");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Database Name:", process.env.DB_NAME);
console.log("Port:", process.env.DB_PORT);*/



const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'hms',
    database: process.env.MYSQL_DATABASE || 'nwu_hms',
    waitForConnections: true, 
    port: process.env.MYSQL_PORT || 3306
}).promise()

export default pool;