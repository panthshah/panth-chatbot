'use client';

export default function ChatWidgetPage() {
  const widgetCode = `
<!-- Panth's Beautiful AI Chat Widget -->
<script>
(function() {
  // Only load once
  if (window.panthChatLoaded) return;
  window.panthChatLoaded = true;

  // Create modern chat widget HTML
  const widgetHTML = \`
    <div id="panth-chat-widget">
      <!-- Floating Chat Button -->
      <div id="chat-button" style="
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        cursor: pointer;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 3px solid rgba(255, 255, 255, 0.2);
      ">
        <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>

      <!-- Professional Chat Popup -->
      <div id="chat-popup" style="
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 400px;
        height: 600px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
        z-index: 100000;
        display: none;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.8) translateY(20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(20px);
      ">
        <!-- Beautiful Header -->
        <div id="chat-header" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          cursor: grab;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20px 20px 0 0;
          user-select: none;
        ">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="
              width: 12px; 
              height: 12px; 
              background: #4ade80; 
              border-radius: 50%;
              box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.3);
              animation: pulse 2s infinite;
            "></div>
            <div>
              <div style="font-weight: 600; font-size: 16px; margin-bottom: 2px;">Panth's AI Assistant</div>
              <div style="font-size: 13px; opacity: 0.9;">Ask me anything about Panth!</div>
            </div>
          </div>
          <button id="close-chat" style="
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
          ">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Chat Content Area -->
        <div style="
          flex: 1;
          background: #fafafa;
          position: relative;
          overflow: hidden;
        ">
          <iframe 
            src="${typeof window !== 'undefined' ? window.location.origin : ''}/iframe-chat"
            style="
              width: 100%;
              height: 100%;
              border: none;
              background: transparent;
            "
          ></iframe>
        </div>
      </div>

      <!-- Custom Styles -->
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        #chat-button:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6) !important;
        }
        
        #close-chat:hover {
          background: rgba(255, 255, 255, 0.25) !important;
        }
        
        #chat-header:active {
          cursor: grabbing !important;
        }
        
        #chat-popup.show {
          transform: scale(1) translateY(0) !important;
          opacity: 1 !important;
        }
        
        @media (max-width: 480px) {
          #chat-popup {
            width: calc(100vw - 20px) !important;
            height: calc(100vh - 100px) !important;
            bottom: 10px !important;
            right: 10px !important;
            left: 10px !important;
            border-radius: 16px !important;
          }
        }
      </style>
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
  let startPos = { x: 0, y: 0 };

  // Enhanced button interactions
  chatButton.addEventListener('mouseenter', () => {
    if (!isOpen) {
      chatButton.style.transform = 'scale(1.1)';
      chatButton.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.6)';
    }
  });

  chatButton.addEventListener('mouseleave', () => {
    if (!isOpen) {
      chatButton.style.transform = 'scale(1)';
      chatButton.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.4)';
    }
  });

  // Smooth open animation
  function openChat() {
    if (isOpen) return;
    isOpen = true;
    
    chatPopup.style.display = 'flex';
    chatButton.style.opacity = '0.8';
    chatButton.style.transform = 'scale(0.9)';
    
    // Trigger animation
    setTimeout(() => {
      chatPopup.classList.add('show');
    }, 10);
  }

  // Smooth close animation
  function closeChat() {
    if (!isOpen) return;
    isOpen = false;
    
    chatPopup.classList.remove('show');
    chatButton.style.opacity = '1';
    chatButton.style.transform = 'scale(1)';
    
    setTimeout(() => {
      chatPopup.style.display = 'none';
    }, 300);
  }

  // Enhanced drag functionality
  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    
    const rect = chatPopup.getBoundingClientRect();
    startPos.x = rect.left;
    startPos.y = rect.top;
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    chatHeader.style.cursor = 'grabbing';
    chatPopup.style.transition = 'none';
    
    // Add global mouse listeners
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  }

  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    // Keep within viewport bounds
    const popup = chatPopup;
    const maxX = window.innerWidth - popup.offsetWidth;
    const maxY = window.innerHeight - popup.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
    popup.style.right = 'auto';
    popup.style.bottom = 'auto';
  }

  function stopDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    chatHeader.style.cursor = 'grab';
    chatPopup.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Remove global listeners
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  }

  // Event listeners
  chatButton.addEventListener('click', openChat);
  closeButton.addEventListener('click', closeChat);
  chatHeader.addEventListener('mousedown', startDrag);

  // Prevent text selection during drag
  chatHeader.addEventListener('selectstart', e => e.preventDefault());
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeChat();
    }
  });

  // Mobile touch support
  let touchStartPos = { x: 0, y: 0 };
  
  chatHeader.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartPos.x = touch.clientX;
    touchStartPos.y = touch.clientY;
    startDrag({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      drag({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
    }
  });
  
  document.addEventListener('touchend', stopDrag);
})();
</script>`;

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      padding: '40px 20px', 
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      lineHeight: '1.6'
    }}>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: '#1e293b', 
            marginBottom: '16px',
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ✨ Beautiful Chat Widget
          </h1>
          <p style={{ color: '#64748b', fontSize: '18px', margin: 0 }}>
            Professional floating chat widget for your Framer site
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '30px',
          borderRadius: '12px',
          overflow: 'auto',
          fontSize: '14px',
          lineHeight: '1.5',
          fontFamily: 'Monaco, "Fira Code", monospace'
        }}>
          <div style={{ marginBottom: '20px', color: '#94a3b8' }}>
            📋 Copy this code and paste it into Framer's embed component:
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {widgetCode}
          </pre>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px',
          marginTop: '32px' 
        }}>
          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f0fdf4', 
            borderRadius: '12px',
            border: '1px solid #bbf7d0'
          }}>
            <h3 style={{ color: '#166534', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              ✅ Features
            </h3>
            <ul style={{ color: '#166534', margin: 0, paddingLeft: '20px' }}>
              <li>Beautiful gradient design</li>
              <li>Smooth animations & transitions</li>
              <li>Fully draggable popup</li>
              <li>Mobile responsive</li>
              <li>Professional styling</li>
              <li>Pulse animation on status dot</li>
            </ul>
          </div>

          <div style={{ 
            padding: '24px', 
            backgroundColor: '#fef3c7', 
            borderRadius: '12px',
            border: '1px solid #fcd34d'
          }}>
            <h3 style={{ color: '#92400e', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              🚀 How to Use
            </h3>
            <ol style={{ color: '#92400e', margin: 0, paddingLeft: '20px' }}>
              <li>Copy the entire code above</li>
              <li>In Framer: Add an Embed component</li>
              <li>Paste the code</li>
              <li>Publish your site!</li>
            </ol>
          </div>
        </div>

        <div style={{ 
          marginTop: '32px', 
          padding: '24px', 
          backgroundColor: '#eff6ff', 
          borderRadius: '12px',
          border: '1px solid #bfdbfe',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#1d4ed8', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>
            💡 Pro Tip
          </h3>
          <p style={{ color: '#1d4ed8', margin: 0 }}>
            The widget appears in the bottom-right corner and is fully draggable. 
            Perfect for portfolio sites and professional presentations!
          </p>
        </div>
      </div>
    </div>
  );
} 