---
layout: section
color: blue
toc: ターミナルエミュレータ
---

# ターミナルエミュレータ

---
eyebrow: wezterm
layout: web-half
url: https://github.com/wezterm/wezterm
image: /screenshots/wezterm-site.png
caption: WezTerm 公式サイト
---

# WezTerm とは

Rust 製のターミナルエミュレータ

<div class="lead">

- 設定を Lua で書くので、OS やホスト名で条件分岐できる
- `leader` キーやキーテーブルで複雑なキー操作を組める
- 繰り返し操作を 1 つのキーバインドにまとめられる
- CLI からタブやペインを操作できる
- 設定を保存すると即反映される

</div>


---
layout: content
eyebrow: wezterm
---

# WezTerm のインストール

::code-group

```sh [macOS]
brew install --cask wezterm

# nightly 版 (最新機能を試したい場合)
brew install --cask wezterm@nightly
```

```sh [Linux (Ubuntu/Debian)]
curl -fsSL https://apt.fury.io/wez/gpg.key \
  | sudo gpg --yes --dearmor -o /usr/share/keyrings/wezterm-fury.gpg
echo 'deb [signed-by=/usr/share/keyrings/wezterm-fury.gpg] https://apt.fury.io/wez/ * *' \
  | sudo tee /etc/apt/sources.list.d/wezterm.list
sudo chmod 644 /usr/share/keyrings/wezterm-fury.gpg
sudo apt update && sudo apt install wezterm
```

```powershell [Windows]
winget install wez.wezterm

# Scoop (extras バケット) や Chocolatey でも入る
```

::

<FindyRef>

[macOS](https://wezterm.org/install/macos.html) / [Linux](https://wezterm.org/install/linux.html) / [Windows](https://wezterm.org/install/windows.html)

</FindyRef>

<FindyCallout>
  Linux は Flatpak (<code>flatpak install flathub org.wezfurlong.wezterm</code>) や
  AppImage、Arch の <code>pacman -S wezterm</code> などディストリごとの手段もある
</FindyCallout>

---
layout: content
eyebrow: wezterm
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
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# 設定ファイルの準備

::left::

1. 設定ファイルを作成してdotfilesで管理する

```bash
# dotfiles 配下に WezTerm の設定ファイルを置く
mkdir -p ~/dotfiles/.config/wezterm
touch ~/dotfiles/.config/wezterm/wezterm.lua

# シンボリックリンクを貼る
mkdir -p ~/.config/wezterm
ln -s ~/dotfiles/.config/wezterm/wezterm.lua \
  ~/.config/wezterm/wezterm.lua
```

<FindyRef>
<a href="https://wezterm.org/config/files.html">Configuration - Wez's Terminal Emulator</a>
</FindyRef>

::right::

2. 公式ドキュメントにある雛形を用意する

```lua [~/.config/wezterm/wezterm.lua]
-- wezterm API を組み込む
local wezterm = require("wezterm")

-- ここに設定内容を記述していく
local config = wezterm.config_builder()

-- 設定ファイルの変更を自動で読み込む
config.automatically_reload_config = true

-- 最後に、weztermに設定を戻す
return config
```

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# フォントの設定

::left::

WezTerm は <FindyAccentMark>JetBrains Mono</FindyAccentMark>・Nerd Font アイコン・絵文字を同梱していて、入れなくてもアイコンつきプロンプトまで出せる

<FindyCallout>
  新しく探すなら <a href="https://www.nerdfonts.com/font-downloads">Nerd Fonts</a> か、
  ブラウザで試し打ちできる <a href="https://www.programmingfonts.org">Programming Fonts</a> から
</FindyCallout>

<FindyRef>

[Fonts](https://wezterm.org/config/fonts.html)

</FindyRef>

::right::

設定はフォント名とサイズを指定するだけ

```lua [~/.config/wezterm/wezterm.lua]
-- 未指定なら同梱の JetBrains Mono
config.font = wezterm.font("JetBrains Mono") -- [!code ++]
config.font_size = 14.0 -- [!code ++]
```

手元のフォント名を一覧するならこれ

<div class="code-compact">

```sh
wezterm ls-fonts --list-system \
  | grep 'wezterm.font' | cut -d'"' -f2 \
  | sort -u | grep -v '^\.'
```

</div>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# フォントの設定 <span class="muted">(例: HackGen)</span>

::left::

今回は [HackGen](https://github.com/yuru7/HackGen) を使う（Nerd Fonts 対応で、日本語も等幅で揃う）

::code-group

```sh [macOS]
brew install font-hackgen
brew install font-hackgen-nerd
```

```sh [Windows (WSL)]
# GitHub Releases からダウンロードして手動インストール
# https://github.com/yuru7/HackGen/releases
# HackGen_NF_vX.X.X.zip を展開し、
# .ttf ファイルを右クリック → 「インストール」
```

```sh [Linux]
# Ubuntu/Debian
sudo apt install fonts-hackgen

# Arch Linux
sudo pacman -S otf-hackgen-nerd
```

::

<FindyRef>
<a href="https://github.com/yuru7/HackGen">yuru7/HackGen</a>
</FindyRef>

::right::

```lua [~/.config/wezterm/wezterm.lua]
local wezterm = require("wezterm")
local config = wezterm.config_builder()

config.automatically_reload_config = true

config.font_size = 14.0 -- [!code ++]
config.font = wezterm.font( -- [!code ++]
  "HackGen Console NF" -- [!code ++]
) -- [!code ++]

return config
```

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# 見た目: 背景透過 + ぼかし

::left::

人類皆一度は憧れるスケスケのターミナル

<FindyKeyValueList size="1.02rem">
  <FindyKeyValue label="透過">opacity 0.85 でほどよい透け感</FindyKeyValue>
  <FindyKeyValue label="ぼかし">blur 20 で文字の視認性を確保</FindyKeyValue>
</FindyKeyValueList>

<p class="takeaway mt-8">2 行で<FindyAccentMark>気分がブチ上がる</FindyAccentMark></p>

::right::

::code-group

```lua [macOS]
local wezterm = require("wezterm")
local config = wezterm.config_builder()

-- 背景を透過 -- [!code ++]
config.window_background_opacity = 0.85 -- [!code ++]
-- ぼかしを追加 -- [!code ++]
config.macos_window_background_blur = 20 -- [!code ++]

return config
```

```lua [Windows]
local wezterm = require("wezterm")
local config = wezterm.config_builder()

-- 背景を透過 -- [!code ++]
config.window_background_opacity = 0.85 -- [!code ++]
-- ぼかしを追加 (Acrylic 効果) -- [!code ++]
config.win32_system_backdrop = "Acrylic" -- [!code ++]

return config
```

```lua [Linux]
local wezterm = require("wezterm")
local config = wezterm.config_builder()

-- 背景を透過 (X11 は picom 等が必要なことも) -- [!code ++]
config.window_background_opacity = 0.85 -- [!code ++]
-- ぼかしを追加 (Wayland + KDE Plasma のみ) -- [!code ++]
config.wayland_window_background_blur = true -- [!code ++]

return config
```

::

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# 設定が育ったらファイルを分割する

::left::

WezTerm が読むのは `wezterm.lua` だけ。役割ごとのファイルはそこから `require` で読み込む

<FindyCallout label="ファイル構成">
<pre style="margin: 0; padding: 0; background: none; font-size: 0.85rem; line-height: 1.8">
~/.config/wezterm/
├── wezterm.lua    # エントリ (これだけが読まれる)
├── keymaps.lua    # キーバインド
├── appearance.lua # 見た目
└── tab.lua        # タブバー
</pre>
</FindyCallout>

<FindyRef>

[mozumasu/dotfiles の wezterm](https://github.com/mozumasu/dotfiles/tree/main/.config/wezterm)

</FindyRef>

::right::

分割した側は config に足す関数を返す

<div class="code-compact">

```lua [~/.config/wezterm/wezterm.lua]
require("keymaps").apply_to_config(config)
require("tab").apply_to_config(config)
return config
```

```lua [~/.config/wezterm/keymaps.lua]
local module = {}
function module.apply_to_config(config)
  config.keys = { --[[ ここに集約 ]] }
end
return module
```

</div>


---
layout: content
eyebrow: wezterm
---

# タブバーを丸くしてみよう

1. `~/dotfiles/.config/wezterm/tab.lua` を作る
2. [サンプルコード](https://github.com/mozumasu/talks/blob/main/slides/2026-09-26-terminal-hands-on/sample-code/dotfiles/.config/wezterm/tab.lua) を貼り付ける
3. `wezterm.lua` に `require("tab").apply_to_config(config)` を足す

<FindyKeyValueList size="0.95rem" class="mt-4">
  <FindyKeyValue label="COLORS">配色。書き換えるだけで色を変えられる</FindyKeyValue>
  <FindyKeyValue label="タブバーの設定">位置・最大幅・「+」ボタンの非表示など</FindyKeyValue>
  <FindyKeyValue label="format-tab-title">タブの描画そのもの（仕組みは次のページ）</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout>
  タイトルバーごと消したい人は <code>config.window_decorations = "RESIZE"</code> も合わせてどうぞ
</FindyCallout>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# 丸タブの仕組み: format-tab-title

::left::

タブが描画されるたびに WezTerm が登録した関数を呼び、返した「描画パーツの並び」がそのままタブになる

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="wezterm.on">イベントに関数を登録する</FindyKeyValue>
  <FindyKeyValue label="tab 引数">is_active や active_pane.title などタブの状態が入る</FindyKeyValue>
  <FindyKeyValue label="返り値">背景色・文字色・テキストを並べた描画命令のリスト</FindyKeyValue>
</FindyKeyValueList>

<FindyRef>

[format-tab-title](https://wezterm.org/config/lua/window-events/format-tab-title.html)

</FindyRef>

::right::

<div class="code-compact">

```lua [最小の例]
-- タブを描画するたびに呼ばれる
wezterm.on("format-tab-title", function(tab)
  -- タブの状態を見て表示を組み立てる
  local title = tab.active_pane.title

  -- 並べた順に描画される
  return {
    { Background = { Color = "#80EBDF" } },
    { Foreground = { Color = "#313244" } },
    { Text = " " .. title .. " " },
  }
end)
```

</div>

---
layout: section
color: gray
---

# Ghosttyの紹介

---
eyebrow: コラム
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
eyebrow: コラム
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
