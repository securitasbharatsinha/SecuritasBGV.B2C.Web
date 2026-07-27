# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the container
COPY . .

# Expose the port for development (e.g., Angular CLI default port)
EXPOSE 4200

# Define the command to start the Angular development server with live-reload
# CMD ["npm", "run", "dev:ssr"]