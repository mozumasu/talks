---
layout: section
title: '01'
toc: EKS Auto Mode とは
---

# EKS Auto Mode とは

---
title: Kubernetes の全体像
# 次の EKS の図と見比べるため、図の位置を動かさない
transition: none
---

Kubernetes は *Control Plane* と *Data Plane* でできている

<K8sArch :step="13">
  <a class="talk-card" href="https://talks.mozumasu.com/kubernetes-intro/" target="_blank" rel="noopener">
    <img :src="$asset('kubernetes-intro-cover.png')" alt="Kubernetesに爆速で入門したい! の表紙">
    <span>全体像はこちらで詳しく話しました →</span>
  </a>
</K8sArch>

---
title: EKS だと何が変わる?
---

*Control Plane* を AWS が管理してくれる

<K8sArch :step="13" eks>
  <dl>
    <div v-click><dt>Control Plane</dt><dd>AWS が管理する。中身は見えない<br><small>冗長化 (複数 AZ) やバージョンアップの作業も AWS 任せ</small></dd></div>
    <div v-click><dt>Data Plane</dt><dd>Node をどう用意するかは選べる<br><small>どこまで AWS に任せるかは選択肢しだい</small></dd></div>
  </dl>
</K8sArch>

---
title: バージョンを上げるのは自分
---

Control Plane を AWS が管理していても、*Kubernetes のバージョンを上げるのは自分*

<div class="cp-table">

| | 誰がやる |
| --- | --- |
| Control Plane のサーバーの運用 (冗長化・故障の対応) | AWS が自動で |
| 同じバージョンの中のセキュリティの修正 | AWS が自動で |
| Kubernetes のバージョンを上げる (1.34 → 1.35 など) | *自分で始める* |

</div>

<div v-click>

新しいバージョンでは古い API がなくなることがあり、勝手に上げるとアプリが動かなくなるおそれがあるため

</div>

<div v-click class="lifecycle">
  <div class="phase">標準サポート<br><small>14 か月</small></div>
  <div class="phase is-ext">延長サポート (追加料金)<br><small>12 か月</small></div>
  <div class="phase is-auto">過ぎると Control Plane だけ<br>AWS が自動で上げる</div>
</div>

<div class="refs">

参考: [Understand the Kubernetes version lifecycle on EKS](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html)

</div>

<style>
.cp-table {
  font-size: 0.85em;
}

.lifecycle {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.6fr;
  margin-top: 0.75rem;
  font-size: var(--theme-font-size-body);
  text-align: center;
}

.lifecycle .phase {
  padding: 0.4rem 0.5rem;
  background: var(--theme-gray-50);
  border-right: 2px solid #fff;
}

.lifecycle .phase.is-ext {
  background: var(--theme-gray-100);
}

.lifecycle .phase.is-auto {
  background: var(--theme-red-50);
  color: var(--theme-red);
  font-weight: 700;
}

.lifecycle small {
  color: var(--theme-muted);
  font-size: var(--theme-font-size-caption);
}
</style>

---
title: Data Plane の選択肢
# Appendix の表から戻ってくる
routeAlias: dp-options
---

Node をどう用意して、どこまで AWS に任せるか

<svg class="dp-spectrum" viewBox="0 0 900 250" role="img" aria-label="自分で管理から AWS に任せるまで、セルフマネージド、マネージドノードグループ、Karpenter、EKS Auto Mode、Fargate の順に並ぶ">
  <defs>
    <marker id="dp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>
  <text class="end-label" x="22" y="36">自分で管理</text>
  <text class="end-label is-right" x="878" y="36">AWS に任せる</text>
  <path class="bar" d="M24,62 H876" marker-start="url(#dp-arrow)" marker-end="url(#dp-arrow)" />
  <circle class="dot" cx="100" cy="62" r="7" />
  <rect class="card" x="22" y="88" width="156" height="150" rx="10" />
  <text class="card-title" x="100" y="118">セルフマネージド</text>
  <rect class="ec2" x="40" y="150" width="120" height="36" rx="4" />
  <rect class="pod" x="50" y="159" width="28" height="18" rx="3" />
  <rect class="pod" x="85" y="159" width="28" height="18" rx="3" />
  <rect class="pod" x="120" y="159" width="28" height="18" rx="3" />
  <text class="card-sub" x="100" y="206">EC2</text>
  <text class="card-mgmt" x="100" y="228">全部自分</text>
  <circle class="dot" cx="275" cy="62" r="7" />
  <rect class="card" x="197" y="88" width="156" height="150" rx="10" />
  <text class="card-title" x="275" y="108">マネージド</text>
  <text class="card-title" x="275" y="128">ノードグループ</text>
  <rect class="ec2" x="215" y="150" width="120" height="36" rx="4" />
  <rect class="pod" x="225" y="159" width="28" height="18" rx="3" />
  <rect class="pod" x="260" y="159" width="28" height="18" rx="3" />
  <rect class="pod" x="295" y="159" width="28" height="18" rx="3" />
  <text class="card-sub" x="275" y="206">EC2</text>
  <text class="card-mgmt" x="275" y="228">更新の手順は AWS</text>
  <circle class="dot" cx="450" cy="62" r="7" />
  <rect class="card" x="372" y="88" width="156" height="150" rx="10" />
  <text class="card-title" x="450" y="118">Karpenter</text>
  <rect class="ec2" x="390" y="150" width="120" height="36" rx="4" />
  <rect class="pod" x="400" y="159" width="28" height="18" rx="3" />
  <rect class="pod" x="435" y="159" width="28" height="18" rx="3" />
  <rect class="pod" x="470" y="159" width="28" height="18" rx="3" />
  <text class="card-sub" x="450" y="206">EC2</text>
  <text class="card-mgmt" x="450" y="228">台数の増減は自動</text>
  <circle class="dot is-hl" cx="625" cy="62" r="7" />
  <rect class="card is-hl" x="547" y="88" width="156" height="150" rx="10" />
  <text class="card-title is-hl" x="625" y="118">EKS Auto Mode</text>
  <rect class="ec2" x="565" y="150" width="120" height="36" rx="4" />
  <rect class="pod" x="575" y="159" width="28" height="18" rx="3" />
  <rect class="pod" x="610" y="159" width="28" height="18" rx="3" />
  <rect class="pod" x="645" y="159" width="28" height="18" rx="3" />
  <text class="card-sub" x="625" y="206">EC2</text>
  <text class="card-mgmt is-hl" x="625" y="228">ほぼ AWS</text>
  <circle class="dot" cx="800" cy="62" r="7" />
  <rect class="card" x="722" y="88" width="156" height="150" rx="10" />
  <text class="card-title" x="800" y="118">Fargate</text>
  <rect class="vm" x="736" y="150" width="38" height="36" rx="4" />
  <rect class="pod" x="743" y="159" width="24" height="18" rx="3" />
  <rect class="vm" x="780" y="150" width="38" height="36" rx="4" />
  <rect class="pod" x="787" y="159" width="24" height="18" rx="3" />
  <rect class="vm" x="824" y="150" width="38" height="36" rx="4" />
  <rect class="pod" x="831" y="159" width="24" height="18" rx="3" />
  <text class="card-sub" x="800" y="206">Pod ごとの VM</text>
  <text class="card-mgmt" x="800" y="228">Node を意識しない</text>
</svg>

<small class="dp-note">EC2 の箱 = 1 台に Pod を詰める / 点線の箱 = Pod ごとの VM。ほかに、オンプレミスなどのマシンを Node にする Hybrid Nodes もある。<Link to="dp-table">表で比べる →</Link></small>

<div class="refs">

参考: [Manage compute resources by using nodes](https://docs.aws.amazon.com/eks/latest/userguide/eks-compute.html) / [Karpenter](https://karpenter.sh/)

</div>

<style>
.dp-spectrum { display: block; width: 100%; margin-top: 0.5rem; color: var(--theme-text); }
.dp-spectrum .end-label { fill: var(--theme-muted); font-size: 15px; font-weight: 700; }
.dp-spectrum .end-label.is-right { text-anchor: end; }
.dp-spectrum .bar { fill: none; stroke: var(--theme-gray-300); stroke-width: 3; }
.dp-spectrum .dot { fill: var(--theme-navy); }
.dp-spectrum .dot.is-hl { fill: var(--theme-red); }
.dp-spectrum .card { fill: #fff; stroke: var(--theme-gray-300); stroke-width: 2; }
.dp-spectrum .card.is-hl { stroke: var(--theme-red); stroke-width: 3; }
.dp-spectrum .card-title { fill: currentColor; font-size: 15px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.dp-spectrum .card-title.is-hl, .dp-spectrum .card-mgmt.is-hl { fill: var(--theme-red); }
.dp-spectrum .ec2 { fill: #fff; stroke: currentColor; stroke-width: 1.5; }
/* Fargate は Pod ごとの VM なので、点線の小さな箱で描く */
.dp-spectrum .vm { fill: #fff; stroke: var(--theme-navy); stroke-width: 1.5; stroke-dasharray: 4 3; }
.dp-spectrum .pod { fill: var(--theme-red); }
.dp-spectrum .card-sub { fill: var(--theme-muted); font-size: 13px; text-anchor: middle; }
.dp-spectrum .card-mgmt { fill: currentColor; font-size: 13px; font-weight: 700; text-anchor: middle; }
.dp-note { display: block; margin-top: 0.5rem; color: var(--theme-muted); font-size: var(--theme-font-size-caption); }
</style>
---
title: Fargate とは
# Appendix の用語集から戻ってくる
routeAlias: fargate
---

Pod 1 つごとに、AWS が専用の小さな VM を用意してくれる

<svg class="fg" viewBox="0 0 900 200" role="img" aria-label="EC2 の Node は 1 台に Pod を詰め込むが、Fargate は Pod ごとに AWS が VM を用意する">
  <rect class="area" x="0" y="0" width="420" height="200" rx="12" />
  <text class="area-label" x="16" y="26">比べると: EC2 を Node にする場合</text>
  <rect class="node" x="30" y="45" width="360" height="120" rx="10" />
  <rect class="box" x="45" y="58" width="330" height="30" rx="4" />
  <text class="box-label is-small" x="210" y="73">kubelet・OS (更新は自分で)</text>
  <rect class="box is-pod" x="45" y="100" width="95" height="50" rx="6" />
  <text class="box-label" x="92.5" y="125">Pod</text>
  <rect class="box is-pod" x="162" y="100" width="95" height="50" rx="6" />
  <text class="box-label" x="209.5" y="125">Pod</text>
  <rect class="box is-pod" x="279" y="100" width="95" height="50" rx="6" />
  <text class="box-label" x="326.5" y="125">Pod</text>
  <text class="sub-label" x="210" y="188">Node = 自分の EC2 1 台。Pod を詰め込む</text>
  <rect class="area" x="480" y="0" width="420" height="200" rx="12" />
  <text class="area-label is-hl" x="496" y="26">Fargate の場合</text>
  <rect class="managed" x="497" y="40" width="388" height="126" rx="10" />
  <text class="managed-label" x="878" y="57">AWS が管理</text>
  <rect class="vm" x="510" y="65" width="115" height="95" rx="8" />
  <rect class="box" x="518" y="72" width="99" height="22" rx="4" />
  <text class="box-label is-small" x="567.5" y="83">kubelet</text>
  <rect class="box is-pod" x="527" y="102" width="81" height="48" rx="6" />
  <text class="box-label" x="567.5" y="126">Pod</text>
  <rect class="vm" x="637" y="65" width="115" height="95" rx="8" />
  <rect class="box" x="645" y="72" width="99" height="22" rx="4" />
  <text class="box-label is-small" x="694.5" y="83">kubelet</text>
  <rect class="box is-pod" x="654" y="102" width="81" height="48" rx="6" />
  <text class="box-label" x="694.5" y="126">Pod</text>
  <rect class="vm" x="764" y="65" width="115" height="95" rx="8" />
  <rect class="box" x="772" y="72" width="99" height="22" rx="4" />
  <text class="box-label is-small" x="821.5" y="83">kubelet</text>
  <rect class="box is-pod" x="781" y="102" width="81" height="48" rx="6" />
  <text class="box-label" x="821.5" y="126">Pod</text>
  <text class="sub-label" x="690" y="188">Node = Pod ごとの VM。AWS 側にあり、EC2 の一覧には出ない</text>
</svg>

<div class="fg-notes">
  <div v-click><dt>うれしい</dt><dd>Node の OS 更新・台数の調整がいらない<br>Pod ごとに VM で分かれていて安全</dd></div>
  <div v-click><dt>できない</dt><dd>DaemonSet・EBS・GPU・特権コンテナ<br>Spot・Arm (Graviton)<br><Link to="fargate-terms" class="text-xs">用語の説明は Appendix へ →</Link></dd></div>
  <div v-click><dt>料金</dt><dd>Pod の vCPU・メモリで決まる<br><small>決まった組み合わせに切り上げ<br>(最小 0.25 vCPU / 0.5 GB)</small></dd></div>
</div>

<small class="fg-ecs">Fargate は ECS でも使える。今日は EKS で使う場合の話 (<Link to="ecs-vs-eks">ECS ではなく EKS にした理由 →</Link>)</small>

<div class="refs">

参考: [Simplify compute management with AWS Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html) / [Understand Fargate Pod configuration details](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html)

</div>

<style>
.fg {
  display: block;
  width: 100%;
  margin-top: 0.5rem;
  color: var(--theme-text);
}

.fg .area {
  fill: var(--theme-gray-50);
}

.fg .area-label {
  fill: var(--theme-muted);
  font-size: 15px;
  font-weight: 700;
}

.fg .area-label.is-hl {
  fill: var(--theme-red);
}

.fg .node {
  fill: #fff;
  stroke: currentColor;
  stroke-width: 2;
}

.fg .vm {
  fill: #fff;
  stroke: var(--theme-navy);
  stroke-width: 2;
}

.fg .managed {
  fill: none;
  stroke: var(--theme-red);
  stroke-width: 2.5;
  stroke-dasharray: 8 5;
}

.fg .managed-label {
  fill: var(--theme-red);
  font-size: 13px;
  font-weight: 700;
  text-anchor: end;
}

.fg .box {
  fill: var(--theme-indigo);
}

.fg .box.is-pod {
  fill: var(--theme-red);
}

.fg .box-label {
  fill: #fff;
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

.fg .box-label.is-small {
  font-size: 12px;
}

.fg .sub-label {
  fill: var(--theme-muted);
  font-size: 14px;
  text-anchor: middle;
}

.fg-notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
  font-size: var(--theme-font-size-body);
}

.fg-notes dt {
  color: var(--theme-red);
  font-weight: 700;
}

.fg-notes dd {
  margin: 0;
}

.fg-ecs {
  display: block;
  margin-top: 0.75rem;
  color: var(--theme-muted);
  font-size: var(--theme-font-size-caption);
}

.fg-notes small {
  display: block;
  margin-top: 0.25rem;
  color: var(--theme-muted);
  font-size: var(--theme-font-size-caption);
}
</style>

---
title: Fargate だと全体像はこうなる
---

Node の代わりに、*Pod ごとの VM* が並ぶ

<K8sArch :step="13" eks fargate>
  <dl>
    <div v-click><dt>1 Pod = 1 Node</dt><dd>Pod ごとに AWS が VM を用意する<br><small>VM は AWS 側にあって、自分からは見えない</small></dd></div>
    <div v-click><dt>VM の中も AWS</dt><dd>OS や kubelet の更新、台数の調整は AWS がやる</dd></div>
    <div v-click><dt>自分が扱うもの</dt><dd>Pod とマニフェスト<br><small>どの Pod を Fargate で動かすかは Fargate プロファイルで決める</small></dd></div>
  </dl>
</K8sArch>

---
title: EC2 の Node だと、Node が足りなくなる
---

kube-scheduler は*今ある Node から*置き場所を選ぶだけ。Node は増やさない

<svg class="short" viewBox="0 0 900 200" role="img" aria-label="2 台の Node の空きが足りず、新しい Pod がどこにも置けずに Pending のまま止まる">
  <rect class="node" x="20" y="30" width="260" height="140" rx="10" />
  <text class="node-label" x="36" y="54">Node 1 (空き 0.3 vCPU)</text>
  <rect class="box is-pod" x="40" y="72" width="105" height="76" rx="6" />
  <text class="box-label" x="92.5" y="110">Pod</text>
  <rect class="box is-pod" x="157" y="72" width="105" height="76" rx="6" />
  <text class="box-label" x="209.5" y="110">Pod</text>
  <rect class="node" x="310" y="30" width="260" height="140" rx="10" />
  <text class="node-label" x="326" y="54">Node 2 (空き 0.5 vCPU)</text>
  <rect class="box is-pod" x="330" y="72" width="105" height="76" rx="6" />
  <text class="box-label" x="382.5" y="110">Pod</text>
  <rect class="box is-pod" x="447" y="72" width="105" height="76" rx="6" />
  <text class="box-label" x="499.5" y="110">Pod</text>
  <rect class="box is-pending" x="650" y="62" width="200" height="76" rx="6" />
  <text class="box-label is-dark" x="750" y="90">新しい Pod</text>
  <text class="box-label is-dark is-small" x="750" y="116">requests 1 vCPU</text>
  <text class="cross" x="610" y="100">✕</text>
  <text class="sub-label" x="750" y="168">どこにも入らず Pending のまま</text>
</svg>

<dl class="short-notes">
  <div v-click><dt>Fargate では起きない</dt><dd>Pod ごとに AWS が VM を用意するので、Node が足りなくなることがない</dd></div>
  <div v-click><dt>EC2 の Node では起きる</dt><dd>HPA で Pod を増やしたとき、Node が落ちたときなど<br><small>誰かが Node を足さないと、Pod は動かない</small></dd></div>
</dl>

<style>
.short { display: block; width: 100%; margin-top: 0.5rem; color: var(--theme-text); }
.short .node { fill: #fff; stroke: currentColor; stroke-width: 2; }
.short .node-label { fill: currentColor; font-size: 14px; font-weight: 700; }
.short .box.is-pod { fill: var(--theme-red); }
/* 置き場所がない Pod は白抜きの赤い点線 */
.short .box.is-pending { fill: #fff; stroke: var(--theme-red); stroke-width: 2.5; stroke-dasharray: 6 4; }
.short .box-label { fill: #fff; font-size: 16px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.short .box-label.is-dark { fill: var(--theme-red); }
.short .box-label.is-small { font-size: 13px; font-weight: 400; }
.short .cross { fill: var(--theme-red); font-size: 30px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.short .sub-label { fill: var(--theme-muted); font-size: 14px; text-anchor: middle; }
.short-notes { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 0.5rem; }
.short-notes dt { color: var(--theme-red); font-weight: 700; }
.short-notes dd { margin: 0; }
.short-notes small { display: block; margin-top: 0.25rem; color: var(--theme-muted); font-size: var(--theme-font-size-caption); }
</style>

---
title: Karpenter とは
---

その足りない Node を足すのが Karpenter。置き場所がない Pod を見つけて、ちょうどいい EC2 を起動する

<svg class="kp" viewBox="0 0 900 210" role="img" aria-label="Karpenter が置き場所のない Pod を見つけ、Pod に合う EC2 を起動し、空いた Node を片付ける">
  <defs>
    <marker id="kp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>
  <rect class="area" x="0" y="0" width="220" height="210" rx="12" />
  <text class="area-label" x="16" y="26">置き場所がない Pod</text>
  <rect class="box is-pending" x="40" y="60" width="140" height="50" rx="6" />
  <text class="box-label is-dark" x="110" y="85">Pod (Pending)</text>
  <rect class="box is-pending" x="40" y="125" width="140" height="50" rx="6" />
  <text class="box-label is-dark" x="110" y="150">Pod (Pending)</text>
  <path class="line" d="M222,105 H318" marker-end="url(#kp-arrow)" />
  <text class="line-label" x="270" y="95">見つける</text>
  <rect class="box" x="320" y="75" width="170" height="60" rx="8" />
  <text class="box-label" x="405" y="105">Karpenter</text>
  <path class="line is-strong" d="M490,95 L578,70" marker-end="url(#kp-arrow)" />
  <text class="line-label is-strong" x="522" y="58">選んで起動</text>
  <path class="line is-dashed" d="M490,118 L578,165" marker-end="url(#kp-arrow)" />
  <text class="line-label" x="520" y="165">片付ける</text>
  <rect class="node" x="580" y="20" width="300" height="100" rx="10" />
  <text class="node-label" x="596" y="42">EC2 (Pod に合うサイズ)</text>
  <rect class="box is-pod" x="600" y="55" width="125" height="48" rx="6" />
  <text class="box-label" x="662.5" y="79">Pod</text>
  <rect class="box is-pod" x="740" y="55" width="125" height="48" rx="6" />
  <text class="box-label" x="802.5" y="79">Pod</text>
  <rect class="node is-gone" x="580" y="140" width="300" height="55" rx="10" />
  <text class="sub-label" x="730" y="172">空いた Node は消す・まとめる</text>
</svg>

<div class="kp-notes">
  <div v-click><dt>ちょうどいい</dt><dd>Node グループを介さず、Pod に合う EC2 を直接起動する</dd></div>
  <div v-click><dt>設定</dt><dd>NodePool に EC2 の条件を書く<br><small>AMI やサブネットは NodeClass (AWS なら EC2NodeClass) に書く</small></dd></div>
  <div v-click><dt>運用</dt><dd>Karpenter 自体は自分で入れて更新する<br><small>EKS Auto Mode では、この仕組みを AWS が動かしてくれる</small></dd></div>
</div>

<div class="refs">

参考: [Karpenter](https://karpenter.sh/docs/) / [Automate cluster infrastructure with EKS Auto Mode](https://docs.aws.amazon.com/eks/latest/userguide/automode.html)

</div>

<style>
.kp {
  display: block;
  width: 100%;
  margin-top: 0.5rem;
  color: var(--theme-text);
}

.kp .area {
  fill: var(--theme-gray-50);
}

.kp .area-label {
  fill: var(--theme-muted);
  font-size: 15px;
  font-weight: 700;
}

.kp .box {
  fill: var(--theme-indigo);
}

.kp .box.is-pod {
  fill: var(--theme-red);
}

/* まだ置き場所が決まっていない Pod は、赤の点線の枠だけで描く */
.kp .box.is-pending {
  fill: #fff;
  stroke: var(--theme-red);
  stroke-width: 2;
  stroke-dasharray: 6 4;
}

.kp .box-label {
  fill: #fff;
  font-size: 16px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

.kp .box-label.is-dark {
  fill: var(--theme-red);
  font-size: 14px;
}

.kp .node {
  fill: #fff;
  stroke: currentColor;
  stroke-width: 2;
}

.kp .node.is-gone {
  fill: var(--theme-gray-50);
  stroke: var(--theme-gray-500);
  stroke-dasharray: 6 4;
}

.kp .node-label {
  fill: currentColor;
  font-size: 14px;
  font-weight: 700;
}

.kp .sub-label {
  fill: var(--theme-muted);
  font-size: 14px;
  text-anchor: middle;
}

.kp .line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.kp .line.is-strong {
  stroke: var(--theme-red);
  stroke-width: 3;
}

.kp .line.is-dashed {
  stroke: var(--theme-gray-500);
  stroke-dasharray: 6 4;
}

.kp .line-label {
  fill: currentColor;
  font-size: 13px;
  text-anchor: middle;
}

.kp .line-label.is-strong {
  fill: var(--theme-red);
  font-weight: 700;
}

.kp-notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
  font-size: var(--theme-font-size-body);
}

.kp-notes dt {
  color: var(--theme-red);
  font-weight: 700;
}

.kp-notes dd {
  margin: 0;
}

.kp-notes small {
  display: block;
  margin-top: 0.25rem;
  color: var(--theme-muted);
  font-size: var(--theme-font-size-caption);
}
</style>

---
title: Karpenter は全体像のどこにいる?
---

Data Plane で動く Pod。*コントローラー*の仲間で、足りない Node を足してくれる

<K8sArch :step="13" eks karpenter>
  <dl>
    <div v-click><dt>見張る</dt><dd>kube-scheduler が置けなかった Pod (Pending) を見つける</dd></div>
    <div v-click><dt>起動する</dt><dd>AWS API で、Pod に合う EC2 を起動</dd></div>
    <div v-click><dt>参加する</dt><dd>起動した EC2 が、新しい Node としてクラスターに加わる<br><small>Karpenter 自身は、自分が作る Node ではなく Fargate などで動かす (Data Plane の上の箱)</small></dd></div>
  </dl>
</K8sArch>

---
title: EKS Auto Mode とは
---

Control Plane に加えて、*Node と標準のアドオン*も AWS が管理する

<K8sArch :step="13" eks automode>
  <dl>
    <div v-click><dt>Node</dt><dd>中身は EC2。作成・更新・台数の調整を AWS がやる<br><small>Bottlerocket ベースで、最長 21 日で新しい Node に入れ替わる</small></dd></div>
    <div v-click><dt>標準のアドオン</dt><dd>Pod のネットワーク・名前解決・Node の起動・EBS や ALB の作成をする部品が、最初から動く<br><small>VPC CNI・CoreDNS・Karpenter・EBS CSI ドライバー・Load Balancer Controller など</small></dd></div>
    <div v-click><dt>自分が扱うもの</dt><dd>Pod とマニフェスト<br><small>EC2 の条件は NodePool で変えられる</small></dd></div>
  </dl>
</K8sArch>

<div class="refs">

参考: [Automate cluster infrastructure with EKS Auto Mode](https://docs.aws.amazon.com/eks/latest/userguide/automode.html)

</div>
