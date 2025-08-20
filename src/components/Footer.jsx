import { Heart, Code, Github, Mail, Play, Zap, Brain, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  return (
    <>
      <GifSection />
      <footer className="backdrop-blur-xl bg-gray-900/70 py-8 text-center border-t border-gray-700/30 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Code className="w-5 h-5 text-blue-400" />
            <span>Made with</span>
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            <span>by</span>
            <span className="text-cyan-400 font-semibold">Axion</span>
          </div>
          
          <div className="flex items-center gap-6 text-gray-400">
            <span>© 2025 AI Exam Generator</span>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@aiexamgenerator.com" 
                className="hover:text-cyan-400 transition-colors"
                aria-label="Contact"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>AI-powered exam generation for effective learning and assessment</p>
        </div>
      </div>
      </footer>
    </>
  );
}

function GifSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-cyan-400 animate-pulse"
            style={{
              width: Math.random() * 100 + 20 + 'px',
              height: Math.random() * 100 + 20 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 5 + 3 + 's'
            }}
          />
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            How It Works
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div 
            className={`p-6 rounded-xl border transition-all duration-500 ${
              activeFeature === 0 
                ? 'bg-gray-800/50 border-cyan-400/30 shadow-lg shadow-cyan-400/10' 
                : 'bg-gray-900/30 border-gray-700/20'
            }`}
            onMouseEnter={() => setActiveFeature(0)}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-400/10 mb-4">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Generation</h3>
            <p className="text-gray-400">
              Our advanced algorithms create unique exam questions tailored to your subject and difficulty level.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div 
            className={`p-6 rounded-xl border transition-all duration-500 ${
              activeFeature === 1 
                ? 'bg-gray-800/50 border-cyan-400/30 shadow-lg shadow-cyan-400/10' 
                : 'bg-gray-900/30 border-gray-700/20'
            }`}
            onMouseEnter={() => setActiveFeature(1)}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-400/10 mb-4">
              <Brain className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Smart Customization</h3>
            <p className="text-gray-400">
              Choose question types, difficulty, topics, and let our AI craft the perfect assessment.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div 
            className={`p-6 rounded-xl border transition-all duration-500 ${
              activeFeature === 2 
                ? 'bg-gray-800/50 border-cyan-400/30 shadow-lg shadow-cyan-400/10' 
                : 'bg-gray-900/30 border-gray-700/20'
            }`}
            onMouseEnter={() => setActiveFeature(2)}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-400/10 mb-4">
              <Clock className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Instant Results</h3>
            <p className="text-gray-400">
              Generate complete exams with answer keys in seconds, not hours. Perfect for educators.
            </p>
          </div>
        </div>
        
        {/* Animated demo area */}
        <div className="bg-gray-900 rounded-2xl border border-gray-700/30 p-2 shadow-xl">
          <div className="relative h-80 overflow-hidden rounded-xl bg-gradient-to-br from-gray-950 to-gray-900">
            {/* Mock exam generation animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-400/10 mb-6">
                  <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-cyan-400/30"></div>
                  <Play className="w-10 h-10 text-cyan-400 relative" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Generating Your Exam</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Watch as our AI creates customized questions in real-time
                </p>
              </div>
            </div>
            
            {/* Animated elements floating around */}
            <div className="absolute top-8 left-10 animate-float">
              <div className="w-12 h-16 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 text-xs font-mono">Q1</span>
              </div>
            </div>
            
            <div className="absolute bottom-16 right-12 animate-float" style={{animationDelay: '1s'}}>
              <div className="w-14 h-10 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 text-xs font-mono">Q2</span>
              </div>
            </div>
            
            <div className="absolute top-20 right-20 animate-float" style={{animationDelay: '2s'}}>
              <div className="w-16 h-12 bg-purple-500/10 rounded-lg border border-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 text-xs font-mono">Q3</span>
              </div>
            </div>
            
            {/* Progress bar animation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(activeFeature + 1) * 33}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                {activeFeature === 0 && "Analyzing subject..."}
                {activeFeature === 1 && "Generating questions..."}
                {activeFeature === 2 && "Finalizing exam..."}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}