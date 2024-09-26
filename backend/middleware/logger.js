import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';
import os from 'os';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the log directory in the backend folder
const logDirectory = path.join(__dirname, '..', 'logs');

// Ensure the logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // Include stack trace for errors
  winston.format.prettyPrint(), 
);

// Performance Format
const performanceLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `Time Stamp: ${timestamp}\nLevel: ${level}\n${JSON.stringify(message, null, 2)}`;
  })
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

// user logger
const userLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'user.log') })
  ]
});

// admin logger
const adminLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'admin.log') })
  ]
});

// module logger
const moduleLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'module.log') })
  ]
});

// user module logger
const userModuleLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'userModule.log') })
  ]
});

// performance logger
const performanceLogger = winston.createLogger({
  level: 'info',
  format: performanceLogFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDirectory, 'performance.log') })
  ]
});

// Log performance
export const logPerformance = (req, res, next) => {
  const start = performance.now();  // Start timing

  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(2);  
    const memoryUsage = process.memoryUsage();
    const cpuUsage = os.loadavg(); 

    performanceLogger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${duration}ms`,
      memory: {
        totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,  // Total memory in MB
        freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,    // Free memory in MB
        memoryUsed: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`  // Memory used by process in MB
      },
      cpu: {
        loadAvg1m: cpuUsage[0].toFixed(2),  // CPU load average for the last 1 minute
        loadAvg5m: cpuUsage[1].toFixed(2),  // CPU load average for the last 5 minutes
        loadAvg15m: cpuUsage[2].toFixed(2)  // CPU load average for the last 15 minutes
      }
    });
  });

  next();
};

// export loggers
export { authLogger, userLogger, assignmentLogger, feedbackLogger, submissionLogger, adminLogger, moduleLogger, userModuleLogger, performanceLogger};