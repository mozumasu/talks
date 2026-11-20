---
layout: section
title: "05"
toc: まとめ
---

# まとめ

---
layout: default
title: 今日のまとめ
# クリック: 1-3 1 つずつ出す
clicks: 3
---

<div class="sum">
  <div v-click="1" class="sum-col">
    <p class="sum-no">01</p>
    <p class="sum-label">行編集の基本</p>
    <p class="sum-main">キーを受け取るのは<br><em>行編集の仕組み</em></p>
    <p class="sum-sub">ZLE / Readline / fish 本体 / Reedline</p>
  </div>
  <div v-click="2" class="sum-col">
    <p class="sum-no">02</p>
    <p class="sum-label">同じ操作を比べる</p>
    <p class="sum-main">同じキーでも<br><em>動きが違う</em></p>
    <p class="sum-sub">Esc → . / !$ / エディタで編集</p>
  </div>
  <div v-click="3" class="sum-col">
    <p class="sum-no">03</p>
    <p class="sum-label">ないなら作る</p>
    <p class="sum-main"><em>関数</em>を書いて<br><em>キーに割り当てる</em></p>
    <p class="sum-sub">関数で行の中身とカーソル位置を書き換える</p>
  </div>
</div>

<style>
.sum {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  align-content: center;
  margin-top: -1rem;
}
.sum-col {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0 1.6rem;
  border-left: 1px solid var(--theme-gray-200);
}
.sum-col:first-child {
  border-left: none;
}
.sum-col p {
  margin: 0;
}
.sum-no {
  color: var(--theme-red);
  font-size: 3.2rem;
  font-weight: var(--theme-font-weight-bold);
  line-height: 1;
  letter-spacing: 0.02em;
}
.sum-label {
  color: var(--theme-muted);
  font-size: 0.85rem;
  font-weight: var(--theme-font-weight-bold);
  letter-spacing: 0.08em;
}
.sum-main {
  font-size: 1.55rem;
  font-weight: var(--theme-font-weight-bold);
  line-height: 1.45;
}
.sum-sub {
  margin-top: 0.4rem !important;
  color: var(--theme-muted);
  font-size: 0.75rem;
  line-height: 1.6;
}
</style>

---
layout: default
title: 今の割り当ては、シェルに聞けば分かる
---

<KeyMessage>キーではなく<em>機能の名前</em>で探すと、シェルが変わっても見つけやすい</KeyMessage>

| | 割り当ての一覧 | 例: 最後の引数を入れる機能を探す |
|---|---|---|
| zsh | `bindkey` | `bindkey \| grep insert-last-word` |
| Bash | `bind -p` | `bind -q yank-last-arg` |
| fish | `bind` | `bind \| grep history-token` |
| Nushell | `keybindings default` | `keybindings list --edits` で使える編集操作を見る |

<RefNote>Nushell は <code>keybindings listen</code> で、押したキーが何として届くかを確かめられる</RefNote>

---
layout: qa
mark: false
title: Q. 同じ操作を違うシェルで使うには？
---

名前が分かれば*探せる*<br>なければ*作れる*
