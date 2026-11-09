export async function graphql(query, variables = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "github-profile-generator",
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) {
      console.warn(`GitHub GraphQL warning: HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (data.errors) {
      console.warn("GitHub GraphQL errors:", data.errors[0]?.message);
      return null;
    }
    return data.data;
  } catch (err) {
    console.warn("GraphQL fetch failed, using fallback data:", err.message);
    return null;
  }
}

// Fallback for Gowtham's pinned repositories if API token is absent
export const FALLBACK_PINNED = [
  {
    name: "FHIRFlow",
    description: "Healthcare Claims Multi-Agent Intelligence System built with LangGraph, Groq LLaMA 3.1, Pinecone & Deepgram.",
    url: "https://github.com/gowtham-dd/FHIRFlow",
    stargazerCount: 6,
    forkCount: 1,
    primaryLanguage: { name: "Python", color: "#3572A5" },
    tag: "AGENTIC AI",
  },
  {
    name: "NeoVerse",
    description: "Real-time AI multi-agent surveillance monitoring Telegram & Reddit using LLaMA 3 & HDBSCAN clustering for drug traffic detection.",
    url: "https://github.com/gowtham-dd/NeoVerse",
    stargazerCount: 4,
    forkCount: 1,
    primaryLanguage: { name: "Python", color: "#3572A5" },
    tag: "MULTI-AGENT",
  },
  {
    name: "PR-Reviewer-Agent",
    description: "Autonomous GitHub App Agent that reviews diffs, detects bugs, runs test suites, and automates CI/CD redeployments.",
    url: "https://github.com/gowtham-dd/PR-Reviewer-Agent",
    stargazerCount: 3,
    forkCount: 0,
    primaryLanguage: { name: "Python", color: "#3572A5" },
    tag: "DEVOPS AI",
  },
  {
    name: "DroneBasedTaxation",
    description: "GramAI geospatial analysis platform using orthophoto tiles for automated building footprint extraction and compliance auditing.",
    url: "https://github.com/gowtham-dd/DroneBasedTaxation",
    stargazerCount: 3,
    forkCount: 1,
    primaryLanguage: { name: "Python", color: "#3572A5" },
    tag: "GEOSPATIAL",
  },
  {
    name: "NVDNLP",
    description: "Autonomous Vulnerability Enforcement Agent continuously monitoring CVE disclosures from NVD with automated remediation.",
    url: "https://github.com/gowtham-dd/NVDNLP",
    stargazerCount: 2,
    forkCount: 0,
    primaryLanguage: { name: "Python", color: "#3572A5" },
    tag: "SECURITY",
  },
  {
    name: "literate-spork",
    description: "Open-source GitHub learning community mentoring 50+ students in hands-on Data Science & MLOps development.",
    url: "https://github.com/gowtham-dd/literate-spork",
    stargazerCount: 4,
    forkCount: 2,
    primaryLanguage: { name: "Jupyter Notebook", color: "#DA5B0B" },
    tag: "COMMUNITY",
  },
];

export async function fetchPinnedRepos(login = "gowtham-dd") {
  const query = `query($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }`;

  const data = await graphql(query, { login });
  const nodes = data?.user?.pinnedItems?.nodes;
  if (nodes && nodes.length > 0) {
    return nodes.map((r, i) => ({
      name: r.name,
      description: r.description || "Production-grade system codebase and architecture.",
      url: r.url,
      stargazerCount: r.stargazerCount || 0,
      forkCount: r.forkCount || 0,
      primaryLanguage: r.primaryLanguage || { name: "Python", color: "#3572A5" },
      tag: FALLBACK_PINNED[i]?.tag || "AI SYSTEM",
    }));
  }
  return FALLBACK_PINNED;
}

