import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { SCENES, useGame, type TransitionKind } from "./state";
import { pop } from "@/game/audio";

const PILL_TINTS: Record<string, string> = {
  peach: "#FFD9C7",
  lavender: "#E3D4F5",
  pink: "#FFC9DE",
  sky: "#BEE3F8",
  mint: "#C8F0DE",
  cream: "#FFF6E9",
};

export function PillButton({
  children,
  onClick,
  tint = "lavender",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  tint?: keyof typeof PILL_TINTS | string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => {
        pop("click");
        onClick?.();
      }}
      disabled={!!disabled}
      whileHover={disabled ? {} : { scale: 1.05, filter: "brightness(1.04)" }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      style={{ backgroundColor: PILL_TINTS[tint] ?? tint }}
      className={`rounded-[999px] px-7 py-3 text-[17px] font-semibold tracking-wide text-slate-ink soft-shadow disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function DialogueBubble({
  children,
  speaker,
  tint = "#FFFDF9",
  className = "",
}: {
  children: ReactNode;
  speaker?: string;
  tint?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative max-w-[520px] rounded-[28px] px-8 py-5 text-center soft-shadow ${className}`}
      style={{ backgroundColor: tint }}
    >
      {speaker ? (
        <span className="mb-1 block font-script text-[22px] leading-none opacity-70">{speaker}</span>
      ) : null}
      <span className="block text-[20px] font-semibold leading-snug">{children}</span>
      <span
        className="absolute -bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 rounded-[4px]"
        style={{ backgroundColor: tint }}
      />
    </motion.div>
  );
}

export function SceneProgressDots() {
  const { sceneIndex } = useGame();
  return (
    <div className="pointer-events-none absolute left-1/2 top-5 z-40 flex -translate-x-1/2 gap-2.5">
      {SCENES.map((s, i) => (
        <motion.span
          key={s}
          animate={{
            backgroundColor: i <= sceneIndex ? "#E85A8C" : "rgba(58,63,82,0.18)",
            scale: i === sceneIndex ? 1.35 : 1,
          }}
          transition={{ duration: 0.4 }}
          className="h-2.5 w-2.5 rounded-full"
        />
      ))}
    </div>
  );
}

export function TransitionOverlay({ kind }: { kind: TransitionKind | null }) {
  return (
    <AnimatePresence>
      {kind === "fade-through-white" && (
        <motion.div
          key="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 z-50 bg-white"
        />
      )}
      {kind === "crossfade-dreamy" && (
        <motion.div
          key="dreamy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 z-50 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,217,199,0.92), rgba(227,212,245,0.92), rgba(255,201,222,0.92))",
          }}
        />
      )}
    </AnimatePresence>
  );
}

export function Modal({
  open,
  children,
  onClose,
  width = 560,
}: {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
  width?: number;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-45 flex items-center justify-center bg-slate-ink/20 backdrop-blur-md"
          onClick={() => onClose?.()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width }}
            className="rounded-[32px] border-2 border-pinky bg-[#FFFDF9] p-8 soft-shadow"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SvgGrainDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
          <feBlend in="SourceGraphic" in2="n" mode="multiply" />
        </filter>
      </defs>
    </svg>
  );
}

export function GrainOverlay({ opacity = 0.055 }: { opacity?: number }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden style={{ opacity }}>
      <filter id="grainTex">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grainTex)" />
    </svg>
  );
}
