// Generates high-tech AI Command Center Hero Banner Infographic
import { THEME, FONTS, esc, cardFrame, saveVariants } from "./lib/theme.mjs";

export async function renderHero(outDir = "dist") {
  const W = 920;
  const H = 260;

  function render({ theme, fullPage }) {
    const t = THEME[theme];

    // Isometric 3D AI Neural Cube matrix on the right
    const cubes = [
      { x: 740, y: 90, color: t.accent },
      { x: 790, y: 115, color: t.gold },
      { x: 690, y: 115, color: t.cyan },
      { x: 740, y: 140, color: t.purple },
      { x: 740, y: 40, color: t.accent },
    ];

    const isoCubesSvg = cubes.map((c) => {
      return `
        <g transform="translate(${c.x}, ${c.y})">
          <polygon points="0,-16 26,-2 0,12 -26,-2" fill="${c.color}" opacity="0.85"/>
          <polygon points="-26,-2 0,12 0,42 -26,28" fill="${c.color}" opacity="0.6"/>
          <polygon points="0,12 26,-2 26,28 0,42" fill="${c.color}" opacity="0.4"/>
        </g>
      `;
    }).join("");

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      content: `
        <!-- Left Side: HUD Telemetry and Identity -->
        <g transform="translate(40, 42)">
          <rect width="270" height="24" rx="12" fill="${t.tagBg}" stroke="${t.border}" stroke-width="1"/>
          <circle cx="14" cy="12" r="4" fill="${t.success}"/>
          <text x="28" y="16" font-family="${FONTS.mono}" font-size="9.5" font-weight="700" letter-spacing="0.08em" fill="${t.text}">SYSTEM STATUS: PRODUCTION ONLINE</text>

          <text x="0" y="74" font-family="${FONTS.sans}" font-size="44" font-weight="800" letter-spacing="-0.03em" fill="${t.text}">Gowtham D</text>
          <text x="245" y="66" font-family="${FONTS.mono}" font-size="11" font-weight="700" fill="${t.accent}" letter-spacing="0.1em">AI ENGINEER</text>

          <text x="0" y="104" font-family="${FONTS.sans}" font-size="15.5" font-weight="500" fill="${t.muted}">
            I build AI systems that <tspan fill="${t.accent}" font-weight="700">actually ship</tspan>. LangGraph multi-agents &amp; automated MLOps.
          </text>
        </g>

        <!-- Right Side: Isometric AI Core Visual -->
        <g>
          <circle cx="740" cy="115" r="95" fill="${t.accent}" opacity="0.12"/>
          <line x1="740" y1="40" x2="740" y2="90" stroke="${t.border}" stroke-width="1.5" stroke-dasharray="3 3"/>
          <line x1="690" y1="115" x2="740" y2="90" stroke="${t.border}" stroke-width="1.5"/>
          <line x1="740" y1="90" x2="790" y2="115" stroke="${t.border}" stroke-width="1.5"/>
          <line x1="690" y1="115" x2="740" y2="140" stroke="${t.border}" stroke-width="1.5"/>
          <line x1="740" y1="140" x2="790" y2="115" stroke="${t.border}" stroke-width="1.5"/>
          ${isoCubesSvg}
          <text x="740" y="200" text-anchor="middle" font-family="${FONTS.mono}" font-size="9.5" font-weight="700" letter-spacing="0.1em" fill="${t.muted}">AUTONOMOUS NEURAL CORE</text>
        </g>

        <!-- Bottom Telemetry Ribbon -->
        <g transform="translate(40, 192)">
          <rect width="840" height="40" rx="10" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
          
          <g transform="translate(0, 25)">
            <text x="24" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.accent}">🎓</tspan> M.Sc Systems (SKASC)
            </text>
            <text x="220" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.gold}">🏅</tspan> Data Science @ IIT Madras
            </text>
            <text x="440" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.cyan}">🤖</tspan> AI Intern @ Noukha &amp; Pixel
            </text>
            <text x="670" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.accent}">🚀</tspan> Founder @ Literate Spork
            </text>
          </g>
        </g>
      `,
    });
  }

  await saveVariants({ outDir, filename: "hero-banner", render });
  console.log(`wrote hero-banner-{dark,light,full}.svg to ${outDir}`);
}

if (process.argv[1]?.endsWith("generate-hero.mjs")) {
  await renderHero(process.argv[2] || "dist");
}
