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
