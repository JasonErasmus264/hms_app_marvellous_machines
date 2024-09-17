import pool from '../db.js';  // Assuming the database pool is set up

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
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'An error occurred while fetching submissions.' });
  }
};




// Function to get submissions that are "To be marked" (without feedback)
export const getNotMarkedSubmissions = async (req, res) => {
    const { assignmentID } = req.params; // Get assignmentID from the request params
  
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
  
      res.json({ submission });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching submissions to be marked.' });
    }
  };
  

  // Function to get submissions that are "Marked" (with feedback)
  export const getMarkedSubmissions = async (req, res) => {
    const { assignmentID } = req.params; // Get assignmentID from the request params
  
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
  
      res.json({ submission });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching marked submissions.' });
    }
  };