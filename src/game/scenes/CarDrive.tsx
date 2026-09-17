import { motion } from "motion/react";
import { useEffect } from "react";
import { useGame } from "../state";

export function CarDrive() {
  const { advance } = useGame();

  useEffect(() => {
    const t = window.setTimeout(() => advance("crossfade-dreamy"), 4200);
    return () => window.clearTimeout(t);
  }, [advance]);

  return (
    <div className="dreamy-scene" style={{ background: "linear-gradient(180deg,#CDEBF8 0%,#E8F6F0 62%,#D8EEC9 100%)" }}>
      {/* clouds */}
      {[
        { top: 70, size: 180, dur: 40 },
        { top: 140, size: 120, dur: 55 },
        { top: 40, size: 240, dur: 70 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/80"
          style={{ top: c.top, height: c.size * 0.42, width: c.size, filter: "blur(6px)" }}
          initial={{ x: -300 - i * 200 }}
          animate={{ x: 2200 }}
          transition={{ duration: c.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* parallax hill layers */}
      <HillLayer color="#A8CFA0" y="46%" speed={16} height={340} />
      <HillLayer color="#8CBE86" y="56%" speed={9} height={360} />
      <HillLayer color="#6FA96F" y="66%" speed={5} height={420} />

      {/* road */}
      <div className="absolute bottom-0 h-[170px] w-full bg-[#C9AE8B]" />
      <motion.div
        className="absolute bottom-[80px] flex w-[3000px] gap-16"
        animate={{ x: [0, -800] }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="h-2 w-16 shrink-0 rounded-full bg-white/70" />
        ))}
      </motion.div>

      {/* shop scrolls in from the right */}
      <motion.div
        className="absolute bottom-[150px]"
        initial={{ right: -420 }}
        animate={{ right: 120 }}
        transition={{ duration: 4, ease: "easeOut" }}
      >
        <FlowerShopFront />
      </motion.div>

      {/* the car */}
      <motion.div
        className="absolute bottom-[80px]"
        initial={{ left: -320 }}
        animate={{ left: "38%" }}
        transition={{ duration: 3.4, ease: "easeOut" }}
      >
        <BlueCar />
      </motion.div>
    </div>
  );
}

function HillLayer({ color, y, speed, height }: { color: string; y: string; speed: number; height: number }) {
  return (
    <motion.div
      className="absolute w-[2400px]"
      style={{ top: y, height }}
      animate={{ x: [0, -1200] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 2400 400" width="2400" height={height} preserveAspectRatio="none">
        <path
          d="M0 300 q200 -180 420 -80 q180 80 360 -40 q200 -130 420 -20 q190 96 380 -30 q210 -140 420 -10 L2400 400 L0 400 Z"
          fill={color}
        />
      </svg>
    </motion.div>
  );
}

export function BlueCar({ width = 340 }: { width?: number }) {
  return (
    <svg viewBox="0 0 340 150" width={width}>
      <path d="M18 108 q6 -40 40 -44 l32 -30 q52 -14 104 0 l32 30 q60 6 92 44 q4 22 -18 24 H32 q-18 -2 -14 -24 z" fill="#4B7FC4" />
      <path d="M96 66 l22 -22 q40 -10 78 0 l22 22 z" fill="#CFE7F7" />
      <rect x="26" y="104" width="286" height="16" rx="8" fill="#3B679F" />
      <circle cx="92" cy="122" r="24" fill="#3A3F52" />
      <circle cx="92" cy="122" r="10" fill="#E8EEF5" />
      <circle cx="248" cy="122" r="24" fill="#3A3F52" />
      <circle cx="248" cy="122" r="10" fill="#E8EEF5" />
      <ellipse cx="314" cy="92" rx="10" ry="7" fill="#FFE9A8" />
    </svg>
  );
}

function FlowerShopFront() {
  return (
    <svg viewBox="0 0 380 300" width="380">
      <rect x="20" y="70" width="340" height="220" rx="18" fill="#F7E9F1" />
      <path d="M6 74 L190 12 L374 74 Z" fill="#E38AAE" />
      <rect x="60" y="120" width="110" height="140" rx="12" fill="#CFE7F7" />
      <rect x="210" y="150" width="110" height="110" rx="12" fill="#CFE7F7" />
      <text x="190" y="104" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="30" fill="#8A3C61">
        Bloom &amp; Co.
      </text>
      {[70, 110, 250, 300].map((x) => (
        <g key={x} transform={`translate(${x} 262)`}>
          <rect x="-16" y="0" width="32" height="24" rx="6" fill="#E6D5C3" />
          <circle cx="-6" cy="-8" r="8" fill="#FFC9DE" />
          <circle cx="8" cy="-10" r="7" fill="#E3D4F5" />
        </g>
      ))}
    </svg>
  );
}
