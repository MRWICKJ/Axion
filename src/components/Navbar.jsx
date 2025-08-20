import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, Brain } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="backdrop-blur-xl bg-gray-900/70 border-b border-gray-700/30 shadow-2xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.7)] transition-all">
            Axion
          </h1>
        </div>
        
        <nav className="flex gap-6 font-medium text-gray-300">
          <div 
            className={`flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              location.pathname === "/" 
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                : "hover:bg-gray-700/50 hover:text-cyan-300"
            }`}
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </div>
          <div 
            className={`flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              location.pathname === "/exam" 
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                : "hover:bg-gray-700/50 hover:text-cyan-300"
            }`}
            onClick={() => navigate("/exam")}
          >
            <FileText className="w-4 h-4" />
            <span>Try Exam</span>
          </div>
        </nav>
      </div>
    </header>
  );
}