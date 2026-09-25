local wezterm = require("wezterm")
local config = wezterm.config_builder()
local act = wezterm.action

config.automatically_reload_config = true

------------------------------------------------------------------------
-- WSL
------------------------------------------------------------------------
-- ドメイン名は "WSL:" + ディストリビューション名 (wsl -l -v で確認)
config.default_domain = "WSL:Ubuntu"

------------------------------------------------------------------------
-- フォント
------------------------------------------------------------------------
config.font_size = 14.0
config.font = wezterm.font("HackGen Console NF")

------------------------------------------------------------------------
-- 見た目
------------------------------------------------------------------------
-- 背景を透過 + ぼかし (Windows: Acrylic 効果)
config.window_background_opacity = 0.85
config.win32_system_backdrop = "Acrylic"

config.window_decorations = "RESIZE"
config.hide_tab_bar_if_only_one_tab = true

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
  { key = "p", mods = "CTRL|SHIFT",
    action = act.ActivateCommandPalette },
  { key = "|", mods = "LEADER|SHIFT",
    action = act.SplitHorizontal{} },
  { key = "-", mods = "LEADER",
    action = act.SplitVertical{} },
  { key = "h", mods = "LEADER",
    action = act.ActivatePaneDirection("Left") },
  { key = "j", mods = "LEADER",
    action = act.ActivatePaneDirection("Down") },
  { key = "k", mods = "LEADER",
    action = act.ActivatePaneDirection("Up") },
  { key = "l", mods = "LEADER",
    action = act.ActivatePaneDirection("Right") },
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

  { key = "Enter", mods = "SHIFT",
    action = act.SendString("\n") },
}

-- workspace のトグル切替 (Leader+s で scratch と行き来)
require("workspace").apply_to_config(config)

return config
