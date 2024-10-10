import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';
import os from 'os';
import 'winston-daily-rotate-file';

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
  winston.format.prettyPrint()
);

// Configure rotating file transport for log rotation
const rotatingFileTransport = (filename) => new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, filename),
  datePattern: 'YYYY-MM-DD',      // Rotate daily based on date
  zippedArchive: true,            // Compress old logs
  maxSize: '20m',                 // Rotate when log reaches 20MB
  maxFiles: '14d'                 // Keep logs for 14 days
});

// auth logger 
export const authLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('auth-%DATE%.log')
  ]
});

// assignment logger 
export const assignmentLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('assignments-%DATE%.log')
  ]
});

// feedback logger 
export const feedbackLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('feedback-%DATE%.log')
  ]
});

// submission logger 
export const submissionLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('submissions-%DATE%.log')
  ]
});

// user logger 
export const userLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('user-%DATE%.log')
  ]
});

// admin logger 
export const adminLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('admin-%DATE%.log')
  ]
});

// module logger 
export const moduleLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('module-%DATE%.log')
  ]
});

// user module logger 
export const userModuleLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('userModule-%DATE%.log')
  ]
});

// notification logger
export const notificationLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('notification-%DATE%.log')
  ]
});



// Performance logger
export const performanceLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('performance-%DATE%.log')
  ]
});

// Load test logger 
export const loadTestLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    rotatingFileTransport('loadTest-%DATE%.log')
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