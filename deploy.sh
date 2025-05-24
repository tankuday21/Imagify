#!/bin/bash

# Build the application for production
echo "Building the application for production..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Please check for errors."
  exit 1
fi

echo "Build successful!"

# Create a dist directory if it doesn't exist
mkdir -p dist

# Zip the dist folder for easy deployment
echo "Creating deployment zip file..."
cd dist
zip -r ../image-converter-deploy.zip .
cd ..

echo "Deployment package created: image-converter-deploy.zip"
echo ""
echo "To deploy this application:"
echo "1. Upload the zip file to your web server"
echo "2. Extract the contents to your web root or a subdirectory"
echo "3. For static hosting services like Netlify, Vercel, or GitHub Pages, upload the entire dist folder"
echo ""
echo "Note: This is a client-side application and doesn't require any server-side processing."