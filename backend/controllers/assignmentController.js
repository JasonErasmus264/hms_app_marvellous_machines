import pool from '../db.js';
import { assignmentLogger } from '../logger.js';// Import assignment-specific logger

// Function to get modules for dropdown
export const getModules = async (req, res) => {
  try {
    const { userID, userType } = req.user;

    let query = '';
    let params = [];

    // Admins can see all modules
    if (userType === 'Admin') {
      query = 'SELECT moduleID, moduleCode FROM module';
    } else {
      // Lecturers and Students see only the modules they are enrolled in
      query = `
        SELECT m.moduleID, m.moduleCode
        FROM module m
        INNER JOIN user_module um ON m.moduleID = um.moduleID
        WHERE um.userID = ?`;
      params = [userID];
    }

    const [rows] = await pool.execute(query, params);

    if (rows.length === 0) {
      // Log that no modules were found for the specific user (informational log)
      assignmentLogger.info(`No modules found for user: ${userID} (Type: ${userType})`); 
      return res.status(404).json({ message: 'No modules found' });
    }
    // Log successful retrieval of modules for the user (informational log)
    assignmentLogger.info(`Modules fetched for user: ${userID} (Type: ${userType}): ${JSON.stringify(rows)}`); 
    res.json({ modules: rows });
  } catch (error) {
    // Log any errors encountered during the module retrieval process (error log)
    assignmentLogger.error(`Error fetching modules for user: ${req.user.userID}: ${error.message}`, { error }); 
    res.status(500).json({ error: 'An error occurred while fetching modules' });
  }
};




// Function to get assignments based on module ID
export const getAssignmentsByModule = async (req, res) => {
  const { moduleID } = req.params; // Get the moduleID from the URL path

  try {
    // Validate the moduleID
    if (!moduleID) {
      // Log a warning if the module ID is missing from the request (warning log)
      assignmentLogger.warn('Module ID is missing in request'); 
      return res.status(400).json({ message: 'Module ID is required' });
    }

    // Fetch assignments based on the provided moduleID
    const [rows] = await pool.execute('SELECT * FROM assignment WHERE moduleID = ?', [moduleID]);

    if (rows.length === 0) {
      // Log that no assignments were found for the given module (informational log)
      assignmentLogger.info(`No assignments found for module ${moduleID}`); 
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
    // Log successful retrieval of assignments for the given module, including the formatted data (informational log)
    assignmentLogger.info(`Assignments fetched for module: ${moduleID}: ${JSON.stringify(formattedAssignments)}`); 
    res.json({ assignments: formattedAssignments });
  } catch (error) {
    // Log any errors encountered during the assignment retrieval process (error log)
    assignmentLogger.error(`Error fetching assignments for module: ${moduleID}: ${error.message}`, { error }); 
    res.status(500).json({ error: error.message });
  }
};
