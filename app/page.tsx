import FloatingChat from './components/FloatingChat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Demo Portfolio Page */}
      <main className="p-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Panth Shah</h1>
        <h2 className="text-xl text-gray-600 mb-8">Product Designer & UX/UI Expert</h2>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold mb-4">About Me</h3>
          <p className="text-gray-700 leading-relaxed">
            I'm a product designer passionate about creating thoughtful, accessible, and impactful user experiences. 
            With expertise in Adobe Creative Suite, Sketch, Figma, and InVision, I focus on simplicity and user-centered design.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold mb-4">Skills & Experience</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800">Design Tools</h4>
              <p className="text-gray-600">Figma, Sketch, Adobe Creative Suite, InVision</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Specialties</h4>
              <p className="text-gray-600">Web Design, Mobile App Design, Branding, UX/UI</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Component */}
      <FloatingChat />
    </div>
  );
}
