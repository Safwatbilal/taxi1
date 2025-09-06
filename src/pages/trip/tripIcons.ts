// import { divIcon } from "leaflet";
// export const currentLocationIcon = divIcon({
//   html: `<div style="
//     width: 24px;
//     height: 24px;
//     background: linear-gradient(135deg, #3b82f6, #1d4ed8);
//     border: 3px solid white;
//     border-radius: 50%;
//     box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(59, 130, 246, 0.4);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     animation: pulse 2s infinite;
//   ">
//     <div style="
//       width: 8px;
//       height: 8px;
//       background: white;
//       border-radius: 50%;
//     "></div>
//   </div>
//   <style>
//     @keyframes pulse {
//       0%, 100% { transform: scale(1); }
//       50% { transform: scale(1.1); }
//     }
//   </style>`,
//   className: "",
//   iconSize: [24, 24],
//   iconAnchor: [12, 12],
// });
// export const startIcon = divIcon({
//   html: `
//     <div style="
//       position: relative;
//       width: 44px;
//       height: 44px;
//       background: radial-gradient(circle at 30% 30%, #34d399, #059669);
//       border-radius: 50% 50% 50% 0;
//       transform: rotate(-45deg);
//       box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     ">
//       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
//         viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
//         <path d="M3 13l1-3h16l1 3v7a1 1 0 0 1-1 1h-1a3 3 0 1 1-6 0H9a3 3 0 1 1-6 0H2a1 1 0 0 1-1-1v-7z"/>
//         <path d="M5 6h14l2 4H3l2-4z" fill="white"/>
//       </svg>
//     </div>
//   `,
//   className: "",
//   iconSize: [44, 44],
//   iconAnchor: [22, 44], // bottom point anchors correctly
// });

// export const endIcon = divIcon({
//   html: `
//     <div style="
//       position: relative;
//       width: 44px;
//       height: 44px;
//       background: radial-gradient(circle at 30% 30%, #f87171, #dc2626);
//       border-radius: 50% 50% 50% 0;
//       transform: rotate(-45deg);
//       box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     ">
//       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
//         viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
//         <path d="M5 3v18l7-5 7 5V3H5z"/>
//       </svg>
//     </div>
//   `,
//   className: "",
//   iconSize: [44, 44],
//   iconAnchor: [22, 44],
// });
// markers.ts
import { divIcon, DivIcon } from "leaflet";

type PinGlyph = "car" | "flag" | string; // string -> renders as text (e.g., "A", "B")
type PinOptions = {
  width?: number;      // pixel width of the marker (height auto scales)
  color?: string;      // main color
  accent?: string;     // darker accent for gradient/shadow
  glyph?: PinGlyph;    // "car" | "flag" | "A" | "B" | ...
  pulse?: boolean;     // subtle halo pulse effect
};

function makeEndpointIcon({
  width = 50,
  color = "#10b981",      // emerald
  accent = "#059669",     // darker emerald
  glyph = "car",
  pulse = false,
}: PinOptions = {}): DivIcon {
  // Keep the classic map-pin ratio (48x64 viewBox). Height = width * (64/48)
  const height = Math.round(width * (64 / 48));
  const anchorY = height - Math.round(width * 0.12); // tip of the pin
  const anchorX = Math.round(width / 2);

  const glyphSvg = renderGlyph(glyph);

  const html = `
  <div style="width:${width}px;height:${height}px;position:relative;transform:translateZ(0);">
    <svg width="${width}" height="${height}" viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map pin">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${lighten(color, 0.18)}"/>
          <stop offset="100%" stop-color="${color}"/>
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="${accent}" flood-opacity="0.35"/>
        </filter>
      </defs>

      <!-- Pin shape -->
      <g filter="url(#shadow)">
        <!-- classic pin path centered at bottom tip -->
        <path d="M24 2c-9.94 0-18 8.06-18 18 0 12.15 18 32 18 32s18-19.85 18-32C42 10.06 33.94 2 24 2z" fill="url(#grad)"/>
        <!-- subtle top gloss -->
        <path d="M24 4c-8.84 0-16 7.16-16 16 0 .67.04 1.34.13 2 4.2-1.8 9.9-3 15.87-3 5.97 0 11.67 1.2 15.87 3 .09-.66.13-1.33.13-2 0-8.84-7.16-16-16-16z" fill="#ffffff" opacity="0.15"/>
      </g>

      <!-- Inner circle plate -->
      <circle cx="24" cy="22" r="12" fill="rgba(0,0,0,0.12)"/>
      <circle cx="24" cy="22" r="10" fill="#ffffff" opacity="0.9"/>

      <!-- Glyph (kept upright) -->
      <g transform="translate(24,22)">
        ${glyphSvg}
      </g>

      ${pulse ? pulseRing() : ""}
    </svg>
  </div>`;

  return divIcon({
    html,
    className: "pin-icon",
    iconSize: [width, height],
    iconAnchor: [anchorX, anchorY],
  });
}

// --- Glyphs ---------------------------------------------------------------

function renderGlyph(glyph: PinGlyph): string {

const label = (glyph || "").toString().slice(0, 5); // allow up to 4 chars
const fontSize = label.length > 3 ? 8 : 12; // shrink if longer text
return `
  <text x="0" y="6" text-anchor="middle"
        font-weight: var(--font-weight-bold)
        font-weight="800"
        font-size="${fontSize}"
        fill="#111">
    ${escapeXml(label)}
  </text>`;
}

// Subtle pulsing halo for “active” pin
function pulseRing(): string {
  return `
    <g opacity="0.7">
      <circle cx="24" cy="22" r="12" fill="none" stroke="#fff" stroke-width="1.5">
        <animate attributeName="r" values="12;16;12" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite"/>
      </circle>
    </g>`;
}

// tiny util: lighten hex color by pct (0–1)
function lighten(hex: string, pct = 0.15): string {
  const { r, g, b } = hexToRgb(hex);
  const L = (v: number) => Math.round(v + (255 - v) * pct);
  return `rgb(${L(r)},${L(g)},${L(b)})`;
}

function hexToRgb(hex: string) {
  const m = hex.trim().replace("#", "");
  const n = m.length === 3 ? m.split("").map(c => c + c).join("") : m;
  const num = parseInt(n, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, c =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" } as any)[c]
  );
}

// --- Ready-made exports ---------------------------------------------------

// 🟢 Pickup (car glyph, emerald)
export const pickupIcon = makeEndpointIcon({
  color: `#FFD600`,
  accent: "#b91c1c",  
  glyph: "من", // ✅ Arabic text instead of car
  pulse: false,
});

// 🔴 Drop-off (flag glyph, red)
export const dropoffIcon = makeEndpointIcon({
  color: "#ef4444",   // ✅ Red (Tailwind red-500)
  accent: "#b91c1c",  
  glyph: "إلى", // ✅ Arabic text instead of flag
  pulse: false,
});

// 🔵 Current location (pulsing dot)
export const currentLocationIcon = ((): DivIcon => {
  const size = 26;
  const html = `
    <div style="width:${size}px;height:${size}px;position:relative;">
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Current location">
        <defs>
          <radialGradient id="c" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#3b82f6"/>
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="6" fill="url(#c)" stroke="#fff" stroke-width="3"/>
        <circle cx="16" cy="16" r="10" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.5">
          <animate attributeName="r" values="10;14;10" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0.15;0.6" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  `;
  return divIcon({
    html,
    className: "current-location-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
})();
