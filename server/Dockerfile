# Instructions

# Base image, which we will use for our image
FROM node:16-alpine

# Create work directory for our image
WORKDIR /app

# Which port is opened in container
EXPOSE 5000

# Copy 2 files from LOCAL folder with name 'package' to WORKDIR folder (/app)
COPY package*.json ./

# Running command
RUN npm install

# Copy files from LOCAL folder (${PWD}) to WORKDIR folder (/app)
COPY . ./

# When we create image this instruction will be used, when container is created
RUN npm run build

CMD ["npm", "run", "prod"]