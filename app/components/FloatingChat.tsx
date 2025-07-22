'use client';
import { useState } from 'react';

interface ChatMessage {
  user: string;
  bot: string;
}

export default function FloatingChat() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
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

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Open chat with Panth's AI assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Ask me about Panth!
        </div>
      </button>

      {/* Floating Chat Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="bg-black bg-opacity-50 flex-1" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Panel */}
          <div className="bg-white w-96 h-full shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Panth's AI Assistant</h3>
                <p className="text-blue-100 text-sm">Ask me anything about Panth!</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors rounded-full p-1 hover:bg-white hover:bg-opacity-20"
                aria-label="Close chat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {history.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="text-4xl mb-2">👋</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Hi there!</h4>
                    <p className="text-gray-600 text-sm">
                      I'm Panth's AI assistant. Ask me about his experience, skills, projects, or anything else!
                    </p>
                  </div>
                </div>
              )}
              
              {history.map((chat, i) => (
                <div key={i} className="space-y-3">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-xs shadow-sm">
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
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Panth's experience..."
                  disabled={isLoading}
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full px-4 py-2 transition-colors shadow-sm"
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
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
} 