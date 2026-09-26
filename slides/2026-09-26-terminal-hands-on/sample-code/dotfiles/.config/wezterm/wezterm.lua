local wezterm = require("wezterm")
local config = wezterm.config_builder()
local act = wezterm.action

-- 設定ファイルの変更を自動で読み込む
config.automatically_reload_config = true

------------------------------------------------------------------------
-- フォント
------------------------------------------------------------------------
config.font_size = 14.0
config.font = wezterm.font("HackGen Console NF")

------------------------------------------------------------------------
-- 見た目
------------------------------------------------------------------------
-- 背景を透過 + ぼかし (macOS)
config.window_background_opacity = 0.85
config.macos_window_background_blur = 20

-- タイトルバーを非表示
config.window_decorations = "RESIZE"

-- 丸タブ (タブバーの位置や配色は tab.lua にまとめている)
require("tab").apply_to_config(config)

------------------------------------------------------------------------
-- キーバインド
------------------------------------------------------------------------
-- デフォルトのキーバインドは切り、keybinds.lua に書いたものだけを使う
-- (wezterm show-keys --lua > keybinds.lua で生成し、要らない行を消して自分のキーを足す)
require("keybinds").apply_to_config(config)

-- workspace のトグル切替 (Leader+s で scratch と行き来)
require("workspace").apply_to_config(config)

------------------------------------------------------------------------
-- QuickSelect のパターン
------------------------------------------------------------------------
-- 拾いたいパターンは正規表現で足せる
config.quick_select_patterns = {
  -- Git commit hash
  "\\b[0-9a-f]{7,40}\\b",
}
-- URL やパスなどのデフォルトパターンも無効にして全部自分で握るなら
-- config.disable_default_quick_select_patterns = true

------------------------------------------------------------------------
-- herdr で cmd キーを使うための前提
------------------------------------------------------------------------
-- kitty keyboard protocol を許可し、cmd (SUPER) 修飾を TUI に届ける
config.enable_kitty_keyboard = true

return config
