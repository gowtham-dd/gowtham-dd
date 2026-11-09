// Master Generator Script for Gowtham D's Portfolio
import { writeFile } from "node:fs/promises";
import { renderHero } from "./generate-hero.mjs";
import { renderPinnedCards } from "./generate-pinned.mjs";
import { renderBento } from "./generate-bento.mjs";
import { renderHackathons } from "./generate-hackathons.mjs";
import { renderActivity } from "./generate-activity.mjs";

const outDir = process.argv[2] || "dist";
const login = process.argv[3] || "gowtham-dd";
const RAW = `https://raw.githubusercontent.com/${login}/${login}/output`;

console.log(`Starting portfolio generation for @${login} into ${outDir}/...`);

// 1. Render all infographic visual modules
await renderHero(outDir);
await renderPinnedCards(login, outDir);
await renderBento(outDir);
await renderHackathons(outDir);
await renderActivity(outDir);

// 2. Generate Initial Contribution Snake SVGs if not present
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

// 3. Assemble README.md with direct Infographic Embeds & Verified Logos
function card(name, title, alt) {
  return `<a href="${RAW}/${name}-full.svg">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="${RAW}/${name}-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="${RAW}/${name}-light.svg" />
  <img width="100%" alt="${alt}" title="${title} — Click to inspect high-resolution view" src="${RAW}/${name}-dark.svg" />
</picture>
</a>

<br/>
`;
}

const readmeContent = `<!-- ═══════════════════════════════════════════════════════════════════════
     GOWTHAM D — AUTONOMOUS AI ENGINEER & MLOPS PORTFOLIO
     Palette: Obsidian (#08090C) · Solar Flame (#FF5722) · Amber (#FBBF24)
     ═══════════════════════════════════════════════════════════════════════ -->

<a href="https://gowthamdportfolio.vercel.app/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${RAW}/hero-banner-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="${RAW}/hero-banner-light.svg" />
    <img width="100%" alt="Gowtham D — AI Engineer and MLOps Specialist" title="Gowtham D Portfolio — Click to visit live site" src="${RAW}/hero-banner-dark.svg" />
  </picture>
</a>

<p align="center">
  <a href="https://gowthamdportfolio.vercel.app/" title="Live Portfolio Website"><img src="https://skillicons.dev/icons?i=vercel" height="38" alt="Portfolio" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/gowtham-duraipandi" title="LinkedIn Profile"><img src="https://skillicons.dev/icons?i=linkedin" height="38" alt="LinkedIn" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.kaggle.com/gowthamdd" title="Kaggle Profile"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kaggle/kaggle-original.svg" height="38" alt="Kaggle" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="mailto:gowthamd997@gmail.com" title="Direct Email"><img src="https://skillicons.dev/icons?i=gmail" height="38" alt="Email" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://github.com/gowtham-dd" title="GitHub Profile"><img src="https://skillicons.dev/icons?i=github" height="38" alt="GitHub" /></a>&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://drive.google.com/drive/folders/1y9U7M3kAHI-l3dXBDrwxpOjD9ULjhPvZ?usp=sharing" title="Google Drive Resume"><img src="https://img.shields.io/badge/RESUME-CV-FF5722?style=for-the-badge&logo=googledrive&logoColor=white" height="36" alt="Resume" /></a>
</p>

<br/>

${card("pinned-projects", "Pinned Repositories", "Gowtham D — Pinned Repositories Live from GitHub")}
${card("skills-bento", "Skills · Stack", "Technical Capabilities · Stack — Agentic AI, Deep Learning, MLOps, Vector Stores")}
${card("experience-timeline", "Experience Timeline", "Production Experience · Internships — Noukha, Pixel Cognitix, Alesa AI, Pyroguards")}
${card("hackathons-grid", "Hackathons · Honors", "Hackathons · Championship Awards — 3x 1st Prize, Best Paper, Gold Medal")}
${card("activity-radar", "Engineering Metrics", "Engineering Metrics · Code Distribution — 77 Repos, 12 Shipped Systems")}

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
