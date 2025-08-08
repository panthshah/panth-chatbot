import './globals.css'
import FloatingChat from './components/FloatingChat'

export const metadata = {
  title: "Panth's Portfolio AI Chatbot",
  description: 'AI chatbot for Panth Shah portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingChat />
      </body>
    </html>
  )
} 