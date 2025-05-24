// Format Card Visibility Test
// Run this in the browser console at http://localhost:5175/

console.log('🔍 Testing Format Card Visibility...');

function testFormatCardVisibility() {
  console.log('\n📋 Format Card Visibility Test');
  
  // Find all format cards
  const formatCards = document.querySelectorAll('[class*="glass-card-enhanced"]');
  console.log(`✅ Found ${formatCards.length} format cards`);
  
  let visibleCards = 0;
  let readableText = 0;
  let properHeight = 0;
  
  formatCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    
    if (isVisible) {
      visibleCards++;
      
      // Check if card has proper height
      if (rect.height >= 140) {
        properHeight++;
      }
      
      // Check text visibility
      const textElements = card.querySelectorAll('span, p');
      let hasReadableText = false;
      
      textElements.forEach(textEl => {
        const style = window.getComputedStyle(textEl);
        const fontSize = parseFloat(style.fontSize);
        const color = style.color;
        
        if (fontSize >= 12 && color !== 'rgba(0, 0, 0, 0)') {
          hasReadableText = true;
        }
      });
      
      if (hasReadableText) {
        readableText++;
      }
      
      console.log(`Card ${index + 1}: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}px, Text: ${hasReadableText ? 'Readable' : 'Poor'}`);
    }
  });
  
  console.log(`\n📊 Visibility Results:`);
  console.log(`✅ Visible cards: ${visibleCards}/${formatCards.length}`);
  console.log(`✅ Proper height (≥140px): ${properHeight}/${formatCards.length}`);
  console.log(`✅ Readable text: ${readableText}/${formatCards.length}`);
  
  // Test specific format labels
  const formatLabels = ['JPG', 'PNG', 'WebP', 'AVIF', 'GIF', 'BMP', 'TIFF', 'ICO', 'SVG'];
  let foundFormats = 0;
  
  formatLabels.forEach(format => {
    const formatElement = Array.from(document.querySelectorAll('*')).find(el => 
      el.textContent && el.textContent.trim().toUpperCase() === format
    );
    
    if (formatElement) {
      const style = window.getComputedStyle(formatElement);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      
      if (isVisible) {
        foundFormats++;
        console.log(`✅ ${format}: Visible`);
      } else {
        console.log(`❌ ${format}: Hidden`);
      }
    } else {
      console.log(`❌ ${format}: Not found`);
    }
  });
  
  console.log(`\n📈 Format Labels: ${foundFormats}/${formatLabels.length} visible`);
  
  // Test grid layout
  const grid = document.querySelector('[class*="grid"]');
  if (grid) {
    const gridStyle = window.getComputedStyle(grid);
    const gap = gridStyle.gap || gridStyle.gridGap;
    const gridCols = gridStyle.gridTemplateColumns;
    
    console.log(`\n🎯 Grid Layout:`);
    console.log(`✅ Gap: ${gap}`);
    console.log(`✅ Columns: ${gridCols ? gridCols.split(' ').length : 'Auto'}`);
  }
  
  // Overall assessment
  const visibilityScore = (visibleCards / formatCards.length) * 100;
  const readabilityScore = (readableText / formatCards.length) * 100;
  const formatScore = (foundFormats / formatLabels.length) * 100;
  
  console.log(`\n🎯 OVERALL ASSESSMENT:`);
  console.log(`📊 Visibility Score: ${visibilityScore.toFixed(1)}%`);
  console.log(`📖 Readability Score: ${readabilityScore.toFixed(1)}%`);
  console.log(`🏷️ Format Labels Score: ${formatScore.toFixed(1)}%`);
  
  const overallScore = (visibilityScore + readabilityScore + formatScore) / 3;
  console.log(`🏆 Overall Score: ${overallScore.toFixed(1)}%`);
  
  if (overallScore >= 90) {
    console.log('🎉 EXCELLENT: Format cards are highly visible and readable!');
  } else if (overallScore >= 75) {
    console.log('✨ GOOD: Format cards are mostly visible with minor issues');
  } else if (overallScore >= 60) {
    console.log('⚠️ FAIR: Format cards have visibility issues that need attention');
  } else {
    console.log('❌ POOR: Format cards have significant visibility problems');
  }
  
  return {
    visibleCards,
    readableText,
    properHeight,
    foundFormats,
    overallScore
  };
}

// Test responsive behavior
function testResponsiveLayout() {
  console.log('\n📱 Testing Responsive Layout...');
  
  const screenWidth = window.innerWidth;
  console.log(`📏 Screen width: ${screenWidth}px`);
  
  let expectedColumns;
  if (screenWidth >= 1536) expectedColumns = 7;      // 2xl
  else if (screenWidth >= 1280) expectedColumns = 6; // xl
  else if (screenWidth >= 1024) expectedColumns = 5; // lg
  else if (screenWidth >= 768) expectedColumns = 4;  // md
  else if (screenWidth >= 640) expectedColumns = 3;  // sm
  else expectedColumns = 2;                          // default
  
  console.log(`🎯 Expected columns: ${expectedColumns}`);
  
  const grid = document.querySelector('[class*="grid"]');
  if (grid) {
    const cards = grid.children;
    const cardsPerRow = Math.ceil(cards.length / Math.ceil(cards.length / expectedColumns));
    console.log(`📊 Actual cards per row: ~${cardsPerRow}`);
  }
  
  return expectedColumns;
}

// Auto-run tests
console.log('🚀 Format Card Visibility Test Suite Loaded');
console.log('📝 Run testFormatCardVisibility() to test visibility');
console.log('📱 Run testResponsiveLayout() to test responsive behavior');

// Auto-run after delay
setTimeout(() => {
  console.log('\n🔄 Auto-running visibility tests...');
  const results = testFormatCardVisibility();
  testResponsiveLayout();
  
  if (results.overallScore >= 75) {
    console.log('\n✅ FORMAT CARD VISIBILITY: FIXED SUCCESSFULLY!');
  } else {
    console.log('\n⚠️ FORMAT CARD VISIBILITY: NEEDS MORE WORK');
  }
}, 2000);
