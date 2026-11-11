---
layout: section
title: '06'
toc: Appendix
---

# Appendix

---
layout: section
title: Appendix
toc: コンテナランタイムと CRI
tocLevel: 2
---

# コンテナランタイムと CRI

---
title: なぜ Kubernetes とコンテナランタイムをつなぐの?
# CRI のスライドからリンクする
routeAlias: cri-appendix
---

- Kubernetes (Node 上の *kubelet*) は、自分ではコンテナを起動できない
  - 「この Pod を動かして」と指示を出すだけ
- イメージを取ってきて、コンテナを実際に起動・停止するのは *コンテナランタイム*
- だから kubelet からコンテナランタイムに指示を渡す口が必要になる。その口が *CRI*

<svg class="cri-why" viewBox="0 0 900 230" role="img" aria-label="kubelet が CRI でコンテナランタイムに指示し、ランタイムがレジストリからイメージを pull してコンテナを起動する">
  <defs>
    <marker id="cri-why-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>
  <rect class="area" x="0" y="0" width="260" height="230" rx="12" />
  <text class="area-label" x="16" y="28">指示する側 (Kubernetes)</text>
  <rect class="area" x="400" y="0" width="500" height="230" rx="12" />
  <text class="area-label" x="416" y="28">コンテナを動かす側</text>
  <rect class="box" x="50" y="90" width="160" height="64" rx="8" />
  <text class="box-label" x="130" y="122">kubelet</text>
  <path class="line is-cri" d="M210,122 H428" marker-end="url(#cri-why-arrow)" />
  <text class="line-label" x="320" y="108">「この Pod を動かして」</text>
  <text class="line-label is-cri" x="320" y="146">CRI</text>
  <text class="line-label is-small" x="320" y="168">Container Runtime Interface</text>
  <rect class="box" x="430" y="90" width="200" height="64" rx="8" />
  <text class="box-label" x="530" y="122">コンテナランタイム</text>
  <text class="sub-label" x="530" y="178">containerd / CRI-O など</text>
  <rect class="box is-light" x="710" y="45" width="160" height="50" rx="8" />
  <text class="box-label is-dark" x="790" y="70">レジストリ</text>
  <!-- pull はレジストリからイメージを取ってくるので、矢印はランタイム向き -->
  <path class="line" d="M708,74 L632,105" marker-end="url(#cri-why-arrow)" />
  <text class="line-label is-small" x="650" y="74">イメージを pull</text>
  <rect class="box is-pod" x="710" y="140" width="75" height="50" rx="8" />
  <text class="box-label is-small" x="747.5" y="165">コンテナ</text>
  <rect class="box is-pod" x="795" y="140" width="75" height="50" rx="8" />
  <text class="box-label is-small" x="832.5" y="165">コンテナ</text>
  <path class="line" d="M630,140 L708,162" marker-end="url(#cri-why-arrow)" />
  <text class="line-label is-small" x="668" y="182">起動</text>
</svg>

<style>
.cri-why {
  display: block;
  width: 100%;
  margin-top: 1.5rem;
  color: var(--theme-text);
}

.cri-why .area {
  fill: var(--theme-gray-50);
}

.cri-why .area-label {
  fill: var(--theme-muted);
  font-size: 15px;
  font-weight: 700;
}

.cri-why .box {
  fill: var(--theme-indigo);
}

.cri-why .box.is-light {
  fill: var(--theme-blue);
}

.cri-why .box.is-pod {
  fill: var(--theme-red);
}

.cri-why .box-label {
  fill: #fff;
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

.cri-why .box-label.is-dark {
  fill: var(--theme-navy);
}

.cri-why .box-label.is-small {
  font-size: 14px;
}

.cri-why .sub-label {
  fill: var(--theme-muted);
  font-size: 14px;
  text-anchor: middle;
}

.cri-why .line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.cri-why .line.is-cri {
  stroke: var(--theme-red);
  stroke-width: 3;
}

.cri-why .line-label {
  fill: currentColor;
  font-size: 15px;
  text-anchor: middle;
}

.cri-why .line-label.is-cri {
  fill: var(--theme-red);
  font-size: 18px;
  font-weight: 700;
}

.cri-why .line-label.is-small {
  font-size: 13px;
}
</style>

<Link to="container-runtime" class="back-link">← 本編に戻る</Link>

---
title: CRI は何をつないでいるの?
---

*CRI* が「何を頼めるか」を決め、*gRPC* がそれを相手に届ける

<div class="cri-flow">
  <div class="cri-box">kubelet</div>
  <div class="cri-arrow is-cri">CRI (gRPC)</div>
  <div class="cri-box">containerd / CRI-O</div>
  <div class="cri-arrow">OCI</div>
  <div class="cri-box is-light">runc</div>
  <div class="cri-arrow">起動</div>
  <div class="cri-box is-pod">コンテナ</div>
</div>

<div class="cri-table">

| | 役割 | たとえると |
| --- | --- | --- |
| *CRI* | kubelet が頼める操作の一覧を決めた規格。<br>RuntimeService (Pod・コンテナの操作) と ImageService (イメージの操作) | 注文できるメニュー |
| *gRPC* | 決めた操作を、別のプロセスの関数として呼び出す通信の仕組み。<br>CRI の操作は gRPC の形式 (protobuf) で書かれている | 注文の伝え方 (電話) |
| *Unix ソケット* | Node の中で kubelet とランタイムをつなぐ通り道 (例: `/run/containerd/containerd.sock`) | 電話回線 |

</div>

<style>
.cri-table {
  font-size: 0.8em;
}

.cri-table td:first-child,
.cri-table td:last-child {
  white-space: nowrap;
}

.cri-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.cri-box {
  padding: 0.6rem 1rem;
  border-radius: var(--theme-radius-md);
  background: var(--theme-indigo);
  color: #fff;
  font-weight: 700;
  white-space: nowrap;
}

.cri-box.is-light {
  background: var(--theme-blue);
  color: var(--theme-navy);
}

.cri-box.is-pod {
  background: var(--theme-red);
}

/* 線の上にラベルを載せた右向きの矢印 */
.cri-arrow {
  position: relative;
  min-width: 4.5rem;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid currentColor;
  font-size: var(--theme-font-size-caption);
  text-align: center;
}

.cri-arrow::after {
  content: '';
  position: absolute;
  right: -2px;
  bottom: -6px;
  border: 5px solid transparent;
  border-left: 8px solid currentColor;
}

.cri-arrow.is-cri {
  min-width: 6.5rem;
  color: var(--theme-red);
  font-weight: 700;
}
</style>

<Link to="container-runtime" class="back-link">← 本編に戻る</Link>

---
title: なぜ Unix ソケットでつなぐの?
---

- *Unix ソケット*: 同じマシンの中のプロセス同士が話す方法の 1 つ。ファイルとして置かれる
- ネットワークに口を開けないので、Node の外からは届かない
- ファイルなので、ファイルの権限で使える人を絞れる (root だけ、など)
- 相手はポート番号ではなくパスで指定する (kubelet の `--container-runtime-endpoint`)

<svg class="sock" viewBox="0 0 900 230" role="img" aria-label="Node の中で kubelet と containerd が containerd.sock を通して話し、Node の外からは届かない">
  <defs>
    <marker id="sock-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
    </marker>
  </defs>
  <rect class="area" x="0" y="0" width="640" height="230" rx="12" />
  <text class="area-label" x="16" y="28">Node</text>
  <rect class="box" x="40" y="80" width="140" height="64" rx="8" />
  <text class="box-label" x="110" y="112">kubelet</text>
  <path class="line is-cri" d="M180,112 H248" marker-end="url(#sock-arrow)" />
  <!-- 右上の角を折ったファイルのアイコン -->
  <path class="file" d="M250,62 H380 L410,92 V162 H250 Z" />
  <path class="file-fold" d="M380,62 V92 H410" />
  <text class="file-label" x="330" y="118">.sock</text>
  <text class="sub-label" x="330" y="190">/run/containerd/containerd.sock</text>
  <text class="sub-label" x="330" y="212">ファイルの権限で使える人を絞る</text>
  <path class="line is-cri" d="M410,112 H458" marker-end="url(#sock-arrow)" />
  <rect class="box" x="460" y="80" width="150" height="64" rx="8" />
  <text class="box-label" x="535" y="112">containerd</text>
  <rect class="box is-outside" x="730" y="80" width="150" height="64" rx="8" />
  <text class="box-label is-dark" x="805" y="112">外のマシン</text>
  <path class="line is-blocked" d="M728,112 H650" />
  <text class="blocked-mark" x="688" y="114">✕</text>
  <text class="sub-label" x="805" y="170">ネットワークに口が</text>
  <text class="sub-label" x="805" y="190">ないので届かない</text>
</svg>

<Link to="container-runtime" class="back-link">← 本編に戻る</Link>

<style>
.sock {
  display: block;
  width: 100%;
  margin-top: 1rem;
  color: var(--theme-text);
}

.sock .area {
  fill: var(--theme-gray-50);
}

.sock .area-label {
  fill: var(--theme-muted);
  font-size: 15px;
  font-weight: 700;
}

.sock .box {
  fill: var(--theme-indigo);
}

.sock .box.is-outside {
  fill: var(--theme-gray-100);
}

.sock .box-label {
  fill: #fff;
  font-size: 18px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

.sock .box-label.is-dark {
  fill: var(--theme-text);
}

.sock .file {
  fill: #fff;
  stroke: var(--theme-red);
  stroke-width: 3;
}

.sock .file-fold {
  fill: none;
  stroke: var(--theme-red);
  stroke-width: 3;
}

.sock .file-label {
  fill: var(--theme-red);
  font-size: 20px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

.sock .sub-label {
  fill: var(--theme-muted);
  font-size: 14px;
  text-anchor: middle;
}

.sock .line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.sock .line.is-cri {
  stroke: var(--theme-red);
  stroke-width: 3;
}

.sock .line.is-blocked {
  stroke: var(--theme-gray-500);
  stroke-dasharray: 6 5;
}

.sock .blocked-mark {
  fill: var(--theme-red);
  font-size: 26px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}
</style>

---
title: なぜ共通の規格にしたの?
---

- 昔の kubelet には Docker 専用のコード (*dockershim*) が組み込まれていた
  - 別のランタイムに対応するたびに、kubelet 本体を直す必要があった
- Kubernetes 1.5 (2016 年) で *CRI* ができ、kubelet とランタイムの間の口が 1 つに決まった
  - CRI を話せるランタイムなら、kubelet を直さずに差し替えられる
- dockershim は Kubernetes 1.24 (2022 年) で削除された
  - 今は containerd や CRI-O が CRI を直接話す

<Link to="container-runtime" class="back-link">← 本編に戻る</Link>

---
layout: section
title: Appendix
toc: kube-scheduler と kube-controller-manager
tocLevel: 2
---

# kube-scheduler と kube-controller-manager

---
title: なぜ kube-scheduler と kube-controller-manager は分かれているの?
# kube-controller-manager のスライドからリンクする
routeAlias: split-appendix
---

どちらも「api-server を見張って、変化があれば動く」仲間。でも担当する仕事の種類が違う

<div class="split-table">

| | kube-scheduler | kube-controller-manager |
| --- | --- | --- |
| 仕事 | 新しい Pod の置き場所を決める、だけ | 「あるべき状態に合わせる」係をたくさんまとめたもの |
| 中身 | スケジューラー 1 つ | Deployment・ReplicaSet・Node・Job などのコントローラー |

</div>

- *スケジューラーだけ差し替え・追加できる*: 例えば EKS の Fargate は、標準のスケジューラーと並べて Fargate 用のスケジューラーを動かしている
- *役割がはっきりする*: 「どこに置くか」と「何個あるべきか」を別々に直せる
- *お互いに直接は話さない*: どちらも api-server を通すので、別のプログラムでも困らない

<div class="refs">

参考: [Simplify compute management with AWS Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html)

</div>

<Link to="controller-manager" class="back-link">← 本編に戻る</Link>

<style>
.split-table {
  font-size: 0.8em;
}

.split-table td:first-child {
  white-space: nowrap;
}
</style>
