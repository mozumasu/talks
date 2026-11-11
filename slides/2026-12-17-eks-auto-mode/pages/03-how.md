---
layout: section
title: '03'
toc: 移行の進め方
---

# 移行の進め方

---
title: 移行で新たに考えること
---

*Node が見える構成*になり、新しく決めることが出てくる

<div class="todo-grid">
  <div class="todo"><p class="todo-title">Node の入れ替わり</p><p>Pod がいつ追い出されてもいいように、PDB・レプリカ 2 以上・止め方をそろえる</p></div>
  <div class="todo"><p class="todo-title">コスト</p><p>EC2 に Auto Mode の管理料金が乗る。今以下に収める</p></div>
  <div class="todo"><p class="todo-title">Pod の置き場所</p><p>NodePool の分け方。Spot や Arm を使うなら、イメージも複数アーキテクチャに</p></div>
  <div class="todo"><p class="todo-title">Pod 同士の分離</p><p>NetworkPolicy と Pod Security Admission を設定する</p></div>
  <div class="todo"><p class="todo-title">セキュリティグループ</p><p>Pod ごとに付けられない。SG で絞っていた通信を作り直す</p></div>
  <div class="todo"><p class="todo-title">IP の消費</p><p>Pod と Node が VPC の IP を使う。サブネットを見積もる</p></div>
  <div class="todo"><p class="todo-title">Pod の認証</p><p>IRSA のままか、Pod Identity か</p></div>
  <div class="todo"><p class="todo-title">ログ・監視</p><p>Fargate 用の作りを DaemonSet へ</p></div>
  <div class="todo"><p class="todo-title">ALB / Ingress</p><p>自前の LB Controller を続けるか、組み込みに移すか</p></div>
  <div class="todo"><p class="todo-title">調べ方</p><p>Node に SSH・SSM で入れない。障害のときの調べ方を決める</p></div>
  <div class="todo"><p class="todo-title">移行の手順</p><p>クラスターはそのまま。Fargate と並べて動かし、stg → prod の順。戻し方も決める</p></div>
</div>

<style>
.todo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.45rem;
  font-size: 0.7rem;
}

.todo {
  padding: 0.35rem 0.55rem;
  border-top: 3px solid var(--theme-red);
  background: var(--theme-gray-50);
}

.todo p {
  margin: 0;
  line-height: 1.45;
}

.todo .todo-title {
  margin-bottom: 0.15rem;
  color: var(--theme-red);
  font-weight: 700;
}
</style>

---
title: 移行の手順
---

<!-- 有効化 → NodePool の準備 → ワークロードの移動 → 旧ノードグループの削除 -->

---
title: ハマったところ
---

<!-- 移行で詰まった点と、その対処を書く -->
