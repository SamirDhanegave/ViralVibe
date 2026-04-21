import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Zap, RotateCcw, Flame, CheckCircle2 } from "lucide-react";
import { generateViralHooks } from "./services/gemini";
import { ViralContent, GenerationState } from "./types";
import LoadingExperience from "./components/LoadingExperience";
import ResultsSection from "./components/ResultsSection";
import ShareModal from "./components/ShareModal";

const PLACEHOLDERS = [
  "Gym motivation reel",
  "Startup founder advice",
  "Minimal desk setup",
  "Healthy smoothie recipe",
  "Solo travel tips",
  "productivity hacks",
];

export default function App() {
  const [topic, setTopic] = useState("");
  const [state, setState] = useState<GenerationState>('idle');
  const [results, setResults] = useState<ViralContent | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [shareData, setShareData] = useState<{ isOpen: boolean; content: string }>({ isOpen: false, content: "" });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedStreak = localStorage.getItem('viral_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setState('loading');
    setResults(null);
    
    try {
      const data = await generateViralHooks(topic);
      setResults(data);
      setState('success');
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('viral_streak', newStreak.toString());
    } catch (error) {
      console.error(error);
      setState('error');
    }
  };

  const handleRemix = () => {
    handleGenerate();
  };

  const handleShare = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Viral Vibe Hook',
        text: content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      setShareData({ isOpen: true, content });
    }
  };

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[200] glass px-6 py-4 rounded-2xl flex items-center gap-3 border shadow-2xl border-brand-accent/20"
          >
            <CheckCircle2 className="w-5 h-5 text-brand-accent shadow-[0_0_10px_var(--color-brand-accent)]" />
            <span className="font-bold text-sm tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareModal 
        isOpen={shareData.isOpen} 
        content={shareData.content} 
        onClose={() => setShareData(prev => ({ ...prev, isOpen: false }))}
        onCopy={() => showToast("COPIED. READY TO PASTE.")}
      />

      {/* Rail Text */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 rail-text opacity-40 hidden lg:block">
        CREATOR ENGINE V2.0 // BY VIRALVIBE.AI
      </div>

      <main className="flex-1 flex flex-col p-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-black tracking-tighter italic"
            onClick={() => { setState('idle'); setResults(null); setTopic(''); }}
            style={{ cursor: 'pointer' }}
          >
            VIRALVIBE<span className="text-brand-accent">_</span>
          </motion.div>

          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="streak-counter"
            >
              <span className="text-brand-fire">▲</span> {streak} DAY STREAK
            </motion.div>
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center font-mono text-xs opacity-60">
              VV
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {state === 'idle' || state === 'error' ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex flex-col justify-center items-center gap-12"
            >
              <div className="w-full max-w-3xl space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-center leading-[0.9] uppercase">
                  YOUR NEXT <span className="text-stroke">VIRAL MOMENT</span><br/>STARTS RIGHT HERE.
                </h1>
                
                <div className="relative mt-12 group">
                  <input
                    ref={inputRef}
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder={PLACEHOLDERS[placeholderIndex]}
                    className="w-full bg-transparent border-b-2 border-white/10 focus:border-brand-accent outline-none text-2xl md:text-3xl py-6 font-light transition-all placeholder:text-white/20"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={!topic.trim()}
                    className="absolute right-0 bottom-6 bg-brand-accent text-black px-8 py-3 rounded-full font-bold text-sm tracking-tight hover:scale-105 transition-transform disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    GENERATE HOOKS
                  </button>
                </div>
              </div>

              {state === 'error' && (
                <p className="text-brand-fire text-sm font-mono tracking-widest uppercase">System update required. Retry.</p>
              )}

              <div className="flex gap-8 text-[10px] text-white/20 uppercase tracking-widest mt-12">
                <span>© 2026 LABS</span>
                <span>SYSTEM STATUS: OPTIMAL</span>
                <span>VERSION: 4.2.0-ALFA</span>
              </div>
            </motion.div>
          ) : null}

          {state === 'loading' ? (
            <motion.div key="loading" exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center">
              <LoadingExperience />
            </motion.div>
          ) : null}

          {state === 'success' && results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto custom-scrollbar pr-2"
            >
              <div className="flex justify-between items-end mb-12 pb-6 border-b border-white/5">
                <div className="space-y-1">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">Active Engine</div>
                  <div className="text-2xl font-display font-medium text-white/90 italic tracking-tight">"{topic}"_</div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setState('idle'); setResults(null); }}
                    className="text-[10px] text-white/40 uppercase font-bold tracking-widest hover:text-white transition-colors"
                  >
                    Reset Engine
                  </button>
                  <button
                    onClick={handleRemix}
                    className="text-[10px] text-brand-accent uppercase font-bold tracking-widest hover:brightness-110 transition-all"
                  >
                    Remix Results
                  </button>
                </div>
              </div>
              <ResultsSection 
                data={results} 
                onShare={handleShare}
                onToast={showToast}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Sparkles icon for the remix button (using Lucide's Sparkles is fine, but let's just use it consistently)
function Sparkles({ className, fill }: { className?: string, fill?: string }) {
  return <Zap className={className} fill={fill} />;
}
