import mysql from 'mysql2';
import 'dotenv/config';


/*console.log("Database configuration:");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("Database Name:", process.env.DB_NAME);
console.log("Port:", process.env.DB_PORT);*/



// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,  
    connectionLimit: 10,  
    queueLimit: 0  
}).promise();

// Check for initial connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Database connection established successfully.');
        connection.release();  
    }
});

export default pool;