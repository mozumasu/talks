<script setup lang="ts">
import { useIsSlideActive } from '@slidev/client'

// Kubernetes の全体像。step 以下の登場人物だけを描き、step で初めて出るものを目立たせる
// (下からフェードインし、赤くなる)。
// スライドを 1 枚進めるごとに step を 1 つ上げて、kubectl apply してから Pod が動くまでの順に
// 登場人物を紹介する。最後の登場人物より大きい step では、どれも目立たせずに描く
// recover を渡すと、Node 1 の Pod が 1 つ落ちたところから、代わりの Pod が Node 2 で動くまでを描く。
// 0: Pod が落ちる / 1: controller-manager が置き場所が未定の Pod を作る /
// 2: scheduler が Node 2 に置くと決める / 3: Node 2 の kubelet が起動する
// reveal は step 1 のスライドで、箱をクリックごとに 1 つずつ出すのに使う ($clicks を渡す)。
// 0: Cluster / 1: + Control Plane / 2: + Data Plane
const { step = Infinity, recover, reveal = Infinity } = defineProps<{
  step?: number
  recover?: number
  reveal?: number
}>()

const CLUSTER = 'cluster'
const CONTROL_PLANE = 'controlPlane'
const DATA_PLANE = 'dataPlane'
const NODES = 'nodes'
const PODS = 'pods'
const CRI = 'cri'
const KUBELET = 'kubelet'
const KUBE_PROXY = 'kubeProxy'
const API_SERVER = 'apiServer'
const ETCD = 'etcd'
const SCHEDULER = 'scheduler'
const CONTROLLER_MANAGER = 'controllerManager'
const CLOUD_CONTROLLER_MANAGER = 'cloudControllerManager'
type Part = typeof CLUSTER | typeof CONTROL_PLANE | typeof DATA_PLANE | typeof NODES | typeof PODS | typeof CRI | typeof KUBELET
  | typeof KUBE_PROXY | typeof API_SERVER | typeof ETCD | typeof SCHEDULER | typeof CONTROLLER_MANAGER
  | typeof CLOUD_CONTROLLER_MANAGER

// 登場人物ごとに、初めて出る step。
// 最初は箱 (Cluster と Control Plane / Data Plane) だけを出す。Node は、Pod をどの Node に
// 置くか決める kube-scheduler と一緒に出す
const ORDER: Record<Part, number> = {
  cluster: 1, controlPlane: 1, dataPlane: 1, apiServer: 2, etcd: 3, controllerManager: 4, scheduler: 5, nodes: 5,
  kubelet: 6, cri: 7, pods: 8, kubeProxy: 9, cloudControllerManager: 10,
}

// 隣のスライドは先にマウントされるので、表示されてからフェードインを始める
const active = useIsSlideActive()
// step 1 の箱を出す順番 (reveal と比べる)
const REVEAL: Partial<Record<Part, number>> = { cluster: 0, controlPlane: 1, dataPlane: 2 }
const revealed = (p: Part) => step !== 1 || (REVEAL[p] ?? 0) <= reveal
const shown = (p: Part) => ORDER[p] <= step && revealed(p)
// reveal を使うときは、いま出た箱だけを目立たせる
const isNew = (p: Part) => ORDER[p] === step && (reveal === Infinity || REVEAL[p] === reveal)
const cls = (p: Part) => ({ 'is-new': isNew(p), 'is-active': active.value })

const isDown = (node: string, i: number) => recover !== undefined && node === 'Node 1' && i === 2

const NODE_W = 270
// pods は Node の左上からの相対位置
const nodes = [
  { x: 465, label: 'Node 1', pods: [[35, 440], [150, 440], [92, 525]] },
  { x: 740, label: 'Node 2', pods: [[95, 480]] },
]
</script>

<template>
  <!-- 説明は図の右に置く。説明の無いスライドでも同じ幅を空けて、スライド間で図の位置を揃える -->
  <div class="k8s-arch">
    <svg viewBox="0 0 1260 700" role="img" aria-label="Kubernetes の全体像">
      <defs>
        <marker id="k8s-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>

      <!-- Cluster -->
      <g v-if="shown(CLUSTER)" :class="cls(CLUSTER)">
        <rect class="frame" x="10" y="10" width="1030" height="680" rx="16" />
        <text class="frame-label is-cluster" x="525" y="45">Cluster</text>
      </g>

      <!-- Control Plane -->
      <g v-if="shown(CONTROL_PLANE)" :class="cls(CONTROL_PLANE)">
        <rect class="frame" x="40" y="60" width="390" height="610" rx="12" />
        <text class="frame-label" x="235" y="92">Control Plane</text>
      </g>

      <!-- Data Plane -->
      <g v-if="shown(DATA_PLANE)" :class="cls(DATA_PLANE)">
        <rect class="frame" x="450" y="60" width="570" height="610" rx="12" />
        <text class="frame-label" x="735" y="92">Data Plane</text>
      </g>

      <!-- Node -->
      <g v-if="shown(NODES)" :class="cls(NODES)">
        <template v-for="n in nodes" :key="n.label">
          <rect class="frame" :x="n.x" y="230" :width="NODE_W" height="420" rx="10" />
          <text class="frame-label is-node" :x="n.x + NODE_W / 2" y="260">{{ n.label }}</text>
        </template>
      </g>

      <!-- Pod -->
      <g v-if="shown(PODS)" :class="cls(PODS)">
        <template v-for="n in nodes" :key="n.label">
          <template v-for="([dx, y], i) in n.pods" :key="i">
            <template v-if="isDown(n.label, i)">
              <rect class="box is-down" :x="n.x + dx" :y="y" width="85" height="62" rx="8" />
              <text class="down-mark" :x="n.x + dx + 42.5" :y="y + 31">✕</text>
            </template>
            <template v-else>
              <rect class="box is-pod" :x="n.x + dx" :y="y" width="85" height="62" rx="8" />
              <text class="box-label" :x="n.x + dx + 42.5" :y="y + 31">Pod</text>
            </template>
          </template>
        </template>
      </g>

      <!-- 代わりの Pod。未定のあいだは Node の外に置き、決まったら Node 2 に動かす -->
      <g
        v-if="recover !== undefined && recover >= 1"
        class="new-pod"
        :class="{ 'is-pending': recover < 3 }"
        :style="{ transform: recover === 1 ? 'translate(25px, -407px)' : 'none' }"
      >
        <rect class="box is-pod" x="835" y="555" width="85" height="62" rx="8" />
        <text class="box-label" x="877.5" y="586">Pod</text>
      </g>

      <!-- コンテナランタイム (CRI) -->
      <g v-if="shown(CRI)" :class="cls(CRI)">
        <template v-for="n in nodes" :key="n.label">
          <rect class="runtime" :x="n.x + 15" y="415" width="240" height="220" />
          <rect class="box is-cri" :x="n.x + 200" y="605" width="55" height="30" />
          <text class="box-label is-small" :x="n.x + 227.5" y="620">CRI</text>
          <!-- kubelet がランタイムに起動を頼む矢印。ランタイムと一緒に出す -->
          <path class="line" :d="`M${n.x + 72},350 V380 H${n.x + 135} V413`" marker-end="url(#k8s-arrow)" />
        </template>
      </g>

      <!-- kubelet -->
      <g v-if="shown(KUBELET)" :class="cls(KUBELET)">
        <template v-for="n in nodes" :key="n.label">
          <rect class="box" :class="{ 'is-focus': recover === 3 && n.label === 'Node 2' }" :x="n.x + 12" y="290" width="120" height="60" rx="8" />
          <text class="box-label is-compact" :x="n.x + 72" y="320">kubelet</text>
        </template>
        <!-- kubelet は api-server とだけ話す -->
        <path
          class="line"
          :d="`M${nodes[0].x + 72},290 V200 M${nodes[1].x + 72},290 V200 H300 V268`"
          marker-end="url(#k8s-arrow)"
        />
      </g>

      <!-- kube-proxy -->
      <g v-if="shown(KUBE_PROXY)" :class="cls(KUBE_PROXY)">
        <template v-for="n in nodes" :key="n.label">
          <rect class="box is-light" :x="n.x + 138" y="290" width="120" height="60" rx="8" />
          <text class="box-label is-dark is-compact" :x="n.x + 198" y="320">kube-proxy</text>
          <path class="line" :d="`M${n.x + 198},350 V380 H${n.x + 135}`" />
        </template>
        <!-- kube-proxy も api-server とだけ話す -->
        <path
          class="line is-dashed"
          :d="`M${nodes[0].x + 198},290 V215 M${nodes[1].x + 198},290 V215 H360 V268`"
          marker-end="url(#k8s-arrow)"
        />
      </g>

      <!-- kube-api-server -->
      <g v-if="shown(API_SERVER)" :class="cls(API_SERVER)">
        <rect class="box" x="190" y="270" width="220" height="70" rx="8" />
        <text class="box-label" x="300" y="305">kube-api-server</text>
      </g>

      <!-- etcd -->
      <g v-if="shown(ETCD)" :class="cls(ETCD)">
        <rect class="box" x="60" y="270" width="100" height="70" rx="8" />
        <text class="box-label" x="110" y="305">etcd</text>
        <!-- api-server は etcd に書き込むだけでなく読み出しもするので、両向きにする -->
        <path class="line" d="M190,305 H162" marker-start="url(#k8s-arrow)" marker-end="url(#k8s-arrow)" />
      </g>

      <!-- kube-scheduler -->
      <g v-if="shown(SCHEDULER)" :class="cls(SCHEDULER)">
        <rect class="box" :class="{ 'is-focus': recover === 2 }" x="60" y="470" width="160" height="80" rx="8" />
        <text class="box-label" x="140" y="497">kube-</text>
        <text class="box-label" x="140" y="523">scheduler</text>
        <path class="line" d="M140,470 V410 H240 V342" marker-end="url(#k8s-arrow)" />
      </g>

      <!-- kube-controller-manager -->
      <g v-if="shown(CONTROLLER_MANAGER)" :class="cls(CONTROLLER_MANAGER)">
        <rect class="box" :class="{ 'is-focus': recover === 1 }" x="235" y="470" width="180" height="80" rx="8" />
        <text class="box-label is-compact" x="325" y="497">kube-controller-</text>
        <text class="box-label is-compact" x="325" y="523">manager</text>
        <path class="line" d="M325,470 V342" marker-end="url(#k8s-arrow)" />
      </g>

      <!-- cloud-controller-manager。クラウドの API を叩く -->
      <g v-if="shown(CLOUD_CONTROLLER_MANAGER)" :class="cls(CLOUD_CONTROLLER_MANAGER)">
        <rect class="box is-light" x="70" y="110" width="330" height="70" rx="8" />
        <text class="box-label is-dark" x="235" y="145">cloud-controller-manager</text>
        <path class="line" d="M235,182 V268" marker-start="url(#k8s-arrow)" marker-end="url(#k8s-arrow)" />
        <path class="line is-dashed" d="M400,145 H1056" marker-end="url(#k8s-arrow)" />
        <path
          class="cloud"
          d="M1090,190 a32,32 0 0 1 -4,-62 a42,42 0 0 1 64,-34 a40,40 0 0 1 64,26 a34,34 0 0 1 -4,70 z"
        />
        <text class="box-label is-dark is-small" x="1145" y="150">Cloud</text>
        <text class="box-label is-dark is-small" x="1145" y="172">Provider API</text>
      </g>
    </svg>
    <aside class="k8s-notes">
      <slot />
    </aside>
  </div>
</template>

<style scoped>
.k8s-arch {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 22rem;
}

.k8s-arch svg {
  flex: none;
  height: 100%;
  color: var(--theme-text);
  font-family: inherit;
}

.k8s-notes {
  flex: 1;
  font-size: var(--theme-font-size-body);
}

/* v-click の説明は Slidev 標準だと一瞬で出るので、図と同じ速さで下からフェードインさせる */
.k8s-notes :slotted(.slidev-vclick-target) {
  transition:
    opacity 0.6s var(--theme-ease-out),
    transform 0.6s var(--theme-ease-out);
}

.k8s-notes :slotted(.slidev-vclick-hidden) {
  transform: translateY(0.5rem);
}

.k8s-notes :slotted(dt) {
  color: var(--theme-red);
  font-weight: 700;
}

.k8s-notes :slotted(dd) {
  margin: 0 0 1rem;
}

/* 補足は小さいグレーの文字にする */
.k8s-notes :slotted(small) {
  display: block;
  margin-top: 0.25rem;
  color: var(--theme-muted);
  font-size: var(--theme-font-size-caption);
}

.frame {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
}

.frame-label {
  fill: currentColor;
  font-size: 24px;
  font-weight: 700;
  text-anchor: middle;
}

.frame-label.is-cluster {
  font-size: 28px;
}

.frame-label.is-node {
  font-size: 22px;
  font-weight: 600;
}

.box {
  fill: var(--theme-indigo);
}

.box.is-light {
  fill: var(--theme-blue);
}

.box.is-pod {
  fill: var(--theme-red);
}

.box.is-cri {
  fill: var(--theme-navy);
}

.box-label {
  fill: #fff;
  font-size: 20px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

.box-label.is-dark {
  fill: var(--theme-navy);
}

.box-label.is-small {
  font-size: 18px;
}

/* 枠に収まらない長いラベル */
.box-label.is-compact {
  font-size: 17px;
}

.runtime {
  fill: none;
  stroke: var(--theme-gray-500);
  stroke-width: 2;
}

.line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.line.is-dashed {
  stroke-dasharray: 6 5;
}

.cloud {
  fill: var(--theme-blue);
}

/* 先読みしたスライドは display: none から表示に切り替わるので、transition では動かない。
   animation なら表示されたときに再生される */
.is-new {
  opacity: 0;
}

.is-new.is-active {
  opacity: 1;
  animation: k8s-fade-in 0.6s var(--theme-ease-out);
}

/* 説明と同じく、少し下から浮かび上がらせる */
@keyframes k8s-fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

.is-new .frame {
  stroke: var(--theme-red);
  stroke-width: 4;
}

.is-new .runtime {
  stroke: var(--theme-red);
  stroke-width: 4;
}

.is-new .frame-label {
  fill: var(--theme-red);
}

/* 塗りの部品は外側に赤い縁取りを付ける */
.is-new .box,
.is-new .cloud {
  stroke: var(--theme-red);
  stroke-width: 8;
  paint-order: stroke;
}

/* Pod は赤いので縁取りを黒にする */
.is-new .box.is-pod {
  stroke: var(--theme-text);
}

.is-new .line {
  stroke: var(--theme-red);
}

/* recover で、いまバトンを持っている登場人物 */
.box.is-focus {
  stroke: var(--theme-red);
  stroke-width: 8;
  paint-order: stroke;
}

/* 落ちた Pod は灰色の点線にして ✕ を付ける */
.box.is-down {
  fill: none;
  stroke: var(--theme-gray-500);
  stroke-width: 2.5;
  stroke-dasharray: 6 5;
}

.down-mark {
  fill: var(--theme-gray-500);
  font-size: 30px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

.new-pod {
  transition: transform 0.6s var(--theme-ease-out);
}

/* まだ動いていない Pod は白抜きの赤い点線にする */
.new-pod.is-pending .box.is-pod {
  fill: #fff;
  stroke: var(--theme-red);
  stroke-width: 3;
  stroke-dasharray: 6 4;
}

.new-pod.is-pending .box-label {
  fill: var(--theme-red);
}
</style>
