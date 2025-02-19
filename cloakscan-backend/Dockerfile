FROM node:18-alpine

# Install Chromium and dependencies
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && mkdir -p /usr/lib/chromium/


# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install puppeteer@19.7.0 jsdom

# Copy scripts
COPY scripts/analyze.js ./scripts/

# Environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Command to run the analysis script
CMD ["node", "scripts/analyze.js"]
