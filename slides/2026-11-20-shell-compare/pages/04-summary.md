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

<PointColumns click :items="[
  { label: '行編集の基本', title: 'キーを受け取るのは<br><em>行編集の仕組み</em>', text: 'ZLE / Readline / fish 本体 / Reedline' },
  { label: '同じ操作を比べる', title: '同じキーでも<br><em>動きが違う</em>', text: 'Esc → . / !$ / エディタで編集' },
  { label: 'ないなら作る', title: '<em>関数</em>を書いて<br><em>キーに割り当てる</em>', text: '関数で行の中身とカーソル位置を書き換える' },
]" />

---
layout: default
title: 今の割り当ては、シェルに聞けば分かる
---

<KeyMessage><em>機能の名前</em>で探せばシェルが変わっても見つかる</KeyMessage>

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
