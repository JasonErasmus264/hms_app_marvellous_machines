import pool from '../db.js';
import { assignmentLogger } from '../middleware/logger.js'; // Import assignment logger


// Function to get assignments based on module ID
export const getAssignmentsByModule = async (req, res) => {
  const { moduleID } = req.params; // Get the moduleID from the URL path

  try {
    // Validate the moduleID
    if (!moduleID) {
      // Log a warning if moduleID is not provided (warning log)
      assignmentLogger.warn('Module ID is missing in the request');
      return res.status(400).json({ message: 'Module ID is required' });
    }

    // Fetch assignments based on the provided moduleID
    const [rows] = await pool.execute('SELECT * FROM assignment WHERE moduleID = ?', [moduleID]);

    if (rows.length === 0) {
      // Log info if no assignments are found (information log)
      assignmentLogger.info(`No assignments found for moduleID: ${moduleID}`);
      return res.status(404).json({ message: 'No assignments found for this module' });
    }

    // Format the assignOpenDate and assignDueDate for each assignment
    const formattedAssignments = rows.map(assignment => {
      // Parse the dates from the input string
      const assignOpenDate = new Date(assignment.assignOpenDate);
      const assignDueDate = new Date(assignment.assignDueDate);
    
      // Function to format dates to '01 September 2024 at 12:00'
      const formatDate = (date) => {
        const options = {
          day: '2-digit',
          month: 'long', // Full month name
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };
    
        // Format the date
        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
        return formattedDate.replace(',', ' at'); // Replace the comma with ' at'
      };
    
      // Return the assignment with formatted open and due dates
      return {
        ...assignment,
        assignOpenDate: formatDate(assignOpenDate),
        assignDueDate: formatDate(assignDueDate),
      };
    });

    // Log success when assignments are fetched (information log)
    assignmentLogger.info(`Assignments fetched successfully for moduleID: ${moduleID}`);
    res.json({ assignments: formattedAssignments });
  } catch (error) {
    // Log error when fetching assignments fails (error log)
    assignmentLogger.error(`Error fetching assignments: ${error.message}`, { error });
    res.status(500).json({ message: 'An error occurred while fetching assignments' });
  }
};






// Function to add a new assignment
export const addAssignment = async (req, res) => {
  const { moduleID } = req.params;
  const { assignName, assignDesc, assignOpenDate, assignDueDate, assignTotalMarks } = req.body;
  const { userID } = req.user; // Get userID from the logged-in user

  try {
    // Validate the moduleID
    if (!moduleID) {
      // Log a warning if moduleID is not provided (warning log)
      assignmentLogger.warn('Module ID is missing in the request');
      return res.status(400).json({ message: 'Module ID is required' });
    }

    // Validate assignment details
    if (!assignName || !assignDesc || !assignOpenDate || !assignDueDate || assignTotalMarks == null) {
      // Log warning for missing fields (warning log)
      assignmentLogger.warn('Missing required fields for creating an assignment (title, description, open date, due date, total marks) are required');
      return res.status(400).json({ message: 'All fields (title, description, open date, due date, total marks) are required' });
    }

    // Convert total marks to a decimal with two decimal places (e.g., 30 -> 30.00)
    const formattedTotalMarks = parseFloat(assignTotalMarks).toFixed(2);

    // Ensure open and due dates are in valid MySQL format (YYYY-MM-DD HH:MM:SS)
    const formattedAssignOpenDate = new Date(assignOpenDate).toISOString().slice(0, 19).replace('T', ' ');
    const formattedAssignDueDate = new Date(assignDueDate).toISOString().slice(0, 19).replace('T', ' ');

    // Validate that the open date is before the due date
    if (new Date(assignOpenDate) >= new Date(assignDueDate)) {
      // Log warning for date validation failure (warning log)
      assignmentLogger.warn('Open date is after or the same as the due date');
      return res.status(400).json({ message: 'The assignment open date must be before the due date' });
    }

    // Insert the new assignment into the database with userID and formatted total marks
    const [result] = await pool.execute(
      `INSERT INTO assignment (userID, moduleID, assignName, assignDesc, assignOpenDate, assignDueDate, assignTotalMarks)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userID, moduleID, assignName, assignDesc, formattedAssignOpenDate, formattedAssignDueDate, formattedTotalMarks]
    );

    // Check if the assignment was inserted successfully
    if (result.affectedRows === 0) {
      // Log error if the insertion failed (warning log)
      assignmentLogger.error(`Failed to add assignment: ${error.message}`, { error });
      return res.status(500).json({ message: 'Failed to add assignment' });
    }

    // Log success when assignment is added (information log)
    assignmentLogger.info(`Assignment added successfully with name: ${assignName}`);
    // Return success response
    res.status(201).json({ message: 'Assignment added successfully'});
  } catch (error) {
    // Log error when adding assignments fails (error log)
    assignmentLogger.error(`Error adding assignment: ${error.message}`, { error });
    res.status(500).json({ message: 'An error occurred while adding the assignment' });
  }
};







// Function to update an assignment
export const updateAssignment = async (req, res) => {
  const { assignmentID } = req.params; // Get the assignmentID
  const { assignName, assignDesc, assignOpenDate, assignDueDate, assignTotalMarks } = req.body;

  try {
    // Validate the assignmentID
    if (!assignmentID) {
      // Log a warning if assignmentID is not provided (warning log)
      assignmentLogger.warn('Assignment ID is missing in the request');
      return res.status(400).json({ message: 'Assignment ID is required' });
    }

    // Ensure all required fields are provided
    if (!assignName || !assignDesc || !assignOpenDate || !assignDueDate || assignTotalMarks == null) {
      // Log warning for missing fields (warning log)
      assignmentLogger.warn('Missing required fields for updating an assignment');
      return res.status(400).json({ message: 'All fields (title, description, open date, due date, total marks) are required' });
    }

    // Convert total marks to a decimal with two decimal places (e.g., 30 -> 30.00)
    const formattedTotalMarks = parseFloat(assignTotalMarks).toFixed(2);

    // Ensure open and due dates are in valid MySQL format (YYYY-MM-DD HH:MM:SS)
    const formattedAssignOpenDate = new Date(assignOpenDate).toISOString().slice(0, 19).replace('T', ' ');
    const formattedAssignDueDate = new Date(assignDueDate).toISOString().slice(0, 19).replace('T', ' ');

    // Validate that the open date is before the due date
    if (new Date(assignOpenDate) >= new Date(assignDueDate)) {
      // Log warning for date validation failure (warning log)
      assignmentLogger.warn('Open date is after or the same as the due date');
      return res.status(400).json({ message: 'The assignment open date must be before the due date' });
    }

    // Update the assignment in the database
    const [result] = await pool.execute(
      `UPDATE assignment 
       SET assignName = ?, assignDesc = ?, assignOpenDate = ?, assignDueDate = ?, assignTotalMarks = ?
       WHERE assignmentID = ?`,
      [assignName, assignDesc, formattedAssignOpenDate, formattedAssignDueDate, formattedTotalMarks, assignmentID]
    );

    if (result.affectedRows === 0) {
      // Log warning if no changes were made (warning log)
      assignmentLogger.warn(`No changes made or assignment not found with ID: ${assignmentID}`);
      return res.status(404).json({ message: 'Assignment not found or no changes made' });
    }

    // Log success when assignment is updated (information log)
    assignmentLogger.info(`Assignment updated successfully with ID: ${assignmentID}`);
    res.json({ message: 'Assignment updated successfully' });
  } catch (error) {
    // log error when updating assignments fails (error log)
    assignmentLogger.error(`Error updating assignment: ${error.message}`, { error });
    res.status(500).json({ message: 'An error occurred while updating the assignment' });
  }
};







// Function to delete an assignment
export const deleteAssignment = async (req, res) => {
  const { assignmentID } = req.params; // Get the assignmentID from the URL path

  try {
    // Validate the assignmentID
    if (!assignmentID) {
      // Log a warning if assignmentID is not provided (warning log)
      assignmentLogger.warn('Assignment ID is missing in the request');
      return res.status(400).json({ message: 'Assignment ID is required' });
    }

    // Delete the assignment from the database
    const [result] = await pool.execute('DELETE FROM assignment WHERE assignmentID = ?', [assignmentID]);

    if (result.affectedRows === 0) {
      // Log a warning if assignmentID is not found (warning log)
      assignmentLogger.warn(`Assignment not found with ID: ${assignmentID}`);
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Log success when an assignment is deleted (information log)
    assignmentLogger.info(`Assignment deleted successfully with ID: ${assignmentID}`);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    // Log error when deleting an assignment fails (error log)
    assignmentLogger.error(`Error deleting assignment: ${error.message}`, { error });
    res.status(500).json({ message: 'An error occurred while deleting the assignment' });
  }
};