/**
 * Simple Cursor Test
 * Run this in browser console to check if cursor is working
 */

(function() {
  console.log('🎯 Simple Cursor Test');
  console.log('====================');
  
  // Check if cursor follower exists
  const cursor = document.querySelector('.cursor-follower');
  console.log('Cursor follower found:', !!cursor);
  
  if (cursor) {
    const style = window.getComputedStyle(cursor);
    console.log('Cursor styles:');
    console.log('- Display:', style.display);
    console.log('- Visibility:', style.visibility);
    console.log('- Opacity:', style.opacity);
    console.log('- Position:', style.position);
    console.log('- Z-index:', style.zIndex);
    console.log('- Transform:', style.transform);
    
    // Check if cursor has children
    const children = cursor.children;
    console.log('Cursor children count:', children.length);
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childStyle = window.getComputedStyle(child);
      console.log(`Child ${i + 1}:`, {
        width: childStyle.width,
        height: childStyle.height,
        background: childStyle.backgroundColor,
        border: childStyle.border,
        opacity: childStyle.opacity
      });
    }
  }
  
  // Check body class
  const hasActiveClass = document.body.classList.contains('cursor-follower-active');
  console.log('Body cursor-follower-active class:', hasActiveClass);
  
  // Test mouse movement
  console.log('\nTesting mouse movement...');
  
  // Simulate mouse move
  const event = new MouseEvent('mousemove', {
    clientX: 300,
    clientY: 200,
    bubbles: true
  });
  
  document.dispatchEvent(event);
  
  setTimeout(() => {
    if (cursor) {
      const newStyle = window.getComputedStyle(cursor);
      console.log('After mouse move - Transform:', newStyle.transform);
    }
    
    console.log('\n✅ Test complete!');
    console.log('If you see the cursor follower element and it has proper styles,');
    console.log('the cursor should be visible. Try moving your mouse!');
  }, 100);
  
})();
