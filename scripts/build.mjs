import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";

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

const includeDrafts = process.env.INCLUDE_DRAFTS === "1";

const allEntries = decks.map((dir) => {
  const fm = parseFrontmatter(`slides/${dir}/slides.md`);
  const date = dir.match(/^\d{4}-\d{2}(-\d{2})?/)?.[0] ?? "";
  // frontmatter の slug: があれば優先、なければディレクトリ名から日付を剥がす
  const slug = fm.slug ?? dir.replace(/^\d{4}-\d{2}(-\d{2})?-/, "");
  return {
    dir,
    slug,
    date,
    title: fm.title ?? dir,
    event: fm.event ?? "",
    draft: fm.draft === "true",
  };
});

const entries = allEntries.filter((e) => includeDrafts || !e.draft);
for (const e of allEntries.filter((e) => e.draft)) {
  console.log(
    includeDrafts
      ? `draft: ${e.dir} (INCLUDE_DRAFTS=1 のためビルドに含める)`
      : `draft: ${e.dir} をスキップ`,
  );
}

// ── 3. slug の重複検出 ──────────────────────────
const seen = new Map();
for (const e of allEntries) {
  if (seen.has(e.slug)) {
    console.error(
      `slug "${e.slug}" が重複: ${seen.get(e.slug)} と ${e.dir}\n` +
      `どちらかの slides.md の frontmatter に slug: を指定して回避してください`,
    );
    process.exit(1);
  }
  seen.set(e.slug, e.dir);
}

// ── 4. デッキごとのビルドキャッシュ ─────────────
// 入力 (デッキのファイル、link: 参照しているテーマ、lockfile、このスクリプト) の
// ハッシュが一致するビルド成果物が .cache/decks/<slug>/<hash>/ にあれば再利用する。
// CI では .cache/decks を actions/cache で持ち越す。DECK_CACHE=0 で無効化できる
const CACHE_DIR = ".cache/decks";
const useCache = process.env.DECK_CACHE !== "0";

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const p = `${dir}/${entry.name}`;
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.isFile()) yield p;
  }
}

function hashInputs(e) {
  const h = createHash("sha256");
  const addFile = (p) => {
    h.update(p);
    h.update(readFileSync(p));
  };
  const addTree = (dir) => {
    for (const p of walk(dir)) addFile(p);
  };
  addTree(`slides/${e.dir}`);
  // link: 参照のテーマ・アドオンは lockfile に内容が載らないので、実体と
  // リンク先リポジトリの lockfile (テーマ側の依存) を辿ってハッシュする
  const pkg = JSON.parse(readFileSync(`slides/${e.dir}/package.json`, "utf8"));
  for (const spec of Object.values({ ...pkg.dependencies, ...pkg.devDependencies })) {
    if (typeof spec !== "string" || !spec.startsWith("link:")) continue;
    const linked = resolve(`slides/${e.dir}`, spec.slice("link:".length));
    addTree(linked);
    for (let dir = linked; dir !== dirname(dir); dir = dirname(dir)) {
      if (existsSync(`${dir}/pnpm-lock.yaml`)) {
        addFile(`${dir}/pnpm-lock.yaml`);
        break;
      }
    }
  }
  addFile("pnpm-lock.yaml");
  addFile("scripts/build.mjs");
  return h.digest("hex").slice(0, 16);
}

// ── 5. 各デッキをビルドして dist/<slug> に集約 ──
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
for (const e of entries) {
  const hash = useCache ? hashInputs(e) : null;
  const cached = hash && `${CACHE_DIR}/${e.slug}/${hash}`;
  if (cached && existsSync(cached)) {
    console.log(`\n=== cache hit: ${e.dir} -> /${e.slug}/ (${hash}) ===`);
    cpSync(cached, `dist/${e.slug}`, { recursive: true });
    continue;
  }

  console.log(`\n=== build: ${e.dir} -> /${e.slug}/ ===`);
  execSync(
    `pnpm --filter ./slides/${e.dir} exec slidev build slides.md --base /${e.slug}/ --out ../../dist/${e.slug}`,
    { stdio: "inherit" },
  );
  rmSync(`dist/${e.slug}/_redirects`, { force: true }); // Netlify 用の _redirects は不要なので削除

  // 一覧のサムネイルとして 1 ページ目を PNG に書き出す (dist/<slug>/cover.png)
  const exportDir = `dist/${e.slug}/.cover-export`;
  execSync(
    `pnpm --filter ./slides/${e.dir} exec slidev export slides.md --format png --range 1 --scale 1 --output ../../${exportDir}`,
    { stdio: "inherit" },
  );
  // 出力名は Slidev のバージョンで 1.png / 01.png が揺れる
  const exported = readdirSync(exportDir).find((f) => f.endsWith(".png"));
  renameSync(`${exportDir}/${exported}`, `dist/${e.slug}/cover.png`);
  rmSync(exportDir, { recursive: true, force: true });

  if (cached) {
    // 同じ slug の古いハッシュは捨ててキャッシュが肥大化しないようにする
    rmSync(`${CACHE_DIR}/${e.slug}`, { recursive: true, force: true });
    cpSync(`dist/${e.slug}`, cached, { recursive: true });
  }
}

// ── 6. 一覧ページの生成 ─────────────────────────
const escapeHtml = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const list = entries
  .map(
    (e) => `    <li class="card">
      <a href="/${e.slug}/">
        <img src="/${e.slug}/cover.png" alt="" loading="lazy">
        <div class="meta">
          <div class="title">${escapeHtml(e.title)}</div>
          ${e.event ? `<div class="event">${escapeHtml(e.event)}</div>` : ""}
        </div>
      </a>
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
  <style>
    :root { color-scheme: light dark; }
    body { margin: 0; padding: 2rem 1.5rem; font-family: system-ui, -apple-system, sans-serif; background: #fafafa; color: #222; }
    @media (prefers-color-scheme: dark) { body { background: #111; color: #eee; } .card { background: #1c1c1e; border-color: #333; } .event { color: #aaa; } }
    h1 { margin: 0 0 1.5rem; font-size: 1.75rem; }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); max-width: 1200px; }
    .card { border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; background: #fff; transition: transform .15s ease, box-shadow .15s ease; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.12); }
    .card a { display: block; color: inherit; text-decoration: none; }
    .card img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
    .meta { padding: .8rem 1rem 1rem; }
    .title { font-weight: 700; line-height: 1.4; }
    .event { margin-top: .3rem; font-size: .85rem; color: #666; }
  </style>
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
