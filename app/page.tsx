import FloatingChat from './components/FloatingChat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Just the floating chat component - no other content */}
      <FloatingChat />
    </div>
  );
}
