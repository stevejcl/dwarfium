# Step 1: Use Node.js base image
FROM node:20-bullseye

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy necessary files
COPY package*.json ./
COPY next.config.js ./
COPY dist ./dist
COPY public ./public
COPY install/linux ./install/linux
COPY install/config ./install/config
COPY scripts/start.sh ./

# Step 4: Install production dependencies
RUN npm install --omit=dev

# Step 5: Set environment variables
ENV NEXT_PUBLIC_URL_PROXY_CORS=/api/proxy

# Expose both ports (3000 for your Next.js app and 8888 for MediaMTX)
EXPOSE 3000
EXPOSE 8888

# Step 7: Start both processes using a script
RUN chmod +x /app/start.sh

# Use the script to start MediaMTX and the Next.js app
CMD ["/app/start.sh"]
