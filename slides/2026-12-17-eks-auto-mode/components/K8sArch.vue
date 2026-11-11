<script setup lang="ts">
import { useIsSlideActive } from '@slidev/client'
import { computed } from 'vue'

// Kubernetes の全体像。step 以下の登場人物だけを描き、step で初めて出るものを目立たせる
// (フェードインし、赤くなる)。
// スライドを 1 枚進めるごとに step を 1 つ上げて、登場人物を順に紹介する。
// 最後の登場人物より大きい step では、どれも目立たせずに描く。
// eks: true で EKS の場合の見え方にする (Control Plane を AWS が管理し、Data Plane は用意の仕方を選ぶ)
const { step = Infinity, eks = false, karpenter = false, automode = false, fargate = false } = defineProps<{
  step?: number
  eks?: boolean
  /** Karpenter の居場所 (Fargate で動く Pod) と、EC2 を起動して Node を足す流れを描く */
  karpenter?: boolean
  /** EKS Auto Mode の見え方。eks と一緒に使い、Node の中身と標準のアドオンも AWS の管理として描く */
  automode?: boolean
  /** EKS on Fargate の見え方。eks と一緒に使い、Node の代わりに Pod ごとの VM を描く */
  fargate?: boolean
}>()

// Fargate の VM (1 Pod = 1 Node)。2 列 × 2 段で Data Plane に並べる
const fargateVms = [[475, 240], [745, 240], [475, 450], [745, 450]]

const CLUSTER = 1
const PLANES = 2
const NODES = 3
const PODS = 4
const CRI = 5
const KUBELET = 6
const KUBE_PROXY = 7
const API_SERVER = 8
const ETCD = 9
const SCHEDULER = 10
const CONTROLLER_MANAGER = 11
const CLOUD_CONTROLLER_MANAGER = 12

// 隣のスライドは先にマウントされるので、表示されてからフェードインを始める
const active = useIsSlideActive()
const shown = (n: number) => n <= step
const cls = (n: number) => ({ 'is-new': n === step, 'is-active': active.value })
// EKS の書き込みは、それ自体が新しく出るものとして目立たせる。
// 表示されていないうちに作られることがある (後ろのスライドから戻るときなど) ので、表示に合わせて切り替える
const eksCls = computed(() => ({ 'is-new': true, 'is-active': active.value }))

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
        <text class="frame-label is-cluster" x="525" y="45">{{ eks ? 'EKS Cluster' : 'Cluster' }}</text>
      </g>

      <!-- Control Plane / Data Plane -->
      <g v-if="shown(PLANES)" :class="cls(PLANES)">
        <rect class="frame" x="40" y="60" width="390" height="610" rx="12" />
        <text class="frame-label" x="235" y="92">Control Plane</text>
        <rect class="frame" x="450" y="60" width="570" height="610" rx="12" />
        <text class="frame-label" x="735" y="92">Data Plane</text>
      </g>

      <!-- Node -->
      <g v-if="shown(NODES) && !fargate" :class="cls(NODES)">
        <template v-for="n in nodes" :key="n.label">
          <rect class="frame" :x="n.x" y="230" :width="NODE_W" height="420" rx="10" />
          <text class="frame-label is-node" :x="n.x + NODE_W / 2" y="260">{{ n.label }}</text>
        </template>
      </g>

      <!-- Pod -->
      <g v-if="shown(PODS) && !fargate" :class="cls(PODS)">
        <template v-for="n in nodes" :key="n.label">
          <template v-for="([dx, y], i) in n.pods" :key="i">
            <rect class="box is-pod" :x="n.x + dx" :y="y" width="85" height="62" rx="8" />
            <text class="box-label" :x="n.x + dx + 42.5" :y="y + 31">Pod</text>
          </template>
        </template>
      </g>

      <!-- コンテナランタイム (CRI) -->
      <g v-if="shown(CRI) && !fargate" :class="cls(CRI)">
        <template v-for="n in nodes" :key="n.label">
          <rect class="runtime" :x="n.x + 15" y="415" width="240" height="220" />
          <rect class="box is-cri" :x="n.x + 200" y="605" width="55" height="30" />
          <text class="box-label is-small" :x="n.x + 227.5" y="620">CRI</text>
        </template>
      </g>

      <!-- kubelet -->
      <g v-if="shown(KUBELET) && !fargate" :class="cls(KUBELET)">
        <template v-for="n in nodes" :key="n.label">
          <rect class="box" :x="n.x + 12" y="290" width="120" height="60" rx="8" />
          <text class="box-label is-compact" :x="n.x + 72" y="320">kubelet</text>
          <path class="line" :d="`M${n.x + 72},350 V380 H${n.x + 135} V413`" marker-end="url(#k8s-arrow)" />
        </template>
      </g>

      <!-- kube-proxy -->
      <g v-if="shown(KUBE_PROXY) && !fargate" :class="cls(KUBE_PROXY)">
        <template v-for="n in nodes" :key="n.label">
          <rect class="box is-light" :x="n.x + 138" y="290" width="120" height="60" rx="8" />
          <text class="box-label is-dark is-compact" :x="n.x + 198" y="320">kube-proxy</text>
          <path class="line" :d="`M${n.x + 198},350 V380 H${n.x + 135}`" />
        </template>
      </g>

      <!-- kube-api-server。kubelet と kube-proxy は api-server とだけ話す -->
      <g v-if="shown(API_SERVER)" :class="cls(API_SERVER)">
        <rect class="box" x="190" y="270" width="220" height="70" rx="8" />
        <text class="box-label" x="300" y="305">kube-api-server</text>
        <path
          v-if="fargate"
          class="line"
          d="M602,270 V200 M872,270 V200 H300 V268"
          marker-end="url(#k8s-arrow)"
        />
        <path
          v-if="!fargate"
          class="line"
          :d="`M${nodes[0].x + 72},290 V200 M${nodes[1].x + 72},290 V200 H300 V268`"
          marker-end="url(#k8s-arrow)"
        />
        <path
          v-if="!fargate"
          class="line is-dashed"
          :d="`M${nodes[0].x + 198},290 V215 M${nodes[1].x + 198},290 V215 H360 V268`"
          marker-end="url(#k8s-arrow)"
        />
      </g>

      <!-- etcd -->
      <g v-if="shown(ETCD)" :class="cls(ETCD)">
        <rect class="box" x="60" y="270" width="100" height="70" rx="8" />
        <text class="box-label" x="110" y="305">etcd</text>
        <path class="line" d="M190,305 H162" marker-end="url(#k8s-arrow)" />
      </g>

      <!-- kube-scheduler -->
      <g v-if="shown(SCHEDULER)" :class="cls(SCHEDULER)">
        <rect class="box" x="60" y="470" width="160" height="80" rx="8" />
        <text class="box-label" x="140" y="497">kube-</text>
        <text class="box-label" x="140" y="523">scheduler</text>
        <path class="line" d="M140,470 V410 H240 V342" marker-end="url(#k8s-arrow)" />
      </g>

      <!-- kube-controller-manager -->
      <g v-if="shown(CONTROLLER_MANAGER)" :class="cls(CONTROLLER_MANAGER)">
        <rect class="box" x="235" y="470" width="180" height="80" rx="8" />
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
        <template v-if="eks">
          <text class="box-label is-dark" x="1145" y="160">AWS API</text>
        </template>
        <template v-else>
          <text class="box-label is-dark is-small" x="1145" y="150">Cloud</text>
          <text class="box-label is-dark is-small" x="1145" y="172">Provider API</text>
        </template>
      </g>

      <!-- Karpenter: Data Plane で動く Pod。AWS API で EC2 を起動し、その EC2 が新しい Node として参加する -->
      <g v-if="karpenter" :class="eksCls">
        <!-- Karpenter 自身は、自分が作る Node ではなく Fargate (1 Pod = 1 Node) で動かす。
             kubelet の線と ccm の線の間の帯に置く -->
        <rect class="fargate-node" x="462" y="152" width="236" height="42" rx="6" />
        <rect class="box is-pod" x="468" y="157" width="118" height="32" rx="5" />
        <text class="box-label is-compact" x="527" y="173">Karpenter</text>
        <text class="fargate-label" x="598" y="174">on Fargate</text>
        <!-- どこにいるかを、箱のすぐ上の見出しで指し示す -->
        <text class="callout" x="462" y="140">▼ Karpenter はここ</text>
        <path class="line is-karpenter" d="M698,173 H1056" marker-end="url(#k8s-arrow)" />
        <rect class="new-node" x="1060" y="300" width="160" height="110" rx="10" />
        <text class="new-node-label" x="1140" y="345">新しい Node</text>
        <text class="new-node-label is-sub" x="1140" y="372">(EC2)</text>
        <path class="line is-karpenter" d="M1140,194 V296" marker-end="url(#k8s-arrow)" />
        <text class="karpenter-label" x="1150" y="252">起動</text>
        <path class="line is-karpenter" d="M1058,355 H1044" marker-end="url(#k8s-arrow)" />
        <text class="karpenter-label is-small" x="1140" y="436">クラスターに参加</text>
      </g>

      <!-- EKS: Control Plane は AWS が管理し、利用者からは中身が見えない。Data Plane は用意の仕方を選ぶ -->
      <!-- 色を抜く重ね方 (mix-blend-mode) は半透明の間は下に効かず、ただの塗りつぶしに見える。
           そのためフェードインさせず、最初から最後の見た目で出す -->
      <g v-if="eks">
        <!-- 下の部品の色を抜いてグレーにし、その上から薄く覆う -->
        <rect class="desaturate" x="40" y="60" width="390" height="610" rx="12" />
        <rect class="managed" x="40" y="60" width="390" height="610" rx="12" />
        <text class="owner-label" x="235" y="400">AWS が管理</text>
        <text class="owner-sub" x="235" y="432">中身は見えない・触れない</text>
        <text v-if="!karpenter && !automode && !fargate" class="owner-label is-self" x="735" y="124">用意の仕方を選ぶ</text>
      </g>

      <!-- EKS on Fargate: Node の代わりに、Pod ごとに AWS 側の VM がある。VM の中の kubelet なども AWS が管理する -->
      <!-- Pod に赤い縁取りが付かないよう、新しく出るもの扱い (eksCls) にはしない -->
      <g v-if="fargate">
        <text class="owner-label is-self" x="735" y="124">Pod ごとに AWS が VM を用意 (Fargate)</text>
        <template v-for="([x, y], i) in fargateVms" :key="i">
          <rect class="fargate-vm" :x="x" :y="y" width="255" height="190" rx="10" />
          <text class="fargate-vm-label" :x="x + 14" :y="y + 22">Fargate の VM = Node</text>
          <rect class="fargate-system" :x="x + 15" :y="y + 32" width="225" height="34" rx="6" />
          <text class="band-label" :x="x + 127.5" :y="y + 49">kubelet など (AWS が管理)</text>
          <rect class="box is-pod" :x="x + 72" :y="y + 90" width="110" height="62" rx="8" />
          <text class="box-label" :x="x + 127" :y="y + 121">Pod</text>
        </template>
      </g>

      <!-- EKS Auto Mode: Node (中身は EC2) の OS・kubelet なども、標準のアドオンも AWS が管理する。自分が扱うのは Pod -->
      <!-- 上の eks と同じ理由でフェードインさせない -->
      <g v-if="automode">
        <text class="owner-label is-self" x="735" y="124">Node も AWS が管理 (中身は EC2)</text>
        <rect class="managed-band" x="462" y="150" width="548" height="44" rx="6" />
        <text class="band-label" x="736" y="172">標準のアドオン: Karpenter・VPC CNI・CoreDNS・EBS CSI など</text>
        <template v-for="n in nodes" :key="n.label">
          <rect class="desaturate" :x="n.x" y="232" :width="NODE_W" height="176" rx="10" />
          <rect class="managed" :x="n.x" y="232" :width="NODE_W" height="176" rx="10" />
        </template>
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

/* EKS で AWS が管理する範囲。色を抜いてグレーにし、手の届かないものとして薄く見せる */
.desaturate {
  fill: #808080;
  mix-blend-mode: saturation;
}

.managed {
  fill: rgba(217, 217, 217, 0.85);
  stroke: var(--theme-gray-500);
  stroke-width: 3;
  stroke-dasharray: 10 6;
}

.owner-label {
  fill: var(--theme-gray-700);
  font-size: 32px;
  font-weight: 700;
  text-anchor: middle;
}

.owner-label.is-self {
  fill: var(--theme-navy);
  font-size: 20px;
}

.owner-sub {
  fill: var(--theme-muted);
  font-size: 17px;
  text-anchor: middle;
}

/* Karpenter が EC2 を起動して Node を足す流れ */
.fargate-node {
  fill: var(--theme-red-50);
  stroke: var(--theme-red);
  stroke-width: 3;
  stroke-dasharray: 5 4;
}

.callout {
  fill: var(--theme-red);
  font-size: 18px;
  font-weight: 700;
}

/* Fargate の VM。AWS 側にあって見えないので点線で描く */
.fargate-vm {
  fill: #fff;
  stroke: var(--theme-navy);
  stroke-width: 2;
  stroke-dasharray: 6 4;
}

.fargate-vm-label {
  fill: var(--theme-navy);
  font-size: 15px;
  font-weight: 700;
}

.fargate-system {
  fill: var(--theme-gray-100);
  stroke: var(--theme-gray-500);
  stroke-dasharray: 5 3;
}

/* Auto Mode で AWS が動かす標準のアドオンの帯 */
.managed-band {
  fill: var(--theme-gray-100);
  stroke: var(--theme-gray-500);
  stroke-width: 2;
  stroke-dasharray: 6 4;
}

.band-label {
  fill: var(--theme-gray-700);
  font-size: 15px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
}

.fargate-label {
  fill: var(--theme-navy);
  font-size: 15px;
  font-weight: 700;
  dominant-baseline: central;
}

.line.is-karpenter {
  stroke: var(--theme-red);
  stroke-dasharray: 8 5;
}

.new-node {
  fill: #fff;
  stroke: var(--theme-red);
  stroke-width: 3;
  stroke-dasharray: 8 5;
}

.new-node-label {
  fill: var(--theme-red);
  font-size: 20px;
  font-weight: 700;
  text-anchor: middle;
}

.new-node-label.is-sub {
  font-size: 16px;
  font-weight: 400;
}

.karpenter-label {
  fill: var(--theme-red);
  font-size: 16px;
  font-weight: 700;
}

.karpenter-label.is-small {
  font-size: 14px;
  text-anchor: middle;
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

.is-new {
  opacity: 0;
  transition: opacity 0.6s var(--theme-ease-out);
}

.is-new.is-active {
  opacity: 1;
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
</style>
