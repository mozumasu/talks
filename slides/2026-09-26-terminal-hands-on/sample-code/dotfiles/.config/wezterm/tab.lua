local wezterm = require("wezterm")
local module = {}

-- -----------------------------------------------------------------------------
-- 色の設定: ここを書き換えるだけで配色を変えられます
-- -----------------------------------------------------------------------------
local COLORS = {
  -- アクティブ（選択中）タブ
  active_bg = "#80EBDF", -- 背景色
  active_fg = "#313244", -- 文字色

  -- 非アクティブタブ
  inactive_bg = "none", -- "none" で透過
  inactive_fg = "#a0a9cb",
}

-- タブの左右につける半円（丸タブの見た目を作る）
local LEFT_CIRCLE = wezterm.nerdfonts.ple_left_half_circle_thick
local RIGHT_CIRCLE = wezterm.nerdfonts.ple_right_half_circle_thick

-- -----------------------------------------------------------------------------
-- メイン処理
-- -----------------------------------------------------------------------------
function module.apply_to_config(config)
  -- タブバー自体の設定
  config.use_fancy_tab_bar = false -- レトロスタイル（フォント設定が効く）
  config.tab_bar_at_bottom = true -- タブバーを下に表示
  config.hide_tab_bar_if_only_one_tab = false -- タブが1つでも表示する
  config.show_new_tab_button_in_tab_bar = false -- 「+」ボタンを消す
  config.tab_max_width = 30 -- タブの最大幅

  -- タブのタイトルを描画する
  wezterm.on("format-tab-title", function(tab, _, _, _, _, max_width)
    -- アクティブかどうかで色を切り替える
    local bg = tab.is_active and COLORS.active_bg or COLORS.inactive_bg
    local fg = tab.is_active and COLORS.active_fg or COLORS.inactive_fg

    -- タブ番号 + パネルのタイトル
    -- 左の余白(1) + 左右の半円(2) のぶんを max_width から引いて切り詰めないと、
    -- タブ幅の上限を超えて右の半円が切れる
    local title = string.format(" %d: %s ", tab.tab_index + 1, tab.active_pane.title)
    title = wezterm.truncate_right(title, max_width - 3)

    -- 半円はアクティブタブだけに付ける
    local left = tab.is_active and LEFT_CIRCLE or ""
    local right = tab.is_active and RIGHT_CIRCLE or ""

    -- 描画パーツを順番に並べて返す
    return {
      -- 左の半円（背景色を文字色として描くことで丸く見せる）
      { Background = { Color = "none" } },
      { Foreground = { Color = bg } },
      { Text = " " .. left },
      -- タイトル本体
      { Background = { Color = bg } },
      { Foreground = { Color = fg } },
      { Text = title },
      -- 右の半円
      { Background = { Color = "none" } },
      { Foreground = { Color = bg } },
      { Text = right },
    }
  end)
end

return module
