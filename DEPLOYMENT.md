# Image Converter & Compressor - Deployment Guide

This document provides instructions for deploying the Image Converter & Compressor application to various hosting environments.

## Prerequisites

- Node.js 14.0 or later
- npm or yarn package manager
- Basic familiarity with web hosting and deployment

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This command creates a `dist` directory with optimized and minified files ready for deployment.

## Deployment Options

### Option 1: Static Hosting Services

The application is a purely client-side React application that can be deployed to any static hosting service.

#### Netlify

1. Sign up for a Netlify account at [netlify.com](https://www.netlify.com/)
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Run `netlify deploy` and follow the instructions
4. For production deployment: `netlify deploy --prod`

#### Vercel

1. Sign up for a Vercel account at [vercel.com](https://vercel.com/)
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel` and follow the instructions
4. For production deployment: `vercel --prod`

#### GitHub Pages

1. Install gh-pages package: `npm install --save-dev gh-pages`
2. Add these scripts to your package.json:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run `npm run deploy`

### Option 2: Traditional Web Hosting

1. Build the application: `npm run build`
2. Upload the contents of the `dist` directory to your web hosting server (via FTP or other methods)
3. Ensure the server is configured to serve the `index.html` file for all routes

### Option 3: Docker Deployment

For containerized deployment, you can use the provided Dockerfile:

1. Build the Docker image:
   ```bash
   docker build -t image-converter .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:80 image-converter
   ```

## Configuration

The application doesn't require any backend services or API keys, as all processing happens client-side in the browser.

## Troubleshooting

- If images don't load, check that your server's MIME types are properly configured
- For routing issues, ensure your server is configured to direct all requests to index.html
- If users report performance issues, consider enabling HTTP/2 and Brotli/Gzip compression on your server

## Performance Optimization

To optimize performance:

1. Enable HTTP/2 on your server
2. Configure proper caching headers:
   ```
   Cache-Control: max-age=31536000, immutable
   ```
   for all files except `index.html`
3. Enable Brotli or Gzip compression
4. Consider using a CDN for global distribution

## Monitoring

Since all processing happens client-side, standard web analytics tools like Google Analytics or Plausible can be used to monitor usage patterns.

## Updates

To update the application:

1. Pull the latest code
2. Run `npm install` to update dependencies
3. Build and deploy following the steps above