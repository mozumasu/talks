---
layout: section
color: blue
toc: なぜ Policy as Code か
---

# なぜ Policy as Code か

レビューで人が見つけていたミスを、CI で機械的に止める

---
layout: content
eyebrowNum: 1
eyebrow: なぜ Policy as Code か
---

# Terraform 運用でよくある事故

<div class="grid grid-cols-3 gap-x-10 gap-y-5 mt-4 text-sm">
<div v-click>

## state の上書き

`environments/production/` 配下なのに
workspace 名が staging を指している

</div>
<div v-click>

## workspace 名の重複

別ディレクトリで同じ workspace 名を宣言
どちらの plan か分からない

</div>
<div v-click>

## VPC CIDR の割当外

割当表に無いレンジで VPC を作成  
後から peering できない

</div>
</div>

<v-click>

<div class="mt-8 takeaway">

> plan / apply が通ること (動くこと) はテストの責務  
> Policy as Code では 「plan は通るが組織として許されない構成」をマージ前に止める

</div>

</v-click>

<!--
3 つとも「気づいた人がたまたまレビューにいたから止まった」で済ませがちな事故。
再発防止をレビュー観点の追加で済ませると、また人の目に依存する。
-->

---
layout: content
eyebrowNum: 1
eyebrow: なぜ Policy as Code か
---

# 登場人物は 3 つ

<FindyTermCardList>
  <FindyTermCard term="OPA">
    ポリシーを評価するエンジン (Open Policy Agent)
    <template #note>単体で使うことは今日はない</template>
  </FindyTermCard>
  <FindyTermCard term="Rego">
    OPA のポリシー記述言語
    <template #note>今日の主役。読み方に慣れる</template>
  </FindyTermCard>
  <FindyTermCard term="conftest">
    Terraform / YAML 向けの CLI ラッパー
    <template #note>OPA を内蔵。ファイルを input にして deny を集めるだけ</template>
  </FindyTermCard>
</FindyTermCardList>

<v-click>

<div class="mt-6 text-center text-xl">

**conftest = 「ファイルを読んで、Rego に渡して、deny を並べる」だけのツール**

</div>

</v-click>

<!--
conftest は OPA を内蔵しているので別途 OPA のインストールは不要。
覚えることは Rego の書き方と conftest のコマンド 2 つだけ。
-->

---
layout: content
eyebrowNum: 1
eyebrow: なぜ Policy as Code か
---

# 3 つの関係

<div class="flow">

<div class="flow-node flow-node--file" style="grid-column: 1; grid-row: 2">
<svg class="flow-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5"/><path d="M9 13h7M9 17h7"/></svg>
<strong>Terraform / YAML<br>ファイル</strong>
</div>

<div v-click="1" class="flow-note" style="grid-column: 2 / span 2; grid-row: 1">
<b>① ファイルを読む</b>
Terraform や YAML のファイルを input にする
</div>
<svg v-click="1" class="flow-arrow" style="grid-column: 2; grid-row: 2" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>

<div v-click="1" class="flow-node" style="grid-column: 3; grid-row: 2">
<span class="flow-term">conftest</span>
Terraform / YAML 向けの<br>CLI ラッパー
</div>

<div v-click="2" class="flow-note" style="grid-column: 4 / span 2; grid-row: 1">
<b>② ファイルを渡して評価</b>
ファイルの内容を input として OPA に渡す
</div>
<svg v-click="2" class="flow-arrow" style="grid-column: 4; grid-row: 2" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>

<div v-click="2" class="flow-node" style="grid-column: 5; grid-row: 2">
<span class="flow-term">OPA</span>
ポリシーを評価する<br>エンジン
</div>

<div v-click="3" class="flow-note" style="grid-column: 6 / span 2; grid-row: 1">
<b>③ ポリシールールを提供</b>
Rego で書かれたルールを使って評価する
</div>
<svg v-click="3" class="flow-arrow flow-arrow--left" style="grid-column: 6; grid-row: 2" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>

<div v-click="3" class="flow-node" style="grid-column: 7; grid-row: 2">
<span class="flow-term">Rego</span>
OPA のポリシー<br>記述言語
</div>

<div v-click="4" class="flow-arrow-wrap" style="grid-column: 5; grid-row: 3"><svg class="flow-arrow flow-arrow--down" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg></div>
<div v-click="4" class="flow-node flow-node--deny" style="grid-column: 4 / span 3; grid-row: 4">
<strong>deny / ポリシー違反</strong>
</div>
<div v-click="4" class="flow-note" style="grid-column: 7; grid-row: 4">
<b>④ 評価結果を返す</b>
ポリシー違反 (deny) を返す
</div>

</div>

<!--
conftest がファイルを読んで OPA に渡し、OPA が Rego のルールで評価して deny を返す。
利用者が触るのは Rego (書く) と conftest (実行する) の 2 つで、OPA は conftest の中にいる。
-->
