---
theme: partnerprop
title: Kubernetesに爆速で入門したい!
date: 2026-11-25
event: "TechBull mini LT &交流会! #5"
info: |
  Kubernetesに爆速で入門したい!
  TechBull mini LT &交流会! #5
  https://techbull.connpass.com/event/409611/
# 会社のテーマは CI から読めないので、手元のビルド結果 (prebuilt/) を配信する
prebuilt: true
# 発表まで一覧に載せない
unlisted: true
# 会社のマーク (public/favicon.png)。--base 付きで配信するので相対パスで書く
favicon: favicon.png
addons:
  - slidev-addon-partnerprop
layout: cover
variant: talk
subtitle: mozumasu
avatar: https://github.com/mozumasu.png
tagline: "TechBull mini LT &交流会! #5"
taglineNote: "2026.11.25\n@株式会社ハートビーツ"
---

::title::

*Kubernetes*に<br>爆速で入門したい!

---
layout: profile
title: 自己紹介
image: https://github.com/mozumasu.png
name: mozumasu
affiliation: SRE / PartnerProp, Inc.
links:
  - { label: 'X: @mozumasu', url: 'https://x.com/mozumasu', icon: x-logo }
  - { label: 'GitHub: mozumasu', url: 'https://github.com/mozumasu', icon: github-logo }
qr: https://talks.mozumasu.com/kubernetes-intro/
---

- **Environment** macOS / WezTerm / Neovim / macSKK
- **CAREER** SES → フリーランス → Platform SRE → Embedded SRE
- **Media** TECH WORLD / adachin dev / MIRAITO CHANNEL /<br>エンジニアの楽園ラジオ に出演
- **Kubernetes** 初心者

---
layout: toc
title: 今日話すこと
---

---
src: ./pages/01-overview.md
---

---
title: まとめ
---

<Narrator mood="happy">こうして頭の中に<em>地図</em>ができたのじゃ</Narrator>

<div class="wrap">
<ol class="wrap-points">
  <li v-click>Kubernetes は「あるべき状態」に<em>合わせ続けて</em>くれる</li>
  <li v-click>登場人物は <em>Control Plane</em> (司令塔) と <em>Data Plane</em> (現場) に分かれる</li>
  <li v-click>みんな <em>kube-api-server</em> を通して話す<br><small>登録 → 置き場所を決める → 起動、とバトンを渡していく</small></li>
</ol>
<div v-click class="wrap-end">
  <Yuru class="wrap-person" mood="sleep" />
  <p>今夜はぐっすり眠れそうじゃ<br><b>めでたし、めでたし</b></p>
</div>
</div>

<p v-click class="wrap-next">続きは Appendix へ (連携の流れ・kubectl の向き先・ハンズオン)</p>

---
layout: end
message: Thank you for listening!
---

---
layout: section
title: '03'
toc: Appendix
---

# Appendix

---
# 発表時間 (5〜10 分) に収めるため、01 より後ろは Appendix に回す
src: ./pages/02-collaboration.md
---

---
src: ./pages/03-kubectl.md
---

---
src: ./pages/04-local-cluster.md
---

---
src: ./pages/05-app.md
---

---
src: ./pages/06-appendix.md
---
