/**
 * Quick Cursor Test
 * Run this in browser console to check if cursor follower is now visible
 */

(function() {
  console.log('🚀 Quick Cursor Test');
  console.log('===================');
  
  // Check if cursor follower exists
  const cursor = document.querySelector('.cursor-follower');
  console.log('Cursor follower found:', !!cursor);
  
  if (cursor) {
    const style = window.getComputedStyle(cursor);
    console.log('Cursor follower styles:');
    console.log('- Position:', style.position);
    console.log('- Left:', style.left);
    console.log('- Top:', style.top);
    console.log('- Z-index:', style.zIndex);
    console.log('- Width:', style.width);
    console.log('- Height:', style.height);
    console.log('- Transform:', style.transform);
    console.log('- Opacity:', style.opacity);
    
    // Check if it's visible on screen
    const rect = cursor.getBoundingClientRect();
    console.log('Position on screen:', {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    });
    
    // Check children
    const children = cursor.children;
    console.log('Children count:', children.length);
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childStyle = window.getComputedStyle(child);
      console.log(`Child ${i + 1}:`, {
        width: childStyle.width,
        height: childStyle.height,
        backgroundColor: childStyle.backgroundColor,
        border: childStyle.border,
        opacity: childStyle.opacity,
        visible: childStyle.opacity !== '0' && childStyle.display !== 'none'
      });
    }
    
    // Test if it moves with mouse
    console.log('\nTesting mouse movement...');
    
    const originalLeft = style.left;
    const originalTop = style.top;
    
    // Simulate mouse move
    const event = new MouseEvent('mousemove', {
      clientX: 500,
      clientY: 300,
      bubbles: true
    });
    
    document.dispatchEvent(event);
    
    setTimeout(() => {
      const newStyle = window.getComputedStyle(cursor);
      console.log('Position changed:', {
        before: { left: originalLeft, top: originalTop },
        after: { left: newStyle.left, top: newStyle.top },
        moved: originalLeft !== newStyle.left || originalTop !== newStyle.top
      });
      
      if (originalLeft !== newStyle.left || originalTop !== newStyle.top) {
        console.log('✅ Cursor follower is responding to mouse movement!');
      } else {
        console.log('❌ Cursor follower is not moving with mouse');
      }
    }, 100);
    
  } else {
    console.log('❌ Cursor follower element not found');
    console.log('Checking if component is rendering...');
    
    // Check for console logs
    console.log('Look for "CursorFollower rendering..." in the console');
  }
  
  // Summary
  setTimeout(() => {
    console.log('\n📋 Summary:');
    console.log('1. Move your mouse around the page');
    console.log('2. Look for a bright pink/green circle following your cursor');
    console.log('3. The circle should be larger now (60px outer, 20px inner)');
    console.log('4. Check the console for any error messages');
    
    if (cursor) {
      console.log('✅ Cursor follower element exists - it should be visible!');
    } else {
      console.log('❌ Cursor follower element missing - check component rendering');
    }
  }, 200);
  
})();
