ARG NODE_VERSION=20.18.0

FROM node:${NODE_VERSION}

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci --omit=dev --ignore-scripts
RUN npm i -D typescript

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build:ts

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
