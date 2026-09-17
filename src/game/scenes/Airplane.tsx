import { motion } from "motion/react";
import { useEffect } from "react";
import { useGame } from "../state";

export function Airplane() {
  const { advance } = useGame();

  useEffect(() => {
    const t = window.setTimeout(() => advance("fade-through-white"), 3500);
    return () => window.clearTimeout(t);
  }, [advance]);

  return (
    <div className="dreamy-scene flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, #8EB8E5 0%, #D8E6F4 100%)" }}>
      {/* Clouds moving fast */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/80"
          style={{
            top: `${10 + Math.random() * 70}%`,
            width: `${100 + Math.random() * 200}px`,
            height: `${40 + Math.random() * 60}px`,
            filter: "blur(10px)",
          }}
          initial={{ right: -400 }}
          animate={{ right: "120%" }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Airplane */}
      <motion.svg
        viewBox="0 0 400 200"
        width="300"
        initial={{ x: -600, y: 100, rotate: -5 }}
        animate={{ x: 600, y: -200, rotate: -15 }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
      >
        <path d="M50 120 Q150 120 300 100 Q360 90 380 95 Q400 100 380 115 Q300 150 100 150 Z" fill="#F0F4F8" />
        <path d="M200 110 L280 40 L300 45 L250 105 Z" fill="#D0DEEB" />
        <path d="M180 140 L240 190 L260 185 L220 130 Z" fill="#A8C0D8" />
        <path d="M50 120 L20 80 L35 75 L70 120 Z" fill="#F0F4F8" />
        <circle cx="280" cy="115" r="8" fill="#3B82F6" />
        <circle cx="250" cy="120" r="8" fill="#3B82F6" />
        <circle cx="220" cy="125" r="8" fill="#3B82F6" />
        <circle cx="190" cy="130" r="8" fill="#3B82F6" />
      </motion.svg>
    </div>
  );
}
