import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, TrendingUp, Sparkles, Target, Share2 } from "lucide-react";
import { ViralContent } from "../types";

interface HookCardProps {
  content: string;
  index: number;
  type: 'hook' | 'caption' | 'angle';
  onShare: (content: string) => void;
  onToast: (msg: string) => void;
  key?: number | string;
}

function HookCard({ content, index, type, onShare, onToast }: HookCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    onToast("COPIED. PASTE IT INTO YOUR POST.");
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (type) {
      case 'hook': return <TrendingUp className="w-4 h-4 text-brand-accent" />;
      case 'caption': return <Sparkles className="w-4 h-4 text-brand-accent" />;
      case 'angle': return <Target className="w-4 h-4 text-brand-accent" />;
    }
  };

  const getBadgeText = () => {
    if (type !== 'hook') return null;
    const scores = ["98% Engagement", "95% Retention", "92% Viral Pot.", "99% Hook Rate", "96% Engagement"];
    return scores[index % scores.length];
  };

  const getTag = () => {
    const tags = ["Curiosity Gap", "Polarity Hook", "Authority/Secret", "Pattern Interrupt"];
    return tags[index % tags.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass p-6 rounded-2xl relative group overflow-hidden border-white/5 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        {getBadgeText() ? (
          <span className="viral-badge">{getBadgeText()}</span>
        ) : (
          <div className="p-2 rounded-lg bg-white/5">
            {getIcon()}
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onShare(content)}
            className="text-white/40 hover:text-brand-accent transition-colors p-1"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-lg leading-snug font-medium mb-8 italic text-white/90 pr-4">
        "{content}"
      </p>

      <div className="flex justify-between items-center gap-4">
        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold hidden sm:block">
          {getTag()}
        </span>
        
        <div className="flex-1 sm:flex-none flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all relative overflow-hidden ${
              copied 
                ? "bg-brand-accent text-black shadow-[0_0_20px_var(--color-brand-accent)]" 
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 justify-center"
                >
                  <Check className="w-3 h-3" strokeWidth={4} />
                  <span>Copied</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 justify-center"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Hook</span>
                </motion.div>
              )}
            </AnimatePresence>
            {copied && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                className="absolute inset-0 bg-white/40 rounded-full pointer-events-none"
              />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

interface ResultsSectionProps {
  data: ViralContent;
  onShare: (content: string) => void;
  onToast: (msg: string) => void;
}

export default function ResultsSection({ data, onShare, onToast }: ResultsSectionProps) {
  return (
    <div className="space-y-20 pb-20">
      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight italic">VIRAL HOOKS<span className="text-brand-accent">.</span></h2>
          <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Top performance candidates</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.hooks.map((hook, i) => (
            <HookCard key={i} content={hook} index={i} type="hook" onShare={onShare} onToast={onToast} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <div className="mb-10 flex flex-col gap-1">
            <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Caption Angles</div>
            <h2 className="text-xl font-bold italic tracking-tight">ENGAGEMENT OPTIMIZED_</h2>
          </div>
          <div className="space-y-6">
            {data.captions.map((cap, i) => (
              <HookCard key={i} content={cap} index={i} type="caption" onShare={onShare} onToast={onToast} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-10 flex flex-col gap-1">
            <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Strategic Context</div>
            <h2 className="text-xl font-bold italic tracking-tight">DYNAMIC PERSPECTIVES_</h2>
          </div>
          <div className="space-y-6">
            {data.angles.map((angle, i) => (
              <HookCard key={i} content={angle} index={i} type="angle" onShare={onShare} onToast={onToast} />
            ))}
          </div>
        </section>
      </div>

      <footer className="pt-20 flex justify-between items-center opacity-30 border-t border-white/5">
        <div className="text-[10px] uppercase font-mono tracking-widest">
          ESTIMATED REACH: HIGH // NETWORK STATUS: ACTIVE
        </div>
        <div className="flex gap-4">
          <div className="h-2 w-2 rounded-full bg-brand-accent" />
          <div className="h-2 w-2 rounded-full bg-white/20" />
          <div className="h-2 w-2 rounded-full bg-white/20" />
        </div>
      </footer>
    </div>
  );
}
