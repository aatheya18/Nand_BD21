import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NandCharacter } from "../characters";
import { useGame } from "../state";
import { PillButton } from "../ui";

type Step =
  | "pick-brush"
  | "pick-paste"
  | "brush-ready"
  | "brushing"
  | "spit"
  | "pick-facewash"
  | "wash-ready"
  | "washing"
  | "wipe"
  | "shower"
  | "toweled";

const SINK_STEPS: Step[] = ["pick-brush", "pick-paste", "pick-facewash", "wipe"];
const BRUSH_MS = 15000;
const WASH_MS = 12000;

export function Bathroom() {
  const { advance } = useGame();
  const [step, setStep] = useState<Step>("pick-brush");
  const [pasted, setPasted] = useState(false);
  const [foamLevel, setFoamLevel] = useState(0);
  const [faceClean, setFaceClean] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [fogged, setFogged] = useState(false);
  const ticker = useRef<number | null>(null);

  const view: "sink" | "face" | "shower" =
    step === "shower" || step === "toweled" ? "shower" : SINK_STEPS.includes(step) ? "sink" : "face";

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1400);
  };

  useEffect(
    () => () => {
      if (ticker.current) window.clearInterval(ticker.current);
    },
    [],
  );

  // brushing lasts a good while before the Spit pill appears
  useEffect(() => {
    if (step !== "brushing") return;
    const t = window.setTimeout(() => setStep("spit"), BRUSH_MS);
    return () => window.clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== "toweled") return;
    const t = window.setTimeout(() => advance("crossfade-dreamy"), 1600);
    return () => window.clearTimeout(t);
  }, [step, advance]);

  function startWashing() {
    if (ticker.current) return;
    setStep("washing");
    const started = performance.now();
    ticker.current = window.setInterval(() => {
      const p = Math.min(1, (performance.now() - started) / WASH_MS);
      setFoamLevel(p);
      if (p >= 1 && ticker.current) {
        window.clearInterval(ticker.current);
        ticker.current = null;
        flash("✓ Nice and foamy!");
        window.setTimeout(() => setStep("wipe"), 900);
      }
    }, 60);
  }

  return (
    <div
      className="dreamy-scene"
      style={{ background: "linear-gradient(180deg, #E9F4FA 0%, #F7E9F1 100%)", perspective: 1400 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -180, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {view === "sink" && <SinkView step={step} pasted={pasted} onProp={handleProp} />}
          {view === "face" && (
            <FaceView
              step={step}
              foamLevel={foamLevel}
              faceClean={faceClean}
              onBrush={() => setStep("brushing")}
              onWash={startWashing}
              onSpit={handleSpit}
            />
          )}
          {view === "shower" && <ShowerView step={step} fogged={fogged} onDoor={handleDoor} />}
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute left-1/2 top-[70px] z-30 -translate-x-1/2 text-center">
        <span className="rounded-[999px] bg-white/75 px-6 py-2 text-[16px] font-semibold soft-shadow">
          {hint(step)}
        </span>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-1/2 z-40 -translate-x-1/2 rounded-[999px] bg-mint px-6 py-2 text-[16px] font-semibold soft-shadow"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function handleProp(prop: "brush" | "paste" | "facewash" | "napkin") {
    if (prop === "brush" && step === "pick-brush") {
      flash("✓ Toothbrush!");
      setStep("pick-paste");
    } else if (prop === "paste" && step === "pick-paste") {
      setPasted(true);
      flash("✓ Brush ready!");
      window.setTimeout(() => setStep("brush-ready"), 900);
    } else if (prop === "facewash" && step === "pick-facewash") {
      flash("✓ Facewash!");
      window.setTimeout(() => setStep("wash-ready"), 500);
    } else if (prop === "napkin" && step === "wipe") {
      setFoamLevel(0);
      setFaceClean(true);
      flash("✓ Squeaky clean!");
      window.setTimeout(() => setStep("shower"), 1100);
    }
  }

  function handleSpit() {
    setPasted(false);
    flash("✓ Teeth brushed!");
    window.setTimeout(() => setStep("pick-facewash"), 800);
  }

  function handleDoor() {
    if (fogged) return;
    setFogged(true);
    window.setTimeout(() => setStep("toweled"), 1500);
  }
}

function hint(step: Step) {
  switch (step) {
    case "pick-brush":
      return "Click the toothbrush";
    case "pick-paste":
      return "Now click the toothpaste";
    case "brush-ready":
      return "Click the brush to start brushing";
    case "brushing":
      return "Brushing those pearly whites…";
    case "spit":
      return "Time to spit!";
    case "pick-facewash":
      return "Click the facewash bottle";
    case "wash-ready":
      return "Click the facewash to lather up";
    case "washing":
      return "Working up a nice foam…";
    case "wipe":
      return "Click the pink napkin";
    case "shower":
      return "Click the shower door";
    default:
      return "All fresh ✨";
  }
}

function Prop({
  active,
  onClick,
  children,
  x,
  y,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  x: number;
  y: number;
}) {
  return (
    <motion.g
      initial={{ x, y }}
      animate={active ? { filter: "drop-shadow(0 0 10px #FFC9DE)", x, y } : { filter: "none", x, y }}
      onClick={active ? onClick : undefined}
      whileHover={active ? { scale: 1.08 } : {}}
      style={{ cursor: active ? "pointer" : "default", opacity: active ? 1 : 0.55 }}
    >
      {children}
    </motion.g>
  );
}

function SinkView({
  step,
  pasted,
  onProp,
}: {
  step: Step;
  pasted: boolean;
  onProp: (p: "brush" | "paste" | "facewash" | "napkin") => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 900 520" className="h-full w-full max-w-[1200px]">
        {Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 16 }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={c * 58}
              y={r * 30}
              width="54"
              height="26"
              rx="6"
              fill={(r + c) % 2 ? "#EAF3F8" : "#F6ECF2"}
            />
          )),
        )}
        <rect x="300" y="30" width="300" height="150" rx="26" fill="#DCEEF6" stroke="#F3E3EA" strokeWidth="8" />
        <ellipse cx="380" cy="90" rx="40" ry="26" fill="#fff" opacity="0.5" />
        <rect x="60" y="320" width="780" height="160" rx="24" fill="#F7EFE7" />
        <rect x="60" y="308" width="780" height="26" rx="13" fill="#FFFDF9" />
        <ellipse cx="450" cy="360" rx="150" ry="42" fill="#EAF3F8" stroke="#FFFDF9" strokeWidth="6" />
        <rect x="438" y="292" width="24" height="40" rx="10" fill="#E6D5C3" />
        <rect x="430" y="284" width="60" height="14" rx="7" fill="#E6D5C3" />

        <Prop active={step === "pick-brush"} onClick={() => onProp("brush")} x={190} y={300}>
          <rect x="0" y="0" width="14" height="90" rx="7" fill="#8FD4E8" />
          <rect x="-2" y="-14" width="18" height="18" rx="6" fill="#FFFDF9" />
        </Prop>
        <Prop active={step === "pick-paste"} onClick={() => onProp("paste")} x={260} y={296}>
          <rect x="0" y="0" width="34" height="96" rx="14" fill="#FFC9DE" />
          <rect x="10" y="-12" width="14" height="14" rx="4" fill="#E3D4F5" />
          <circle cx="17" cy="46" r="9" fill="#FFFDF9" opacity={pasted ? 0.4 : 0.85} />
        </Prop>
        <Prop active={step === "pick-facewash"} onClick={() => onProp("facewash")} x={620} y={280}>
          <rect x="0" y="0" width="42" height="112" rx="16" fill="#C8F0DE" />
          <rect x="14" y="-16" width="14" height="18" rx="5" fill="#8FD4E8" />
          <rect x="6" y="40" width="30" height="26" rx="8" fill="#FFFDF9" opacity="0.8" />
        </Prop>
        <Prop active={step === "wipe"} onClick={() => onProp("napkin")} x={740} y={140}>
          <rect x="-6" y="-14" width="120" height="10" rx="5" fill="#E6D5C3" />
          <path d="M6 -6 q50 -8 100 0 l-6 130 q-44 12 -88 0 z" fill="#FFC9DE" />
        </Prop>
      </svg>
    </div>
  );
}

function FaceView({
  step,
  foamLevel,
  faceClean,
  onBrush,
  onWash,
  onSpit,
}: {
  step: Step;
  foamLevel: number;
  faceClean: boolean;
  onBrush: () => void;
  onWash: () => void;
  onSpit: () => void;
}) {
  const brushing = step === "brushing" || step === "spit";
  const washing = step === "washing" || step === "wipe";

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#F3E9F4,#E6F1F8)" }} />
      <div className="relative">
        <NandCharacter
          pose={brushing ? "brushing" : "idle"}
          width={340}
          teeth={brushing}
          brush={brushing}
          clean={washing && foamLevel > 0.15}
        />

        {/* toothpaste foam at the mouth */}
        {brushing && (
          <div className="pointer-events-none absolute left-[46%] top-[30%] -translate-x-1/2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                className="absolute block h-3 w-3 rounded-full bg-white"
                style={{ left: (i - 3) * 15 }}
                animate={{ y: [0, -24], opacity: [0.95, 0], scale: [0.6, 1.35] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.28 }}
              />
            ))}
          </div>
        )}

        {/* facewash foam builds up slowly */}
        {washing && foamLevel > 0 && (
          <div
            className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2"
            style={{ opacity: 0.25 + foamLevel * 0.75 }}
          >
            {[
              { x: 0, y: 0, s: 34 },
              { x: -46, y: 16, s: 26 },
              { x: 44, y: 12, s: 28 },
              { x: -26, y: 52, s: 24 },
              { x: 28, y: 56, s: 26 },
              { x: 0, y: 74, s: 22 },
            ].map((b, i) => (
              <motion.span
                key={i}
                className="absolute block rounded-full bg-white"
                style={{
                  left: b.x,
                  top: b.y,
                  width: b.s * (0.4 + foamLevel * 0.8),
                  height: b.s * (0.4 + foamLevel * 0.8),
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        )}

        {faceClean && step !== "washing" && step !== "wipe" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-6 top-8 text-[28px]"
          >
            ✨
          </motion.span>
        )}
      </div>

      {/* the object arrives in the middle of the screen and waits for a click */}
      <AnimatePresence>
        {step === "brush-ready" && (
          <CenterProp key="brush" onClick={onBrush}>
            <svg width="70" height="150" viewBox="0 0 46 110">
              <rect x="16" y="16" width="14" height="90" rx="7" fill="#8FD4E8" />
              <rect x="14" y="2" width="18" height="18" rx="6" fill="#FFFDF9" />
              <ellipse cx="23" cy="6" rx="11" ry="6" fill="#C8F0DE" />
            </svg>
          </CenterProp>
        )}
        {step === "wash-ready" && (
          <CenterProp key="wash" onClick={onWash}>
            <svg width="70" height="160" viewBox="0 0 52 120">
              <rect x="6" y="16" width="42" height="100" rx="16" fill="#C8F0DE" />
              <rect x="20" y="0" width="14" height="18" rx="5" fill="#8FD4E8" />
              <rect x="12" y="48" width="30" height="26" rx="8" fill="#FFFDF9" opacity="0.85" />
            </svg>
          </CenterProp>
        )}
      </AnimatePresence>

      {(step === "washing" || step === "brushing") && (
        <div className="absolute bottom-[70px] h-3 w-[280px] overflow-hidden rounded-[999px] bg-white/60">
          <motion.div
            className="h-full rounded-[999px] bg-magenta-sunset"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: (step === "brushing" ? BRUSH_MS : WASH_MS) / 1000, ease: "linear" }}
          />
        </div>
      )}

      {step === "spit" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-[90px] z-30">
          <PillButton tint="sky" onClick={onSpit}>
            Spit
          </PillButton>
        </motion.div>
      )}
    </div>
  );
}

function CenterProp({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1, rotate: -4 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="absolute bottom-[120px] left-1/2 z-30 -translate-x-1/2 rounded-[28px] bg-white/70 p-4 soft-shadow"
    >
      {children}
    </motion.button>
  );
}

function ShowerView({ step, fogged, onDoor }: { step: Step; fogged: boolean; onDoor: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#FFF6D9,#FDE7C9)" }} />
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="tiles" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#FFF4CF" />
            <rect x="2" y="2" width="56" height="56" rx="10" fill="#FDEBB6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tiles)" />
      </svg>

      <div className="relative z-10 flex h-[520px] w-[560px] items-end justify-center rounded-[28px] border-[10px] border-white/70 bg-white/25">
        {step === "toweled" ? <NandCharacter pose="toweled" width={250} /> : <NandCharacter width={250} />}
        <div className="absolute -top-2 left-1/2 h-10 w-10 -translate-x-1/2 rounded-b-full bg-[#DCC7A8]" />
        <motion.div
          onClick={onDoor}
          whileHover={fogged ? {} : { scale: 1.01 }}
          className="absolute inset-0 rounded-[20px] border-4 border-white/60"
          style={{
            cursor: fogged ? "default" : "pointer",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: fogged ? "blur(22px)" : "blur(2px)",
          }}
        />
        {fogged && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 font-script text-[40px] text-white"
          >
            a while later…
          </motion.span>
        )}
      </div>
    </div>
  );
}
