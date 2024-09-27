HMS App - Marvellous Machines
=============================

Table of Contents
-----------------

1.  Prerequisites
    
2.  Getting Started
    
3.  Running the Application
    
    *   Option 1: Use Docker
        
    *   Option 2: Build Locally
        
4.  Database Setup
    
5.  Additional Assistance
    
6.  License
    

Prerequisites
-------------

**Warning**: This application has been tested on Windows 10 and 11. If you encounter any issues, please refer to the appropriate documentation for your operating system.

*   [Docker Desktop](https://www.docker.com/products/docker-desktop) - Ensure Docker is running.
    
If you plan to build the Node.js app locally:
*   [Node.js](https://nodejs.org/en/)  - Download the latest LTS version.
    
*   [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) - Optional, for database management.
    

### Important Note

When cloning the repository, save it in a folder with **no special characters or spaces** in the path.

Getting Started
---------------

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/JasonErasmus264/hms_app_marvellous_machines.git
   cd hms_app_marvellous_machines

Running the Application
-----------------------

### Option 1: Use Docker (Recommended)

Using Docker is the simplest way to run the application. Just run the following command in the root directory:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codedocker-compose up --build -d   `

*   This command builds the images and runs the containers in detached mode.
    

To stop the application, use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy codedocker-compose down   `

### Option 2: Build Locally

If you prefer to build the backend locally:

1.  bashCopy codecd backend
    
2.  bashCopy codenpm install
    
3.  bashCopy codecd ..
    
4.  bashCopy codenode app.js
    

Database Setup
--------------

If you are running the application locally, you must have MySQL Workbench set up.

1.  Import the Example Database:
    
    *   Inside the cloned repository, navigate to the dump folder, which contains example tables and data for the database.
        
    *   Open MySQL Workbench and create a new connection.
        
    *   Click on **Server** in the top menu and select **Data Import**.
        
    *   Select the dump file located in the dump folder.
        
    *   Click on the **Import Progress** tab and start the import.
        

Additional Assistance
---------------------

If you encounter any issues or need further assistance, here are some resources:

*   Docker Documentation
    
*   Node.js Documentation
    
*   MySQL Documentation
    
*   GitHub Issues - Report any issues or bugs.
    

For Windows-specific troubleshooting, consider visiting:

*   Docker Desktop for Windows
    
*   Windows 10/11 Git Bash Setup