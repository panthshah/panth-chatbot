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
            height: '560px',
            fontFamily: '"Samsung Sharp Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
          }}
          className="shadow-2xl rounded-2xl flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-white border border-slate-100"
        >
          {/* Draggable Header (minimal) */}
          <div
            className="p-3 flex items-center justify-end cursor-grab active:cursor-grabbing"
            onMouseDown={handleSidebarMouseDown}
            style={{ cursor: isDraggingSidebar ? 'grabbing' : 'grab' }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-800 transition-colors rounded-full p-1 hover:bg-slate-100"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <img src="/globe.svg" alt="Panth illustration" className="w-20 h-20 mb-5 opacity-90" />
                <h2 className="text-slate-900 tracking-tight mb-2" style={{ fontWeight: 300, fontSize: '22px' }}>
                  What’s Panth’s story?
                </h2>
                <p className="text-slate-600 mb-6" style={{ fontSize: '14px' }}>
                  I’m Panth’s AI agent and I’ll help answer anything about Panth.
                  {pathname ? ` You’re on ${pathname}.` : ''}
                </p>
                <div className="w-full">
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur rounded-full px-3 py-2 ring-1 ring-slate-200 shadow-sm">
                    <input
                      className="flex-1 bg-transparent outline-none placeholder-slate-400 text-slate-800"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about Panth…"
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !message.trim()}
                      className="rounded-full px-4 py-1.5 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                      aria-label="Send message"
                    >
                      AI
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4">
                  {history.map((chat, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-slate-900 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-[75%] shadow-sm">
                          {chat.user}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white text-slate-800 rounded-2xl rounded-bl-md px-4 py-2 max-w-[75%] shadow-sm ring-1 ring-slate-200">
                          {chat.bot}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-slate-800 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm ring-1 ring-slate-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Input Area for conversation */}
                <div className="pt-3">
                  <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-3 py-2 ring-1 ring-slate-200 shadow-sm">
                    <input
                      className="flex-1 bg-transparent outline-none placeholder-slate-400 text-slate-800"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about Panth…"
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !message.trim()}
                      className="rounded-full px-4 py-1.5 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                      aria-label="Send message"
                    >
                      AI
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-5 pb-4 text-center text-[11px] text-slate-400">Powered by AI • Responses may be generated</div>
        </div>
      )}
    </>
  );
} 