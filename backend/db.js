import mysql from 'mysql2';
import 'dotenv/config';

// Connect to MySQL database using environment variables. If not set, default values are used.
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'hms',
    database: process.env.MYSQL_DATABASE || 'nwu_hms',
    port: process.env.MYSQL_PORT || 3306
}).promise()

export default pool;
