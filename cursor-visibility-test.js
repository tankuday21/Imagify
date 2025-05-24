/**
 * Cursor Visibility Test
 * Run this in browser console to check cursor visibility
 */

(function() {
  console.log('👁️ Cursor Visibility Test');
  console.log('=========================');
  
  // Step 1: Check if default cursor is back
  const bodyStyle = window.getComputedStyle(document.body);
  console.log('Body cursor style:', bodyStyle.cursor);
  
  if (bodyStyle.cursor === 'none') {
    console.log('❌ Default cursor is still hidden');
  } else {
    console.log('✅ Default cursor should be visible');
  }
  
  // Step 2: Check if cursor follower exists
  const cursorFollower = document.querySelector('.cursor-follower');
  console.log('Cursor follower element found:', !!cursorFollower);
  
  if (cursorFollower) {
    const style = window.getComputedStyle(cursorFollower);
    console.log('Cursor follower styles:');
    console.log('- Display:', style.display);
    console.log('- Visibility:', style.visibility);
    console.log('- Opacity:', style.opacity);
    console.log('- Position:', style.position);
    console.log('- Z-index:', style.zIndex);
    console.log('- Left:', style.left);
    console.log('- Top:', style.top);
    console.log('- Transform:', style.transform);
    
    // Check children
    const children = cursorFollower.children;
    console.log('Children count:', children.length);
    
    Array.from(children).forEach((child, index) => {
      const childStyle = window.getComputedStyle(child);
      console.log(`Child ${index + 1}:`, {
        width: childStyle.width,
        height: childStyle.height,
        backgroundColor: childStyle.backgroundColor,
        border: childStyle.border,
        opacity: childStyle.opacity,
        transform: childStyle.transform
      });
    });
    
    // Check if it's positioned correctly
    const rect = cursorFollower.getBoundingClientRect();
    console.log('Cursor follower position:', {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });
    
    if (rect.width === 0 || rect.height === 0) {
      console.log('❌ Cursor follower has no dimensions');
    } else {
      console.log('✅ Cursor follower has dimensions');
    }
    
  } else {
    console.log('❌ Cursor follower element not found');
  }
  
  // Step 3: Check console logs
  console.log('\n📝 Checking for component logs...');
  console.log('Look for "CursorFollower rendering..." in the console');
  
  // Step 4: Force a mouse move to test
  console.log('\n🖱️ Testing mouse movement...');
  
  const testEvent = new MouseEvent('mousemove', {
    clientX: 400,
    clientY: 300,
    bubbles: true
  });
  
  document.dispatchEvent(testEvent);
  
  setTimeout(() => {
    if (cursorFollower) {
      const newStyle = window.getComputedStyle(cursorFollower);
      console.log('After mouse move - Transform:', newStyle.transform);
    }
  }, 100);
  
  // Step 5: Create a test cursor if none exists
  console.log('\n🧪 Creating test cursor...');
  
  // Remove any existing test cursor
  const existingTest = document.getElementById('test-cursor-visible');
  if (existingTest) {
    existingTest.remove();
  }
  
  const testCursor = document.createElement('div');
  testCursor.id = 'test-cursor-visible';
  testCursor.style.cssText = `
    position: fixed;
    width: 30px;
    height: 30px;
    background: red;
    border: 3px solid yellow;
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
  `;
  
  document.body.appendChild(testCursor);
  
  console.log('✅ Test cursor created (red circle in center)');
  console.log('If you can see the red circle, the issue is with the cursor follower component');
  console.log('If you cannot see the red circle, there might be a broader CSS issue');
  
  // Animate test cursor to mouse
  function moveTestCursor(e) {
    testCursor.style.left = e.clientX + 'px';
    testCursor.style.top = e.clientY + 'px';
  }
  
  document.addEventListener('mousemove', moveTestCursor);
  
  // Clean up after 10 seconds
  setTimeout(() => {
    document.removeEventListener('mousemove', moveTestCursor);
    testCursor.remove();
    console.log('🧹 Test cursor removed');
  }, 10000);
  
  console.log('\n📋 Summary:');
  console.log('1. Move your mouse - you should see your default cursor');
  console.log('2. Look for a red test cursor that follows your mouse');
  console.log('3. Check if the cursor follower component is rendering');
  console.log('4. Report what you see!');
  
})();
