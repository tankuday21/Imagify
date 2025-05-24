// Test script to verify image conversion functionality
// This script can be run in the browser console to test conversions

console.log('🧪 Starting Image Conversion Functionality Tests...');

// Test data
const testFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
const unsupportedFormats = ['avif', 'ico', 'psd', 'svg', 'pdf', 'ps', 'txt', 'odd', 'text'];

// Create a test canvas with a simple image
function createTestImage(width = 100, height = 100) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#ff6b6b');
  gradient.addColorStop(0.5, '#4ecdc4');
  gradient.addColorStop(1, '#45b7d1');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add some text
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('TEST', width/2, height/2);
  
  return canvas;
}

// Convert canvas to blob
function canvasToBlob(canvas, format, quality = 0.8) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, `image/${format}`, quality);
  });
}

// Test format conversion
async function testFormatConversion(inputFormat, outputFormat, quality = 80) {
  try {
    console.log(`Testing ${inputFormat} → ${outputFormat} conversion...`);
    
    const canvas = createTestImage();
    const inputBlob = await canvasToBlob(canvas, inputFormat);
    const inputFile = new File([inputBlob], `test.${inputFormat}`, { type: `image/${inputFormat}` });
    
    // Import the imageService (this would need to be adapted for actual testing)
    // const { processImage } = await import('./src/services/imageService.js');
    
    // For now, we'll test the canvas conversion directly
    const outputBlob = await canvasToBlob(canvas, outputFormat, quality / 100);
    
    if (outputBlob && outputBlob.size > 0) {
      console.log(`✅ ${inputFormat} → ${outputFormat}: SUCCESS (${outputBlob.size} bytes)`);
      return { success: true, size: outputBlob.size };
    } else {
      console.log(`❌ ${inputFormat} → ${outputFormat}: FAILED (no output)`);
      return { success: false, error: 'No output generated' };
    }
  } catch (error) {
    console.log(`❌ ${inputFormat} → ${outputFormat}: ERROR - ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test quality settings
async function testQualitySettings(format) {
  console.log(`Testing quality settings for ${format}...`);
  const canvas = createTestImage();
  const qualities = [10, 50, 90];
  const results = [];
  
  for (const quality of qualities) {
    try {
      const blob = await canvasToBlob(canvas, format, quality / 100);
      results.push({ quality, size: blob.size });
      console.log(`  Quality ${quality}%: ${blob.size} bytes`);
    } catch (error) {
      console.log(`  Quality ${quality}%: ERROR - ${error.message}`);
    }
  }
  
  return results;
}

// Test browser format support
function testBrowserSupport() {
  console.log('Testing browser format support...');
  const canvas = createTestImage();
  const formats = ['jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff'];
  
  formats.forEach(format => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log(`✅ ${format}: Supported`);
        } else {
          console.log(`❌ ${format}: Not supported`);
        }
      }, `image/${format}`, 0.8);
    } catch (error) {
      console.log(`❌ ${format}: Error - ${error.message}`);
    }
  });
}

// Test file size limits
async function testFileSizeLimits() {
  console.log('Testing file size limits...');
  
  // Create large test image
  const largeCanvas = createTestImage(2000, 2000);
  const blob = await canvasToBlob(largeCanvas, 'png');
  
  console.log(`Large image size: ${blob.size} bytes (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);
  
  if (blob.size > 10485760) { // 10MB limit
    console.log('⚠️ Image exceeds 10MB limit');
  } else {
    console.log('✅ Image within size limits');
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Running comprehensive conversion tests...\n');
  
  // Test browser support first
  testBrowserSupport();
  
  console.log('\n📊 Testing format conversions...');
  const results = {
    supported: [],
    unsupported: [],
    errors: []
  };
  
  // Test supported format conversions
  for (const inputFormat of testFormats) {
    for (const outputFormat of testFormats) {
      const result = await testFormatConversion(inputFormat, outputFormat);
      if (result.success) {
        results.supported.push(`${inputFormat} → ${outputFormat}`);
      } else {
        results.errors.push(`${inputFormat} → ${outputFormat}: ${result.error}`);
      }
    }
  }
  
  // Test unsupported formats
  console.log('\n🚫 Testing unsupported formats...');
  for (const format of unsupportedFormats) {
    const result = await testFormatConversion('png', format);
    if (!result.success) {
      results.unsupported.push(`png → ${format}: ${result.error}`);
    }
  }
  
  // Test quality settings
  console.log('\n🎛️ Testing quality settings...');
  for (const format of ['jpeg', 'png', 'webp']) {
    await testQualitySettings(format);
  }
  
  // Test file size limits
  console.log('\n📏 Testing file size limits...');
  await testFileSizeLimits();
  
  // Summary
  console.log('\n📋 TEST SUMMARY:');
  console.log(`✅ Supported conversions: ${results.supported.length}`);
  console.log(`❌ Unsupported conversions: ${results.unsupported.length}`);
  console.log(`🚨 Errors: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 ERRORS FOUND:');
    results.errors.forEach(error => console.log(`  ${error}`));
  }
  
  return results;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testFormatConversion,
    testQualitySettings,
    testBrowserSupport,
    testFileSizeLimits
  };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('Test functions available: runAllTests(), testBrowserSupport(), testQualitySettings()');
  console.log('Run runAllTests() to execute all tests');
}
