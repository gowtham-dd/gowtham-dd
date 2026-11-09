// Master Generator Script for Gowtham D's Portfolio
import { writeFile } from "node:fs/promises";
import { renderHero } from "./generate-hero.mjs";
import { renderPinnedCards } from "./generate-pinned.mjs";
import { renderArchitecture } from "./generate-architecture.mjs";
import { renderBento } from "./generate-bento.mjs";
import { renderHackathons } from "./generate-hackathons.mjs";
import { renderActivity } from "./generate-activity.mjs";

const outDir = process.argv[2] || "dist";
const login = process.argv[3] || "gowtham-dd";
const RAW = `https://raw.githubusercontent.com/${login}/${login}/output`;

console.log(`Starting portfolio generation for @${login} into ${outDir}/...`);

// 1. Render all graphics
await renderHero(outDir);
await renderPinnedCards(login, outDir);
await renderArchitecture(outDir);
await renderBento(outDir);
await renderHackathons(outDir);
await renderActivity(outDir);

// 2. Generate Initial Snake SVGs if not present
const snakeDark = `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="150" viewBox="0 0 920 150" role="img" aria-label="Contribution snake">
  <rect width="920" height="150" rx="14" fill="#08090C" stroke="#1E2638"/>
  <text x="460" y="70" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif" font-size="15" font-weight="700" fill="#FF5722">🐍 Daily Contribution Heatmap Snake</text>
  <text x="460" y="94" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" fill="#94A3B8">Automated Grid Traversal Active · Synchronized with GitHub Actions</text>
</svg>`;

const snakeLight = `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="150" viewBox="0 0 920 150" role="img" aria-label="Contribution snake">
  <rect width="920" height="150" rx="14" fill="#F8FAFC" stroke="#E2E8F0"/>
  <text x="460" y="70" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif" font-size="15" font-weight="700" fill="#E04818">🐍 Daily Contribution Heatmap Snake</text>
  <text x="460" y="94" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" fill="#64748B">Automated Grid Traversal Active · Synchronized with GitHub Actions</text>
</svg>`;

await writeFile(`${outDir}/snake-dark.svg`, snakeDark);
await writeFile(`${outDir}/snake.svg`, snakeLight);

// 3. Assemble README.md
function card(name, title, alt) {
  return `<a href="${RAW}/${name}-full.svg">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${RAW}/${name}-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="${RAW}/${name}-light.svg" />
  <img width="100%" alt="${alt}" title="${title} — Click to inspect full resolution" src="${RAW}/${name}-dark.svg" />
</picture>
</a>

<br/>
`;
}

const readmeContent = `<!-- ═══════════════════════════════════════════════════════════════════════
     GOWTHAM D — AUTONOMOUS AI ENGINEER & MLOPS PORTFOLIO
     Palette: Obsidian (#08090C) · Solar Flame (#FF5722) · Amber (#FBBF24)
     Dynamically updated by scripts/build.mjs via GitHub Actions
     ═══════════════════════════════════════════════════════════════════════ -->

<a href="https://gowthamdportfolio.vercel.app/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${RAW}/hero-banner-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="${RAW}/hero-banner-light.svg" />
    <img width="100%" alt="Gowtham D — AI Engineer &amp; MLOps Specialist" title="Gowtham D Portfolio — Click to visit live site" src="${RAW}/hero-banner-dark.svg" />
  </picture>
</a>

<p align="center">
  <a href="https://gowthamdportfolio.vercel.app/"><img src="https://img.shields.io/badge/Portfolio-gowthamdportfolio.vercel.app-08090C?style=flat-square&labelColor=FF5722" alt="Portfolio" /></a>
  <a href="https://www.linkedin.com/in/gowtham-duraipandi"><img src="https://img.shields.io/badge/LinkedIn-Gowtham_D-08090C?style=flat-square&labelColor=1E2638" alt="LinkedIn" /></a>
  <a href="https://www.kaggle.com/gowthamdd"><img src="https://img.shields.io/badge/Kaggle-Expert-08090C?style=flat-square&logo=kaggle&logoColor=FF5722&labelColor=1E2638" alt="Kaggle" /></a>
  <a href="mailto:gowthamd997@gmail.com"><img src="https://img.shields.io/badge/Email-gowthamd997@gmail.com-08090C?style=flat-square&logo=gmail&logoColor=FF5722&labelColor=1E2638" alt="Email" /></a>
  <a href="https://drive.google.com/drive/folders/1y9U7M3kAHI-l3dXBDrwxpOjD9ULjhPvZ?usp=sharing"><img src="https://img.shields.io/badge/Resume-Google_Drive-08090C?style=flat-square&labelColor=FF5722" alt="Resume" /></a>
  <img src="https://komarev.com/ghpvc/?username=gowtham-dd&label=profile+views&color=08090C&style=flat-square" alt="Views" />
  <img src="https://img.shields.io/github/followers/gowtham-dd?label=followers&style=flat-square&color=08090C&labelColor=1E2638" alt="Followers" />
</p>

<br/>

${card("pinned-projects", "Pinned Projects", "Gowtham D — Pinned Repositories Live from GitHub")}
${card("ai-architecture", "AI Architecture", "Production Multi-Agent Architecture — LangGraph & MLOps")}
${card("skills-bento", "Skills & Stack", "Technical Capabilities & Stack — Agentic AI, Deep Learning, MLOps, Vector Stores")}
${card("experience-timeline", "Experience Timeline", "Production Experience & Internships — Noukha, Pixel Cognitix, Alesa AI, Pyroguards")}
${card("hackathons-grid", "Hackathons & Honors", "Hackathons & Championship Awards — 3x 1st Prize, Best Paper, Gold Medal")}
${card("activity-radar", "Engineering Metrics", "Engineering Metrics & Code Distribution — 77 Repos, 12 Shipped Systems")}

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${RAW}/snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="${RAW}/snake.svg" />
  <img width="100%" alt="Contribution snake animation" src="${RAW}/snake.svg" />
</picture>

<p align="center">
  <sub>All graphics rendered automatically from live GitHub data and production source code · Click any card for high-resolution view</sub>
</p>
`;

await writeFile("README.md", readmeContent);
console.log("Successfully generated all graphics and updated README.md!");
