import { motion } from "motion/react";
import { NandCharacter } from "../characters";
import { PANTS, POLOS, SHOES, useGame, type Outfit } from "../state";
import { PillButton } from "../ui";

const COLUMNS: { key: keyof Outfit; title: string; items: { id: string; label: string; color: string }[] }[] = [
  { key: "polo", title: "Polos", items: POLOS },
  { key: "pants", title: "Pants", items: PANTS },
  { key: "shoes", title: "Shoes", items: SHOES },
];

export function DressUp() {
  const { outfit, setOutfit, advance } = useGame();
  const ready = outfit.polo && outfit.pants && outfit.shoes;

  return (
    <div
      className="dreamy-scene flex items-center justify-center gap-16"
      style={{ background: "linear-gradient(140deg,#F6ECFB 0%,#FFEFE4 100%)" }}
    >
      <div className="relative flex flex-col items-center">
        <h2 className="mb-2 font-script text-[46px] text-magenta-sunset">Pick today&apos;s fit</h2>
        <div className="relative rounded-[40px] bg-white/50 px-14 py-6 soft-shadow">
          <motion.div key={JSON.stringify(outfit)} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            <NandCharacter pose={ready ? "idle" : "toweled"} outfit={outfit} width={280} />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12">
        <div className="flex gap-10">
          {COLUMNS.map((col) => (
            <div key={col.key} className="flex flex-col items-center gap-4">
              <span className="font-script text-[30px] opacity-75">{col.title}</span>
              {col.items.map((item) => {
                const selected = outfit[col.key] === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setOutfit({ [col.key]: item.id } as Partial<Outfit>)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex w-[164px] items-center gap-3 rounded-[24px] bg-white/70 p-3 soft-shadow"
                    style={{ outline: selected ? "3px solid #E85A8C" : "3px solid transparent" }}
                  >
                    <span
                      className="h-10 w-10 shrink-0 rounded-[14px] border border-black/10"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-left text-[15px] font-semibold">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
        
        <PillButton tint="mint" disabled={!ready} onClick={() => advance("crossfade-dreamy")}>
          Confirm Outfit ➔
        </PillButton>
      </div>
    </div>
  );
}
