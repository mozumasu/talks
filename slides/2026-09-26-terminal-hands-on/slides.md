---
theme: findy
title: 学生向けハンズオン～イケてるターミナルをつくろう！～
info: |
  テック文化祭 2026 by Findy Student
  学生向けハンズオン～イケてるターミナルをつくろう！～
class: text-left
comark: true
favicon: https://github.com/mozumasu.png
seoMeta:
  ogTitle: 学生向けハンズオン～イケてるターミナルをつくろう！～
  ogDescription: テック文化祭 2026 by Findy Student 学生向けハンズオン
  ogUrl: https://talks.mozumasu.com/terminal-hands-on/
  ogImage: https://talks.mozumasu.com/terminal-hands-on/og-image.png
  twitterCard: summary_large_image
date: 2026-09-26
addons:
  - slidev-addon-findy
layout: talk-cover
event: テック文化祭 2026 by Findy Student
image: https://github.com/mozumasu.png
name: mozumasu
role: Findy Inc. / SRE
---

## 学生向けハンズオン
# イケてるターミナル環境に入門しよう！ {style="font-size:3.25rem"}

---
layout: content
---

# このスライドの使い方

手元のブラウザで <https://talks.mozumasu.com/terminal-hands-on/> を開くと、同じスライドを自分のペースで見られます。 {.content-lead}

<FindyKeyValueList size="1.05rem" gap="1rem">
  <FindyKeyValue label="← →">前後のスライドへ移動（Space でも進める）</FindyKeyValue>
  <FindyKeyValue label="o">全スライドの一覧を開く。クリックでそのページへジャンプ</FindyKeyValue>
  <FindyKeyValue label="g">ページ番号を入力してジャンプ</FindyKeyValue>
  <FindyKeyValue label="f">フルスクリーン表示</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout>
  このあとの目次スライドも、項目をクリックするとそのページへジャンプできる
</FindyCallout>

---
layout: profile
image: https://github.com/mozumasu.png
name: mozumasu
role: Findy Inc. / SRE
---

## 自己紹介

- 開発環境: MacOS / WezTerm / Neovim / macSKK
- 一言: 麻辣湯に週3で行きます

<div class="mt-4 flex flex-wrap gap-2">
  <FindyBadge variant="soft">X: @mozumasu</FindyBadge>
  <FindyBadge variant="soft">GitHub: mozumasu</FindyBadge>
</div>

<div class="absolute top-10 right-14 flex flex-col items-center gap-1">
  <img :src="$asset('/slides-qr.svg')" alt="このスライドのQRコード" class="w-28 rounded-md bg-white p-1.5 shadow" />
  <span class="text-xs op-60">このスライド</span>
</div>

---
layout: toc
columns: 1
---

---
src: ./pages/shell.md
---

---
src: ./pages/terminal-beginner.md
hide: true
---

---
src: ./pages/wezterm.md
---

---
src: ./pages/wezterm-keybinds.md
---

---
layout: content
toc: まとめ
---

# まとめ

<div class="lead">

1. **ターミナル** — WezTerm は Lua で見た目もキーバインドも自分好みにできる
2. **シェル** — Emacs バインドを覚えると速い。CapsLock を Ctrl にすると更に快適
3. **キーバインド** — 内側（シェル）から外側（ターミナル）の順に設定すると衝突しない

</div>

<FindyCallout>
  設定はすべて <code>~/.config/</code> 以下のファイル。dotfiles として Git 管理すればどの環境でも再現できる
</FindyCallout>

---
layout: end
---

# ありがとうございました

---
src: ./pages/appendix.md
---

---
src: ./pages/herdr.md
---

---
src: ./pages/workflow.md
---
