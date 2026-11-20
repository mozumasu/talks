---
layout: section
title: "03"
toc: 同じ操作を比べる
---

# 同じ操作を比べる

---
layout: default
title: "Case 1: Esc → . を続けて押すと"
toc: 引数を再利用する
tocLevel: 2
# クリック: 1-2 zsh / Bash のコマ送り / 3-6 fish のコマ送り。動いている側だけを明るくする
clicks: 6
---

<KeyMessage>zsh と Bash は<em>前のコマンドへ</em> / fish は<em>1 単語ずつ前へ</em></KeyMessage>

<div class="repeat-demo">
<div :class="$clicks <= 2 ? 'is-active' : 'is-dim'">
<TerminalDemo
  :step="Math.min($clicks, 2)"
  title="zsh / bash"
  :frames="[
    { history: ['❯ echo old one', '❯ cp config.yml backup/'], line: 'vim ', note: 'cp の引数を使いたい' },
    { key: 'Esc → .', history: ['❯ echo old one', '❯ cp config.yml backup/'], line: 'vim backup/', mark: [4, 11], note: '最後の引数が入る' },
    { key: 'Esc → .', history: ['❯ echo old one', '❯ cp config.yml backup/'], line: 'vim one', mark: [4, 7], note: '前のコマンドへ' },
  ]"
/>
</div>
<div :class="$clicks > 2 ? 'is-active' : 'is-dim'">
<TerminalDemo
  :step="Math.max(0, $clicks - 2)"
  title="fish"
  :frames="[
    { history: ['❯ echo old one', '❯ cp config.yml backup/'], line: 'vim ', note: 'cp の引数を使いたい' },
    { key: 'Esc → .', history: ['❯ echo old one', '❯ cp config.yml backup/'], line: 'vim backup/', mark: [4, 11], note: '最後の引数が入る' },
    { key: 'Esc → .', history: ['❯ echo old one', '❯ cp config.yml backup/'], line: 'vim config.yml', mark: [4, 14], note: '同じコマンドの前へ' },
    { key: 'Esc → .', history: ['❯ echo old one', '❯ cp config.yml backup/'], line: 'vim cp', mark: [4, 6], note: 'コマンド名まで来て' },
    { key: 'Esc → .', history: ['❯ echo old one', '❯ cp config.yml backup/'], line: 'vim one', mark: [4, 7], note: '前のコマンドへ' },
  ]"
/>
</div>
</div>

<RefNote>fish は Esc のあと 30 ms 以内に押す (<code>fish_escape_delay_ms</code> で延ばせる)</RefNote>

<style>
.repeat-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
/* ターミナルは 1 枚分の大きさで作られているので、半分の幅に縮める */
.repeat-demo > div {
  zoom: 0.8;
  transition: opacity 0.3s ease, filter 0.3s ease;
}
/* 半分の幅ではキーと説明が横に入らないので、説明はキーの下の行に置く */
.repeat-demo :deep(.terminal-demo-footer) {
  flex-wrap: wrap;
  align-content: flex-start;
  row-gap: 0.4rem;
  /* キーの有無で高さが変わると下の注記が動くので、2 行分の高さに固定する */
  height: 6rem;
}
.repeat-demo :deep(.terminal-demo-note) {
  flex-basis: 100%;
}
/* 動いていない側はグレーアウトする */
.repeat-demo > .is-dim {
  opacity: 0.35;
  filter: grayscale(1);
}
</style>

---
layout: default
title: "Case 1: 直前のコマンドの最後の引数を入れる"
---

<KeyMessage>3 つのシェルは<em>同じキー</em>で使える。<em>Nushell にはキーがない</em></KeyMessage>

| | 操作 | 機能の名前 |
|---|---|---|
| zsh | `Esc` → `.` | `insert-last-word` (Widget) |
| Bash | `Esc` → `.` | `yank-last-arg` (Readline の関数) |
| fish | `Esc` → `.` / `Esc` → `↑` | `history-token-search-backward` |
| Nushell | なし (`!$` で代用) | ― |

<RefNote>zsh 5.9 / Bash 5.3 / fish 4.9.3 / Nushell 0.116.1 の初期設定で試した</RefNote>

---
layout: default
title: "Case 1: 後ろから 2 つめの引数を入れる"
---

<KeyMessage>例: 直前の <code>cp config.yml backup/</code> から <em>config.yml</em> を入れたい</KeyMessage>

| | 数えて指定する | 連打してたどる |
|---|---|---|
| zsh | `Esc` → `2`、`Esc` → `.` | `Esc` → `.`、`Esc` → `,` を連打 (要設定) |
| Bash | `Esc` → `1`、`Esc` → `.` | なし (前のコマンドへ移る) |
| fish | なし | `Esc` → `.` を連打 |
| Nushell | なし | なし |

<RefNote>数引数は <em>zsh は後ろから</em>、<em>Bash は前から</em>数える / zsh の <code>Esc</code> → <code>,</code> は <code>copy-earlier-word</code> の設定が要る</RefNote>

---
layout: default
title: "Case 2: 履歴展開 !$ で比べる"
---

<KeyMessage>zsh と Bash は<em>すぐ実行</em>する。Nushell は<em>展開するだけ</em></KeyMessage>

| | `!$` を打って Enter | 実行せずに展開するには |
|---|---|---|
| zsh | 展開して実行 | Tab で展開 / `setopt hist_verify` |
| Bash | 展開して実行 | `Esc` → `^` (キャレット) で展開 / `shopt -s histverify` |
| fish | 履歴展開がない | ― |
| Nushell | 展開のみ | 最初からこの動き |

<RefNote><code>!$</code> = 直前のコマンドの最後の引数 / zsh と Bash は <code>magic-space</code> を Space に割り当てると、Space を押したときに展開される / 参照: <a href="https://www.nushell.sh/book/line_editor.html">Nushell: Reedline, Nu's Line Editor</a></RefNote>

---
layout: default
title: "Case 3: 取り消し・エディタで編集・一時退避"
toc: そのほかの編集操作
tocLevel: 2
---

| | 編集を取り消す | エディタで編集する | 書きかけを退避する |
|---|---|---|---|
| zsh | `Ctrl+-` | `Esc` → `e` (要設定) | `Esc` → `q` |
| Bash | `Ctrl+-` | `Ctrl+X Ctrl+E` <span class="warn-note">⚠ 閉じると実行される</span> | なし |
| fish | `Ctrl+-` / `Ctrl+Z` | `Esc` → `e` / `Esc` → `v` | なし |
| Nushell | `Ctrl+Z` | `Ctrl+O` | なし |

<style>
.warn-note {
  margin-left: 0.4em;
  color: var(--theme-red);
  font-size: 0.8em;
  font-weight: var(--theme-font-weight-bold);
}
</style>

---
layout: default
title: キーバインド比較まとめ
---

<KeyMessage>同じキーでも<em>機能の名前と動き</em>はシェルごとに違う</KeyMessage>

<table class="cmp-matrix">
<thead><tr><th></th><th>zsh</th><th>Bash</th><th>fish</th><th>Nushell</th></tr></thead>
<tbody>
<tr><th>最後の引数</th><td class="is-ok"><code>Esc → .</code></td><td class="is-ok"><code>Esc → .</code></td><td class="is-ok"><code>Esc → .</code></td><td class="is-none">なし</td></tr>
<tr><th>後ろから 2 つめの引数</th><td class="is-ok"><code>Esc → 2  Esc → .</code></td><td class="is-ok"><code>Esc → 1  Esc → .</code></td><td class="is-ok"><code>Esc → .</code><small>2 回押す</small></td><td class="is-none">なし</td></tr>
<tr><th>編集を取り消す</th><td class="is-ok"><code>Ctrl+-</code></td><td class="is-ok"><code>Ctrl+-</code></td><td class="is-ok"><code>Ctrl+-</code></td><td class="is-ok"><code>Ctrl+Z</code></td></tr>
<tr><th>エディタで編集</th><td class="is-cfg"><code>Esc → e</code><small>要設定</small></td><td class="is-warn"><code>Ctrl+X Ctrl+E</code><small>⚠ 閉じると実行</small></td><td class="is-ok"><code>Esc → e</code></td><td class="is-ok"><code>Ctrl+O</code></td></tr>
<tr><th>書きかけを退避</th><td class="is-ok"><code>Esc → q</code></td><td class="is-none">なし</td><td class="is-none">なし</td><td class="is-none">なし</td></tr>
</tbody>
</table>

<p class="cmp-legend"><span class="is-ok">最初から使える</span><span class="is-cfg">設定・自作が要る</span><span class="is-warn">動きが違う</span><span class="is-none">なし</span></p>

<style>
.cmp-matrix {
  width: 100%;
  margin-top: 1rem;
  border-collapse: separate;
  border-spacing: 0.35rem;
  font-size: 0.8rem;
}
.cmp-matrix th,
.cmp-matrix td {
  padding: 0.35rem 0.6rem;
  border: none;
  text-align: center;
  white-space: nowrap;
}
.cmp-matrix thead th {
  font-size: 0.9rem;
}
.cmp-matrix tbody th {
  text-align: left;
  font-weight: var(--theme-font-weight-bold);
}
.cmp-matrix code {
  padding: 0;
  background: none;
  font-size: 0.78rem;
}
.cmp-matrix small {
  display: block;
  font-size: 0.65rem;
}
/* 最初から使える: 赤の薄い地 / 設定が要る: 点線 / 動きが違う: 赤い枠 / なし: グレー */
.cmp-matrix .is-ok,
.cmp-legend .is-ok {
  border-radius: 0.4rem;
  background: var(--theme-red-soft);
}
.cmp-matrix .is-cfg,
.cmp-legend .is-cfg {
  border: 1.5px dashed var(--theme-gray-200);
  border-radius: 0.4rem;
}
.cmp-matrix .is-warn,
.cmp-legend .is-warn {
  border: 1.5px solid var(--theme-red);
  border-radius: 0.4rem;
  color: var(--theme-red);
}
.cmp-matrix .is-none,
.cmp-legend .is-none {
  color: var(--theme-gray-200);
}
.cmp-legend {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin: 0.3rem 0 0;
  font-size: 0.65rem;
}
.cmp-legend span {
  padding: 0.05rem 0.5rem;
}
</style>
