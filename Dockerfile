FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Bundle app source and change permissions
COPY new/client /app

# Install app dependencies
RUN npm install

# Change app folder permissions
RUN chown -R node:node /app

# Switch to the non-root user
USER node

# Use a volume for node_modules
VOLUME ["/app/node_modules"]

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "dev"]
