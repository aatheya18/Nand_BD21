import { motion } from "motion/react";
import { useEffect } from "react";
import { AiCharacter, NandCharacter } from "../characters";
import { useGame } from "../state";

export function Airport() {
  const { advance, outfit } = useGame();

  useEffect(() => {
    const t = window.setTimeout(() => advance("fade-through-white"), 4000);
    return () => window.clearTimeout(t);
  }, [advance]);

  return (
    <div className="dreamy-scene" style={{ background: "#E8F0F6" }}>
      {/* Background windows */}
      <div className="absolute top-[80px] left-0 w-full h-[240px] flex gap-12 px-8 opacity-40">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-full w-[200px] bg-white rounded-t-full shadow-inner" />
        ))}
      </div>
      
      {/* Moving Walkway */}
      <div className="absolute bottom-[80px] w-[120%] -left-[10%] h-[100px] bg-[#C5D0DC] shadow-[inset_0_10px_30px_rgba(0,0,0,0.1)] rounded-xl border-y-4 border-[#A3B4C9] overflow-hidden flex items-center">
        <motion.div 
          className="flex w-[200%] gap-8"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="h-[90px] w-[30px] bg-[#A3B4C9] rounded-sm opacity-50" />
          ))}
        </motion.div>
      </div>

      {/* Characters on walkway */}
      <motion.div 
        className="absolute bottom-[100px] flex gap-12"
        initial={{ left: -200 }}
        animate={{ left: "60%" }}
        transition={{ duration: 4, ease: "linear" }}
      >
        <AiCharacter pose="smiling" width={200} />
        <NandCharacter outfit={outfit} pose="idle" width={220} />
      </motion.div>
    </div>
  );
}
