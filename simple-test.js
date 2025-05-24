/**
 * Simple Test for Cursor Follower
 * Run this in browser console to check if cursor follower is working
 */

(function() {
  console.log('🎯 Simple Cursor Follower Test');
  console.log('==============================');
  
  // Check if cursor follower exists
  const cursor = document.querySelector('div[style*="position: fixed"]');
  console.log('Cursor follower element found:', !!cursor);
  
  if (cursor) {
    console.log('✅ Cursor follower is rendered!');
    console.log('Element details:', {
      position: cursor.style.position,
      zIndex: cursor.style.zIndex,
      pointerEvents: cursor.style.pointerEvents
    });
  } else {
    console.log('❌ Cursor follower not found');
  }
  
  // Check if React component is mounted
  const reactRoot = document.getElementById('root');
  if (reactRoot) {
    console.log('✅ React app is mounted');
  }
  
  // Test mouse movement
  console.log('\n🖱️ Testing mouse movement...');
  
  const event = new MouseEvent('mousemove', {
    clientX: 300,
    clientY: 200,
    bubbles: true
  });
  
  document.dispatchEvent(event);
  
  setTimeout(() => {
    const cursorAfter = document.querySelector('div[style*="position: fixed"]');
    if (cursorAfter) {
      console.log('✅ Cursor follower responded to mouse movement');
      console.log('Position:', cursorAfter.style.left, cursorAfter.style.top);
    } else {
      console.log('❌ No response to mouse movement');
    }
  }, 100);
  
  console.log('\n📋 Instructions:');
  console.log('1. Move your mouse around the page');
  console.log('2. Look for a blue circle following your cursor');
  console.log('3. Hover over buttons to see it grow');
  console.log('4. Both your default cursor AND the follower should be visible');
  
})();
