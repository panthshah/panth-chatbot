import { addPropertyControls, ControlType } from "framer"
import React, { useState } from 'react'

interface ChatMessage {
  user: string;
  bot: string;
}

interface Props {
  apiEndpoint: string;
  buttonColor: string;
  headerGradient: string;
  welcomeMessage: string;
}

export default function FramerChatbot(props: Props) {
  const {
    apiEndpoint = "/api/chat",
    buttonColor = "#2563eb",
    headerGradient = "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    welcomeMessage = "Hi! Ask me anything about Panth's experience, skills, or projects!"
  } = props

  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(apiEndpoint, {
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
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: buttonColor,
          color: 'white',
          borderRadius: '50%',
          padding: '16px',
          border: 'none',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Sidebar */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1001,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          {/* Backdrop */}
          <div 
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              flex: 1
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Panel */}
          <div style={{
            backgroundColor: 'white',
            width: '384px',
            height: '100vh',
            boxShadow: '-10px 0 25px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            {/* Header */}
            <div style={{
              background: headerGradient,
              color: 'white',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: '600' }}>Panth's AI Assistant</h3>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Ask me anything about Panth!</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '8px',
                  cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              backgroundColor: '#f9fafb'
            }}>
              {history.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>👋</div>
                    <h4 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Hi there!</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      {welcomeMessage}
                    </p>
                  </div>
                </div>
              )}
              
              {history.map((chat, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  {/* User Message */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <div style={{
                      backgroundColor: buttonColor,
                      color: 'white',
                      borderRadius: '18px 18px 4px 18px',
                      padding: '12px 16px',
                      maxWidth: '280px',
                      fontSize: '14px'
                    }}>
                      {chat.user}
                    </div>
                  </div>
                  
                  {/* Bot Message */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      backgroundColor: 'white',
                      color: '#374151',
                      borderRadius: '18px 18px 18px 4px',
                      padding: '12px 16px',
                      maxWidth: '280px',
                      fontSize: '14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb'
                    }}>
                      {chat.bot}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading */}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '18px 18px 18px 4px',
                    padding: '12px 16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out' }}></div>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.16s' }}></div>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.32s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              backgroundColor: 'white',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  style={{
                    flex: 1,
                    border: '1px solid #d1d5db',
                    borderRadius: '24px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Panth's experience..."
                  disabled={isLoading}
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  style={{
                    backgroundColor: buttonColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '12px',
                    cursor: 'pointer',
                    opacity: (isLoading || !message.trim()) ? 0.5 : 1
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center',
                marginTop: '8px'
              }}>
                Powered by AI • Responses are generated automatically
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  )
}

// Framer property controls
addPropertyControls(FramerChatbot, {
  apiEndpoint: {
    type: ControlType.String,
    title: "API Endpoint",
    defaultValue: "https://your-deployed-chatbot.vercel.app/api/chat",
  },
  buttonColor: {
    type: ControlType.Color,
    title: "Button Color",
    defaultValue: "#2563eb",
  },
  headerGradient: {
    type: ControlType.String,
    title: "Header Gradient",
    defaultValue: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
  },
  welcomeMessage: {
    type: ControlType.String,
    title: "Welcome Message",
    defaultValue: "Hi! Ask me anything about Panth's experience, skills, or projects!",
  },
}) 