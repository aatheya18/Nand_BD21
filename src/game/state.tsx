import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export const SCENES = [
  "VERIFICATION_GATE",
  "WAKE_UP",
  "BATHROOM_ROUTINE",
  "DRESS_UP",
  "CAR_DRIVE_TO_FLOWERS",
  "FLOWER_SHOP",
  "CAFE_BIRTHDAY",
  "AIRPORT_WALKWAY",
  "AIRPLANE_TAKEOFF",
  "TENNIS_MATCH",
  "HILL_DRIVE",
  "SUNSET_DRIVE_OUTRO",
] as const;

export type SceneName = (typeof SCENES)[number];
export type TransitionKind = "fade-through-white" | "crossfade-dreamy";

export type Outfit = {
  polo: string | null;
  pants: string | null;
  shoes: string | null;
};

export const POLOS = [
  { id: "white", label: "White", color: "#F7F4F0" },
  { id: "sky", label: "Sky Blue", color: "#BEE3F8" },
  { id: "brown", label: "Dusty Brown", color: "#B08968" },
];
export const PANTS = [
  { id: "navy", label: "Navy", color: "#2C3E63" },
  { id: "black", label: "Black", color: "#2B2B33" },
  { id: "beige", label: "Beige Cargo", color: "#D9C4A3" },
];
export const SHOES = [
  { id: "sneakers", label: "White Sneakers", color: "#FBFBF9" },
  { id: "crocs", label: "Crocs", color: "#7FC8A9" },
];

type GameState = {
  scene: SceneName;
  sceneIndex: number;
  transition: TransitionKind | null;
  outfit: Outfit;
  setOutfit: (o: Partial<Outfit>) => void;
  flowers: number[];
  setFlowers: (f: number[]) => void;
  advance: (kind?: TransitionKind) => void;
  restart: () => void;
  muted: boolean;
  toggleMute: () => void;
};

const Ctx = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [transition, setTransition] = useState<TransitionKind | null>(null);
  const [outfit, setOutfitState] = useState<Outfit>({ polo: null, pants: null, shoes: null });
  const [flowers, setFlowers] = useState<number[]>([]);
  const [muted, setMuted] = useState(true);

  const advance = useCallback((kind: TransitionKind = "crossfade-dreamy") => {
    setTransition(kind);
    const half = kind === "fade-through-white" ? 320 : 380;
    window.setTimeout(() => {
      setSceneIndex((i) => Math.min(i + 1, SCENES.length - 1));
      window.setTimeout(() => setTransition(null), 60);
    }, half);
  }, []);

  const value = useMemo<GameState>(
    () => ({
      scene: SCENES[sceneIndex]!,
      sceneIndex,
      transition,
      outfit,
      setOutfit: (o) => setOutfitState((prev) => ({ ...prev, ...o })),
      flowers,
      setFlowers,
      advance,
      restart: () => {
        setOutfitState({ polo: null, pants: null, shoes: null });
        setFlowers([]);
        setSceneIndex(0);
      },
      muted,
      toggleMute: () => setMuted((m) => !m),
    }),
    [sceneIndex, transition, outfit, flowers, advance, muted],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

export const colorOf = (list: { id: string; color: string }[], id: string | null, fallback: string) =>
  list.find((x) => x.id === id)?.color ?? fallback;
