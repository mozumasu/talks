---
layout: section
color: blue
toc: シェルの設定
---

# シェルの設定

---
layout: two-cols
ratio: 2/1
eyebrow: シェルの設定
---

# シェルの種類

::left::

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="bash"><a href="https://github.com/bminor/bash">多くの Linux のデフォルト</a></FindyKeyValue>
  <FindyKeyValue label="zsh"><a href="https://github.com/zsh-users/zsh">macOS のデフォルト。bash とほぼ互換</a></FindyKeyValue>
  <FindyKeyValue label="fish"><a href="https://github.com/fish-shell/fish-shell">設定なしでも補完が快適</a></FindyKeyValue>
  <FindyKeyValue label="PowerShell"><a href="https://github.com/PowerShell/PowerShell">Windows 標準</a></FindyKeyValue>
  <FindyKeyValue label="nushell"><a href="https://github.com/nushell/nushell">出力を表として扱える新顔</a></FindyKeyValue>
</FindyKeyValueList>

<p class="mt-4">今回は <FindyAccentMark>zsh</FindyAccentMark> を例に紹介する（macOS のデフォルトシェル）</p>

::right::

<FindyFigure
  :image="$asset('/screenshots/zsh-book.jpg')"
  alt="zshの本"
  caption="「zshの本」広瀬雄二 著（技術評論社）"
/>

---
layout: content
eyebrow: シェルの設定
---

# 今のシェルの確認

```sh
echo $0
```

シェルの切り替え

```sh
# 今のセッションだけzshにする
zsh
# 今のセッションのシェルを置き換えるならexecを使う
exec zsh

# デフォルトでzshを使うようにする
chsh -s /bin/zsh
```

---
layout: two-cols
eyebrow: シェルの設定
---

# シェルのキーバインドの確認

::left::

設定済みのキーバインドを一覧する

::code-group

```sh [zsh]
bindkey
```

```sh [bash]
bind -P
```

```sh [fish]
bind
```

::

manをカラー表示する

::code-group

```sh [vim]
export MANPAGER='vim -M +MANPAGER -'
```

```sh [nvim]
export MANPAGER='nvim +Man!'
```

::

::right::

詳しく知りたいときは

::code-group

```sh [zsh]
# bindkey の説明は zshzle(1) にある
man zshzle
```

```sh [bash]
# bind の説明は READLINE セクションにある
man bash
```

```sh [fish]
# fish は bind 専用の man を持っている
man bind
```

::

---
layout: content
eyebrow: シェルの設定
---

# zshが入っていない場合はインストール

```sh
which zsh
sudo apt install -y zsh
```


---
layout: section
color: gray
---
よく使う  
シェルのキーバインド
---
layout: two-cols
eyebrow: シェルの設定
---

# おすすめキーバインド <FindyBadge variant="outline" color="low">初級</FindyBadge>

::left::

移動・履歴

```sh
"^A" beginning-of-line     # 行頭へ移動
"^E" end-of-line           # 行末へ移動
"^F" forward-char          # 1文字右へ移動
"^B" backward-char         # 1文字左へ移動
"^P" up-line-or-history    # 前の履歴 ↑
"^N" down-line-or-history  # 次の履歴 ↓
```

::right::

削除・貼り付け

```sh
"^H" backward-delete-char # バックスペース
"^W" backward-kill-word   # 1単語削除
"^K" kill-line            # カーソル以降を削除
"^U" kill-whole-line      # 行全削除
"^Y" yank                 # 消した分を貼り付け
"^L" clear-screen         # 画面クリア
```

<FindyCallout variant="info">
  <code>^A</code> は <kbd>Ctrl</kbd> + <kbd>A</kbd> のこと。Mac 標準のテキスト入力でも使える
</FindyCallout>

---
layout: two-cols
eyebrow: シェルの設定
---

# おすすめキーバインド <FindyBadge variant="outline" color="mid">中級</FindyBadge>

::left::

意外と知られていないのに便利なやつ

```sh
"^Q"  push-line        # 入力中の行を一時退避
"^_"  undo             # 編集の取り消し

"^[f" forward-word     # 単語単位で右へ移動
"^[b" backward-word    # 単語単位で左へ移動
"^[." insert-last-word # 直前の最後の引数を挿入
"^[H" run-help         # コマンドのヘルプを開く
```

::right::

`^[` は <FindyAccentMark>Meta キー</FindyAccentMark>

<FindyKeyValueList size="0.9rem">
  <FindyKeyValue label="入力方法 1"><kbd>ESC</kbd> を押してから (キー)</FindyKeyValue>
  <FindyKeyValue label="入力方法 2"><kbd>Alt</kbd> + (キー)</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout variant="info">
  Alt キーは内部的に「ESC を送ってから文字を送る」入力になっている。効かない場合はターミナル側で「Alt を Meta として扱う」設定にする
</FindyCallout>

---
layout: content
eyebrow: シェルの設定
---

# おすすめキーバインド <FindyBadge variant="outline" color="high">上級</FindyBadge>

デフォルトでは設定されていないやつ。設定ファイルに追加して使う

::code-group

```sh [zsh (~/.zshrc)]
# Ctrl-x Ctrl-r で redo (undo しすぎた時に戻る)
bindkey '^X^R' redo
# Esc→e で現在行を $EDITOR で編集
autoload -Uz edit-command-line
zle -N edit-command-line
bindkey '^[e' edit-command-line
# Ctrl-p/n を前方一致の履歴検索にする (docker と打って Ctrl-p)
autoload -Uz history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end  history-search-end
bindkey '^p' history-beginning-search-backward-end
bindkey '^n' history-beginning-search-forward-end
```

```sh [bash (~/.inputrc)]
# Ctrl-x Ctrl-r で redo
# ※ bash の readline には redo がない (undo のみ)
# Ctrl-x Ctrl-e で現在行を $EDITOR で編集 (bash はデフォルトで有効)
# ※ 設定不要: Ctrl-x Ctrl-e で edit-and-execute-command が使える
# Ctrl-p / Ctrl-n を前方一致の履歴検索にする
"\C-p": history-search-backward
"\C-n": history-search-forward
```

```sh [fish (~/.config/fish/config.fish)]
# ※ fish には redo に相当する機能がない
# Alt-e または Alt-v で現在行を $EDITOR で編集 (fish はデフォルトで有効)
# ※ 設定不要: Alt-e で edit_command_buffer が使える
# Ctrl-p / Ctrl-n を前方一致の履歴検索にする
# ※ fish は Ctrl-p/n がデフォルトで履歴検索 (history-prefix-search) になっている
```

::

---
layout: two-cols
ratio: 2/1
eyebrow: シェルの設定
---

# シェルのキーバインドは Emacs 由来

::left::

zsh / bash のデフォルトキーバインドは **Emacs モード**

例: `Ctrl+A` で行頭、`Ctrl+E` で行末

vi モード (`bindkey -v`) もあるが、あえて使わない理由:

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="モード切替">Normal / Insert の切替が地味にストレス</FindyKeyValue>
  <FindyKeyValue label="表示">今どちらのモードか視覚フィードバックが弱い</FindyKeyValue>
  <FindyKeyValue label="互換性">ssh 先・Docker 内など設定が効かない場面で混乱する</FindyKeyValue>
</FindyKeyValueList>

::right::

<FindyCallout>
  複雑な編集だけ <code>$EDITOR</code> で開ける <code>edit-command-line</code> が便利。
  普段は Emacs バインド、ガッツリ編集したいときだけ Vim
</FindyCallout>

---
layout: content
eyebrow: シェルの設定 | Windows
---

# Windows で Ctrl キーを快適に使う

Windows キーボードの `Ctrl` は小指の端にあって押しづらい。<FindyAccentMark>CapsLock を Ctrl にリマップ</FindyAccentMark>するとかなり楽になる

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="PowerToys">Microsoft 公式。Keyboard Manager で GUI 設定</FindyKeyValue>
  <FindyKeyValue label="Ctrl2Cap">Sysinternals 製。インストールして再起動するだけ</FindyKeyValue>
  <FindyKeyValue label="レジストリ">Scancode Map を直接書き換え。ツール不要だが手順がやや複雑</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout variant="info">
  Mac は「システム設定 → キーボード → 修飾キー」で CapsLock → Control に変更できる
</FindyCallout>

<FindyRef label="参照">

[PowerToys Keyboard Manager](https://learn.microsoft.com/ja-jp/windows/powertoys/keyboard-manager) / [Ctrl2Cap](https://learn.microsoft.com/ja-jp/sysinternals/downloads/ctrl2cap)

</FindyRef>

---
layout: content
eyebrow: シェルの設定 | Windows
---

# ターミナルのコピー & ペースト

Mac は `Cmd` (GUI) と `Ctrl` (ターミナル) で物理的にキーが分かれている

Windows は両方 `Ctrl` なので、ターミナルでは <FindyAccentMark>Shift を足して区別</FindyAccentMark>する

<FindyKeyValueList size="1rem">
  <FindyKeyValue label="Ctrl+Shift+C">コピー（ターミナル内）</FindyKeyValue>
  <FindyKeyValue label="Ctrl+Shift+V">ペースト（ターミナル内）</FindyKeyValue>
  <FindyKeyValue label="Ctrl+C">プロセス中断 (SIGINT)</FindyKeyValue>
  <FindyKeyValue label="Ctrl+V">リテラル入力モード</FindyKeyValue>
</FindyKeyValueList>

<FindyRef label="参照">

[WezTerm Default Key Assignments](https://wezterm.org/config/default-keys.html)

</FindyRef>

