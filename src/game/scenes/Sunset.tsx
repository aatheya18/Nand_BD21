import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { AiCharacter, NandCharacter } from "../characters";
import { useGame } from "../state";
import { DialogueBubble, PillButton } from "../ui";

export function Sunset() {
  const { restart, outfit } = useGame();
  const [line, setLine] = useState(0);

  useEffect(() => {
    const a = window.setTimeout(() => setLine(1), 1400);
    const b = window.setTimeout(() => setLine(2), 4200);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  return (
    <div
      className="dreamy-scene"
      style={{ background: "linear-gradient(180deg,#3B2A55 0%,#8E4A78 32%,#E85A8C 60%,#F4A93B 84%,#FFD9A0 100%)" }}
    >
      {/* drifting cloud blobs */}
      {[
        { x: "8%", y: "16%", w: 520, h: 90, c: "#F7A6C4", o: 0.5, d: 46 },
        { x: "40%", y: "26%", w: 700, h: 70, c: "#FFC48A", o: 0.42, d: 62 },
        { x: "-10%", y: "34%", w: 620, h: 60, c: "#FFD6A8", o: 0.36, d: 74 },
        { x: "55%", y: "10%", w: 420, h: 70, c: "#C98BC0", o: 0.4, d: 54 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: c.x, top: c.y, width: c.w, height: c.h, background: c.c, opacity: c.o, filter: "blur(28px)" }}
          animate={{ x: [0, 90, 0] }}
          transition={{ duration: c.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* sun */}
      <motion.div
        className="absolute left-1/2 top-[46%] h-[130px] w-[130px] -translate-x-1/2 rounded-full bg-[#FFE9A8]"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{ boxShadow: "0 0 120px 60px rgba(255,215,140,0.55)" }}
      />

      {/* silhouette hills */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 460" preserveAspectRatio="none" height="62%">
        <path d="M0 260 q220 -130 440 -40 q210 88 420 -30 q240 -132 580 -20 L1440 460 L0 460 Z" fill="#4A3A55" />
        <path d="M0 340 q260 -110 520 -20 q240 84 500 -20 q220 -92 420 -10 L1440 460 L0 460 Z" fill="#332742" />
      </svg>

      {/* the two of them on the crest, blue car parked beside them */}
      <div className="absolute bottom-[150px] left-1/2 flex -translate-x-1/2 items-end gap-6">
        <div className="relative flex items-end" style={{ filter: "brightness(0.42) saturate(0.7)" }}>
          <NandCharacter outfit={outfit} pose="sitting" width={185} />
          <div
            className="-ml-[58px] -rotate-[13deg] translate-y-[30px]"
            style={{ transformOrigin: "bottom left" }}
          >
            <AiCharacter pose="leaning" width={170} />
          </div>
        </div>
        <svg viewBox="0 0 340 150" width="290" className="mb-[-8px]" style={{ filter: "brightness(0.33)" }}>
          <path d="M18 108 q6 -40 40 -44 l32 -30 q52 -14 104 0 l32 30 q60 6 92 44 q4 22 -18 24 H32 q-18 -2 -14 -24 z" fill="#4B7FC4" />
          <circle cx="92" cy="122" r="24" fill="#2A2A33" />
          <circle cx="248" cy="122" r="24" fill="#2A2A33" />
        </svg>
      </div>

      {/* foreground crest hides their feet so they read as seated on the hill */}
      <svg className="pointer-events-none absolute bottom-0 w-full" viewBox="0 0 1440 260" preserveAspectRatio="none" height="24%">
        <path d="M0 120 q300 -95 640 -40 q320 52 800 -30 L1440 260 L0 260 Z" fill="#2C2138" />
      </svg>



      <div className="absolute left-1/2 top-[100px] flex -translate-x-1/2 flex-col items-center gap-5">
        <AnimatePresence>
          {line >= 1 && (
            <DialogueBubble key="a" speaker="A" tint="rgba(255,253,249,0.92)">
              Let&apos;s watch the sunset.
            </DialogueBubble>
          )}
          {line >= 2 && (
            <DialogueBubble key="n" speaker="N" tint="rgba(255,246,234,0.92)">
              Okieee.
            </DialogueBubble>
          )}
        </AnimatePresence>
      </div>

      {line >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-6 right-8"
        >
          <PillButton tint="peach" onClick={restart}>
            Replay ↺
          </PillButton>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6 }}
        className="absolute bottom-[70px] left-1/2 -translate-x-1/2 font-script text-[38px] text-white/90"
      >
        Happy 21st, Nand ♡
      </motion.div>
    </div>
  );
}
