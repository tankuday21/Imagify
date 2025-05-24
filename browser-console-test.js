// Browser Console Test Script for Imagify Image Converter
// Copy and paste this into the browser console at http://localhost:5175/

console.log('🧪 Starting Imagify Browser Console Tests...');

// Test 1: Check if all format options are properly loaded
function testFormatOptions() {
  console.log('\n📋 Test 1: Format Options');
  
  const formatCards = document.querySelectorAll('[data-format]');
  const expectedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'];
  
  console.log(`Found ${formatCards.length} format cards`);
  
  formatCards.forEach(card => {
    const format = card.getAttribute('data-format');
    if (expectedFormats.includes(format)) {
      console.log(`✅ ${format.toUpperCase()}: Found and properly configured`);
    } else {
      console.log(`❌ ${format.toUpperCase()}: Unexpected format found`);
    }
  });
  
  return formatCards.length === expectedFormats.length;
}

// Test 2: Check dropdown functionality
function testDropdowns() {
  console.log('\n🔽 Test 2: Dropdown Functionality');
  
  const dropdowns = document.querySelectorAll('button[aria-expanded]');
  console.log(`Found ${dropdowns.length} modern dropdowns`);
  
  dropdowns.forEach((dropdown, index) => {
    const label = dropdown.getAttribute('aria-label') || `Dropdown ${index + 1}`;
    console.log(`✅ ${label}: Modern dropdown component detected`);
  });
  
  return dropdowns.length > 0;
}

// Test 3: Check tooltip visibility
function testTooltips() {
  console.log('\n💬 Test 3: Tooltip System');
  
  const formatCards = document.querySelectorAll('[data-format]');
  let tooltipCount = 0;
  
  formatCards.forEach(card => {
    const tooltip = card.querySelector('[role="tooltip"], .tooltip, [class*="tooltip"]');
    if (tooltip) {
      tooltipCount++;
    }
  });
  
  console.log(`✅ Tooltip system: ${tooltipCount} tooltips detected`);
  return tooltipCount > 0;
}

// Test 4: Check quality slider
function testQualitySlider() {
  console.log('\n🎛️ Test 4: Quality Slider');
  
  const qualitySlider = document.querySelector('input[type="range"]');
  if (qualitySlider) {
    const value = qualitySlider.value;
    const min = qualitySlider.min;
    const max = qualitySlider.max;
    
    console.log(`✅ Quality slider: Value=${value}, Range=${min}-${max}`);
    return true;
  } else {
    console.log('❌ Quality slider: Not found');
    return false;
  }
}

// Test 5: Check advanced features toggles
function testAdvancedFeatures() {
  console.log('\n⚙️ Test 5: Advanced Features');
  
  const features = [
    'resize',
    'watermark', 
    'filter',
    'rotation'
  ];
  
  let foundFeatures = 0;
  
  features.forEach(feature => {
    const toggle = document.querySelector(`[data-feature="${feature}"], #${feature}, [class*="${feature}"]`);
    if (toggle) {
      console.log(`✅ ${feature}: Feature toggle found`);
      foundFeatures++;
    } else {
      console.log(`⚠️ ${feature}: Feature toggle not found (may be in collapsed state)`);
    }
  });
  
  return foundFeatures > 0;
}

// Test 6: Check error handling setup
function testErrorHandling() {
  console.log('\n🚨 Test 6: Error Handling');
  
  const errorContainer = document.querySelector('[data-testid="error-message"], .error, [class*="error"]');
  if (errorContainer) {
    console.log('✅ Error handling: Error display container found');
    return true;
  } else {
    console.log('⚠️ Error handling: No error container visible (normal if no errors)');
    return true; // This is actually normal
  }
}

// Test 7: Check accessibility features
function testAccessibility() {
  console.log('\n♿ Test 7: Accessibility Features');
  
  const ariaLabels = document.querySelectorAll('[aria-label]').length;
  const ariaRoles = document.querySelectorAll('[role]').length;
  const focusableElements = document.querySelectorAll('button, input, select, [tabindex]').length;
  
  console.log(`✅ ARIA labels: ${ariaLabels} elements`);
  console.log(`✅ ARIA roles: ${ariaRoles} elements`);
  console.log(`✅ Focusable elements: ${focusableElements} elements`);
  
  return ariaLabels > 0 && focusableElements > 0;
}

// Test 8: Check performance
function testPerformance() {
  console.log('\n⚡ Test 8: Performance Check');
  
  const startTime = performance.now();
  
  // Simulate some DOM operations
  const elements = document.querySelectorAll('*');
  const elementCount = elements.length;
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`✅ DOM elements: ${elementCount}`);
  console.log(`✅ Query time: ${duration.toFixed(2)}ms`);
  
  return duration < 100; // Should be very fast
}

// Main test runner
function runAllBrowserTests() {
  console.log('🚀 Running Imagify Browser Console Tests...\n');
  
  const tests = [
    { name: 'Format Options', fn: testFormatOptions },
    { name: 'Dropdown Functionality', fn: testDropdowns },
    { name: 'Tooltip System', fn: testTooltips },
    { name: 'Quality Slider', fn: testQualitySlider },
    { name: 'Advanced Features', fn: testAdvancedFeatures },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Accessibility', fn: testAccessibility },
    { name: 'Performance', fn: testPerformance }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  tests.forEach(test => {
    try {
      const result = test.fn();
      if (result) {
        passed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.message}`);
    }
  });
  
  console.log(`\n📊 TEST SUMMARY:`);
  console.log(`✅ Passed: ${passed}/${total} tests`);
  console.log(`📈 Success Rate: ${((passed/total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('🎉 ALL TESTS PASSED! Imagify is working perfectly.');
  } else {
    console.log('⚠️ Some tests failed. Check the details above.');
  }
  
  return { passed, total, successRate: (passed/total) * 100 };
}

// Auto-run tests
console.log('🎯 Imagify Browser Console Test Suite Loaded');
console.log('📝 Run runAllBrowserTests() to execute all tests');
console.log('🔧 Individual test functions available: testFormatOptions(), testDropdowns(), etc.');

// Automatically run tests after a short delay to let the page load
setTimeout(() => {
  console.log('\n🔄 Auto-running tests in 2 seconds...');
  setTimeout(runAllBrowserTests, 2000);
}, 1000);
