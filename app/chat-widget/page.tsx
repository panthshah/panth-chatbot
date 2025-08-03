'use client';

export default function ChatWidgetPage() {
  const widgetCode = `
<!-- Panth's AI Chat Widget -->
<script>
(function() {
  // Only load once
  if (window.panthChatLoaded) return;
  window.panthChatLoaded = true;

  // Create chat widget HTML
  const widgetHTML = \`
    <div id="panth-chat-widget">
      <!-- Floating Chat Button -->
      <div id="chat-button" style="
        position: fixed;
        top: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
        border-radius: 50%;
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
      ">
        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>

      <!-- Chat Popup (hidden initially) -->
      <div id="chat-popup" style="
        position: fixed;
        top: 90px;
        right: 20px;
        width: 380px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        z-index: 10000;
        display: none;
        flex-direction: column;
        overflow: hidden;
      ">
        <!-- Draggable Header -->
        <div id="chat-header" style="
          background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
          color: white;
          padding: 16px;
          cursor: move;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 8px; height: 8px; background: #34d399; border-radius: 50%;"></div>
            <div>
              <div style="font-weight: 600; font-size: 14px;">Panth's AI Assistant</div>
              <div style="font-size: 12px; opacity: 0.8;">Ask me anything!</div>
            </div>
          </div>
          <button id="close-chat" style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
          ">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Chat Content -->
        <iframe 
          src="${typeof window !== 'undefined' ? window.location.origin : ''}/iframe-chat"
          style="
            flex: 1;
            border: none;
            width: 100%;
          "
        ></iframe>
      </div>
    </div>
  \`;

  // Add widget to page
  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // Get elements
  const chatButton = document.getElementById('chat-button');
  const chatPopup = document.getElementById('chat-popup');
  const chatHeader = document.getElementById('chat-header');
  const closeButton = document.getElementById('close-chat');

  let isOpen = false;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let originalPosition = { top: 90, right: 20 };

  // Button hover effects
  chatButton.addEventListener('mouseenter', () => {
    if (!isOpen) chatButton.style.transform = 'scale(1.1)';
  });

  chatButton.addEventListener('mouseleave', () => {
    if (!isOpen) chatButton.style.transform = 'scale(1)';
  });

  // Open chat
  function openChat() {
    isOpen = true;
    chatPopup.style.display = 'flex';
    chatButton.style.opacity = '0.7';
    
    // Reset to original position
    chatPopup.style.top = originalPosition.top + 'px';
    chatPopup.style.right = originalPosition.right + 'px';
    chatPopup.style.left = 'auto';
    chatPopup.style.bottom = 'auto';
  }

  // Close chat
  function closeChat() {
    isOpen = false;
    chatPopup.style.display = 'none';
    chatButton.style.opacity = '1';
    chatButton.style.transform = 'scale(1)';
  }

  // Drag functionality
  function startDrag(e) {
    isDragging = true;
    const rect = chatPopup.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    chatHeader.style.cursor = 'grabbing';
  }

  function drag(e) {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    // Keep within viewport
    const maxX = window.innerWidth - chatPopup.offsetWidth;
    const maxY = window.innerHeight - chatPopup.offsetHeight;
    
    const constrainedX = Math.max(0, Math.min(x, maxX));
    const constrainedY = Math.max(0, Math.min(y, maxY));
    
    chatPopup.style.left = constrainedX + 'px';
    chatPopup.style.top = constrainedY + 'px';
    chatPopup.style.right = 'auto';
    chatPopup.style.bottom = 'auto';
  }

  function stopDrag() {
    isDragging = false;
    chatHeader.style.cursor = 'move';
  }

  // Event listeners
  chatButton.addEventListener('click', openChat);
  closeButton.addEventListener('click', closeChat);
  
  chatHeader.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);

  // Prevent text selection while dragging
  chatHeader.addEventListener('selectstart', (e) => e.preventDefault());
})();
</script>`;

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      padding: '20px', 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          🎯 Panth's Chat Widget Code
        </h1>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Copy this code and paste it into any website or Framer embed component:
        </p>

        <div style={{
          backgroundColor: '#2d3748',
          color: '#e2e8f0',
          padding: '20px',
          borderRadius: '6px',
          overflow: 'auto',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {widgetCode}
          </pre>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
          <h3 style={{ color: '#166534', margin: '0 0 10px 0' }}>✅ Features:</h3>
          <ul style={{ color: '#166534', margin: 0 }}>
            <li>Floating chat button in top-right corner</li>
            <li>Click to open draggable chat popup</li>
            <li>Drag anywhere on screen</li>
            <li>Closes back to original position</li>
            <li>Responsive and mobile-friendly</li>
          </ul>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
          <h3 style={{ color: '#92400e', margin: '0 0 10px 0' }}>📋 How to Use:</h3>
          <ol style={{ color: '#92400e', margin: 0 }}>
            <li>Copy the entire code above</li>
            <li>In Framer: Add an Embed component</li>
            <li>Paste the code</li>
            <li>Publish your site!</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 