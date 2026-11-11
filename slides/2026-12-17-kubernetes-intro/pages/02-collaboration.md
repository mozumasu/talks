---
layout: section
title: '02'
toc: 登場人物はどう連携する?
---

# 登場人物はどう連携する?

---
title: Pod が落ちたらどう動く?
# 05 の「Pod を消しても戻ってくる」からリンクする
routeAlias: pod-down
---

登場人物は直接は話さず、*kube-api-server* を通してバトンを渡す

<K8sArch :step="13" :recover="$clicks">
  <dl class="flow">
    <div v-click><dt>1. kube-controller-manager</dt><dd>Pod が足りないと気づき、置き場所が未定の Pod を作る</dd></div>
    <div v-click><dt>2. kube-scheduler</dt><dd>置き場所が未定の Pod を見つけ、Node 2 に置くと決める</dd></div>
    <div v-click><dt>3. kubelet (Node 2)</dt><dd>Pod が来たのを見て、コンテナランタイムに起動を頼む</dd></div>
  </dl>
</K8sArch>
