---
layout: section
title: Appendix
---

# 今日の設定まとめ

---
layout: two-cols
title: zsh と Bash の設定
---

```zsh [~/.zshrc]
autoload -Uz copy-earlier-word edit-command-line
zle -N copy-earlier-word
zle -N edit-command-line
bindkey '^[,' copy-earlier-word
bindkey '^[e' edit-command-line

insert-date() {
  LBUFFER+=$(date +%Y%m%d)
}
zle -N insert-date
bindkey '^[;' insert-date
```

::right::

```bash [~/.inputrc]
# Esc → e でも開く (閉じると実行される)
"\ee": edit-and-execute-command
```

```bash [~/.bashrc]
insert_date() {
  local d=$(date +%Y%m%d)
  local l=$READLINE_LINE p=$READLINE_POINT
  READLINE_LINE=${l:0:p}$d${l:p}
  READLINE_POINT=$((p + ${#d}))
}
bind -x '"\e;": insert_date'
```

---
layout: default
title: fish の設定
---

```fish [~/.config/fish/config.fish]
# Esc → . と Esc → e は最初から入っている
function insert_date
    commandline -i (date +%Y%m%d)
end
bind alt-\; insert_date
```

---
layout: default
title: Nushell の設定
---

```nu [~/.config/nushell/config.nu]
$env.config.keybindings ++= [
  {
    name: insert_last_arg
    modifier: alt
    keycode: char_.
    mode: [emacs vi_insert]
    event: { send: executehostcommand, cmd: 'commandline edit --insert (history | last | get command | split row " " | last)' }
  }
  {
    name: insert_date
    modifier: alt
    keycode: 'char_;'
    mode: [emacs vi_insert]
    event: { send: executehostcommand, cmd: 'commandline edit --insert (date now | format date "%Y%m%d")' }
  }
]
```

<style>
/* Nushell の cmd が 1 行で長いので、見切れないように折り返す */
.slidev-code code {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

---
layout: code-compare
title: Nushell のキーバインドは ++= で足す
beforeLabel: 丸ごと代入する
afterLabel: 足りない分だけ足す
beforeCaption: 既定の completion_menu などが消え、Tab の補完メニューや F1 のヘルプが効かなくなる
afterCaption: 既定の 8 つのキーバインドを残したまま、末尾に足す
---

```nu [config.nu]
$env.config = {
  keybindings: [
    { name: insert_last_arg, ... }
  ]
}
```

::after::

```nu [config.nu]
$env.config.keybindings ++= [
  { name: insert_last_arg, ... }
]
```

<RefNote>ほかの項目は丸ごと代入しても残る / 参照: <a href="https://www.nushell.sh/book/configuration.html">Nushell: Configuration</a></RefNote>

---
layout: default
title: そのシェルならではのキー
---

<KeyMessage>どれも<em>何も設定せずに</em>使える</KeyMessage>

| | キー | 機能の名前 | 何が起きるか |
|---|---|---|---|
| zsh | `Esc` → `a` | `accept-and-hold` | 実行して、行はそのまま残す |
| Bash | `Esc` → `Ctrl+E` | `shell-expand-line` | alias や変数を展開して、行を書き換える |
| fish | `Esc` → `p` | `__fish_paginate` | 行末に `&\| less` を付ける |
| Nushell | `F1` | `help_menu` | コマンドの一覧と説明をメニューで出す |

<RefNote>一覧は zsh <code>bindkey</code> / Bash <code>bind -p</code> / fish <code>bind</code> / Nushell <code>keybindings default</code> で見られる</RefNote>

---
layout: section
title: Appendix
---

# 端末 (tty) と行編集

---
layout: default
title: tty とは
---

<KeyMessage>tty = ターミナルとシェルの間にある<em>OS の端末の窓口</em></KeyMessage>

<div class="tty-flow">
  <div><b>ターミナル</b><span>WezTerm など。キーを送り、届いた文字を表示する</span></div>
  <i>▶</i>
  <div class="is-tty"><b>tty (端末デバイス)</b><span>OS の端末ドライバ。Enter でまとめて渡すか、1 キーずつ渡すかを設定で切り替える</span></div>
  <i>▶</i>
  <div><b>シェル</b><span>tty からキーを読む。行編集の仕組みがあれば、ここで行を編集する</span></div>
</div>

<style>
.tty-flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: stretch;
  gap: 0.6rem;
  margin: 1.2rem 0 1.4rem;
}
.tty-flow > div {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.8rem 1rem;
  border: 1px solid var(--theme-gray-100);
  border-radius: 0.6rem;
}
.tty-flow > div.is-tty {
  border: 2px solid var(--theme-red);
  background: var(--theme-red-soft);
}
.tty-flow span {
  color: var(--theme-muted);
  font-size: 0.8rem;
  line-height: 1.45;
}
.tty-flow i {
  align-self: center;
  color: var(--theme-red);
  font-style: normal;
}
</style>

| tty の設定 | 動き |
|---|---|
| `icanon` | Enter を押すまで渡さず、まとめて渡す。`^W` `^U` Backspace は tty が処理する |
| `-icanon` | 押したキーを 1 つずつすぐ渡す。編集は受け取った側の仕事 |

<RefNote>名前は端末がタイプライターだった頃の名残 (1972 年の Unix のマニュアルでは <code>get typewriter name</code>) / 設定は <code>stty -a</code>、デバイス名は <code>tty</code> で分かる (例: <code>/dev/ttys003</code>)</RefNote>

---
layout: default
title: 行編集の仕組みは tty の設定を切り替える
---

<KeyMessage>プロンプトで待っている間、行編集の仕組みは tty を<em>1 キーずつ渡す設定</em>にしている</KeyMessage>

| プロンプトで待っているもの | tty の設定 | 意味 |
|---|---|---|
| bash (Readline あり) | `-icanon -echo` | Readline が 1 キーずつ受け取り、画面にも自分で書く |
| zsh / fish / Nushell | `-icanon -echo` | 同じ。ZLE・fish・Reedline が受け取る |
| bash (Readline なし) | `icanon echo` | tty が Enter までまとめて持ち、打った文字も tty が画面に返す |
| `cat` (参考) | `icanon echo` | 行編集を持たないふつうのコマンドと同じ |

```sh [別のターミナルから、待っているシェルの tty の設定を見る (macOS)]
stty -f /dev/ttys003 -a | grep -oE -- '-?icanon|-?echo '
```

<RefNote>コマンドを実行している間は、行編集の仕組みが元の設定 (<code>icanon</code>) に戻している。<code>echo</code> は、打ったキーを tty が画面に返す設定</RefNote>

---
layout: default
title: 参考にしたドキュメント
---

- zsh: [Zsh Line Editor](https://zsh.sourceforge.io/Doc/Release/Zsh-Line-Editor.html)
- Bash: [Bash Reference Manual - Command Line Editing](https://www.gnu.org/software/bash/manual/html_node/Command-Line-Editing.html)
- fish: [bind](https://fishshell.com/docs/current/cmds/bind.html) / [commandline](https://fishshell.com/docs/current/cmds/commandline.html) / [Interactive use](https://fishshell.com/docs/current/interactive.html)
- Nushell: [Reedline, Nu's Line Editor](https://www.nushell.sh/book/line_editor.html) / [Configuration](https://www.nushell.sh/book/configuration.html)
- Terminal Night 3 のスライド: [zsh から学ぶ最高の UX](https://partner-prop.github.io/slides/mozumasu/terminal-night-3/)
