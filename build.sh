#!/bin/bash

# Vercel Build Script for Imagify
echo "🚀 Starting Imagify build process..."

# Set permissions for node_modules binaries
echo "📝 Setting permissions..."
chmod +x node_modules/.bin/* 2>/dev/null || true

# Run the build
echo "🔨 Building application..."
npx vite build

echo "✅ Build completed successfully!"
