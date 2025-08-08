'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ChatMessage {
  user: string;
  bot: string;
}

interface Position {
  x: number;
  y: number;
}

export default function FloatingChat() {
  const pathname = usePathname();
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 0, y: 50 });
  const [sidebarPosition, setSidebarPosition] = useState<Position>({ x: 0, y: 50 });
  const [isDraggingButton, setIsDraggingButton] = useState(false);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  
  const chatButtonRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Set initial positions after component mounts
  useEffect(() => {
    setButtonPosition({ x: window.innerWidth - 100, y: 50 });
    setSidebarPosition({ x: window.innerWidth - 420, y: 50 });
  }, []);

  async function sendMessage() {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          pagePath: pathname,
          pageTitle: typeof document !== 'undefined' ? document.title : '',
          pageUrl: typeof window !== 'undefined' ? window.location.href : ''
        }),
      });

      const data = await res.json();
      setHistory([...history, { user: message, bot: data.reply }]);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setHistory([...history, { user: message, bot: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Button drag functionality
  const handleButtonMouseDown = (e: React.MouseEvent) => {
    if (!chatButtonRef.current) return;
    
    const rect = chatButtonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDraggingButton(true);
  };

  // Sidebar drag functionality
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    if (!sidebarRef.current) return;
    
    const rect = sidebarRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDraggingSidebar(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingButton) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setButtonPosition({ x: newX, y: newY });
      // Update sidebar position to stay near button
      setSidebarPosition({ x: newX - 320, y: newY });
    } else if (isDraggingSidebar) {
      setSidebarPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingButton(false);
    setIsDraggingSidebar(false);
  };

  const toggleChat = () => {
    if (!isOpen) {
      // Position sidebar next to button when opening
      setSidebarPosition({ 
        x: buttonPosition.x - 320, 
        y: buttonPosition.y 
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isDraggingButton || isDraggingSidebar) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingButton, isDraggingSidebar, dragOffset]);

  return (
    <>
      {/* Draggable Chat Button */}
      <div
        ref={chatButtonRef}
        style={{
          position: 'fixed',
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
          zIndex: 1000,
          cursor: isDraggingButton ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleButtonMouseDown}
        className="select-none"
      >
        <button
          onClick={toggleChat}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2 border border-gray-600"
          style={{ cursor: isDraggingButton ? 'grabbing' : 'pointer' }}
        >
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="font-medium">Chat</span>
        </button>
      </div>

      {/* Draggable Chat Sidebar */}
      {isOpen && (
        <div
          ref={sidebarRef}
          style={{
            position: 'fixed',
            left: `${sidebarPosition.x}px`,
            top: `${sidebarPosition.y}px`,
            zIndex: 1001,
            width: '384px',
            height: '500px'
          }}
          className="bg-white shadow-2xl rounded-lg flex flex-col overflow-hidden"
        >
          {/* Draggable Header */}
          <div 
            className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 flex justify-between items-center cursor-grab active:cursor-grabbing"
            onMouseDown={handleSidebarMouseDown}
            style={{ cursor: isDraggingSidebar ? 'grabbing' : 'grab' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div>
                <h3 className="font-semibold">Panth's AI Assistant</h3>
                <p className="text-gray-300 text-sm">Ask me anything about Panth!</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition-colors rounded-full p-1 hover:bg-white hover:bg-opacity-20"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {history.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="text-4xl mb-2">👋</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Hi there!</h4>
                  <p className="text-gray-600 text-sm">
                    I'm Panth's AI assistant. {typeof document !== 'undefined' && document.title ? `You're viewing "${document.title}".` : pathname ? `You're on ${pathname}.` : ''} Ask me anything about this page or about Panth in general.
                  </p>
                </div>
              </div>
            )}
            
            {history.map((chat, i) => (
              <div key={i} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-gray-800 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-xs shadow-sm">
                    {chat.user}
                  </div>
                </div>
                
                {/* Bot Message */}
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs shadow-sm border">
                    {chat.bot}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Animation */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="flex space-x-2">
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Panth's experience..."
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-full px-4 py-2 transition-colors shadow-sm"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Usage Info */}
            <div className="text-xs text-gray-500 mt-2 text-center">
              Powered by AI • Responses are generated automatically
            </div>
          </div>
        </div>
      )}
    </>
  );
} 