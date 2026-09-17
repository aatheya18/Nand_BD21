import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useGame } from "../state";
import { DialogueBubble, Modal, PillButton } from "../ui";

export const ACCESS_CODE = "ILOVENAND";

export function VerificationGate() {
  const { advance } = useGame();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [rejected, setRejected] = useState(false);
  const [wrong, setWrong] = useState(false);

  const reject = () => {
    setRejected(true);
    window.setTimeout(() => {
      setRejected(false);
      setStep(0);
      setCode("");
    }, 1600);
  };

  return (
    <div className="dreamy-scene flex items-center justify-center">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #FFD9C7 0%, #E3D4F5 100%)",
            "linear-gradient(135deg, #E3D4F5 0%, #FFC9DE 100%)",
            "linear-gradient(135deg, #FFD9C7 0%, #E3D4F5 100%)",
          ],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative z-10 flex flex-col items-center gap-10">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-script text-[64px] leading-none text-magenta-sunset drop-shadow-sm"
        >
          Nand&apos;s Dreamy Odyssey
        </motion.h1>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="q1" className="flex flex-col items-center gap-8" exit={{ opacity: 0 }}>
              <DialogueBubble>Are you Nand?</DialogueBubble>
              <div className="flex gap-4">
                <PillButton tint="mint" onClick={() => setStep(1)}>
                  Yes
                </PillButton>
                <PillButton tint="pink" onClick={reject}>
                  No
                </PillButton>
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="q2" className="flex flex-col items-center gap-8" exit={{ opacity: 0 }}>
              <DialogueBubble>Is today your 21st birthday?</DialogueBubble>
              <div className="flex gap-4">
                <PillButton tint="mint" onClick={() => setStep(2)}>
                  Yes
                </PillButton>
                <PillButton tint="pink" onClick={reject}>
                  No
                </PillButton>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="q3" className="flex flex-col items-center gap-8" exit={{ opacity: 0 }}>
              <DialogueBubble>Whisper the access code ✨</DialogueBubble>
              <input
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setWrong(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder="access code"
                className="w-[300px] rounded-[999px] border-2 border-white/80 bg-white/70 px-7 py-3 text-center text-[18px] font-semibold tracking-[0.2em] outline-none placeholder:tracking-normal placeholder:font-normal placeholder:opacity-50 focus:border-magenta-sunset soft-shadow"
              />
              <div className="flex h-6 items-center">
                {wrong && <span className="text-[15px] font-semibold text-magenta-sunset">Not quite. Try again 💭</span>}
              </div>
              <PillButton tint="lavender" onClick={submit}>
                Enter
              </PillButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal open={rejected} width={440}>
        <div className="flex flex-col items-center gap-4 py-2">
          <motion.div
            initial={{ scale: 0.4, rotate: -20 }}
            animate={{ scale: [0.4, 1.2, 1], rotate: [-20, -8, -12] }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border-[6px] border-magenta-sunset px-8 py-3"
          >
            <span className="font-body text-[42px] font-bold tracking-widest text-magenta-sunset">REJECTED</span>
          </motion.div>
          <p className="text-[17px] font-semibold opacity-70">Wrong answer, birthday boy. Try again 😌</p>
        </div>
      </Modal>
    </div>
  );

  function submit() {
    if (code.trim().toUpperCase() === ACCESS_CODE) advance("crossfade-dreamy");
    else setWrong(true);
  }
}
