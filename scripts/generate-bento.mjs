// Generates Tech Bento Grid and Production Career Milestones
import { THEME, FONTS, esc, cardFrame, saveVariants } from "./lib/theme.mjs";

export async function renderBento(outDir = "dist") {
  const W = 920;
  const H = 460;

  // 1. Tech Arsenal Bento
  function renderSkills({ theme, fullPage }) {
    const t = THEME[theme];

    const boxes = [
      {
        x: 32,
        y: 70,
        w: 416,
        h: 170,
        title: "AGENTIC AI & LLMS",
        tag: "CORE FOCUS",
        color: t.accent,
        skills: ["LangGraph", "LangChain", "LangSmith", "LangServe", "Groq", "LLaMA 3.1", "OpenAI", "Deepgram"],
        desc: "Autonomous multi-agent orchestration, tool calling, and state persistence.",
      },
      {
        x: 472,
        y: 70,
        w: 416,
        h: 170,
        title: "COMPUTER VISION & DEEP LEARNING",
        tag: "VISION & NLP",
        color: t.cyan,
        skills: ["PyTorch", "TensorFlow", "YOLOv11", "OpenCV", "Scikit-learn", "HDBSCAN", "SHAP"],
        desc: "Real-time threat detection, medical image segmentation, and NLP clustering.",
      },
      {
        x: 32,
        y: 256,
        w: 416,
        h: 170,
        title: "MLOPS & DEPLOYMENT",
        tag: "PRODUCTION",
        color: t.gold,
        skills: ["MLflow", "DagsHub", "Docker", "GitHub Actions", "FastAPI", "Flask", "n8n"],
        desc: "Automated training loops, model tracking, containerization, and 99.9% uptime CI/CD.",
      },
      {
        x: 472,
        y: 256,
        w: 416,
        h: 170,
        title: "DATA & VECTOR STORES",
        tag: "KNOWLEDGE LAYER",
        color: t.accent,
        skills: ["PostgreSQL", "Pinecone", "FAISS", "Qdrant", "Pandas", "NumPy", "AWS S3", "FHIR R4"],
        desc: "Hybrid semantic search, sub-100ms vector embeddings, and high-throughput data ops.",
      },
    ];

    const boxesSvg = boxes
      .map((b) => {
        let chipX = 20;
        let chipY = 66;
        const chipsSvg = b.skills.map((s) => {
          const w = s.length * 7.2 + 16;
          if (chipX + w > b.w - 20) {
            chipX = 20;
            chipY += 26;
          }
          const out = `
            <g transform="translate(${chipX}, ${chipY})">
              <rect width="${w}" height="20" rx="10" fill="${t.tagBg}" stroke="${t.border}" stroke-width="0.8"/>
              <text x="${w / 2}" y="13.5" text-anchor="middle" font-family="${FONTS.mono}" font-size="10" font-weight="600" fill="${t.text}">${esc(s)}</text>
            </g>
          `;
          chipX += w + 8;
          return out;
        }).join("");

        return `
        <g class="bento-box" transform="translate(${b.x}, ${b.y})">
          <rect class="b-bg" width="${b.w}" height="${b.h}" rx="12" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
          
          <g transform="translate(20, 28)">
            <circle cx="0" cy="0" r="4" fill="${b.color}"/>
            <text x="12" y="4" font-family="${FONTS.mono}" font-size="11" font-weight="700" letter-spacing="0.08em" fill="${b.color}">${esc(b.title)}</text>
            <rect x="${b.w - 120}" y="-11" width="80" height="18" rx="9" fill="${t.tagBg}"/>
            <text x="${b.w - 80}" y="1" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="700" fill="${t.muted}">${esc(b.tag)}</text>
          </g>

          <!-- Pills -->
          <g>${chipsSvg}</g>

          <!-- Excerpt -->
          <text x="20" y="${b.h - 18}" font-family="${FONTS.sans}" font-size="11" fill="${t.muted}">${esc(b.desc)}</text>
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
      title: "⚙️ Technical Capabilities & Stack",
      badge: "AGENTIC AI · COMPUTER VISION · MLOPS · VECTOR STORES",
      css,
      content: boxesSvg,
    });
  }

  // 2. Production Career Milestones
  function renderExperience({ theme, fullPage }) {
    const t = THEME[theme];

    const milestones = [
      {
        org: "Noukha Technologies",
        role: "AI Developer Intern",
        period: "Mar 2026 – Present",
        highlight: "LangGraph Multi-Agent Workflows",
        bullets: "• Reduced system latency by 32% & compute cost by 20% | • Scaled FastAPI serving 5K+ daily production requests | • Optimized AWS S3 Vectors improving recall by 45%",
        color: t.accent,
      },
      {
        org: "Pixel Cognitix",
        role: "AI Developer Intern",
        period: "Oct 2025 – Present",
        highlight: "Automated Data Ingestion & Classification",
        bullets: "• Built n8n + Python pipelines saving 15+ hrs/week | • Ingested & normalized 2.5M rows of semi-anonymous web data | • Fine-tuned local threat classifier by +18%",
        color: t.cyan,
      },
      {
        org: "Alesa AI (UK)",
        role: "App & AI Developer Intern",
        period: "Mar 2025 – Sep 2025",
        highlight: "Flagship Mobile AI Backends",
        bullets: "• Scaled APIs for Noulez & SnagNinja for thousands of users | • SQL optimization cut read response times by 40% | • Notification pipeline lifted DAU by 22%",
        color: t.gold,
      },
      {
        org: "Pyroguards (CBE)",
        role: "App & AI Developer Intern",
        period: "Jan 2025 – Mar 2025",
        highlight: "Cyber Threat & Phishing Detection",
        bullets: "• 98.4% URL classifier accuracy on 1.2M signatures | • Dockerized FastAPI model achieving 95ms median response time | • Zero dataset imbalance bias",
        color: t.accent,
      },
      {
        org: "Literate Spork",
        role: "Founder & Community Lead",
        period: "2024 – Present",
        highlight: "Open Source MLOps Community",
        bullets: "• Mentored 50+ students in hands-on MLOps and Agentic AI | • Maintained 20+ open-source project repos | • Conducted 40+ formal code reviews",
        color: t.cyan,
      },
    ];

    const itemH = 68;
    const itemsSvg = milestones.map((m, i) => {
      const y = 80 + i * itemH;
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
              <text font-family="${FONTS.sans}" font-size="13" font-weight="700" fill="${t.text}">${esc(m.role)}</text>
              <text x="${m.role.length * 8.5 + 8}" y="0" font-family="${FONTS.sans}" font-size="13" font-weight="600" fill="${m.color}">@ ${esc(m.org)}</text>
              <text x="760" y="0" text-anchor="end" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">${esc(m.period)}</text>
            </g>

            <g transform="translate(16, 42)">
              <text font-family="${FONTS.sans}" font-size="11" fill="${t.muted}">${esc(m.bullets)}</text>
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
      height: 440,
      theme,
      fullPage,
      title: "💼 Production Experience & Internships",
      badge: "4 INTERNSHIPS · 1 COMMUNITY FOUNDED · SCALED SYSTEMS",
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

