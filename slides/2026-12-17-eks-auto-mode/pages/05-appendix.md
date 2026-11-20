---
layout: section
title: Appendix
toc: 'Appendix: Fargate でできないことの用語'
---

# Fargate でできないことの用語

---
title: Fargate でできないことの用語
# Fargate とは のスライドからリンクする
routeAlias: fargate-terms
---

<div class="terms">

| 用語 | どんなもの | Fargate だと |
| --- | --- | --- |
| *DaemonSet* | 全部の Node に Pod を 1 つずつ置く Kubernetes 標準の仕組み。ログ収集・監視・kube-proxy などに使う | 1 Pod = 1 Node なので使えない。サイドカーで代わりにする<br><Link to="daemonset-vs-sidecar" class="text-xs">使い分け →</Link> |
| *EBS* | EC2 に付けるディスク (Elastic Block Store)。Pod のデータを残すのに使う | 付けられない。EFS なら使える<br><Link to="ebs-vs-efs" class="text-xs">EFS との違い →</Link> |
| *GPU* | 画像処理や機械学習の計算が得意なプロセッサ | GPU 付きの構成がない |
| *特権コンテナ* | Node の機能にほぼ制限なく触れるコンテナ。ネットワークやデバイスを操作するツールが使う | 使えない |
| *Spot* | 空いている EC2 を安く使う仕組み。AWS の都合で止められることがある | EKS の Fargate では使えない |
| *Arm (Graviton)* | AWS が作った Arm のプロセッサ。x86 より安く済むことが多い | x86 だけ |

</div>

<div class="refs">

参考: [Simplify compute management with AWS Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html)

</div>

<Link to="fargate" class="back-link">← 本編に戻る</Link>

<style>
.terms {
  font-size: 0.72em;
}

.terms td:first-child {
  white-space: nowrap;
}
</style>

---
title: DaemonSet とサイドカーの使い分け
# 用語集の DaemonSet の行からリンクする
routeAlias: daemonset-vs-sidecar
---

その補助が「誰のために」働くかで選ぶ

<div class="usage-table">

| | DaemonSet | サイドカー |
| --- | --- | --- |
| 誰のため | Node 全体 (その Node の全部の Pod) | 特定の Pod (同居するアプリ) |
| 動く数 | Node の数だけ | Pod の数だけ |
| 共有できるもの | Node のファイルやネットワーク | 同じ Pod の localhost やボリューム |
| 向いている例 | Node のログ収集・監視、CNI、kube-proxy | サービスメッシュのプロキシ、アプリ専用のログ送信・認証プロキシ |

</div>

- *Node に 1 つで足りる処理は DaemonSet*、*アプリと密にくっつく処理はサイドカー*
- Fargate では DaemonSet が使えないので、Node 向けの処理もサイドカーで代わりにする。その分 Pod ごとにリソースがかかる

<div class="refs">

参考: [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) / [Sidecar Containers](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/)

</div>

<Link to="fargate-terms" class="back-link">← 用語集に戻る</Link>

<style>
.usage-table {
  font-size: 0.8em;
}

.usage-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: EBS と EFS の違い
# 用語集の EBS の行からリンクする
routeAlias: ebs-vs-efs
---

EBS は 1 台の EC2 に挿す*専用ディスク* (外付け SSD)、EFS はみんなで使う*共有フォルダー* (NAS)

<div class="storage-table">

| | EBS (Elastic Block Store) | EFS (Elastic File System) |
| --- | --- | --- |
| つなげる数 | 基本は 1 台の EC2 だけ | たくさんの EC2・Pod から同時に |
| 使える範囲 | 1 つの AZ の中だけ | リージョン内の複数 AZ から |
| 速さ | 速い (ローカルディスクに近い) | EBS よりは遅め (ネットワーク越し) |
| 容量と料金 | 先に決めた容量分を払う | 使った分だけ払う。容量は自動で増減 |
| Kubernetes では | 1 つの Node の Pod が読み書き (ReadWriteOnce) | 複数の Pod が同時に読み書き (ReadWriteMany) |
| 向いている例 | DB のデータ、速さが要るもの | 複数の Pod で共有するファイルや設定 |

</div>

<div v-click>

*Fargate で EFS だけ使えるのは*: Fargate には EBS を挿す先の EC2 がないから

</div>

<div class="refs">

参考: [Amazon EBS](https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html) / [Amazon EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html)

</div>

<Link to="fargate-terms" class="back-link">← 用語集に戻る</Link>

<style>
.storage-table {
  font-size: 0.72em;
}

.storage-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: Data Plane の選択肢 (表)
# 本編の Data Plane の選択肢からリンクする
routeAlias: dp-table
---

<div class="dp-table">

| 選択肢 | Node の正体 | Node の管理 |
| --- | --- | --- |
| セルフマネージドノード | EC2 | 全部自分 |
| マネージドノードグループ | EC2 | 作成・更新の手順は AWS、実行するのは自分 |
| Karpenter (自分で導入) | EC2 | 台数の増減は自動。Karpenter の運用は自分 |
| Fargate | Pod ごとの実行環境 | AWS (Node を意識しない) |
| *EKS Auto Mode* | EC2 | ほぼ AWS |
| Hybrid Nodes | オンプレミスなどのマシン | 自分 |

</div>

<div class="refs">

参考: [Manage compute resources by using nodes](https://docs.aws.amazon.com/eks/latest/userguide/eks-compute.html) / [Karpenter](https://karpenter.sh/)

</div>

<Link to="dp-options" class="back-link">← 本編に戻る</Link>

<style>
.dp-table {
  font-size: 0.8em;
}

.dp-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: ECS ではなく EKS (Kubernetes) にした理由
# Fargate とは のスライドからリンクする
routeAlias: ecs-vs-eks
---

Fargate は ECS でも EKS でも使える。管理役に *Kubernetes* を選んだのは柔軟性のため

<div class="layers">
  <div class="layer"><span class="layer-name">管理役</span><span class="chip">ECS (AWS 独自)</span><span class="chip is-hl">EKS (Kubernetes)</span></div>
  <div class="layer"><span class="layer-name">動かす場所</span><span class="chip">EC2</span><span class="chip">Fargate</span><span class="chip">Auto Mode など</span></div>
</div>

<div class="ecs-table">

| | ECS | Kubernetes (EKS) |
| --- | --- | --- |
| 使える道具 | AWS が用意した機能が中心 | Helm・Operator・Argo CD・KEDA など OSS が多い |
| 自分で拡張する | 基本はできない | 独自のリソース (CRD) やコントローラーを足せる |
| 持ち運び | AWS 専用 | 他のクラウドや手元 (kind など) でも同じマニフェストが動く |
| Data Plane | EC2 / Fargate | EC2 / Fargate / Karpenter / Auto Mode など |

</div>

<div v-click>

最初に Kubernetes を選んでおいたから、*Data Plane だけを Fargate から Auto Mode に乗り換えられた*

</div>

<Link to="fargate" class="back-link">← 本編に戻る</Link>

<style>
.layers {
  display: grid;
  gap: 0.4rem;
  margin: 0.5rem 0 0.75rem;
  font-size: var(--theme-font-size-body);
}

.layer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.layer-name {
  width: 6rem;
  color: var(--theme-muted);
  font-weight: 700;
}

.chip {
  padding: 0.15rem 0.75rem;
  border: 1px solid var(--theme-gray-300);
  border-radius: var(--theme-radius-pill);
  background: #fff;
}

.chip.is-hl {
  border-color: var(--theme-red);
  color: var(--theme-red);
  font-weight: 700;
}

.ecs-table {
  font-size: 0.75em;
}

.ecs-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: EC2 と Fargate の VM の違い
# Data Plane をどう選んだか からリンクする
routeAlias: vm-diff
---

どちらも VM だが、Fargate は *Pod 1 つのためだけの小さな VM*

<div class="vm-table">

| | EC2 の VM | Fargate の VM |
| --- | --- | --- |
| 持ち主 | 自分のアカウント | AWS のアカウント (見えない) |
| 大きさ | インスタンスタイプで選ぶ (CPU の種類も選べる) | Pod の vCPU・メモリから決まる。CPU の種類は選べない |
| OS | 自分で選ぶ (AMI) | AWS が決める |
| 寿命 | 長く動かし、Pod を入れ替えながら使う | Pod と一緒に生まれて、一緒に消える |
| 中身 | Pod をたくさん載せる | Pod 1 つだけ |

</div>

<div v-click>

- *スケールアウトが遅い*: Pod を増やすたびに VM の用意から始まる (EC2 なら空きに数秒で起動)
- *パフォーマンスが安定しない*: CPU の種類を選べず、当たる CPU で性能が揺れる (EC2 なら固定できる)

</div>

<Link to="choose-dp" class="back-link">← 本編に戻る</Link>

<style>
.vm-table {
  font-size: 0.7em;
}

.vm-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: NetworkPolicy とは
# セキュリティの要件のスライドからリンクする
routeAlias: network-policy
---

Pod の通信を、*ラベルで選んで許可・拒否する* Kubernetes 標準のリソース

<div class="np">
<div class="code-sm">

```yaml
# 隔離用: quarantine=true の Pod の通信を全部止める
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: quarantine
spec:
  podSelector:
    matchLabels:
      quarantine: "true"
  # 許可する通信を何も書かない = 入りも出も全部止める
  policyTypes: [Ingress, Egress]
```

```sh
kubectl label pod <怪しい Pod> quarantine=true
```

</div>
<div>

- 何も書かなければ、Pod 同士の通信は*全部通る*
- Pod をラベルで選び、許可する通信を書く。選ばれた Pod は、書いた通信以外が止まる
- 実際に止めるのは *CNI* (EKS なら VPC CNI)。CNI が対応していない場所では、書いても効かない (Fargate がこれ)。<Link to="cni">CNI とは →</Link>

<div v-click>

<small class="np-note">Deployment が見ているラベルを外すと、その Pod は Deployment から切り離され、代わりの Pod が作られる</small>

</div>
</div>
</div>

<div class="refs">

参考: [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) / [Limit Pod traffic with Kubernetes network policies](https://docs.aws.amazon.com/eks/latest/userguide/cni-network-policy.html)

</div>

<Link to="pod-isolation" class="back-link">← 本編に戻る</Link>

<style>
.np-note {
  color: var(--theme-muted);
  font-size: var(--theme-font-size-caption);
}

.np {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  font-size: var(--theme-font-size-body);
}
</style>

---
title: CNI とは
# NetworkPolicy とは のスライドからリンクする
routeAlias: cni
---

Pod のネットワークを用意するプラグインの共通の規格 (*Container Network Interface*)

<div class="cni-flow">
  <div class="cni-box">kubelet</div>
  <div class="cni-arrow">CRI</div>
  <div class="cni-box">containerd</div>
  <div class="cni-arrow is-hl">CNI</div>
  <div class="cni-box is-hl">CNI プラグイン</div>
  <div class="cni-arrow">IP を割り当て</div>
  <div class="cni-box is-pod">Pod</div>
</div>

<div class="cni-table">

| | CRI | CNI |
| --- | --- | --- |
| つなぐもの | kubelet → コンテナランタイム | コンテナランタイム → ネットワークをつなぐ部品 (CNI プラグイン) |
| 頼む内容 | コンテナを起動・停止して | この Pod をネットワークにつないで |
| 実物の例 | containerd、CRI-O | VPC CNI、Calico、Cilium、Flannel |

</div>

- CNI プラグインが Pod に IP を割り当て、経路をつなぐ。対応していれば NetworkPolicy で通信も止める
- EKS の標準は *VPC CNI*。Pod に VPC の IP を割り当てるので、Pod が VPC の中の 1 台として見える

<div class="refs">

参考: [CNI](https://www.cni.dev/) / [Amazon VPC CNI](https://docs.aws.amazon.com/eks/latest/userguide/managing-vpc-cni.html)

</div>

<Link to="network-policy" class="back-link">← NetworkPolicy に戻る</Link>

<style>
.cni-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.25rem 0 0.75rem;
  font-size: var(--theme-font-size-body);
}

.cni-box {
  padding: 0.4rem 0.8rem;
  border-radius: var(--theme-radius-md);
  background: var(--theme-indigo);
  color: #fff;
  font-weight: 700;
  white-space: nowrap;
}

.cni-box.is-hl {
  background: var(--theme-blue);
  color: var(--theme-navy);
}

.cni-box.is-pod {
  background: var(--theme-red);
}

/* 線の上にラベルを載せた右向きの矢印 */
.cni-arrow {
  position: relative;
  min-width: 3.5rem;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid currentColor;
  font-size: var(--theme-font-size-caption);
  text-align: center;
}

.cni-arrow::after {
  content: '';
  position: absolute;
  right: -2px;
  bottom: -6px;
  border: 5px solid transparent;
  border-left: 8px solid currentColor;
}

.cni-arrow.is-hl {
  color: var(--theme-red);
  font-weight: 700;
}

.cni-table {
  font-size: 0.75em;
}

.cni-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: taint とは
# 分けたい Pod は Node ごと分ける からリンクする
routeAlias: taint
---

Node に付ける「*汚れ*」の印。その汚れを我慢できる (toleration を持つ) Pod しか乗れなくなる

<div class="taint-table">

| | taint | toleration |
| --- | --- | --- |
| 付ける先 | Node (NodePool で指定する) | Pod |
| 意味 | この Node を避けてほしい | その taint の Node でも乗れる |
| 例 | `sandbox=true:NoSchedule` | `key: sandbox`、`effect: NoSchedule` |

</div>

- effect で避けさせる強さを決める。*NoSchedule* は新しい Pod を乗せない。PreferNoSchedule はなるべく乗せない。NoExecute は乗っている Pod も追い出す
- toleration は「乗ってもいい」という許可で、行き先の指定ではない。*nodeSelector と組で*使い、分けたい Pod をその Node へ行かせる
- Fargate の Node にも taint が付いている。アプリの Pod は、それを我慢する toleration を書いて Fargate に乗っていた

<div class="refs">

参考: [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)

</div>

<Link to="node-split" class="back-link">← 本編に戻る</Link>

<style>
.taint-table {
  font-size: 0.8em;
}

.taint-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: 標準のアドオンとは
# バージョンアップはどう変わる? からリンクする
routeAlias: std-addons
---

Kubernetes を EKS で動かすのに*ほぼ必ず要る部品*。EKS ではアドオンとして入れる

<svg class="addon-fig" viewBox="0 0 760 330" role="img" aria-label="Karpenter が Node を立て、VPC CNI が Pod に IP を割り当て、kube-proxy が Service 宛ての通信を Pod に振り分け、CoreDNS が名前を引き、EBS CSI ドライバーが EBS を Pod につなぎ、Load Balancer Controller がクラスターの外に ALB を作る">
  <defs>
    <marker id="addon-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>
  <rect class="alb" x="6" y="120" width="84" height="44" rx="6" />
  <text class="box-label" x="48" y="142">ALB</text>

  <rect class="frame" x="140" y="8" width="614" height="314" rx="12" />
  <text class="frame-label" x="154" y="312">クラスター</text>

  <rect class="node" x="340" y="70" width="240" height="200" rx="10" />
  <text class="node-label" x="352" y="92">Node</text>
  <rect class="pod" x="358" y="110" width="94" height="44" rx="8" />
  <text class="pod-label" x="405" y="132">Pod</text>
  <rect class="pod" x="470" y="110" width="94" height="44" rx="8" />
  <text class="pod-label" x="517" y="132">Pod</text>
  <rect class="vol" x="358" y="205" width="94" height="40" rx="6" />
  <text class="box-label" x="405" y="225">EBS</text>
  <line class="link" x1="405" y1="154" x2="405" y2="205" />

  <rect class="chip" x="160" y="24" width="150" height="42" rx="8" />
  <text class="chip-name" x="235" y="41">Karpenter</text>
  <text class="chip-role" x="235" y="58">Node を立てる・消す</text>
  <path class="arrow" d="M310,45 L338,82" marker-end="url(#addon-arrow)" />

  <rect class="chip" x="160" y="121" width="150" height="42" rx="8" />
  <text class="chip-name" x="235" y="138">LB Controller</text>
  <text class="chip-role" x="235" y="155">ALB を作る</text>
  <path class="arrow" d="M160,142 L94,142" marker-end="url(#addon-arrow)" />

  <rect class="chip" x="160" y="204" width="150" height="42" rx="8" />
  <text class="chip-name" x="235" y="221">EBS CSI ドライバー</text>
  <text class="chip-role" x="235" y="238">EBS を Pod につなぐ</text>
  <path class="arrow" d="M310,225 L354,225" marker-end="url(#addon-arrow)" />

  <rect class="chip" x="600" y="24" width="140" height="42" rx="8" />
  <text class="chip-name" x="670" y="41">VPC CNI</text>
  <text class="chip-role" x="670" y="58">Pod に IP を割り当てる</text>
  <path class="arrow" d="M600,50 L540,106" marker-end="url(#addon-arrow)" />

  <rect class="chip" x="600" y="111" width="140" height="42" rx="8" />
  <text class="chip-name" x="670" y="128">kube-proxy</text>
  <text class="chip-role" x="670" y="145">Service の宛先を振り分け</text>
  <path class="arrow" d="M600,132 L568,132" marker-end="url(#addon-arrow)" />

  <rect class="chip" x="600" y="204" width="140" height="42" rx="8" />
  <text class="chip-name" x="670" y="221">CoreDNS</text>
  <text class="chip-role" x="670" y="238">名前を引く</text>
  <path class="arrow" d="M568,150 L600,212" marker-end="url(#addon-arrow)" />
</svg>

<style>
.addon-fig { display: block; width: 82%; margin: 0 auto; color: var(--theme-text); }
.addon-fig .frame { fill: none; stroke: currentColor; stroke-width: 2; }
.addon-fig .frame-label { fill: currentColor; font-size: 14px; font-weight: 700; }
.addon-fig .node { fill: var(--theme-gray-50); stroke: currentColor; stroke-width: 2; }
.addon-fig .node-label { fill: currentColor; font-size: 13px; font-weight: 700; }
.addon-fig .pod { fill: var(--theme-red); }
.addon-fig .pod-label { fill: #fff; font-size: 14px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.addon-fig .vol,
.addon-fig .alb { fill: #fff; stroke: var(--theme-gray-500); stroke-width: 2; }
.addon-fig .box-label { fill: currentColor; font-size: 13px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.addon-fig .link { stroke: var(--theme-gray-500); stroke-width: 2; }
/* アドオンは赤の点線の枠。何をするかを 2 行目に書く */
.addon-fig .chip { fill: var(--theme-red-50); stroke: var(--theme-red); stroke-width: 2; stroke-dasharray: 5 3; }
.addon-fig .chip-name { fill: var(--theme-red); font-size: 13px; font-weight: 700; text-anchor: middle; }
.addon-fig .chip-role { fill: var(--theme-muted); font-size: 10.5px; text-anchor: middle; }
.addon-fig .arrow { fill: none; stroke: var(--theme-red); stroke-width: 2; }
</style>

<Link to="version-up" class="back-link">← 本編に戻る</Link>

---
title: 標準のアドオンは誰が上げる?
---

Fargate では *CoreDNS と LB Controller を自分で上げていた*

<div class="addon-table">

| アドオン | 役目 | Fargate (移行前) | Auto Mode |
| --- | --- | --- | --- |
| VPC CNI | Pod に VPC の IP を割り当てる | 使わない (VM ごとに AWS が用意) | AWS が動かす |
| kube-proxy | Service 宛ての通信を Pod に振り分ける | Pod の VM に組み込まれている | AWS が動かす |
| CoreDNS | クラスターの中の名前解決 | *自分で上げる* (kube-system で動く) | AWS が動かす |
| EBS CSI ドライバー | EBS のボリュームを Pod につなぐ | 使えない | AWS が動かす |
| Karpenter | Node を立てる・消す | 要らない (Node がない) | AWS が動かす |
| Load Balancer Controller | Ingress から ALB を作る | *自分で入れて上げる* | 組み込みの LB に移せば AWS |

</div>

- Fargate では、多くを AWS が VM の中に隠していた
- Auto Mode では、LB Controller 以外は Node と一緒に AWS が上げる

<div class="refs">

参考: [Amazon EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) / [Automate cluster infrastructure with EKS Auto Mode](https://docs.aws.amazon.com/eks/latest/userguide/automode.html)

</div>

<Link to="version-up" class="back-link">← 本編に戻る</Link>

<style>
.addon-table {
  font-size: 0.7em;
}

.addon-table td:first-child {
  white-space: nowrap;
}

.addon-table td:last-child,
.addon-table th:last-child {
  background: var(--theme-red-50);
}
</style>

---
title: Ingress と LB Controller と ALB
# EKS Auto Mode とは / バージョンアップはどう変わる? からリンクする
routeAlias: lb-controller
---

*Ingress* は注文書、*LB Controller* は注文書を読む係、*ALB* は係が作る実物

<svg class="lbc-fig" viewBox="0 0 760 200" role="img" aria-label="クラスターの中の Ingress を LB Controller が読み、AWS の API でクラスターの外に ALB を作る。利用者のリクエストは ALB から Service、Pod へ届く">
  <defs>
    <marker id="lbc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>
  <rect class="frame" x="6" y="8" width="520" height="184" rx="12" />
  <text class="frame-label" x="20" y="182">クラスター</text>

  <!-- Ingress: 注文書 -->
  <rect class="doc" x="30" y="34" width="190" height="104" rx="6" />
  <text class="doc-title" x="44" y="56">Ingress</text>
  <text class="tag" x="208" y="55">in etcd</text>
  <text class="code" x="44" y="80">ingressClassName: alb</text>
  <text class="code" x="44" y="100">host: api.example.com</text>
  <text class="code" x="44" y="120">/ → Service api</text>

  <!-- LB Controller: 係 -->
  <rect class="chip" x="320" y="62" width="180" height="48" rx="8" />
  <text class="chip-name" x="410" y="82">LB Controller</text>
  <text class="chip-role" x="410" y="100">Ingress を見張る係</text>
  <path class="arrow" d="M220,86 L316,86" marker-end="url(#lbc-arrow)" />
  <text class="step" x="268" y="76">① 読む</text>

  <!-- ALB: 実物 -->
  <rect class="alb" x="610" y="62" width="130" height="48" rx="6" />
  <text class="box-label" x="675" y="86">ALB</text>
  <path class="arrow" d="M500,86 L606,86" marker-end="url(#lbc-arrow)" />
  <text class="step" x="556" y="76">② AWS API で作る</text>
  <text class="note" x="675" y="134">AWS コンソールの EC2 →</text>
  <text class="note" x="675" y="150">ロードバランサーで見える</text>

  <!-- リクエストの流れ -->
  <path class="req" d="M670,20 L670,58" marker-end="url(#lbc-arrow)" />
  <text class="note" x="684" y="38" text-anchor="start">利用者</text>
  <path class="req" d="M610,98 C560,160 420,170 330,160" marker-end="url(#lbc-arrow)" />
  <text class="note" x="290" y="164">Service → Pod</text>
</svg>

<div class="lbc-modes">

| | LB Controller が動く場所 | IngressClass の `controller` | 上げるのは |
| --- | --- | --- | --- |
| 自前 (移行前) | クラスターの中の Pod | `ingress.k8s.aws/alb` | *自分* |
| Auto Mode の組み込み | AWS の管理側。Pod は見えない | `eks.amazonaws.com/alb` | AWS |

</div>

<div class="lbc-notes">

- ALB は、作った係が管理する。係を Auto Mode の組み込みに替えると*新しい ALB が作られる*ので、DNS の向き先を切り替える
- ALB をコンソールで直接変えても、係が Ingress の内容に戻す。変えるのは Ingress (Helm の values) のほう

</div>

<div class="refs">

参考: [Create an IngressClass to configure an Application Load Balancer](https://docs.aws.amazon.com/eks/latest/userguide/auto-configure-alb.html) / [Enable EKS Auto Mode on existing EKS clusters](https://docs.aws.amazon.com/eks/latest/userguide/migrate-auto.html)

</div>

<div class="back-link lbc-back">← <Link to="automode">Auto Mode とは</Link> / <Link to="version-up">バージョンアップ</Link> に戻る</div>

<style>
.lbc-fig { display: block; width: 66%; margin: 0 auto; color: var(--theme-text); }
.lbc-fig .frame { fill: none; stroke: currentColor; stroke-width: 2; }
.lbc-fig .frame-label { fill: currentColor; font-size: 13px; font-weight: 700; }
/* Ingress は注文書なので、紙に見えるよう灰色の地にする */
.lbc-fig .doc { fill: var(--theme-gray-50); stroke: var(--theme-gray-500); stroke-width: 1.5; stroke-dasharray: 4 3; }
.lbc-fig .doc-title { fill: currentColor; font-size: 14px; font-weight: 700; }
/* Ingress の置き場所。データとして etcd に入ることを示す */
.lbc-fig .tag { fill: var(--theme-muted); font-size: 10.5px; font-family: var(--theme-font-mono, ui-monospace, monospace); text-anchor: end; }
.lbc-fig .code { fill: var(--theme-muted); font-size: 11px; font-family: var(--theme-font-mono, ui-monospace, monospace); }
/* アドオンは 標準のアドオンとは の図と同じ赤の点線の枠 */
.lbc-fig .chip { fill: var(--theme-red-50); stroke: var(--theme-red); stroke-width: 2; stroke-dasharray: 5 3; }
.lbc-fig .chip-name { fill: var(--theme-red); font-size: 14px; font-weight: 700; text-anchor: middle; }
.lbc-fig .chip-role { fill: var(--theme-muted); font-size: 11px; text-anchor: middle; }
.lbc-fig .alb { fill: #fff; stroke: var(--theme-gray-500); stroke-width: 2; }
.lbc-fig .box-label { fill: currentColor; font-size: 14px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.lbc-fig .arrow { fill: none; stroke: var(--theme-red); stroke-width: 2; }
.lbc-fig .step { fill: var(--theme-red); font-size: 11px; font-weight: 700; text-anchor: middle; }
.lbc-fig .req { fill: none; stroke: var(--theme-gray-500); stroke-width: 1.5; stroke-dasharray: 3 3; }
.lbc-fig .note { fill: var(--theme-muted); font-size: 11px; text-anchor: middle; }

.lbc-modes {
  font-size: 0.62em;
}

.lbc-notes {
  font-size: 0.78em;
}

.lbc-modes td:first-child {
  white-space: nowrap;
}

.lbc-back a {
  font-size: inherit;
}
</style>

---
title: EKS Capability とは
# バージョンアップはどう変わる? / Auto Mode で解消されること からリンクする
routeAlias: eks-capability
---

*EKS Capability* は、よく使う道具を *AWS が管理する形*でクラスターに付ける機能。道具は*クラスターの外*で動く

<svg class="cap-fig" viewBox="0 0 760 190" role="img" aria-label="自分で入れる Argo CD はクラスターの中の Pod として動く。EKS Capability の Argo CD は AWS の管理側で動き、クラスターの中には Application などの設定だけが残る">
  <defs>
    <marker id="cap-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>

  <!-- 左: 自分で入れる -->
  <text class="head" x="180" y="20">自分で入れる (以前)</text>
  <rect class="frame" x="20" y="32" width="320" height="150" rx="12" />
  <text class="frame-label" x="34" y="172">クラスター</text>
  <rect class="chip" x="48" y="56" width="264" height="44" rx="8" />
  <text class="chip-name" x="180" y="76">Argo CD の Pod 一式</text>
  <text class="chip-role" x="180" y="92">server・repo-server・controller など</text>
  <text class="note" x="180" y="128">上げる・直すのは自分</text>

  <!-- 右: EKS Capability -->
  <text class="head" x="560" y="20">EKS Capability (今)</text>
  <rect class="aws" x="400" y="32" width="340" height="56" rx="10" />
  <text class="aws-label" x="414" y="50">AWS の管理側</text>
  <text class="cap-name" x="570" y="72">Argo CD (type: ARGOCD)</text>
  <rect class="frame" x="400" y="104" width="340" height="78" rx="12" />
  <text class="frame-label" x="414" y="172">クラスター</text>
  <rect class="doc" x="440" y="116" width="260" height="34" rx="6" />
  <text class="code" x="570" y="137">argocd: Application などの設定だけ</text>
  <path class="arrow" d="M570,88 L570,114" marker-end="url(#cap-arrow)" />
</svg>

<div class="cap-table">

| | 自分で入れる | EKS Capability |
| --- | --- | --- |
| 動く場所 | クラスターの中の Pod | AWS の管理側 (クラスターの外) |
| 上げる・直す | *自分* | AWS |
| ログイン | 自分で用意 | IAM Identity Center |

</div>

<div class="cap-notes">

- クラスターの外で動くので、*Auto Mode に移す対象に入らない*。移す前後で同期が続くかを確かめるだけ
- 選べる道具は Argo CD・ACK・kro。自分で入れて上げるのは LB Controller・External Secrets・New Relic・Aikido など

</div>

<div class="refs">

参考: [Amazon EKS Capabilities](https://docs.aws.amazon.com/eks/latest/userguide/capabilities.html)

</div>

<div class="back-link cap-back">← <Link to="version-up">バージョンアップ</Link> に戻る</div>

<style>
.cap-fig { display: block; width: 56%; margin: 0 auto; color: var(--theme-text); }
.cap-fig .head { fill: currentColor; font-size: 13px; font-weight: 700; text-anchor: middle; }
.cap-fig .frame { fill: none; stroke: currentColor; stroke-width: 2; }
.cap-fig .frame-label { fill: currentColor; font-size: 12px; font-weight: 700; }
/* 自分で上げる部品は 標準のアドオンとは の図と同じ赤の点線の枠 */
.cap-fig .chip { fill: var(--theme-red-50); stroke: var(--theme-red); stroke-width: 2; stroke-dasharray: 5 3; }
.cap-fig .chip-name { fill: var(--theme-red); font-size: 13px; font-weight: 700; text-anchor: middle; }
.cap-fig .chip-role { fill: var(--theme-muted); font-size: 10.5px; text-anchor: middle; }
/* AWS が管理する側は灰色の実線 */
.cap-fig .aws { fill: var(--theme-gray-50); stroke: var(--theme-gray-500); stroke-width: 2; }
.cap-fig .aws-label { fill: var(--theme-muted); font-size: 11px; font-weight: 700; }
.cap-fig .cap-name { fill: currentColor; font-size: 13px; font-weight: 700; text-anchor: middle; }
.cap-fig .doc { fill: var(--theme-gray-50); stroke: var(--theme-gray-500); stroke-width: 1.5; stroke-dasharray: 4 3; }
.cap-fig .code { fill: var(--theme-muted); font-size: 11px; font-family: var(--theme-font-mono, ui-monospace, monospace); text-anchor: middle; }
.cap-fig .note { fill: var(--theme-muted); font-size: 11px; text-anchor: middle; }
.cap-fig .arrow { fill: none; stroke: var(--theme-gray-500); stroke-width: 1.5; stroke-dasharray: 3 3; }

.cap-table {
  font-size: 0.62em;
}

.cap-table td:first-child {
  white-space: nowrap;
}

.cap-notes {
  font-size: 0.78em;
}

.cap-back a {
  font-size: inherit;
}
</style>
