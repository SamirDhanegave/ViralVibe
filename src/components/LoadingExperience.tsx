import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const STEPS = [
  "Analyzing social trends...",
  "Identifying viral patterns...",
  "Scanning engagement data...",
  "Crafting high-octane hooks...",
  "Optimizing for retention...",
  "Finalizing creative angles...",
];

export default function LoadingExperience() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-20">
      <div className="relative w-48 h-48">
        {/* Abstract animated loader */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 border-2 border-brand-cyan/20 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-4 border-2 border-brand-lime/20 rounded-full border-dashed"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="w-4 h-4 bg-brand-accent rounded-full shadow-[0_0_20px_var(--color-brand-accent)]"
          />
        </div>
      </div>

      <div className="text-center h-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-lg font-mono text-brand-accent tracking-tighter uppercase font-bold"
          >
            {STEPS[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
