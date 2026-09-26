# サンプル設定ファイル

ハンズオンで紹介する設定ファイルのサンプルです。
`.config/` 以下をそのまま `~/.config/` にコピーして使います。

```sh
# 例: WezTerm の設定を置く (wezterm.lua が keybinds.lua などを require するので、ディレクトリごと)
mkdir -p ~/.config
cp -r .config/wezterm ~/.config/
```

設定を Git で管理したくなったら、`~/dotfiles` に実体を移して `~/.config` へシンボリックリンクを貼る形にすると、別のマシンでも同じ設定を再現できます。

## ファイル構成

```text
dotfiles/
├── .config/
│   ├── wezterm/
│   │   ├── wezterm.lua            # macOS / Linux 向け
│   │   ├── wezterm-windows.lua    # Windows (WSL + Acrylic) 向け
│   │   ├── keybinds.lua           # デフォルトを切って使うキーバインド一覧
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
| `wezterm.lua` | フォント、背景透過+ぼかし、タイトルバー非表示、分割ファイルの読み込み (keybinds / tab / workspace)、QuickSelect のパターン、kitty keyboard protocol |
| `wezterm-windows.lua` | 上記の Windows 版 (WSL ドメイン設定、Acrylic 効果。QuickSelect/cmd 系は除く。デフォルトキーバインドは残す) |
| `keybinds.lua` | `wezterm show-keys --lua` の出力から重複と `Ctrl+-` / `Ctrl+=` のフォントサイズ変更、herdr に渡す `cmd+t` を除き、Leader 系 (ペイン分割・移動・ズーム・閉じる・Workspace)、QuickSelect (`Cmd+Enter`)、Claude Code 改行を足したもの。Leader キー (`Ctrl+;`) の定義もここ。`disable_default_key_bindings = true` でこのファイルのキーだけを使う |
| `workspace.lua` | 切替前の workspace 名を覚えて同じキーで行き来するトグル (`Leader+s` で scratch) |
| `tab.lua` | 丸タブ (`format-tab-title`) と、タブバーの位置・最大幅・「+」ボタン非表示などタブバーの設定。`wezterm.lua` から `require` 済み |
| `herdr/config.toml` | prefix キー (`ctrl+q`)、ペイン操作、タブ・ワークスペース操作、lazygit カスタムコマンド、cmd キー案 (コメント) |
| `ghostty/config` | テーマの OS ライト/ダーク追従、背景透過+ぼかし、タブ統合 (コラム「Ghostty という選択肢」) |
| `zsh/.zshrc` | XDG Base Directory、MANPAGER、`stty -ixon`、`edit-command-line`、`copy-earlier-word`、前方一致の履歴検索、vcs_info を使った軽量プロンプト |
| `fish/config.fish` | XDG Base Directory |
| `.inputrc` | bash 用の前方一致の履歴検索 |
