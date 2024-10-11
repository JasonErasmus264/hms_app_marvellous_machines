 HMS App - Marvellous Machines 🤖 

## Table of Contents 📚

1. [Backend](#backend)
   - [Prerequisites](#prerequisites)
   - [Getting Started](#getting-started)
   - [Running the Backend](#running-the-backend)
     - [Option 1: Use Docker](#option-1-use-docker-recommended)
     - [Option 2: Build Locally](#option-2-build-locally)
   - [Database Setup](#database-setup)
2. [Frontend (Flutter)](#frontend)
   - [Prerequisites](#frontend-prerequisites)
   - [Running the Frontend](#running-the-frontend)
3. [Additional Assistance](#additional-assistance)

## Backend

### Prerequisites ⚙️

🛑**Warning**: This application has been tested on Windows 10 and 11. If you encounter any issues, please refer to the appropriate documentation for your operating system.

- 🐳 [Docker Desktop](https://www.docker.com/products/docker-desktop) - Ensure Docker is running.
- If you plan to build the Node.js app locally:
  - 🌐 [Node.js](https://nodejs.org/en/) - Download the latest LTS version.
  - 🛠️ [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) - Optional, for database management.

### Important Note ⚠️

When cloning the repository, save it in a folder with **no special characters or spaces** in the path.

## Getting Started 🚀

**Clone the Repository**:
   ```bash
   git clone https://github.com/JasonErasmus264/hms_app_marvellous_machines.git
   cd hms_app_marvellous_machines
   ```

## Running the Application 🏃‍♂️

### Option 1: Use Docker (Recommended) 🐋

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

### Option 2: Build Locally 🖥️

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

## Database Setup 🗄️

If you are running the application locally, you must have MySQL Workbench set up.

1. **Import the Example Database**:
   - Inside the cloned repository, navigate to the `dump` folder, which contains example tables and data for the database.
   - Open MySQL Workbench and create a new connection.
   - Click on **Server** in the top menu and select **Data Import**.
   - Select the `dump` folder.
   - Click on the **Import Progress** tab and start the import.

## Frontend (Flutter) 🐦

### Prerequisites ⚙️

- Install Flutter SDK. You can download it from [Flutter's official website](https://flutter.dev/docs/get-started/install).
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/) with Flutter plugins enabled.

## Setting Up Flutter on Your PC

### 1. Install Flutter SDK
- Download Flutter SDK from the [Flutter official website](https://flutter.dev/docs/get-started/install).
- Extract the ZIP file and place the `flutter` folder in a desired location (e.g., `C:\src\flutter`).

### 2. Set Environment Variables
- Add the `flutter/bin` directory to your system `PATH` environment variable. This allows you to run `flutter` commands globally.

**Steps:**
1. Open **File Explorer** and right-click on "This PC" or "My Computer", then click on **Properties** or just search **Advanced system settings**.
2. Click **Advanced system settings** > **Environment Variables**.
3. Under "System variables", find `Path` and click **Edit**.
4. Click **New** and add the path to the Flutter bin directory (e.g., `C:\src\flutter\bin`).
5. Click **OK**.

### 3. Install Git
- Flutter requires Git for version control. Download and install Git from the official site: [Git Download](https://git-scm.com/downloads).
- After installation, ensure that `git` is added to your system `PATH` so it can be accessed from any command line.

### 4. Install the Flutter Plugin for Visual Studio Code
- Visual Studio Code is the preferred IDE for Flutter development due to its lightweight nature and fast performance.

**Steps to Install the Flutter Plugin:**
1. Open VS Code and go to **Extensions** (or press `Ctrl+Shift+X`).
2. Search for `Flutter` and install the Flutter extension (this will install Dart as well).

### 5. Set up Android Emulator (Optional)
To run your Flutter app on an Android emulator:
1. Download and install [Android Studio](https://developer.android.com/studio).
2. During installation, ensure that the following components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
3. Configure Android Studio for Flutter:
   1. Open Android Studio and go to **File** > **Settings** > **Plugins**.
   2. Search for `Flutter` and install the Flutter plugin (it will also install the Dart plugin).
   3. Restart Android Studio.
4. Set up an Android Emulator:
   - Go to **Tools** > **AVD Manager** in Android Studio.
   - Click **Create Virtual Device**, choose a device model, and download the desired system image (ensure it's for x86 architecture).
   - Start the emulator by clicking the play button.

### 6. Install Chrome (for Web Development)
- Flutter supports web development. To use this feature, install the latest version of [Google Chrome](https://www.google.com/chrome/).

### 7. Enable Developer Options on Your Android Device (for Mobile Development)
1. Go to **Settings** on your Android phone.
2. Tap on **About phone** and then tap **Build number** 7 times to enable developer mode.
3. Go to **Developer options** and enable **USB debugging**.
4. Connect your device to your PC using a USB cable and allow debugging permissions.

### 8. Install Java Development Kit (JDK)
- Android development requires a JDK. Download and install [JDK 8 or higher](https://www.oracle.com/java/technologies/javase-downloads.html).

### 9. Install Xcode (for macOS/iOS Development, if applicable)
- If you're on macOS and want to develop for iOS, install [Xcode](https://developer.apple.com/xcode/).
  - After installation, open Xcode, go to **Preferences** > **Locations**, and set the **Command Line Tools** to the latest Xcode version.

### 10. Run `flutter doctor`
- Open a terminal or command prompt and run:
  ```bash
   flutter doctor
   ```

This checks your setup for any missing dependencies. Follow any instructions it gives to resolve issues.

**Example output:**
```bash
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 3.24.0, on Microsoft Windows [Version 10.0.22631.4317], locale en-ZA)
[✓] Windows Version (Installed version of Windows is version 10 or higher)
[✓] Android toolchain - develop for Android devices (Android SDK version 34.0.0)
[✓] Chrome - develop for the web
[✓] Visual Studio - develop Windows apps (Visual Studio Build Tools 2019 16.11.38)
[✓] Android Studio (version 2024.1)
[✓] VS Code (version 1.94.1)
[✓] Connected device (3 available)
[✓] Network resources
```



### Running the Frontend 🏃‍♀️

1. In the root directory of the project, run the following command to get all required dependencies:
   ```bash
   flutter pub get
   ```


2. Once dependencies are installed, run the application:
   ```bash
   flutter run
   ```
3. If you're running the frontend on a PC, you'll be prompted to select a browser. You will see options similar to the following:


   ```bash
   Connected devices:
   Chrome (web) • chrome • web-javascript • Google Chrome 129.0.6668.90
   Edge (web)   • edge   • web-javascript • Microsoft Edge 129.0.2792.79
   [1]: Chrome (chrome)
   [2]: Edge (edge)
   Please choose one (or "q" to quit):
   ```
   Choose the browser you'd like to run the application on by typing the corresponding number.

4. For mobile (Android), you can enable Developer Options on your device and allow USB Debugging. Then, connect your phone to your PC via a USB cable and run:

   ```bash
   flutter run
   ```





## Additional Assistance 🆘
If you encounter any issues or need further assistance, here are some resources:

- 🐳 [Docker Documentation](https://docs.docker.com/get-started/)
- 🌐 [Node.js Documentation](https://nodejs.org/en/docs/)
- 🛠️ [MySQL Documentation](https://dev.mysql.com/doc/)
- 🐦 [Flutter Documentation](https://flutter.dev/docs)

For Windows-specific troubleshooting, consider visiting:

- 🐳 [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/)
- 🖥️ [Windows 10/11 Git Bash Setup](https://www.atlassian.com/git/tutorials/git-bash)