---
layout: section
no: "04"
title: テーマ・インプット
toc: テーマ・インプット：学びと発信を続ける仕組み
---

学びと発信を続ける仕組み

---
eyebrow: 04 テーマ・インプット
title: 発表テーマの探し方
---

# 発表テーマの探し方

<v-clicks>

- 過去の自分が知りたかったこと
- コミュニティの人が興味ありそうなこと
- 今かかえている課題

</v-clicks>

<SwissKeyMessage v-click class="mt-10">

コミュニティの人と話すと<br>自分の*普通*が普通じゃないと分かったりする

</SwissKeyMessage>

---
eyebrow: 04 テーマ・インプット
title: 日々のインプットを発表につなげる
---

# 日々のインプットを発表につなげる

- インプットを効率化するツール: Raycast / Claude Code / nb
- 発表をラクにする仕組み: Slidev × Neovim
- 効率化しながら表現力を高める工夫

---
eyebrow: 04 テーマ・インプット
title: /btw の回答をメモに貯める
---

# /btw の回答をメモに貯める

<div class="flex items-stretch gap-2 mt-2 flow-cards">
  <div v-click class="feature-card flex-1">
    <p class="feature-card__title">1. /btw</p>
    <p>作業中に質問して<br>回答をコピー</p>
  </div>
  <div v-click class="flow-arrow">→</div>
  <div v-after class="feature-card flex-1">
    <p class="feature-card__title">2. Raycast</p>
    <p>自作のコマンドを<br>呼び出す</p>
  </div>
  <div v-click class="flow-arrow">→</div>
  <div v-after class="feature-card flex-1">
    <p class="feature-card__title">3. Claude</p>
    <p>固有名詞を除いて<br>技術メモに整形</p>
  </div>
  <div v-click class="flow-arrow">→</div>
  <div v-after class="feature-card flex-1">
    <p class="feature-card__title">4. nb</p>
    <p>メモとして貯めて<br>あとで検索</p>
  </div>
</div>

<SwissKeyMessage v-click class="mt-10">

固有名詞を除くので、社内の話もそのまま*発表のネタ*に育てられる

</SwissKeyMessage>

---
eyebrow: 04 テーマ・インプット
title: ブックマークも Markdown で持つ
---

# ブックマークも Markdown で持つ

<div class="grid grid-cols-[auto_1fr] gap-12 items-center mt-2">
<a href="https://www.raycast.com/rmartins/markmarks" target="_blank" class="person-card">
  <img src="https://files.raycast.com/out7sq8l5nie5ytw5vwrc5cyau9g" alt="" class="!rounded-none" />
  <span>MarkMarks (Raycast)</span>
</a>
<div>

<v-clicks>

- 開いているタブを Raycast からブックマーク
- 保存先は Markdown ファイル。見出しでグループ分け
- タイトルや URL をファジー検索して開く

</v-clicks>

</div>
</div>

<SwissKeyMessage v-click class="mt-10">

ブックマークも*ただの Markdown* なので、メモと同じように扱える

</SwissKeyMessage>

---
eyebrow: 04 テーマ・インプット
title: nb でメモを貯める
---

# nb でメモを貯める

<div class="grid grid-cols-[1fr_auto] gap-12 mt-2">
<div>

<v-clicks>

- CLI のノートツール
- メモは Markdown
- 保存先は Git リポジトリ<br>→ 端末をまたいで同期
- ノートブックで用途を分ける

</v-clicks>

</div>
<div v-click>
  <p class="lead-label">Neovim から操作する</p>

| キー | できること |
| --- | --- |
| `<leader>na` | メモを追加 |
| `<leader>np` | メモを探して開く |
| `<leader>ng` | メモを全文検索 |
| `<leader>ni` | 画像を取り込む |

</div>
</div>

---
eyebrow: 04 テーマ・インプット
title: 発表をラクにする Slidev
---

# 発表をラクにする Slidev

<div class="grid grid-cols-2 gap-6 mt-2">
  <div v-click class="feature-card">
    <p class="feature-card__title">章ごとにファイルを分けられる</p>
    <p>Markdown で書けて、<code>src:</code> で読み込むだけ</p>
  </div>
  <div v-click class="feature-card">
    <p class="feature-card__title">AI で表現力の幅が広がる</p>
    <p>図や動きもコードなので頼みやすい</p>
  </div>
  <div v-click class="feature-card">
    <p class="feature-card__title">レイアウトの知見がテーマに貯まる</p>
    <p>一度作ったレイアウトを次の発表でも使える</p>
  </div>
  <div v-click class="feature-card">
    <p class="feature-card__title">欲しい機能がだいたいある</p>
    <p>コードブロック、プレゼンターモードなど</p>
  </div>
</div>

<SwissKeyMessage v-click class="mt-10">

レイアウトは *AI*、内容は *人間* と分業できる

</SwissKeyMessage>

---
eyebrow: 04 テーマ・インプット
title: Neovim で編集もラクラク
---

# Neovim で編集もラクラク

<v-clicks>

- 折り畳み機能をカスタマイズして、スライドごとにトグルする
- ファジーファインダーでスライドを検索する

</v-clicks>
