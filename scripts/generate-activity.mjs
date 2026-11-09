// Generates Code Distribution & Contribution Impact Dashboard
import { THEME, FONTS, esc, cardFrame, saveVariants } from "./lib/theme.mjs";

export async function renderActivity(outDir = "dist") {
  const W = 920;
  const H = 340;

  function render({ theme, fullPage }) {
    const t = THEME[theme];

    const languages = [
      { name: "Python", share: 0.62, color: "#3572A5" },
      { name: "Jupyter / ML", share: 0.18, color: t.accent },
      { name: "FastAPI / Docker", share: 0.10, color: t.cyan },
      { name: "SQL & DB", share: 0.06, color: t.gold },
      { name: "Shell & CI/CD", share: 0.04, color: "#8B5CF6" },
    ];

    const metrics = [
      { label: "PUBLIC REPOSITORIES", value: "77" },
      { label: "PRODUCTION SYSTEMS", value: "12" },
      { label: "STUDENTS MENTORED", value: "50+" },
      { label: "HACKATHON FIRST PRIZES", value: "3" },
    ];

    // Left half: Language breakdown bars
    let barY = 92;
    const langSvg = languages.map((l) => {
      const y = barY;
      barY += 34;
      const barW = Math.round(l.share * 280);
      return `
        <g transform="translate(42, ${y})">
          <circle cx="4" cy="-4" r="4" fill="${l.color}"/>
          <text x="16" y="0" font-family="${FONTS.sans}" font-size="12" font-weight="600" fill="${t.text}">${esc(l.name)}</text>
          <text x="350" y="0" text-anchor="end" font-family="${FONTS.mono}" font-size="11" fill="${t.muted}">${(l.share * 100).toFixed(0)}%</text>
          
          <rect x="0" y="8" width="350" height="6" rx="3" fill="${t.tagBg}"/>
          <rect x="0" y="8" width="${barW}" height="6" rx="3" fill="${l.color}"/>
        </g>
      `;
    }).join("\n");

    // Right half: Metrics Grid (2x2)
    const metricCardsSvg = metrics.map((m, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 450 + col * 215;
      const y = 92 + row * 95;

      return `
        <g transform="translate(${x}, ${y})">
          <rect width="200" height="80" rx="10" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
          <text x="18" y="38" font-family="${FONTS.sans}" font-size="28" font-weight="800" fill="${i === 0 ? t.accent : i === 1 ? t.cyan : t.gold}">${esc(m.value)}</text>
          <text x="18" y="60" font-family="${FONTS.mono}" font-size="9" font-weight="700" letter-spacing="0.08em" fill="${t.muted}">${esc(m.label)}</text>
        </g>
      `;
    }).join("\n");

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      title: "📊 Engineering Metrics & Code Distribution",
      badge: "PROVEN IMPACT · OPEN SOURCE COMMITS",
      icon: "📈",
      content: `
        <line x1="420" y1="80" x2="420" y2="275" stroke="${t.border}" stroke-width="1"/>
        <g>${langSvg}</g>
        <g>${metricCardsSvg}</g>
        <g>
          <text x="42" y="302" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
            <tspan fill="${t.accent}">●</tspan> Primary Development: <tspan fill="${t.text}">Python, LangGraph &amp; PyTorch</tspan>
          </text>
          <text x="450" y="302" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
            <tspan fill="${t.cyan}">●</tspan> Architecture: <tspan fill="${t.text}">Microservices &amp; Vector Databases</tspan>
          </text>
        </g>
      `,
    });
  }

  await saveVariants({ outDir, filename: "activity-radar", render });
  console.log(`wrote activity-radar-{dark,light,full}.svg to ${outDir}`);
}

if (process.argv[1]?.endsWith("generate-activity.mjs")) {
  await renderActivity(process.argv[2] || "dist");
}
