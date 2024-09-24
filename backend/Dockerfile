# Use Node.js LTS version
FROM node:20

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Create and set the working directory inside the backend folder
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Run the application from the backend folder
CMD ["npm", "run", "dev"]