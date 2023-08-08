FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Bundle app source
COPY new/client /app

# Install app dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "dev"]
