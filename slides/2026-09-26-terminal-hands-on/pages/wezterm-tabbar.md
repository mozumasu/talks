---
layout: content
eyebrow: wezterm
---

# タブバーを丸くしてみよう

1. `~/.config/wezterm/tab.lua` を作る
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
