// .github/scripts/update-contributors.js
// Node 20+ (global fetch available). CommonJS to avoid ESM config requirements.

const fs = require("fs");
const process = require("process");

const README_PATH = process.env.README_PATH || "README.md";
const DETAILS_SUMMARY_TEXT =
  process.env.DETAILS_SUMMARY_TEXT || "<summary>Contributor Graph</summary>";
const START_MARKER = process.env.START_MARKER || "<!-- CONTRIBUTORS:START -->";
const END_MARKER = process.env.END_MARKER || "<!-- CONTRIBUTORS:END -->";
const AVATAR_SIZE = parseInt(process.env.AVATAR_SIZE || "48", 10);
const MAX_CONTRIBUTORS = parseInt(process.env.MAX_CONTRIBUTORS || "200", 10);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.github_token;
const REPOSITORY = process.env.GITHUB_REPOSITORY; // "owner/repo"
const [OWNER, REPO] = REPOSITORY ? REPOSITORY.split("/") : [null, null];

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}

function writeFile(p, content) {
  fs.writeFileSync(p, content, "utf8");
}

function hasRequiredSection(readme) {
  // Only check for markers, not the summary text (since we're using simple format)
  const hasMarkers =
    readme.includes(START_MARKER) && readme.includes(END_MARKER);
  return hasMarkers;
}

function replaceBetweenMarkers(readme, innerHtml) {
  const startIdx = readme.indexOf(START_MARKER);
  const endIdx = readme.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    // Safety: if markers are malformed, do nothing
    return readme;
  }

  const before = readme.slice(0, startIdx + START_MARKER.length);
  const after = readme.slice(endIdx);
  return `${before}\n${innerHtml}\n${after}`;
}

function buildContributorsHtml(contributors) {
  const imgs = contributors
    .map((c) => {
      const login = c.login ?? "user";
      const html_url = c.html_url ?? `https://github.com/${login}`;
      const avatar = c.avatar_url;
      const alt = login;

      // Extract user ID from GitHub avatar URL (e.g., "https://avatars.githubusercontent.com/u/87866666?v=4")
      const userIdMatch = avatar.match(/\/u\/(\d+)/);
      const userId = userIdMatch ? userIdMatch[1] : "";

      // Use weserv.nl for better circular avatar with border
      const webservAvatar = userId
        ? `https://images.weserv.nl/?url=avatars.githubusercontent.com%2Fu%2F${userId}%3Fv%3D4%26s%3D96&w=${AVATAR_SIZE}&h=${AVATAR_SIZE}&fit=cover&mask=circle&border=white&borderwidth=2`
        : avatar; // fallback to original if we can't extract user ID

      return `<a href="${html_url}" title="${login}"><img src="${webservAvatar}" alt="${alt}" width="${AVATAR_SIZE}" height="${AVATAR_SIZE}" style="border-radius: 50%;"/></a>`;
    })
    .join("\n");

  return `<p align="left">\n${imgs}\n</p>`;
}

async function fetchAllContributors(owner, repo, limit) {
  if (!owner || !repo) return [];

  const results = [];
  const perPage = Math.min(100, Math.max(1, limit));
  let page = 1;

  while (results.length < limit) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${perPage}&page=${page}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "update-contributors-script",
        Accept: "application/vnd.github+json",
        ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      },
    });

    if (!res.ok) {
      console.warn(
        `[update-contributors] GitHub API ${res.status} ${res.statusText} (page ${page}).`
      );
      break;
    }

    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    const filtered = batch.filter(
      (c) => c && c.type !== "Bot" && c.login !== "github-actions[bot]"
    );

    results.push(...filtered);

    if (batch.length < perPage) break;
    page += 1;
  }

  return results.slice(0, limit);
}

(async function main() {
  try {
    if (!fileExists(README_PATH)) {
      console.warn(
        `[update-contributors] README not found at "${README_PATH}". Skipping without error.`
      );
      process.exit(0);
      return;
    }

    const original = readFile(README_PATH);

    // Respect preference: do NOT auto-create any sections.
    if (!hasRequiredSection(original)) {
      console.log(
        `[update-contributors] Required section not found. Expecting BOTH:\n` +
          `  • ${DETAILS_SUMMARY_TEXT}\n` +
          `  • ${START_MARKER} ... ${END_MARKER}\n` +
          `No changes made. Exiting successfully.`
      );
      process.exit(0);
      return;
    }

    const contributors = await fetchAllContributors(
      OWNER,
      REPO,
      MAX_CONTRIBUTORS
    );

    if (!contributors.length) {
      console.log(
        "[update-contributors] No contributors returned (or API issue). Leaving current block unchanged."
      );
      process.exit(0);
      return;
    }

    const innerHtml = buildContributorsHtml(contributors);
    const updated = replaceBetweenMarkers(original, innerHtml);

    if (updated !== original) {
      writeFile(README_PATH, updated);
      console.log(
        `[update-contributors] Wrote ${contributors.length} contributor(s) into README.`
      );
    } else {
      console.log("[update-contributors] README already up to date.");
    }

    process.exit(0);
  } catch (err) {
    // Keep CI green; log and exit 0.
    console.warn(
      `[update-contributors] Non-fatal error: ${err?.message || String(err)}`
    );
    process.exit(0);
  }
})();
