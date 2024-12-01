FROM node:18-alpine

# Install Chromium and dependencies
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    libstdc++ \
    udev \
    gcompat \
    libc6-compat \
    fontconfig \
    dbus \
    curl

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./ 
RUN npm install puppeteer@19.7.0 jsdom

# Copy scripts
COPY scripts/analyze.js ./scripts/

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Command to run the analysis script
CMD ["node", "scripts/analyze.js"]
