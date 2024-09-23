import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the log directory in the backend folder
const logDirectory = path.join(__dirname, 'logs');

// Ensure the logs directory exists and create if not
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // Include stack trace for errors
  winston.format.prettyPrint(), 
);

// Create Winston logger instances for each category

// auth logger
const authLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'auth.log') })
  ]
});

// assignment logger
const assignmentLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'assignments.log') })
  ]
});

// feedback logger
const feedbackLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'feedback.log') })
  ]
});

// submission logger
const submissionLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'submissions.log') })
  ]
});


//user logger
const userLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'user.log') })
  ]
});

// export loggers 
export { authLogger, userLogger, assignmentLogger, feedbackLogger, submissionLogger };