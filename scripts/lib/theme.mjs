import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const THEME = {
  dark: {
    bg: "#08090C",
    surface: "#0F121A",
    surfaceHover: "#151B26",
    surfaceGlass: "rgba(15, 18, 26, 0.75)",
    border: "#1E2638",
    borderGlow: "rgba(255, 87, 34, 0.4)",
    text: "#F8FAFC",
    muted: "#94A3B8",
    dim: "#475569",
    accent: "#FF5722",       // Solar Flame
    accentGlow: "rgba(255, 87, 34, 0.22)",
    gold: "#FBBF24",         // Sunstone Amber
    cyan: "#06B6D4",         // AI Trace Cyan
    purple: "#8B5CF6",       // Deep Violet
    success: "#10B981",
    tagBg: "#161D2B",
  },
  light: {
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceHover: "#F1F5F9",
    surfaceGlass: "rgba(255, 255, 255, 0.85)",
    border: "#E2E8F0",
    borderGlow: "rgba(224, 72, 24, 0.25)",
    text: "#0F172A",
    muted: "#64748B",
    dim: "#94A3B8",
    accent: "#E04818",
    accentGlow: "rgba(224, 72, 24, 0.12)",
    gold: "#D97706",
    cyan: "#0891B2",
    purple: "#7C3AED",
    success: "#059669",
    tagBg: "#F1F5F9",
  },
};

export const FONTS = {
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif",
  mono: "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace",
};

// Strict XML escaping with entity normalization to prevent double-escaping (e.g. &amp; -> & -> &amp;)
export function esc(s) {
  if (s == null) return "";
  const normalized = String(s)
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'");
  return normalized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function wrapText(text, maxChars) {
  const lines = [];
  let cur = "";
  for (const word of String(text || "").split(/\s+/)) {
    if (cur && (cur + " " + word).length > maxChars) {
      lines.push(cur);
      cur = word;
    } else {
      cur = cur ? `${cur} ${word}` : word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function validateXml(xmlString, filename = "svg") {
  // Check for raw unescaped &
  const rawAmp = xmlString.match(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/);
  if (rawAmp) {
    console.error(`Around bad ampersand: [${xmlString.slice(Math.max(0, rawAmp.index - 25), rawAmp.index + 25)}]`);
    throw new Error(`XML Validation Error in ${filename}: Found unescaped ampersand at position ${rawAmp.index}`);
  }
  return true;
}

export function cardFrame({ width, height, theme = "dark", fullPage = false, title, badge, icon, css = "", content }) {
  const t = THEME[theme];
  const pad = fullPage ? 24 : 0;
  const dims = fullPage ? "" : ` width="${width}" height="${height}"`;

  // In full-page view, completely disable any hover transform, transitions, and hover-triggered repaints to eliminate flickering
  let styleBlock = "";
  if (fullPage) {
    styleBlock = `
      :root { background: ${t.bg}; }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
      :hover {
        transform: none !important;
        filter: none !important;
      }
    `;
  } else {
    styleBlock = css;
  }

  const header = title
    ? `<g transform="translate(32, 42)">
        <circle cx="0" cy="0" r="5" fill="${t.accent}"/>
        ${icon ? `<text x="14" y="5" font-family="${FONTS.sans}" font-size="14">${icon}</text>` : ""}
        <text x="${icon ? 34 : 14}" y="4" font-family="${FONTS.mono}" font-size="11" font-weight="700" letter-spacing="0.12em" fill="${t.accent}">${esc(title.toUpperCase())}</text>
        ${badge ? `<text x="${width - 64}" y="4" text-anchor="end" font-family="${FONTS.mono}" font-size="10.5" font-weight="600" letter-spacing="0.08em" fill="${t.muted}">${esc(badge)}</text>` : ""}
        <line x1="-12" y1="20" x2="${width - 52}" y2="20" stroke="${t.border}" stroke-width="1"/>
      </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg"${dims} viewBox="${-pad} ${-pad} ${width + 2 * pad} ${height + 2 * pad}" role="img" aria-label="${esc(title || 'Portfolio Infographic')}">
<defs>
  <radialGradient id="meshGlow" cx="85%" cy="15%" r="65%">
    <stop offset="0%" stop-color="${t.accent}" stop-opacity="${theme === 'dark' ? '0.15' : '0.08'}"/>
    <stop offset="50%" stop-color="${t.cyan}" stop-opacity="${theme === 'dark' ? '0.06' : '0.03'}"/>
    <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
  </radialGradient>
  <pattern id="gridDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="0.8" fill="${t.border}" opacity="0.6"/>
  </pattern>
</defs>
<style>
  .txt{font-family:${FONTS.sans};fill:${t.text}}
  .sub{font-family:${FONTS.sans};fill:${t.muted}}
  .code{font-family:${FONTS.mono};fill:${t.muted}}
  .title{font-family:${FONTS.sans};font-weight:700;fill:${t.text}}
  ${styleBlock}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="18" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="18" fill="url(#gridDots)"/>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="18" fill="url(#meshGlow)"/>
${header}
${content}
</svg>
`;
}

export async function saveVariants({ outDir, filename, render }) {
  await mkdir(outDir, { recursive: true });
  for (const theme of ["dark", "light"]) {
    const svg = render({ theme, fullPage: false });
    validateXml(svg, `${filename}-${theme}.svg`);
    await writeFile(join(outDir, `${filename}-${theme}.svg`), svg);
  }
  const fullSvg = render({ theme: "dark", fullPage: true });
  validateXml(fullSvg, `${filename}-full.svg`);
  await writeFile(join(outDir, `${filename}-full.svg`), fullSvg);
}
