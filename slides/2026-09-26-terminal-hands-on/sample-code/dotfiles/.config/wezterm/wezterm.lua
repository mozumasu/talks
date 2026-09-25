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

-- タイトルバーを非表示 / タブが 1 つならタブバーも非表示
config.window_decorations = "RESIZE"
config.hide_tab_bar_if_only_one_tab = true

-- アクティブなタブだけ黄色にする
-- 丸タブにする場合はこのハンドラを消して tab.lua を読み込む:
-- require("tab").apply_to_config(config)
wezterm.on("format-tab-title", function(tab)
  local bg = tab.is_active and "#ae8b2d" or "#5c6d74"
  return {
    { Background = { Color = bg } },
    { Text = " " .. tab.active_pane.title .. " " },
  }
end)

------------------------------------------------------------------------
-- Leader キー
------------------------------------------------------------------------
config.leader = {
  key = ";",
  mods = "CTRL",
  timeout_milliseconds = 2000,
}

------------------------------------------------------------------------
-- キーバインド
------------------------------------------------------------------------
config.keys = {
  -- コマンドパレット
  { key = "p", mods = "CTRL|SHIFT",
    action = act.ActivateCommandPalette },

  -- ペイン分割
  { key = "|", mods = "LEADER|SHIFT",
    action = act.SplitHorizontal{} },
  { key = "-", mods = "LEADER",
    action = act.SplitVertical{} },

  -- ペイン移動 (Vim 方向キー)
  { key = "h", mods = "LEADER",
    action = act.ActivatePaneDirection("Left") },
  { key = "j", mods = "LEADER",
    action = act.ActivatePaneDirection("Down") },
  { key = "k", mods = "LEADER",
    action = act.ActivatePaneDirection("Up") },
  { key = "l", mods = "LEADER",
    action = act.ActivatePaneDirection("Right") },

  -- ペインズーム
  { key = "z", mods = "LEADER",
    action = act.TogglePaneZoomState },

  -- ワークスペース: 新規作成 (名前は自動)
  { key = "n", mods = "LEADER",
    action = act.SwitchToWorkspace },
  -- ワークスペース: 一覧からあいまい検索で選択
  { key = "w", mods = "LEADER",
    action = act.ShowLauncherArgs({
      flags = "FUZZY|WORKSPACES",
    }) },

  -- QuickSelect (IME 切替と被るので Cmd+Space に変更)
  { key = " ", mods = "SUPER",
    action = act.QuickSelect },

  -- Claude Code 用: Shift+Enter で改行を送る
  { key = "Enter", mods = "SHIFT",
    action = act.SendString("\n") },

  -- herdr の cmd+t (new_tab) を WezTerm に食わせない
  { key = "t", mods = "SUPER",
    action = act.DisableDefaultAssignment },
}

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

------------------------------------------------------------------------
-- keybinds.lua から読み込む場合 (wezterm show-keys --lua > keybinds.lua)
------------------------------------------------------------------------
-- config.keys = require("keybinds").keys
-- config.key_tables = require("keybinds").key_tables

return config
