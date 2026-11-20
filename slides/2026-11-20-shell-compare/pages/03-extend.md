---
layout: section
title: "04"
toc: ないなら作る
---

# ないなら作る

---
layout: qa
mark: false
title: Q. キーに自作の操作を割り当てるには？
# 1 答え / 2 シェルごとの違い
clicks: 2
---

*行の中身*と*カーソル位置*<br>を書き換えるだけ

<p v-click="2" class="qa-sub">zsh と Bash は変数、fish と Nushell はコマンドで書き換える</p>

<style>
.qa-sub {
  margin-top: 2rem !important;
  color: var(--theme-muted);
  font-size: 1.2rem !important;
  font-weight: var(--theme-font-weight-bold);
  letter-spacing: 0.02em !important;
}
</style>

---
layout: default
title: キーバインド設定の流れ
# クリック: 1 関数 / 2 キーに割り当て
clicks: 2
---

<KeyMessage>どのシェルも<em>関数を書いて</em><em>キーに割り当てる</em>だけ</KeyMessage>

<div class="kb-flow">
  <div v-click="1" class="kb-step">
    <p class="kb-no">1</p>
    <p class="kb-title">関数で行の中身とカーソル位置を変える</p>
    <p class="kb-desc">行を読んで、書き換えて、カーソルを動かす</p>
    <code class="kb-ex">LBUFFER+=$(date +%Y%m%d)</code>
  </div>
  <span v-click="2" class="kb-arrow">▶</span>
  <div v-click="2" class="kb-step">
    <p class="kb-no">2</p>
    <p class="kb-title">関数をキーに割り当てる</p>
    <p class="kb-desc">押したキーで、その関数が呼ばれるようにする</p>
    <code class="kb-ex">bindkey '^[;' insert-date</code>
  </div>
</div>

<RefNote>例は zsh。zsh だけは割り当ての前に <code>zle -N</code> で関数を Widget として登録する</RefNote>

<style>
.kb-flow {
  display: grid;
  grid-template-columns: 1fr 3rem 1fr;
  align-items: stretch;
  margin-top: 2.5rem;
}
.kb-step {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1.4rem 1.6rem;
  border: 2px solid var(--theme-red);
  border-radius: 0.9rem;
  background: var(--theme-red-soft);
}
.kb-step p {
  margin: 0;
}
.kb-no {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: var(--theme-red);
  color: var(--theme-background);
  font-weight: var(--theme-font-weight-bold);
}
.kb-title {
  font-size: 1.25rem;
  font-weight: var(--theme-font-weight-bold);
}
.kb-desc {
  color: var(--theme-muted);
  font-size: 0.85rem;
}
.kb-ex {
  margin-top: auto;
  padding: 0.5rem 0.8rem;
  border-radius: 0.4rem;
  background: #16181d;
  color: #e6e6e6;
  font-size: 0.85rem;
}
.kb-arrow {
  align-self: center;
  color: var(--theme-red);
  font-size: 1.4rem;
  text-align: center;
}
</style>

---
layout: default
title: お題は「カーソル位置に今日の日付を入れる」
clicks: 1
---

<TerminalDemo
  :step="$clicks"
  :binds="[
    { keys: 'Esc → ;', widget: 'insert_date', desc: 'カーソル位置に今日の日付を入れる' },
  ]"
  :frames="[
    { line: 'cp config.yml config.yml.', note: 'バックアップのファイル名に今日の日付を付けたい' },
    { key: 'Esc → ;', line: 'cp config.yml config.yml.20261120', mark: [25, 33], note: 'カーソルの位置に日付が入る' },
  ]"
/>

<RefNote>4 つのシェルとも最初からは入っていない操作。これを 4 つのシェルで書いてみる</RefNote>

---
layout: two-cols
title: zsh と Bash
toc: 4 つのシェルで書く
tocLevel: 2
---

**zsh: 関数を Widget にする**

```zsh [~/.zshrc]
# カーソルより左 ($LBUFFER) に日付を足す
insert-date() {
  LBUFFER+=$(date +%Y%m%d)
}
# 関数を Widget として登録する
zle -N insert-date
# Esc → ; に割り当てる
bindkey '^[;' insert-date
```

<SpeechBubble image="https://github.com/mozumasu.png" pinned>設定ファイルに書かなくても<br>開いているシェルに貼り付ければ試せるよ</SpeechBubble>

<style>
/* コードと重ならないように、吹き出しを小さめにする */
.speech-bubble {
  --speech-bubble-icon-size: 3.5rem;
  --speech-bubble-font-size: 1.1rem;
}
/* 吹き出しの地を赤にして、文字を白にする */
.speech-bubble :deep(.speech-bubble-text) {
  background: var(--theme-red);
  color: var(--theme-background);
}
.speech-bubble :deep(.speech-bubble-text)::before {
  border-right-color: var(--theme-red);
}
</style>

::right::

**Bash: bind -x で関数を呼ぶ**

```bash [~/.bashrc]
insert_date() {
  local d=$(date +%Y%m%d)
  # 行の中身とカーソル位置
  local l=$READLINE_LINE p=$READLINE_POINT
  # カーソル位置で行を分けて、日付を差し込む
  READLINE_LINE=${l:0:p}$d${l:p}
  # カーソルを日付の後ろへ動かす
  READLINE_POINT=$((p + ${#d}))
}
# Esc → ; で関数を呼ぶ
bind -x '"\e;": insert_date'
```

---
layout: two-cols
title: fish と Nushell
---

**fish: commandline で行に差し込む**

```fish [~/.config/fish/config.fish]
function insert_date
    # カーソル位置に日付を差し込む
    commandline -i (date +%Y%m%d)
end
# Esc → ; に割り当てる
# (既定では Esc のあと 30 ms 以内に ; を押す)
bind alt-\; insert_date
```

::right::

**Nushell: キーからコマンドを実行する**

```nu [~/.config/nushell/config.nu]
$env.config.keybindings ++= [{
  name: insert_date
  modifier: alt
  keycode: 'char_;'
  mode: [emacs vi_insert]
  event: {
    # Nushell のコマンドを実行する
    send: executehostcommand
    # カーソル位置に日付を差し込む
    cmd: 'commandline edit --insert (date now | format date "%Y%m%d")'
  }
}]
```

<RefNote>Nushell の <code>keycode</code> は <code>'char_;'</code> と引用符で囲む<br>(<code>;</code> が区切りになるため)</RefNote>

<style>
/* Nushell の cmd が 1 行で長いので、見切れないように折り返す */
.slidev-code code {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

---
layout: default
title: 並べると、同じ形をしている
# クリック: 1 zsh だけにある段を出す
clicks: 1
---

<KeyMessage>zsh と Bash は<em>変数</em>で、fish と Nushell は<em>コマンド</em>で行を読み書きする</KeyMessage>

| | 行の中身 | カーソル位置 | 関数の登録 | キーに割り当てる |
|---|---|---|---|---|
| zsh | `$BUFFER` | `$CURSOR` | <span class="reg-step">`zle -N`</span> | `bindkey` |
| Bash | `$READLINE_LINE` | `$READLINE_POINT` | ― | `bind -x` |
| fish | `commandline` | `commandline -C` | ― | `bind` |
| Nushell | `commandline` | `commandline get-cursor` | ― | `$env.config.keybindings` |

<div v-click="1" class="mt-4">
<KeyMessage><em>zsh だけ</em>関数を Widget に登録する段がある</KeyMessage>
</div>

<style>
/* 2 クリック目で、zsh だけにある登録の段を目立たせる */
.reg-step code {
  transition: background 0.3s ease, color 0.3s ease;
}
.slidev-page:has(.slidev-vclick-target:not(.slidev-vclick-hidden)) .reg-step code {
  background: var(--theme-red);
  color: var(--theme-background);
}
</style>

---
layout: statement
align: center
label: Nushell
title: Nushell でも最後の引数を入れたい
toc: Nushell に足りない操作を作る
tocLevel: 2
---

ほかの 3 つのシェルにある <code>Esc</code> → <code>.</code> が、Nushell にはない

<style>
/* 小セクションの扉として、文字を上下の真ん中に置く */
.statement {
  justify-content: center;
}
</style>

---
layout: code
title: "Nushell に Alt + . を作る"
---

<CodeSteps :steps="[
  { title: 'キーを決める', text: 'Alt + . に割り当てる。Nushell では Esc → . が使えないので、Alt と . を同時に押す' },
  { title: '履歴から取り出して差し込む', text: 'history は<em>テーブル</em>で返るので、最後の行の command 列を空白で区切り、最後の単語をカーソル位置に入れる' },
]" />

<div class="why-box">
  <p class="why-title">⚠ Esc → . が使えない理由</p>
  <p>Reedline が使う crossterm は<br>単独で届いた Esc をすぐ Esc キーとして扱う</p>
  <a class="why-link" href="https://github.com/crossterm-rs/crossterm/issues/993">crossterm-rs/crossterm#993</a>
</div>

::code::

```nu [~/.config/nushell/config.nu] {3-4|8}
$env.config.keybindings ++= [{
  name: insert_last_arg
  modifier: alt
  keycode: char_.
  mode: [emacs vi_insert]
  event: {
    send: executehostcommand
    cmd: 'commandline edit --insert (history | last | get command | split row " " | last)'
  }
}]
```


<style>
/* Nushell の cmd が 1 行で長いので、見切れないように折り返す */
.slidev-code code {
  white-space: pre-wrap;
  word-break: break-all;
}
/* Esc → . が使えない理由を、注意の囲みで見せる */
.why-box {
  margin-top: 1.5rem;
  padding: 0.7rem 1rem;
  border: 1.5px dashed var(--theme-gray-200);
  border-radius: 0.5rem;
  color: var(--theme-muted);
  font-size: 0.72rem;
  line-height: 1.6;
}
.why-box p {
  margin: 0;
}
.why-title {
  margin-bottom: 0.2rem !important;
  color: var(--theme-text, inherit);
  font-weight: var(--theme-font-weight-bold);
}
.slidev-layout a.why-link {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.1rem 0.6rem;
  border: 1px solid var(--theme-gray-200);
  border-bottom: 1px solid var(--theme-gray-200);
  border-radius: 999px;
  background: var(--theme-background);
  color: var(--theme-muted);
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.7rem;
}
</style>
