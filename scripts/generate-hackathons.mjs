// Generates championship shields and hackathon wins grid
import { THEME, FONTS, esc, cardFrame, saveVariants } from "./lib/theme.mjs";

export async function renderHackathons(outDir = "dist") {
  const W = 920;
  const H = 348;

  function render({ theme, fullPage }) {
    const t = THEME[theme];

    const wins = [
      {
        place: "1ST PRIZE",
        event: "HackNext'26 1.0",
        desc: "17-Agent Healthcare Claim Orchestration",
        venue: "SNS College of Technology · 2026",
        badgeColor: t.accent,
      },
      {
        place: "BEST PAPER",
        event: "ICAITICA 2026",
        desc: "Drug Trafficking Detection Agent",
        venue: "International Conf · 2026",
        badgeColor: t.gold,
      },
      {
        place: "1ST PRIZE",
        event: "Tech Hack '24",
        desc: "SocioMedico AI Hospital App",
        venue: "AIC Raise Coimbatore · 2024",
        badgeColor: t.accent,
      },
      {
        place: "1ST PRIZE",
        event: "SNS Tech Hack",
        desc: "24-hr EV Charging Booking App",
        venue: "SNS College of Technology · 2024",
        badgeColor: t.accent,
      },
      {
        place: "2ND PLACE",
        event: "HackAppsters",
        desc: "Chest Radiogram Disease Classifier",
        venue: "L&T EduTech · 2026",
        badgeColor: t.cyan,
      },
      {
        place: "3RD PRIZE",
        event: "HackVision '26",
        desc: "End-to-end Event Management Agent",
        venue: "HackVision · 2026",
        badgeColor: t.muted,
      },
      {
        place: "TOP 50",
        event: "Kaggle Playground",
        desc: "Competitive Machine Learning Notebooks",
        venue: "Kaggle Series · 2026",
        badgeColor: t.gold,
      },
      {
        place: "GOLD MEDAL",
        event: "SKASC Chess Meet",
        desc: "Inter-department Chess Championship",
        venue: "Yaayu House · 2026",
        badgeColor: t.gold,
      },
    ];

    const cols = 4;
    const cardW = 196;
    const cardH = 110;
    const startX = 32;
    const startY = 76;
    const gapX = 18;
    const gapY = 16;

    const cardsSvg = wins.map((w, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      return `
        <g class="h-card" transform="translate(${x}, ${y})">
          <rect class="h-bg" width="${cardW}" height="${cardH}" rx="10" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
          
          <g transform="translate(14, 24)">
            <!-- Award Pill -->
            <rect width="82" height="18" rx="9" fill="${t.tagBg}" stroke="${w.badgeColor}" stroke-width="0.8"/>
            <text x="41" y="12" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="700" fill="${w.badgeColor}" letter-spacing="0.06em">${esc(w.place)}</text>
          </g>

          <g transform="translate(14, 58)">
            <text font-family="${FONTS.sans}" font-size="12" font-weight="700" fill="${t.text}">${esc(w.event)}</text>
            <text y="18" font-family="${FONTS.sans}" font-size="10.5" fill="${t.muted}">${esc(w.desc.length > 25 ? w.desc.slice(0, 23) + '...' : w.desc)}</text>
          </g>

          <g transform="translate(14, 94)">
            <text font-family="${FONTS.mono}" font-size="9" fill="${t.dim}">${esc(w.venue)}</text>
          </g>
        </g>
      `;
    }).join("\n");

    const css = `
      .h-bg{transition:fill 0.2s, stroke 0.2s}
      .h-card:hover .h-bg{fill:${t.surfaceHover};stroke:${t.accent}}
    `;

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      title: "🏆 Hackathons · Honors + Awards",
      badge: "3× FIRST PRIZE · 1× BEST PAPER · 1× GOLD MEDAL",
      icon: "🏆",
      css,
      content: cardsSvg,
    });
  }

  await saveVariants({ outDir, filename: "hackathons-grid", render });
  console.log(`wrote hackathons-grid-{dark,light,full}.svg to ${outDir}`);
}

if (process.argv[1]?.endsWith("generate-hackathons.mjs")) {
  await renderHackathons(process.argv[2] || "dist");
}
