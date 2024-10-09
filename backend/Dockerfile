# Use Node.js LTS version
FROM node:20.16.0

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Create and set the working directory inside the backend folder
WORKDIR /app

# Install FFmpeg and GraphicsMagick in one RUN command
RUN apt-get update && apt-get install -y ffmpeg graphicsmagick && apt-get clean

# Copy package.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Run the application from the backend folder
CMD ["npm", "run", "dev"]