---
layout: section
title: '04'
toc: 手元にクラスターを作る
---

# 手元にクラスターを作る

---
title: 手元で動かす選択肢
---

クラウドを使わなくても、手元の PC にクラスターを作れる

<div class="local-table">

| ツール | クラスターの作り方 |
| --- | --- |
| *kind* | Docker のコンテナを Node にする。速く作って速く消せる |
| minikube | VM かコンテナを 1 台立てて Node にする |
| k3d | 軽量版の Kubernetes (k3s) を Docker の中で動かす |
| Docker Desktop | 設定画面から Kubernetes を有効にするだけ |

</div>

今日は *kind* (Kubernetes IN Docker) を使う

<div class="refs">

参考: [kind](https://kind.sigs.k8s.io/) / [minikube](https://minikube.sigs.k8s.io/) / [k3d](https://k3d.io/)

</div>

<style>
.local-table {
  font-size: 0.85em;
}

.local-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: kind でクラスターを作る
---

```sh
kind create cluster --name demo     # Docker の中に Node が 1 台できる
kubectl config current-context      # → kind-demo を向いている
kubectl get nodes
```

```text
NAME                 STATUS   ROLES           AGE   VERSION
demo-control-plane   Ready    control-plane   30s   v1.xx.x
```

- Node の正体は Docker のコンテナ。`docker ps` で `demo-control-plane` が見える
- 1 台で Control Plane と Data Plane を兼ねている (全体像の 2 つの箱が 1 台に入っている)
- kind は `~/.kube/config` に context を足して、向き先も切り替える

<div v-click>

<small>kubeswitch で使うなら: `kind get kubeconfig --name demo > ~/.kube/clusters/local/kind.yaml`<br>片付けるときは: `kind delete cluster --name demo`</small>

</div>

---
title: クラスターの中は namespace で分かれている
---

```sh
kubectl get namespaces
```

```text
NAME                 STATUS   AGE
default              Active   1m
kube-node-lease      Active   1m
kube-public          Active   1m
kube-system          Active   1m
local-path-storage   Active   1m
```

<div class="ns-table">

| namespace | 中身 |
| --- | --- |
| *default* | namespace を指定しないで作ったものが入る。05 章の Deployment もここ |
| *kube-system* | Kubernetes 自身の部品 |
| kube-public | 誰でも読める情報 (ほとんど使わない) |
| kube-node-lease | Node が動いていることを知らせる信号 |
| local-path-storage | kind が入れるもの (手元のディスクを使うストレージ) |

</div>

<style>
.ns-table {
  font-size: 0.8em;
}

.ns-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: kube-system をのぞいてみる
---

```sh
kubectl get pods -n kube-system
```

<div class="two-col">
<div class="code-sm">

```text
NAME                                         READY   STATUS
coredns-xxxxxxxxxx-xxxxx                     1/1     Running
coredns-xxxxxxxxxx-xxxxx                     1/1     Running
etcd-demo-control-plane                      1/1     Running
kindnet-xxxxx                                1/1     Running
kube-apiserver-demo-control-plane            1/1     Running
kube-controller-manager-demo-control-plane   1/1     Running
kube-proxy-xxxxx                             1/1     Running
kube-scheduler-demo-control-plane            1/1     Running
```

</div>
<div>

全体像に出てきた部品が、Pod として動いている

- Control Plane: *etcd*、*kube-apiserver*、*kube-scheduler*、*kube-controller-manager*
- Data Plane: *kube-proxy*
- そのほか: *coredns* (クラスターの中の名前解決)、kindnet (Pod どうしをつなぐネットワーク)

<small>EKS などのマネージドなクラスターでは、Control Plane の部品はクラウド側で動くので、ここには出てこない</small>

</div>
</div>

<style>
.two-col {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
</style>
