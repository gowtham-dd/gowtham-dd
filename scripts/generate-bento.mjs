// Generates Tech Ecosystem with Official Brand Logos and Production Career Milestones
import { THEME, FONTS, esc, wrapText, cardFrame, saveVariants } from "./lib/theme.mjs";
import { renderLogo } from "./lib/logos.mjs";

export async function renderBento(outDir = "dist") {
  const W = 920;

  // 1. Tech Ecosystem with Embedded Official Brand Logos
  function renderSkills({ theme, fullPage }) {
    const t = THEME[theme];
    const H = 484;

    const clusters = [
      {
        x: 32,
        y: 74,
        w: 416,
        h: 184,
        title: "AGENTIC AI + LLMS",
        tag: "CORE EXPERTISE",
        color: t.accent,
        items: [
          { name: "LangGraph", logo: "langgraph" },
          { name: "Python", logo: "python" },
          { name: "FastAPI", logo: "fastapi" },
          { name: "Docker", logo: "docker" },
        ],
        desc: "Autonomous multi-agent orchestration, state machines and tool calling.",
      },
      {
        x: 472,
        y: 74,
        w: 416,
        h: 184,
        title: "COMPUTER VISION + DL",
        tag: "NEURAL NETWORKS",
        color: t.cyan,
        items: [
          { name: "PyTorch", logo: "pytorch" },
          { name: "TensorFlow", logo: "tensorflow" },
          { name: "OpenCV", logo: "opencv" },
          { name: "GitHub", logo: "github" },
        ],
        desc: "YOLOv11 road damage detection, medical segmentation and NLP clustering.",
      },
      {
        x: 32,
        y: 274,
        w: 416,
        h: 184,
        title: "MLOPS + PIPELINES",
        tag: "PRODUCTION SYSTEMS",
        color: t.gold,
        items: [
          { name: "Docker", logo: "docker" },
          { name: "FastAPI", logo: "fastapi" },
          { name: "Git", logo: "git" },
          { name: "AWS", logo: "aws" },
        ],
        desc: "Automated training loops, MLflow tracking, containerization and 99.9% uptime.",
      },
      {
        x: 472,
        y: 274,
        w: 416,
        h: 184,
        title: "DATA + VECTOR STORES",
        tag: "KNOWLEDGE ENGINES",
        color: t.accent,
        items: [
          { name: "PostgreSQL", logo: "postgres" },
          { name: "AWS S3", logo: "aws" },
          { name: "Python", logo: "python" },
          { name: "Pinecone", logo: "pinecone" },
        ],
        desc: "Hybrid semantic search, sub-100ms vector embeddings and FHIR R4 pipelines.",
      },
    ];

    const boxesSvg = clusters
      .map((b) => {
        // 2x2 grid of tool pills: 2 cols x 2 rows
        // Each pill width = 180, height = 30
        const pillsSvg = b.items.map((item, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const px = 18 + col * 192;
          const py = 52 + row * 36;
          return `
            <g transform="translate(${px}, ${py})">
              <rect width="180" height="30" rx="8" fill="${t.tagBg}" stroke="${t.border}" stroke-width="0.8"/>
              ${renderLogo(item.logo, 10, 4, 22)}
              <text x="38" y="19" font-family="${FONTS.sans}" font-size="11" font-weight="600" fill="${t.text}">${esc(item.name)}</text>
            </g>
          `;
        }).join("");

        const descLines = wrapText(b.desc, 38);

        return `
        <g class="bento-box" transform="translate(${b.x}, ${b.y})">
          <rect class="b-bg" width="${b.w}" height="${b.h}" rx="14" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
          
          <!-- Header -->
          <g transform="translate(18, 28)">
            <circle cx="0" cy="0" r="4.5" fill="${b.color}"/>
            <text x="14" y="4" font-family="${FONTS.mono}" font-size="11" font-weight="700" letter-spacing="0.08em" fill="${b.color}">${esc(b.title)}</text>
            <rect x="${b.w - 150}" y="-11" width="132" height="20" rx="10" fill="${t.tagBg}" stroke="${t.border}" stroke-width="0.8"/>
            <text x="${b.w - 84}" y="3" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="700" fill="${t.muted}">${esc(b.tag)}</text>
          </g>

          <!-- 2x2 Tool Pills Strip -->
          <g>${pillsSvg}</g>

          <!-- Clean Wrapped Description -->
          <g transform="translate(18, 140)">
            ${descLines.map((line, li) => `<text x="0" y="${li * 17}" font-family="${FONTS.sans}" font-size="11.5" fill="${t.muted}">${esc(line)}</text>`).join("\n")}
          </g>
        </g>
      `;
      })
      .join("\n");

    // Zero transform movement on hover - completely static cards
    const css = `
      .b-bg{transition:fill 0.2s, stroke 0.2s}
      .bento-box:hover .b-bg{fill:${t.surfaceHover};stroke:${t.accent}}
    `;

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      title: "⚙️ Technical Capabilities · Stack",
      badge: "AGENTIC AI · COMPUTER VISION · MLOPS · VECTOR DATABASES",
      icon: "⚡",
      css,
      content: boxesSvg,
    });
  }

  // 2. Production Career Milestones
  function renderExperience({ theme, fullPage }) {
    const t = THEME[theme];
    const H = 496;

    const milestones = [
      {
        org: "Noukha Technologies",
        role: "AI Developer Intern",
        period: "Mar 2026 – Present",
        color: t.accent,
        bullet1: "Reduced system latency by 32% and compute cost by 20% on FastAPI backend",
        bullet2: "Optimized AWS S3 vector storage and retrieval pipelines, boosting recall by 45%",
      },
      {
        org: "Pixel Cognitix",
        role: "AI Developer Intern",
        period: "Oct 2025 – Present",
        color: t.cyan,
        bullet1: "Built automated n8n + Python pipelines ingesting 2.5M rows of web data",
        bullet2: "Fine-tuned local threat classification agent, improving model accuracy by 18%",
      },
      {
        org: "Alesa AI (UK)",
        role: "App + AI Developer Intern",
        period: "Mar 2025 – Sep 2025",
        color: t.gold,
        bullet1: "Scaled production APIs for flagship applications (Noulez + SnagNinja)",
        bullet2: "Optimized SQL indexing and query execution, cutting read latency by 40%",
      },
      {
        org: "Pyroguards (CBE)",
        role: "App + AI Developer Intern",
        period: "Jan 2025 – Mar 2025",
        color: t.accent,
        bullet1: "Engineered XGBoost URL phishing classifier with 98.4% detection accuracy",
        bullet2: "Containerized model with FastAPI + Docker, delivering 95ms median response time",
      },
      {
        org: "Literate Spork",
        role: "Founder + Community Lead",
        period: "2024 – Present",
        color: t.cyan,
        bullet1: "Mentored 50+ students in hands-on MLOps, LLM architectures + Agentic AI",
        bullet2: "Maintained 20+ open-source repositories and led 40+ technical peer reviews",
      },
    ];

    const cardW = 820;
    const cardH = 72;
    const startY = 74;
    const itemH = 80;

    const itemsSvg = milestones.map((m, i) => {
      const y = startY + i * itemH;
      return `
        <g class="exp-item" transform="translate(50, ${y})">
          <!-- Step indicator line and circle -->
          ${i < milestones.length - 1 ? `<line x1="-18" y1="20" x2="-18" y2="${itemH + 10}" stroke="${t.border}" stroke-width="2"/>` : ""}
          <circle cx="-18" cy="14" r="6" fill="${m.color}"/>
          <circle cx="-18" cy="14" r="2.5" fill="${t.bg}"/>

          <!-- Card Content -->
          <g>
            <rect class="e-bg" width="${cardW}" height="${cardH}" rx="10" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
            
            <!-- Title, Org (aligned at fixed x=240 column), and Period -->
            <g transform="translate(18, 22)">
              <text font-family="${FONTS.sans}" font-size="12.5" font-weight="700" fill="${t.text}">${esc(m.role)}</text>
              <text x="222" font-family="${FONTS.sans}" font-size="12.5" font-weight="600" fill="${m.color}">@ ${esc(m.org)}</text>
              <text x="${cardW - 36}" y="0" text-anchor="end" font-family="${FONTS.mono}" font-size="10.5" font-weight="500" fill="${t.muted}">${esc(m.period)}</text>
            </g>

            <!-- Clean Justified Bullets inside the box -->
            <g transform="translate(18, 43)">
              <text font-family="${FONTS.sans}" font-size="11" fill="${t.muted}"><tspan fill="${m.color}" font-weight="700">● </tspan>${esc(m.bullet1)}</text>
            </g>
            <g transform="translate(18, 59)">
              <text font-family="${FONTS.sans}" font-size="11" fill="${t.muted}"><tspan fill="${m.color}" font-weight="700">● </tspan>${esc(m.bullet2)}</text>
            </g>
          </g>
        </g>
      `;
    }).join("\n");

    // Zero transform movement on hover - completely static cards
    const css = `
      .e-bg{transition:fill 0.2s, stroke 0.2s}
      .exp-item:hover .e-bg{fill:${t.surfaceHover};stroke:${t.accent}}
    `;

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      title: "💼 Production Experience · Internships",
      badge: "4 INTERNSHIPS · 1 COMMUNITY FOUNDED · SHIPPED PRODUCTION SYSTEMS",
      icon: "🏢",
      css,
      content: itemsSvg,
    });
  }

  await saveVariants({ outDir, filename: "skills-bento", render: renderSkills });
  await saveVariants({ outDir, filename: "experience-timeline", render: renderExperience });
  console.log(`wrote skills-bento and experience-timeline to ${outDir}`);
}

if (process.argv[1]?.endsWith("generate-bento.mjs")) {
  await renderBento(process.argv[2] || "dist");
}
