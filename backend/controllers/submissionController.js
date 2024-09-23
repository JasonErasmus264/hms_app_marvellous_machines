import pool from '../db.js';  // Assuming the database pool is set up
import { submissionLogger } from '../middleware/logger.js'; // import submission logger

// Function to format the date using native JS Intl.DateTimeFormat
const formatDate = (date) => {
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', ' at');
};

// Controller function to fetch submissions for a specific assignment
export const getSubmissionsByAssignment = async (req, res) => {
  const { assignmentID } = req.params;
  // log information on fetching submissions for assignments (information log)
  submissionLogger.info(`Fetching submissions for assignmentID: ${assignmentID}`);
  try {
    // Query to get the list of submissions for the given assignment ID
    const [submissions] = await pool.execute(
      `SELECT s.submissionID, s.submissionVidPath, s.uploadedAt, 
              u.firstName, u.lastName, u.username
       FROM submission s
       JOIN users u ON s.userID = u.userID
       WHERE s.assignmentID = ?`,
      [assignmentID]
    );

    // If no submissions are found
    if (submissions.length === 0) {
      // log warning if no submissions are found for an assignment (warning log)
      submissionLogger.warn(`No submissions found for assignmentID: ${assignmentID}`);
      return res.status(404).json({ message: 'No submissions found for this assignment.' });
    }

    // Process each submission and check if feedback exists
    const submissionList = await Promise.all(submissions.map(async (submission) => {
      // Query to check if feedback exists for the current submission
      const [feedback] = await pool.execute(
        `SELECT feedbackID FROM feedback WHERE submissionID = ?`,
        [submission.submissionID]
      );

      // Determine if the submission is marked or to be marked based on feedback presence
      const status = feedback.length === 0 ? 'To be marked' : 'Marked';

      // Format the submission datetime
      const formattedDate = formatDate(new Date(submission.uploadedAt));

      // Return the formatted submission object
      return {
        studentName: `${submission.firstName} ${submission.lastName} (${submission.username})`,
        submissionVidPath: submission.submissionVidPath,
        uploadedAt: formattedDate,
        status: status
      };
    }));

    // Return the structured response with the submission list
    res.json({
      submission: submissionList
    });
  } catch (error) {
    // log any errors that may occur while trying to fetch the submissions for an assignment (error log)
    submissionLogger.error(`Error fetching submissions for assignmentID: ${assignmentID}: ${error.message}`, { error });
    res.status(500).json({ error: 'An error occurred while fetching submissions.' });
  }
};




// Function to get submissions that are "To be marked" (without feedback)
export const getNotMarkedSubmissions = async (req, res) => {
    const { assignmentID } = req.params; // Get assignmentID from the request params

    // log information on fetching unmarked submissions for an assignment (information log)
    submissionLogger.info(`Fetching unmarked submissions for assignmentID: ${assignmentID}`);
    try {
      // Query to get submissions that don't have feedback (i.e., "To be marked")
      const [rows] = await pool.execute(
        `SELECT s.submissionID, u.firstName, u.lastName, u.username, s.submissionVidPath, s.uploadedAt
         FROM submission s
         JOIN users u ON s.userID = u.userID
         LEFT JOIN feedback f ON s.submissionID = f.submissionID
         WHERE s.assignmentID = ? AND f.submissionID IS NULL`, [assignmentID]);
  
      // Format the submission list
      const submission = rows.map(submission => ({
        studentName: `${submission.firstName} ${submission.lastName} (${submission.username})`,
        submissionVidPath: submission.submissionVidPath,
        uploadedAt: formatDate(new Date(submission.uploadedAt)), // Use formatDate function
      }));
      // log successfully fetching unmarked submissions for an assignment (information log)
      submissionLogger.info(`Successfully fetched unmarked submissions for assignmentID: ${assignmentID}`);
      res.json({ submission });
    } catch (error) {
      // log any errors that may have occured while fetching unmarked submissions for an assignment (error log)
      submissionLogger.error(`Error fetching unmarked submissions for assignmentID: ${assignmentID}: ${error.message}`, { error });
      res.status(500).json({ message: 'Error fetching submissions to be marked.' });
    }
  };
  

  // Function to get submissions that are "Marked" (with feedback)
  export const getMarkedSubmissions = async (req, res) => {
    const { assignmentID } = req.params; // Get assignmentID from the request params
    // log information on fetching marked submissions for an assignment (information log)
    submissionLogger.info(`Fetching marked submissions for assignmentID: ${assignmentID}`);
    try {
      // Query to get submissions that have feedback (i.e., "Marked")
      const [rows] = await pool.execute(
        `SELECT s.submissionID, u.firstName, u.lastName, u.username, s.submissionVidPath, s.uploadedAt
         FROM submission s
         JOIN users u ON s.userID = u.userID
         JOIN feedback f ON s.submissionID = f.submissionID
         WHERE s.assignmentID = ?`, [assignmentID]);
  
      // Format the submission list
      const submission = rows.map(submission => ({
        studentName: `${submission.firstName} ${submission.lastName} (${submission.username})`,
        submissionVidPath: submission.submissionVidPath,
        uploadedAt: formatDate(new Date(submission.uploadedAt)), // Use formatDate function
      }));
      // log successfully fetching marked submissions for an assignment (information log)
      submissionLogger.info(`Successfully fetched marked submissions for assignmentID: ${assignmentID}`);
      res.json({ submission });
    } catch (error) {
      // log any errors that may have occured whie fetching marked submissions for an assignment (error log)
      submissionLogger.error(`Error fetching marked submissions for assignmentID: ${assignmentID}: ${error.message}`, { error });
      res.status(500).json({ message: 'Error fetching marked submissions.' });
    }
  };