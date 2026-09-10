import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { escapeHtml, renderIndex } from "./index-page.mjs";

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

// 一覧のソートキー。frontmatter の date: (YYYY-MM-DD) が無ければディレクトリ名の
// 日付を使い、月までしか無ければ 1 日扱いにする
function deckDate(dir, fm) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(fm.date ?? "")) return fm.date;
  const m = dir.match(/^(\d{4}-\d{2})(-\d{2})?/);
  if (!m) return "";
  return m[1] + (m[2] ?? "-01");
}

const allEntries = decks.map((dir) => {
  const fm = parseFrontmatter(`slides/${dir}/slides.md`);
  // frontmatter の slug: があれば優先、なければディレクトリ名から日付を剥がす
  const slug = fm.slug ?? dir.replace(/^\d{4}-\d{2}(-\d{2})?-/, "");
  return {
    kind: "deck",
    dir,
    slug,
    date: deckDate(dir, fm),
    title: fm.title ?? dir,
    event: fm.event ?? "",
    docswell: fm.docswell ?? "",
    draft: fm.draft === "true",
    // unlisted: 配信はするが一覧に載せない (URL を知っている人にだけ見せる)。
    // draft がビルドごと止めるのに対し、こちらは dist/<slug>/ を作る
    unlisted: fm.unlisted === "true",
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
// 一覧に載せるデッキ。ビルド対象 (entries) とは別に持つ
const listed = entries.filter((e) => !e.unlisted);
for (const e of entries.filter((e) => e.unlisted)) {
  console.log(`unlisted: ${e.dir} -> /${e.slug}/ (ビルドするが一覧に載せない)`);
}

// ── 3. slug の検証と重複検出 ────────────────────
// slug は URL とキャッシュのパスに使うので、英数字とハイフン以外は通さない
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const seen = new Map();
for (const e of allEntries) {
  if (!SLUG_RE.test(e.slug)) {
    console.error(`slug "${e.slug}" (${e.dir}) が ${SLUG_RE} を満たしません`);
    process.exit(1);
  }
  if (seen.has(e.slug)) {
    console.error(
      `slug "${e.slug}" が重複: ${seen.get(e.slug)} と ${e.dir}\n` +
      `どちらかの slides.md の frontmatter に slug: を指定して回避してください`,
    );
    process.exit(1);
  }
  seen.set(e.slug, e.dir);
}

// ── 4. OGP 用のメタタグ注入 ─────────────────────
// og:image / og:url は絶対 URL でないと SNS のクローラが解決しないが、Slidev の seoMeta は
// --base を付けてくれない。配信元 URL を知っているのはここだけなので、ビルド後の
// index.html に不足分を足す。デッキが seoMeta で明示したタグは上書きしない
const SITE_URL = (() => {
  const pattern = readFileSync("wrangler.jsonc", "utf8").match(/"pattern":\s*"([^"]+)"/)?.[1];
  if (!pattern) {
    console.error("wrangler.jsonc の routes[].pattern から配信元ドメインを取れません");
    process.exit(1);
  }
  return `https://${pattern}`;
})();
// 一覧ページの共通スタイルと背景の配信元。ローカル確認では BRAND_BASE で差し替える
const BRAND = process.env.BRAND_BASE ?? "https://mozumasu.com";
// INDEX_ONLY=1: デッキをビルドせず dist/index.html だけ生成する (一覧のローカル確認用)。
// カバー画像は手元に無いので本番から読む
const indexOnly = process.env.INDEX_ONLY === "1";

const metaAttr = (t) => (t.property ? `property="${t.property}"` : `name="${t.name}"`);

// tags: [{ property | name, content }]。同名タグがあれば残し、無いものだけ </head> の前に足す。
// replace に挙げたタグは中身を差し替える (Slidev が info の生値を入れる description 用)
function injectMeta(htmlPath, tags, replace = []) {
  let html = readFileSync(htmlPath, "utf8");
  for (const t of replace) {
    html = html.replace(new RegExp(`<meta ${metaAttr(t)} content="[^"]*">`), `<meta ${metaAttr(t)} content="${escapeHtml(t.content)}">`);
  }
  const metas = tags
    .filter((t) => !html.includes(metaAttr(t)))
    .map((t) => `<meta ${metaAttr(t)} content="${escapeHtml(t.content)}">`)
    .join("\n");
  writeFileSync(htmlPath, html.replace("</head>", `${metas}\n</head>`));
}

// ── 5. docswell の RSS 取得 ─────────────────────
// 依存を増やさず正規表現で抜く。RSS の値はそのまま HTML に出すので信用しない
const DOCSWELL_FEED = "https://www.docswell.com/user/mozumasu/feed";
const MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

// pubDate は RFC 822 で年が 2 桁 ("Thu, 02 Apr 26 11:30:00 +0900")。Date.parse に
// 任せると世紀の解釈が処理系依存なので自前で YYYY-MM-DD に直す
function parsePubDate(s) {
  const m = s.match(/^\w{3}, (\d{1,2}) (\w{3}) (\d{2}|\d{4}) /);
  if (!m || !MONTHS[m[2]]) return null;
  const year = m[3].length === 2 ? `20${m[3]}` : m[3];
  return `${year}-${MONTHS[m[2]]}-${m[1].padStart(2, "0")}`;
}

// 突合用。RSS の link には ?ref=rss が付くので query を落として比べる
const canonical = (url) => url.replace(/[?#].*$/, "").replace(/\/$/, "");

async function fetchDocswell() {
  let xml;
  try {
    const res = await fetch(DOCSWELL_FEED);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.error(`docswell の RSS 取得に失敗: ${DOCSWELL_FEED}\n${err}`);
    process.exit(1);
  }
  const items = [];
  for (const [, body] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = body.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1].trim();
    const link = body.match(/<link>\s*([^<\s]+)\s*<\/link>/)?.[1];
    const date = parsePubDate(body.match(/<pubDate>\s*([^<]+?)\s*<\/pubDate>/)?.[1] ?? "");
    const image = body.match(/<media:thumbnail\b[^>]*\burl="([^"]+)"/)?.[1];
    if (!title || !link || !date || !image || !link.startsWith("https://") || !image.startsWith("https://")) {
      console.error(`docswell の RSS item を解釈できない (構造が変わった?):\n${body}`);
      process.exit(1);
    }
    items.push({
      kind: "docswell",
      // docswell 側が付ける "[スライド] " の接頭辞は一覧では不要
      title: title.replace(/^\[スライド\]\s*/, ""),
      link,
      date,
      image,
    });
  }
  if (items.length === 0) {
    console.error(`docswell の RSS に item が無い (構造が変わった?): ${DOCSWELL_FEED}`);
    process.exit(1);
  }
  return items;
}

const docswellItems = await fetchDocswell();
console.log(`docswell: ${docswellItems.length} 件`);

// ── 6. デッキごとのビルドキャッシュ ─────────────
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
  addFile("wrangler.jsonc"); // SITE_URL の元。og:url に入る
  addFile("scripts/build.mjs");
  return h.digest("hex").slice(0, 32);
}

// 削除・改名されたデッキのキャッシュは誰も消さないので、現存する slug 以外を掃除する
if (useCache && existsSync(CACHE_DIR)) {
  const live = new Set(allEntries.map((e) => e.slug));
  for (const slug of readdirSync(CACHE_DIR)) {
    if (!live.has(slug)) rmSync(`${CACHE_DIR}/${slug}`, { recursive: true, force: true });
  }
}

// ── 7. 各デッキをビルドして dist/<slug> に集約 ──
if (!indexOnly) rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
for (const e of indexOnly ? [] : entries) {
  const hash = useCache ? hashInputs(e) : null;
  const cached = hash && `${CACHE_DIR}/${e.slug}/${hash}`;
  // 中身の欠けたエントリを掴まないよう、必須ファイルの存在まで見てからヒット扱いにする
  if (cached && existsSync(`${cached}/index.html`) && existsSync(`${cached}/cover.png`)) {
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

  // 一覧のサムネイルと og:image を兼ねて 1 ページ目を PNG に書き出す (dist/<slug>/cover.png)。
  // scale 1.2 で 1200x675 になり、OGP が推奨する 1200 幅に揃う
  const exportDir = `dist/${e.slug}/.cover-export`;
  execSync(
    `pnpm --filter ./slides/${e.dir} exec slidev export slides.md --format png --range 1 --scale 1.2 --output ../../${exportDir}`,
    { stdio: "inherit" },
  );
  // 出力名は Slidev のバージョンで 1.png / 01.png が揺れる
  const exported = readdirSync(exportDir).find((f) => f.endsWith(".png"));
  renameSync(`${exportDir}/${exported}`, `dist/${e.slug}/cover.png`);
  rmSync(exportDir, { recursive: true, force: true });

  const deckUrl = `${SITE_URL}/${e.slug}/`;
  const description = e.event ? `${e.event} の登壇資料` : "登壇資料";
  injectMeta(
    `dist/${e.slug}/index.html`,
    [
      { property: "og:type", content: "article" },
      { property: "og:url", content: deckUrl },
      { property: "og:image", content: `${deckUrl}cover.png` },
      { property: "og:site_name", content: "Talks by mozumasu" },
      { name: "twitter:card", content: "summary_large_image" },
      // 一覧に無いデッキが検索結果から辿れると unlisted の意味が無いので、クローラにも隠す
      ...(e.unlisted ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    [
      { property: "og:title", content: e.title },
      { property: "og:description", content: description },
      { name: "description", content: description },
    ],
  );

  if (cached) {
    // 同じ slug の古いハッシュは捨ててキャッシュが肥大化しないようにする
    rmSync(`${CACHE_DIR}/${e.slug}`, { recursive: true, force: true });
    cpSync(`dist/${e.slug}`, cached, { recursive: true });
  }
}

// ── 8. 一覧ページの生成 ─────────────────────────
// デッキの frontmatter docswell: と一致する RSS item は同じ登壇なので、デッキ側に寄せる
const linkedFromDecks = new Set(listed.filter((e) => e.docswell).map((e) => canonical(e.docswell)));
const listEntries = [...listed, ...docswellItems.filter((d) => !linkedFromDecks.has(canonical(d.link)))]
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

writeFileSync("dist/index.html", renderIndex({ listEntries, siteUrl: SITE_URL, brand: BRAND, assetBase: indexOnly ? SITE_URL : "" }));
console.log(`\ndist/index.html を生成 (${listEntries.length} 件: デッキ ${listed.length} + docswell ${listEntries.length - listed.length})`);
