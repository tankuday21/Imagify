#!/bin/bash

# This script helps to test various aspects of the image converter application

echo "Image Converter & Compressor - Test Script"
echo "========================================="
echo

# Check if required dependencies are installed
echo "Checking dependencies..."
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "node is required but not installed. Aborting."; exit 1; }

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
REQUIRED_NODE_VERSION="14.0.0"

echo "Node.js version: $NODE_VERSION"
if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]; then 
  echo "Warning: Node.js version is older than the recommended minimum ($REQUIRED_NODE_VERSION)"
else
  echo "Node.js version check passed!"
fi

# Check if all required npm packages are installed
echo
echo "Checking npm packages..."
npm list browser-image-compression file-saver react-dropzone jszip >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Some required npm packages are missing. Running npm install..."
  npm install
else
  echo "All required npm packages are installed!"
fi

# Check for test images
echo
echo "Checking test images..."
if [ -f "public/test-image-1.png" ] && [ -f "public/test-image-2.png" ] && [ -f "public/test-image-3.png" ]; then
  echo "Test images found!"
else
  echo "Test images not found in public directory. This may affect testing functionality."
fi

# Run development server and perform automated tests
echo
echo "Would you like to start the development server and run automated tests? (y/n)"
read -r RESPONSE
if [[ "$RESPONSE" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo "Starting development server..."
  npm run dev -- --port 8001 --host 0.0.0.0 &
  SERVER_PID=$!
  
  echo "Waiting for server to start..."
  sleep 5
  
  echo "Server should now be running at http://localhost:8001"
  echo "Press Ctrl+C to stop the server when you're done testing."
  
  wait $SERVER_PID
else
  echo "Skipping server start."
fi

echo
echo "Manual Testing Checklist:"
echo "------------------------"
echo "1. Drag and drop functionality"
echo "2. File selection via browse button"
echo "3. Format conversion (test all formats)"
echo "4. Image compression at different quality levels"
echo "5. Batch processing of multiple images"
echo "6. Download functionality for individual and all images"
echo "7. Responsive design on different screen sizes"
echo "8. Browser compatibility (test in Chrome, Firefox, Safari, Edge)"
echo "9. Error handling with invalid files"
echo "10. Performance with large images"
echo
echo "Test completed!"