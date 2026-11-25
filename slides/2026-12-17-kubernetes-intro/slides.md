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

<ol class="wrap-points">
  <li v-click>Kubernetes は「あるべき状態」に<em>合わせ続けて</em>くれる<br><small>だから深夜 3 時に起きなくてよい</small></li>
  <li v-click>手作業は、部品が<em>代わりにやって</em>くれる<br><small>kube-controller-manager (気づく) → kube-scheduler (決める) → kubelet (起動する) → kube-proxy (届ける)</small></li>
  <li v-click>部品どうしは直接話さず、<em>kube-api-server</em> を見張ってバトンを渡す</li>
</ol>

---
title: 爆速で入門するコツ
---

<Narrator mood="happy">地図は、描きながら直していくものなのじゃ</Narrator>

<div class="tips">
<!-- 図に起こす → ズレに気づく → 直す を、矢印でぐるっと回る図にする -->
<svg class="tips-cycle" viewBox="0 0 360 300" role="img" aria-label="図に起こす、ズレに気づく、直す、を繰り返すサイクル">
  <defs>
    <marker id="tips-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <path class="tips-arc" d="M215,52 A120,120 0 0 1 292,196" marker-end="url(#tips-arrow)" />
  <path class="tips-arc" d="M250,250 A120,120 0 0 1 110,250" marker-end="url(#tips-arrow)" />
  <path class="tips-arc" d="M68,196 A120,120 0 0 1 145,52" marker-end="url(#tips-arrow)" />
  <g class="tips-step"><rect x="110" y="20" width="140" height="50" rx="25" /><text x="180" y="45">図に起こす</text></g>
  <g class="tips-step"><rect x="220" y="200" width="140" height="50" rx="25" /><text x="290" y="225">ズレに気づく</text></g>
  <g class="tips-step"><rect x="0" y="200" width="140" height="50" rx="25" /><text x="70" y="225">直す</text></g>
</svg>
<div>
  <p class="tips-label">このデッキを作りながら気づいたズレ</p>
  <dl class="tips-gaps">
    <div v-click><dt>思い込み: scheduler が Pod を Node に運ぶ</dt><dd>実際は行き先を書き込むだけ。起動するのは kubelet</dd></div>
    <div v-click><dt>思い込み: Pod は置き場所が決まってから作られる</dt><dd>実際は controller-manager が、置き場所を空欄のまま先に登録する</dd></div>
  </dl>
  <div v-click class="wrap-end">
    <Yuru class="wrap-person" mood="sleep" />
    <p>今夜はぐっすり眠れそうじゃ<br><b>めでたし、めでたし</b></p>
  </div>
</div>
</div>

<p v-click class="wrap-next">続きは Appendix へ (kubectl の向き先・ハンズオン・CRI など)</p>

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
# 発表時間 (5〜10 分) に収めるため、本編より後ろは Appendix に回す
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
