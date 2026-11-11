---
layout: section
title: '02'
toc: なぜ移行したのか
---

# なぜ移行したのか

---
title: 移行前の構成と課題
---

全部の Pod を *Fargate* で動かしていた

<div class="before">

<svg class="before-arch" viewBox="0 0 520 380" role="img" aria-label="移行前はアプリと環境の組ごとに Fargate プロファイルがあり、監視はサイドカーで各 Pod に入れていた">
  <rect class="frame" x="4" y="4" width="512" height="372" rx="12" />
  <text class="frame-label" x="260" y="28">EKS (移行前)</text>
  <rect class="managed" x="18" y="40" width="136" height="322" rx="8" />
  <text class="managed-label" x="86" y="190">Control Plane</text>
  <text class="managed-sub" x="86" y="212">AWS が管理</text>
  <rect class="frame" x="162" y="40" width="342" height="322" rx="8" />
  <text class="dp-label" x="333" y="62">Data Plane (全部 Fargate)</text>
  <rect class="profile" x="172" y="78" width="100" height="122" rx="6" />
  <text class="profile-label" x="222" y="95">アプリ A × stg</text>
  <rect class="pod" x="186" y="112" width="72" height="40" rx="5" />
  <text class="pod-label" x="222" y="132">Pod</text>
  <rect class="sidecar" x="186" y="160" width="72" height="26" rx="4" />
  <text class="sidecar-label" x="222" y="173">監視</text>
  <rect class="profile" x="284" y="78" width="100" height="122" rx="6" />
  <text class="profile-label" x="334" y="95">アプリ A × prod</text>
  <rect class="pod" x="298" y="112" width="72" height="40" rx="5" />
  <text class="pod-label" x="334" y="132">Pod</text>
  <rect class="sidecar" x="298" y="160" width="72" height="26" rx="4" />
  <text class="sidecar-label" x="334" y="173">監視</text>
  <rect class="profile" x="396" y="78" width="100" height="122" rx="6" />
  <text class="profile-label" x="446" y="95">アプリ B × stg</text>
  <rect class="pod" x="410" y="112" width="72" height="40" rx="5" />
  <text class="pod-label" x="446" y="132">Pod</text>
  <rect class="sidecar" x="410" y="160" width="72" height="26" rx="4" />
  <text class="sidecar-label" x="446" y="173">監視</text>
  <rect class="profile" x="172" y="214" width="100" height="122" rx="6" />
  <text class="profile-label" x="222" y="231">アプリ B × prod</text>
  <rect class="pod" x="186" y="248" width="72" height="40" rx="5" />
  <text class="pod-label" x="222" y="268">Pod</text>
  <rect class="sidecar" x="186" y="296" width="72" height="26" rx="4" />
  <text class="sidecar-label" x="222" y="309">監視</text>
  <rect class="profile" x="284" y="214" width="100" height="122" rx="6" />
  <text class="profile-label" x="334" y="231">アプリ C × stg</text>
  <rect class="pod" x="298" y="248" width="72" height="40" rx="5" />
  <text class="pod-label" x="334" y="268">Pod</text>
  <rect class="sidecar" x="298" y="296" width="72" height="26" rx="4" />
  <text class="sidecar-label" x="334" y="309">監視</text>
  <rect class="profile" x="396" y="214" width="100" height="122" rx="6" />
  <text class="profile-label" x="446" y="231">アプリ C × prod</text>
  <rect class="pod" x="410" y="248" width="72" height="40" rx="5" />
  <text class="pod-label" x="446" y="268">Pod</text>
  <rect class="sidecar" x="410" y="296" width="72" height="26" rx="4" />
  <text class="sidecar-label" x="446" y="309">監視</text>
  <text class="legend" x="333" y="354">アプリ × 環境ごとに Fargate プロファイルが増えた</text>
</svg>

<dl class="issues">
  <div v-click><dt>スケールアウトが遅い</dt><dd>Pod を増やすたびに VM の用意から始まる</dd></div>
  <div v-click><dt>パフォーマンスが安定しない</dt><dd>CPU の種類を選べず、当たる CPU で性能が揺れる</dd></div>
  <div v-click><dt>設定の制約が多い</dt><dd>DaemonSet が使えず、ログや監視が Fargate 用の作りになる (監視はサイドカー)</dd></div>
  <div v-click><dt>バージョンアップの手間</dt><dd>アドオンを上げたうえで、全部の Pod を作り直す<br><small>コストは今以下に抑えるのが条件。下がるのはおまけ</small></dd></div>
</dl>

</div>

<style>
.before {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1.5rem;
  align-items: center;
}

.before-arch { display: block; width: 100%; color: var(--theme-text); }
.before-arch .frame { fill: none; stroke: currentColor; stroke-width: 2; }
.before-arch .frame-label { fill: currentColor; font-size: 16px; font-weight: 700; text-anchor: middle; }
.before-arch .managed { fill: var(--theme-gray-100); stroke: var(--theme-gray-500); stroke-dasharray: 6 4; }
.before-arch .managed-label { fill: var(--theme-muted); font-size: 14px; font-weight: 700; text-anchor: middle; }
.before-arch .managed-sub { fill: var(--theme-gray-700); font-size: 13px; font-weight: 700; text-anchor: middle; }
.before-arch .dp-label { fill: currentColor; font-size: 14px; font-weight: 700; text-anchor: middle; }
/* Fargate プロファイル。Pod は Pod ごとの VM なので点線の箱で描く */
.before-arch .profile { fill: #fff; stroke: var(--theme-navy); stroke-width: 1.5; stroke-dasharray: 5 3; }
.before-arch .profile-label { fill: var(--theme-navy); font-size: 11px; font-weight: 700; text-anchor: middle; }
.before-arch .pod { fill: var(--theme-red); }
.before-arch .pod-label { fill: #fff; font-size: 13px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.before-arch .sidecar { fill: var(--theme-gray-100); stroke: var(--theme-gray-500); }
.before-arch .sidecar-label { fill: var(--theme-gray-700); font-size: 11px; text-anchor: middle; dominant-baseline: central; }
.before-arch .legend { fill: var(--theme-muted); font-size: 11px; text-anchor: middle; }

.issues { margin: 0; font-size: var(--theme-font-size-body); }
.issues dt { color: var(--theme-red); font-weight: 700; }
.issues dd { margin: 0 0 0.6rem; }
.issues small { display: block; margin-top: 0.25rem; color: var(--theme-muted); font-size: var(--theme-font-size-caption); }
</style>

---
title: 設定の制約 (Fargate 用の作りのつらさ)
---

Kubernetes の標準のやり方が使えず、*Fargate のためだけの作り*を覚えて保つことになる

<div class="pain-grid">
  <div class="pain">
    <p class="pain-title">Fargate プロファイルの管理</p>
    <ul>
      <li>動かす Pod を書いておく。合わない Pod は Pending のまま</li>
      <li>アプリ × 環境ごとに増え、上限を引き上げた</li>
      <li>作ったあとは変更できず、作り直す</li>
    </ul>
  </div>
  <div class="pain">
    <p class="pain-title">ログが Fargate 専用</p>
    <ul>
      <li>組み込みの Fluent Bit を、専用の ConfigMap で設定する</li>
      <li>書けるのは Filter・Output・Parser だけ。使えるプラグインも限られる</li>
      <li>設定の変更は、新しい Pod にしか効かない</li>
    </ul>
  </div>
  <div class="pain">
    <p class="pain-title">監視がサイドカー</p>
    <ul>
      <li>全部のアプリのマニフェストに書き足す</li>
      <li>Pod の数だけ動き、リソースと料金がかかる</li>
      <li>更新は、全部のアプリの入れ直し</li>
    </ul>
  </div>
  <div class="pain">
    <p class="pain-title">世の中の手順が使えない</p>
    <ul>
      <li>Helm チャートの多くは DaemonSet などが前提</li>
      <li>LB のターゲットは ip だけ、IMDS も使えない</li>
    </ul>
  </div>
</div>

<div v-click>

Auto Mode なら Node がある普通の構成になり、ログも監視も *DaemonSet の標準のやり方*に戻せる

</div>

<div class="refs">

参考: [Define which Pods use AWS Fargate when launched](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html) / [Start AWS Fargate logging for your cluster](https://docs.aws.amazon.com/eks/latest/userguide/fargate-logging.html)

</div>

<style>
.pain-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.72rem;
}

.pain {
  padding: 0.4rem 0.75rem;
  border-left: 4px solid var(--theme-red);
  background: var(--theme-gray-50);
}

.pain-title {
  margin: 0 0 0.2rem;
  color: var(--theme-red);
  font-weight: 700;
}

.pain ul {
  margin: 0;
  padding-left: 1.1rem;
}
</style>

---
title: バージョンアップはどう変わる?
# Appendix の標準のアドオンから戻ってくる
routeAlias: version-up
---

Auto Mode では、*Control Plane を上げたあとの作業*がなくなる

<div class="upgrade-grid">
  <div></div>
  <div class="col-head">① Control Plane<br><small>API サーバーなど</small></div>
  <div class="col-head">② <Link to="std-addons">標準のアドオン</Link><br><small>CoreDNS など</small></div>
  <div class="col-head">③ Data Plane<br><small>Pod が動く場所</small></div>
  <div class="col-head">④ 自分で入れたアドオン<br><small>Argo CD・LB Controller など</small></div>

  <div class="row-head">Fargate<br><small>移行前</small></div>
  <div class="cell is-self">自分で上げる</div>
  <div class="cell is-self">互換を確かめて<br>自分で上げる</div>
  <div class="cell is-self">全部の Pod を<br>自分で作り直す</div>
  <div class="cell is-self">自分で上げる</div>

  <div class="row-head is-hl">Auto Mode</div>
  <div class="cell is-self">自分で上げる</div>
  <div class="cell is-aws">AWS が上げる</div>
  <div class="cell is-aws">AWS が Node を<br>順に入れ替える</div>
  <div class="cell is-self">自分で上げる</div>
</div>

<div class="legend"><span class="chip is-self">自分でやる</span><span class="chip is-aws">AWS がやる</span><span class="legend-note">違うのは ② と ③ だけ</span></div>

- Fargate の Pod は、起動したときの kubelet のバージョンのまま動く。新しくするには作り直すしかない
- LB Controller は、Auto Mode の組み込みの LB に移せば ② になる。ただし、今ある ALB はそのまま引き継げない

<div class="refs">

参考: [Understand the Kubernetes version lifecycle on EKS](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html) / [Automate cluster infrastructure with EKS Auto Mode](https://docs.aws.amazon.com/eks/latest/userguide/automode.html)

</div>

<style>
.upgrade-grid {
  display: grid;
  grid-template-columns: 5.5rem repeat(4, 1fr);
  gap: 0.4rem;
  font-size: 0.75rem;
  text-align: center;
}

.col-head {
  align-self: end;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid var(--theme-gray-300);
  font-weight: 700;
}

.col-head small,
.row-head small {
  color: var(--theme-muted);
  font-size: var(--theme-font-size-caption);
  font-weight: 400;
}

.row-head {
  align-self: center;
  font-weight: 700;
  text-align: left;
}

.row-head.is-hl {
  color: var(--theme-red);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.3rem;
  border-radius: var(--theme-radius-md);
  line-height: 1.4;
}

/* 自分でやる作業は濃い色、AWS がやる作業は点線のグレーにして、手の離れる所を見比べる */
.cell.is-self {
  background: var(--theme-navy);
  color: #fff;
}

.cell.is-aws {
  border: 2px dashed var(--theme-red);
  background: var(--theme-red-50);
  color: var(--theme-red);
  font-weight: 700;
}

.legend {
  display: flex;
  gap: 0.75rem;
  margin: 0.6rem 0 0.4rem;
  font-size: var(--theme-font-size-caption);
}

.chip {
  padding: 0.1rem 0.6rem;
  border-radius: var(--theme-radius-pill);
}

.chip.is-self {
  background: var(--theme-navy);
  color: #fff;
}

.chip.is-aws {
  border: 1px dashed var(--theme-red);
  background: var(--theme-red-50);
  color: var(--theme-red);
}

.legend-note {
  color: var(--theme-muted);
}
</style>

---
title: Node の入れ替えで Pod はどう動く?
---

Auto Mode でも Pod は作り直される。ただし*追い出しは、消してから作る*

<svg class="evict-fig" viewBox="0 0 760 300" role="img" aria-label="デプロイは新しい Pod を作ってから古い Pod を消す。Node の入れ替えは古い Pod を消してから新しい Pod を作るので、レプリカが 1 つだと動く Pod が 0 個の時間ができる。レプリカ 2 と PDB があれば 1 つずつ入れ替わり、常に 1 つは動いている">
  <text class="row-label" x="0" y="52">デプロイ</text>
  <text class="row-sub" x="0" y="72">作ってから消す</text>
  <rect class="bar is-old" x="200" y="26" width="300" height="22" rx="4" />
  <rect class="bar is-start" x="380" y="54" width="80" height="22" rx="4" />
  <rect class="bar is-new" x="460" y="54" width="290" height="22" rx="4" />

  <rect class="gap" x="350" y="112" width="100" height="44" rx="4" />
  <text class="row-label" x="0" y="134">Node の入れ替え</text>
  <text class="row-sub" x="0" y="154">レプリカ 1</text>
  <rect class="bar is-old" x="200" y="123" width="150" height="22" rx="4" />
  <rect class="bar is-start" x="350" y="123" width="100" height="22" rx="4" />
  <rect class="bar is-new" x="450" y="123" width="300" height="22" rx="4" />
  <text class="gap-label" x="400" y="176">動く Pod が 0 個</text>

  <text class="row-label" x="0" y="222">Node の入れ替え</text>
  <text class="row-sub" x="0" y="242">レプリカ 2 + PDB</text>
  <rect class="bar is-old" x="200" y="200" width="150" height="22" rx="4" />
  <rect class="bar is-start" x="350" y="200" width="100" height="22" rx="4" />
  <rect class="bar is-new" x="450" y="200" width="300" height="22" rx="4" />
  <rect class="bar is-old" x="200" y="228" width="280" height="22" rx="4" />
  <rect class="bar is-start" x="480" y="228" width="100" height="22" rx="4" />
  <rect class="bar is-new" x="580" y="228" width="170" height="22" rx="4" />

  <line class="axis" x1="200" y1="276" x2="750" y2="276" />
  <text class="axis-label" x="750" y="296">時間 →</text>
</svg>

<div class="legend"><span class="chip is-old">古い Pod</span><span class="chip is-start">起動中</span><span class="chip is-new">新しい Pod</span></div>

- デプロイは新しい Pod の Ready を待ってから古い Pod を消す。追い出しは古い Pod を先に消す
- PDB があれば、2 つ目は 1 つ目の新しい Pod が Ready になるまで追い出されない

<div class="refs">

参考: [API-initiated Eviction](https://kubernetes.io/docs/concepts/scheduling-eviction/api-eviction/) / [Karpenter: Disruption](https://karpenter.sh/docs/concepts/disruption/)

</div>

<style>
.evict-fig { display: block; width: 68%; margin: -0.5rem auto 0; color: var(--theme-text); }
.evict-fig .row-label { fill: currentColor; font-size: 15px; font-weight: 700; }
.evict-fig .row-sub { fill: var(--theme-muted); font-size: 13px; }
.evict-fig .bar.is-old { fill: var(--theme-gray-700); }
.evict-fig .bar.is-new { fill: var(--theme-red); }
/* 起動中はまだリクエストを受けられないので、点線の枠だけにする */
.evict-fig .bar.is-start { fill: #fff; stroke: var(--theme-red); stroke-width: 2; stroke-dasharray: 5 3; }
.evict-fig .gap { fill: var(--theme-red-50); stroke: var(--theme-red); stroke-width: 2; stroke-dasharray: 6 4; }
.evict-fig .gap-label { fill: var(--theme-red); font-size: 14px; font-weight: 700; text-anchor: middle; }
.evict-fig .axis { stroke: var(--theme-gray-500); stroke-width: 1.5; }
.evict-fig .axis-label { fill: var(--theme-muted); font-size: 13px; text-anchor: end; }
.legend { display: flex; gap: 0.6rem; justify-content: center; margin: 0.2rem 0 0.4rem; font-size: var(--theme-font-size-caption); }
.legend .chip { padding: 0.1rem 0.6rem; border-radius: 999px; }
.legend .chip.is-old { background: var(--theme-gray-700); color: #fff; }
.legend .chip.is-start { border: 2px dashed var(--theme-red); color: var(--theme-red); }
.legend .chip.is-new { background: var(--theme-red); color: #fff; }
</style>

---
title: セキュリティの要件 (Pod の隔離)
# Appendix の NetworkPolicy から戻ってくる
routeAlias: pod-isolation
---

顧客のセキュリティチェックで、*不正アクセスされた Pod を隔離できること*を求められた

<div class="isolate">

<svg class="isolate-fig" viewBox="0 0 520 330" role="img" aria-label="怪しい Pod を消さずに NetworkPolicy で通信を全部止め、代わりの Pod を新しく作る">
  <defs>
    <marker id="iso-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>
  <rect class="frame" x="6" y="6" width="508" height="318" rx="12" />
  <text class="frame-label" x="22" y="32">Data Plane</text>
  <rect class="wall" x="36" y="88" width="196" height="132" rx="10" />
  <text class="wall-label" x="134" y="78">NetworkPolicy で通信を全部止める</text>
  <rect class="pod is-bad" x="74" y="122" width="120" height="64" rx="8" />
  <text class="pod-label" x="134" y="154">怪しい Pod</text>
  <text class="note" x="134" y="250">消さずに残して調べる</text>
  <rect class="pod" x="340" y="70" width="140" height="60" rx="8" />
  <text class="pod-label" x="410" y="100">ほかの Pod</text>
  <rect class="pod is-new" x="340" y="200" width="140" height="60" rx="8" />
  <text class="pod-label is-dark" x="410" y="230">代わりの Pod</text>
  <path class="line" d="M338,100 L236,140" marker-end="url(#iso-arrow)" />
  <text class="cross" x="286" y="121">✕</text>
  <path class="line" d="M236,170 L338,210" />
  <text class="cross" x="286" y="192">✕</text>
  <text class="note" x="410" y="290">新しく作って入れ替える</text>
</svg>

<dl class="isolate-notes">
  <div v-click><dt>AWS が勧める手順</dt><dd>Pod を消さずに、NetworkPolicy で通信を全部止めて切り離す。調べてから入れ替える</dd></div>
  <div v-click><dt>Fargate ではできない</dt><dd>VPC CNI の NetworkPolicy は EC2 の Node にだけ当てられ、Fargate には当てられない</dd></div>
  <div v-click><dt>Auto Mode ならできる</dt><dd>NetworkPolicy が最初から使える<br><small>ただし Node に SSH・SSM で入れないので、Node のメモリを取るような調査はしにくい</small></dd></div>
</dl>

<small class="np-link"><Link to="network-policy">NetworkPolicy とは →</Link></small>

</div>

<div class="refs">

参考: [Incident response and forensics](https://docs.aws.amazon.com/eks/latest/best-practices/incident-response-and-forensics.html) / [Limit Pod traffic with Kubernetes network policies](https://docs.aws.amazon.com/eks/latest/userguide/cni-network-policy.html)

</div>

<style>
.isolate { display: grid; grid-template-columns: 1.1fr 1fr; gap: 1.5rem; align-items: center; }
.isolate-fig { display: block; width: 100%; color: var(--theme-text); }
.isolate-fig .frame { fill: none; stroke: currentColor; stroke-width: 2; }
.isolate-fig .frame-label { fill: currentColor; font-size: 15px; font-weight: 700; }
/* 通信を止める壁。赤の太い点線で囲む */
.isolate-fig .wall { fill: var(--theme-red-50); stroke: var(--theme-red); stroke-width: 3; stroke-dasharray: 8 5; }
.isolate-fig .wall-label { fill: var(--theme-red); font-size: 14px; font-weight: 700; text-anchor: middle; }
.isolate-fig .pod { fill: var(--theme-red); }
.isolate-fig .pod.is-bad { fill: var(--theme-gray-700); }
.isolate-fig .pod.is-new { fill: #fff; stroke: var(--theme-red); stroke-width: 2.5; stroke-dasharray: 6 4; }
.isolate-fig .pod-label { fill: #fff; font-size: 16px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.isolate-fig .pod-label.is-dark { fill: var(--theme-red); }
.isolate-fig .line { fill: none; stroke: var(--theme-gray-500); stroke-width: 2; stroke-dasharray: 6 4; }
.isolate-fig .cross { fill: var(--theme-red); font-size: 22px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.isolate-fig .note { fill: var(--theme-muted); font-size: 14px; text-anchor: middle; }
.np-link { display: block; font-size: var(--theme-font-size-caption); }
.isolate-notes { margin: 0; font-size: var(--theme-font-size-body); }
.isolate-notes dt { color: var(--theme-red); font-weight: 700; }
.isolate-notes dd { margin: 0 0 0.6rem; }
.isolate-notes small { display: block; margin-top: 0.25rem; color: var(--theme-muted); font-size: var(--theme-font-size-caption); }
</style>

---
title: Auto Mode で手放すもの
---

「基盤は AWS 管理」は Auto Mode でも言える。ただし *Pod の分け方*が変わる

<div class="tradeoff-table">

| | Fargate (移行前) | EKS Auto Mode |
| --- | --- | --- |
| 基盤 (Node の OS・パッチ) の管理 | AWS | AWS (変わらない) |
| Pod 同士の分け方 | Pod ごとに VM (カーネルも別) | 同じ Node の Pod はカーネルを共有する |
| Pod ごとのセキュリティグループ | 付けられる | 付けられない |
| 事故のときの Pod の隔離 (NetworkPolicy) | できない | できる |

</div>

<div v-click>

カーネルでの分離を手放し、*NetworkPolicy での隔離*を取った。分けたいワークロードは NodePool で Node ごと分ける

</div>

<div class="refs">

参考: [Automate cluster infrastructure with EKS Auto Mode](https://docs.aws.amazon.com/eks/latest/userguide/automode.html) / [Manage compute resources by using nodes](https://docs.aws.amazon.com/eks/latest/userguide/eks-compute.html)

</div>

<style>
.tradeoff-table {
  font-size: 0.8em;
}

.tradeoff-table td:first-child {
  white-space: nowrap;
}

.tradeoff-table td:last-child,
.tradeoff-table th:last-child {
  background: var(--theme-red-50);
}
</style>

---
title: 分けたい Pod は Node ごと分ける
# Appendix の taint とは から戻ってくる
routeAlias: node-split
---

同じ Node の Pod はカーネルを共有する。Node に抜け出されると、*隣の Pod にも届く*

<div class="split">

<svg class="split-fig" viewBox="0 0 560 270" role="img" aria-label="分けないと、乗っ取られた Pod から隣の Pod の Secret に届く。NodePool で Node を分けると、抜け出されても同じ Node に盗めるものがない">
  <defs>
    <marker id="split-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>
  <text class="col-label" x="130" y="22">分けない</text>
  <rect class="node" x="10" y="40" width="240" height="190" rx="10" />
  <text class="node-label" x="24" y="62">Node</text>
  <rect class="pod is-bad" x="30" y="80" width="200" height="50" rx="8" />
  <text class="pod-label" x="130" y="105">外から来たファイルを開く Pod</text>
  <rect class="pod" x="30" y="160" width="200" height="50" rx="8" />
  <text class="pod-label" x="130" y="185">Secret を持つ Pod</text>
  <path class="attack" d="M130,132 L130,156" marker-end="url(#split-arrow)" />
  <text class="note is-bad" x="130" y="255">隣の Pod の Secret に届く</text>

  <text class="col-label" x="430" y="22">NodePool で分ける</text>
  <rect class="node" x="300" y="40" width="250" height="82" rx="10" />
  <text class="node-label" x="314" y="60">Node (sandbox)</text>
  <rect class="pod is-bad" x="320" y="66" width="210" height="46" rx="8" />
  <text class="pod-label" x="425" y="89">外から来たファイルを開く Pod</text>
  <rect class="node" x="300" y="148" width="250" height="82" rx="10" />
  <text class="node-label" x="314" y="168">Node (general-purpose)</text>
  <rect class="pod" x="320" y="174" width="210" height="46" rx="8" />
  <text class="pod-label" x="425" y="197">Secret を持つ Pod</text>
  <text class="cross" x="425" y="135">✕</text>
  <text class="note" x="425" y="255">抜け出されても、盗めるものがない</text>
</svg>

<dl class="split-notes">
  <div v-click><dt>Fargate</dt><dd>最初から Pod ごとに VM が分かれている。分けないという選択肢はない</dd></div>
  <div v-click><dt>Auto Mode</dt><dd>最初は同じ Node に混ざる。分けたい Pod だけを選び、NodePool と taint で Node ごと分ける<br><small>通信は NetworkPolicy で絞る</small></dd></div>
</dl>

</div>

<small class="split-link"><Link to="taint">taint とは →</Link></small>

<div class="refs">

参考: [Create a Node Pool for EKS Auto Mode](https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html) / [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)

</div>

<style>
.split { display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.5rem; align-items: center; }
.split-fig { display: block; width: 100%; color: var(--theme-text); }
.split-fig .col-label { fill: currentColor; font-size: 15px; font-weight: 700; text-anchor: middle; }
.split-fig .node { fill: var(--theme-gray-50); stroke: currentColor; stroke-width: 2; }
.split-fig .node-label { fill: currentColor; font-size: 12px; font-weight: 700; }
.split-fig .pod { fill: var(--theme-red); }
.split-fig .pod.is-bad { fill: var(--theme-gray-700); }
.split-fig .pod-label { fill: #fff; font-size: 12px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
/* 抜け出した攻撃の向き。赤の太線 */
.split-fig .attack { fill: none; stroke: var(--theme-red); stroke-width: 3; }
.split-fig .cross { fill: var(--theme-red); font-size: 22px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.split-fig .note { fill: var(--theme-muted); font-size: 13px; text-anchor: middle; }
.split-fig .note.is-bad { fill: var(--theme-red); font-weight: 700; }
.split-notes { margin: 0; }
.split-notes dt { color: var(--theme-red); font-weight: 700; }
.split-notes dd { margin: 0 0 0.6rem; }
.split-notes small { display: block; margin-top: 0.25rem; color: var(--theme-muted); font-size: var(--theme-font-size-caption); }
.split-link { display: block; font-size: var(--theme-font-size-caption); }
</style>

---
title: Data Plane をどう選んだか
# Appendix の VM の違いから戻ってくる
routeAlias: choose-dp
---

Fargate の「Node の管理を AWS に任せられる」良さは残したまま、困っていたことをなくしたい

<div class="choose-table">

| | セルフマネージド・<br>マネージドノードグループ | Karpenter<br>(自分で導入) | Fargate<br>(移行前) | *EKS Auto Mode* |
| --- | :---: | :---: | :---: | :---: |
| Node の管理を AWS に任せる | × | △ | ○ | ○ |
| スケールアウトが速い | △ | ○ | × | ○ |
| パフォーマンスが安定する | ○ | ○ | × | ○ |
| 設定の制約が少ない (DaemonSet など) | ○ | ○ | × | ○ |
| バージョンアップの手間が少ない | × | △ | × | ○ |
| Pod を隔離できる (NetworkPolicy) | ○ | ○ | × | ○ |

</div>

<div v-click>

全部を満たすのが *EKS Auto Mode*。コストは今以下に抑えるのが条件で、下がるのはおまけ

<small class="choose-link"><Link to="vm-diff">Fargate のスケールアウトとパフォーマンスが × の理由 →</Link></small>

</div>

<style>
.choose-link {
  display: block;
  margin-top: 0.25rem;
  font-size: var(--theme-font-size-caption);
}

.choose-table {
  font-size: 0.66em;
}

.choose-table td:first-child {
  white-space: nowrap;
}

/* 選んだ Auto Mode の列を目立たせる */
.choose-table td:last-child,
.choose-table th:last-child {
  background: var(--theme-red-50);
  font-weight: 700;
}
</style>

---
title: Auto Mode で解消されるもの・されないもの
---

<div class="solve">
  <div class="solve-col">
    <p class="solve-head is-yes">解消される</p>
    <ul>
      <li><b>スケールアウト</b>: Node に空きがあればすぐ起動する</li>
      <li><b>パフォーマンス</b>: インスタンスタイプを選べる</li>
      <li><b>設定の制約</b>: プロファイル不要。DaemonSet・EBS・Spot・Arm が使える</li>
      <li><b>バージョンアップ</b>: Node と標準のアドオンは AWS が入れ替える</li>
      <li><b>Pod の隔離</b>: NetworkPolicy で隔離できる</li>
      <li><b>サイズの切り上げ</b>: Node に詰めるのでなくなる</li>
    </ul>
  </div>
  <div class="solve-col">
    <p class="solve-head is-no">解消されない</p>
    <ul>
      <li><b>バージョンアップの開始</b>: 古い API への対応も含めて自分</li>
      <li><b>自分で入れたアドオン</b>: Argo CD などは自分で上げる</li>
      <li><b>requests / limits</b>: Node に詰めるので、むしろ前より大事</li>
      <li><b>アプリのセキュリティ</b>: イメージの脆弱性・IAM・アプリは自分</li>
    </ul>
  </div>
</div>

<style>
.solve {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 1.25rem;
  font-size: 0.78rem;
}

.solve-col ul {
  margin: 0;
  padding-left: 1.1rem;
}

.solve-col li {
  margin-bottom: 0.35rem;
}

.solve-head {
  margin: 0 0 0.5rem;
  padding: 0.3rem 0.75rem;
  border-radius: var(--theme-radius-sm);
  font-weight: 700;
}

.solve-head.is-yes {
  background: var(--theme-red);
  color: #fff;
}

.solve-head.is-no {
  background: var(--theme-gray-100);
  color: var(--theme-text);
}
</style>
