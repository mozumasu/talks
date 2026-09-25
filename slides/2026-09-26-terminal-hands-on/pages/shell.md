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

<p class="mt-4">今回は <FindyAccentMark>zsh</FindyAccentMark> を紹介</p>

::right::

<FindyFigure
  :image="$asset('/screenshots/zsh-book.jpg')"
  alt="zshの本"
  caption="「zshの本」広瀬雄二 著（技術評論社）"
/>

---
layout: two-cols
ratio: 1/1.2
eyebrow: シェルの設定
---

# zshに設定する

::left::

現在のシェルを確認

```sh
echo $0
```

zshが無い場合はインストール

```sh
sudo apt install -y zsh
```

::right::

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
ratio: 1/1
eyebrow: シェルの設定
---

# zsh の設定ファイル

::left::

<FindyKeyValueList size="1rem">
  <FindyKeyValue label=".zshenv">毎回読まれる。環境変数だけ書く
    迷ったら <FindyAccentMark>.zshrc</FindyAccentMark> に書く
</FindyKeyValue>
  <FindyKeyValue label=".zshrc">対話シェルごとに読まれる  
    キーバインド・alias・補完はここ</FindyKeyValue>
</FindyKeyValueList>


<FindyCallout variant="warn">
  <code>~/.zshenv</code> だけはホーム直下に置く。<code>ZDOTDIR</code> が決まる前に読まれるので、動かすと何も読まれなくなる
</FindyCallout>

<FindyRef>

[zsh manual: Startup/Shutdown Files](https://zsh.sourceforge.io/Doc/Release/Files.html)

</FindyRef>

::right::

<code>ZDOTDIR</code>でzshの設定ファイルの場所を指定する

::code-group

```sh [~/.zshenv]
export ZDOTDIR="$HOME/.config/zsh"
export XDG_CONFIG_HOME="$HOME/.config"
```

```sh [~/.config/zsh/.zshrc]
alias ll='ls -l'
```

::

<div class="code-compact" style="--findy-code-compact-size: 0.75rem">

```sh
# 動作確認
exec zsh                     # 読み直す
echo $ZDOTDIR                # → /Users/you/.config/zsh
zsh -o sourcetrace -ic exit  # 読んだファイルを順に表示
```

</div>

<!--
- 他にも .zprofile (ログイン時 1 回) / .zlogin / .zlogout があるが、この 2 つで足りる。読み込み順は .zshenv → .zprofile → .zshrc → .zlogin
- 対話シェル = プロンプトが出て人が打つシェル。zsh -c '...' のような非対話の起動では .zshrc は読まれず .zshenv だけ読まれる。だから .zshenv に重い処理や出力を書くとスクリプトが遅くなる / 壊れる
- ZDOTDIR が未設定なら $HOME が使われる (manual: "If ZDOTDIR is unset, HOME is used instead")
-->

---
layout: two-cols
ratio: 1/1.1
valign: center
eyebrow: シェルの設定
---

# 起動速度は zsh-bench で測る

::left::

シェルの起動が遅いと、ペインを作るたびに待たされる
<FindyAccentMark>zsh-bench で定期的に測って、遅くなっていないか確認する</FindyAccentMark>

<div class="" style="--findy-code-compact-size: 0.75rem">

```sh [インストールして実行]
git clone https://github.com/romkatv/zsh-bench \
  ~/zsh-bench
~/zsh-bench/zsh-bench
```

</div>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.72rem">

```sh [出力例]
# カッコ内は遅いと感じ始める目安
first_prompt_lag_ms=51.771   # 起動 → プロンプト表示 (50ms)
first_command_lag_ms=51.882  # 起動 → 最初のコマンド実行 (150ms)
command_lag_ms=0.066         # Enter → 次のプロンプト (10ms)
input_lag_ms=0.182           # キー押下 → 文字表示 (20ms)
exit_time_ms=51.601          # zsh -lic exit の時間。無意味
```

</div>

<FindyRef>

[romkatv/zsh-bench](https://github.com/romkatv/zsh-bench) / [How not to benchmark](https://github.com/romkatv/zsh-bench#how-not-to-benchmark)

</FindyRef>

<!--
- 目安の ms は README で著者が示している「人が気づき始める」しきい値
- 昔は exit までの時間と体感がほぼ一致していたが、遅延読み込みの普及で乖離した (README "How not to benchmark")
-->


---
layout: two-cols
ratio: 1/1.2
eyebrow: シェルの設定
---

# プロンプトのカスタマイズ

::left::

プロンプトに欲しいもの
- 軽量でgit の状態が見える

  → zshの組み込み <code>vcs_info</code>


- 見た目のリッチさ  

  →<a href="https://starship.rs/">`Starship`</a>

<p class="text-sm"><code>%~</code> がディレクトリ、<code>vcs_info</code> が git ブランチ、<code>%(?.a.b)</code> が終了コードでの分岐

  ブラウザで組み立てることも可能 
  <a href="https://bootsignal.com/en/tools/shell-prompt">bootsignal Shell Prompt Generator</a></p>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.72rem">

```sh [~/.config/zsh/.zshrc]
autoload -Uz vcs_info
precmd() { vcs_info }
zstyle ':vcs_info:git:*' formats ' %F{yellow}(%b)%f'
setopt PROMPT_SUBST
PROMPT='%F{blue}%~%f${vcs_info_msg_0_} '
PROMPT+='%(?.%F{green}.%F{red})❯%f '
```

```text [表示]
~/src/talks (main) ❯     # 成功後は緑、失敗後は赤
```

</div>

<FindyRef>

[zsh: Prompt Expansion](https://zsh.sourceforge.io/Doc/Release/Prompt-Expansion.html) / [vcs_info](https://zsh.sourceforge.io/Doc/Release/User-Contributions.html#Version-Control-Information)

</FindyRef>

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
layout: section
color: gray
---

# よく使うシェルのキーバインド

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
layout: two-cols
ratio: 1/1.3
eyebrow: シェルの設定
---

# おすすめキーバインド <FindyBadge variant="outline" color="high">上級</FindyBadge>

::left::

デフォルトでは設定されていないやつ。設定ファイルに追加して使う

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="Ctrl-x Ctrl-r">redo。undo しすぎた時に戻る</FindyKeyValue>
  <FindyKeyValue label="Esc→e">現在行を <code>$EDITOR</code> で編集</FindyKeyValue>
  <FindyKeyValue label="Ctrl-p / Ctrl-n">前方一致の履歴検索。<code>docker</code> と打って Ctrl-p</FindyKeyValue>
</FindyKeyValueList>

::right::

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

```sh [bash (.inputrc)]
# Ctrl-x Ctrl-r で redo
# ※ bash の readline には redo がない (undo のみ)
# Ctrl-x Ctrl-e で現在行を $EDITOR で編集 (bash はデフォルトで有効)
# ※ 設定不要: Ctrl-x Ctrl-e で edit-and-execute-command が使える
# Ctrl-p / Ctrl-n を前方一致の履歴検索にする
"\C-p": history-search-backward
"\C-n": history-search-forward
```

```sh [fish (config.fish)]
# ※ fish には redo に相当する機能がない
# Alt-e または Alt-v で現在行を $EDITOR で編集 (fish はデフォルトで有効)
# ※ 設定不要: Alt-e で edit_command_buffer が使える
# Ctrl-p / Ctrl-n を前方一致の履歴検索にする
# ※ fish は Ctrl-p/n がデフォルトで履歴検索 (history-prefix-search) になっている
```

::

<style>
/* zle -N の行が長く右カラムに収まらないため、このスライドだけ縮める */
.slidev-code { --slidev-code-font-size: 0.72rem; }
</style>

---
layout: two-cols
ratio: 1/1.2
eyebrow: シェルの設定
---

# 前のコマンドから好きな単語を拾う

::left::

<FindyAccentMark>Esc→.</FindyAccentMark> は最後の単語のみ  

<FindyAccentMark>Esc→,</FindyAccentMark> `copy-earlier-word` を続けて押すと、同じ行の 1 つ手前の単語に差し替わる

<div class="code-compact" style="--findy-code-compact-size: 0.8rem">

```sh
$ ls /etc /tmp
$ echo ▮
# Esc→.  → echo /tmp
# Esc→,  → echo /etc
# Esc→,  → echo ls
```

</div>

<p class="text-sm op-60 mt-2">実際は「さっき <code>cp</code> したコピー元をもう一度開く」のような場面で使う</p>

::right::

::code-group

```sh [zsh (~/.zshrc)]
# Esc→, で Esc→. の 1 つ手前の単語に差し替える
autoload -Uz copy-earlier-word
zle -N copy-earlier-word
bindkey '^[,' copy-earlier-word
```

```sh [bash]
# 設定不要。Esc→. に数引数を付けると n 番目の単語になる
# Esc→1 Esc→.  → 1 番目 (コマンド名は 0 番目)
# Esc→- Esc→2 Esc→.  → 後ろから 2 番目
```

```sh [fish]
# 設定不要。Alt-↑ / Alt-↓ で入力中の単語を含む履歴の単語を検索する
```

::

<FindyRef>

[zshcontrib(1) copy-earlier-word](https://zsh.sourceforge.io/Doc/Release/User-Contributions.html#ZLE-Functions) / [bash: yank-last-arg](https://www.gnu.org/software/bash/manual/html_node/Commands-For-History.html)

</FindyRef>

---
layout: two-cols
ratio: 1.4/1
valign: center
eyebrow: シェルの設定
---

# シェルのキーバインドは Emacs 由来

::left::

## デフォルトは Emacs モード

<p class="text-sm op-60">例: <code>Ctrl+A</code> で行頭、<code>Ctrl+E</code> で行末</p>

## vi モード `bindkey -v` を使わない理由

<div class="text-sm op-70">

- Normal / Insert の切替が地味にストレス
- 今どちらのモードか視覚フィードバックが弱い
- ssh 先・Docker 内など設定が効かない場面で混乱する

</div>


::right::

<FindyCallout>
  ガッツリ編集したいときだけ <code>edit-command-line</code> (Esc→e) で <code>$EDITOR</code> を開けばよい
</FindyCallout>

