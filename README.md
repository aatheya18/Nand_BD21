# Nand_BD21

Nand's Dreamy 21st Birthday Odyssey — Master Build Prompt for Lovable.dev

0. How to use this prompt

Paste this whole document into Lovable as your first message. Since Lovable's chat accepts image uploads, also attach the 5 reference images (the two character portraits, the cafe photo, the green-hills road photo, and the sunset photo) alongside this prompt — they anchor the palette and mood even though every asset below will be custom-built, not photo-traced.

Build as a single Next.js (or Vite + React) app. Desktop/laptop only — no need to optimize for touch or small viewports, but keep the layout centered and comfortable between ~1280px and ~1920px wide.

1. Tech Stack

React + Next.js (App Router) or Vite + React — Lovable's default.

Framer Motion for all transitions, crossfades, and the bathroom 180° rotation.

Zustand or React Context for the global game state machine (current scene, inventory/flags like "hasBrushedTeeth," "bouquetCount," "outfit," "tennisScore").

canvas-confetti for the candle-blow moment.

HTML5 Canvas or SVG + requestAnimationFrame for the tennis physics minigame (canvas is preferred for performance).

All art is hand-coded SVG illustration, not photos or AI-generated raster images — see Section 2 for why and how.

2. Art Direction & Asset Generation Strategy

Do not use photorealistic images, stock photos, or raster AI-generated art for characters and props. Lovable should build every character, prop, and background as layered inline SVG components styled to match the mood of the reference images (matte, painted-illustration look, soft gradients, no hard photographic shadows). This is the only way to guarantee the two characters stay visually consistent across all 9 scenes, and it's the only art path that lets code (not an external image) drive the interactivity — swapping outfits, moving a toothbrush, layering foam, etc. all require the art to be made of controllable, separable code elements, not a flat image.

Global style tokens to define once and reuse everywhere:

--color-peach: #FFD9C7
--color-lavender: #E3D4F5
--color-pink: #FFC9DE
--color-sky-blue: #BEE3F8
--color-mint: #C8F0DE
--color-gold-sunset: #F4A93B
--color-magenta-sunset: #E85A8C
--color-slate: #3A3F52
--font-body: 'Quicksand', 'Nunito', sans-serif   /* soft, rounded */
--font-script: 'Caveat', 'Pacifico', cursive      /* for "Dreamy Delights" style headers */
--radius-pill: 999px
--shadow-soft: 0 8px 24px rgba(0,0,0,0.08)


Texture note: simulate the "matte painted canvas" look with subtle SVG feTurbulence noise filters at low opacity over flat gradient fills, rather than sharp vector-flat shading. Keep line work soft (2–3px rounded strokes, no hard black outlines except on the two main characters, where a thin warm-brown outline is fine — matching the portrait references).

Characters as reusable components, built in layered SVG groups so individual parts can be shown/hidden/swapped by state:

<NandCharacter pose="idle|carrying-brush|brushing|toweled|dressed|serving" outfit={...} />

<AiCharacter pose="idle|smiling|serving-cake|leaning|swinging-racket" />

Each pose is a variant within the same component — don't rebuild the character from scratch per scene.

Lighting rule: every scene uses soft, diffused pastel-cloud lighting (implemented as gentle radial gradients + low-opacity glow blobs behind subjects) except the tennis match, which should read as brighter, higher-contrast "afternoon sun" (warmer highlight color, harder-edged grass texture, visible sun-glow in one corner).

3. Global UI System

Define these as shared components used across every scene:

<PillButton> — the primary interactive element throughout the game. Rounded-pill shape, soft pastel fill (rotate through the palette above), soft drop shadow, gentle scale-up + shadow-lift on hover, scale-down on press. Used for dialogue choices, confirm actions, and menu items.

<DialogueBubble> — rounded speech-bubble with a small tail, used for all character lines (verification gate, cafe, sunset outro). Text fades and slides in a few px on appear.

<SceneProgressDots> — a small row of 9 dots fixed at the top of the screen, filling in as the player advances through scenes, so it always feels like a coherent journey rather than 9 disconnected pages.

<TransitionOverlay> — a full-screen layer that handles all scene changes (see Section 4).

<Modal> — for the rejection overlay and the birthday letter; soft rounded card, backdrop blur behind it, pastel border.

General interaction feel: every clickable thing should have a hover affordance (slight scale + brightness) and a satisfying micro-animation on click (scale bounce via a spring transition). Cursor can optionally be a small custom sparkle/heart cursor for extra polish — nice-to-have, not required.

4. State Machine & Scene Transitions

const SCENES = [
  'VERIFICATION_GATE',
  'WAKE_UP',
  'BATHROOM_ROUTINE',
  'DRESS_UP',
  'CAR_DRIVE_TO_FLOWERS',
  'FLOWER_SHOP',
  'CAFE_BIRTHDAY',
  'TENNIS_MATCH',
  'SUNSET_DRIVE_OUTRO',
];


Each scene transition should use one of three named transitions, chosen per the table in Section 5, driven by the shared <TransitionOverlay>:

fade-through-white — 300ms fade to white, swap scene contents, 300ms fade back in. Used for the shower time-skip and the tennis→sunset cut.

crossfade-dreamy — the outgoing scene fades out while a soft gradient-blur transitional layer briefly shows, incoming scene fades in with a gentle upward drift (8–12px). Default between most scenes.

rotate-flip — literal 180° perspective rotation via a CSS/Framer Motion rotateY transform on the scene container, used only for the bathroom sink-view ↔ face-view switches. Keep it under 600ms with an ease-in-out curve so it doesn't feel jarring.

Advance to the next scene only after that scene's completion condition is met (defined per scene below) — this stays a strictly linear experience, no skipping.

5. Scene-by-Scene Specs

Scene 1 — Verification Gate

Transition in: app load, simple fade-in. Background: soft peach-to-lavender gradient (animated slow drift, ~30s loop, barely perceptible). UI: centered stack of <DialogueBubble> + two <PillButton>s ("Yes" / "No") per question. Sequence: "Are you Nand?" → "Is today your 21st birthday?" → text input styled as a pill-shaped field for the access code → <PillButton> "Enter." Interaction: clicking "No" on either question triggers a playful <Modal> — a big illustrated "REJECTED" stamp/wobble animation, then resets the question after ~1.5s (fade-through-white reset, not a full page reload). Completion: correct access code submitted → crossfade-dreamy to Wake Up.

Scene 2 — Wake Up

Background: soft bedroom, dawn-pastel light through a window. UI: minimal — a single tap/click anywhere prompt ("Click to wake up ☀️") fading in after 1s. Interaction: click triggers Nand's idle-to-sitting-up pose swap + soft yawn animation. Completion: auto-advances 1.5s after the click → crossfade-dreamy to Bathroom.

Scene 3 — Bathroom Routine (interactive minigame)

Build as one component managing two sub-views (sink / face) connected by the rotate-flip transition, plus a final shower sub-state.

Sink View 1:

Illustrated ceramic sink counter with toothbrush, toothpaste tube, facewash bottle, pink napkin on a rack — each a separately clickable SVG prop with a hover highlight (soft outer glow).

Step 1: click toothbrush → it detaches and follows the cursor (position it via mousemove, small lag/spring for a soft floaty feel).

Step 2: click toothpaste (only enabled once carrying the brush) → dollop of paste illustrated on the brush head. A small ✓ toast confirms both steps done, then auto-rotates to Face View.

Face View (rotate-flip in):

Step 3: carry the brush near Nand's mouth (define a proximity radius) → brush swaps to a "foaming" variant, small looping bubble/particle burst (simple animated SVG circles, not a heavy particle library).

Step 4: after 5s a <PillButton> "Spit" fades in centered; click it → brief spit animation, auto rotate back to Sink View.

Sink View 2:

Step 5: click facewash → rotate to Face View again.

Step 6 (Face View): mouse-proximity near face applies a light cleansing foam overlay (soft white translucent blob, animates in).

Step 7: rotate back to Sink View, click napkin → face wipes clean (foam fades out).

Shower (final beat):

View shifts to a simple 2D shower stall, pastel-yellow tile pattern.

Click the glass door → a backdrop-filter: blur() layer snaps on instantly (heavy fog), then fade-through-white transitions time forward.

On fade-in, swap Nand's sprite to the towel-wrapped variant. Completion: towel sprite shown → crossfade-dreamy to Dress-Up.

Scene 4 — Dress-Up (selection interface)

Layout: centered mannequin (towel-sprite Nand) with three labeled columns of icon options to the side: Polos (White / Sky Blue / Dusty Brown), Pants (Navy / Black / Beige Cargo), Shoes (White Sneakers / Crocs). Interaction: clicking an icon shows a selected-state ring around it and instantly swaps that clothing layer on the mannequin (cross-fade the layer, ~150ms, not an abrupt pop). Only one item per category selected at a time. UI: <PillButton> "Confirm" enabled only once all 3 categories have a selection. Completion: confirm click → crossfade-dreamy to the Drive.

Scene 5 — Car Drive to Flower Shop

Visual: a stylized blue car (flat SVG, 3/4 side view) drives left-to-right along the bottom third of the screen, in front of a parallax-scrolling green rolling-hills background (2–3 layers scrolling at different speeds for depth). Add a couple of soft cloud shapes drifting slowly. Interaction: none required — this is a short (3–4s) auto-playing establishing beat. The scroll decelerates and stops as a flower-shop storefront silhouette scrolls into frame from the right. Completion: auto → crossfade-dreamy into the shop interior.

Scene 6 — Flower Shop (collection/builder)

UI: a 3×3 grid of flower "cards" (each a distinct illustrated flower — vary shape/color across the palette), styled like soft collectible cards with a subtle lift-on-hover. Counter: a pill-shaped counter fixed at the top, e.g. "🌸 2 / 5 Picked." Interaction: clicking a card marks it selected (soft glow ring, disabled from being clicked again) and increments the counter. Cards can be picked in any order; once 5 are picked the remaining 4 grey out. Completion animation: the 5 selected flowers animate — scaling down and flying into a single composed "Dreamy Bouquet" sprite that appears in Nand's hand — then auto-advances → crossfade-dreamy to the Cafe.

Scene 7 — Cafe & Letter

Background: the fullest illustration in the game — translate the reference cafe photo into flat/soft-shaded SVG: pastel rainbow archway, pink ceramic-pill stools, "Dreamy Delights" in script font as a neon-style glow sign, hanging cloud-lights, an illuminated mirror prop. Sequence:

A (the AI character) enters with the exact warm, celebratory expression from her reference portrait, holding an illustrated cake with lit candles.

Click-and-hold interaction on the candles (a filling radial progress ring around the cursor while held) — on completion, candles extinguish (quick puff-of-smoke SVG) and canvas-confetti fires immediately.

A hands over a letter — clicking it opens a <Modal> styled as unrolled parchment with a warm cream/tan texture, showing scrollable custom handwritten-style text (use a handwriting-style Google Font, e.g. 'Caveat' or 'Homemade Apple'). Completion: closing the letter modal enables a <PillButton> "Continue" → fade-through-white to the Tennis Match (bigger tonal shift, deserves a harder cut).

Scene 8 — Tennis Match (full minigame)

Build on <canvas>, isometric-styled illustrated court (realistic grass texture + crisp white boundary lines), simplified rolling-hills backdrop, brighter "afternoon sun" lighting per Section 2.

Controls:

Left/Right arrow keys move Nand's sprite laterally along the near baseline (clamp to court bounds).

Spacebar swings Nand's racket; if the ball is within a hit-radius of him at that moment, apply a new velocity/angle to the ball (simple reflect-and-boost, not full physics engine).

Ball physics: basic 2D projectile with gravity + bounce damping on court contact, net collision (ball hitting the net zone stops/drops it, counts as a miss), out-of-bounds detection against the painted lines.

AI opponent (A): moves horizontally to track the ball's x-position with some easing/max-speed (not instant/perfect, should feel human), auto-swings

returns the ball when it's in her hit zone.

Scoring: standard tennis point sequence per game (Love → 15 → 30 → 40 → Game, with Deuce/Advantage handling at 40-40). Simplify to first to win one game as the win condition (skip full sets) — keep the minigame from overstaying its welcome in a birthday-gift context. UI: score display as two soft pill badges top-left/top-right. Completion: Nand wins the game (feel free to bias the AI's return accuracy down slightly so this is close but achievable) → celebratory animation → fade-through-white to the Sunset Outro.

Scene 9 — Sunset Drive Outro (final scene)

Background: static but rich, animated sky — layered gradient blobs slowly drifting to suggest gently moving clouds, matching the deep gold/fiery pink-magenta/warm orange palette from the sunset reference, dark slate silhouette hills in the foreground. Composition: the blue car parked on a hill crest in silhouette; Nand and A sit on the hood/hillside, her head leaning on his shoulder — mirror the reference pose. Interaction: two sequential <DialogueBubble>s appear with a short delay between them — A: "Let's watch the sunset." → N: "Okieee." — then the scene simply holds, no further UI. This is the ending; no "restart" button needed unless you want one small subtle "Replay ↺" pill in a corner.

6. Sound (nice-to-have, add if time allows)

Soft ambient background music (lo-fi/dreamy pad loop), a few light UI sound effects (soft pop on button click, gentle chime on scene completion), all togglable via a small mute icon fixed in a corner throughout.

7. QA Checklist before calling it done

[ ] All 9 scenes reachable in strict order, no dead ends.

[ ] Bathroom minigame steps can't be skipped out of order.

[ ] Dress-up mannequin never shows two items in the same category at once.

[ ] Tennis match is winnable but not trivial; game doesn't soft-lock if the ball goes out of bounds.

[ ] Every transition type (fade-through-white, crossfade-dreamy, rotate-flip) is smooth at both scene-enter and scene-exit.

[ ] Layout looks correct at both 1280px and 1920px wide.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7f2a3cb2-592d-4c0e-8618-f6e43854c7d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
