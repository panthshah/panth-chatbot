import { addPropertyControls, ControlType } from "framer"
import { useState, useRef, useEffect } from 'react'

interface ChatMessage {
  user: string
  bot: string
}

interface Position {
  x: number
  y: number
}

interface Props {
  apiEndpoint: string
  buttonColor: string
  headerGradient: string
  welcomeMessage: string
}

export default function FramerChatbot({
  apiEndpoint = "https://your-deployed-url.vercel.app/api/chat",
  buttonColor = "#374151",
  headerGradient = "linear-gradient(135deg, #374151 0%, #4B5563 100%)",
  welcomeMessage = "Hi there! I'm Panth's AI assistant. Ask me about his experience, skills, projects, or anything else!"
}: Props) {
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 0, y: 50 })
  const [sidebarPosition, setSidebarPosition] = useState<Position>({ x: 0, y: 50 })
  const [isDraggingButton, setIsDraggingButton] = useState(false)
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  
  const chatButtonRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Set initial positions after component mounts
  useEffect(() => {
    const updatePosition = () => {
      setButtonPosition({ x: window.innerWidth - 100, y: 50 })
      setSidebarPosition({ x: window.innerWidth - 420, y: 50 })
    }
    
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  async function sendMessage() {
    if (!message.trim()) return
    
    setIsLoading(true)
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      const data = await res.json()
      setHistory([...history, { user: message, bot: data.reply }])
      setMessage('')
    } catch (error) {
      console.error('Error:', error)
      setHistory([...history, { user: message, bot: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  // Button drag functionality
  const handleButtonMouseDown = (e: React.MouseEvent) => {
    if (!chatButtonRef.current) return
    
    const rect = chatButtonRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDraggingButton(true)
  }

  // Sidebar drag functionality
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    if (!sidebarRef.current) return
    
    const rect = sidebarRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDraggingSidebar(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingButton) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      setButtonPosition({ x: newX, y: newY })
      // Update sidebar position to stay near button
      setSidebarPosition({ x: newX - 320, y: newY })
    } else if (isDraggingSidebar) {
      setSidebarPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDraggingButton(false)
    setIsDraggingSidebar(false)
  }

  const toggleChat = () => {
    if (!isOpen) {
      // Position sidebar next to button when opening
      setSidebarPosition({ 
        x: buttonPosition.x - 320, 
        y: buttonPosition.y 
      })
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isDraggingButton || isDraggingSidebar) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingButton, isDraggingSidebar, dragOffset])

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
      >
        <button
          onClick={toggleChat}
          style={{
            background: buttonColor,
            cursor: isDraggingButton ? 'grabbing' : 'pointer',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (!isDraggingButton) {
              e.currentTarget.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isDraggingButton) {
              e.currentTarget.style.transform = 'scale(1)'
            }
          }}
        >
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#34d399',
            borderRadius: '50%'
          }}></div>
          <span style={{ fontWeight: '500' }}>Chat</span>
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
            height: '500px',
            backgroundColor: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            borderRadius: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Draggable Header */}
          <div 
            style={{
              background: headerGradient,
              color: 'white',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: isDraggingSidebar ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleSidebarMouseDown}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#34d399',
                borderRadius: '50%'
              }}></div>
              <div>
                <h3 style={{ margin: 0, fontWeight: '600' }}>Panth's AI Assistant</h3>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                  Ask me anything about Panth!
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {history.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👋</div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#374151' }}>Hi there!</h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                    {welcomeMessage}
                  </p>
                </div>
              </div>
            )}
            
            {history.map((chat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* User Message */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    backgroundColor: '#374151',
                    color: 'white',
                    borderRadius: '1rem 1rem 0.25rem 1rem',
                    padding: '0.5rem 1rem',
                    maxWidth: '18rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}>
                    {chat.user}
                  </div>
                </div>
                
                {/* Bot Message */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '1rem 1rem 1rem 0.25rem',
                    padding: '0.5rem 1rem',
                    maxWidth: '18rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                  }}>
                    {chat.bot}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Animation */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '1rem 1rem 1rem 0.25rem',
                  padding: '0.5rem 1rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite 0.1s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite 0.2s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  outline: 'none',
                  fontSize: '0.875rem'
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Panth's experience..."
                disabled={isLoading}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6b7280'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107, 114, 128, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                style={{
                  backgroundColor: isLoading || !message.trim() ? '#d1d5db' : '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  cursor: isLoading || !message.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Usage Info */}
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              Powered by AI • Responses are generated automatically
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
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
    defaultValue: "https://your-deployed-url.vercel.app/api/chat",
    description: "Your deployed chatbot API endpoint"
  },
  buttonColor: {
    type: ControlType.Color,
    title: "Button Color",
    defaultValue: "#374151",
    description: "Color of the chat button"
  },
  headerGradient: {
    type: ControlType.String,
    title: "Header Gradient",
    defaultValue: "linear-gradient(135deg, #374151 0%, #4B5563 100%)",
    description: "CSS gradient for the chat header"
  },
  welcomeMessage: {
    type: ControlType.String,
    title: "Welcome Message",
    defaultValue: "Hi there! I'm Panth's AI assistant. Ask me about his experience, skills, projects, or anything else!",
    description: "Welcome message shown when chat opens"
  }
}) 