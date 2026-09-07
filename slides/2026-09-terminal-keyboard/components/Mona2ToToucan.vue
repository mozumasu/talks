<script setup lang="ts">
import { computed } from 'vue'
import { CANVAS_H, CANVAS_W, mona2Centered, rectStyle, type Placed } from './mona2'

// stage 0: moNa2 (42 キー)、1 以降: Toucan2 (36 キー) の配列へ移動する
const { stage = 0 } = defineProps<{ stage?: number }>()

const LABELS: Record<string, string> = {
  esc: 'esc', space: '', ctrl: 'control', del: 'delete', lshift: 'shift',
  tab: 'tab', fn: 'fn', cmd: 'command', opt: 'option',
  quote: "'", ret: 'return', semi: ';', comma: ',', period: '.', slash: '/', bslash: '\\',
}

const mona2 = mona2Centered()
const keys = Object.keys(mona2.pos)

// Toucan2 は片手 3 行 × 5 列 + 親指 3 キー。moNa2 から外側 3 列の 4 段目と最内列を
// 落とし、右の \ は親指クラスターへ移す。落ちるキーは 6 個 (42 → 36)
const REMOVED = new Set(['cmd', 'opt', 'tab', 'fn', 'quote', 'ret'])
const ox = mona2.pos.Q.x // 左手の外側列の x
const rx = mona2.pos.Y.x - 1 // 右手の最内列 (quote / ret) の x
const oy = mona2.pos.E.y // 一番高い列の上端 = 基準の y
const toucanPos: Record<string, Placed> = { ...mona2.pos }
// 親指 3 キーは C / V / B (右は N / M とトラックパッド) の真下に、外へ行くほど下がる弧で並ぶ
Object.assign(toucanPos, {
  esc: { x: ox + 2.2, y: oy + 3.35, w: 1, h: 1, rot: 0 },
  space: { x: ox + 3.25, y: oy + 3.5, w: 1, h: 1, rot: 8 },
  ctrl: { x: ox + 4.3, y: oy + 3.8, w: 1, h: 1, rot: 18 },
  del: { x: rx + 0.6, y: oy + 3.8, w: 1, h: 1, rot: -18 },
  lshift: { x: rx + 1.65, y: oy + 3.5, w: 1, h: 1, rot: -8 },
  bslash: { x: rx + 2.7, y: oy + 3.35, w: 1, h: 1, rot: 0 },
})

// ケース: 各列 3 段ぶんの矩形 + 左のディスプレイ列 + 右のトラックパッド + 親指クラスター
const PAD = 0.16
const col = (x: number, y: number, rows: number): Placed => ({ x: x - PAD, y: y - PAD, w: 1 + PAD * 2, h: rows + PAD * 2 })
const leftIds = [['Q', 'A', 'Z'], ['W', 'S', 'X'], ['E', 'D', 'C'], ['R', 'F', 'V'], ['T', 'G', 'B']]
const rightIds = [['Y', 'H', 'N'], ['U', 'J', 'M'], ['I', 'K', 'comma'], ['O', 'L', 'period'], ['P', 'semi', 'slash']]
const toucanCase: Placed[] = [
  ...leftIds.map((ids) => col(mona2.pos[ids[0]].x, mona2.pos[ids[0]].y, 3)),
  ...rightIds.map((ids) => col(mona2.pos[ids[0]].x, mona2.pos[ids[0]].y, 3)),
  col(ox + 5, oy + 0.2, 3), // ディスプレイ列
  { x: rx - 0.75, y: oy + 0.3, w: 1.75, h: 2.6, rot: -6 }, // トラックパッド列
  { x: ox + 1.9, y: oy + 3.15, w: 3.75, h: 1.55, rot: 10 }, // 左の親指クラスター
  { x: rx + 0.3, y: oy + 3.15, w: 3.75, h: 1.55, rot: -10 }, // 右の親指クラスター
]
const display: Placed = { x: ox + 5.1, y: oy + 0.6, w: 0.8, h: 1.3 }
const trackpad: Placed = { x: rx - 0.65, y: oy + 0.65, w: 1.55, h: 1.55, rot: -6 }

const isToucan = computed(() => stage >= 1)
const isGone = (id: string) => isToucan.value && REMOVED.has(id)
const count = computed(() => keys.length - (isToucan.value ? REMOVED.size : 0))

const keyStyle = (id: string, i: number) => {
  const p = isToucan.value ? toucanPos[id] : mona2.pos[id]
  return {
    ...rectStyle(p),
    transform: p.rot ? `rotate(${p.rot}deg)` : undefined,
    transitionDelay: `${(i % 12) * 20}ms`,
  }
}
const pieceStyle = (p: Placed) => ({ ...rectStyle(p), transform: p.rot ? `rotate(${p.rot}deg)` : undefined })
</script>

<template>
  <div class="kb" :class="{ 'is-toucan': isToucan }">
    <div
      class="kb__canvas"
      :style="{ width: `calc(var(--u) * ${CANVAS_W})`, height: `calc(var(--u) * ${CANVAS_H})` }"
    >
      <div class="kb__case kb__case--mona2">
        <div v-for="(piece, i) in mona2.casePieces" :key="i" class="kb__case-piece" :style="pieceStyle(piece)" />
      </div>
      <div class="kb__case kb__case--toucan">
        <div v-for="(piece, i) in toucanCase" :key="i" class="kb__case-piece" :style="pieceStyle(piece)" />
      </div>
      <div class="kb__knob kb__mona2-only" :style="rectStyle(mona2.knob)" />
      <div class="kb__ball kb__mona2-only" :style="rectStyle(mona2.ball)" />
      <div class="kb__display kb__toucan-only" :style="pieceStyle(display)" />
      <div class="kb__trackpad kb__toucan-only" :style="pieceStyle(trackpad)" />
      <div
        v-for="(id, i) in keys"
        :key="id"
        class="kb__key"
        :class="{ 'is-gone': isGone(id), 'is-long': (LABELS[id] ?? id).length >= 5 }"
        :style="keyStyle(id, i)"
      >
        <span class="kb__label">{{ LABELS[id] ?? id }}</span>
      </div>
    </div>
    <div class="kb__caption">
      <span>{{ isToucan ? 'Toucan2 に乗り換えて 6 キー減った' : 'moNa2' }}</span>
      <span class="kb__count"><b>{{ count }}</b> キー</span>
    </div>
  </div>
</template>

<style scoped src="./keyboard.css"></style>

<style scoped>
.kb__case,
.kb__mona2-only,
.kb__toucan-only {
  transition: opacity 0.6s ease;
}
.kb__case--toucan,
.kb__toucan-only {
  opacity: 0;
}
.kb.is-toucan .kb__case--mona2,
.kb.is-toucan .kb__mona2-only {
  opacity: 0;
}
.kb.is-toucan .kb__case--toucan,
.kb.is-toucan .kb__toucan-only {
  opacity: 1;
  transition-delay: 0.3s;
}
.kb__display {
  position: absolute;
  border-radius: 0.15rem;
  background: #1c1c1e;
  box-shadow: inset 0 0 0 2px #3a3a3c;
}
.kb__trackpad {
  position: absolute;
  border-radius: 0.3rem;
  background: #2c2c2e;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
.kb__key {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease,
    left 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    top 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.kb__key.is-gone {
  opacity: 0;
  transform: scale(0.4) rotate(-12deg);
}
</style>
