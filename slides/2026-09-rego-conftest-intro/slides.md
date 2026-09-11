---
theme: findy
unlisted: true
title: Rego / conftest 入門
date: 2026-09-11
info: |
  Rego / conftest 入門
  社内勉強会
class: text-left
comark: true
favicon: https://github.com/mozumasu.png
addons:
  - slidev-addon-findy
layout: talk-cover
event: 社内勉強会
image: https://github.com/mozumasu.png
name: mozumasu
role: Platform SRE
---

## Terraform の Policy as Code を引き継ぐために
# Rego / conftest 入門

---
layout: profile
image: https://github.com/mozumasu.png
name: mozumasu
role: Platform SRE
---

## 自己紹介

- Platform SRE。Terraform リポジトリの CI と Policy as Code を担当
- 開発環境: macOS / WezTerm / Neovim / macSKK
- X: @mozumasu / GitHub: mozumasu

<div class="mt-6">
<FindyCallout label="今日のゴール">
Rego と conftest を知らない人が、Terraform の Policy as Code の運用 (ポリシー追加・例外登録・導入) を引き継げる状態になる
</FindyCallout>
</div>

---
layout: toc
columns: 1
---

---
src: ./pages/01-why-policy-as-code.md
---

---
src: ./pages/02-reading-rego.md
---

---
src: ./pages/03-running-rego.md
---

---
src: ./pages/04-conftest-terraform.md
---

---
src: ./pages/05-operations.md
---

---
layout: content
---

# まとめ

<v-clicks>

- Rego は **手順ではなく条件の宣言**。全条件が真なら deny に入り、1 つでも偽なら undefined
- **テストが採点者**。壊れたポリシーはエラーを出さず緑になる
- conftest は `test` (Terraform を採点) と `verify` (Rego を採点) の 2 つ
- 入力は **plan JSON** (解決済みの値) と **HCL** (構造・パス) の 2 系統
- 例外は禁止ではなく **理由の明示を強制**。`path` × `rule` × `reason`
- 導入は **洗い出し → 判断 → 1 PR → 緑**。warn 期間は設けない

</v-clicks>

<v-click>

<div class="mt-6 takeaway">

まずは rego-playground の 01〜05 を手を動かして通す。そこまでで Rego は読める

</div>

</v-click>

---
layout: end
---

# ありがとうございました
