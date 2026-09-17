import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { HillDrive } from "./src/game/scenes/HillDrive.tsx";
import { Sunset } from "./src/game/scenes/Sunset.tsx";
import { GameProvider } from "./src/game/state.tsx";

try {
  const hillDriveHtml = renderToString(createElement(GameProvider, null, createElement(HillDrive)));
  console.log("HillDrive rendered successfully. Length:", hillDriveHtml.length);
  
  const sunsetHtml = renderToString(createElement(GameProvider, null, createElement(Sunset)));
  console.log("Sunset rendered successfully. Length:", sunsetHtml.length);
} catch (e) {
  console.error("Render error:", e);
}
