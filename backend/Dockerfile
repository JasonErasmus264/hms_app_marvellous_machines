# Use the Node.js LTS version (20.16.0) as the base image
FROM node:20.16.0

# Set the working directory inside the container to /app
WORKDIR /app

# Install FFmpeg and GraphicsMagick in one RUN command
RUN apt-get update && apt-get install -y ffmpeg graphicsmagick

# Copy package.json to the working directory
COPY package.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the application port (optional, depending on your app)
# EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]