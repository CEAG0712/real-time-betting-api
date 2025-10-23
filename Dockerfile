# Use Node LTS image
FROM node:18-alpine


# Set working directory
WORKDIR /usr/src/app


# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production


# Copy rest of the code
COPY . .


# Build TypeScript
RUN npm run build


# Expose port (default 3000)
EXPOSE 3000


# Start app
CMD [ "node", "dist/server.js" ]