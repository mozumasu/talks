---
layout: section
color: gray
toc: Appendix
---

# Appendix

Windows / Ghostty / マルチプレクサ / ワークフロー

---
layout: content
eyebrow: Appendix | Windows
toc: Windows
tocLevel: 2
routeAlias: appendix-windows
---

# Windows は WSL 上で進める

<FindyCallout>
  このハンズオンのシェル / CLI 操作は <FindyAccentMark>WSL (Ubuntu)</FindyAccentMark> 上で行う。
  Windows の人は WezTerm を WSL につないでおく
</FindyCallout>

<div class="code-scroll" style="--findy-code-scroll-h: 13.5rem">

::code-group

```powershell [1. WSL を入れる (管理者 PowerShell)]
wsl --install

# Ubuntu 24.04 をインストール
wsl --install -d Ubuntu-24.04

# インストール済みディストリビューションの確認
wsl --list --verbose

# WSL2をデフォルトに設定
wsl --set-default-version 2

# 特定のディストリビューションをWSL2に変換
wsl --set-version Ubuntu 2

# 再起動 (必要があれば)
Restart-Computer
# 初回起動時に Linux のユーザー名とパスワードを設定する
```

```lua [2. WezTerm の起動先を WSL にする]
-- ~/.config/wezterm/wezterm.lua
-- ドメイン名は "WSL:" + ディストリビューション名 (wsl -l -v で確認)
config.default_domain = "WSL:Ubuntu"
```

::

</div>

<FindyRef>

[WSL のインストール](https://learn.microsoft.com/ja-jp/windows/wsl/install) / [default_domain](https://wezterm.org/config/lua/config/default_domain.html) / [WslDomain](https://wezterm.org/config/lua/WslDomain.html)

</FindyRef>

---
layout: content
eyebrow: Appendix | Windows
---

# Windows で Ctrl キーを快適に使う

Windows キーボードの `Ctrl` は小指の端にあって押しづらい。<FindyAccentMark>CapsLock を Ctrl にリマップ</FindyAccentMark>するとかなり楽になる

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="PowerToys">Microsoft 公式。Keyboard Manager で GUI 設定</FindyKeyValue>
  <FindyKeyValue label="Ctrl2Cap">Sysinternals 製。インストールして再起動するだけ</FindyKeyValue>
  <FindyKeyValue label="レジストリ">Scancode Map を直接書き換え。ツール不要だが手順がやや複雑</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout variant="info">
  Mac は「システム設定 → キーボード → 修飾キー」で CapsLock → Control に変更できる
</FindyCallout>

<FindyRef label="参照">

[PowerToys Keyboard Manager](https://learn.microsoft.com/ja-jp/windows/powertoys/keyboard-manager) / [Ctrl2Cap](https://learn.microsoft.com/ja-jp/sysinternals/downloads/ctrl2cap)

</FindyRef>

---
layout: content
eyebrow: Appendix | Windows
---

# ターミナルのコピー & ペースト

Mac は `Cmd` (GUI) と `Ctrl` (ターミナル) で物理的にキーが分かれている

Windows は両方 `Ctrl` なので、ターミナルでは <FindyAccentMark>Shift を足して区別</FindyAccentMark>する

<FindyKeyValueList size="1rem">
  <FindyKeyValue label="Ctrl+Shift+C">コピー（ターミナル内）</FindyKeyValue>
  <FindyKeyValue label="Ctrl+Shift+V">ペースト（ターミナル内）</FindyKeyValue>
  <FindyKeyValue label="Ctrl+C">プロセス中断 (SIGINT)</FindyKeyValue>
  <FindyKeyValue label="Ctrl+V">リテラル入力モード</FindyKeyValue>
</FindyKeyValueList>

<FindyRef label="参照">

[WezTerm Default Key Assignments](https://wezterm.org/config/default-keys.html)

</FindyRef>
---
eyebrow: Appendix | Ghostty
toc: Ghostty
tocLevel: 2
layout: web-half
url: https://ghostty.org/
image: /screenshots/ghostty.png
caption: Ghostty (背景透過 + ぼかし + タブ統合)
---

# Ghostty という選択肢

Zig 製コアのターミナルエミュレータ (macOS / Linux)

<div class="lead">

- 設定は `key = value` を並べるだけ。Lua を書かなくていい
- GPU レンダリング (macOS: Metal / Linux: OpenGL)
- 組み込みテーマが豊富。`ghostty +list-themes` で一覧できる
- テーマを OS のライト / ダークモードに追従させられる
- macOS では Swift 製のネイティブ UI

</div>

<FindyRef>

[Ghostty Docs](https://ghostty.org/docs)

</FindyRef>

---
layout: two-cols
ratio: 1/1
eyebrow: Appendix | Ghostty
---

# Ghostty の設定例

::left::

シンプルな設定でも見た目はしっかりイケてる

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="インストール"><code>brew install --cask ghostty</code></FindyKeyValue>
  <FindyKeyValue label="設定ファイル"><code>~/.config/ghostty/config</code></FindyKeyValue>
  <FindyKeyValue label="再読み込み">macOS <code>cmd+shift+,</code> / Linux <code>ctrl+shift+,</code></FindyKeyValue>
</FindyKeyValueList>

<FindyRef>

[設定リファレンス](https://ghostty.org/docs/config/reference) / [テーマ](https://ghostty.org/docs/features/theme) / [mozumasu の設定ログ](https://zenn.dev/mozumasu/scraps/192ee90fde246f)

</FindyRef>

<FindyCallout>
  凝った設定を組みたくなったら WezTerm へどうぞ
</FindyCallout>

::right::

<div class="code-compact">

```ini [~/.config/ghostty/config]
# OS のライト/ダークに追従して切り替え
theme = light:iTerm2 Solarized Light,dark:Solarized Dark Patched
font-family = HackGen Console NF
font-size = 13
# 背景の透過とぼかし
background-opacity = 0.7
background-blur = 13
# 非フォーカスの分割ペインを薄暗くする
unfocused-split-opacity = 0.7
# macOS: タブをタイトルバーに統合
macos-titlebar-style = tabs
```

</div>

---
layout: two-cols
ratio: 1/1
eyebrow: Appendix | zsh
toc: zsh の読み込み順
tocLevel: 2
---

# `~/.zshenv` の変更が新しいタブでだけ反映される理由

::left::

新しいタブ: `ZDOTDIR` 無しで起動

<FindyFlow
  steps="~/.zshenv を読む → ZDOTDIR が決まる,~/.config/zsh/.zshrc を読む"
/>

<p class="text-sm op-60 mt-4">zsh が読むのは <code>$ZDOTDIR/.zshenv</code>。未設定なら <code>$HOME</code></p>

::right::

`exec zsh`: `ZDOTDIR` が入ったまま起動

<FindyFlow
  steps="~/.config/zsh/.zshenv を探す (無い),~/.config/zsh/.zshrc を読む"
/>

<p class="text-sm op-60 mt-4"><code>~/.zshenv</code> は読み直されない。足した変更は新しいタブまで見えない</p>

<FindyCallout>
  両方で同じファイルを読ませるなら <code>~/.zshenv</code> は <code>export ZDOTDIR=…</code> と <code>source "$ZDOTDIR/.zshenv"</code> の 2 行だけに
</FindyCallout>

<!--
- 再現: 仮の HOME で ~/.zshenv に ZDOTDIR を書き、起動後に ~/.zshenv へ MANPAGER を足して exec zsh → 反映されない。新しいシェルを ZDOTDIR 無しで起動 → 反映される
- 出典: zsh manual "Startup/Shutdown Files": "If ZDOTDIR is unset, HOME is used instead."
-->
