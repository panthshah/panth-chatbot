'use client';
import { useState } from 'react';

interface ChatMessage {
  user: string;
  bot: string;
}

export default function IframeChatPage() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
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
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 flex items-center space-x-3">
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        <div>
          <h3 className="font-semibold">Panth's AI Assistant</h3>
          <p className="text-gray-300 text-sm">Ask me anything about Panth!</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
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
  );
} 