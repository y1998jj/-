import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { getArchitecturalInsight } from './services/geminiService';

const App: React.FC = () => {
  const [insight, setInsight] = useState<{title: string, description: string, features: string[]} | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [fov, setFov] = useState(45);
  const [showLines, setShowLines] = useState(true);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleGenerateInsight = async () => {
    setLoadingAI(true);
    try {
      const data = await getArchitecturalInsight();
      setInsight(data);
    } catch (e) {
      console.error("Failed to fetch insight", e);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#f0f0f0] text-gray-900 overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* 3D Viewport */}
      <div className="absolute inset-0 z-0">
        <Scene 
          fov={fov} 
          showLines={showLines}
          transformMode={transformMode}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>

      {/* Simplified UI Layer */}
      
      {/* AI Button - Minimal Floating Element */}
      <div className="absolute top-6 right-6 z-10 flex flex-col items-end gap-2">
          <button 
            onClick={handleGenerateInsight}
            disabled={loadingAI}
            className="group bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm text-sm text-gray-700 hover:text-cyan-600 transition-all disabled:opacity-50"
          >
             {loadingAI ? 'Analyzing...' : 'AI Design Insight'}
          </button>
      </div>

      {/* Edit Mode Instructions / Status */}
      {selectedId && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 animate-fade-in-up">
           <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 px-4 py-2 rounded-full shadow-sm text-xs font-medium text-gray-600">
              Editing: <span className="text-cyan-600 uppercase">{selectedId === 'main' ? 'Main Villa' : 'Annex'}</span>
           </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-2xl flex flex-wrap justify-center gap-4 px-4">
          
          {/* Tools Group */}
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 px-4 py-3 rounded-full shadow-sm flex items-center gap-4">
             {/* Show Lines Toggle */}
             <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showLines} 
                  onChange={(e) => setShowLines(e.target.checked)}
                  className="w-4 h-4 accent-cyan-600"
                />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Guides</span>
             </label>

             <div className="w-px h-4 bg-gray-300 mx-1"></div>

             {/* Transform Mode Switch */}
             <div className="flex bg-gray-200 rounded-lg p-1">
                <button 
                  onClick={() => setTransformMode('translate')}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${transformMode === 'translate' ? 'bg-white shadow-sm text-cyan-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Move
                </button>
                <button 
                  onClick={() => setTransformMode('rotate')}
                   className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${transformMode === 'rotate' ? 'bg-white shadow-sm text-cyan-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Rotate
                </button>
             </div>
          </div>

          {/* Camera Group */}
          <div className="flex gap-4">
            {/* FOV Slider */}
            <div className="w-64 bg-white/80 backdrop-blur-md border border-gray-200/50 px-4 py-3 rounded-full shadow-sm flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-8">Zoom</span>
              <input 
                type="range" 
                min="15" 
                max="100" 
                value={fov} 
                onChange={(e) => setFov(Number(e.target.value))} 
                className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-800"
              />
            </div>
          </div>

      </div>

      {/* AI Insight Modal */}
      {insight && (
        <div className="absolute top-20 right-6 z-20 w-80 animate-fade-in-up">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-5 rounded-xl shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-gray-800 leading-tight">{insight.title}</h2>
              <button onClick={() => setInsight(null)} className="text-gray-400 hover:text-gray-800">✕</button>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed mb-3">{insight.description}</p>
            <ul className="space-y-1">
                {insight.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    {feature}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;