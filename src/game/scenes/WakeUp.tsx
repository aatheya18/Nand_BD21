import { motion } from "motion/react";
import { useState } from "react";
import { NandCharacter } from "../characters";
import { useGame } from "../state";

export function WakeUp() {
  const { advance } = useGame();
  const [awake, setAwake] = useState(false);

  const wake = () => {
    if (awake) return;
    setAwake(true);
    window.setTimeout(() => advance("crossfade-dreamy"), 1500);
  };

  return (
    <button
      onClick={wake}
      className="dreamy-scene block cursor-pointer text-left"
      style={{ background: "linear-gradient(180deg, #FBE3D2 0%, #F3DCE9 55%, #E9D7EF 100%)" }}
      aria-label="Wake up"
    >
      {/* window with dawn light */}
      <div className="absolute left-[14%] top-[12%] h-[300px] w-[320px] rounded-[24px] border-[10px] border-[#EFE0D2] bg-gradient-to-b from-[#FFE7C7] to-[#FFD3DE] soft-shadow">
        <div className="absolute left-1/2 top-0 h-full w-[8px] -translate-x-1/2 bg-[#EFE0D2]" />
        <div className="absolute left-0 top-1/2 h-[8px] w-full -translate-y-1/2 bg-[#EFE0D2]" />
        <div className="absolute bottom-8 left-8 h-16 w-16 rounded-full bg-[#FFE8A8] blur-[2px]" />
      </div>
      <motion.div
        className="absolute left-[10%] top-[10%] h-[420px] w-[520px] rounded-full bg-[#FFF3D6]"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ filter: "blur(60px)" }}
      />

      {/* bed */}
      <div className="absolute bottom-0 left-1/2 h-[220px] w-[760px] -translate-x-1/2 rounded-t-[40px] bg-[#EBD9E7]" />
      <div className="absolute bottom-[150px] left-1/2 h-[90px] w-[820px] -translate-x-1/2 rounded-[36px] bg-[#F7E6EE] soft-shadow" />
      <div className="absolute bottom-[210px] left-[calc(50%-320px)] h-[90px] w-[190px] rounded-[28px] bg-white/80" />

      <motion.div
        className="absolute bottom-[190px] left-1/2 -translate-x-1/2"
        animate={awake ? { y: -40, rotate: 0 } : { y: 60, rotate: -78 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      >
        <NandCharacter pose={awake ? "sitting" : "sleeping"} width={230} />
      </motion.div>

      {!awake && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1] }}
          transition={{ delay: 1, duration: 3, repeat: Infinity }}
          className="absolute bottom-[70px] left-1/2 -translate-x-1/2 rounded-[999px] bg-white/80 px-8 py-3 text-[18px] font-semibold soft-shadow"
        >
          Click to wake up ☀️
        </motion.div>
      )}
      {awake && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: -10 }}
          className="absolute bottom-[430px] left-[calc(50%+90px)] font-script text-[40px] text-slate-ink/60"
        >
          yaaawn…
        </motion.div>
      )}
    </button>
  );
}
