// Renders the static profile sections from data/profile.json as interactive SVG cards.
// Usage: node scripts/cards.mjs [outDir]
import { readFile } from "node:fs/promises";
import { MONO, SANS, THEMES, esc, frame, hoverRules, iso, wrap, writeVariants } from "./lib/svg.mjs";

const W = 880;
const profile = JSON.parse(await readFile(new URL("../data/profile.json", import.meta.url), "utf8"));

function chips({ items, x, y, maxWidth, t }) {
  let [cx, cy] = [x, y];
  return items
    .map((item) => {
      const w = item.length * 6.9 + 18;
      if (cx + w > x + maxWidth) [cx, cy] = [x, cy + 28];
      const out =
        `<rect x="${cx}" y="${cy}" width="${w}" height="22" rx="11" fill="none" stroke="${t.line}"/>` +
        `<text x="${cx + w / 2}" y="${cy + 15}" text-anchor="middle" class="chip">${esc(item)}</text>`;
      cx += w + 8;
      return out;
    })
    .join("");
}

const chipCss = (t) => `  .chip{font:500 11.5px ${MONO};fill:${t.text}}`;

// 01 — Terminal that types itself; hovering a line reveals an inline comment.
function about({ theme, fullPage }) {
  const t = THEMES[theme];
  const { whoami, rows } = profile.about;
  const [x, lh, cw] = [60, 26, 8.4];
  const lineY = (k) => 150 + k * lh;
  const promptLine = 4 + rows.length;
  const H = lineY(promptLine) + 52;
  const keyWidth = Math.max(...rows.map((r) => r.key.length)) + 1;
  const valueCol = x + (keyWidth + 2) * cw;
  const noteCol = valueCol + (Math.max(...rows.map((r) => r.value.length)) + 3) * cw;

  const typed = ({ k, cmd, begin }) => {
    const chars = cmd.length + 2;
    const steps = Array.from({ length: chars + 1 }, (_, n) => (n === chars ? 900 : n * cw).toFixed(1)).join(";");
    return (
      `<clipPath id="ty${k}"><rect x="${x - 2}" y="${lineY(k) - 17}" height="24" width="0">` +
      `<animate attributeName="width" values="${steps}" dur="${(chars * 0.06).toFixed(2)}s" begin="${begin}s" fill="freeze" calcMode="discrete"/></rect></clipPath>` +
      `<text x="${x}" y="${lineY(k)}" class="tm" clip-path="url(#ty${k})"><tspan class="pr">$</tspan> ${esc(cmd)}</text>`
    );
  };
  const rowsStart = 2.5;
  const rowSvg = rows
    .map(
      (r, n) =>
        `<g id="r${n}" class="row ln" style="animation-delay:${(rowsStart + n * 0.12).toFixed(2)}s">` +
        `<rect class="hl" x="${x - 12}" y="${lineY(4 + n) - 18}" width="${W - 2 * (x - 12)}" height="${lh}" rx="6"/>` +
        `<text x="${x}" y="${lineY(4 + n)}" class="tm"><tspan class="key">${esc(r.key)}</tspan>` +
        `<tspan class="dim" x="${x + keyWidth * cw}">:</tspan><tspan x="${valueCol}">${esc(r.value)}</tspan></text></g>`,
    )
    .join("\n");
  const notes = rows
    .map((r, n) => `<text id="n${n}" class="tm note" x="${noteCol}" y="${lineY(4 + n)}"># ${esc(r.note)}</text>`)
    .join("");
  const promptAt = (rowsStart + rows.length * 0.12 + 0.2).toFixed(2);

  const css = `${chipCss(t)}
  .tm{font:500 14px ${MONO};fill:${t.text}}
  .pr{fill:${t.accent};font-weight:700}
  .key{fill:${t.accent}}
  .dim{fill:${t.muted}}
  .out{fill:${t.muted}}
  .ln{animation:show .35s ease-out both}
  @keyframes show{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
  .cur{animation:show .2s ${promptAt}s both,blink 1.1s ${promptAt}s steps(1) infinite}
  @keyframes blink{50%{opacity:0}}
  .hl{fill:${t.accent};opacity:0;transition:opacity .15s}
  .row:hover .hl{opacity:.12}
  .note{fill:${t.muted};opacity:0;transition:opacity .15s}
  ${hoverRules({ triggers: ["r"], panel: "notes", target: "n", count: rows.length })}`;

  const body = `
<rect x="32" y="76" width="${W - 64}" height="${H - 108}" rx="12" fill="${t.panel}" stroke="${t.line}"/>
<circle cx="54" cy="96" r="5" fill="${t.accent}"/><circle cx="72" cy="96" r="5" fill="${t.line}"/><circle cx="90" cy="96" r="5" fill="${t.line}"/>
<text x="${W / 2}" y="100" text-anchor="middle" class="cap">gowtham@ai-station: ~ — zsh</text>
<line x1="32" y1="114" x2="${W - 32}" y2="114" stroke="${t.line}"/>
${typed({ k: 0, cmd: "whoami", begin: 0.3 })}
<text x="${x}" y="${lineY(1)}" class="tm out ln" style="animation-delay:1s">${esc(whoami)}</text>
${typed({ k: 3, cmd: "cat profile.yml", begin: 1.4 })}
${rowSvg}
<g id="notes">${notes}</g>
<text x="${x}" y="${lineY(promptLine)}" class="tm ln" style="animation-delay:${promptAt}s"><tspan class="pr">$</tspan></text>
<rect class="cur" x="${x + 2 * cw}" y="${lineY(promptLine) - 14}" width="${cw}" height="18" fill="${t.accent}"/>`;
  return frame({ W, H, theme, fullPage, label: "01 — ABOUT", aria: `About: ${whoami}`, css, body });
}

// 02 — Isometric podium; pillar height encodes placing, hover lifts it and names the venue.
function hackathons({ theme, fullPage }) {
  const t = THEMES[theme];
  const list = profile.hackathons;
  const H = 460;
  const { pt, poly, box } = iso({ ox: 95, oy: 216, size: 36 });
  const heightOf = (rank) => 48 + (5 - rank) * 24;
  const colorOf = (rank) => t.levels[Math.max(0, 4 - rank)];
  const step = 1.95;
  const span = (list.length - 1) * step + 1;

  const floor = `<polygon points="${poly([pt(-0.4, -0.4), pt(span + 0.4, -0.4), pt(span + 0.4, 1.4), pt(-0.4, 1.4)])}" fill="${t.panel}" stroke="${t.line}"/>`;
  const pillars = list
    .map((h, k) => {
      const i0 = k * step;
      const h1 = heightOf(h.rank);
      const [lx, ly] = pt(i0 + 0.5, 0.5, h1);
      return (
        `<g id="h${k}" class="p" style="animation-delay:${(0.15 + k * 0.1).toFixed(2)}s"><g class="lift">` +
        box({ i0, j0: 0, i1: i0 + 1, j1: 1, h1, color: colorOf(h.rank) }) +
        `<g class="tag"><text x="${lx}" y="${ly - 50}" text-anchor="middle" class="rk">${esc(h.result)}</text>` +
        `<text x="${lx}" y="${ly - 34}" text-anchor="middle" class="cap">${h.year}</text></g></g></g>`
      );
    })
    .join("\n");

  const px = 475;
  const rowY = (k) => 82 + k * 41;
  const rows = list
    .map(
      (h, k) =>
        `<g id="r${k}" class="row"><rect class="hl" x="${px - 14}" y="${rowY(k)}" width="${W - px - 18}" height="36" rx="8"/>` +
        `<text x="${px}" y="${rowY(k) + 22}" class="rk" style="fill:${t.accent}">${esc(h.result)}</text>` +
        `<text x="${px + 72}" y="${rowY(k) + 16}" class="txt">${esc(h.short)}</text>` +
        `<text x="${px + 72}" y="${rowY(k) + 30}" class="sub" style="font-size:11px">${esc(h.venue)}</text>` +
        `<text x="${W - 46}" y="${rowY(k) + 22}" text-anchor="end" class="cap">${h.year}</text></g>`,
    )
    .join("\n");
  const wins = list.filter((h) => h.rank === 1).length;
  const detailY = rowY(list.length) + 14;
  const details = list
    .map((h, k) => `<text id="d${k}" class="det txt" x="${px}" y="${detailY + 22}">${esc(h.event)}</text>`)
    .join("");

  const css = `
  .rk{font:700 12px ${MONO};fill:${t.text};letter-spacing:.06em}
  .p{animation:rise .8s cubic-bezier(.2,.8,.2,1) both}
  @keyframes rise{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
  .lift{transition:transform .25s cubic-bezier(.2,.8,.2,1),filter .25s}
  .p:hover .lift{transform:translateY(-14px);filter:brightness(1.25)}
  .hl{fill:${t.raised};stroke:${t.line};opacity:0;transition:opacity .15s}
  .row:hover .hl{opacity:1}
  ${list.map((_, k) => `#h${k}:hover~#r${k} .hl`).join(",")}{opacity:1}
  .det{opacity:0;transition:opacity .15s}
  .p:hover~#detail #dd,.row:hover~#detail #dd{opacity:0}
  ${hoverRules({ triggers: ["h", "r"], panel: "detail", target: "d", count: list.length })}`;

  const body = `${floor}
${pillars}
<line x1="${px - 24}" y1="76" x2="${px - 24}" y2="${H - 28}" stroke="${t.line}"/>
${rows}
<g id="detail"><text x="${px}" y="${detailY}" class="lbl">FULL TITLE</text>
<text id="dd" class="txt fade" x="${px}" y="${detailY + 22}"><tspan style="fill:${t.accent};font-weight:700">${wins}× First Prize</tspan> · ${list.length} podium &amp; finalist finishes</text>
${details}</g>`;
  return frame({ W, H, theme, fullPage, label: "02 — HACKATHONS & WINS", aria: `${wins} hackathon first prizes, ${list.length} podium finishes`, css, body });
}

// 03 — Fanned card deck; hovering a card slides it out and shows the project in the side panel.
function work({ theme, fullPage }) {
  const t = THEMES[theme];
  const list = profile.projects;
  const H = 460;
  const [pivotX, pivotY] = [322, 700];
  const angles = list.map((_, k) => (k - (list.length - 1) / 2) * 11);

  const cards = list
    .map((p, k) => {
      const tag = fullPage && p.url ? "a" : "g";
      const href = fullPage && p.url ? ` href="${esc(p.url)}"` : "";
      const title = `<text transform="translate(-70 -470) rotate(-90)" text-anchor="end" class="spine">${esc(p.short)}</text>`;
      return (
        `<${tag} id="w${k}" class="card"${href}><g transform="rotate(${angles[k]} ${pivotX} ${pivotY})">` +
        `<animateTransform attributeName="transform" type="rotate" from="0 ${pivotX} ${pivotY}" to="${angles[k]} ${pivotX} ${pivotY}" dur="1s" begin="0.2s" fill="freeze" calcMode="spline" keySplines=".2 .8 .2 1"/>` +
        `<g transform="translate(${pivotX} ${pivotY})"><g class="slide">` +
        `<rect x="-100" y="-520" width="200" height="300" rx="14" class="face"/>` +
        `<text x="-82" y="-488" class="num">${String(k + 1).padStart(2, "0")}</text>` +
        title +
        `</g></g></g></${tag}>`
      );
    })
    .join("\n");

  const px = 620;
  const panelFor = (p, k, id, cls) => {
    const title = wrap(p.title, 22);
    const desc = wrap(p.description, 31);
    let y = 112;
    let out = `<g id="${id}" class="${cls}"><text x="${px}" y="${y - 18}" class="lbl">${String(k + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}</text>`;
    for (const l of title) out += `<text x="${px}" y="${(y += 24)}" class="big">${esc(l)}</text>`;
    y += 10;
    for (const l of desc) out += `<text x="${px}" y="${(y += 18)}" class="sub">${esc(l)}</text>`;
    out += chips({ items: p.stack, x: px, y: y + 16, maxWidth: W - px - 36, t });
    if (p.url) out += `<text x="${px}" y="${H - 44}" class="cap" style="fill:${t.accent}">${fullPage ? "CLICK THE CARD TO OPEN ↗" : "LIVE REPO AVAILABLE ↗"}</text>`;
    return `${out}</g>`;
  };

  const css = `${chipCss(t)}
  .face{fill:${t.raised};stroke:${t.line};transition:stroke .2s}
  .num{font:700 12px ${MONO};fill:${t.accent};letter-spacing:.1em}
  .spine{font:700 16px ${SANS};fill:${t.text}}
  .big{font:700 20px ${SANS};fill:${t.text}}
  .slide{transition:transform .3s cubic-bezier(.2,.8,.2,1)}
  .card:hover .slide{transform:translateY(-34px)}
  .card:hover .face{stroke:${t.accent}}
  .pp{opacity:0;transition:opacity .2s}
  .card:hover~#panel #pdef{opacity:0}
  ${hoverRules({ triggers: ["w"], panel: "panel", target: "p", count: list.length })}`;

  const body = `<clipPath id="clip"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="15"/></clipPath>
<g clip-path="url(#clip)">
<line x1="${px - 24}" y1="80" x2="${px - 24}" y2="${H - 36}" stroke="${t.line}"/>
${cards}
<g id="panel">${panelFor(list[0], 0, "pdef", "fade")}
${list.map((p, k) => panelFor(p, k, `p${k}`, "pp")).join("\n")}</g>
</g>`;
  return frame({ W, H, theme, fullPage, label: "03 — SELECTED WORK", aria: `Selected work: ${list.map((p) => p.title).join(", ")}`, css, body });
}

// 04 — Experience: Interactive Internship & Leadership Card
function experience({ theme, fullPage }) {
  const t = THEMES[theme];
  const list = profile.experience;
  const H = 400;
  const px = 72;
  const rowY = (k) => 110 + k * 65;

  const rows = list
    .map((e, k) => {
      const y = rowY(k);
      const impactLines = wrap(e.impact, 80);
      return (
        `<g id="e${k}" class="exp-row">` +
        `<rect class="hl" x="${px - 20}" y="${y - 18}" width="${W - px - 30}" height="58" rx="10"/>` +
        `<circle cx="${px - 6}" cy="${y + 2}" r="5" fill="${t.accent}"/>` +
        `<text x="${px + 14}" y="${y - 2}" class="txt" style="font-weight:700">${esc(e.role)}</text>` +
        `<text x="${px + 14 + e.role.length * 8.5 + 10}" y="${y - 2}" class="sub" style="fill:${t.accent}">@ ${esc(e.org)}</text>` +
        `<text x="${W - 60}" y="${y - 2}" text-anchor="end" class="cap">${esc(e.period)}</text>` +
        `<text x="${px + 14}" y="${y + 18}" class="sub" style="font-size:12px">${esc(impactLines[0] || "")}</text>` +
        `</g>`
      );
    })
    .join("\n");

  const css = `
  .exp-row{transition:transform .2s}
  .hl{fill:${t.raised};stroke:${t.line};opacity:0;transition:opacity .15s}
  .exp-row:hover .hl{opacity:1}
  .exp-row:hover{transform:translateX(4px)}`;

  const body = `
<line x1="${px - 6}" y1="100" x2="${px - 6}" y2="${rowY(list.length - 1) + 20}" stroke="${t.line}" stroke-width="2"/>
${rows}
<text x="${W - 60}" y="76" text-anchor="end" class="cap" style="fill:${t.accent}">4 INTERNSHIPS · 2 LEADERSHIP ROLES</text>`;
  return frame({ W, H, theme, fullPage, label: "04 — EXPERIENCE & IMPACT", aria: `Experience: ${list.map((e) => `${e.role} at ${e.org}`).join("; ")}`, css, body });
}

// 05 — Tilted orbits; tech pills circle the core and a hovered ring takes focus.
function stack({ theme, fullPage }) {
  const t = THEMES[theme];
  const groups = [...profile.stack].sort((a, b) => a.items.length - b.items.length);
  const H = 470;
  const [ox, oy, tilt] = [340, 266, 0.4];
  const radii = [100, 157, 213, 270];
  const durations = [70, 95, 120, 150];

  const core = iso({ ox, oy: oy + 14, size: 26 });
  const rings = groups
    .map((g, k) => {
      const r = radii[k];
      const dir = k % 2 ? -360 : 360;
      const nodes = g.items
        .map((item, n) => {
          const a0 = (360 / g.items.length) * n + k * 17;
          const w = item.length * 7 + 20;
          return (
            `<g transform="rotate(${a0}) translate(${r} 0) rotate(${-a0})"><g>` +
            `<animateTransform attributeName="transform" type="rotate" from="0" to="${-dir}" dur="${durations[k]}s" repeatCount="indefinite"/>` +
            `<g transform="scale(1 ${(1 / tilt).toFixed(4)})" class="node"><rect x="${-w / 2}" y="-11" width="${w}" height="22" rx="11"/>` +
            `<text y="4" text-anchor="middle" class="chip">${esc(item)}</text></g></g></g>`
          );
        })
        .join("");
      return (
        `<g id="s${k}" class="ring">` +
        `<ellipse cx="${ox}" cy="${oy}" rx="${r}" ry="${r * tilt}" class="hit"/>` +
        `<ellipse cx="${ox}" cy="${oy}" rx="${r}" ry="${r * tilt}" class="orbit"/>` +
        `<g transform="translate(${ox} ${oy}) scale(1 ${tilt})"><g>` +
        `<animateTransform attributeName="transform" type="rotate" from="0" to="${dir}" dur="${durations[k]}s" repeatCount="indefinite"/>` +
        `${nodes}</g></g></g>`
      );
    })
    .join("\n");

  const px = 680;
  const legendY = (k) => 144 + k * 34;
  const legend = groups
    .map(
      (g, k) =>
        `<circle cx="${px + 4}" cy="${legendY(k) - 4}" r="4" fill="${t.levels[3 - k]}"/>` +
        `<text x="${px + 18}" y="${legendY(k)}" class="txt">${esc(g.name)}</text>` +
        `<text x="${W - 40}" y="${legendY(k)}" text-anchor="end" class="cap">${g.items.length}</text>`,
    )
    .join("");
  const total = groups.reduce((s, g) => s + g.items.length, 0);
  const focus = groups
    .map((g, k) => {
      let out = `<g id="c${k}" class="foc"><text x="${px}" y="104" class="lbl">ORBIT ${k + 1} / ${groups.length}</text>` +
        `<text x="${px}" y="138" class="big">${esc(g.name)}</text>`;
      g.items.forEach((item, n) => {
        out += `<text x="${px}" y="${176 + n * 24}" class="txt"><tspan style="fill:${t.accent}">→</tspan> ${esc(item)}</text>`;
      });
      return `${out}</g>`;
    })
    .join("\n");

  const css = `${chipCss(t)}
  .big{font:700 22px ${SANS};fill:${t.text}}
  .hit{fill:none;stroke:transparent;stroke-width:30}
  .orbit{fill:none;stroke:${t.line};stroke-dasharray:3 5;transition:stroke .2s}
  .node rect{fill:${t.raised};stroke:${t.line};transition:fill .2s}
  .node:hover rect{fill:${t.accent}}
  .node:hover text{fill:${t.bg}}
  .ring{transition:opacity .25s}
  #sys:hover .ring{opacity:.25}
  #sys .ring:hover{opacity:1}
  .ring:hover .orbit{stroke:${t.accent};stroke-dasharray:none}
  .foc{opacity:0;transition:opacity .2s}
  .ring:hover~#panel #pdef{opacity:0}
  .float{animation:float 4s ease-in-out infinite}
  @keyframes float{50%{transform:translateY(-6px)}}
  ${hoverRules({ triggers: ["s"], panel: "panel", target: "c", count: groups.length })}`;

  const body = `<defs><radialGradient id="glow"><stop offset="0" stop-color="${t.accent}" stop-opacity=".28"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="${ox}" cy="${oy}" rx="120" ry="70" fill="url(#glow)"/>
<g class="float">${core.box({ i0: -0.5, j0: -0.5, i1: 0.5, j1: 0.5, h1: 30, color: t.accent })}</g>
<line x1="${px - 24}" y1="80" x2="${px - 24}" y2="${H - 36}" stroke="${t.line}"/>
<g id="sys">
${rings}
<g id="panel"><g id="pdef" class="fade"><text x="${px}" y="104" class="lbl">${total} TOOLS · ${groups.length} ORBITS</text>${legend}
<text x="${px}" y="${legendY(groups.length) + 10}" class="sub">Hover an orbit</text><text x="${px}" y="${legendY(groups.length) + 30}" class="sub">to focus it.</text></g>
${focus}</g>
</g>`;
  return frame({ W, H, theme, fullPage, label: "05 — TECH ARSENAL", aria: `Tech stack: ${groups.map((g) => `${g.name}: ${g.items.join(", ")}`).join("; ")}`, css, body });
}

const outDir = process.argv[2] ?? "dist";
for (const [name, render] of Object.entries({ about, hackathons, work, experience, stack })) {
  await writeVariants({ outDir, name, render });
}
console.log(`wrote about, hackathons, work, experience, stack to ${outDir}`);
