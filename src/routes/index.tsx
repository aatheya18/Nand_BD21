import { useEffect } from "react";
import { ErrorBoundary } from "@/ErrorBoundary";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { GameProvider, useGame } from "@/game/state";
import { pop, startPad, stopAudio } from "@/game/audio";
import { SceneProgressDots, SvgGrainDefs, TransitionOverlay } from "@/game/ui";
import { VerificationGate } from "@/game/scenes/VerificationGate";
import { WakeUp } from "@/game/scenes/WakeUp";
import { Bathroom } from "@/game/scenes/Bathroom";
import { DressUp } from "@/game/scenes/DressUp";
import { CarDrive } from "@/game/scenes/CarDrive";
import { FlowerShop } from "@/game/scenes/FlowerShop";
import { Cafe } from "@/game/scenes/Cafe";
import { Airport } from "@/game/scenes/Airport";
import { Airplane } from "@/game/scenes/Airplane";
import { Tennis } from "@/game/scenes/Tennis";
import { HillDrive } from "@/game/scenes/HillDrive";
import { Sunset } from "@/game/scenes/Sunset";

const TITLE = "Nand's Dreamy 21st Birthday Odyssey";
const DESC =
  "A hand-illustrated nine-scene birthday adventure: wake up, get ready, pick flowers, blow out the candles, win a tennis match and watch the sunset.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <Stage />
      </GameProvider>
    </ErrorBoundary>
  );
}

function CurrentScene() {
  const { scene } = useGame();
  switch (scene) {
    case "VERIFICATION_GATE":
      return <VerificationGate />;
    case "WAKE_UP":
      return <WakeUp />;
    case "BATHROOM_ROUTINE":
      return <Bathroom />;
    case "DRESS_UP":
      return <DressUp />;
    case "CAR_DRIVE_TO_FLOWERS":
      return <CarDrive />;
    case "FLOWER_SHOP":
      return <FlowerShop />;
    case "CAFE_BIRTHDAY":
      return <Cafe />;
    case "AIRPORT_WALKWAY":
      return <Airport />;
    case "AIRPLANE_TAKEOFF":
      return <Airplane />;
    case "TENNIS_MATCH":
      return <Tennis />;
    case "HILL_DRIVE":
      return <HillDrive />;
    case "SUNSET_DRIVE_OUTRO":
      return <Sunset />;
    default:
      return null;
  }
}

function Stage() {
  const { scene, sceneIndex, transition, muted, toggleMute } = useGame();

  useEffect(() => {
    if (muted) stopAudio();
    else startPad();
    return () => stopAudio();
  }, [muted]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#F7F2EC]">
      <SvgGrainDefs />
      <div className="relative mx-auto h-full w-full max-w-[1920px] min-w-[1280px] overflow-hidden">
        <div className="absolute inset-0">
          <CurrentScene />
        </div>

        <SceneProgressDots />
        <TransitionOverlay kind={transition} />

        <button
          type="button"
          onClick={() => {
            toggleMute();
            if (muted) setTimeout(() => pop("chime"), 120);
          }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-5 right-6 z-40 rounded-[999px] bg-white/80 px-4 py-2 text-[15px] font-semibold soft-shadow transition hover:scale-105"
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    </main>
  );
}
