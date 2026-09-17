import { motion } from "motion/react";
import { useEffect } from "react";
import { useGame } from "../state";
import { DialogueBubble } from "../ui";

/** After tennis: the drive up into the hills, chasing the last of the light. */
export function HillDrive() {
  const { advance } = useGame();

  useEffect(() => {
    const t = window.setTimeout(() => advance("fade-through-white"), 7200);
    return () => window.clearTimeout(t);
  }, [advance]);

  return (
    <div
      className="dreamy-scene"
      style={{ background: "linear-gradient(180deg,#8FBEE0 0%,#F6D6BE 55%,#FFD9A0 100%)" }}
    >
      {/* low afternoon sun */}
      <motion.div
        className="absolute right-[16%] top-[16%] h-[120px] w-[120px] rounded-full bg-[#FFE9A8]"
        animate={{ y: [0, 26, 0], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 110px 50px rgba(255,220,150,0.55)" }}
      />

      {/* clouds */}
      {[
        { top: 70, size: 200, dur: 44 },
        { top: 150, size: 130, dur: 58 },
        { top: 34, size: 260, dur: 74 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{ top: c.top, height: c.size * 0.4, width: c.size, filter: "blur(7px)" }}
          initial={{ x: 2100 }}
          animate={{ x: -400 - i * 150 }}
          transition={{ duration: c.dur, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* rolling hill layers — far ones drift slowly, near ones rush past */}
      <Hills color="#9FC7A6" y="40%" speed={26} height={340} />
      <Hills color="#7FB489" y="50%" speed={15} height={380} />
      <Hills color="#5F9871" y="60%" speed={8} height={430} />

      {/* winding road */}
      <div className="absolute bottom-0 h-[190px] w-full bg-[#C9AE8B]" />
      <div className="absolute bottom-[188px] h-[16px] w-full bg-[#4E7B54]" />
      <motion.div
        className="absolute bottom-[96px] flex w-[4000px] gap-16"
        animate={{ x: [0, -1600] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="h-2 w-16 shrink-0 rounded-full bg-white/70" />
        ))}
      </motion.div>

      {/* roadside pines whipping past */}
      {[0, 1, 2, 3].map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 80 160"
          width="90"
          className="absolute bottom-[170px]"
          initial={{ x: 1500 + i * 520 }}
          animate={{ x: -300 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear", delay: i * 1.3 }}
        >
          <rect x="35" y="110" width="10" height="46" rx="4" fill="#7A5A3C" />
          <path d="M40 6 L72 70 L8 70 Z" fill="#4E8759" />
          <path d="M40 44 L76 116 L4 116 Z" fill="#427A4D" />
        </motion.svg>
      ))}

      {/* the car, gently bobbing along the road */}
      <motion.div
        className="absolute bottom-[86px]"
        initial={{ left: -340 }}
        animate={{ left: "44%" }}
        transition={{ duration: 3.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{ y: [0, -5, 0], rotate: [-0.8, 0.8, -0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <HillCar />
        </motion.div>
      </motion.div>

      <div className="absolute left-1/2 top-[110px] flex -translate-x-1/2 flex-col items-center gap-4">
        <DialogueBubble speaker="A" tint="rgba(255,253,249,0.94)">
          Up to the hills — I know the perfect spot.
        </DialogueBubble>
      </div>
    </div>
  );
}

function Hills({ color, y, speed, height }: { color: string; y: string; speed: number; height: number }) {
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

function HillCar({ width = 340 }: { width?: number }) {
  return (
    <svg viewBox="0 0 340 150" width={width}>
      <path
        d="M18 108 q6 -40 40 -44 l32 -30 q52 -14 104 0 l32 30 q60 6 92 44 q4 22 -18 24 H32 q-18 -2 -14 -24 z"
        fill="#4B7FC4"
      />
      <path d="M96 66 l22 -22 q40 -10 78 0 l22 22 z" fill="#CFE7F7" />
      <rect x="26" y="104" width="286" height="16" rx="8" fill="#3B679F" />
      
      <g transform="translate(92, 122)">
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
          <circle cx="0" cy="0" r="24" fill="#3A3F52" />
          <circle cx="0" cy="0" r="10" fill="#E8EEF5" />
          <rect x="-2" y="-22" width="4" height="18" fill="#E8EEF5" opacity="0.7" />
        </motion.g>
      </g>

      <g transform="translate(248, 122)">
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
          <circle cx="0" cy="0" r="24" fill="#3A3F52" />
          <circle cx="0" cy="0" r="10" fill="#E8EEF5" />
          <rect x="-2" y="-22" width="4" height="18" fill="#E8EEF5" opacity="0.7" />
        </motion.g>
      </g>

      <ellipse cx="314" cy="92" rx="10" ry="7" fill="#FFE9A8" />
    </svg>
  );
}
