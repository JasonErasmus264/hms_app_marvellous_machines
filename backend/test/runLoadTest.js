import { exec } from 'child_process';  // To execute the Artillery command
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // Import fileURLToPath to get the directory name
import { loadTestLogger } from '../middleware/logger.js'; 

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to your load-test.yml file and the results report
const loadTestFile = path.join(__dirname, '..', 'load-test.yml'); // This should go up one directory to reach the load-test.yml
const resultsFilePath = path.join(__dirname, 'loadTestReport.json'); // Saving results in the loadTest directory

// Log the paths to ensure they are correct
console.log('Load Test File Path:', loadTestFile);
console.log('Results File Path:', resultsFilePath);

// Function to calculate and log a summary of the load test results
const logSummary = (results) => {
  const totalRequests = results.aggregate.counters['http.requests'] || 0;
  const totalResponses = results.aggregate.counters['http.responses'] || 0;
  const totalErrors = results.aggregate.counters['vusers.failed'] || 0;
  const successRate = ((totalResponses / totalRequests) * 100).toFixed(2);
  const avgResponseTime = results.aggregate.summaries['http.response_time']?.mean || 0;
  const errorRate = ((totalErrors / totalRequests) * 100).toFixed(2);

  // Log summary using structured format
  
  loadTestLogger.info({
    message: '=== Load Test Summary ===',
    totalRequests,
    totalResponses,
    totalErrors,
    successRate: `${successRate}%`,
    averageResponseTime: `${avgResponseTime}ms`,
    errorRate: `${errorRate}%`
  });
};

// Function to log load test results from the report file
const logLoadTestResults = (resultsFilePath) => {
  // Check if results file exists before reading
  fs.readFile(resultsFilePath, 'utf8', (err, data) => {
    if (err) {
      loadTestLogger.error(`Error reading results file: ${err.message}`);
      return;
    }

    const results = JSON.parse(data);
    loadTestLogger.info('Detailed Load Test Results', results);

    // Log a summary after logging detailed results
    logSummary(results);
  });
};

// Function to run the load test
const runLoadTest = () => {
  exec(`artillery run "${loadTestFile}" --output "${resultsFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      loadTestLogger.error(`Error running load test: ${error.message}`);
      return;
    }
    if (stderr) {
      loadTestLogger.error(`Load test stderr: ${stderr}`);
      return;
    }

    // Ensure the results file is created before trying to read it
    if (!fs.existsSync(resultsFilePath)) {
      fs.writeFileSync(resultsFilePath, JSON.stringify({ results: [] })); // Create an empty results file if not found
    }

    // Log results after the load test completes
    logLoadTestResults(resultsFilePath);
  });
};

// Run the load test
runLoadTest();