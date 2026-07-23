import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

// ── 1. デッキの列挙 ─────────────────────────────
// withFileTypes を付けると名前だけでなく「ディレクトリか?」も分かる
const decks = readdirSync("slides", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()
  .reverse(); // ディレクトリ名が日付始まりなので、逆順 = 新しい順

// ── 2. 各デッキのメタデータ収集 ─────────────────
function parseFrontmatter(mdPath) {
  const md = readFileSync(mdPath, "utf8");
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return fm;
}

const entries = decks.map((dir) => {
  const fm = parseFrontmatter(`slides/${dir}/slides.md`);
  const date = dir.match(/^\d{4}-\d{2}(-\d{2})?/)?.[0] ?? "";
  // frontmatter の slug: があれば優先、なければディレクトリ名から日付を剥がす
  const slug = fm.slug ?? dir.replace(/^\d{4}-\d{2}(-\d{2})?-/, "");
  return { dir, slug, date, title: fm.title ?? dir, event: fm.event ?? "" };
});

// ── 3. slug の重複検出 ──────────────────────────
const seen = new Map();
for (const e of entries) {
  if (seen.has(e.slug)) {
    console.error(
      `slug "${e.slug}" が重複: ${seen.get(e.slug)} と ${e.dir}\n` +
      `どちらかの slides.md の frontmatter に slug: を指定して回避してください`,
    );
    process.exit(1);
  }
  seen.set(e.slug, e.dir);
}

// ── 4. 各デッキをビルドして dist/<slug> に集約 ──
rmSync("dist", { recursive: true, force: true });
for (const e of entries) {
  console.log(`\n=== build: ${e.dir} -> /${e.slug}/ ===`);
  execSync(
    `pnpm --filter ./slides/${e.dir} exec slidev build slides.md --base /${e.slug}/ --out ../../dist/${e.slug}`,
    { stdio: "inherit" },
  );
}

// ── 5. 一覧ページの生成 ─────────────────────────
const list = entries
  .map(
    (e) => `    <li>
      <a href="/${e.slug}/">${e.title}</a>
      <small>${[e.event, e.date].filter(Boolean).join(" · ")}</small>
    </li>`,
  )
  .join("\n");

writeFileSync(
  "dist/index.html",
  `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Talks by mozumasu</title>
</head>
<body>
  <h1>Talks</h1>
  <ul>
${list}
  </ul>
</body>
</html>
`,
);
console.log(`\ndist/index.html を生成 (${entries.length} 件)`);
