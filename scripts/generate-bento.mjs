// Generates Tech Ecosystem with Official Brand Logos and Production Career Milestones
import { THEME, FONTS, esc, cardFrame, saveVariants } from "./lib/theme.mjs";
import { renderLogo } from "./lib/logos.mjs";

export async function renderBento(outDir = "dist") {
  const W = 920;

  // 1. Tech Ecosystem with Embedded Official Brand Logos
  function renderSkills({ theme, fullPage }) {
    const t = THEME[theme];
    const H = 460;

    const clusters = [
      {
        x: 32,
        y: 72,
        w: 416,
        h: 172,
        title: "AGENTIC AI &amp; LLMS",
        tag: "CORE EXPERTISE",
        color: t.accent,
        items: [
          { name: "LangGraph", logo: "langgraph" },
          { name: "Python", logo: "python" },
          { name: "FastAPI", logo: "fastapi" },
          { name: "Docker", logo: "docker" },
        ],
        desc: "Autonomous multi-agent orchestration, state machines &amp; tool calling.",
      },
      {
        x: 472,
        y: 72,
        w: 416,
        h: 172,
        title: "COMPUTER VISION &amp; DEEP LEARNING",
        tag: "NEURAL NETWORKS",
        color: t.cyan,
        items: [
          { name: "PyTorch", logo: "pytorch" },
          { name: "TensorFlow", logo: "tensorflow" },
          { name: "OpenCV", logo: "opencv" },
          { name: "GitHub", logo: "github" },
        ],
        desc: "YOLOv11 road damage detection, medical segmentation &amp; NLP clustering.",
      },
      {
        x: 32,
        y: 260,
        w: 416,
        h: 172,
        title: "MLOPS &amp; DEPLOYMENT PIPELINES",
        tag: "PRODUCTION SYSTEMS",
        color: t.gold,
        items: [
          { name: "Docker", logo: "docker" },
          { name: "FastAPI", logo: "fastapi" },
          { name: "Git", logo: "git" },
          { name: "AWS", logo: "aws" },
        ],
        desc: "Automated training loops, MLflow tracking, containerization &amp; 99.9% uptime.",
      },
      {
        x: 472,
        y: 260,
        w: 416,
        h: 172,
        title: "DATA &amp; VECTOR STORES",
        tag: "KNOWLEDGE ENGINES",
        color: t.accent,
        items: [
          { name: "PostgreSQL", logo: "postgres" },
          { name: "AWS S3", logo: "aws" },
          { name: "Python", logo: "python" },
          { name: "Pinecone", logo: "pinecone" },
        ],
        desc: "Hybrid semantic search, sub-100ms vector embeddings &amp; FHIR R4 pipelines.",
      },
    ];

    const boxesSvg = clusters
      .map((b) => {
        let logoX = 22;
        const logosSvg = b.items.map((item) => {
          const out = `
            <g transform="translate(${logoX}, 72)">
              <!-- Glass Pill Container -->
              <rect width="90" height="34" rx="8" fill="${t.tagBg}" stroke="${t.border}" stroke-width="0.8"/>
              ${renderLogo(item.logo, 8, 5, 22)}
              <text x="36" y="21" font-family="${FONTS.sans}" font-size="11" font-weight="600" fill="${t.text}">${esc(item.name)}</text>
            </g>
          `;
          logoX += 96;
          return out;
        }).join("");

        return `
        <g class="bento-box" transform="translate(${b.x}, ${b.y})">
          <rect class="b-bg" width="${b.w}" height="${b.h}" rx="14" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
          
          <!-- Header -->
          <g transform="translate(20, 30)">
            <circle cx="0" cy="0" r="4.5" fill="${b.color}"/>
            <text x="14" y="4" font-family="${FONTS.mono}" font-size="11" font-weight="700" letter-spacing="0.08em" fill="${b.color}">${b.title}</text>
            <rect x="${b.w - 132}" y="-11" width="92" height="20" rx="10" fill="${t.tagBg}"/>
            <text x="${b.w - 86}" y="3" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="700" fill="${t.muted}">${esc(b.tag)}</text>
          </g>

          <!-- Logos Strip -->
          <g>${logosSvg}</g>

          <!-- Description -->
          <g transform="translate(20, 142)">
            <text font-family="${FONTS.sans}" font-size="11.5" fill="${t.muted}">${b.desc}</text>
          </g>
        </g>
      `;
      })
      .join("\n");

    const css = `
      .bento-box{transition:transform 0.2s}
      .bento-box:hover{transform:translateY(-3px)}
      .bento-box:hover .b-bg{fill:${t.surfaceHover};stroke:${t.accent}}
    `;

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      title: "⚙️ Technical Capabilities &amp; Stack",
      badge: "AGENTIC AI · COMPUTER VISION · MLOPS · VECTOR DATABASES",
      icon: "⚡",
      css,
      content: boxesSvg,
    });
  }

  // 2. Production Career Milestones
  function renderExperience({ theme, fullPage }) {
    const t = THEME[theme];
    const H = 450;

    const milestones = [
      {
        org: "Noukha Technologies",
        role: "AI Developer Intern",
        period: "Mar 2026 – Present",
        bullets: "• Reduced system latency by 32% &amp; compute cost by 20% | • Scaled FastAPI backend to 5,000+ daily production requests | • Optimized AWS S3 Vectors improving recall by 45%",
        color: t.accent,
      },
      {
        org: "Pixel Cognitix",
        role: "AI Developer Intern",
        period: "Oct 2025 – Present",
        bullets: "• Built automated n8n + Python pipelines saving 15+ hrs/week | • Ingested &amp; normalized 2.5M rows of semi-anonymous web data | • Fine-tuned local threat classifier by +18%",
        color: t.cyan,
      },
      {
        org: "Alesa AI (UK)",
        role: "App &amp; AI Developer Intern",
        period: "Mar 2025 – Sep 2025",
        bullets: "• Scaled APIs for Noulez &amp; SnagNinja serving thousands of users | • SQL optimization cut read response times by 40% | • Integrated notification loops boosting DAU by 22%",
        color: t.gold,
      },
      {
        org: "Pyroguards (CBE)",
        role: "App &amp; AI Developer Intern",
        period: "Jan 2025 – Mar 2025",
        bullets: "• 98.4% URL phishing detection accuracy on 1.2M signatures | • Dockerized FastAPI model achieving 95ms median response time | • Zero dataset imbalance bias",
        color: t.accent,
      },
      {
        org: "Literate Spork",
        role: "Founder &amp; Community Lead",
        period: "2024 – Present",
        bullets: "• Mentored 50+ students in hands-on MLOps and Agentic AI | • Maintained 20+ open-source project repos | • Conducted 40+ formal peer code reviews",
        color: t.cyan,
      },
    ];

    const itemH = 68;
    const itemsSvg = milestones.map((m, i) => {
      const y = 82 + i * itemH;
      return `
        <g class="exp-item" transform="translate(42, ${y})">
          <!-- Step indicator line -->
          ${i < milestones.length - 1 ? `<line x1="12" y1="20" x2="12" y2="${itemH + 10}" stroke="${t.border}" stroke-width="2"/>` : ""}
          <circle cx="12" cy="12" r="6" fill="${m.color}"/>
          <circle cx="12" cy="12" r="2.5" fill="${t.bg}"/>

          <!-- Card Content -->
          <g transform="translate(36, 0)">
            <rect class="e-bg" width="800" height="58" rx="8" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
            
            <g transform="translate(16, 22)">
              <text font-family="${FONTS.sans}" font-size="13" font-weight="700" fill="${t.text}">${esc(m.role.replace('&amp;', '&'))}</text>
              <text x="${m.role.length * 8.2 + 8}" y="0" font-family="${FONTS.sans}" font-size="13" font-weight="600" fill="${m.color}">@ ${esc(m.org)}</text>
              <text x="760" y="0" text-anchor="end" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">${esc(m.period)}</text>
            </g>

            <g transform="translate(16, 42)">
              <text font-family="${FONTS.sans}" font-size="11" fill="${t.muted}">${m.bullets}</text>
            </g>
          </g>
        </g>
      `;
    }).join("\n");

    const css = `
      .exp-item{transition:transform 0.18s}
      .exp-item:hover{transform:translateX(4px)}
      .exp-item:hover .e-bg{fill:${t.surfaceHover};stroke:${t.accent}}
    `;

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      title: "💼 Production Experience &amp; Internships",
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
