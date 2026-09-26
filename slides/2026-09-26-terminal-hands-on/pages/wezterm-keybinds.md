---
layout: section
color: blue
toc: ターミナルのキーバインド
---

# ターミナルのキーバインド

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# キーバインドはゼロから書かない

::left::

<p class="text-sm">1. デフォルトのキーバインドを Lua 形式で書き出す</p>

<div class="code-compact" style="--findy-code-compact-size: 0.75rem">

```sh
cd ~/.config/wezterm
wezterm show-keys --lua > keybinds.lua
```

</div>

<FindyCallout>
  中身はデフォルトと同じ。要らない行はこのファイルから消し、自分のキーもここに足していく
</FindyCallout>

<p class="text-sm">2. 分割ファイルの形に整えて wezterm.lua から読み込む (次のページ)</p>

<style>
.slidev-code-wrapper {
  margin: 0.5rem 0;
}
.slidev-code-wrapper .slidev-code {
  padding: 0.75rem 1.1rem !important;
}
p {
  margin: 0.4rem 0;
}
.findy-callout {
  margin: 0.5rem 0;
  padding: 0.4em 1em 0.5em;
  font-size: 0.8rem;
}
h1 {
  margin-bottom: 1.2rem;
}
</style>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.75rem">

::code-group


```lua [生成されるファイル]
local wezterm = require("wezterm")
local act = wezterm.action

return {
  keys = {
    { key = "Tab", mods = "CTRL", action = act.ActivateTabRelative(1) },
    { key = "Tab", mods = "SHIFT|CTRL", action = act.ActivateTabRelative(-1) },
    { key = "Enter", mods = "ALT", action = act.ToggleFullScreen },
    { key = "!", mods = "CTRL", action = act.ActivateTab(0) },
    { key = "!", mods = "SHIFT|CTRL", action = act.ActivateTab(0) },
    { key = '"', mods = "ALT|CTRL", action = act.SplitVertical({ domain = "CurrentPaneDomain" }) },
    { key = '"', mods = "SHIFT|ALT|CTRL", action = act.SplitVertical({ domain = "CurrentPaneDomain" }) },
    { key = "#", mods = "CTRL", action = act.ActivateTab(2) },
    { key = "#", mods = "SHIFT|CTRL", action = act.ActivateTab(2) },
    { key = "$", mods = "CTRL", action = act.ActivateTab(3) },
    { key = "$", mods = "SHIFT|CTRL", action = act.ActivateTab(3) },
    { key = "%", mods = "CTRL", action = act.ActivateTab(4) },
    { key = "%", mods = "SHIFT|CTRL", action = act.ActivateTab(4) },
    { key = "%", mods = "ALT|CTRL", action = act.SplitHorizontal({ domain = "CurrentPaneDomain" }) },
    { key = "%", mods = "SHIFT|ALT|CTRL", action = act.SplitHorizontal({ domain = "CurrentPaneDomain" }) },
    { key = "&", mods = "CTRL", action = act.ActivateTab(6) },
    { key = "&", mods = "SHIFT|CTRL", action = act.ActivateTab(6) },
    { key = "'", mods = "SHIFT|ALT|CTRL", action = act.SplitVertical({ domain = "CurrentPaneDomain" }) },
    { key = "(", mods = "CTRL", action = act.ActivateTab(-1) },
    { key = "(", mods = "SHIFT|CTRL", action = act.ActivateTab(-1) },
    { key = ")", mods = "CTRL", action = act.ResetFontSize },
    { key = ")", mods = "SHIFT|CTRL", action = act.ResetFontSize },
    { key = "*", mods = "CTRL", action = act.ActivateTab(7) },
    { key = "*", mods = "SHIFT|CTRL", action = act.ActivateTab(7) },
    { key = "+", mods = "CTRL", action = act.IncreaseFontSize },
    { key = "+", mods = "SHIFT|CTRL", action = act.IncreaseFontSize },
    { key = "-", mods = "CTRL", action = act.DecreaseFontSize },
    { key = "-", mods = "SHIFT|CTRL", action = act.DecreaseFontSize },
    { key = "-", mods = "SUPER", action = act.DecreaseFontSize },
    { key = "0", mods = "CTRL", action = act.ResetFontSize },
    { key = "0", mods = "SHIFT|CTRL", action = act.ResetFontSize },
    { key = "0", mods = "SUPER", action = act.ResetFontSize },
    { key = "1", mods = "SHIFT|CTRL", action = act.ActivateTab(0) },
    { key = "1", mods = "SUPER", action = act.ActivateTab(0) },
    { key = "2", mods = "SHIFT|CTRL", action = act.ActivateTab(1) },
    { key = "2", mods = "SUPER", action = act.ActivateTab(1) },
    { key = "3", mods = "SHIFT|CTRL", action = act.ActivateTab(2) },
    { key = "3", mods = "SUPER", action = act.ActivateTab(2) },
    { key = "4", mods = "SHIFT|CTRL", action = act.ActivateTab(3) },
    { key = "4", mods = "SUPER", action = act.ActivateTab(3) },
    { key = "5", mods = "SHIFT|CTRL", action = act.ActivateTab(4) },
    { key = "5", mods = "SHIFT|ALT|CTRL", action = act.SplitHorizontal({ domain = "CurrentPaneDomain" }) },
    { key = "5", mods = "SUPER", action = act.ActivateTab(4) },
    { key = "6", mods = "SHIFT|CTRL", action = act.ActivateTab(5) },
    { key = "6", mods = "SUPER", action = act.ActivateTab(5) },
    { key = "7", mods = "SHIFT|CTRL", action = act.ActivateTab(6) },
    { key = "7", mods = "SUPER", action = act.ActivateTab(6) },
    { key = "8", mods = "SHIFT|CTRL", action = act.ActivateTab(7) },
    { key = "8", mods = "SUPER", action = act.ActivateTab(7) },
    { key = "9", mods = "SHIFT|CTRL", action = act.ActivateTab(-1) },
    { key = "9", mods = "SUPER", action = act.ActivateTab(-1) },
    { key = "=", mods = "CTRL", action = act.IncreaseFontSize },
    { key = "=", mods = "SHIFT|CTRL", action = act.IncreaseFontSize },
    { key = "=", mods = "SUPER", action = act.IncreaseFontSize },
    { key = "@", mods = "CTRL", action = act.ActivateTab(1) },
    { key = "@", mods = "SHIFT|CTRL", action = act.ActivateTab(1) },
    { key = "C", mods = "CTRL", action = act.CopyTo("Clipboard") },
    { key = "C", mods = "SHIFT|CTRL", action = act.CopyTo("Clipboard") },
    { key = "F", mods = "CTRL", action = act.Search("CurrentSelectionOrEmptyString") },
    { key = "F", mods = "SHIFT|CTRL", action = act.Search("CurrentSelectionOrEmptyString") },
    { key = "H", mods = "CTRL", action = act.HideApplication },
    { key = "H", mods = "SHIFT|CTRL", action = act.HideApplication },
    { key = "K", mods = "CTRL", action = act.ClearScrollback("ScrollbackOnly") },
    { key = "K", mods = "SHIFT|CTRL", action = act.ClearScrollback("ScrollbackOnly") },
    { key = "L", mods = "CTRL", action = act.ShowDebugOverlay },
    { key = "L", mods = "SHIFT|CTRL", action = act.ShowDebugOverlay },
    { key = "M", mods = "CTRL", action = act.Hide },
    { key = "M", mods = "SHIFT|CTRL", action = act.Hide },
    { key = "N", mods = "CTRL", action = act.SpawnWindow },
    { key = "N", mods = "SHIFT|CTRL", action = act.SpawnWindow },
    { key = "P", mods = "CTRL", action = act.ActivateCommandPalette },
    { key = "P", mods = "SHIFT|CTRL", action = act.ActivateCommandPalette },
    { key = "Q", mods = "CTRL", action = act.QuitApplication },
    { key = "Q", mods = "SHIFT|CTRL", action = act.QuitApplication },
    { key = "R", mods = "CTRL", action = act.ReloadConfiguration },
    { key = "R", mods = "SHIFT|CTRL", action = act.ReloadConfiguration },
    { key = "T", mods = "CTRL", action = act.SpawnTab("CurrentPaneDomain") },
    { key = "T", mods = "SHIFT|CTRL", action = act.SpawnTab("CurrentPaneDomain") },
    {
      key = "U",
      mods = "CTRL",
      action = act.CharSelect({ copy_on_select = true, copy_to = "ClipboardAndPrimarySelection" }),
    },
    {
      key = "U",
      mods = "SHIFT|CTRL",
      action = act.CharSelect({ copy_on_select = true, copy_to = "ClipboardAndPrimarySelection" }),
    },
    { key = "V", mods = "CTRL", action = act.PasteFrom("Clipboard") },
    { key = "V", mods = "SHIFT|CTRL", action = act.PasteFrom("Clipboard") },
    { key = "W", mods = "CTRL", action = act.CloseCurrentTab({ confirm = true }) },
    { key = "W", mods = "SHIFT|CTRL", action = act.CloseCurrentTab({ confirm = true }) },
    { key = "X", mods = "CTRL", action = act.ActivateCopyMode },
    { key = "X", mods = "SHIFT|CTRL", action = act.ActivateCopyMode },
    { key = "Z", mods = "CTRL", action = act.TogglePaneZoomState },
    { key = "Z", mods = "SHIFT|CTRL", action = act.TogglePaneZoomState },
    { key = "[", mods = "SHIFT|SUPER", action = act.ActivateTabRelative(-1) },
    { key = "]", mods = "SHIFT|SUPER", action = act.ActivateTabRelative(1) },
    { key = "^", mods = "CTRL", action = act.ActivateTab(5) },
    { key = "^", mods = "SHIFT|CTRL", action = act.ActivateTab(5) },
    { key = "_", mods = "CTRL", action = act.DecreaseFontSize },
    { key = "_", mods = "SHIFT|CTRL", action = act.DecreaseFontSize },
    { key = "c", mods = "SHIFT|CTRL", action = act.CopyTo("Clipboard") },
    { key = "c", mods = "SUPER", action = act.CopyTo("Clipboard") },
    { key = "f", mods = "SHIFT|CTRL", action = act.Search("CurrentSelectionOrEmptyString") },
    { key = "f", mods = "SUPER", action = act.Search("CurrentSelectionOrEmptyString") },
    { key = "h", mods = "SHIFT|CTRL", action = act.HideApplication },
    { key = "h", mods = "SUPER", action = act.HideApplication },
    { key = "k", mods = "SHIFT|CTRL", action = act.ClearScrollback("ScrollbackOnly") },
    { key = "k", mods = "SUPER", action = act.ClearScrollback("ScrollbackOnly") },
    { key = "l", mods = "SHIFT|CTRL", action = act.ShowDebugOverlay },
    { key = "m", mods = "SHIFT|CTRL", action = act.Hide },
    { key = "m", mods = "SUPER", action = act.Hide },
    { key = "n", mods = "SHIFT|CTRL", action = act.SpawnWindow },
    { key = "n", mods = "SUPER", action = act.SpawnWindow },
    { key = "p", mods = "SHIFT|CTRL", action = act.ActivateCommandPalette },
    { key = "q", mods = "SHIFT|CTRL", action = act.QuitApplication },
    { key = "q", mods = "SUPER", action = act.QuitApplication },
    { key = "r", mods = "SHIFT|CTRL", action = act.ReloadConfiguration },
    { key = "r", mods = "SUPER", action = act.ReloadConfiguration },
    { key = "t", mods = "SHIFT|CTRL", action = act.SpawnTab("CurrentPaneDomain") },
    { key = "t", mods = "SUPER", action = act.SpawnTab("CurrentPaneDomain") },
    {
      key = "u",
      mods = "SHIFT|CTRL",
      action = act.CharSelect({ copy_on_select = true, copy_to = "ClipboardAndPrimarySelection" }),
    },
    { key = "v", mods = "SHIFT|CTRL", action = act.PasteFrom("Clipboard") },
    { key = "v", mods = "SUPER", action = act.PasteFrom("Clipboard") },
    { key = "w", mods = "SHIFT|CTRL", action = act.CloseCurrentTab({ confirm = true }) },
    { key = "w", mods = "SUPER", action = act.CloseCurrentTab({ confirm = true }) },
    { key = "x", mods = "SHIFT|CTRL", action = act.ActivateCopyMode },
    { key = "z", mods = "SHIFT|CTRL", action = act.TogglePaneZoomState },
    { key = "{", mods = "SUPER", action = act.ActivateTabRelative(-1) },
    { key = "{", mods = "SHIFT|SUPER", action = act.ActivateTabRelative(-1) },
    { key = "}", mods = "SUPER", action = act.ActivateTabRelative(1) },
    { key = "}", mods = "SHIFT|SUPER", action = act.ActivateTabRelative(1) },
    { key = "phys:Space", mods = "SHIFT|CTRL", action = act.QuickSelect },
    { key = "PageUp", mods = "SHIFT", action = act.ScrollByPage(-1) },
    { key = "PageUp", mods = "CTRL", action = act.ActivateTabRelative(-1) },
    { key = "PageUp", mods = "SHIFT|CTRL", action = act.MoveTabRelative(-1) },
    { key = "PageDown", mods = "SHIFT", action = act.ScrollByPage(1) },
    { key = "PageDown", mods = "CTRL", action = act.ActivateTabRelative(1) },
    { key = "PageDown", mods = "SHIFT|CTRL", action = act.MoveTabRelative(1) },
    { key = "LeftArrow", mods = "SHIFT|CTRL", action = act.ActivatePaneDirection("Left") },
    { key = "LeftArrow", mods = "SHIFT|ALT|CTRL", action = act.AdjustPaneSize({ "Left", 1 }) },
    { key = "RightArrow", mods = "SHIFT|CTRL", action = act.ActivatePaneDirection("Right") },
    { key = "RightArrow", mods = "SHIFT|ALT|CTRL", action = act.AdjustPaneSize({ "Right", 1 }) },
    { key = "UpArrow", mods = "SHIFT|CTRL", action = act.ActivatePaneDirection("Up") },
    { key = "UpArrow", mods = "SHIFT|ALT|CTRL", action = act.AdjustPaneSize({ "Up", 1 }) },
    { key = "DownArrow", mods = "SHIFT|CTRL", action = act.ActivatePaneDirection("Down") },
    { key = "DownArrow", mods = "SHIFT|ALT|CTRL", action = act.AdjustPaneSize({ "Down", 1 }) },
    { key = "Copy", mods = "NONE", action = act.CopyTo("Clipboard") },
    { key = "Paste", mods = "NONE", action = act.PasteFrom("Clipboard") },
  },

  key_tables = {
    copy_mode = {
      { key = "Tab", mods = "NONE", action = act.CopyMode("MoveForwardWord") },
      { key = "Tab", mods = "SHIFT", action = act.CopyMode("MoveBackwardWord") },
      { key = "Enter", mods = "NONE", action = act.CopyMode("MoveToStartOfNextLine") },
      { key = "Escape", mods = "NONE", action = act.Multiple({ "ScrollToBottom", { CopyMode = "Close" } }) },
      { key = "Space", mods = "NONE", action = act.CopyMode({ SetSelectionMode = "Cell" }) },
      { key = "$", mods = "NONE", action = act.CopyMode("MoveToEndOfLineContent") },
      { key = "$", mods = "SHIFT", action = act.CopyMode("MoveToEndOfLineContent") },
      { key = ",", mods = "NONE", action = act.CopyMode("JumpReverse") },
      { key = "0", mods = "NONE", action = act.CopyMode("MoveToStartOfLine") },
      { key = ";", mods = "NONE", action = act.CopyMode("JumpAgain") },
      { key = "F", mods = "NONE", action = act.CopyMode({ JumpBackward = { prev_char = false } }) },
      { key = "F", mods = "SHIFT", action = act.CopyMode({ JumpBackward = { prev_char = false } }) },
      { key = "G", mods = "NONE", action = act.CopyMode("MoveToScrollbackBottom") },
      { key = "G", mods = "SHIFT", action = act.CopyMode("MoveToScrollbackBottom") },
      { key = "H", mods = "NONE", action = act.CopyMode("MoveToViewportTop") },
      { key = "H", mods = "SHIFT", action = act.CopyMode("MoveToViewportTop") },
      { key = "L", mods = "NONE", action = act.CopyMode("MoveToViewportBottom") },
      { key = "L", mods = "SHIFT", action = act.CopyMode("MoveToViewportBottom") },
      { key = "M", mods = "NONE", action = act.CopyMode("MoveToViewportMiddle") },
      { key = "M", mods = "SHIFT", action = act.CopyMode("MoveToViewportMiddle") },
      { key = "O", mods = "NONE", action = act.CopyMode("MoveToSelectionOtherEndHoriz") },
      { key = "O", mods = "SHIFT", action = act.CopyMode("MoveToSelectionOtherEndHoriz") },
      { key = "T", mods = "NONE", action = act.CopyMode({ JumpBackward = { prev_char = true } }) },
      { key = "T", mods = "SHIFT", action = act.CopyMode({ JumpBackward = { prev_char = true } }) },
      { key = "V", mods = "NONE", action = act.CopyMode({ SetSelectionMode = "Line" }) },
      { key = "V", mods = "SHIFT", action = act.CopyMode({ SetSelectionMode = "Line" }) },
      { key = "^", mods = "NONE", action = act.CopyMode("MoveToStartOfLineContent") },
      { key = "^", mods = "SHIFT", action = act.CopyMode("MoveToStartOfLineContent") },
      { key = "b", mods = "NONE", action = act.CopyMode("MoveBackwardWord") },
      { key = "b", mods = "ALT", action = act.CopyMode("MoveBackwardWord") },
      { key = "b", mods = "CTRL", action = act.CopyMode("PageUp") },
      { key = "c", mods = "CTRL", action = act.Multiple({ "ScrollToBottom", { CopyMode = "Close" } }) },
      { key = "d", mods = "CTRL", action = act.CopyMode({ MoveByPage = 0.5 }) },
      { key = "e", mods = "NONE", action = act.CopyMode("MoveForwardWordEnd") },
      { key = "f", mods = "NONE", action = act.CopyMode({ JumpForward = { prev_char = false } }) },
      { key = "f", mods = "ALT", action = act.CopyMode("MoveForwardWord") },
      { key = "f", mods = "CTRL", action = act.CopyMode("PageDown") },
      { key = "g", mods = "NONE", action = act.CopyMode("MoveToScrollbackTop") },
      { key = "g", mods = "CTRL", action = act.Multiple({ "ScrollToBottom", { CopyMode = "Close" } }) },
      { key = "h", mods = "NONE", action = act.CopyMode("MoveLeft") },
      { key = "j", mods = "NONE", action = act.CopyMode("MoveDown") },
      { key = "k", mods = "NONE", action = act.CopyMode("MoveUp") },
      { key = "l", mods = "NONE", action = act.CopyMode("MoveRight") },
      { key = "m", mods = "ALT", action = act.CopyMode("MoveToStartOfLineContent") },
      { key = "o", mods = "NONE", action = act.CopyMode("MoveToSelectionOtherEnd") },
      { key = "q", mods = "NONE", action = act.Multiple({ "ScrollToBottom", { CopyMode = "Close" } }) },
      { key = "t", mods = "NONE", action = act.CopyMode({ JumpForward = { prev_char = true } }) },
      { key = "u", mods = "CTRL", action = act.CopyMode({ MoveByPage = -0.5 }) },
      { key = "v", mods = "NONE", action = act.CopyMode({ SetSelectionMode = "Cell" }) },
      { key = "v", mods = "CTRL", action = act.CopyMode({ SetSelectionMode = "Block" }) },
      { key = "w", mods = "NONE", action = act.CopyMode("MoveForwardWord") },
      {
        key = "y",
        mods = "NONE",
        action = act.Multiple({
          { CopyTo = "ClipboardAndPrimarySelection" },
          { Multiple = { "ScrollToBottom", { CopyMode = "Close" } } },
        }),
      },
      { key = "PageUp", mods = "NONE", action = act.CopyMode("PageUp") },
      { key = "PageDown", mods = "NONE", action = act.CopyMode("PageDown") },
      { key = "End", mods = "NONE", action = act.CopyMode("MoveToEndOfLineContent") },
      { key = "Home", mods = "NONE", action = act.CopyMode("MoveToStartOfLine") },
      { key = "LeftArrow", mods = "NONE", action = act.CopyMode("MoveLeft") },
      { key = "LeftArrow", mods = "ALT", action = act.CopyMode("MoveBackwardWord") },
      { key = "RightArrow", mods = "NONE", action = act.CopyMode("MoveRight") },
      { key = "RightArrow", mods = "ALT", action = act.CopyMode("MoveForwardWord") },
      { key = "UpArrow", mods = "NONE", action = act.CopyMode("MoveUp") },
      { key = "DownArrow", mods = "NONE", action = act.CopyMode("MoveDown") },
    },

    search_mode = {
      { key = "Enter", mods = "NONE", action = act.CopyMode("PriorMatch") },
      { key = "Escape", mods = "NONE", action = act.CopyMode("Close") },
      { key = "n", mods = "CTRL", action = act.CopyMode("NextMatch") },
      { key = "p", mods = "CTRL", action = act.CopyMode("PriorMatch") },
      { key = "r", mods = "CTRL", action = act.CopyMode("CycleMatchType") },
      { key = "u", mods = "CTRL", action = act.CopyMode("ClearPattern") },
      { key = "PageUp", mods = "NONE", action = act.CopyMode("PriorMatchPage") },
      { key = "PageDown", mods = "NONE", action = act.CopyMode("NextMatchPage") },
      { key = "UpArrow", mods = "NONE", action = act.CopyMode("PriorMatch") },
      { key = "DownArrow", mods = "NONE", action = act.CopyMode("NextMatch") },
    },
  },
}
```

```lua [重複したキーを除いたファイル]
local wezterm = require("wezterm")
local act = wezterm.action

local module = {}

-- wezterm show-keys --lua の出力を整理したもの。要らないキーは消し、自分のキーは末尾に足す
local keybinds = {
  keys = {
    -- 終了
    { key = "q", mods = "SUPER", action = act.QuitApplication },
    -- ウィンドウ操作
    { key = "Enter", mods = "ALT", action = act.ToggleFullScreen },
    { key = "n", mods = "SUPER", action = act.SpawnWindow },
    -- タブ操作
    { key = "Tab", mods = "CTRL", action = act.ActivateTabRelative(1) },
    { key = "Tab", mods = "SHIFT|CTRL", action = act.ActivateTabRelative(-1) },
    { key = "1", mods = "SUPER", action = act.ActivateTab(0) },
    { key = "2", mods = "SUPER", action = act.ActivateTab(1) },
    { key = "3", mods = "SUPER", action = act.ActivateTab(2) },
    { key = "4", mods = "SUPER", action = act.ActivateTab(3) },
    { key = "5", mods = "SUPER", action = act.ActivateTab(4) },
    { key = "6", mods = "SUPER", action = act.ActivateTab(5) },
    { key = "7", mods = "SUPER", action = act.ActivateTab(6) },
    { key = "8", mods = "SUPER", action = act.ActivateTab(7) },
    { key = "9", mods = "SUPER", action = act.ActivateTab(-1) },
    { key = "w", mods = "SUPER", action = act.CloseCurrentTab({ confirm = true }) },
    -- Pane操作
    { key = '"', mods = "ALT|CTRL", action = act.SplitVertical({ domain = "CurrentPaneDomain" }) },
    { key = "%", mods = "ALT|CTRL", action = act.SplitHorizontal({ domain = "CurrentPaneDomain" }) },
    { key = "LeftArrow", mods = "SHIFT|CTRL", action = act.ActivatePaneDirection("Left") },
    { key = "LeftArrow", mods = "SHIFT|ALT|CTRL", action = act.AdjustPaneSize({ "Left", 1 }) },
    { key = "RightArrow", mods = "SHIFT|CTRL", action = act.ActivatePaneDirection("Right") },
    { key = "RightArrow", mods = "SHIFT|ALT|CTRL", action = act.AdjustPaneSize({ "Right", 1 }) },
    { key = "UpArrow", mods = "SHIFT|CTRL", action = act.ActivatePaneDirection("Up") },
    { key = "UpArrow", mods = "SHIFT|ALT|CTRL", action = act.AdjustPaneSize({ "Up", 1 }) },
    { key = "DownArrow", mods = "SHIFT|CTRL", action = act.ActivatePaneDirection("Down") },
    { key = "DownArrow", mods = "SHIFT|ALT|CTRL", action = act.AdjustPaneSize({ "Down", 1 }) },

    -- フォントサイズ変更
    { key = "+", mods = "SUPER", action = act.IncreaseFontSize },
    { key = "-", mods = "SUPER", action = act.DecreaseFontSize },
    { key = "0", mods = "SUPER", action = act.ResetFontSize },

    { key = "c", mods = "SUPER", action = act.CopyTo("Clipboard") },
    { key = "v", mods = "SUPER", action = act.PasteFrom("Clipboard") },
    { key = "C", mods = "CTRL", action = act.CopyTo("Clipboard") },

    -- Debug
    { key = "L", mods = "CTRL", action = act.ShowDebugOverlay },
    { key = "R", mods = "CTRL", action = act.ReloadConfiguration },
    { key = "r", mods = "SUPER", action = act.ReloadConfiguration },

    -- コマンドパレット
    { key = "P", mods = "CTRL", action = act.ActivateCommandPalette },
    -- 文字選択パレット
    {
      key = "U",
      mods = "CTRL",
      action = act.CharSelect({ copy_on_select = true, copy_to = "ClipboardAndPrimarySelection" }),
    },

    -- モード切替
    -- コピーモード
    { key = "X", mods = "CTRL", action = act.ActivateCopyMode },
    -- サーチモード
    { key = "f", mods = "SUPER", action = act.Search("CurrentSelectionOrEmptyString") },
    -- アクティブペインのズーム切替
    { key = "Z", mods = "CTRL", action = act.TogglePaneZoomState },

    -- 誤爆するので非有効にしがち
    { key = "k", mods = "SUPER", action = act.ClearScrollback("ScrollbackOnly") },
    { key = "m", mods = "SUPER", action = act.Hide },
    { key = "H", mods = "CTRL", action = act.HideApplication },

    -- スクロール
    { key = "PageUp", mods = "SHIFT", action = act.ScrollByPage(-1) },
    { key = "PageDown", mods = "SHIFT", action = act.ScrollByPage(1) },

    -- コピー・ペースト
    { key = "Copy", mods = "NONE", action = act.CopyTo("Clipboard") },
    { key = "Paste", mods = "NONE", action = act.PasteFrom("Clipboard") },

    -- 自分で足したキー
    -- ペイン分割
    { key = "|", mods = "LEADER|SHIFT", action = act.SplitHorizontal({}) },
    { key = "-", mods = "LEADER", action = act.SplitVertical({}) },
    -- ペイン移動 (Vim 方向キー)
    { key = "h", mods = "LEADER", action = act.ActivatePaneDirection("Left") },
    { key = "j", mods = "LEADER", action = act.ActivatePaneDirection("Down") },
    { key = "k", mods = "LEADER", action = act.ActivatePaneDirection("Up") },
    { key = "l", mods = "LEADER", action = act.ActivatePaneDirection("Right") },
    -- ペインズーム
    { key = "z", mods = "LEADER", action = act.TogglePaneZoomState },
    -- ワークスペース: 新規作成 (名前は自動) / 一覧からあいまい検索で選択
    { key = "n", mods = "LEADER", action = act.SwitchToWorkspace },
    { key = "w", mods = "LEADER", action = act.ShowLauncherArgs({ flags = "FUZZY|WORKSPACES" }) },
    -- QuickSelect (IME 切替と被るので Cmd+Space に変更)
    { key = " ", mods = "SUPER", action = act.QuickSelect },
    -- Claude Code 用: Shift+Enter で改行を送る
    { key = "Enter", mods = "SHIFT", action = act.SendString("\n") },
  },

  key_tables = {
    copy_mode = {
      -- モードの終了
      { key = "c", mods = "CTRL", action = act.Multiple({ "ScrollToBottom", { CopyMode = "Close" } }) },
      { key = "q", mods = "NONE", action = act.Multiple({ "ScrollToBottom", { CopyMode = "Close" } }) },
      { key = "Escape", mods = "NONE", action = act.Multiple({ "ScrollToBottom", { CopyMode = "Close" } }) },

      -- Vim風のキーバインド
      { key = "h", mods = "NONE", action = act.CopyMode("MoveLeft") },
      { key = "j", mods = "NONE", action = act.CopyMode("MoveDown") },
      { key = "k", mods = "NONE", action = act.CopyMode("MoveUp") },
      { key = "l", mods = "NONE", action = act.CopyMode("MoveRight") },
      { key = "0", mods = "NONE", action = act.CopyMode("MoveToStartOfLine") },
      { key = "^", mods = "NONE", action = act.CopyMode("MoveToStartOfLineContent") },
      { key = "$", mods = "NONE", action = act.CopyMode("MoveToEndOfLineContent") },
      { key = ",", mods = "NONE", action = act.CopyMode("JumpReverse") },
      { key = ";", mods = "NONE", action = act.CopyMode("JumpAgain") },
      { key = "g", mods = "NONE", action = act.CopyMode("MoveToScrollbackTop") },
      { key = "G", mods = "NONE", action = act.CopyMode("MoveToScrollbackBottom") },
      { key = "w", mods = "NONE", action = act.CopyMode("MoveForwardWord") },
      { key = "e", mods = "NONE", action = act.CopyMode("MoveForwardWordEnd") },
      { key = "b", mods = "NONE", action = act.CopyMode("MoveBackwardWord") },
      { key = "t", mods = "NONE", action = act.CopyMode({ JumpForward = { prev_char = true } }) },
      { key = "f", mods = "NONE", action = act.CopyMode({ JumpForward = { prev_char = false } }) },
      { key = "T", mods = "NONE", action = act.CopyMode({ JumpBackward = { prev_char = true } }) },
      { key = "F", mods = "NONE", action = act.CopyMode({ JumpBackward = { prev_char = false } }) },
      { key = "H", mods = "NONE", action = act.CopyMode("MoveToViewportTop") },
      { key = "L", mods = "NONE", action = act.CopyMode("MoveToViewportBottom") },
      { key = "O", mods = "NONE", action = act.CopyMode("MoveToSelectionOtherEndHoriz") },
      { key = "M", mods = "NONE", action = act.CopyMode("MoveToViewportMiddle") },
      { key = "o", mods = "NONE", action = act.CopyMode("MoveToSelectionOtherEnd") },
      { key = "m", mods = "ALT", action = act.CopyMode("MoveToStartOfLineContent") },
      { key = "b", mods = "CTRL", action = act.CopyMode("PageUp") },
      { key = "f", mods = "CTRL", action = act.CopyMode("PageDown") },
      { key = "u", mods = "CTRL", action = act.CopyMode({ MoveByPage = -0.5 }) },
      { key = "d", mods = "CTRL", action = act.CopyMode({ MoveByPage = 0.5 }) },
      { key = "v", mods = "NONE", action = act.CopyMode({ SetSelectionMode = "Cell" }) },
      { key = "v", mods = "CTRL", action = act.CopyMode({ SetSelectionMode = "Block" }) },
      { key = "V", mods = "NONE", action = act.CopyMode({ SetSelectionMode = "Line" }) },
      {
        key = "y",
        mods = "NONE",
        action = act.Multiple({
          { CopyTo = "ClipboardAndPrimarySelection" },
          { Multiple = { "ScrollToBottom", { CopyMode = "Close" } } },
        }),
      },
      { key = "PageUp", mods = "NONE", action = act.CopyMode("PageUp") },
      { key = "PageDown", mods = "NONE", action = act.CopyMode("PageDown") },
      { key = "End", mods = "NONE", action = act.CopyMode("MoveToEndOfLineContent") },
      { key = "Home", mods = "NONE", action = act.CopyMode("MoveToStartOfLine") },
      { key = "LeftArrow", mods = "NONE", action = act.CopyMode("MoveLeft") },
      { key = "LeftArrow", mods = "ALT", action = act.CopyMode("MoveBackwardWord") },
      { key = "RightArrow", mods = "NONE", action = act.CopyMode("MoveRight") },
      { key = "RightArrow", mods = "ALT", action = act.CopyMode("MoveForwardWord") },
      { key = "UpArrow", mods = "NONE", action = act.CopyMode("MoveUp") },
      { key = "DownArrow", mods = "NONE", action = act.CopyMode("MoveDown") },
    },

    search_mode = {
      { key = "Escape", mods = "NONE", action = act.CopyMode("Close") },
      { key = "n", mods = "CTRL", action = act.CopyMode("NextMatch") },
      { key = "p", mods = "CTRL", action = act.CopyMode("PriorMatch") },
      { key = "r", mods = "CTRL", action = act.CopyMode("CycleMatchType") },
      { key = "u", mods = "CTRL", action = act.CopyMode("ClearPattern") },
    },
  },
}

function module.apply_to_config(config)
  config.disable_default_key_bindings = true
  config.keys = keybinds.keys
  config.key_tables = keybinds.key_tables
end

return module
```

::

</div>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# 書き出したファイルを分割ファイルの形にする

::left::

`return {` を `local keybinds = {` に変え、末尾に config へ足す関数を付ける。生成された行は触らない

<p class="text-sm">wezterm.lua からは他の分割ファイルと同じ 1 行で読む</p>

<div class="code-compact" style="--findy-code-compact-size: 0.8rem">

```lua [~/.config/wezterm/wezterm.lua]
require("keybinds").apply_to_config(config) -- [!code ++]
```

</div>

<FindyCallout>
  tab.lua や workspace.lua も同じ形。wezterm.lua は require の羅列になる
</FindyCallout>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.75rem">

```lua [~/.config/wezterm/keybinds.lua]
local module = {} -- [!code ++]
return { -- [!code --]
local keybinds = { -- [!code ++]
  keys = {
    -- 生成された行はそのまま
  },
  key_tables = {
    -- 生成された行はそのまま
  },
}
function module.apply_to_config(config) -- [!code ++]
  config.keys = keybinds.keys -- [!code ++]
  config.key_tables = keybinds.key_tables -- [!code ++]
end -- [!code ++]
return module -- [!code ++]
```

</div>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# デフォルトのキーバインドは切る

::left::

`config.keys` に書いたキーはデフォルトに<FindyAccentMark>追加される</FindyAccentMark>だけ。書いていないキーも全部生きている

把握していないキーがシェルやエディタのキーと被ると「なぜか効かない」トラブルになる

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="例">zsh の undo (<code>Ctrl+-</code>) が、WezTerm のフォント縮小 (<code>Ctrl+-</code>) に先に取られて効かない</FindyKeyValue>
</FindyKeyValueList>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.8rem">

```lua [~/.config/wezterm/keybinds.lua]
-- 全部切って、このファイルに書いたものだけを使う
function module.apply_to_config(config)
  config.disable_default_key_bindings = true -- [!code ++]
  config.keys = keybinds.keys
  config.key_tables = keybinds.key_tables
end
```

</div>

<FindyCallout>
  新規タブやコピーも keybinds.lua に入っているので、切っても困らない
</FindyCallout>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# Leader キーを設定する

::left::

## **Leader キー**

- ショートカットの起点になるキー  
- Vim の `<Leader>`、tmux の `prefix` と同じ発想



<FindyAccentMark>
デフォルトで設定されていないので明示する
</FindyAccentMark>


::right::

<div class="code-compact" style="--findy-code-compact-size: 0.75rem">

```lua [~/.config/wezterm/wezterm.lua]
local wezterm = require("wezterm")
local config = wezterm.config_builder()
config.leader = { -- [!code ++]
  key = ";", -- [!code ++]
  mods = "CTRL", -- [!code ++]
  timeout_milliseconds = 2000, -- [!code ++]
} -- [!code ++]
return config
```

</div>

<FindyCallout>
  <code>Ctrl+;</code> は従来の端末エンコーディングに無いキー。
  シェルや fzf に届かないので WezTerm が先取りしても衝突しない
</FindyCallout>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# Leader キーを使ってみよう

::left::

ペイン分割を Leader キー経由に変えてみる

<FindyKeyValueList size="0.95rem" gap="0.25rem">
  <FindyKeyValue label="Leader, |">左右に分割 (縦線の <code>|</code>)</FindyKeyValue>
  <FindyKeyValue label="Leader, -">上下に分割 (横線の <code>-</code>)</FindyKeyValue>
</FindyKeyValueList>

<p class="text-sm op-60">デフォルトは <code>Ctrl+Alt+"</code> と <code>Ctrl+Alt+%</code>。押しにくいので Leader に寄せる</p>

<FindyCallout>
  <code>Ctrl+;</code> を押して指を離してから <code>|</code>。timeout_milliseconds (2 秒) 以内に次のキーを押す
</FindyCallout>

::right::

```lua [~/.config/wezterm/keybinds.lua]
-- keys = { ... } の中に足す
-- Leader のあとに | で左右、- で上下に分割
{ key = "|", mods = "LEADER|SHIFT", -- [!code ++]
  action = act.SplitHorizontal{} }, -- [!code ++]
{ key = "-", mods = "LEADER", -- [!code ++]
  action = act.SplitVertical{} }, -- [!code ++]
```

<p class="text-sm op-60"><code>|</code> は Shift を押しながら打つ記号なので mods に <code>SHIFT</code> も足す</p>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# よく使う WezTerm キーバインド

::left::

デフォルト

<FindyKeyValueList size="0.9rem" gap="0.25rem">
  <FindyKeyValue label="Ctrl+Shift+T">新しいタブ</FindyKeyValue>
  <FindyKeyValue label="Ctrl+Tab">次のタブ</FindyKeyValue>
  <FindyKeyValue label="Ctrl+Shift+P">コマンドパレット</FindyKeyValue>
  <FindyKeyValue label="Ctrl+Shift+F">検索</FindyKeyValue>
</FindyKeyValueList>

::right::

Leader キー (カスタム設定)

<FindyKeyValueList size="0.9rem" gap="0.25rem">
  <FindyKeyValue label="Leader, |">縦に分割</FindyKeyValue>
  <FindyKeyValue label="Leader, -">横に分割</FindyKeyValue>
  <FindyKeyValue label="Leader, hjkl">ペイン移動</FindyKeyValue>
  <FindyKeyValue label="Leader, z">ズーム</FindyKeyValue>
</FindyKeyValueList>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# コマンドパレット

::left::

WezTerm のコマンドパレットは <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>

<p class="mt-4">
コマンド名であいまい検索でき、よく使うものほど上に出てくる。
コマンドの横にはショートカットキーも表示される
</p>

<FindyCallout>
  VS Code と同じキーバインド。覚えていなくても検索して実行できる
</FindyCallout>

::right::

```lua [~/.config/wezterm/keybinds.lua]
-- 書き出したファイルにはこの行で入っている
{ key = "p", mods = "SHIFT|CTRL",
  action = act.ActivateCommandPalette },
```

<FindyRef>

[ActivateCommandPalette](https://wezterm.org/config/lua/keyassignment/ActivateCommandPalette.html)

</FindyRef>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# WezTerm キーバインドの設定例

::left::

分割と同じ要領で、ペイン移動とズームも Leader に寄せる

<FindyCallout>
  <code>act</code> は <code>wezterm.action</code> の短縮。
  書き出したファイルの冒頭で定義済み
</FindyCallout>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.8rem">

```lua [~/.config/wezterm/keybinds.lua]
-- keys = { ... } の中に足す
-- h/j/k/l でペイン移動
{ key = "h", mods = "LEADER", -- [!code ++]
  action = act.ActivatePaneDirection("Left") }, -- [!code ++]
-- j, k, l も同様に Down, Up, Right
{ key = "z", mods = "LEADER", -- [!code ++]
  action = act.TogglePaneZoomState }, -- [!code ++]
```

</div>

---
layout: content
eyebrow: wezterm
---

# Claude Code ユーザー向け: Shift+Enter で改行

Claude Code は <kbd>Enter</kbd> で送信される。<kbd>Shift</kbd> + <kbd>Enter</kbd> で改行だけを入力できるようにしておくと、複数行のプロンプトが書きやすい

```lua [~/.config/wezterm/keybinds.lua]
-- keys = { ... } の中に足す
{ key = "Enter", mods = "SHIFT", -- [!code ++]
  action = act.SendString("\n") }, -- [!code ++]
```

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# QuickSelect で画面の文字列を拾う

::left::

画面の URL・パス・ハッシュにラベルが振られ、マウスなしでコピーできる

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="発動"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd></FindyKeyValue>
  <FindyKeyValue label="コピー">候補のラベルのキーを打つ</FindyKeyValue>
  <FindyKeyValue label="貼り付け">ラベルを大文字で打つ</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout>
  <code>QuickSelectArgs</code> で「選んで開く」も組める。
  AWS の ARN を選んでそのままコンソールを開ける
  (<a href="https://github.com/mozumasu/dotfiles/blob/ebfef03a888/.config/wezterm/keymaps.lua#L137-L153">設定例</a>)
</FindyCallout>

<FindyRef>

[Quick Select Mode](https://wezterm.org/quickselect.html)

</FindyRef>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.72rem">

```lua [~/.config/wezterm/keybinds.lua]
-- IME 切替と被るので Cmd+Space に変更
{ key = " ", mods = "SUPER", -- [!code ++]
  action = act.QuickSelect }, -- [!code ++]
```

```lua [~/.config/wezterm/wezterm.lua]
-- デフォルトのパターンを無効化する
config.disable_default_quick_select_patterns = true
-- 拾いたいパターンは正規表現で足せる
config.quick_select_patterns = {
  -- Git commit hash
  "\\b[0-9a-f]{7,40}\\b",
}
```

</div>

---
layout: two-cols
eyebrow: wezterm
---

# Workspace でプロジェクトを切り替える

::left::

**Workspace** = タブ・ペインをまとめる作業単位 (tmux のセッションに相当)

まずはこの 2 つだけで使える

<FindyKeyValueList size="0.95rem" gap="0.25rem">
  <FindyKeyValue label="作成">SwitchToWorkspace。名前を省略すると新規作成</FindyKeyValue>
  <FindyKeyValue label="選択">ランチャーの一覧からあいまい検索で切替</FindyKeyValue>
</FindyKeyValueList>

<FindyRef>

[Workspaces](https://wezterm.org/recipes/workspaces.html) / [SwitchToWorkspace](https://wezterm.org/config/lua/keyassignment/SwitchToWorkspace.html)

</FindyRef>

::right::

<div class="code-compact">

```lua [~/.config/wezterm/keybinds.lua]
-- keys = { ... } の中に足す
-- 新しい workspace を作成 (名前は自動)
{ key = "n", mods = "LEADER", -- [!code ++]
  action = act.SwitchToWorkspace }, -- [!code ++]
-- 一覧からあいまい検索で選択
{ key = "w", mods = "LEADER", -- [!code ++]
  action = act.ShowLauncherArgs({ -- [!code ++]
    flags = "FUZZY|WORKSPACES", -- [!code ++]
  }) }, -- [!code ++]
```

</div>

---
layout: two-cols
ratio: 1/1
eyebrow: wezterm
---

# 同じキーで行って帰る: トグル切替

::left::

切替前の workspace 名を覚えておくと、<FindyAccentMark>同じキーで行きと帰り</FindyAccentMark>を往復できる（2 度目の押下で元いた場所へ戻る）

<div class="code-compact">

```lua
-- Leader+s でメモ用の scratch と行き来する
{ key = "s", mods = "LEADER",
  action = toggle_workspace("scratch") },
```

</div>

<FindyCallout>
  マルチプレクサ (herdr など) 側の切替キーと被らないキーを選ぶ
</FindyCallout>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.75rem">

```lua [~/.config/wezterm/workspace.lua]
-- 切替前にいた workspace 名を覚えておく
local previous = {}

local function toggle_workspace(name, spawn)
  return wezterm.action_callback(function(window, pane)
    local current = wezterm.mux.get_active_workspace()
    if current == name then
      window:perform_action(act.SwitchToWorkspace({
        name = previous[name] or "default" }), pane)
    else
      previous[name] = current
      window:perform_action(act.SwitchToWorkspace({
        name = name, spawn = spawn }), pane)
    end
  end)
end
```

</div>
