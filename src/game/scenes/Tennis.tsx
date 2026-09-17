import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AiCharacter, NandCharacter } from "../characters";
import { useGame } from "../state";
import { DialogueBubble, PillButton } from "../ui";

const W = 960;
const H = 560;
const LEFT = 180;
const RIGHT = 780;
const NET_Y = 310;
const NEAR_Y = 500;
const FAR_Y = 140;

type Ball = { x: number; y: number; vx: number; vy: number; h: number; vh: number; bounces: number; live: boolean };

export function Tennis() {
  const { advance } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [matchDone, setMatchDone] = useState(false);
  const [line, setLine] = useState(0); // 0=none, 1=N, 2=A, 3=button

  const state = useRef({
    p1X: 480,
    p2X: 480,
    ball: { x: 480, y: NEAR_Y - 40, vx: 0, vy: 0, h: 20, vh: 0, bounces: 0, live: false } as Ball,
    rallyCount: 0,
    p1SwingT: 0,
    p2SwingT: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const s = state.current;
    s.ball.live = true;
    s.ball.x = 480;
    s.ball.y = NEAR_Y - 30;
    s.ball.vy = -5.6;
    s.ball.vx = (Math.random() - 0.5) * 1.4;
    s.ball.h = 40;
    s.ball.vh = 3;
    
    let raf = 0;

    const loop = () => {
      if (s.p1SwingT > 0) s.p1SwingT -= 1;
      if (s.p2SwingT > 0) s.p2SwingT -= 1;

      const b = s.ball;

      // Simple AI for both players
      if (b.live) {
        if (b.vy < 0) {
          const dx = b.x - s.p2X;
          s.p2X += Math.max(-3.5, Math.min(3.5, dx * 0.08));
        } else {
          const dx = b.x - s.p1X;
          s.p1X += Math.max(-3.5, Math.min(3.5, dx * 0.08));
        }
        
        s.p1X = Math.max(LEFT + 20, Math.min(RIGHT - 20, s.p1X));
        s.p2X = Math.max(LEFT + 20, Math.min(RIGHT - 20, s.p2X));

        b.x += b.vx;
        b.y += b.vy;
        b.h += b.vh;
        b.vh -= 0.46;

        if (b.h <= 0) {
          b.h = 0;
          b.vh = -b.vh * 0.6;
          b.bounces += 1;
        }

        // P2 return
        if (b.vy < 0 && b.y < FAR_Y + 90 && Math.abs(b.x - s.p2X) < 70 && b.h < 110) {
          if (s.rallyCount < 5) {
            s.p2SwingT = 12;
            b.vy = 5.2 + Math.random() * 1.0;
            b.vx = (b.x - s.p2X) * 0.06 + (Math.random() - 0.5) * 2.4;
            b.vh = 7.6;
            b.bounces = 0;
            s.rallyCount++;
          }
        }
        
        // P1 return
        if (b.vy > 0 && b.y > NEAR_Y - 90 && Math.abs(b.x - s.p1X) < 70 && b.h < 110) {
          if (s.rallyCount < 5) {
            s.p1SwingT = 12;
            b.vy = -(5.2 + Math.random() * 1.0);
            b.vx = (b.x - s.p1X) * 0.06 + (Math.random() - 0.5) * 2.4;
            b.vh = 7.6;
            b.bounces = 0;
            s.rallyCount++;
          }
        }

        if (b.y > NEAR_Y + 120 || b.y < FAR_Y - 120 || b.x < LEFT - 100 || b.x > RIGHT + 100 || b.bounces > 3) {
          b.live = false;
          setMatchDone(true);
        }
      }

      draw(ctx, s);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (matchDone) {
      const t1 = setTimeout(() => setLine(1), 1000);
      const t2 = setTimeout(() => setLine(2), 3500);
      const t3 = setTimeout(() => setLine(3), 6000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [matchDone]);

  // "Wearing something nice" for the audience characters
  const nandAudienceOutfit = { polo: "white", pants: "black", shoes: "sneakers" };

  return (
    <div className="dreamy-scene flex flex-col items-center justify-center overflow-hidden" style={{ background: "#BFE6F5" }}>
      <div className="relative w-full max-w-[1280px] h-full flex justify-center items-center pointer-events-none">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full max-h-[80%]"
        />
        
        {/* Audience foreground characters */}
        <div className="absolute bottom-[-20px] left-[15%]">
           <AiCharacter pose="leaning" width={220} />
        </div>
        <div className="absolute bottom-[-20px] right-[15%]">
           <NandCharacter pose="sitting" outfit={nandAudienceOutfit} width={240} />
        </div>

        {/* Dialogues */}
        <div className="absolute top-[100px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 z-50">
          <AnimatePresence>
            {line >= 1 && line < 3 && (
              <DialogueBubble key="n" speaker="N" tint="#FFF9EC">
                what should we do now?
              </DialogueBubble>
            )}
            {line >= 2 && line < 3 && (
              <DialogueBubble key="a" speaker="A" tint="#FFF6FA">
                let's watch the sunset
              </DialogueBubble>
            )}
          </AnimatePresence>
        </div>

        {line >= 3 && (
          <div className="absolute bottom-[40px] left-1/2 z-50 -translate-x-1/2 pointer-events-auto">
            <PillButton tint="peach" onClick={() => advance("fade-through-white")}>
              To the hills →
            </PillButton>
          </div>
        )}
      </div>
    </div>
  );
}

function draw(
  ctx: CanvasRenderingContext2D,
  s: {
    p1X: number;
    p2X: number;
    ball: Ball;
    p1SwingT: number;
    p2SwingT: number;
  },
) {
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#9FD8F2");
  sky.addColorStop(1, "#D7F0E4");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // hills
  ctx.fillStyle = "#7FB877";
  ctx.beginPath();
  ctx.moveTo(0, 120);
  ctx.quadraticCurveTo(200, 20, 420, 110);
  ctx.quadraticCurveTo(660, 190, 960, 90);
  ctx.lineTo(960, 200);
  ctx.lineTo(0, 200);
  ctx.closePath();
  ctx.fill();

  // grass court base
  const grass = ctx.createLinearGradient(0, FAR_Y - 40, 0, H);
  grass.addColorStop(0, "#5F9E55");
  grass.addColorStop(1, "#78BA63");
  ctx.fillStyle = grass;
  ctx.fillRect(0, FAR_Y - 40, W, H - FAR_Y + 40);

  // grass texture
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let y = FAR_Y - 30; y < H; y += 7) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // court
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.moveTo(LEFT + 60, FAR_Y);
  ctx.lineTo(RIGHT - 60, FAR_Y);
  ctx.lineTo(RIGHT, NEAR_Y + 30);
  ctx.lineTo(LEFT, NEAR_Y + 30);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 4;
  ctx.stroke();

  // service line + centre line
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(LEFT + 34, 230);
  ctx.lineTo(RIGHT - 34, 230);
  ctx.moveTo(LEFT + 16, 400);
  ctx.lineTo(RIGHT - 16, 400);
  ctx.moveTo(480, 230);
  ctx.lineTo(480, 400);
  ctx.stroke();

  // net
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.fillRect(LEFT + 26, NET_Y - 34, RIGHT - LEFT - 52, 34);
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 3;
  ctx.strokeRect(LEFT + 26, NET_Y - 34, RIGHT - LEFT - 52, 34);
  ctx.strokeStyle = "rgba(120,140,120,0.35)";
  ctx.lineWidth = 1;
  for (let x = LEFT + 30; x < RIGHT - 26; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, NET_Y - 34);
    ctx.lineTo(x, NET_Y);
    ctx.stroke();
  }

  // P2
  drawPlayer(ctx, s.p2X, FAR_Y, "#F6F2EE", "#2E2A33", s.p2SwingT > 0, 0.85);
  // P1
  drawPlayer(ctx, s.p1X, NEAR_Y, "#BEE3F8", "#5C3A24", s.p1SwingT > 0, 1);

  // ball shadow + ball
  const b = s.ball;
  if (b.live || b.bounces <= 3) {
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#E9F45B";
    ctx.beginPath();
    ctx.arc(b.x, b.y - b.h, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#C8D63F";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  shirt: string,
  hair: string,
  swinging: boolean,
  scale: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 6, 24, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // legs
  ctx.fillStyle = "#E9E4DC";
  ctx.fillRect(-13, -34, 10, 36);
  ctx.fillRect(3, -34, 10, 36);
  // torso
  ctx.fillStyle = shirt;
  ctx.beginPath();
  ctx.roundRect(-18, -74, 36, 44, 10);
  ctx.fill();
  // head
  ctx.fillStyle = "#F0C3A4";
  ctx.beginPath();
  ctx.arc(0, -88, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(0, -95, 15, Math.PI, Math.PI * 2);
  ctx.fill();
  // racket arm
  ctx.strokeStyle = "#F0C3A4";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(14, -66);
  const rx = swinging ? 52 : 40;
  const ry = swinging ? -84 : -50;
  ctx.lineTo(rx, ry);
  ctx.stroke();
  ctx.strokeStyle = "#3A3F52";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(rx + 8, ry - 8, 11, 15, swinging ? -0.6 : 0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
