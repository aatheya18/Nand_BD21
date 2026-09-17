import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Bouquet, Flower, NandCharacter } from "../characters";
import { useGame } from "../state";

const CARDS = [
  { id: 0, name: "Blush Rose", color: "#FFC9DE" },
  { id: 1, name: "Lavender Bell", color: "#E3D4F5" },
  { id: 2, name: "Peach Peony", color: "#FFD9C7" },
  { id: 3, name: "Mint Daisy", color: "#C8F0DE" },
  { id: 4, name: "Sunset Marigold", color: "#F4A93B" },
  { id: 5, name: "Sky Forget-me-not", color: "#BEE3F8" },
  { id: 6, name: "Magenta Dahlia", color: "#E85A8C" },
  { id: 7, name: "Cream Tulip", color: "#FFF3DC" },
  { id: 8, name: "Dusty Lilac", color: "#C9A7D9" },
];

export function FlowerShop() {
  const { advance, setFlowers, outfit } = useGame();
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const full = picked.length >= 5;

  const pick = (id: number) => {
    if (full || picked.includes(id)) return;
    const next = [...picked, id];
    setPicked(next);
    if (next.length === 5) {
      setFlowers(next);
      window.setTimeout(() => setDone(true), 500);
      window.setTimeout(() => advance("crossfade-dreamy"), 2600);
    }
  };

  return (
    <div
      className="dreamy-scene flex items-center justify-center gap-14"
      style={{ background: "linear-gradient(150deg,#FDEFF5 0%,#EFF7F0 100%)" }}
    >
      <div className="absolute left-1/2 top-[62px] -translate-x-1/2 rounded-[999px] bg-white/80 px-7 py-2 text-[18px] font-bold soft-shadow">
        🌸 {picked.length} / 5 Picked
      </div>

      <div className="grid grid-cols-3 gap-5">
        {CARDS.map((c) => {
          const isPicked = picked.includes(c.id);
          const greyed = full && !isPicked;
          return (
            <motion.button
              key={c.id}
              onClick={() => pick(c.id)}
              whileHover={greyed || isPicked ? {} : { y: -8, scale: 1.04 }}
              whileTap={greyed || isPicked ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              className="flex h-[152px] w-[152px] flex-col items-center justify-center gap-2 rounded-[26px] bg-white/85 soft-shadow"
              style={{
                outline: isPicked ? "3px solid #E85A8C" : "3px solid transparent",
                opacity: greyed ? 0.38 : 1,
                filter: isPicked ? "drop-shadow(0 0 14px #FFC9DE)" : "none",
              }}
            >
              <svg viewBox="-30 -30 60 60" width="72" height="72">
                <Flower color={c.color} size={2.2} />
              </svg>
              <span className="text-[13px] font-semibold opacity-75">{c.name}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="relative flex flex-col items-center">
        <NandCharacter outfit={outfit} width={250} />
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="absolute bottom-[100px] right-[6px]"
            >
              <Bouquet width={140} />
              <span className="mt-1 block text-center font-script text-[28px] text-magenta-sunset">
                Dreamy Bouquet!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
