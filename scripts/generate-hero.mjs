// Generates high-tech AI Command Center Hero Banner
import { THEME, FONTS, cardFrame, saveVariants } from "./lib/theme.mjs";

export async function renderHero(outDir = "dist") {
  const W = 920;
  const H = 250;

  function render({ theme, fullPage }) {
    const t = THEME[theme];

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      content: `
        <!-- Live Status Pill -->
        <g transform="translate(36, 42)">
          <rect width="260" height="22" rx="11" fill="${t.tagBg}" stroke="${t.border}" stroke-width="1"/>
          <circle cx="12" cy="11" r="3.5" fill="${t.success}"/>
          <text x="24" y="14.5" font-family="${FONTS.mono}" font-size="9" font-weight="700" letter-spacing="0.08em" fill="${t.text}">ACTIVE · OPEN TO AI/ML ROLES</text>
        </g>

        <!-- Main Title -->
        <g transform="translate(36, 110)">
          <text font-family="${FONTS.sans}" font-size="44" font-weight="800" letter-spacing="-0.03em" fill="${t.text}">Gowtham D</text>
          <text x="240" y="-8" font-family="${FONTS.mono}" font-size="11" font-weight="700" fill="${t.accent}" letter-spacing="0.1em">AI ENGINEER &amp; MLOPS</text>
          
          <text y="28" font-family="${FONTS.sans}" font-size="16" font-weight="500" fill="${t.muted}">I build AI systems that <tspan fill="${t.accent}" font-weight="700">actually ship</tspan>. From LangGraph multi-agent teams to production MLOps.</text>
        </g>

        <!-- Technical Breadcrumb Bar -->
        <g transform="translate(36, 185)">
          <rect width="848" height="38" rx="8" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
          
          <g transform="translate(20, 24)">
            <text font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.accent}">🎓</tspan> M.Sc Software Systems (SKASC)
              &nbsp;&nbsp;&nbsp;&nbsp;
              <tspan fill="${t.gold}">🏅</tspan> IIT Madras Certified
              &nbsp;&nbsp;&nbsp;&nbsp;
              <tspan fill="${t.cyan}">🤖</tspan> AI Intern @ Noukha &amp; Pixel Cognitix
              &nbsp;&nbsp;&nbsp;&nbsp;
              <tspan fill="${t.accent}">📍</tspan> India (IST)
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

