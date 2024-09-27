# HMS App - Marvellous Machines

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Running the Application](#running-the-application)
   - [Option 1: Use Docker](#option-1-use-docker-recommended)
   - [Option 2: Build Locally](#option-2-build-locally)
4. [Database Setup](#database-setup)
5. [Additional Assistance](#additional-assistance)
6. [License](#license)

## Prerequisites

**Warning**: This application has been tested on Windows 10 and 11. If you encounter any issues, please refer to the appropriate documentation for your operating system.

- [Docker Desktop](https://www.docker.com/products/docker-desktop) - Ensure Docker is running.
- If you plan to build the Node.js app locally:
  - [Node.js](https://nodejs.org/en/) - Download the latest LTS version.
  - [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) - Optional, for database management.

### Important Note

When cloning the repository, save it in a folder with **no special characters or spaces** in the path.

## Getting Started

**Clone the Repository**:
   ```bash
   git clone https://github.com/JasonErasmus264/hms_app_marvellous_machines.git
   cd hms_app_marvellous_machines
   ```

## Running the Application

### Option 1: Use Docker (Recommended)

Using Docker is the simplest way to run the application. Just run the following command in the root directory:
```bash
docker-compose up --build -d
```
- This command builds the images and runs the containers in detached mode. Once the application is running, you can use an API client like Postman to test the endpoints.

Try accessing the API at `http://localhost:3000`. If that doesn't work, you can also try:
- `http://127.0.0.1:3000`
- `http://0.0.0.0:3000`

To stop the application, use:
```bash
docker-compose down
```

### Option 2: Build Locally

If you prefer to build the backend locally:
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. **Create a `.env` file** in the `backend` folder and fill it with the following content (replace the placeholder values accordingly):
   ```
   # Database Credentials
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password_here
   MYSQL_DATABASE=your_db_name_here
   MYSQL_PORT=3306

   # JWT Secrets
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

   # JWT Expiration Times
   JWT_ACCESS_EXPIRES=10m     # Access token expiration (10 minutes)
   JWT_REFRESH_EXPIRES=1h    # Refresh token expiration (1 hour)

   # Application Settings
   PORT=3000             # The port the application runs on

   # Rate Limiter Configuration
   LOGIN_RATE_LIMIT_MAX=5       # Max login attempts
   LOGIN_RATE_LIMIT_WINDOW=15    # Window for login attempts in minutes

   # Email Service (Outlook)
   EMAIL_USER=put_your_email_here
   EMAIL_PASS=put_your_email_password_here
   EMAIL_SERVICE=Outlook
   EMAIL_HOST=smtp.office365.com
   EMAIL_PORT=587
   EMAIL_SECURE=false

   # Nextcloud Configuration 
   NEXTCLOUD_URL=https://your_nextcloud_url_here 
   NEXTCLOUD_USERNAME=your_username_here
   NEXTCLOUD_PASSWORD=put_your_nextcloud_password_here
   NEXTCLOUD_SHARE_URL=https://your_nextcloud_share_url_here 

   # Max File Size (in bytes) 
   MAX_FILE_SIZE=52428800 # 50MB
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

## Database Setup

If you are running the application locally, you must have MySQL Workbench set up.

1. **Import the Example Database**:
   - Inside the cloned repository, navigate to the `dump` folder, which contains example tables and data for the database.
   - Open MySQL Workbench and create a new connection.
   - Click on **Server** in the top menu and select **Data Import**.
   - Select the `dump` folder.
   - Click on the **Import Progress** tab and start the import.

## Additional Assistance

If you encounter any issues or need further assistance, here are some resources:

- [Docker Documentation](https://docs.docker.com/get-started/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

For Windows-specific troubleshooting, consider visiting:

- [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/)
- [Windows 10/11 Git Bash Setup](https://www.atlassian.com/git/tutorials/git-bash)

