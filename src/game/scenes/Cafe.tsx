import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AiCharacter, Bouquet, NandCharacter } from "../characters";
import { useGame } from "../state";
import { DialogueBubble, Modal, PillButton } from "../ui";

const LETTER = `Happy 21st birthday, my love. ❤️

Twenty one whole trips around the sun, and somehow the world still hasn't figured out how lucky it is to have you in it.

I hope this year brings you everything you've been working for, everything you've been quietly wishing for, and so many moments that make you genuinely happy. I hope you keep growing, dreaming, laughing, and becoming the person you want to be, and I hope you always remember how incredibly proud I am of you.

Thank you for being you. For all the little things you do, the conversations, the laughs, the comfort, and simply for being someone I get to have in my life. I feel so lucky to be here for another chapter of your life, and I can't wait to see where 21 takes you.

Here's to 21 and to new beginnings, stupid jokes, big dreams, little moments, and hopefully a whole lot of memories together.

Happy birthday, baby. I love you more than I know how to put into words. ❤️`;

/**
 * Beat list. Timed beats auto-advance; the candle beat waits for the hold,
 * and the final beat waits for the Continue button.
 */
const BEATS = [
  { who: "N", text: "I brought you these flowers", ms: 2600 },
  { who: "A", text: "Thank you so much, they are lovely", ms: 2800 },
  { who: "N", text: "Not more lovely than you", ms: 2600 },
  { who: "A", text: "Close your eyes now…", ms: 2600 },
  { who: "A", text: "Happy Birthday!!", ms: 3000 },
  { who: "A", text: "blow out the candles", ms: 0 },
  { who: "A", text: "I have a letter for you", ms: 0 },
  { who: "N", text: "what should we do now?", ms: 2600 },
  { who: "A", text: "let's go watch tennis", ms: 0 },
] as const;

export function Cafe() {
  const { advance, outfit } = useGame();
  const [beat, setBeat] = useState(0);
  const [hold, setHold] = useState(0);
  const [blown, setBlown] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const eyesClosed = beat === 3;
  const cakeOut = beat >= 4;

  // timed beats
  useEffect(() => {
    const ms = BEATS[beat]?.ms ?? 0;
    if (!ms) return;
    const t = window.setTimeout(() => setBeat((b) => Math.min(b + 1, BEATS.length - 1)), ms);
    return () => window.clearTimeout(t);
  }, [beat]);

  // party poppers on "Happy Birthday!!"
  useEffect(() => {
    if (beat !== 4) return;
    let cancelled = false;
    (async () => {
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled) return;
      confetti({ particleCount: 90, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: POP_COLORS });
      confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: POP_COLORS });
    })();
    return () => {
      cancelled = true;
    };
  }, [beat]);

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );

  async function finishBlow() {
    setBlown(true);
    const confetti = (await import("canvas-confetti")).default;
    confetti({ particleCount: 170, spread: 95, origin: { y: 0.6 }, colors: POP_COLORS });
    window.setTimeout(() => setBeat(6), 1400);
  }

  const start = () => {
    if (blown || beat !== 5 || timer.current) return;
    setHold(2);
    timer.current = window.setInterval(() => {
      setHold((h) => {
        const next = Math.min(h + 3, 100);
        if (next >= 100 && timer.current) {
          window.clearInterval(timer.current);
          timer.current = null;
          finishBlow();
        }
        return next;
      });
    }, 30);
  };
  const stop = () => {
    if (blown) return;
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    setHold(0);
  };

  const current = BEATS[beat]!;

  return (
    <div className="dreamy-scene" style={{ background: "linear-gradient(180deg,#F6DCEC 0%,#F2CEE4 100%)" }}>
      <CafeBackdrop />

      <div className="absolute bottom-[70px] left-1/2 z-10 flex -translate-x-1/2 items-end gap-2">
        <div className="relative">
          <NandCharacter outfit={outfit} width={250} clean={eyesClosed} />
          <motion.div
            className="absolute bottom-[120px] -left-6"
            animate={beat >= 1 ? { x: 40, y: -18, rotate: 10, opacity: beat >= 4 ? 0.9 : 1 } : { x: 0, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Bouquet width={90} />
          </motion.div>
        </div>
        <motion.div initial={{ x: 220, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.4, ease: "easeOut" }}>
          <div className="relative">
            <AiCharacter pose={cakeOut ? "serving-cake" : "smiling"} width={250} />
            <AnimatePresence>
              {cakeOut && (
                <motion.div
                  key="cake"
                  initial={{ opacity: 0, y: 40, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                  className="absolute bottom-[130px] left-[-38px] select-none"
                  onMouseDown={start}
                  onMouseUp={stop}
                  onMouseLeave={stop}
                  onTouchStart={start}
                  onTouchEnd={stop}
                  onTouchCancel={stop}
                  style={{ cursor: beat === 5 && !blown ? "pointer" : "default" }}
                >
                  <Cake blown={blown} />
                  {hold > 0 && !blown && (
                    <svg className="pointer-events-none absolute -left-6 -top-6" width="150" height="150" viewBox="0 0 150 150">
                      <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="8" />
                      <circle
                        cx="75"
                        cy="75"
                        r="62"
                        fill="none"
                        stroke="#E85A8C"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 62}
                        strokeDashoffset={2 * Math.PI * 62 * (1 - hold / 100)}
                        transform="rotate(-90 75 75)"
                      />
                    </svg>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="absolute left-1/2 top-[110px] z-20 flex -translate-x-1/2 flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          <DialogueBubble key={beat} speaker={current.who} tint={current.who === "A" ? "#FFF6FA" : "#FFF9EC"}>
            {current.text}
          </DialogueBubble>
        </AnimatePresence>
        {beat === 5 && !blown && (
          <span className="rounded-[999px] bg-white/80 px-5 py-2 text-[15px] font-semibold soft-shadow">
            Press and hold the candles
          </span>
        )}
      </div>

      {beat === 6 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.06, rotate: -2 }}
          onClick={() => setLetterOpen(true)}
          className="absolute bottom-[300px] left-[calc(50%+40px)] z-20"
          aria-label="Open the letter"
        >
          <svg viewBox="0 0 120 84" width="110">
            <rect x="2" y="2" width="116" height="80" rx="10" fill="#FFF6E3" stroke="#E0C9A6" strokeWidth="3" />
            <path d="M4 8 L60 48 L116 8" fill="none" stroke="#E0C9A6" strokeWidth="3" />
            <circle cx="60" cy="48" r="10" fill="#E85A8C" opacity="0.85" />
          </svg>
        </motion.button>
      )}

      {beat === 8 && (
        <div className="absolute bottom-[24px] left-1/2 z-30 -translate-x-1/2">
          <PillButton tint="mint" onClick={() => advance("fade-through-white")}>
            To the airport →
          </PillButton>
        </div>
      )}

      <Modal open={letterOpen} width={620} onClose={() => {
        setLetterOpen(false);
        if (beat === 6) window.setTimeout(() => setBeat(7), 500);
      }}>
        <div className="rounded-[24px] bg-[#FBF0DC] p-8" style={{ boxShadow: "inset 0 0 60px rgba(196,160,110,0.35)" }}>
          <div className="max-h-[46vh] overflow-y-auto whitespace-pre-line pr-2 font-hand text-[19px] leading-[2.1] text-[#5B4632]">
            {LETTER}
          </div>
          <div className="mt-6 flex justify-center">
            <PillButton tint="peach" onClick={() => {
              setLetterOpen(false);
              if (beat === 6) window.setTimeout(() => setBeat(7), 500);
            }}>
              Close the letter
            </PillButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const POP_COLORS = ["#FFC9DE", "#E3D4F5", "#F4A93B", "#C8F0DE", "#E85A8C"];

function Cake({ blown }: { blown: boolean }) {
  return (
    <svg viewBox="0 0 140 120" width="130">
      <ellipse cx="70" cy="108" rx="56" ry="10" fill="#E8B7CE" />
      <rect x="16" y="62" width="108" height="46" rx="12" fill="#FFF1F6" />
      <rect x="16" y="62" width="108" height="14" rx="7" fill="#FFC9DE" />
      <rect x="26" y="44" width="88" height="26" rx="10" fill="#F9E4EE" />
      {[46, 70, 94].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="24" width="6" height="22" rx="3" fill="#E3D4F5" />
          {blown ? (
            <motion.circle
              cx={x}
              cy="16"
              r="7"
              fill="#D9D4CE"
              initial={{ opacity: 0.8, y: 0 }}
              animate={{ opacity: 0, y: -26, scale: 1.8 }}
              transition={{ duration: 1 }}
            />
          ) : (
            <motion.ellipse
              cx={x}
              cy="16"
              rx="5"
              ry="9"
              fill="#F4A93B"
              animate={{ scaleY: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function CafeBackdrop() {
  return (
    <>
      {/* rainbow arch */}
      <svg className="absolute left-0 top-[60px]" width="420" height="520" viewBox="0 0 420 520">
        {["#F7C9D8", "#F6D9C4", "#F3EAC0", "#CDE8CE", "#C9DCF3", "#DDCEF0"].map((c, i) => (
          <path
            key={c}
            d={`M${20 + i * 26} 520 L${20 + i * 26} 250 A${170 - i * 26} ${170 - i * 26} 0 0 1 ${360 - i * 26} 250 L${360 - i * 26} 520`}
            fill="none"
            stroke={c}
            strokeWidth="26"
          />
        ))}
      </svg>

      {/* neon sign */}
      <div
        className="absolute left-1/2 top-[26px] -translate-x-1/2 font-script text-[52px] text-[#FF6FA5]"
        style={{ textShadow: "0 0 12px #FF9EC4, 0 0 30px #FF6FA5, 0 0 60px #FF6FA5" }}
      >
        Dreamy Delights
      </div>

      {/* cloud lights */}
      {[16, 34, 52, 70, 86].map((left, i) => (
        <motion.div
          key={left}
          className="absolute"
          style={{ left: `${left}%`, top: 120 + (i % 2) * 40 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-1 w-1 bg-white/50" />
          <div className="flex -translate-x-1/2 items-center">
            <span className="h-8 w-10 rounded-full bg-white/95" />
            <span className="-ml-4 h-11 w-14 rounded-full bg-white" style={{ boxShadow: "0 0 30px #fff" }} />
            <span className="-ml-4 h-8 w-10 rounded-full bg-white/95" />
          </div>
        </motion.div>
      ))}

      {/* counter + wall */}
      <div className="absolute bottom-0 h-[130px] w-full bg-[#E7D6C4]" />
      <div className="absolute bottom-[130px] left-[6%] h-[120px] w-[420px] rounded-t-[16px] bg-[#F3D6E2]" />
      <div className="absolute bottom-[130px] left-[6%] flex h-[120px] w-[420px] flex-wrap overflow-hidden rounded-t-[16px]">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="h-[30px] w-[42px]" style={{ background: i % 2 ? "#F7E5EC" : "#DDA9BE" }} />
        ))}
      </div>
      {/* illuminated mirror */}
      <div
        className="absolute right-[8%] top-[190px] h-[150px] w-[150px] rounded-full bg-[#FDF6F8]"
        style={{ boxShadow: "0 0 0 10px #F6D9E5, 0 0 50px rgba(255,255,255,0.9)" }}
      />
      {/* pink pill stools */}
      {[30, 46, 62].map((l) => (
        <div key={l} className="absolute bottom-[110px]" style={{ left: `${l}%` }}>
          <div className="h-6 w-24 rounded-[999px] bg-[#E9A8C0]" />
          <div className="mx-auto h-16 w-3 bg-[#D2C0A8]" />
        </div>
      ))}
    </>
  );
}
