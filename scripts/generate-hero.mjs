// Generates high-tech AI Command Center Hero Banner with Real 3D Moving Animations
import { THEME, FONTS, esc, cardFrame, saveVariants } from "./lib/theme.mjs";

export async function renderHero(outDir = "dist") {
  const W = 920;
  const H = 260;

  function render({ theme, fullPage }) {
    const t = THEME[theme];

    // Isometric 3D AI Neural Cube matrix on the right
    const cubes = [
      { id: "c0", x: 740, y: 90, color: t.accent, delay: "0s" },
      { id: "c1", x: 792, y: 115, color: t.gold, delay: "0.6s" },
      { id: "c2", x: 688, y: 115, color: t.cyan, delay: "1.2s" },
      { id: "c3", x: 740, y: 142, color: t.purple, delay: "1.8s" },
      { id: "c4", x: 740, y: 38, color: t.accent, delay: "0.9s" },
    ];

    const isoCubesSvg = cubes.map((c) => {
      return `
        <g class="iso-cube ${c.id}" transform="translate(${c.x}, ${c.y})">
          <polygon points="0,-16 26,-2 0,12 -26,-2" fill="${c.color}" opacity="0.88"/>
          <polygon points="-26,-2 0,12 0,42 -26,28" fill="${c.color}" opacity="0.65"/>
          <polygon points="0,12 26,-2 26,28 0,42" fill="${c.color}" opacity="0.45"/>
        </g>
      `;
    }).join("");

    const css = `
      /* 3D Floating Isometric Levitation */
      @keyframes float0 { 0%, 100% { transform: translate(740px, 90px); } 50% { transform: translate(740px, 82px); } }
      @keyframes float1 { 0%, 100% { transform: translate(792px, 115px); } 50% { transform: translate(796px, 122px); } }
      @keyframes float2 { 0%, 100% { transform: translate(688px, 115px); } 50% { transform: translate(684px, 108px); } }
      @keyframes float3 { 0%, 100% { transform: translate(740px, 142px); } 50% { transform: translate(740px, 149px); } }
      @keyframes float4 { 0%, 100% { transform: translate(740px, 38px); } 50% { transform: translate(740px, 32px); } }

      .c0 { animation: float0 3.2s ease-in-out infinite; }
      .c1 { animation: float1 3.6s ease-in-out infinite; }
      .c2 { animation: float2 4.0s ease-in-out infinite; }
      .c3 { animation: float3 3.4s ease-in-out infinite; }
      .c4 { animation: float4 3.8s ease-in-out infinite; }

      /* 3D Gyroscopic Orbital Rings */
      @keyframes spinOrbit1 { to { stroke-dashoffset: -160; } }
      @keyframes spinOrbit2 { to { stroke-dashoffset: 160; } }
      .orbit-1 { stroke-dasharray: 14 8; animation: spinOrbit1 5s linear infinite; }
      .orbit-2 { stroke-dasharray: 10 6; animation: spinOrbit2 6s linear infinite; }

      /* Satellite Orbital Sweep */
      @keyframes satRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .sat-pivot {
        transform-origin: 740px 115px;
        animation: satRotate 9s linear infinite;
      }

      /* Neural Synapse Pulse Lines */
      @keyframes flowSynapse { to { stroke-dashoffset: -24; } }
      .synapse-line { stroke-dasharray: 4 4; animation: flowSynapse 1.6s linear infinite; }

      /* Telemetry Beacon Ping */
      @keyframes beaconPing {
        0% { r: 3.5; opacity: 0.9; }
        70% { r: 10; opacity: 0; }
        100% { r: 10; opacity: 0; }
      }
      .beacon-ring { animation: beaconPing 2s cubic-bezier(0, 0.2, 0.8, 1) infinite; }

      /* Central Core Energy Breathing */
      @keyframes coreBreathe {
        0%, 100% { opacity: 0.12; transform: scale(1); }
        50% { opacity: 0.24; transform: scale(1.08); }
      }
      .core-glow { transform-origin: 740px 115px; animation: coreBreathe 3.5s ease-in-out infinite; }
    `;

    return cardFrame({
      width: W,
      height: H,
      theme,
      fullPage,
      css,
      content: `
        <!-- Left Side: HUD Telemetry and Identity -->
        <g transform="translate(40, 42)">
          <rect width="270" height="24" rx="12" fill="${t.tagBg}" stroke="${t.border}" stroke-width="1"/>
          
          <!-- Animated Radar Beacon -->
          <circle class="beacon-ring" cx="14" cy="12" r="4" fill="${t.success}"/>
          <circle cx="14" cy="12" r="4" fill="${t.success}"/>
          
          <text x="28" y="16" font-family="${FONTS.mono}" font-size="9.5" font-weight="700" letter-spacing="0.08em" fill="${t.text}">SYSTEM STATUS: PRODUCTION ONLINE</text>

          <text x="0" y="74" font-family="${FONTS.sans}" font-size="44" font-weight="800" letter-spacing="-0.03em" fill="${t.text}">Gowtham D</text>
          <text x="245" y="66" font-family="${FONTS.mono}" font-size="11" font-weight="700" fill="${t.accent}" letter-spacing="0.1em">AI ENGINEER</text>

          <text x="0" y="104" font-family="${FONTS.sans}" font-size="15.5" font-weight="500" fill="${t.muted}">
            I build AI systems that <tspan fill="${t.accent}" font-weight="700">actually ship</tspan>. LangGraph multi-agents and automated MLOps.
          </text>
        </g>

        <!-- Right Side: Animated 3D Neural Core Visual -->
        <g>
          <!-- Pulsing Core Glow -->
          <circle class="core-glow" cx="740" cy="115" r="95" fill="${t.accent}"/>

          <!-- 3D Gyroscopic Perspective Rings -->
          <ellipse class="orbit-1" cx="740" cy="115" rx="88" ry="34" fill="none" stroke="${t.accent}" stroke-width="1.2" transform="rotate(-24 740 115)"/>
          <ellipse class="orbit-2" cx="740" cy="115" rx="88" ry="34" fill="none" stroke="${t.cyan}" stroke-width="1.2" transform="rotate(32 740 115)"/>

          <!-- Orbiting Satellite Node -->
          <g class="sat-pivot">
            <circle cx="835" cy="115" r="3.5" fill="${t.gold}"/>
            <circle cx="835" cy="115" r="6" fill="${t.gold}" opacity="0.3"/>
          </g>

          <!-- Neural Synapse Dynamic Connections -->
          <line class="synapse-line" x1="740" y1="40" x2="740" y2="90" stroke="${t.accent}" stroke-width="1.4"/>
          <line class="synapse-line" x1="690" y1="115" x2="740" y2="90" stroke="${t.cyan}" stroke-width="1.4"/>
          <line class="synapse-line" x1="740" y1="90" x2="790" y2="115" stroke="${t.gold}" stroke-width="1.4"/>
          <line class="synapse-line" x1="690" y1="115" x2="740" y2="140" stroke="${t.cyan}" stroke-width="1.4"/>
          <line class="synapse-line" x1="740" y1="140" x2="790" y2="115" stroke="${t.purple}" stroke-width="1.4"/>

          <!-- 3D Floating Isometric Cubes -->
          ${isoCubesSvg}
          
          <text x="740" y="200" text-anchor="middle" font-family="${FONTS.mono}" font-size="9.5" font-weight="700" letter-spacing="0.1em" fill="${t.muted}">AUTONOMOUS NEURAL CORE</text>
        </g>

        <!-- Bottom Telemetry Ribbon -->
        <g transform="translate(40, 192)">
          <rect width="840" height="40" rx="10" fill="${t.surface}" stroke="${t.border}" stroke-width="1"/>
          
          <g transform="translate(0, 25)">
            <text x="24" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.accent}">🎓</tspan> M.Sc Systems (SKASC)
            </text>
            <text x="220" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.gold}">🏅</tspan> Data Science @ IIT Madras
            </text>
            <text x="440" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.cyan}">🤖</tspan> AI Intern @ Noukha + Pixel
            </text>
            <text x="670" font-family="${FONTS.mono}" font-size="10.5" fill="${t.muted}">
              <tspan fill="${t.accent}">🚀</tspan> Founder @ Literate Spork
            </text>
          </g>
        </g>
      `,
    });
  }

  await saveVariants({ outDir, filename: "hero-banner", render });
  console.log(`wrote hero-banner-{dark,light,full}.svg to ${outDir}`);
}

if (process.argv[1]?.endsWith("generate-hero.mjs")) {
  await renderHero(process.argv[2] || "dist");
}
