# STAGE 1: Build
FROM node:18 AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the entire application source code
COPY . .

# STAGE 2: Development
FROM node:18 AS development
WORKDIR /app

# Copy only necessary files from the build stage
COPY package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./

# Expose application port
EXPOSE 3000

# Command to run the app in development mode
CMD ["npm", "run", "dev"]
