---
layout: section
variant: red
no: "04"
title: Input
toc: Input　ネタを貯める仕組み
---

ネタを貯める仕組み

---
eyebrow: 04 Input
title: 発表テーマの探し方
---

# 発表テーマの探し方

<v-clicks>

- 過去の自分が知りたかったこと
- コミュニティの人が興味ありそうなこと
- 今かかえている課題

</v-clicks>

<SwissKeyMessage v-click class="mt-10">

自分の知っていること *≠* みんなが知ってること

</SwissKeyMessage>

---
eyebrow: 04 Input
title: ブックマークも Markdown で持つ
---

# ブックマークも Markdown で持つ

<div class="bookmark-flow">
  <figure v-click class="btw-step">
    <figcaption><span>1</span><a href="https://www.raycast.com/rmartins/markmarks" target="_blank" rel="noopener" class="bookmark-tool">MarkMarks (Raycast)</a> でブックマーク</figcaption>
    <img src="/markmarks-add.png" />
    <p class="bookmark-note">開いているページのタイトルと URL が自動で入力される</p>
  </figure>
  <figure v-click class="btw-step">
    <figcaption><span>2</span>保存先は Markdown ファイル</figcaption>
    <img src="/markmarks-markdown.png" />
  </figure>
  <figure v-click class="btw-step">
    <figcaption><span>3</span>タイトルや URL をあいまい検索して開く</figcaption>
    <img src="/markmarks-search.png" />
  </figure>
</div>

<SwissKeyMessage v-click class="mt-6">

ブックマークも*ただの Markdown* なので、メモと同じように扱える

</SwissKeyMessage>

---
eyebrow: 04 Input
title: /btw の回答をメモに貯める
---

# /btw の回答をメモに貯める

<div class="btw-flow">
  <div class="btw-flow__side">
    <figure v-click class="btw-step">
      <figcaption><span>1</span>/btw → c で回答をコピー</figcaption>
      <img src="/btw-answer.jpg" />
    </figure>
    <figure v-click class="btw-step">
      <figcaption><span>2</span>Raycast で Claude を起動して技術メモに編集</figcaption>
      <img src="/raycast-tech-scrap.png" />
    </figure>
  </div>
  <figure v-click class="btw-step">
    <figcaption><span>3</span>編集した内容がクリップボードに入る</figcaption>
    <div class="btw-diff">
      <img src="/tech-scrap-diff.png" />
      <span class="btw-diff__label is-before">編集前</span>
      <span class="btw-diff__label is-after">編集後</span>
    </div>
  </figure>
</div>

<SwissKeyMessage v-click class="mt-4">

固有名詞を除くので、社内の話もそのまま*発表のネタ*に育てられる

</SwissKeyMessage>

---
eyebrow: 04 Input
title: nb でメモを貯める
---

# nb でメモを貯める

<div class="nb-layout">
<div>
<figure class="btw-step">
  <figcaption>Neovim から nb のメモを探して開く</figcaption>
  <img src="/nb-picker.png" />
</figure>
<div class="flex gap-4 mt-4">
  <LinkThumb href="https://eiji.page/blog/nb-memo-cli-intro/" src="https://eiji.page/og/nb-memo-cli-intro.png" class="thumb-xs" />
  <LinkThumb href="https://github.com/mozumasu/nb.nvim" src="https://opengraph.githubassets.com/1/mozumasu/nb.nvim" class="thumb-xs" />
</div>
</div>
<div class="nb-side">
<div v-click>
  <p class="lead-label">nb とは</p>
  <ul class="nb-points">
    <li>CLI のノートツール</li>
    <li>メモは Markdown</li>
    <li>Git で端末をまたいで同期</li>
    <li>ノートブックで用途を分ける</li>
  </ul>
</div>
<div v-click class="keymap-table">
  <p class="lead-label">Neovim から操作する</p>

| キー | できること |
| --- | --- |
| `<leader>na` | メモを追加 |
| `<leader>np` | メモを探して開く |
| `<leader>ng` | メモを全文検索 |
| `<leader>ni` | 画像を取り込む |

</div>
</div>
</div>

---
eyebrow: 04 Input
title: Slidev はいいぞ
---

# Slidev はいいぞ

<div class="grid grid-cols-[1fr_auto] gap-12 items-center mt-2">
<div>

<p class="lead-label">開発者のためのスライドツール</p>

- Markdown でスライドを書く
- `---` で区切ると 1 枚のスライドになる
- ブラウザで動く (Vue と Vite で作られている)
- テーマやアドオンで見た目と機能を足せる

</div>
<a href="https://sli.dev/" target="_blank" rel="noopener" class="border-0!">
  <img src="https://sli.dev/logo-title.png" alt="Slidev" class="w-56" />
</a>
</div>

---
eyebrow: 04 Input
title: 発表をラクにする Slidev
---

# 発表をラクにする Slidev

<div class="slidev-points">
<div>

<v-clicks>

- 章ごとにファイルを分けられる
- AI で表現力の幅が広がる
- レイアウトの知見が[テーマ](https://github.com/mozumasu/swiss-slidev)に貯まる
- 欲しい機能がだいたいある

</v-clicks>

</div>
<div class="slidev-right">
<figure v-click="[3, 4]" class="btw-step">
  <figcaption>テーマ: swiss-slidev</figcaption>
  <img src="/swiss-theme-overview.png" alt="swiss-slidev のテーマのスライド一覧" />
</figure>
<div v-click="4" class="slidev-samples">
<figure class="btw-step">
  <figcaption>コードブロック (行のハイライト)</figcaption>
  <div class="code-sample">

```ts {2}
function greet(name: string) {
  const message = `Hello, ${name}!`
  console.log(message)
}
```

  </div>
</figure>
<figure class="btw-step">
  <figcaption>プレゼンターモード</figcaption>
  <img src="https://sli.dev/screenshots/presenter-mode.png" alt="Slidev のプレゼンターモードの画面" />
</figure>
</div>
</div>
</div>

<SwissKeyMessage v-click class="mt-6">

レイアウトは *AI*、内容は *人間* と分業できる

</SwissKeyMessage>

---
eyebrow: 04 Input
title: 下書きがそのままスライドになる
---

# 下書きがそのままスライドになる

<div class="draft-flow">
  <figure class="btw-step">
    <figcaption>これが</figcaption>
    <img src="/slidev-draft.png" />
  </figure>
  <span class="flow-arrow">→</span>
  <figure v-click class="btw-step">
    <figcaption>こうなる</figcaption>
    <img src="/slidev-overview.png" />
  </figure>
</div>

---
# 次の章扉へは右上から赤い円が広がって移る
transition: swiss-circle
eyebrow: 04 Input
title: Neovim で編集もラクラク
---

# Neovim で編集もラクラク

<p class="lead-label">Neovim のカスタマイズで、より使いやすく</p>

<div class="nvim-flow">
  <figure v-click class="btw-step">
    <figcaption><span>1</span>スライド一覧からジャンプ</figcaption>
    <img src="/nvim-slide-jump.png" />
  </figure>
  <figure v-click class="btw-step">
    <figcaption><span>2</span>スライド一覧をトグル</figcaption>
    <img src="/nvim-slide-fold.png" />
  </figure>
</div>
