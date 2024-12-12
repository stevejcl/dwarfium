#!/bin/sh

# Start MediaMTX in the background
cd /app/install/linux
chmod +x ./mediamtx
./mediamtx /app/install/config/mediamtx.yml &

# Start the Next.js app
cd /app
npm run start:api
