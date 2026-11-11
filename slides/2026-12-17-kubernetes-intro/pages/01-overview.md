---
layout: section
title: '01'
toc: Kubernetes の概要
---

# Kubernetes の概要

---
title: Kubernetesを構成するやつら
# transition は「このスライドから次へ進むとき」に効く。図だけが育っていくように見せるため、図のスライドの間では切る
transition: none
---

Kubernetes の単位は *Cluster*

<K8sArch :step="1" />

---
title: Kubernetesを構成するやつら
transition: none
---

Cluster の中には *Control Plane* と *Data Plane* がある

<K8sArch :step="2">
  <dl>
    <div v-click><dt>Control Plane</dt><dd>クラスターの「あるべき状態」を覚えて、その通りになるよう指示を出す司令塔<br><small>あるべき状態: <em>マニフェスト</em> (YAML ファイル) に書く</small></dd></div>
    <div v-click><dt>Data Plane</dt><dd>アプリ (Pod) が実際に動く場所</dd></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
transition: none
---

Data Plane は複数の *Node* で構成される

<K8sArch :step="3">
  <dl>
    <div v-click><dt>Node</dt><dd>Pod を動かすマシン 1 台。クラウドならたいてい VM<br><small>物理サーバーでもよい</small></dd></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
transition: none
---

Node の上で *Pod* が動く

<K8sArch :step="4">
  <dl>
    <div v-click><dt>Pod</dt><dd>コンテナを動かす入れ物。Kubernetes で動かす最小の単位<br><small>IP アドレスは Pod に 1 つ。中のコンテナはそれを共有し、localhost で話せる</small></dd></div>
    <div v-click><dt>Pod に入るコンテナ (1 つ以上)</dt><dd>
      <b>メイン</b>: アプリ本体<br>
      <b>init</b> (任意): 先に準備をして終わる<br>
      <b>サイドカー</b> (任意): 横で動き続ける<br><small>サイドカーの例: ログの収集、通信の中継</small>
    </dd></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
transition: none
# Appendix から戻ってくる
routeAlias: container-runtime
---

Pod のコンテナは *コンテナランタイム* が動かす

<K8sArch :step="5">
  <dl>
    <div v-click><dt>コンテナランタイム</dt><dd>Pod のコンテナを実際に動かすソフトウェア<br><small>例: containerd、CRI-O</small></dd></div>
    <div v-click><dt>CRI (Container Runtime Interface)</dt><dd>Kubernetes とコンテナランタイムをつなぐ共通の規格<br><Link to="cri-appendix" class="text-xs">詳しくは Appendix へ →</Link></dd></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
transition: none
---

*kubelet*: Node ごとにいて、Pod を起動して見張る

<K8sArch :step="6">
  <dl>
    <div v-click><dt>たとえば</dt><dd>コンテナが落ちたら再起動する<br><small>Pod ごと作り直すのは kube-controller-manager の仕事</small></dd></div>
    <div v-click><small>名前の -let は「小さい」の意味 (booklet = 小冊子、piglet = 子豚)。Node ごとにいる小さな Kubernetes の代理人</small></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
transition: none
---

*kube-proxy*: Node ごとにいて、Pod あての通信を振り分ける

<K8sArch :step="7">
  <dl>
    <div v-click><dt>Pod の IP は変わる</dt><dd>Pod は作り直されるたびに IP アドレスが変わるので、そのままでは宛先にしにくい</dd></div>
    <div v-click><dt>Service</dt><dd>複数の Pod をまとめた、変わらない宛先<br><small>kube-proxy は Service あての通信を、裏にいる Pod のどれかに届ける</small></dd></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
transition: none
---

*kube-api-server*: クラスターの窓口。みんなここと話す

<K8sArch :step="8" />

---
title: Kubernetesを構成するやつら
transition: none
---

*etcd*: クラスターの状態を保存するデータストア

<K8sArch :step="9">
  <dl>
    <div v-click><dt>覚えているもの</dt><dd>マニフェストに書いた「あるべき状態」と、今の状態<br><small>例: Deployment・Service・ConfigMap・Secret の中身、どの Pod がどの Node で動いているか</small></dd></div>
    <div v-click><small>名前の由来: Unix の設定置き場 <code>/etc</code> + distributed (分散) の d</small></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
transition: none
---

*kube-scheduler*: Pod をどの Node で動かすか決める

<K8sArch :step="10">
  <dl>
    <div v-click><dt>決め方</dt><dd>マニフェストの条件と、各 Node の空き具合を見て決める<br><small>条件の例: 必要な CPU・メモリ、置きたい Node (GPU 付き、特定の AZ など)</small></dd></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
routeAlias: controller-manager
transition: none
---

*kube-controller-manager*: 今の状態をあるべき状態に近づけ続ける

<K8sArch :step="11">
  <dl>
    <div v-click><dt>たとえば</dt><dd>Pod が落ちたら、足りない分の Pod を新しく作る<br><small>マニフェストで「3 つ」と書いたら、3 つになるまで作り直す</small></dd></div>
    <div v-click><Link to="split-appendix" class="text-xs">kube-scheduler と分かれている理由は Appendix へ →</Link></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
transition: none
---

*cloud-controller-manager*: ロードバランサーなどクラウド側のリソースを操作する

<K8sArch :step="12">
  <dl>
    <div v-click><dt>たとえば</dt><dd><code>type: LoadBalancer</code> の Service を作ると、クラウドのロードバランサーを作る<br><small>Node の VM がクラウド上で消えたら、Node を片付けるのもこの係</small></dd></div>
  </dl>
</K8sArch>

---
title: Kubernetesを構成するやつら
---

これが Kubernetes の*全体像*

<!-- 新しく出る登場人物がいないので、最後の step より大きくしてフェードインさせない -->
<K8sArch :step="13" />
