// Generates interactive Agentic AI system architecture pipeline schematic
import { THEME, FONTS, esc, cardFrame, saveVariants } from "./lib/theme.mjs";

export async function renderArchitecture(outDir = "dist") {
  const W = 920;
  const H = 340;

  function render({ theme, fullPage }) {
    const t = THEME[theme];

    const nodes = [
      {
        id: "ingest",
        x: 60,
        y: 110,
        w: 140,
        h: 120,
        label: "INGESTION & EVENT",
        sub: "FastAPI · Webhooks · n8n",
        metric: "5,000+ req/day",
        color: t.cyan,
      },
      {
        id: "router",
        x: 235,
        y: 95,
        w: 155,
        h: 150,
        label: "LANGGRAPH ROUTER",
        sub: "Multi-Agent State Machine",
        metric: "32% lower latency",
        color: t.accent,
        isCore: true,
      },
      {
        id: "agents",
        x: 425,
        y: 110,
        w: 145,
        h: 120,
        label: "DOMAIN AGENTS",
        sub: "FHIR · NLP · YOLOv11",
        metric: "Autonomous execution",
        color: t.gold,
      },
      {
        id: "memory",
        x: 605,
        y: 110,
        w: 125,
        h: 120,
        label: "VECTOR MEMORY",
        sub: "Pinecone · FAISS · Qdrant",
        metric: "45% higher recall",
        color: t.cyan,
      },
      {
        id: "deploy",
        x: 765,
        y: 110,
        w: 105,
        h: 120,
        label: "MLOPS DEPLOY",
        sub: "Docker · CI/CD",
        metric: "99.9% uptime",
        color: t.accent,
      },
    ];

    const connections = [
      { x1: 200, y1: 170, x2: 235, y2: 170 },
      { x1: 390, y1: 170, x2: 425, y2: 170 },
      { x1: 570, y1: 170, x2: 605, y2: 170 },
      { x1: 730, y1: 170, x2: 765, y2: 170 },
    ];

    const connSvg = connections
      .map(
        (c, i) => `
        <line x1="${c.x1}" y1="${c.y1}" x2="${c.x2}" y2="${c.y2}" stroke="${t.border}" stroke-width="2" stroke-dasharray="4 4"/>
        <line x1="${c.x1}" y1="${c.y1}" x2="${c.x2}" y2="${c.y2}" stroke="${t.accent}" stroke-width="2" stroke-dasharray="6 8" class="pulse-line" style="animation-delay:${i * 0.3}s"/>
      `,
      )
      .join("");

    const nodesSvg = nodes
      .map((n) => {
        return `
        <g class="arch-node" transform="translate(${n.x}, ${n.y})">
          <rect class="n-bg" width="${n.w}" height="${n.h}" rx="12" fill="${t.surface}" stroke="${n.isCore ? t.accent : t.border}" stroke-width="${n.isCore ? '1.5' : '1'}"/>
          <circle cx="20" cy="24" r="4" fill="${n.color}"/>
          <text x="32" y="27" font-family="${FONTS.mono}" font-size="9" font-weight="700" letter-spacing="0.08em" fill="${n.color}">${esc(n.label)}</text>
          
          <text x="18" y="62" font-family="${FONTS.sans}" font-size="12" font-weight="600" fill="${t.text}">${esc(n.sub.split(" · ")[0] || "")}</text>
          <text x="18" y="78" font-family="${FONTS.sans}" font-size="11" fill="${t.muted}">${esc(n.sub.split(" · ").slice(1).join(" · ") || "")}</text>
          
          <rect x="14" y="${n.h - 32}" width="${n.w - 28}" height="20" rx="4" fill="${t.tagBg}"/>
          <text x="${n.w / 2}" y="${n.h - 18}" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="600" fill="${t.text}">${esc(n.metric)}</text>
        </g>
      `;
      })
      .join("\n");

    const css = `
      .arch-node{transition:transform 0.2s;cursor:default}
      .arch-node:hover{transform:translateY(-4px)}
      .arch-node:hover .n-bg{fill:${t.surfaceHover};stroke:${t.accent}}
      @keyframes dash{to{stroke-dashoffset:-28}}
      .pulse-line{animation:dash 1.2s linear infinite}
    `;

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      title: "🧠 Production Multi-Agent Architecture",
      badge: "LANGGRAPH · DISTRIBUTED STATE · MLOPS PIPELINE",
      css,
      content: `
        <g>${connSvg}</g>
        <g>${nodesSvg}</g>
        <g transform="translate(60, 280)">
          <text font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
            <tspan fill="${t.accent}">●</tspan> Policy Decision Layer: <tspan fill="${t.text}">Sub-second tool calling</tspan>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <tspan fill="${t.cyan}">●</tspan> Vector Storage: <tspan fill="${t.text}">Hybrid Semantic Search</tspan>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <tspan fill="${t.gold}">●</tspan> MLOps: <tspan fill="${t.text}">Continuous Validation &amp; Docker Rollout</tspan>
          </text>
        </g>
      `,
    });
  }

  await saveVariants({ outDir, filename: "ai-architecture", render });
  console.log(`wrote ai-architecture-{dark,light,full}.svg to ${outDir}`);
}

if (process.argv[1]?.endsWith("generate-architecture.mjs")) {
  await renderArchitecture(process.argv[2] || "dist");
}
