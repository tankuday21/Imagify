#!/usr/bin/env node

/**
 * Custom Vercel Build Script
 * This script handles the build process for Vercel deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Vercel build for Imagify...');

try {
  // Step 1: Set executable permissions for node_modules binaries
  console.log('📝 Setting permissions for node_modules binaries...');
  try {
    execSync('chmod +x node_modules/.bin/*', { stdio: 'inherit' });
    console.log('✅ Permissions set successfully');
  } catch (error) {
    console.log('⚠️ Permission setting failed, continuing...');
  }

  // Step 2: Verify Vite is available
  console.log('🔍 Checking Vite availability...');
  try {
    execSync('npx vite --version', { stdio: 'pipe' });
    console.log('✅ Vite is available');
  } catch (error) {
    console.log('❌ Vite not found, installing...');
    execSync('npm install vite@latest', { stdio: 'inherit' });
  }

  // Step 3: Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('✅ Previous build cleaned');
  }

  // Step 4: Run the build
  console.log('🔨 Building the application...');
  execSync('npx vite build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      CI: 'true'
    }
  });

  // Step 5: Verify build output
  console.log('🔍 Verifying build output...');
  if (!fs.existsSync('dist')) {
    throw new Error('Build failed: dist directory not created');
  }

  if (!fs.existsSync('dist/index.html')) {
    throw new Error('Build failed: index.html not found in dist');
  }

  const files = fs.readdirSync('dist', { recursive: true });
  console.log(`✅ Build successful! Generated ${files.length} files`);

  // Step 6: Create _redirects file for SPA routing
  console.log('📝 Creating _redirects file for SPA routing...');
  fs.writeFileSync('dist/_redirects', '/*    /index.html   200\n');
  console.log('✅ _redirects file created');

  console.log('🎉 Vercel build completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
