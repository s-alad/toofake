FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Expose port
EXPOSE 3000

# Startup command
CMD ["npm", "run", "dev"]
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

# Bundle app source and change permissions
COPY new/client /app

# Change app folder permissions again
RUN chown -R node:node /app

# Switch to the non-root user
USER node

# Install app dependencies
RUN npm install
