// Generates interactive pinned project cards dynamically fetched from GitHub
import { THEME, FONTS, esc, wrapText, cardFrame, saveVariants } from "./lib/theme.mjs";
import { fetchPinnedRepos } from "./lib/github-api.mjs";

export async function renderPinnedCards(login = "gowtham-dd", outDir = "dist") {
  const repos = await fetchPinnedRepos(login);
  const W = 920;
  const H = 490;

  function render({ theme, fullPage }) {
    const t = THEME[theme];
    const cols = 2;
    const cardW = 416;
    const cardH = 120;
    const startX = 32;
    const startY = 74;
    const gapX = 24;
    const gapY = 16;

    const cardsSvg = repos.slice(0, 6).map((repo, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      const descLines = wrapText(repo.description, 48).slice(0, 2);
      const langColor = repo.primaryLanguage?.color || t.cyan;
      const langName = repo.primaryLanguage?.name || "Code";

      const tag = fullPage ? "a" : "g";
      const href = fullPage ? ` href="${esc(repo.url)}" target="_blank"` : "";

      return `
      <${tag} class="p-card"${href} transform="translate(${x}, ${y})">
        <!-- Card Backdrop -->
        <rect class="p-bg" width="${cardW}" height="${cardH}" rx="12" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
        
        <!-- Top bar: Repo title + Category Badge -->
        <g transform="translate(18, 28)">
          <!-- Repo SVG Icon -->
          <path d="M-2 -12 h7 a2 2 0 0 1 2 2 v11 a2 2 0 0 1 -2 2 h-7 a2 2 0 0 1 -2 -2 v-11 a2 2 0 0 1 2 -2 z M2 -8 v7" fill="none" stroke="${t.accent}" stroke-width="1.6"/>
          <text x="14" y="0" class="p-title" font-family="${FONTS.sans}" font-size="15" font-weight="700" fill="${t.text}">${esc(repo.name)}</text>
          
          <!-- Category Tag -->
          <rect x="${cardW - 146}" y="-13" width="92" height="18" rx="9" fill="${t.tagBg}" stroke="${t.border}" stroke-width="0.8"/>
          <text x="${cardW - 100}" y="0" text-anchor="middle" font-family="${FONTS.mono}" font-size="9" font-weight="700" fill="${t.accent}" letter-spacing="0.08em">${esc(repo.tag || "AI SYSTEM")}</text>
        </g>

        <!-- Description -->
        <g transform="translate(18, 56)">
          ${descLines.map((l, li) => `<text x="0" y="${li * 17}" font-family="${FONTS.sans}" font-size="12" fill="${t.muted}">${esc(l)}</text>`).join("\n")}
        </g>

        <!-- Bottom bar: Language + Stars + Forks -->
        <g transform="translate(18, 102)">
          <!-- Language indicator dot -->
          <circle cx="4" cy="-4" r="4" fill="${langColor}"/>
          <text x="14" y="0" font-family="${FONTS.mono}" font-size="11" fill="${t.text}">${esc(langName)}</text>

          <!-- Star count -->
          <g transform="translate(110, 0)">
            <path d="M0 -9 L2.5 -4 L8 -3.2 L4 -0.2 L5 5.5 L0 2.8 L-5 5.5 L-4 -0.2 L-8 -3.2 L-2.5 -4 Z" fill="${t.gold}" transform="scale(0.8)"/>
            <text x="12" y="0" font-family="${FONTS.mono}" font-size="11" fill="${t.muted}">${repo.stargazerCount}</text>
          </g>

          <!-- Fork count -->
          <g transform="translate(170, 0)">
            <circle cx="2" cy="-8" r="2.2" fill="none" stroke="${t.muted}" stroke-width="1.2"/>
            <circle cx="-3" cy="2" r="2.2" fill="none" stroke="${t.muted}" stroke-width="1.2"/>
            <circle cx="7" cy="2" r="2.2" fill="none" stroke="${t.muted}" stroke-width="1.2"/>
            <path d="M2 -6 V-3 C2 -1 -3 -1 -3 0 M2 -3 C2 -1 7 -1 7 0" fill="none" stroke="${t.muted}" stroke-width="1.2"/>
            <text x="16" y="0" font-family="${FONTS.mono}" font-size="11" fill="${t.muted}">${repo.forkCount}</text>
          </g>

          <!-- Link Arrow -->
          <text x="${cardW - 40}" y="0" text-anchor="end" class="p-arrow" font-family="${FONTS.mono}" font-size="12" fill="${t.accent}">→</text>
        </g>
      </${tag}>
      `;
    }).join("\n");

    const css = `
      .p-card{transition:transform 0.2s ease-out, filter 0.2s;cursor:pointer}
      .p-bg{transition:fill 0.2s, stroke 0.2s, stroke-width 0.2s}
      .p-card:hover .p-bg{fill:${t.surfaceHover};stroke:${t.accent};stroke-width:1.5}
      .p-card:hover .p-title{fill:${t.accent}}
      .p-card:hover .p-arrow{transform:translateX(3px)}
      .p-arrow{transition:transform 0.2s}
    `;

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      title: "📌 Pinned Repositories",
      badge: "LIVE FROM GITHUB · CLOUD SYNCED",
      icon: "📌",
      css,
      content: cardsSvg,
    });
  }

  await saveVariants({ outDir, filename: "pinned-projects", render });
  console.log(`wrote pinned-projects-{dark,light,full}.svg to ${outDir}`);
}

if (process.argv[1]?.endsWith("generate-pinned.mjs")) {
  await renderPinnedCards(process.argv[2] || "gowtham-dd", process.argv[3] || "dist");
}
