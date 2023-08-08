FROM node:lts-alpine

# Create app directory and give ownership to the non-root user
WORKDIR /app
RUN chown -R node:node /app

# Switch to the non-root user
USER node

# Bundle app source
COPY new/client /app

# Install app dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "dev"]
