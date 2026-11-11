---
layout: section
title: '05'
toc: アプリを動かしてみる
---

# アプリを動かしてみる

---
title: Deployment でアプリを動かす
---

<div class="two-col">
<div class="code-sm">

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
spec:
  replicas: 3          # Pod を 3 つ
  selector:
    matchLabels: { app: hello }
  template:            # Pod のひな形
    metadata:
      labels: { app: hello }
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - containerPort: 80
```

</div>
<div>

```sh
kubectl apply -f deployment.yaml
kubectl get pods
```

```text
NAME                     READY   STATUS
hello-7c9d8b6f5d-4kq2x   1/1     Running
hello-7c9d8b6f5d-9wz7m   1/1     Running
hello-7c9d8b6f5d-tm5lp   1/1     Running
```

- マニフェストが「あるべき状態」
- `apply` すると api-server 経由で etcd に覚えられる
- あとは kube-scheduler と kubelet が動かしてくれる

</div>
</div>

<style>
.two-col {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1.5rem;
}
</style>

---
title: Pod を消しても戻ってくる
---

```sh
kubectl delete pod hello-7c9d8b6f5d-4kq2x
kubectl get pods
```

```text
NAME                     READY   STATUS
hello-7c9d8b6f5d-9wz7m   1/1     Running
hello-7c9d8b6f5d-tm5lp   1/1     Running
hello-7c9d8b6f5d-x8r2n   1/1     Running   # ← 新しい Pod
```

- 「3 つ」があるべき状態なので、kube-controller-manager が足りない 1 つを作り直す
- 名前が変わっている = 同じ Pod が復活したのではなく、*新しい Pod* ができている

<div v-click>

<Link to="pod-down">「Pod が落ちたらどう動く?」で見た流れそのもの →</Link>

</div>

---
title: Service でつなぐ
---

<div class="two-col">
<div class="code-sm">

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: hello
spec:
  selector:
    app: hello       # このラベルの Pod に届ける
  ports:
    - port: 80
      targetPort: 80
```

</div>
<div>

```sh
kubectl apply -f service.yaml
kubectl port-forward service/hello 8080:80
# → ブラウザで http://localhost:8080
```

- Service は、IP が*変わらない宛先*
- `app: hello` の Pod のどれかに届く<br>(振り分けるのは kube-proxy)
- `port-forward` で手元の 8080 番を Service につなぐ

</div>
</div>

<style>
.two-col {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1.5rem;
}
</style>
