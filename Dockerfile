# Use the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .
RUN rm -rf .nx dist

RUN npm run auth:build
RUN npm run user:build
RUN npm run books:build
RUN npm run payment:build

# Copy the application code

# Expose the port the app will run on
EXPOSE 3000

# Run the app

