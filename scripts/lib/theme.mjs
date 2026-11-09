import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const THEME = {
  dark: {
    bg: "#08090C",
    surface: "#0F1219",
    surfaceHover: "#161B26",
    border: "#1E2638",
    borderHover: "#FF5722",
    text: "#F8FAFC",
    muted: "#94A3B8",
    dim: "#475569",
    accent: "#FF5722",       // Solar Ember / Flame Coral
    accentGlow: "rgba(255, 87, 34, 0.25)",
    gold: "#FBBF24",         // Sunstone Amber
    cyan: "#06B6D4",         // High-tech AI Cyan
    success: "#10B981",
    tagBg: "#161D2B",
  },
  light: {
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceHover: "#F1F5F9",
    border: "#E2E8F0",
    borderHover: "#FF5722",
    text: "#0F172A",
    muted: "#64748B",
    dim: "#94A3B8",
    accent: "#E04818",
    accentGlow: "rgba(224, 72, 24, 0.15)",
    gold: "#D97706",
    cyan: "#0891B2",
    success: "#059669",
    tagBg: "#F1F5F9",
  },
};

export const FONTS = {
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif",
  mono: "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace",
};

export const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

export function cardFrame({ width, height, theme = "dark", fullPage = false, title, badge, css = "", content }) {
  const t = THEME[theme];
  const pad = fullPage ? 20 : 0;
  const dims = fullPage ? "" : ` width="${width}" height="${height}"`;

  const header = title
    ? `<g transform="translate(32, 38)">
        <circle cx="0" cy="0" r="4.5" fill="${t.accent}"/>
        <text x="14" y="4" font-family="${FONTS.mono}" font-size="11" font-weight="700" letter-spacing="0.12em" fill="${t.accent}">${esc(title.toUpperCase())}</text>
        ${badge ? `<text x="${width - 64}" y="4" text-anchor="end" font-family="${FONTS.mono}" font-size="10.5" font-weight="600" letter-spacing="0.08em" fill="${t.muted}">${esc(badge)}</text>` : ""}
        <line x1="-12" y1="18" x2="${width - 52}" y2="18" stroke="${t.border}" stroke-width="1"/>
      </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg"${dims} viewBox="${-pad} ${-pad} ${width + 2 * pad} ${height + 2 * pad}" role="img" aria-label="${esc(title || 'Portfolio Card')}">
<defs>
  <radialGradient id="cardGlow" cx="90%" cy="10%" r="50%">
    <stop offset="0%" stop-color="${t.accent}" stop-opacity="${theme === 'dark' ? '0.12' : '0.06'}"/>
    <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  ${fullPage ? `:root{background:${t.bg}}\n` : ""}
  .txt{font-family:${FONTS.sans};fill:${t.text}}
  .sub{font-family:${FONTS.sans};fill:${t.muted}}
  .code{font-family:${FONTS.mono};fill:${t.muted}}
  .title{font-family:${FONTS.sans};font-weight:700;fill:${t.text}}
  ${css}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="16" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="16" fill="url(#cardGlow)"/>
${header}
${content}
</svg>
`;
}

export async function saveVariants({ outDir, filename, render }) {
  await mkdir(outDir, { recursive: true });
  for (const theme of ["dark", "light"]) {
    await writeFile(join(outDir, `${filename}-${theme}.svg`), render({ theme, fullPage: false }));
  }
  await writeFile(join(outDir, `${filename}-full.svg`), render({ theme: "dark", fullPage: true }));
}
