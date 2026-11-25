---
layout: section
title: '01'
toc: Kubernetes の概要
---

# Kubernetes の概要

---
title: 第一話 ある運用者の暮らし
---

<Narrator>あるところに、<em>3 つのアプリ</em>を動かす人がおったのじゃ</Narrator>

<div class="story-scene">
  <Yuru class="story-person" mood="happy" />
  <div class="world story-world">
    <div class="server"><p>サーバー 1</p><div class="app">app</div></div>
    <div class="server"><p>サーバー 2</p><div class="app">app</div></div>
    <div class="server"><p>サーバー 3</p><div class="app">app</div></div>
  </div>
</div>

---
title: 第二話 深夜 3 時のアラーム
---

<Narrator :mood="$clicks >= 5 ? 'tired' : 'normal'">
深夜 3 時にアラームが鳴ると飛び起きて、手で直して復旧していたのじゃ
</Narrator>

<!--
クリックごとに 1 段ずつ進める。左の図と右の手順が一緒に変わる。
1: サーバー 2 が落ちる / 2: アラートで起きる / 3: 空きを探す / 4: docker run し直す / 5: LB の宛先を直す
-->
<div class="nok">
<div>
  <div class="nok-lb">ロードバランサー<small>宛先: サーバー {{ $clicks >= 5 ? '1・3' : '1・2・3' }}</small></div>
  <div class="world nok-world">
    <div class="server"><span class="wire"></span><p>サーバー 1</p><div class="app">app</div></div>
    <div class="server"><span class="wire" :class="{ 'is-cut': $clicks >= 5 }"></span><p>サーバー 2</p><div class="app">app</div><div v-click="1" class="down">✕</div></div>
    <div class="server" :class="{ 'is-target': $clicks === 3 }"><span class="wire"></span><p>サーバー 3</p><div class="app">app</div><div v-click="4" class="app is-new">app</div></div>
  </div>
</div>
<div>
  <div v-click="1" class="world-event">夜中の 3 時に、サーバー 2 が落ちる</div>
  <ol class="nok-steps">
    <li v-click="2" :class="{ 'is-now': $clicks === 2 }">アラートで起きる</li>
    <li v-click="3" :class="{ 'is-now': $clicks === 3 }">空いているサーバーを探す</li>
    <li v-click="4" :class="{ 'is-now': $clicks === 4 }">ssh して <code>docker run</code> し直す</li>
    <li v-click="5" :class="{ 'is-now': $clicks === 5 }">ロードバランサーの宛先を直す</li>
  </ol>
  <!-- いまの手順のイメージと、そのときの人 -->
  <div class="nok-now">
  <Yuru class="nok-person" :mood="$clicks <= 1 ? 'sleep' : $clicks >= 5 ? 'tired' : 'panic'" />
  <div class="nok-pic">
    <div v-if="$clicks === 2" class="nok-phone"><small>03:02</small><b>[ALERT]</b> サーバー 2 が応答しません</div>
    <div v-if="$clicks === 3" class="nok-note">CPU とメモリを見比べて、サーバー 3 に置くと決める</div>
    <pre v-if="$clicks === 4" class="nok-term"><span>$</span> ssh server-3
<span>$</span> docker run -d app</pre>
    <div v-if="$clicks === 5" class="nok-note">宛先からサーバー 2 を外す。終わったら、もう朝</div>
  </div>
  </div>
</div>
</div>

<style>
.nok {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 2rem;
  align-items: start;
  margin-top: 0.75rem;
}

.nok-lb {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.4rem 0.75rem;
  border-radius: var(--theme-radius-sm);
  background: var(--theme-text);
  color: #fff;
  font-weight: 700;
}

.nok-lb small {
  font-weight: 400;
}

.nok-world {
  margin-top: 2rem;
}

/* ロードバランサーから各サーバーへの線 */
.nok-world .wire {
  position: absolute;
  top: -2rem;
  left: 50%;
  height: 2rem;
  border-left: 2.5px solid var(--theme-text);
}

.nok-world .wire.is-cut {
  border-left-style: dashed;
  border-left-color: var(--theme-gray-500);
}

/* 空いているサーバーを探している段 */
.nok-world .server.is-target {
  outline: 4px dashed var(--theme-red);
  outline-offset: 4px;
}

.nok-steps {
  margin: 0.75rem 0 0;
}

.nok-steps li.is-now {
  color: var(--theme-red);
  font-weight: 700;
}

.nok-now {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.75rem;
}

.nok-person {
  flex: none;
  height: 6rem;
}

.nok-pic {
  flex: 1;
  min-height: 5rem;
}

.nok-pic > * {
  animation: nok-fade-in 0.4s var(--theme-ease-out);
}

@keyframes nok-fade-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
}

/* スマホの通知 */
.nok-phone {
  padding: 0.6rem 0.9rem;
  border-radius: 1rem;
  background: #1e1e2e;
  color: #fff;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
}

.nok-phone small {
  display: block;
  color: #9ca3af;
  font-size: var(--theme-font-size-caption);
}

.nok-phone b {
  color: #f87171;
}

.nok-note {
  padding: 0.6rem 1rem;
  border-left: 4px solid var(--theme-red);
  background: var(--theme-red-50);
}

.nok-term {
  margin: 0;
  padding: 0.6rem 0.9rem;
  border-radius: var(--theme-radius-sm);
  background: #1e1e2e;
  color: #e5e7eb;
  font-size: 0.8rem;
}

.nok-term span {
  color: #86efac;
}
</style>

---
title: 第三話 救世主あらわる
---

<!-- クリックで場面をグレーアウトし、間をおいて「そこで!」、さらに間をおいて「Kubernetes!」を出す -->
<div class="story-cry" :class="{ 'is-dimmed': $clicks >= 1 }">
  <Yuru class="story-cry-person" mood="tired" />
  <p class="story-cry-text">深夜 3 時に起きるのは<em>辛い</em>!!</p>
</div>

<div v-click="1" />
<div v-if="$clicks >= 1" class="story-savior">
  <span class="story-savior-lead">そこで!</span>
  <span class="story-savior-name">Kubernetes!</span>
</div>

---
title: 第四話 ぐっすり眠れる世界
---

<Narrator mood="happy">「あるべき状態」を書いておけば、それに合わせ続けてくれるのじゃ</Narrator>

<div class="world">
  <div class="server"><p>Node 1</p><div class="app">Pod</div></div>
  <div class="server"><p>Node 2</p><div class="app">Pod</div><div v-click="2" class="down">✕</div></div>
  <div class="server"><p>Node 3</p><div class="app">Pod</div><div v-click="3" class="app is-new">Pod</div></div>
</div>

<div v-click="1" class="world-manifest">

```yaml
replicas: 3   # Pod を 3 つ動かしておいて
```

</div>

<div v-click="3" class="story-rest">
  <Yuru class="story-rest-person" mood="sleep" />
  <div class="world-event">勝手に戻るから、人は寝ていてよい</div>
</div>

---
title: 第五話 概念の嵐
---

<Narrator :mood="$clicks >= 1 ? 'panic' : 'happy'">
<span v-if="$clicks === 0">喜んで、さっそく勉強を始めたのじゃが……</span>
<span v-else><em>たくさんの概念</em>がいっぺんにやってきたのじゃ</span>
</Narrator>

<!-- 用語は人のまわりに散らす。位置は --x / --y (% ) で決める -->
<div class="terms">
  <!--
  泣いている顔の画像に、涙の筋をつたって落ちる粒を重ねる。
  --x / --y は画像に描かれた涙の筋の始まり (画像に対する %)、--len は筋の長さ (%)、--d は開始の遅れ
  -->
  <div v-if="$clicks >= 1" class="terms-person is-face">
    <img :src="$asset('crying.png')" alt="たくさんの概念に泣いている人">
    <span class="tear" style="--x: 52.5%; --y: 53%; --len: 20%; --d: 0s"></span>
    <span class="tear" style="--x: 54.7%; --y: 55%; --len: 23%; --d: 0.6s"></span>
    <span class="tear" style="--x: 56.9%; --y: 49%; --len: 33%; --d: 1.1s"></span>
    <span class="tear" style="--x: 80.3%; --y: 50%; --len: 30%; --d: 0.3s"></span>
    <span class="tear" style="--x: 82.5%; --y: 58%; --len: 24%; --d: 0.9s"></span>
    <span class="tear" style="--x: 85.3%; --y: 54%; --len: 12%; --d: 1.4s"></span>
  </div>
  <template v-else>
    <Yuru class="terms-person" mood="happy" />
    <p class="terms-say">Kubernetes 最高!</p>
  </template>
  <div v-click="1" class="terms-cloud">
    <span style="--x: 4%; --y: 8%">Pod</span>
    <span style="--x: 22%; --y: 2%">Node</span>
    <span style="--x: 40%; --y: 10%">Cluster</span>
    <span style="--x: 62%; --y: 4%">kube-api-server</span>
    <span style="--x: 84%; --y: 12%">etcd</span>
    <span style="--x: 2%; --y: 40%">kubelet</span>
    <span style="--x: 74%; --y: 34%">kube-scheduler</span>
    <span style="--x: 6%; --y: 72%">Control Plane</span>
    <span style="--x: 70%; --y: 62%">Data Plane</span>
    <span style="--x: 24%; --y: 88%">kube-proxy</span>
    <span style="--x: 46%; --y: 92%">CRI</span>
    <span style="--x: 60%; --y: 84%">Service</span>
    <span style="--x: 82%; --y: 86%">Deployment</span>
    <span style="--x: 16%; --y: 22%">マニフェスト</span>
    <span style="--x: 64%; --y: 22%">kube-controller-manager</span>
  </div>
</div>

---
title: 第六話 地図を手に
---

<Narrator :mood="$clicks >= 1 ? 'happy' : 'confused'">
<span v-if="$clicks === 0">この大量の概念を、どうやって効率よく理解すればよいのじゃ?</span>
<span v-else><em>頭の中に地図</em>を作るのじゃ。誰がどこにいて、誰と話すのかが分かれば、もう迷わないのじゃ</span>
</Narrator>

<div class="story-map">
  <Yuru class="story-map-person" :mood="$clicks >= 1 ? 'happy' : 'confused'" />
  <div class="story-map-paper">
    <span v-if="$clicks === 0" class="story-map-blank">?</span>
    <K8sArch v-else :step="11" />
  </div>
</div>

<div v-click="2" class="world-next">

これから、この地図を 1 人ずつ書き込んでいくのじゃ

</div>

---
layout: section
title: '02'
toc: Kubernetes の地図を描く
---

# Kubernetes の地図を描く

---
title: 地図を描く (平常時)
transition: none
---

Kubernetes の単位は *Cluster*。中は Control Plane (司令塔) と Data Plane (現場) に分かれる

<!-- 箱は Cluster → Control Plane → Data Plane の順に、説明と一緒にクリックで出す -->
<K8sArch :step="1" :reveal="$clicks">
  <dl>
    <div><dt>Cluster</dt><dd>Kubernetes が管理するマシンをひとまとめにしたもの</dd></div>
    <div v-click><dt>Control Plane</dt><dd>「あるべき状態」を覚えて、その通りになるよう指示を出す</dd></div>
    <div v-click><dt>Data Plane</dt><dd>アプリが実際に動く場所</dd></div>
  </dl>
</K8sArch>

---
title: 地図を描く (平常時)
transition: none
---

Data Plane には *Node* があり、その上で *Pod* が動いている

<K8sArch :step="2">
  <dl>
    <div v-click><dt>Node</dt><dd>Pod を動かすマシン 1 台。クラウドならたいてい VM<br><small>第一話の「サーバー」にあたる</small></dd></div>
    <div v-click><dt>Pod</dt><dd>コンテナを動かす入れ物。Kubernetes で動かす最小の単位<br><small>第一話の「app」にあたる</small></dd></div>
  </dl>
</K8sArch>

---
title: 地図を描く (平常時)
transition: none
# Appendix から戻ってくる
routeAlias: container-runtime
---

Node ごとに *kubelet* がいて、*コンテナランタイム* に Pod を動かしてもらう

<K8sArch :step="3">
  <dl>
    <div v-click><dt>kubelet</dt><dd>Node ごとにいて、Pod を起動して見張る<br><small>名前の -let は「小さい」の意味と言われる。Node ごとにいる小さな Kubernetes の代理人</small></dd></div>
    <div v-click><dt>コンテナランタイム</dt><dd>コンテナを実際に動かすソフトウェア (例: containerd)<br><small>kubelet とは CRI (Container Runtime Interface) という共通の規格で話す</small><Link to="cri-appendix" class="text-xs">詳しくは Appendix へ →</Link></dd></div>
  </dl>
</K8sArch>

---
title: 地図を描く (平常時)
transition: none
---

*kube-api-server* が窓口で、*etcd* が記録係

<K8sArch :step="4">
  <dl>
    <div v-click><dt>kube-api-server</dt><dd>クラスターの窓口。人も部品も、みんなここと話す<br><small>kubelet も、Node と Pod の様子をここに報告し続ける</small></dd></div>
    <div v-click><dt>etcd</dt><dd>「あるべき状態」と今の状態を覚えておくデータストア<br><small><code>kubectl apply</code> で渡したマニフェスト (<code>replicas: 3</code>) もここに残る</small></dd></div>
  </dl>
</K8sArch>

---
title: 地図を描く (深夜 3 時)
transition: none
# 05 の「Pod を消しても戻ってくる」と、Appendix からリンクする
routeAlias: pod-down
---

第二話の深夜 3 時、*Node 1 が落ちた!*

<!-- 新しく出る登場人物はいないので、step を半端にして赤くしない -->
<K8sArch :step="4.5" :recover="0">
  <dl>
    <div v-click><dt>報告が途絶える</dt><dd>kubelet も一緒に止まるので、api-server への定期報告が届かなくなる</dd></div>
    <div v-click><dt>Node が落ちたと判断する</dt><dd>kube-controller-manager (Node の係) が気づいて Node 1 を NotReady にし、しばらく待ってから Node 1 の Pod を退去させる<br><small>待つ時間は標準で約 5 分。そのあいだに戻ってくるかもしれないから</small></dd></div>
  </dl>
</K8sArch>

---
title: 地図を描く (深夜 3 時)
transition: none
---

*kube-controller-manager* が足りない Pod に気づき、置き場所が空欄の Pod を登録する

<K8sArch :step="5" :recover="1">
  <dl>
    <div v-click><dt>今とあるべき状態を比べる</dt><dd>「3 つ」なのに 2 つしかないので、Pod を 1 つ登録する<br><small>働くのは ReplicaSet の係。この Pod は記録だけで、まだどこでも動いていない</small></dd></div>
    <div v-click><dt>第二話の「1. アラートで起きる」</dt><dd>を、代わりにやる係</dd></div>
  </dl>
</K8sArch>

---
title: 地図を描く (深夜 3 時)
transition: none
# Appendix から戻ってくる
routeAlias: scheduler
---

*kube-scheduler* が、空いている Node を決める

<K8sArch :step="6" :recover="2">
  <dl>
    <div v-click><dt>決め方</dt><dd>Pod が要求する CPU・メモリと、各 Node の空きを見比べる<br><small>Node が使える量は kubelet が報告する。空きは、すでに置いた Pod の要求量を引いて計算する (実際の使用量ではない)</small></dd></div>
    <div v-click><dt>決めたら</dt><dd>Pod に「Node 2 で動かして」と書き込むだけ<br><small>運んだり起動したりはしない</small></dd></div>
    <div v-click><dt>第二話の「2. 空いているサーバーを探す」</dt><dd>を、代わりにやる係</dd></div>
    <div v-click><Link to="split-appendix" class="text-xs">kube-controller-manager と分かれている理由は Appendix へ →</Link></div>
  </dl>
</K8sArch>

---
title: 地図を描く (深夜 3 時)
transition: none
---

Node 2 の *kubelet* が、コンテナランタイムに起動を頼む

<!-- 新しく出る登場人物はいないので、step を半端にして赤くしない -->
<K8sArch :step="6.5" :recover="3">
  <dl>
    <div v-click><dt>見張っている</dt><dd>kubelet は api-server を見張っていて、自分の Node に決まった Pod を見つける</dd></div>
    <div v-click><dt>第二話の「3. ssh して docker run し直す」</dt><dd>を、代わりにやる係</dd></div>
  </dl>
</K8sArch>

---
title: 地図を描く (深夜 3 時)
transition: none
---

*kube-proxy* が、新しい Pod にも通信が届くようにする

<!-- Pod は置き終わっているので、recover を 4 にして動かさない -->
<K8sArch :step="7" :recover="4">
  <dl>
    <div v-click><dt>Service</dt><dd>複数の Pod をまとめた、変わらない宛先<br><small>Pod は作り直されるたびに IP が変わるので、宛先は Service にしておく</small></dd></div>
    <div v-click><dt>転送のルールを書き換える</dt><dd>kube-proxy は Node ごとに、Service あての通信を Pod に転送するルールを書き換える<br><small>宛先の Pod の一覧は kube-controller-manager が更新し、kube-proxy はそれを見張っている</small></dd></div>
    <div v-click><dt>第二話の「4. ロードバランサーの宛先を直す」</dt><dd>を、代わりにやる係</dd></div>
  </dl>
</K8sArch>

---
title: 地図ができた
---

<Narrator mood="happy">人が寝ている間に、これを全部やってくれるのじゃ。これが Kubernetes の<em>地図</em>じゃ</Narrator>

<!-- 新しく出る登場人物がいないので、最後の step より大きくしてフェードインさせない -->
<K8sArch :step="8" />

---
title: 用語まとめ
---

<div class="glossary">
  <dl>
    <p class="glossary-group">全体</p>
    <dt>Cluster</dt><dd>Kubernetes が管理するマシンのまとまり</dd>
    <dt>マニフェスト</dt><dd>「あるべき状態」を書いた YAML ファイル</dd>
    <dt>Pod</dt><dd>コンテナを動かす入れ物。動かす最小の単位</dd>
    <dt>Service</dt><dd>複数の Pod をまとめた、変わらない宛先</dd>
  </dl>
  <dl>
    <p class="glossary-group">Control Plane (司令塔)</p>
    <dt>kube-api-server</dt><dd>クラスターの窓口。みんなここと話す</dd>
    <dt>etcd</dt><dd>クラスターの状態を保存するデータストア</dd>
    <dt>kube-controller-manager</dt><dd>今の状態をあるべき状態に近づける</dd>
    <dt>kube-scheduler</dt><dd>Pod をどの Node で動かすか決める</dd>
  </dl>
  <dl>
    <p class="glossary-group">Data Plane (現場)</p>
    <dt>Node</dt><dd>Pod を動かすマシン 1 台</dd>
    <dt>kubelet</dt><dd>Node ごとにいて、Pod を起動して見張る</dd>
    <dt>コンテナランタイム</dt><dd>コンテナを実際に動かすソフトウェア</dd>
    <dt>CRI</dt><dd>Kubernetes とランタイムをつなぐ共通の規格</dd>
    <dt>kube-proxy</dt><dd>Service あての通信が Pod に届くよう、転送のルールを書き換える</dd>
  </dl>
</div>

<!-- 用語と図を見比べられるよう、全体像を小さく下に置く -->
<div class="glossary-map">
  <K8sArch :step="8" />
</div>

<style>
.glossary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  font-size: 0.7em;
}

.glossary dl {
  margin: 0;
}

.glossary-group {
  margin: 0 0 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid var(--theme-red);
  color: var(--theme-red);
  font-weight: 700;
}

.glossary dt {
  font-weight: 700;
}

.glossary dd {
  margin: 0 0 0.5rem;
}

.glossary-map {
  display: flex;
  justify-content: center;
  margin-top: 0.25rem;
}

/* 説明の欄は使わないので、図の幅だけにする */
.glossary-map .k8s-arch {
  height: 12rem;
}

.glossary-map :deep(.k8s-notes) {
  display: none;
}
</style>
