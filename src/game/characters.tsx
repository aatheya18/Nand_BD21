import { motion } from "motion/react";
import { colorOf, PANTS, POLOS, SHOES, type Outfit } from "./state";

type NandPose = "sleeping" | "idle" | "sitting" | "toweled" | "brushing" | "serving" | "swinging";

/** Nand — layered SVG so every part can be swapped by state. */
export function NandCharacter({
  pose = "idle",
  outfit,
  foam = false,
  clean = false,
  teeth = false,
  brush = false,
  width = 220,
  className = "",
}: {
  pose?: NandPose;
  outfit?: Outfit;
  foam?: boolean;
  clean?: boolean;
  teeth?: boolean;
  brush?: boolean;
  width?: number;
  className?: string;
}) {
  const towel = pose === "toweled";
  const poloColor = towel ? "#FFFDF9" : colorOf(POLOS, outfit?.polo ?? null, "#8FAF92");
  const pantsColor = towel ? "#FFFDF9" : colorOf(PANTS, outfit?.pants ?? null, "#5B6478");
  const shoesColor = colorOf(SHOES, outfit?.shoes ?? null, "#EFEAE2");
  const eyesClosed = pose === "sleeping" || clean;
  const skin = "#F0C3A4";
  const skinShade = "#E0AA8A";
  const outline = "#7A5240";

  return (
    <motion.svg
      viewBox="0 0 200 420"
      width={width}
      className={className}
      animate={{ y: pose === "sleeping" ? 0 : [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* soft glow behind subject */}
      <ellipse cx="100" cy="250" rx="92" ry="150" fill="#FFE6D6" opacity="0.35" />
      {/* legs */}
      <g>
        <rect x="66" y="250" width="30" height="118" rx="14" fill={pantsColor} />
        <rect x="104" y="250" width="30" height="118" rx="14" fill={pantsColor} />
        {towel ? null : (
          <>
            <ellipse cx="81" cy="378" rx="21" ry="12" fill={shoesColor} stroke={outline} strokeWidth="1.4" />
            <ellipse cx="119" cy="378" rx="21" ry="12" fill={shoesColor} stroke={outline} strokeWidth="1.4" />
          </>
        )}
      </g>
      {/* torso */}
      <path
        d="M62 150 q38 -16 76 0 l10 106 q-48 14 -96 0 z"
        fill={poloColor}
        stroke={outline}
        strokeWidth="1.6"
      />
      {towel && <rect x="58" y="244" width="84" height="16" rx="8" fill="#F3E3DA" />}
      {/* arms */}
      {pose === "brushing" ? (
        <g>
          {/* raised, bent arm so the hand stays tucked against the face */}
          <path d="M58 170 L46 214" stroke={poloColor} strokeWidth="25" strokeLinecap="round" fill="none" />
          <motion.g
            style={{ originX: "46px", originY: "214px" }}
            animate={{ rotate: [0, -7, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M46 214 L86 136" stroke={skin} strokeWidth="19" strokeLinecap="round" fill="none" />
            <circle cx="88" cy="133" r="12.5" fill={skin} stroke={outline} strokeWidth="1.4" />
            {brush && (
              <g>
                <path d="M110 105 L86 132" stroke="#8FD4E8" strokeWidth="11" strokeLinecap="round" fill="none" />
                <rect
                  x="106"
                  y="93"
                  width="19"
                  height="12"
                  rx="5"
                  fill="#FFFDF9"
                  stroke={outline}
                  strokeWidth="1"
                  transform="rotate(-40 115 99)"
                />
              </g>
            )}
          </motion.g>
          <g>
            <rect x="134" y="156" width="24" height="96" rx="12" fill={poloColor} stroke={outline} strokeWidth="1.4" />
            <circle cx="146" cy="256" r="13" fill={skin} stroke={outline} strokeWidth="1.4" />
          </g>
        </g>
      ) : (
        <>
          <motion.g
            style={{ originX: "68px", originY: "162px" }}
            animate={{ rotate: pose === "swinging" ? [-20, 24, -20] : [0, 3, 0] }}
            transition={{ duration: pose === "swinging" ? 0.9 : 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="42" y="156" width="24" height="96" rx="12" fill={poloColor} stroke={outline} strokeWidth="1.4" />
            <circle cx="54" cy="256" r="13" fill={skin} stroke={outline} strokeWidth="1.4" />
          </motion.g>
          <g>
            <rect x="134" y="156" width="24" height="96" rx="12" fill={poloColor} stroke={outline} strokeWidth="1.4" />
            <circle cx="146" cy="256" r="13" fill={skin} stroke={outline} strokeWidth="1.4" />
          </g>
        </>
      )}
      {/* neck + head */}
      <rect x="90" y="128" width="20" height="26" rx="9" fill={skinShade} />
      <ellipse cx="100" cy="94" rx="46" ry="50" fill={skin} stroke={outline} strokeWidth="1.6" />
      {/* ears */}
      <circle cx="55" cy="96" r="8" fill={skinShade} />
      <circle cx="145" cy="96" r="8" fill={skinShade} />
      {/* curly hair */}
      <g fill="#5C3A24">
        <ellipse cx="100" cy="52" rx="50" ry="34" />
        <circle cx="60" cy="58" r="17" />
        <circle cx="84" cy="34" r="20" />
        <circle cx="112" cy="30" r="19" />
        <circle cx="139" cy="54" r="17" />
        <circle cx="148" cy="76" r="12" />
        <circle cx="52" cy="78" r="12" />
      </g>
      <g fill="#6E4830" opacity="0.7">
        <circle cx="92" cy="40" r="9" />
        <circle cx="122" cy="42" r="8" />
      </g>
      {/* face */}
      <g>
        <path d="M74 74 q10 -7 20 -1" stroke="#6B4530" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M106 73 q10 -6 20 1" stroke="#6B4530" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        {eyesClosed ? (
          <>
            <path d="M76 92 q8 6 16 0" stroke="#4B3220" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M108 92 q8 6 16 0" stroke="#4B3220" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="84" cy="92" rx="7" ry="8.5" fill="#4B3220" />
            <ellipse cx="116" cy="92" rx="7" ry="8.5" fill="#4B3220" />
            <circle cx="86.5" cy="89" r="2.4" fill="#FFF" />
            <circle cx="118.5" cy="89" r="2.4" fill="#FFF" />
          </>
        )}
        <ellipse cx="70" cy="108" rx="9" ry="6" fill="#F2A08E" opacity="0.55" />
        <ellipse cx="130" cy="108" rx="9" ry="6" fill="#F2A08E" opacity="0.55" />
        <path d="M100 100 q3 6 -2 8" stroke={skinShade} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {teeth ? (
          <g>
            <path d="M80 112 q20 26 40 0 q-20 12 -40 0 z" fill="#8A4B40" stroke={outline} strokeWidth="1.2" />
            <path d="M83 113 q17 6 34 0 l-3 8 q-14 5 -28 0 z" fill="#FFFDF9" />
            <path d="M92 113 v9 M100 114 v9 M108 113 v9" stroke="#E4D9CE" strokeWidth="1.1" />
          </g>
        ) : (
          <path
            d={pose === "sleeping" ? "M88 120 q12 4 24 0" : "M86 118 q14 12 28 -3"}
            stroke="#8A4B40"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>
      {foam && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 0.5 }}>
          <ellipse cx="100" cy="106" rx="42" ry="30" fill="#FFFFFF" opacity="0.72" />
          <circle cx="72" cy="92" r="10" fill="#fff" opacity="0.8" />
          <circle cx="128" cy="96" r="12" fill="#fff" opacity="0.8" />
          <circle cx="100" cy="128" r="11" fill="#fff" opacity="0.8" />
        </motion.g>
      )}
    </motion.svg>
  );
}

type AiPose = "idle" | "smiling" | "serving-cake" | "leaning" | "swinging-racket";

/** A — the companion character. */
export function AiCharacter({
  pose = "idle",
  width = 210,
  className = "",
}: {
  pose?: AiPose;
  width?: number;
  className?: string;
}) {
  const skin = "#F6CDB0";
  const outline = "#7A5240";
  const open = pose === "smiling" || pose === "serving-cake";
  return (
    <motion.svg
      viewBox="0 0 200 420"
      width={width}
      className={className}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <ellipse cx="100" cy="250" rx="90" ry="150" fill="#FFE1EC" opacity="0.35" />
      {/* jeans */}
      <rect x="66" y="248" width="30" height="120" rx="14" fill="#7FA3C9" />
      <rect x="104" y="248" width="30" height="120" rx="14" fill="#7FA3C9" />
      <ellipse cx="81" cy="378" rx="20" ry="11" fill="#FFF6EF" stroke={outline} strokeWidth="1.3" />
      <ellipse cx="119" cy="378" rx="20" ry="11" fill="#FFF6EF" stroke={outline} strokeWidth="1.3" />
      {/* hair back */}
      <path d="M46 60 q54 -46 108 0 q14 96 -6 150 q-48 20 -96 0 q-20 -54 -6 -150 z" fill="#2E2A33" />
      {/* striped tee */}
      <path d="M62 150 q38 -16 76 0 l10 100 q-48 14 -96 0 z" fill="#F6F2EE" stroke={outline} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="60" y={162 + i * 18} width="80" height="6" rx="3" fill="#3F4A5A" opacity="0.75" />
      ))}
      <rect x="64" y="242" width="72" height="12" rx="6" fill="#8B5E3C" />
      {/* arms */}
      <motion.g
        style={{ originX: "150px", originY: "162px" }}
        animate={{ rotate: pose === "swinging-racket" ? [18, -26, 18] : pose === "leaning" ? -6 : [0, -4, 0] }}
        transition={{ duration: pose === "swinging-racket" ? 0.9 : 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="134" y="156" width="23" height="94" rx="11" fill="#F6F2EE" stroke={outline} strokeWidth="1.3" />
        <circle cx="145" cy="254" r="12.5" fill={skin} stroke={outline} strokeWidth="1.3" />
      </motion.g>
      <g>
        <rect x="43" y="156" width="23" height="94" rx="11" fill="#F6F2EE" stroke={outline} strokeWidth="1.3" />
        <circle cx="54" cy="254" r="12.5" fill={skin} stroke={outline} strokeWidth="1.3" />
      </g>
      {/* head */}
      <rect x="90" y="128" width="20" height="24" rx="9" fill="#E7B597" />
      <ellipse cx="100" cy="94" rx="45" ry="49" fill={skin} stroke={outline} strokeWidth="1.5" />
      {/* fringe */}
      <path d="M55 82 q10 -52 45 -52 q35 0 45 52 q-22 -26 -45 -22 q-24 -4 -45 22 z" fill="#2E2A33" />
      <g>
        <path d="M74 74 q10 -6 20 -1" stroke="#3B2A2A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M106 73 q10 -5 20 1" stroke="#3B2A2A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <ellipse cx="83" cy="93" rx="8" ry="9.5" fill="#3A2620" />
        <ellipse cx="117" cy="93" rx="8" ry="9.5" fill="#3A2620" />
        <circle cx="86" cy="89" r="2.8" fill="#fff" />
        <circle cx="120" cy="89" r="2.8" fill="#fff" />
        <ellipse cx="68" cy="109" rx="10" ry="6.5" fill="#F5928F" opacity="0.5" />
        <ellipse cx="132" cy="109" rx="10" ry="6.5" fill="#F5928F" opacity="0.5" />
        {open ? (
          <path d="M86 116 q14 20 28 0 q-14 6 -28 0 z" fill="#C4525E" />
        ) : (
          <path d="M88 118 q12 10 24 -2" stroke="#B4515C" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        )}
      </g>
    </motion.svg>
  );
}

export function Bouquet({ width = 120, className = "" }: { width?: number; className?: string }) {
  const petals = ["#FFC9DE", "#E3D4F5", "#FFD9C7", "#C8F0DE", "#F4A93B"];
  return (
    <svg viewBox="0 0 120 160" width={width} className={className}>
      {petals.map((c, i) => (
        <g key={c} transform={`translate(${18 + i * 18} ${30 + (i % 2) * 14})`}>
          <line x1="4" y1="10" x2={30 - i * 4} y2="112" stroke="#6FA96F" strokeWidth="4" strokeLinecap="round" />
          <Flower color={c} />
        </g>
      ))}
      <path d="M40 108 l44 0 l-8 44 l-28 0 z" fill="#F6E7D8" stroke="#D9BFA6" strokeWidth="2" />
    </svg>
  );
}

export function Flower({ color, size = 1 }: { color: string; size?: number }) {
  return (
    <g transform={`scale(${size})`}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="4" cy="-8" rx="6" ry="10" fill={color} transform={`rotate(${a} 4 4)`} />
      ))}
      <circle cx="4" cy="4" r="5" fill="#FBE38C" />
    </g>
  );
}
