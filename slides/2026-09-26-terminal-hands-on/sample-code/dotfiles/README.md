# サンプル dotfiles

ハンズオンで紹介する設定ファイルのサンプルです。
実体を `~/dotfiles` に置き、`~/.config` などへシンボリックリンクを貼って使います
(スライド「実体は dotfiles、参照はシンボリックリンク」参照)。

```sh
# 例: WezTerm の設定をリンクする
mkdir -p ~/.config/wezterm
ln -s ~/dotfiles/.config/wezterm/wezterm.lua \
  ~/.config/wezterm/wezterm.lua
```

## ファイル構成

```text
dotfiles/
├── .config/
│   ├── wezterm/
│   │   ├── wezterm.lua            # macOS / Linux 向け
│   │   ├── wezterm-windows.lua    # Windows (WSL + Acrylic) 向け
│   │   ├── workspace.lua          # workspace のトグル切替 (Leader+s)
│   │   └── tab.lua                # 丸タブ (format-tab-title)
│   ├── herdr/
│   │   └── config.toml            # herdr の prefix キー・キーバインド
│   ├── ghostty/
│   │   └── config                 # Ghostty (コラム) の設定例
│   ├── zsh/
│   │   └── .zshrc                 # zsh のキーバインド・環境変数
│   └── fish/
│       └── config.fish            # fish の環境変数
└── .inputrc                       # bash の履歴検索
```

## 各ファイルの内容

| ファイル | 主な設定 |
|---|---|
| `wezterm.lua` | フォント、背景透過+ぼかし、タブバー、Leader キー (`Ctrl+;`)、ペイン分割・移動、Workspace (作成/選択/トグル)、QuickSelect、コマンドパレット、Claude Code 改行、kitty keyboard protocol |
| `wezterm-windows.lua` | 上記の Windows 版 (WSL ドメイン設定、Acrylic 効果。QuickSelect/cmd 系は除く) |
| `workspace.lua` | 切替前の workspace 名を覚えて同じキーで行き来するトグル (`Leader+s` で scratch) |
| `tab.lua` | 丸タブ (`format-tab-title`)。使う場合は `wezterm.lua` の inline ハンドラを消して `require("tab").apply_to_config(config)` |
| `herdr/config.toml` | prefix キー (`ctrl+q`)、ペイン操作、タブ・ワークスペース操作、lazygit カスタムコマンド、cmd キー案 (コメント) |
| `ghostty/config` | テーマの OS ライト/ダーク追従、背景透過+ぼかし、タブ統合 (コラム「Ghostty という選択肢」) |
| `zsh/.zshrc` | XDG Base Directory、MANPAGER、`stty -ixon`、`edit-command-line`、前方一致の履歴検索 |
| `fish/config.fish` | XDG Base Directory |
| `.inputrc` | bash 用の前方一致の履歴検索 |
