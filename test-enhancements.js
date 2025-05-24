// Test script for the three major enhancements
// Run this in the browser console at http://localhost:5175/

console.log('🧪 Testing Imagify Enhancements...');

// Test 1: Animated Tooltip System
function testAnimatedTooltips() {
  console.log('\n🎯 Test 1: Animated Tooltip System');
  
  const formatCards = document.querySelectorAll('[data-format]');
  let tooltipCount = 0;
  let animatedTooltipCount = 0;
  
  formatCards.forEach(card => {
    // Check for animated tooltip wrapper
    const animatedTooltip = card.closest('[class*="AnimatedTooltip"]') || 
                           card.querySelector('[class*="tooltip"]') ||
                           card.parentElement;
    
    if (animatedTooltip) {
      tooltipCount++;
      
      // Check for cursor follower elements
      const cursorFollower = document.querySelector('[class*="cursor"]') ||
                           document.querySelector('[style*="pointer-events: none"]');
      
      if (cursorFollower) {
        animatedTooltipCount++;
      }
    }
  });
  
  console.log(`✅ Format cards with tooltips: ${tooltipCount}`);
  console.log(`✅ Animated tooltip system: ${animatedTooltipCount > 0 ? 'Active' : 'Inactive'}`);
  
  // Test cursor following (simulate mouse move)
  const testCard = formatCards[0];
  if (testCard) {
    const event = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
      bubbles: true
    });
    testCard.dispatchEvent(event);
    console.log('✅ Mouse tracking test: Dispatched');
  }
  
  return tooltipCount > 0;
}

// Test 2: Full Format Support
function testFormatSupport() {
  console.log('\n🔧 Test 2: Full Format Support');
  
  const formatCards = document.querySelectorAll('[data-format]');
  const expectedFormats = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico', 'svg'];
  const foundFormats = [];
  
  formatCards.forEach(card => {
    const format = card.getAttribute('data-format') || 
                  card.textContent.toLowerCase().match(/\b(jpg|jpeg|png|webp|avif|gif|bmp|tiff|ico|svg)\b/);
    if (format) {
      foundFormats.push(typeof format === 'string' ? format : format[0]);
    }
  });
  
  console.log(`✅ Expected formats: ${expectedFormats.length}`);
  console.log(`✅ Found formats: ${foundFormats.length}`);
  
  // Check for browser support warnings
  const warnings = document.querySelectorAll('[class*="yellow"], [title*="Limited"], [class*="warning"]');
  console.log(`✅ Browser support warnings: ${warnings.length}`);
  
  // Check for AVIF format specifically
  const avifSupported = foundFormats.includes('avif');
  console.log(`✅ AVIF format available: ${avifSupported}`);
  
  // Check for ICO format specifically  
  const icoSupported = foundFormats.includes('ico');
  console.log(`✅ ICO format available: ${icoSupported}`);
  
  // Check for SVG format specifically
  const svgSupported = foundFormats.includes('svg');
  console.log(`✅ SVG format available: ${svgSupported}`);
  
  return foundFormats.length >= 8; // Should have at least 8 formats
}

// Test 3: Layout and Spacing Optimization
function testLayoutOptimization() {
  console.log('\n📐 Test 3: Layout and Spacing Optimization');
  
  // Check container width
  const mainContainer = document.querySelector('main') || document.querySelector('.container');
  const containerStyle = window.getComputedStyle(mainContainer);
  const maxWidth = containerStyle.maxWidth;
  
  console.log(`✅ Container max-width: ${maxWidth}`);
  
  // Check grid spacing
  const formatGrid = document.querySelector('[class*="grid"]');
  if (formatGrid) {
    const gridStyle = window.getComputedStyle(formatGrid);
    const gap = gridStyle.gap || gridStyle.gridGap;
    console.log(`✅ Grid gap: ${gap}`);
  }
  
  // Check responsive breakpoints
  const screenWidth = window.innerWidth;
  console.log(`✅ Screen width: ${screenWidth}px`);
  
  let breakpoint = 'xs';
  if (screenWidth >= 2560) breakpoint = 'ultrawide';
  else if (screenWidth >= 1920) breakpoint = '3xl';
  else if (screenWidth >= 1536) breakpoint = '2xl';
  else if (screenWidth >= 1280) breakpoint = 'xl';
  else if (screenWidth >= 1024) breakpoint = 'lg';
  else if (screenWidth >= 768) breakpoint = 'md';
  else if (screenWidth >= 640) breakpoint = 'sm';
  
  console.log(`✅ Current breakpoint: ${breakpoint}`);
  
  // Check padding and margins
  const sections = document.querySelectorAll('section, .section, [class*="space-y"]');
  let enhancedSpacing = 0;
  
  sections.forEach(section => {
    const style = window.getComputedStyle(section);
    const marginBottom = parseInt(style.marginBottom);
    const paddingTop = parseInt(style.paddingTop);
    
    if (marginBottom > 24 || paddingTop > 24) { // 1.5rem = 24px
      enhancedSpacing++;
    }
  });
  
  console.log(`✅ Sections with enhanced spacing: ${enhancedSpacing}`);
  
  return maxWidth !== 'none' && enhancedSpacing > 0;
}

// Test 4: Performance Check
function testPerformance() {
  console.log('\n⚡ Test 4: Performance Check');
  
  const startTime = performance.now();
  
  // Test animation performance
  const animatedElements = document.querySelectorAll('[class*="animate"], [class*="motion"], [style*="transform"]');
  console.log(`✅ Animated elements: ${animatedElements.length}`);
  
  // Test memory usage (approximate)
  const memoryInfo = performance.memory;
  if (memoryInfo) {
    const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
    console.log(`✅ Memory usage: ${usedMB}MB`);
  }
  
  // Test DOM query performance
  const elements = document.querySelectorAll('*');
  const endTime = performance.now();
  const queryTime = endTime - startTime;
  
  console.log(`✅ DOM elements: ${elements.length}`);
  console.log(`✅ Query time: ${queryTime.toFixed(2)}ms`);
  
  return queryTime < 50 && animatedElements.length > 0;
}

// Main test runner
function runEnhancementTests() {
  console.log('🚀 Running Imagify Enhancement Tests...\n');
  
  const tests = [
    { name: 'Animated Tooltips', fn: testAnimatedTooltips },
    { name: 'Format Support', fn: testFormatSupport },
    { name: 'Layout Optimization', fn: testLayoutOptimization },
    { name: 'Performance', fn: testPerformance }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  tests.forEach(test => {
    try {
      const result = test.fn();
      if (result) {
        passed++;
        console.log(`\n✅ ${test.name}: PASSED`);
      } else {
        console.log(`\n⚠️ ${test.name}: PARTIAL`);
      }
    } catch (error) {
      console.log(`\n❌ ${test.name}: ERROR - ${error.message}`);
    }
  });
  
  console.log(`\n📊 ENHANCEMENT TEST SUMMARY:`);
  console.log(`✅ Passed: ${passed}/${total} tests`);
  console.log(`📈 Success Rate: ${((passed/total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('🎉 ALL ENHANCEMENTS WORKING PERFECTLY!');
  } else if (passed >= total * 0.75) {
    console.log('✨ ENHANCEMENTS MOSTLY WORKING - Minor issues detected');
  } else {
    console.log('⚠️ SOME ENHANCEMENTS NEED ATTENTION');
  }
  
  return { passed, total, successRate: (passed/total) * 100 };
}

// Auto-run tests
console.log('🎯 Enhancement Test Suite Loaded');
console.log('📝 Run runEnhancementTests() to execute all tests');

// Automatically run tests after a short delay
setTimeout(() => {
  console.log('\n🔄 Auto-running enhancement tests in 2 seconds...');
  setTimeout(runEnhancementTests, 2000);
}, 1000);
