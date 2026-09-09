// 一覧ページ (dist/index.html) の HTML。見た目とヘッダーは mozumasu.com と共通で、
// スタイル (brand.css) と背景 (water.js) は https://mozumasu.com/ から直接読む。
// 読めなくても brand.css 無しの素の HTML として成立する構造にしておく。

export const escapeHtml = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const dateText = (d) => (d ? `<time datetime="${escapeHtml(d)}">${escapeHtml(d.replace(/-/g, "."))}</time>` : "");

const deckCard = (e, assetBase) => `      <article class="card glass">
        <a class="thumb" href="/${e.slug}/"><img src="${assetBase}/${e.slug}/cover.png" alt="" loading="lazy"><span class="badge">slides</span></a>
        <div class="body">
          <div class="meta">${dateText(e.date)}${e.event ? `<span class="venue">${escapeHtml(e.event)}</span>` : ""}</div>
          <h3><a href="/${e.slug}/">${escapeHtml(e.title)}</a></h3>${
            e.docswell
              ? `
          <div class="links"><a href="${escapeHtml(e.docswell)}" target="_blank" rel="noopener">docswell ›</a></div>`
              : ""
          }
        </div>
      </article>`;

const docswellCard = (d) => `      <article class="card glass">
        <a class="thumb" href="${escapeHtml(d.link)}" target="_blank" rel="noopener"><img src="${escapeHtml(d.image)}" alt="" loading="lazy"><span class="badge">docswell</span></a>
        <div class="body">
          <div class="meta">${dateText(d.date)}</div>
          <h3><a href="${escapeHtml(d.link)}" target="_blank" rel="noopener">${escapeHtml(d.title)}</a></h3>
        </div>
      </article>`;

// assetBase: デッキのカバー画像の置き場。本番は "" (同じオリジン)、ローカル確認では本番 URL
export function renderIndex({ listEntries, siteUrl, brand, assetBase = "" }) {
  const first = listEntries[0];
  const ogImage = first ? (first.kind === "docswell" ? first.image : `${siteUrl}/${first.slug}/cover.png`) : "";
  const cards = listEntries.map((e) => (e.kind === "deck" ? deckCard(e, assetBase) : docswellCard(e))).join("\n");
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Talks by mozumasu</title>
  <meta name="description" content="mozumasu の登壇資料">
  <meta name="theme-color" content="#2f9aa6">
  <link rel="icon" href="${brand}/favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" href="${brand}/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Talks by mozumasu">
  <meta property="og:description" content="mozumasu の登壇資料">
  <meta property="og:url" content="${siteUrl}/">
  <meta property="og:site_name" content="Talks by mozumasu">${ogImage ? `
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta name="twitter:card" content="summary_large_image">` : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${brand}/brand.css">
</head>
<body>
  <canvas id="water" class="bg" aria-hidden="true"></canvas>
  <div class="scrim bg" aria-hidden="true"></div>

  <div class="page">
    <header>
      <a class="brand" href="${brand}/"><img src="${brand}/icon-64.png" alt="" width="28" height="28"><span>mozumasu</span></a>
      <nav class="top" aria-label="sites">
        <a href="/" aria-current="page">Talks</a><span aria-hidden="true">/</span>
        <span title="coming soon">Blog</span><span aria-hidden="true">/</span>
        <a href="https://x.com/mozumasu" rel="me">X</a><span aria-hidden="true">/</span>
        <a href="https://github.com/mozumasu" rel="me">GitHub</a>
      </nav>
    </header>

    <main class="section">
      <div class="head"><h1>Talks</h1><small>登壇資料 · ${listEntries.length} 件 &nbsp;·&nbsp; <a href="${brand}/">mozumasu.com →</a></small></div>
      <div class="cards">
${cards}
      </div>
    </main>

    <footer>
      <div>© 2026 mozumasu</div>
      <div><a href="${brand}/">mozumasu.com</a> · talks.mozumasu.com</div>
    </footer>
  </div>

  <div class="grain bg" aria-hidden="true"><svg><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg></div>
  <script src="${brand}/water.js" defer></script>
</body>
</html>
`;
}
