local wezterm = require("wezterm")
local act = wezterm.action

local module = {}

-- 切替前にいた workspace 名を覚えておく
local previous = {}

-- 指定 workspace との行き来をトグルするアクションを返す
local function toggle_workspace(name, spawn)
  return wezterm.action_callback(function(window, pane)
    local current = wezterm.mux.get_active_workspace()
    if current == name then
      -- 2 度目は元いた workspace へ戻る
      window:perform_action(act.SwitchToWorkspace({
        name = previous[name] or "default",
      }), pane)
    else
      previous[name] = current
      window:perform_action(act.SwitchToWorkspace({
        name = name,
        spawn = spawn,
      }), pane)
    end
  end)
end

function module.apply_to_config(config)
  config.keys = config.keys or {}

  -- Leader+s でメモ用の scratch と行き来する
  table.insert(config.keys, {
    key = "s",
    mods = "LEADER",
    action = toggle_workspace("scratch"),
  })
end

return module
