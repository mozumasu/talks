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

<FindyKeyValueList size="1.05rem" gap="0.6rem">
  <FindyKeyValue label="← →">前後のスライドへ移動（Space でも進める）</FindyKeyValue>
  <FindyKeyValue label="o">全スライドの一覧を開く。クリックでそのページへジャンプ</FindyKeyValue>
  <FindyKeyValue label="g">ページ番号を入力してジャンプ</FindyKeyValue>
  <FindyKeyValue label="f">フルスクリーン表示</FindyKeyValue>
  <FindyKeyValue label="画面右端にマウス">目次のサイドバーが開く。次の目次スライドと同じく、項目をクリックでその章へジャンプ</FindyKeyValue>
</FindyKeyValueList>

---
layout: content
---

# キーの表記について

このスライドではキーを次のように書く。Mac と Windows で読み替えてほしい {.content-lead}

<div class="text-base">

| 表記 | macOS | Windows / Linux | WezTerm の mods |
|---|---|---|---|
| `Ctrl` | control ⌃ | Ctrl | `CTRL` |
| `Alt` | option ⌥ | Alt | `ALT` |
| `Cmd` | command ⌘ | Win | `SUPER` |
| `Shift` | shift ⇧ | Shift | `SHIFT` |
| `Leader` | 自分で決める (この資料では `Ctrl+;`) | 同じ | `LEADER` |

</div>

<FindyCallout>
  <code>Ctrl+Shift+T</code> は同時押し。<code>Leader, |</code> のようにカンマで区切ったものと <code>Esc→,</code> は順番に押す
</FindyCallout>

---
layout: content
---

# Windows の人は先に WSL を用意する

<div class="lead">

- シェルの操作はすべて <FindyAccentMark>WSL (Ubuntu)</FindyAccentMark> 上で進める
- WezTerm を WSL につなぐ設定も必要
- 手順は <Link to="appendix-windows">Appendix の Windows</Link> にまとめてある

</div>

<FindyCallout variant="warn">
  <code>wsl --install</code> は再起動を挟むので、ハンズオンが始まる前に済ませておく
</FindyCallout>

<p class="text-sm op-60">macOS / Linux の人はこのページは読み飛ばして OK</p>

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
scale: 0.88
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

---
layout: section
color: gray
toc: サンプルコード
routeAlias: sample-code
---

# サンプルコード

WezTerm / シェル / herdr / Ghostty の設定ファイル

---
layout: content
eyebrow: サンプルコード
---

# サンプルコード: WezTerm

<div class="code-scroll" style="--findy-code-scroll-h: 20rem">

::code-group

<<< @/sample-code/dotfiles/.config/wezterm/wezterm.lua lua[wezterm.lua]

<<< @/sample-code/dotfiles/.config/wezterm/keybinds.lua lua[keybinds.lua]

<<< @/sample-code/dotfiles/.config/wezterm/tab.lua lua[tab.lua]

<<< @/sample-code/dotfiles/.config/wezterm/workspace.lua lua[workspace.lua]

<<< @/sample-code/dotfiles/.config/wezterm/wezterm-windows.lua lua[wezterm-windows.lua]

::

</div>

---
layout: content
eyebrow: サンプルコード
---

# サンプルコード: シェル

<div class="code-scroll" style="--findy-code-scroll-h: 20rem">

::code-group

<<< @/sample-code/dotfiles/.config/zsh/.zshrc sh[zsh/.zshrc]

<<< @/sample-code/dotfiles/.inputrc sh[.inputrc]

<<< @/sample-code/dotfiles/.config/fish/config.fish fish[fish/config.fish]

::

</div>

---
layout: content
eyebrow: サンプルコード
---

# サンプルコード: herdr / Ghostty

<div class="code-scroll" style="--findy-code-scroll-h: 20rem">

::code-group

<<< @/sample-code/dotfiles/.config/herdr/config.toml toml[herdr/config.toml]

<<< @/sample-code/dotfiles/.config/ghostty/config ini[ghostty/config]

::

</div>
