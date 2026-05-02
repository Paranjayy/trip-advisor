import { useVibe } from "@/lib/vibe-context";
import { motion, AnimatePresence } from "framer-motion";

const VIBE_COLORS: Record<string, string> = {
  rain: "rgba(96, 165, 250, 0.08)",
  waves: "rgba(34, 211, 238, 0.08)",
  cafe: "rgba(251, 146, 60, 0.08)",
  zen: "rgba(168, 85, 247, 0.08)",
};

export function VibePulse() {
  const { activeVibe, isPlaying } = useVibe();

  return (
    <AnimatePresence>
      {activeVibe && isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-[20%] -left-[10%] w-[120%] h-[140%] blur-[120px] rounded-full"
            style={{ backgroundColor: VIBE_COLORS[activeVibe] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
