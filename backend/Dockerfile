# Use Node.js LTS version
FROM node:20
# Create and set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package.json .
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . ./
EXPOSE 3000
# Run the application
CMD ["node", "backend/index.js"]