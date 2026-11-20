---
layout: default
title: Terminal Night 3 の発表
toc: はじめに
---

<KeyMessage><em>zsh</em> のキーバインドと仕組みを紹介しました</KeyMessage>

<a class="talk-card" href="https://partner-prop.github.io/slides/mozumasu/terminal-night-3/" target="_blank" rel="noopener">
  <img :src="$asset('terminal-night-3.png')" alt="zsh から学ぶ最高の UX の表紙">
  <span>partner-prop.github.io/slides/mozumasu/terminal-night-3/</span>
</a>

---
layout: default
title: zsh から学ぶ最高の UX まとめ
---

| やりたいこと | zsh のキー | Widget |
|---|---|---|
| 直前のコマンドの最後の引数を入れる | `Esc` → `.` | `insert-last-word` |
| もっと前の引数に入れ替える | `Esc` → `,` | `copy-earlier-word` (要設定) |
| 編集を取り消す | `Ctrl+-` | `undo` |
| いつものエディタで編集する | `Esc` → `e` | `edit-command-line` (要設定) |
| 書きかけの行を一時退避する | `Esc` → `q` | `push-line` |

<RefNote><code>Esc</code> → <code>.</code> = Esc を押して離してから <code>.</code></RefNote>

---
layout: qa
mark: false
title: 今回の内容
# 1 答え / 2 シェルの名前 (1 つずつ自動で出る。答えの中に置くので番号で指定する)
clicks: 2
---

*3 つのシェル*でも<br>試してみた

<div v-click="2" class="shell-pills flex justify-center gap-6 mt-8">
<Pill text="Bash" />
<Pill text="fish" />
<Pill text="Nushell" />
</div>

<style>
/* v-click で出たら、名前を左から 1 つずつ出す */
.shell-pills .pp-pill {
  opacity: 0;
}
.shell-pills:not(.slidev-vclick-hidden) .pp-pill {
  animation: shell-pill-in 0.4s ease forwards;
}
.shell-pills:not(.slidev-vclick-hidden) .pp-pill:nth-child(2) {
  animation-delay: 0.35s;
}
.shell-pills:not(.slidev-vclick-hidden) .pp-pill:nth-child(3) {
  animation-delay: 0.7s;
}
@keyframes shell-pill-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>

---
layout: default
title: 試してみたい人へ
---

<KeyMessage>今のシェルから<em>起動するだけ</em>で試せる</KeyMessage>

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

```sh [インストール (macOS / Homebrew)]
brew install bash fish nushell
```

```sh [試す場合 (exit で元のシェルに戻る)]
bash
fish
nu     # Nushell のコマンド名は nu
```

</div>
<div>

| | 公式サイト |
|---|---|
| zsh | [zsh.org](https://www.zsh.org/) |
| Bash | [gnu.org/software/bash](https://www.gnu.org/software/bash/) |
| fish | [fishshell.com](https://fishshell.com/) |
| Nushell | [nushell.sh/book/installation](https://www.nushell.sh/book/installation.html) |

</div>
</div>

<RefNote>メインで使いたくなったら、ログインシェルとして設定する</RefNote>

---
layout: section
title: "02"
toc: 行編集の基本
---

# 行編集の基本

---
layout: default
title: 行編集とは
toc: 行編集とは
tocLevel: 2
# クリック: 1-4 デモのコマ送り
clicks: 4
---

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

// 3 クリック目は log を 1 文字ずつ打つ (キー操作ではなく、ただの入力だと伝える)
// $clicks は Slidev がスライドの script に用意している
const typed = ref(3)
let timer
watch($clicks, (c) => {
  clearInterval(timer)
  if (c !== 3) {
    typed.value = 3
    return
  }
  typed.value = 0
  timer = setInterval(() => {
    typed.value++
    if (typed.value >= 3)
      clearInterval(timer)
  }, 250)
}, { immediate: true })
onBeforeUnmount(() => clearInterval(timer))
</script>

<KeyMessage>行編集 = <em>Enter を押すまで</em>の編集</KeyMessage>

<TerminalDemo
  :step="$clicks"
  legend="^ = Ctrl"
  :frames="[
    { history: ['❯ git status'], line: '' },
    { key: '↑', history: ['❯ git status'], line: 'git status', note: '例えば ↑ で履歴から呼び出したり' },
    { key: '^W', history: ['❯ git status'], line: 'git ', note: '^W で最後の単語を消したり' },
    { history: ['❯ git status'], line: 'git ' + 'log'.slice(0, typed), mark: [4, 4 + typed], note: 'log と打ち直す。ここまでがシェルに渡る前の編集' },
    { key: '^M', history: ['❯ git status', '❯ git log'], line: '', note: 'Enter を押して初めて、シェルが行を受け取って実行する' },
  ]"
/>

---
layout: default
title: シェル本体と行編集の関係
# クリック: 1 本体の中 / 2 本体の外 / 3 まとめ
clicks: 3
---

<KeyMessage>編集は<em>行編集の仕組み</em> / 実行は<em>シェル本体</em></KeyMessage>

<ShellEditorRelation />

<div v-click="3" class="mt-3">
<KeyMessage>行編集が外にあれば<em>ほかのツールも同じ行編集を使える</em></KeyMessage>
</div>

<RefNote>Readline と Bash の作者はどちらも Brian Fox / 参照: <a href="https://tiswww.case.edu/php/chet/readline/rltop.html">GNU Readline</a> / <a href="https://github.com/nushell/reedline">reedline</a> / <a href="https://zsh.sourceforge.io/Doc/Release/Zsh-Modules.html#The-zsh_002fzle-Module">zsh/zle</a></RefNote>

---
layout: default
title: 行編集がないとどうなる？
toc: 行編集がないと
tocLevel: 2
# クリック: 1-2 デモのコマ送り / 3 まとめ
clicks: 3
---

<KeyMessage><em>Readline を外してビルドした</em> Bash を使ってみる</KeyMessage>

<TerminalDemo
  :step="Math.min($clicks, 2)"
  title="bash (Readline なしのビルド)"
  :frames="[
    { line: 'echo abc', note: '^A で行頭へ移りたい' },
    { key: '^A', line: 'echo abc^A', mark: [8, 10], note: 'カーソルは動かず、^A がそのまま文字として入る' },
    { key: '↑', line: 'echo abc^A^[[A', mark: [10, 14], note: '履歴も出ない。矢印キーの信号が文字のまま入る' },
  ]"
/>

<div v-click="3" class="mt-6">
<KeyMessage>行の編集は Bash 本体ではなく<em>Readline が受け持っている</em></KeyMessage>
</div>

<RefNote>Nix の <code>mkShell</code> の bash がこのビルド (<code>--disable-readline</code>)</RefNote>

---
layout: default
title: キーを押してから行が変わるまで
toc: キーを押すと何が起きるか
tocLevel: 2
# クリック: 1 割り当てを探す / 2 操作 / 3 行に反映 / 4 シェルごとの名前
clicks: 4
---

<KeyMessage>どのシェルも<em>行編集の仕組み</em>がキーに割り当てた<em>操作</em>を呼ぶ</KeyMessage>

<KeymapFlow />
