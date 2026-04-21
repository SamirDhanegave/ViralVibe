import { motion, AnimatePresence } from "motion/react";
import { Instagram, Send, MessageCircle, Copy, X } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onCopy: () => void;
}

const PLATFORMS = [
  {
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
    url: "https://www.instagram.com/",
    label: "Copy & Open IG"
  },
  {
    name: "TikTok",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
      </svg>
    ),
    color: "bg-[#000000]",
    url: "https://www.tiktok.com/upload",
    label: "Copy & Open TikTok"
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-[#25D366]",
    url: "https://wa.me/?text=",
    label: "Send to WhatsApp"
  }
];

export default function ShareModal({ isOpen, onClose, content, onCopy }: ShareModalProps) {
  const handlePlatformShare = (platform: typeof PLATFORMS[0]) => {
    // 1. Auto-copy
    navigator.clipboard.writeText(content);
    onCopy();

    // 2. Open platform
    const url = platform.name === "WhatsApp" 
      ? platform.url + encodeURIComponent(content)
      : platform.url;
    
    window.open(url, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />
          <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="w-full max-w-md glass rounded-3xl p-8 pointer-events-auto overflow-hidden relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-display italic leading-none mb-1">SMART SHARE_</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Select your destination</p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-sm italic text-white/70 line-clamp-3">"{content}"</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => { navigator.clipboard.writeText(content); onCopy(); onClose(); }}
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/10 group-hover:bg-brand-accent group-hover:text-black transition-all">
                        <Copy className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm tracking-tight capitalize">Copy to Clipboard</span>
                    </div>
                  </button>

                  <div className="h-px bg-white/10 my-2" />

                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => handlePlatformShare(platform)}
                      className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group overflow-hidden relative"
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`p-3 rounded-xl ${platform.color} text-white`}>
                          <platform.icon />
                        </div>
                        <div className="text-left">
                          <span className="block font-bold text-sm tracking-tight">{platform.name}</span>
                          <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold">{platform.label}</span>
                        </div>
                      </div>
                      <Send className="w-4 h-4 text-white/20 group-hover:text-brand-accent transition-colors relative z-10" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
