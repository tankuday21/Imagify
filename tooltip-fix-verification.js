// Tooltip Fix Verification Test
// Run this in the browser console at http://localhost:5175/

console.log('🔍 Testing Tooltip Fixes...');

function testTooltipIssues() {
  console.log('\n📋 Tooltip Issue Verification');
  
  // Test 1: Check if format cards have explanatory tooltips removed
  console.log('\n1️⃣ Testing Format Card Tooltips (Should be removed)');
  
  const formatCards = document.querySelectorAll('[class*="glass-card-enhanced"]');
  let cardsWithExplanations = 0;
  let cardsWithoutExplanations = 0;
  
  formatCards.forEach((card, index) => {
    // Check if card has hover tooltips with explanations
    const hasTooltipText = card.querySelector('[class*="tooltip"]') || 
                          card.getAttribute('title') ||
                          card.getAttribute('data-tooltip');
    
    // Simulate hover to check for tooltip content
    const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
    card.dispatchEvent(mouseEnterEvent);
    
    // Wait a bit and check for tooltip content
    setTimeout(() => {
      const tooltips = document.querySelectorAll('[class*="tooltip"], [role="tooltip"]');
      let hasExplanation = false;
      
      tooltips.forEach(tooltip => {
        const text = tooltip.textContent || tooltip.innerText;
        if (text && text.length > 50) { // Long explanatory text
          hasExplanation = true;
        }
      });
      
      if (hasExplanation) {
        cardsWithExplanations++;
        console.log(`❌ Card ${index + 1}: Still has explanatory tooltip`);
      } else {
        cardsWithoutExplanations++;
        console.log(`✅ Card ${index + 1}: No explanatory tooltip`);
      }
      
      // Clean up - mouse leave
      const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });
      card.dispatchEvent(mouseLeaveEvent);
    }, 100);
  }, index * 50);
  
  // Test 2: Check tooltip visibility across the page
  console.log('\n2️⃣ Testing Tooltip Visibility Across Page');
  
  setTimeout(() => {
    // Test tooltips on various elements
    const elementsWithTooltips = document.querySelectorAll('[title], [data-tooltip], [class*="tooltip"]');
    let visibleTooltips = 0;
    let totalTooltips = elementsWithTooltips.length;
    
    console.log(`Found ${totalTooltips} elements with potential tooltips`);
    
    elementsWithTooltips.forEach((element, index) => {
      // Simulate hover
      const rect = element.getBoundingClientRect();
      const mouseEvent = new MouseEvent('mouseenter', {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        bubbles: true
      });
      
      element.dispatchEvent(mouseEvent);
      
      setTimeout(() => {
        // Check for visible tooltips
        const tooltips = document.querySelectorAll('[class*="tooltip"], [role="tooltip"]');
        let hasVisibleTooltip = false;
        
        tooltips.forEach(tooltip => {
          const style = window.getComputedStyle(tooltip);
          const isVisible = style.display !== 'none' && 
                           style.visibility !== 'hidden' && 
                           style.opacity !== '0' &&
                           tooltip.offsetWidth > 0 &&
                           tooltip.offsetHeight > 0;
          
          if (isVisible) {
            hasVisibleTooltip = true;
            
            // Check z-index
            const zIndex = parseInt(style.zIndex) || 0;
            if (zIndex >= 999999) {
              console.log(`✅ Tooltip ${index + 1}: Visible with proper z-index (${zIndex})`);
            } else {
              console.log(`⚠️ Tooltip ${index + 1}: Visible but low z-index (${zIndex})`);
            }
          }
        });
        
        if (hasVisibleTooltip) {
          visibleTooltips++;
        }
        
        // Clean up
        const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });
        element.dispatchEvent(mouseLeaveEvent);
      }, 200);
    }, index * 100);
    
    // Final results
    setTimeout(() => {
      console.log(`\n📊 TOOLTIP VISIBILITY RESULTS:`);
      console.log(`✅ Elements with visible tooltips: ${visibleTooltips}/${totalTooltips}`);
      
      if (visibleTooltips > 0) {
        console.log('🎉 TOOLTIP VISIBILITY: WORKING!');
      } else {
        console.log('❌ TOOLTIP VISIBILITY: STILL BROKEN');
      }
    }, (elementsWithTooltips.length + 1) * 100);
  }, (formatCards.length + 1) * 50);
  
  // Test 3: Check specific tooltip elements
  console.log('\n3️⃣ Testing Specific Tooltip Elements');
  
  setTimeout(() => {
    // Check help icons
    const helpIcons = document.querySelectorAll('[class*="FiHelpCircle"], [class*="help"]');
    console.log(`Found ${helpIcons.length} help icons`);
    
    // Check warning indicators
    const warnings = document.querySelectorAll('[class*="yellow"], [class*="warning"]');
    console.log(`Found ${warnings.length} warning indicators`);
    
    // Test a specific help icon
    if (helpIcons.length > 0) {
      const firstHelpIcon = helpIcons[0];
      const mouseEvent = new MouseEvent('mouseenter', { bubbles: true });
      firstHelpIcon.dispatchEvent(mouseEvent);
      
      setTimeout(() => {
        const tooltips = document.querySelectorAll('[class*="tooltip"], [role="tooltip"]');
        let foundTooltip = false;
        
        tooltips.forEach(tooltip => {
          const style = window.getComputedStyle(tooltip);
          const isVisible = style.opacity !== '0' && style.display !== 'none';
          
          if (isVisible) {
            foundTooltip = true;
            console.log('✅ Help icon tooltip is visible');
            console.log(`   Content: "${tooltip.textContent?.substring(0, 50)}..."`);
            console.log(`   Z-index: ${style.zIndex}`);
            console.log(`   Position: ${style.position}`);
          }
        });
        
        if (!foundTooltip) {
          console.log('❌ Help icon tooltip not visible');
        }
        
        // Clean up
        const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });
        firstHelpIcon.dispatchEvent(mouseLeaveEvent);
      }, 300);
    }
  }, 2000);
  
  // Final summary
  setTimeout(() => {
    console.log('\n🎯 FINAL ASSESSMENT:');
    console.log(`📝 Format cards without explanations: ${cardsWithoutExplanations}/${formatCards.length}`);
    
    if (cardsWithExplanations === 0) {
      console.log('✅ ISSUE 1 FIXED: No explanatory tooltips on format cards');
    } else {
      console.log('❌ ISSUE 1 NOT FIXED: Still has explanatory tooltips');
    }
    
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('1. Hover over format cards - should show NO explanatory text');
    console.log('2. Hover over help icons (?) - should show helpful tooltips');
    console.log('3. Hover over warning indicators (!) - should show brief warnings');
    console.log('4. All tooltips should be clearly visible with high z-index');
    
  }, 5000);
}

// Auto-run test
console.log('🚀 Tooltip Fix Verification Loaded');
console.log('📝 Run testTooltipIssues() to verify fixes');

// Auto-run after delay
setTimeout(() => {
  console.log('\n🔄 Auto-running tooltip verification tests...');
  testTooltipIssues();
}, 1000);
