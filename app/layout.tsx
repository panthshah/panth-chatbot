import './globals.css'

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
      <body>{children}</body>
    </html>
  )
} 