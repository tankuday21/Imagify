/**
 * Debug Cursor Follower
 * Run this in browser console to check what's happening
 */

(function() {
  console.log('🔍 Debugging Cursor Follower');
  console.log('============================');
  
  // Check if elements exist
  const cursorFollower = document.querySelector('.cursor-follower');
  const cursorInner = document.querySelector('.cursor-follower-inner');
  const cursorOuter = document.querySelector('.cursor-follower-outer');
  
  console.log('Elements found:');
  console.log('- Cursor follower:', !!cursorFollower);
  console.log('- Cursor inner:', !!cursorInner);
  console.log('- Cursor outer:', !!cursorOuter);
  
  if (cursorFollower) {
    const style = window.getComputedStyle(cursorFollower);
    console.log('\nCursor follower styles:');
    console.log('- Display:', style.display);
    console.log('- Visibility:', style.visibility);
    console.log('- Opacity:', style.opacity);
    console.log('- Position:', style.position);
    console.log('- Z-index:', style.zIndex);
    console.log('- Transform:', style.transform);
    console.log('- Left:', style.left);
    console.log('- Top:', style.top);
  }
  
  // Check body class
  const hasActiveClass = document.body.classList.contains('cursor-follower-active');
  console.log('\nBody has cursor-follower-active class:', hasActiveClass);
  
  // Check if reduced motion is enabled
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log('Prefers reduced motion:', prefersReducedMotion);
  
  // Check if mobile
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  console.log('Is mobile device:', isMobile);
  
  // Try to manually create a cursor follower for testing
  console.log('\n🧪 Creating test cursor follower...');
  
  const testCursor = document.createElement('div');
  testCursor.id = 'test-cursor';
  testCursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
  `;
  
  document.body.appendChild(testCursor);
  
  console.log('Test cursor created. You should see a red dot in the center.');
  
  // Test mouse tracking
  let mouseX = 0, mouseY = 0;
  
  function updateTestCursor(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    testCursor.style.left = mouseX + 'px';
    testCursor.style.top = mouseY + 'px';
  }
  
  document.addEventListener('mousemove', updateTestCursor);
  
  console.log('Move your mouse - the red dot should follow it.');
  
  // Clean up after 10 seconds
  setTimeout(() => {
    document.removeEventListener('mousemove', updateTestCursor);
    testCursor.remove();
    console.log('Test cursor removed.');
  }, 10000);
  
})();
