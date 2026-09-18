---
layout: section
color: blue
toc: ターミナルマルチプレクサ
---

# ターミナルマルチプレクサ

---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# herdr とは

::left::

<FindyTermCardList>
  <FindyTermCard term="herdr">
    AI エージェント用のターミナルマルチプレクサ
    <template #note>tmux ライクな prefix キー操作・セッション永続化・Rust 製単一バイナリ</template>
  </FindyTermCard>
</FindyTermCardList>

<div class="lead mt-4">

- 1 つのターミナルで全エージェントを一覧
- working / blocked / done が一目で分かる
- サーバーがセッションを保持。閉じても SSH 先からでも再アタッチできる

</div>

::right::

<FindyWebPage
  url="https://herdr.dev"
  :image="$asset('/screenshots/herdr-dev.png')"
  caption="herdr.dev"
/>

---
layout: two-cols
ratio: 2/3
valign: center
eyebrow: herdr
---

# herdr の画面構成

::left::

<FindyLegend>
  <FindyLegendItem color="#3b82f6" term="spaces">ワークスペース一覧。リポジトリ / worktree ごとに並び、worktree はネストして表示</FindyLegendItem>
  <FindyLegendItem color="#10b981" term="agents">全エージェントの状態一覧。working / blocked / done が色付きで並ぶ</FindyLegendItem>
  <FindyLegendItem color="#f59e0b" term="フォーカス中のペイン">上部にタブが並び、中でエージェントが動く</FindyLegendItem>
</FindyLegend>

::right::

<FindyAnnotatedImage
  :image="$asset('/screenshots/herdr-ui.png')"
  alt="herdr の画面。左上に spaces、左下に agents、右にフォーカス中のペイン"
>
  <FindyImageRegion label="spaces" color="#3b82f6" :x="0.4" :y="1.5" :w="19.6" :h="54.5" />
  <FindyImageRegion label="worktree" labelPosition="above-right" color="#8b5cf6" :x="2" :y="22.8" :w="17.6" :h="10.7" />
  <FindyImageRegion label="agents" color="#10b981" :x="0.4" :y="58" :w="19.6" :h="37.5" />
  <FindyImageRegion label="フォーカス中のペイン" labelPosition="top-right" color="#f59e0b" :x="20.8" :y="0.6" :w="78.8" :h="95.4" />
</FindyAnnotatedImage>

---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# herdr の導入

::left::

インストールは script / Homebrew / Nix flake から選べる

::code-group

```sh [macOS]
curl -fsSL https://herdr.dev/install.sh | sh
# または
brew install herdr
```

```sh [Linux]
curl -fsSL https://herdr.dev/install.sh | sh
```

```sh [Windows]
powershell -ExecutionPolicy Bypass -c "irm https://herdr.dev/install.ps1 | iex"
```

::

::right::

設定ファイルは dotfiles 側に生成して管理する

<div class="code-compact" style="--findy-code-compact-size: 0.95rem">

```sh
mkdir -p ~/dotfiles/.config/herdr
herdr --default-config \
  > ~/dotfiles/.config/herdr/config.toml
```

</div>

<FindyCallout>
  初回起動時のセットアップ画面を閉じてしまったら <code>onboarding = true</code> にして
  <code>herdr server stop</code> → <code>herdr</code> で再表示できる。
  通知などはあとから設定画面 (<code>prefix+s</code>) で変更可能
</FindyCallout>

---
layout: content
eyebrow: herdr
---

# シンボリックリンクを貼るのを忘れずに

dotfiles 側に生成しただけでは herdr からは見えない。実体は dotfiles、参照は `~/.config` に置く

```sh
mkdir -p ~/.config/herdr
ln -s ~/dotfiles/.config/herdr/config.toml \
  ~/.config/herdr/config.toml
```

<FindyCallout>
  WezTerm のときと同じ手順。dotfiles で管理する設定はすべてこの形にする
</FindyCallout>

---
layout: content
eyebrow: herdr
---

# デフォルト設定ファイル (config.toml)

`herdr --default-config` の出力 (全 278 行)。タブでコメントの日本語訳・コメント抜き版・mozumasu の実際の設定に切り替えられる

<div class="code-scroll">

::code-group

```toml [元のファイル]
# herdr configuration
# Place this file at ~/.config/herdr/config.toml

# Show first-run notification setup on startup.
# Missing also shows onboarding; set false after you've chosen.
onboarding = true

[theme]
# Built-in themes: catppuccin, terminal, tokyo-night, dracula, nord,
#                  gruvbox, one-dark, solarized, kanagawa, rose-pine,
#                  vesper
name = "catppuccin"

# Follow host terminal light/dark appearance and switch Herdr UI themes.
# Existing manual behavior is unchanged unless this is true.
auto_switch = false
dark_name = "catppuccin"
light_name = "catppuccin-latte"

# Override individual color tokens on top of the base theme.
# Accepts: hex (#rrggbb), named colors, rgb(r,g,b), or panel_bg = "reset"
[theme.custom]
panel_bg = "reset"
accent = "#f5c2e7"
red = "#ff6188"
green = "#a6e3a1"

[terminal]
# Executable used for new interactive panes.
# Empty means $SHELL, then /bin/sh.
default_shell = ""

# Startup mode for new interactive pane shells: "auto", "login", or "non_login".
# "auto" uses login shells on macOS and keeps the current behavior elsewhere.
shell_mode = "auto"

# CWD policy for new panes, tabs, and workspaces when no explicit --cwd is provided.
# Use "follow" to inherit the source pane/workspace, "home" for $HOME,
# "current" for Herdr's process directory, or a fixed path such as "~/Projects".
new_cwd = "follow"

[update]
# Update channel used by background version checks and `herdr update`.
# Use "stable" for normal releases or "preview" for opt-in preview builds.
channel = "stable"

# Check herdr.dev for new Herdr versions in the background.
version_check = true

# Check herdr.dev for remote agent-detection manifest updates in the background.
manifest_check = true

[keys]
# Prefix key to enter prefix mode (default: "ctrl+b")
# Examples: "ctrl+b", "f12", "esc", "-"
# Action bindings use explicit syntax: "prefix+n" requires the prefix;
# "ctrl+alt+n" is a direct terminal-mode shortcut.
# Accepted key syntax: plain keys, ctrl/shift/alt/cmd/super modifiers, and special keys like enter/tab/esc/left/right/up/down.
# Named punctuation such as minus, comma, ampersand, plus, and backtick is also accepted.
# Most reliable direct bindings are ctrl+letter, function keys, and explicit modified chords.
# alt+..., cmd/super, and punctuation-with-modifiers may depend on your terminal/tmux setup.
prefix = "ctrl+b"

# Prefix-mode actions
help = "prefix+?"
settings = "prefix+s"
detach = "prefix+q"
reload_config = "prefix+shift+r"
open_notification_target = "prefix+o"
workspace_picker = "prefix+w"
goto = "prefix+g"
new_workspace = "prefix+shift+n"
new_worktree = "prefix+shift+g"
open_worktree = ""    # optional, unset by default
remove_worktree = ""  # optional, unset by default; opens confirmation
rename_workspace = "prefix+shift+w"
close_workspace = "prefix+shift+d"
previous_workspace = "" # optional, unset by default
next_workspace = ""     # optional, unset by default
previous_agent = ""     # optional, unset by default
next_agent = ""         # optional, unset by default
focus_agent = ""        # optional indexed binding, e.g. "prefix+alt+1..9"
remote_image_paste = "ctrl+v" # only active in herdr --remote; empty disables raw-key image paste
new_tab = "prefix+c"
rename_tab = "prefix+shift+t"
previous_tab = "prefix+p"
next_tab = "prefix+n"
switch_tab = "prefix+1..9"
switch_workspace = ""   # optional indexed binding, e.g. "prefix+shift+1..9"
close_tab = "prefix+shift+x"
rename_pane = "prefix+shift+p"
edit_scrollback = "prefix+e"
focus_pane_left = "prefix+h"
focus_pane_down = "prefix+j"
focus_pane_up = "prefix+k"
focus_pane_right = "prefix+l"
cycle_pane_next = "prefix+tab"
cycle_pane_previous = "prefix+shift+tab"
last_pane = ""          # optional, unset by default; bind e.g. "prefix+tab" for global back-and-forth
split_vertical = "prefix+v"
split_horizontal = "prefix+minus"
close_pane = "prefix+x"
zoom = "prefix+z"       # legacy alias: fullscreen
resize_mode = "prefix+r"
toggle_sidebar = "prefix+b"

# Navigate-mode movement. These local shortcuts win while navigate mode is open.
# They are independent from focus_pane_*. Do not include prefix+, esc, enter, tab, or 1..9 here.
navigate_workspace_up = "up"
navigate_workspace_down = "down"
navigate_pane_left = "h"      # left arrow always focuses the pane to the left
navigate_pane_down = "j"
navigate_pane_up = "k"
navigate_pane_right = "l"     # right arrow always focuses the pane to the right

# Custom commands use the same binding syntax.
# type = "shell" runs detached in the background.
# type = "pane" opens a temporary pane and closes it when the command exits.
# On Windows, command strings run through cmd.exe /d /c.
[[keys.command]]
key = "prefix+alt+g"
type = "pane"
command = "lazygit"

# Legacy indexed shortcut config is still parsed for compatibility.
# Prefer switch_tab, switch_workspace, and focus_agent for new configs.
[keys.indexed]
tabs = ""       # e.g. "ctrl" makes ctrl+1..9 switch tabs directly
workspaces = "" # e.g. "ctrl+shift" makes ctrl+shift+1..9 switch workspaces directly
agents = ""     # e.g. "alt" makes alt+1..9 focus agent rows directly

[worktrees]
directory = "~/.herdr/worktrees"

[ui]
# Sidebar width (auto-scaled based on workspace names, this sets the default)
sidebar_width = 26

# Minimum sidebar width when expanded (columns)
sidebar_min_width = 18

# Maximum sidebar width when expanded (columns)
sidebar_max_width = 36

# Collapsed sidebar presentation: "compact" keeps the narrow status rail, "hidden" uses zero width.
sidebar_collapsed_mode = "compact"

# Terminal width at or below which Herdr uses the mobile single-column layout.
# Increase this for foldables, tablets, or wide phone terminals.
mobile_width_threshold = 64

# Capture mouse input for Herdr's mouse UI.
# Set false to let the terminal handle normal clicks, such as Cmd-clicking URLs.
# Pane apps like lazygit and btop can still receive mouse when they request it.
mouse_capture = true

# Host cursor policy: "auto", "native", or "drawn".
# "auto" draws Herdr's own cursor on Windows to avoid ConPTY cursor flicker, and uses the native terminal cursor elsewhere.
# "native" always uses the outer terminal cursor. "drawn" always draws Herdr's cursor as terminal cell content.
host_cursor = "auto"

# Optional modifier that forwards right-click hold/drag gestures to pane apps instead of opening Herdr's pane menu.
# Empty/off disables this. Shift is intentionally unsupported because terminals commonly reserve Shift+mouse.
right_click_passthrough_modifier = ""

# Force a full redraw when the outer terminal regains focus.
# Set false to reduce visible flashing when switching back to Herdr.
# Trade-off: rare host terminal surface corruption may persist until the next full redraw.
redraw_on_focus_gained = true

# Pane scrollback lines to scroll per mouse wheel notch.
mouse_scroll_lines = 3

# Ask for confirmation before closing a workspace
confirm_close = true

# Ask for a tab name before creating a new tab.
# Set false to create tabs immediately with generated names.
prompt_new_tab_name = true

# Draw borders around split panes.
pane_borders = true

# Keep split panes visually separated instead of sharing divider borders.
pane_gaps = true

# Show detected/reported agent labels in split pane borders when no manual pane name is set.
show_agent_labels_on_pane_borders = false

# Hide the tab row when a workspace has exactly one tab.
# New tabs can still be created with the configured keybinding.
hide_tab_bar_when_single_tab = false

# Agent panel ordering: "spaces" (grouped by space) or "priority" (attention queue).
# "workspaces" is accepted as an alias for "spaces".
agent_panel_sort = "spaces"

# Accent color for highlights, borders, and navigation UI.
# Accepts: hex (#89b4fa), named colors (cyan, blue, magenta), or rgb(r,g,b)
accent = "cyan"

# Background notification popup delivery
[ui.toast]
# off = disable pop-up notifications
# herdr = show in-app toasts
# terminal = ask the outer terminal to show a desktop notification
# system = ask the OS notification service directly
delivery = "off"
delay_seconds = 1

[ui.toast.herdr]
position = "bottom-right"

[ui.toast.clipboard]
enabled = true
position = "bottom-center"

# Play sounds when agents change state in background workspaces
[ui.sound]
enabled = true
# Optional custom mp3 sound files. Relative paths are resolved from this config file's directory.
path = "sounds/notification.mp3"   # one mp3 file for all sound notifications
done_path = "sounds/done.mp3"      # overrides only finished notifications
request_path = "sounds/request.mp3" # overrides only needs-attention notifications

# Per-agent overrides: default | on | off
# By default, droid is muted.
[ui.sound.agents]
droid = "off"

[session]
# Resume supported AI-agent panes into their native conversation sessions after
# a Herdr server restart. Requires official integrations that report session refs.
resume_agents_on_restore = true

[remote]
# Whether herdr manages the ssh config used for `herdr --remote`.
# When true (default), herdr runs remote ssh through a generated config that
# includes your ~/.ssh/config first and adds ServerAliveInterval/
# ServerAliveCountMax as fallbacks (so any keepalive values you set yourself
# still win) to survive idle network/NAT timeouts. Herdr also uses a private
# per-attach OpenSSH control socket to reuse the first authenticated connection.
# Set false to run plain ssh against your ssh config unchanged — this does not
# force keepalive or multiplexing off, it only stops herdr from adding its own.
manage_ssh_config = true

[experimental]
# Allow launching herdr from inside a herdr-managed pane.
allow_nested = false
# Experimental local Kitty graphics rendering for attached clients.
# Requires a Kitty graphics-compatible outer terminal.
kitty_graphics = false
# Save recent pane screen history across full server restarts.
pane_history = false
# While prefix mode is active, temporarily switch the macOS host input
# source to an ASCII-capable keyboard layout so prefix commands register
# even when a CJK IME is active, then restore the previous input source
# when prefix mode exits. macOS only; best-effort. Default: false.
switch_ascii_input_source_in_prefix = false
# Expose the focused pane's cursor to the outer terminal so macOS input
# methods keep tracking the candidate window when TUIs paint their own
# cursor (Claude Code, pi, codex). Trade-off: extra cursor visible for
# apps that hide it without painting a replacement (vim normal mode, etc.).
reveal_hidden_cursor_for_cjk_ime = false
# Optional allow-list: only reveal for focused panes whose detected agent
# matches one of these names. Empty means apply to any focused pane.
# If the list contains no valid names, the reveal does not apply.
# Accepted: pi, claude, codex, gemini, cursor, devin, cline, opencode,
# copilot, kimi, kiro, droid, amp, grok, hermes, kilo, qodercli, qoder.
cjk_ime_agents = []
# Cursor shape rendered when reveal_hidden_cursor_for_cjk_ime is true.
# Values: block, steady_block (default), underline, steady_underline, bar, steady_bar.
cjk_ime_cursor_shape = "steady_block"

[advanced]
# Maximum scrollback buffer size in bytes retained per pane terminal.
# Matches Ghostty's default scrollback-limit behavior.
scrollback_limit_bytes = 10000000
```

```toml [コメント日本語訳]
# herdr の設定ファイル
# このファイルを ~/.config/herdr/config.toml に置く

# 起動時に初回の通知セットアップを表示する。
# 未設定でもオンボーディングは表示される。選択が済んだら false にする。
# onboarding = true

[theme]
# 組み込みテーマ: catppuccin, terminal, tokyo-night, dracula, nord,
#                 gruvbox, one-dark, solarized, kanagawa, rose-pine,
#                 vesper
# name = "catppuccin"

# ホストターミナルのライト/ダーク外観に追従して Herdr UI のテーマを切り替える。
# これを true にしない限り、従来の手動での挙動は変わらない。
# auto_switch = false
# dark_name = "catppuccin"
# light_name = "catppuccin-latte"

# ベーステーマの上に個別のカラートークンを上書きする。
# 指定可能: hex (#rrggbb)、色名、rgb(r,g,b)、または panel_bg = "reset"
# [theme.custom]
# panel_bg = "reset"
# accent = "#f5c2e7"
# red = "#ff6188"
# green = "#a6e3a1"

[terminal]
# 新しいインタラクティブペインで使う実行ファイル。
# 空の場合は $SHELL、次に /bin/sh を使う。
# default_shell = ""

# 新しいインタラクティブペインのシェルの起動モード: "auto"、"login"、"non_login"。
# "auto" は macOS ではログインシェルを使い、それ以外では現在の挙動を維持する。
# shell_mode = "auto"

# --cwd が明示されていないときの、新しいペイン・タブ・ワークスペースの CWD ポリシー。
# "follow" は元のペイン/ワークスペースを引き継ぐ。"home" は $HOME、
# "current" は Herdr のプロセスディレクトリ、"~/Projects" のような固定パスも指定できる。
# new_cwd = "follow"

[update]
# バックグラウンドのバージョンチェックと `herdr update` が使う更新チャンネル。
# 通常リリースは "stable"、オプトインのプレビュービルドは "preview" を使う。
# channel = "stable"

# バックグラウンドで herdr.dev に新しい Herdr バージョンがないか確認する。
# version_check = true

# バックグラウンドで herdr.dev にエージェント検出マニフェストの更新がないか確認する。
# manifest_check = true

[keys]
# prefix モードに入るための prefix キー (デフォルト: "ctrl+b")
# 例: "ctrl+b", "f12", "esc", "-"
# アクションのバインドは明示的な構文を使う: "prefix+n" は prefix が必要。
# "ctrl+alt+n" はターミナルモードの直接ショートカット。
# 使えるキー構文: 通常のキー、ctrl/shift/alt/cmd/super の修飾キー、enter/tab/esc/left/right/up/down などの特殊キー。
# minus, comma, ampersand, plus, backtick といった記号の名前指定も使える。
# 直接バインドとして最も確実なのは ctrl+英字、ファンクションキー、修飾キーを明示したコード。
# alt+... や cmd/super、修飾キー付きの記号はターミナル/tmux の設定に依存する場合がある。
# prefix = "ctrl+b"

# prefix モードのアクション
# help = "prefix+?"
# settings = "prefix+s"
# detach = "prefix+q"
# reload_config = "prefix+shift+r"
# open_notification_target = "prefix+o"
# workspace_picker = "prefix+w"
# goto = "prefix+g"
# new_workspace = "prefix+shift+n"
# new_worktree = "prefix+shift+g"
# open_worktree = ""    # 任意。デフォルトでは未設定
# remove_worktree = ""  # 任意。デフォルトでは未設定。確認ダイアログを開く
# rename_workspace = "prefix+shift+w"
# close_workspace = "prefix+shift+d"
# previous_workspace = "" # 任意。デフォルトでは未設定
# next_workspace = ""     # 任意。デフォルトでは未設定
# previous_agent = ""     # 任意。デフォルトでは未設定
# next_agent = ""         # 任意。デフォルトでは未設定
# focus_agent = ""        # 任意のインデックス付きバインド。例: "prefix+alt+1..9"
# remote_image_paste = "ctrl+v" # herdr --remote でのみ有効。空にすると生キーでの画像ペーストを無効化
# new_tab = "prefix+c"
# rename_tab = "prefix+shift+t"
# previous_tab = "prefix+p"
# next_tab = "prefix+n"
# switch_tab = "prefix+1..9"
# switch_workspace = ""   # 任意のインデックス付きバインド。例: "prefix+shift+1..9"
# close_tab = "prefix+shift+x"
# rename_pane = "prefix+shift+p"
# edit_scrollback = "prefix+e"
# focus_pane_left = "prefix+h"
# focus_pane_down = "prefix+j"
# focus_pane_up = "prefix+k"
# focus_pane_right = "prefix+l"
# cycle_pane_next = "prefix+tab"
# cycle_pane_previous = "prefix+shift+tab"
# last_pane = ""          # 任意。デフォルトでは未設定。"prefix+tab" などを割り当てるとグローバルに行き来できる
# split_vertical = "prefix+v"
# split_horizontal = "prefix+minus"
# close_pane = "prefix+x"
# zoom = "prefix+z"       # 旧エイリアス: fullscreen
# resize_mode = "prefix+r"
# toggle_sidebar = "prefix+b"

# navigate モードの移動キー。navigate モードが開いている間はこのローカルショートカットが優先される。
# focus_pane_* とは独立。prefix+、esc、enter、tab、1..9 はここに含めないこと。
# navigate_workspace_up = "up"
# navigate_workspace_down = "down"
# navigate_pane_left = "h"      # 左矢印は常に左のペインにフォーカスする
# navigate_pane_down = "j"
# navigate_pane_up = "k"
# navigate_pane_right = "l"     # 右矢印は常に右のペインにフォーカスする

# カスタムコマンドも同じバインド構文を使う。
# type = "shell" はバックグラウンドでデタッチ実行する。
# type = "pane" は一時的なペインを開き、コマンド終了時に閉じる。
# Windows ではコマンド文字列は cmd.exe /d /c 経由で実行される。
# [[keys.command]]
# key = "prefix+alt+g"
# type = "pane"
# command = "lazygit"

# 旧形式のインデックス付きショートカット設定も互換性のため引き続き読み込まれる。
# 新しい設定では switch_tab, switch_workspace, focus_agent を推奨。
# [keys.indexed]
# tabs = ""       # 例: "ctrl" にすると ctrl+1..9 で直接タブを切り替え
# workspaces = "" # 例: "ctrl+shift" にすると ctrl+shift+1..9 で直接ワークスペースを切り替え
# agents = ""     # 例: "alt" にすると alt+1..9 で直接エージェント行にフォーカス

# [worktrees]
# directory = "~/.herdr/worktrees"

[ui]
# サイドバーの幅 (ワークスペース名に応じて自動スケールする。これはそのデフォルト値)
# sidebar_width = 26

# 展開時のサイドバーの最小幅 (桁数)
# sidebar_min_width = 18

# 展開時のサイドバーの最大幅 (桁数)
# sidebar_max_width = 36

# 折りたたみ時のサイドバー表示: "compact" は細いステータスレールを残し、"hidden" は幅ゼロにする。
# sidebar_collapsed_mode = "compact"

# この値以下のターミナル幅では Herdr がモバイル用の 1 カラムレイアウトを使う。
# フォルダブルやタブレット、幅広のスマホターミナルでは大きくするとよい。
# mobile_width_threshold = 64

# Herdr のマウス UI のためにマウス入力をキャプチャする。
# false にすると通常のクリック (Cmd+クリックで URL を開くなど) をターミナル側に任せる。
# lazygit や btop のようなペイン内アプリは、要求すれば引き続きマウス入力を受け取れる。
# mouse_capture = true

# ホストカーソルのポリシー: "auto"、"native"、"drawn"。
# "auto" は Windows では ConPTY のカーソルちらつきを避けるため Herdr 自身のカーソルを描画し、それ以外ではネイティブのターミナルカーソルを使う。
# "native" は常に外側ターミナルのカーソルを使う。"drawn" は常に Herdr のカーソルをターミナルのセル内容として描画する。
# host_cursor = "auto"

# 右クリックの長押し/ドラッグ操作を、Herdr のペインメニューを開く代わりにペイン内アプリへ転送するための任意の修飾キー。
# 空/オフで無効。ターミナルは一般に Shift+マウスを予約しているため、Shift は意図的に非対応。
# right_click_passthrough_modifier = ""

# 外側のターミナルがフォーカスを取り戻したときに全体を再描画する。
# false にすると Herdr に戻ったときの目に見えるちらつきを減らせる。
# トレードオフ: まれなホストターミナルの表示乱れが次の全体再描画まで残ることがある。
# redraw_on_focus_gained = true

# マウスホイール 1 ノッチあたりにスクロールするペインのスクロールバック行数。
# mouse_scroll_lines = 3

# ワークスペースを閉じる前に確認する
# confirm_close = true

# 新しいタブを作る前にタブ名を尋ねる。
# false にすると自動生成された名前で即座にタブを作る。
# prompt_new_tab_name = true

# 分割ペインの周りに枠線を描く。
# pane_borders = true

# 分割ペイン同士に境界線を共有させず、視覚的に離して表示する。
# pane_gaps = true

# 手動のペイン名が付いていないとき、分割ペインの枠線に検出/報告されたエージェントのラベルを表示する。
# show_agent_labels_on_pane_borders = false

# ワークスペースのタブがちょうど 1 つのときタブ行を隠す。
# 設定済みのキーバインドで新しいタブは引き続き作成できる。
# hide_tab_bar_when_single_tab = false

# エージェントパネルの並び順: "spaces" (スペースごとにグループ化) または "priority" (要対応キュー)。
# "workspaces" は "spaces" のエイリアスとして受け付ける。
# agent_panel_sort = "spaces"

# ハイライト・枠線・ナビゲーション UI のアクセントカラー。
# 指定可能: hex (#89b4fa)、色名 (cyan, blue, magenta)、rgb(r,g,b)
# accent = "cyan"

# バックグラウンド通知ポップアップの配信方法
[ui.toast]
# off = ポップアップ通知を無効化
# herdr = アプリ内トーストで表示
# terminal = 外側のターミナルにデスクトップ通知の表示を依頼
# system = OS の通知サービスに直接依頼
# delivery = "off"
# delay_seconds = 1

[ui.toast.herdr]
# position = "bottom-right"

[ui.toast.clipboard]
# enabled = true
# position = "bottom-center"

# バックグラウンドのワークスペースでエージェントの状態が変わったときに音を鳴らす
[ui.sound]
# enabled = true
# 任意のカスタム mp3 サウンドファイル。相対パスはこの設定ファイルのディレクトリから解決される。
# path = "sounds/notification.mp3"   # すべてのサウンド通知に使う 1 つの mp3 ファイル
# done_path = "sounds/done.mp3"      # 完了通知のみを上書き
# request_path = "sounds/request.mp3" # 要対応通知のみを上書き

# エージェントごとの上書き: default | on | off
# デフォルトでは droid はミュート。
# [ui.sound.agents]
# droid = "off"

[session]
# Herdr サーバーの再起動後、対応する AI エージェントのペインをネイティブの
# 会話セッションへ復帰させる。セッション参照を報告する公式インテグレーションが必要。
# resume_agents_on_restore = true

[remote]
# `herdr --remote` で使う ssh 設定を herdr が管理するかどうか。
# true (デフォルト) の場合、herdr はリモート ssh を生成した設定ファイル経由で実行する。
# その設定はまず ~/.ssh/config を include し、アイドル時のネットワーク/NAT タイムアウトを
# 乗り切るためのフォールバックとして ServerAliveInterval/ServerAliveCountMax を追加する
# (自分で設定した keepalive 値があればそちらが優先される)。また herdr は最初に認証した
# 接続を再利用するため、アタッチごとの専用 OpenSSH コントロールソケットを使う。
# false にすると ssh 設定に手を加えないプレーンな ssh を実行する — keepalive や多重化を
# 強制的にオフにするわけではなく、herdr が独自設定を追加しなくなるだけ。
# manage_ssh_config = true

[experimental]
# herdr 管理下のペインの中から herdr を起動できるようにする。
# allow_nested = false
# アタッチ中のクライアント向けの実験的なローカル Kitty グラフィックス描画。
# Kitty グラフィックス互換の外側ターミナルが必要。
# kitty_graphics = false
# サーバーの完全再起動をまたいで直近のペイン画面履歴を保存する。
pane_history = false
# prefix モードが有効な間、macOS のホスト入力ソースを一時的に ASCII 対応の
# キーボードレイアウトへ切り替え、CJK IME が有効でも prefix コマンドが
# 効くようにする。prefix モード終了時に元の入力ソースへ戻す。
# macOS のみ。ベストエフォート。デフォルト: false。
# switch_ascii_input_source_in_prefix = false
# TUI が独自にカーソルを描画する場合 (Claude Code, pi, codex) でも macOS の
# 入力メソッドが変換候補ウィンドウを追従できるよう、フォーカス中ペインの
# カーソルを外側ターミナルへ公開する。トレードオフ: 代わりのカーソルを描画せずに
# カーソルを隠すアプリ (vim のノーマルモードなど) では余分なカーソルが見える。
# reveal_hidden_cursor_for_cjk_ime = false
# 任意の許可リスト: 検出されたエージェントがこの名前のいずれかに一致する
# フォーカス中ペインでのみカーソルを公開する。空の場合はどのフォーカス中ペインにも適用する。
# リストに有効な名前が 1 つもない場合、公開は適用されない。
# 指定可能: pi, claude, codex, gemini, cursor, devin, cline, opencode,
# copilot, kimi, kiro, droid, amp, grok, hermes, kilo, qodercli, qoder.
# cjk_ime_agents = []
# reveal_hidden_cursor_for_cjk_ime が true のときに描画するカーソル形状。
# 値: block, steady_block (デフォルト), underline, steady_underline, bar, steady_bar。
# cjk_ime_cursor_shape = "steady_block"

[advanced]
# ペインのターミナルごとに保持するスクロールバックバッファの最大サイズ (バイト)。
# Ghostty のデフォルトの scrollback-limit の挙動に合わせている。
# scrollback_limit_bytes = 10000000
```

```toml [コメント抜き]
onboarding = true

[theme]
name = "catppuccin"
auto_switch = false
dark_name = "catppuccin"
light_name = "catppuccin-latte"

[terminal]
default_shell = ""
shell_mode = "auto"
new_cwd = "follow"

[update]
channel = "stable"
version_check = true
manifest_check = true

[keys]
prefix = "ctrl+b"
help = "prefix+?"
settings = "prefix+s"
detach = "prefix+q"
reload_config = "prefix+shift+r"
open_notification_target = "prefix+o"
workspace_picker = "prefix+w"
goto = "prefix+g"
new_workspace = "prefix+shift+n"
new_worktree = "prefix+shift+g"
open_worktree = ""
remove_worktree = ""
rename_workspace = "prefix+shift+w"
close_workspace = "prefix+shift+d"
previous_workspace = ""
next_workspace = ""
previous_agent = ""
next_agent = ""
focus_agent = ""
remote_image_paste = "ctrl+v"
new_tab = "prefix+c"
rename_tab = "prefix+shift+t"
previous_tab = "prefix+p"
next_tab = "prefix+n"
switch_tab = "prefix+1..9"
switch_workspace = ""
close_tab = "prefix+shift+x"
rename_pane = "prefix+shift+p"
edit_scrollback = "prefix+e"
focus_pane_left = "prefix+h"
focus_pane_down = "prefix+j"
focus_pane_up = "prefix+k"
focus_pane_right = "prefix+l"
cycle_pane_next = "prefix+tab"
cycle_pane_previous = "prefix+shift+tab"
last_pane = ""
split_vertical = "prefix+v"
split_horizontal = "prefix+minus"
close_pane = "prefix+x"
zoom = "prefix+z"
resize_mode = "prefix+r"
toggle_sidebar = "prefix+b"
navigate_workspace_up = "up"
navigate_workspace_down = "down"
navigate_pane_left = "h"
navigate_pane_down = "j"
navigate_pane_up = "k"
navigate_pane_right = "l"

[keys.indexed]
tabs = ""
workspaces = ""
agents = ""

[worktrees]
directory = "~/.herdr/worktrees"

[ui]
sidebar_width = 26
sidebar_min_width = 18
sidebar_max_width = 36
sidebar_collapsed_mode = "compact"
mobile_width_threshold = 64
mouse_capture = true
host_cursor = "auto"
right_click_passthrough_modifier = ""
redraw_on_focus_gained = true
mouse_scroll_lines = 3
confirm_close = true
prompt_new_tab_name = true
pane_borders = true
pane_gaps = true
show_agent_labels_on_pane_borders = false
hide_tab_bar_when_single_tab = false
agent_panel_sort = "spaces"
accent = "cyan"

[ui.toast]
delivery = "off"
delay_seconds = 1

[ui.toast.herdr]
position = "bottom-right"

[ui.toast.clipboard]
enabled = true
position = "bottom-center"

[ui.sound]
enabled = true

[ui.sound.agents]
droid = "off"

[session]
resume_agents_on_restore = true

[remote]
manage_ssh_config = true

[experimental]
allow_nested = false
kitty_graphics = false
pane_history = false
switch_ascii_input_source_in_prefix = false
reveal_hidden_cursor_for_cjk_ime = false
cjk_ime_agents = []
cjk_ime_cursor_shape = "steady_block"

[advanced]
scrollback_limit_bytes = 10000000
```

```toml [mozumasu の設定]
onboarding = false

[theme]
name = "solarized"
auto_switch = false

[theme.custom]
panel_bg = "reset"
# accent = "#f5c2e7"
red = "#ff6188"
green = "#a6e3a1"

[terminal]
default_shell = "" # Empty means $SHELL, then /bin/sh.
shell_mode = "auto"
new_cwd = "follow"

[update]
channel = "stable" # For Nix management
version_check = false # For Nix management
manifest_check = true # Keep only agent detection rules up-to-date

[keys]
prefix = "ctrl+q"
help = "prefix+?"
settings = "prefix+s"
detach = "prefix+q"
reload_config = ""
open_notification_target = "prefix+o"

# workspace
workspace_picker = "prefix+w"
goto = "prefix+g"
new_workspace = "prefix+shift+n" # default prefix+shift+n
rename_workspace = "prefix+shift+r"
close_workspace = "prefix+shift+d"
previous_workspace = "prefix+p"
next_workspace = "prefix+n"
switch_workspace = ""   # optional indexed binding, e.g. "prefix+shift+1..9"

# worktree
new_worktree = "prefix+shift+g"
open_worktree = ""    # optional, unset by default
remove_worktree = ""  # optional, unset by default; opens confirmation

# agent
previous_agent = "cmd+ctrl+p"     # optional, unset by default
next_agent = "cmd+ctrl+n"         # optional, unset by default
focus_agent = ""        # optional indexed binding, e.g. "prefix+alt+1..9"

remote_image_paste = "ctrl+v" # only active in herdr --remote; empty disables raw-key image paste

# tab
new_tab = "cmd+t"
rename_tab = "prefix+shift+t"
previous_tab = "ctrl+shift+tab"
next_tab = "ctrl+tab"
switch_tab = "cmd+1..9"
close_tab = "prefix+shift+x"

# Pane
rename_pane = "prefix+shift+p"
edit_scrollback = "prefix+e"
focus_pane_left = "shift+backspace"
focus_pane_down = "ctrl+shift+j"
focus_pane_up = "ctrl+shift+k"
focus_pane_right = "ctrl+shift+l"
cycle_pane_next = "" # prefix+tab
cycle_pane_previous = "" # prefix+shift+tab
last_pane = "prefix+tab"          # optional, unset by default; bind e.g. "prefix+tab" for global back-and-forth
split_vertical = "prefix+v"
split_horizontal = "prefix+-"
close_pane = "prefix+x"
zoom = "ctrl+shift+z"
resize_mode = "" # default prefix+r

toggle_sidebar = "prefix+b"

# Navigate-mode
navigate_workspace_up = "ctrl+p"
navigate_workspace_down = "ctrl+n"
navigate_pane_left = "h"
navigate_pane_down = "j"
navigate_pane_up = "k"
navigate_pane_right = "l"

# Copy the previous command line + output of the focused pane to the clipboard
[[keys.command]]
key = "prefix+y"
type = "shell"
command = "$HOME/dotfiles/.config/herdr/bin/herdr-copy-last-output"

[[keys.command]]
key = "prefix+shift+l"
type = "pane"
command = "lazygit"

[[keys.command]]
key = "prefix+shift+v"
type = "pane"
command = "nvim"

# [worktrees]
# directory = "~/.herdr/worktrees"

[ui]
# Sidebar width (auto-scaled based on workspace names, this sets the default)
sidebar_width = 26
sidebar_min_width = 18
sidebar_max_width = 36
mobile_width_threshold = 64
mouse_capture = true
right_click_passthrough_modifier = ""
redraw_on_focus_gained = true
mouse_scroll_lines = 3
confirm_close = true
prompt_new_tab_name = true
pane_borders = true
pane_gaps = false
show_agent_labels_on_pane_borders = true
agent_panel_sort = "spaces"
accent = "cyan"

[ui.toast]
delay_seconds = 1
delivery = "herdr"

[ui.toast.herdr]
position = "bottom-right"

[ui.toast.clipboard]
enabled = true
position = "bottom-center"

[ui.sound]
enabled = true

[ui.sound.agents]
droid = "off" # By default, droid is muted.

[session]
resume_agents_on_restore = true

[remote]
manage_ssh_config = true

[experimental]
allow_nested = false
kitty_graphics = true
pane_history = true
switch_ascii_input_source_in_prefix = true # default false
reveal_hidden_cursor_for_cjk_ime = false
cjk_ime_agents = []
cjk_ime_cursor_shape = "steady_block" # Values: block, steady_block (default), underline, steady_underline, bar, steady_bar.

[advanced]
scrollback_limit_bytes = 10000000
```

::

</div>

---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# prefix キーを何にするか

::left::

キーバインドの起点となるキー (デフォルト: `ctrl+b`)

config.toml のコメントに挙がっている候補はどれも採用しなかった

<FindyKeyValueList size="1.02rem">
  <FindyKeyValue label="ctrl+b">Emacs の backward-char と被る</FindyKeyValue>
  <FindyKeyValue label="f12">ホームポジションから遠い</FindyKeyValue>
  <FindyKeyValue label="esc">Emacs の Meta (M-) キーと被る</FindyKeyValue>
  <FindyKeyValue label="-"><code>cd -</code> の abbreviation と被る</FindyKeyValue>
</FindyKeyValueList>

::right::

WezTerm の Leader を `ctrl+;` にしたので
`ctrl+q` が空いた。これを herdr の prefix にする

```toml
prefix = "ctrl+q"
```

<FindyCallout variant="warn">
  <code>ctrl+q</code> はフロー制御 (XON) のキー。
  zsh で <code>stty -ixon</code> を設定済みなら競合しない
</FindyCallout>

---
layout: content
eyebrow: herdr
---

# なぜ WezTerm が `ctrl+;` で herdr が `ctrl+q`?

キーの「届く範囲」で振り分けた

<FindyKeyValueList size="1.05rem" gap="1rem">
  <FindyKeyValue label="ctrl+;">従来の端末キーエンコーディングに無いキー。シェルや fzf に届かないので、WezTerm が握っても衝突しにくい</FindyKeyValue>
  <FindyKeyValue label="ctrl+q">端末を選ばず確実に届くキー。herdr の公式設定にも「修飾付き記号は端末依存」と注記があるため、prefix はこちらにした</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout>
  kitty keyboard protocol 対応の TUI には <code>ctrl+;</code> も届くが、WezTerm が先取りすれば問題ない
</FindyCallout>

---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# cmd キーを herdr で使う

::left::

`cmd+t` のような cmd 修飾は従来の端末エンコーディングに存在せず、そのままでは TUI に届かない

WezTerm 側で 2 つの前提を満たす

<FindyKeyValueList size="1.02rem">
  <FindyKeyValue label="kitty protocol を許可"><code>enable_kitty_keyboard = true</code>。herdr が起動時に要求し、cmd (SUPER) 修飾付きでキーが届くようになる</FindyKeyValue>
  <FindyKeyValue label="WezTerm に食わせない"><code>cmd+t</code> は WezTerm の SpawnTab が先に消費する。使うキーだけ <code>DisableDefaultAssignment</code> で解除する</FindyKeyValue>
</FindyKeyValueList>

::right::

```lua [.config/wezterm/wezterm.lua]
config.enable_kitty_keyboard = true

-- 個別に解除する場合。mozumasu は
-- disable_default_key_bindings = true で全解除
config.keys = {
  { key = "t", mods = "SUPER",
    action = wezterm.action.DisableDefaultAssignment },
}
```

```toml [.config/herdr/config.toml]
new_tab = "cmd+t"
switch_tab = "cmd+1..9"
previous_agent = "cmd+ctrl+p"
next_agent = "cmd+ctrl+n"
```

<FindyCallout variant="warn">
  古い WezTerm には cmd が kitty エンコードされないバグがあった。効かないときはまず <code>wezterm --version</code> を確認 (20240203 以降なら修正済み)
</FindyCallout>

---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# よく使う herdr キーバインド

::left::

```toml [ペイン操作]
split_vertical = "prefix+v"       # 縦に分割
split_horizontal = "prefix+minus" # 横に分割
focus_pane_left = "prefix+h"      # ペイン移動 ←
focus_pane_down = "prefix+j"      # ↓
focus_pane_up = "prefix+k"        # ↑
focus_pane_right = "prefix+l"     # →
zoom = "prefix+z"                 # ズーム
close_pane = "prefix+x"           # 閉じる
resize_mode = "prefix+r"          # リサイズ
```

::right::

```toml [タブ・ワークスペース]
new_tab = "prefix+c"          # 新しいタブ
next_tab = "prefix+n"         # 次のタブ
previous_tab = "prefix+p"     # 前のタブ
switch_tab = "prefix+1..9"    # 番号で切替
workspace_picker = "prefix+w" # 一覧から選択
help = "prefix+?"             # 全キー一覧
settings = "prefix+s"         # 設定画面
```

<FindyCallout>
  <code>prefix+?</code> で全キーバインドを確認できるので、まず覚えるのはこれだけ
</FindyCallout>

---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# 設定のリロードを楽にする

::left::

config.toml の変更はコマンドで反映できる

```sh
herdr server reload-config
```

これを WezTerm のコマンドパレット
(`Ctrl+Shift+P`) に登録した

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="実行方法">ペインは開かずバックグラウンド</FindyKeyValue>
  <FindyKeyValue label="PATH">ログインシェル経由 (<code>-lic</code>) で確保</FindyKeyValue>
</FindyKeyValueList>

::right::

```lua [.config/wezterm/keymaps.lua]
-- augment-command-palette 内
{
  brief = "Herdr: Reload config",
  icon = "md_refresh",
  action = wezterm.action_callback(function()
    wezterm.background_child_process({
      os.getenv("SHELL") or "/bin/zsh",
      "-lic",
      "herdr server reload-config",
    })
  end),
},
```

---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# 公式インテグレーション

::left::

herdr は各 AI エージェントの<FindyAccentMark>公式スキル</FindyAccentMark>を提供している

インストールすると、エージェントが `herdr` CLI でペインの作成・操作・読み取りをできるようになる

```sh
# インストール
herdr integration install claude

# ステータス確認
herdr integration status
```

::right::

対応エージェント（一部）

<div class="lead mt-4">

- [Claude Code](https://claude.ai/code)
- [Codex](https://github.com/openai/codex)
- [Copilot](https://github.com/features/copilot)
- [Cursor](https://cursor.com)
- [Devin](https://devin.ai)
- ほか計 14 エージェントに対応

</div>

<FindyRef>

[herdr integration](https://herdr.dev)

</FindyRef>

---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# herdr は AI からも操作できる

::left::

Claude Code に herdr スキルを入れると、
エージェント自身が `herdr` CLI でペインを操作できる

<FindyKeyValueList size="1.02rem">
  <FindyKeyValue label="発動条件">依頼で Herdr を明示したとき</FindyKeyValue>
  <FindyKeyValue label="前提">Herdr 管理ペイン内 (<code>HERDR_ENV=1</code>)</FindyKeyValue>
</FindyKeyValueList>

例: 「Issue #42 を実装して、herdr でペイン作って進めて」

::right::

隣のペインにエージェントが生えて、並列に作業が回る

<FindyKeyValueList size="1.02rem">
  <FindyKeyValue label="1. split">隣にペインを作る</FindyKeyValue>
  <FindyKeyValue label="2. run">claude を対話起動してタスクを投入</FindyKeyValue>
  <FindyKeyValue label="3. wait">working → done を待つ</FindyKeyValue>
  <FindyKeyValue label="4. read">結果を読んで回収</FindyKeyValue>
</FindyKeyValueList>


---
layout: two-cols
ratio: 1/1
eyebrow: herdr
---

# Claude が裏で叩いているコマンド

::left::

<div class="code-compact" style="--findy-code-compact-size: 0.95rem">

```sh
# 隣にペインを作る (フォーカスは奪わない)
herdr pane split --current \
  --direction right --no-focus

# 返ってきた pane ID で claude を対話起動
herdr pane run w1:p2 "claude"

# プロンプトが開いたらタスクを投入
herdr pane run w1:p2 "Issue #42 を実装して"
```

</div>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.95rem">

```sh
# ステータスを確認
herdr pane get w1:p2

# 完了を待って結果を読む
herdr wait agent-status w1:p2 --status done
herdr pane read w1:p2 \
  --source recent-unwrapped
```

</div>

<FindyCallout>
  ファイルを編集するタスクは <code>herdr worktree create</code> で
  checkout ごと分離してからペインを開くと、手元の作業と衝突しない
</FindyCallout>
