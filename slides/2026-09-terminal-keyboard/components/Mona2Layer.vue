<script setup lang="ts">
import { computed } from 'vue'
import { CANVAS_H, CANVAS_W, mona2Centered, rectStyle } from './mona2'

// stage はクリック回数。奇数回で次のレイヤーを表示し、偶数回でそのキー数を集計に足す
const { stage = 0 } = defineProps<{ stage?: number }>()

const LABELS: Record<string, string> = {
  esc: 'esc', space: '', ctrl: 'control', del: 'delete', lshift: 'shift',
  tab: 'tab', fn: 'fn', cmd: 'command', opt: 'option',
  quote: "'", ret: 'return', semi: ';', comma: ',', period: '.', slash: '/', bslash: '\\',
}
// 長押しレイヤー。keys に載っていないキーは透過 (デフォルトレイヤーのまま)
type Layer = { hold: string; name: string; keys: Record<string, string> }
const LAYERS: Layer[] = [
  {
    hold: 'space',
    name: '数字・記号レイヤー',
    keys: {
      Q: '-', W: '7', E: '8', R: '9', T: '+',
      A: '/', S: '4', D: '5', F: '6', G: '*',
      Z: '0', X: '1', C: '2', V: '3', B: '.', fn: '=',
      Y: '^', U: '&', I: '~', O: '(', P: ')',
      quote: '_', H: '!', J: '@', K: '#', L: '$', semi: '%',
      N: '[', M: ']', comma: '{', period: '}', slash: '\\',
      bslash: '|',
    },
  },
  {
    hold: 'esc',
    name: 'ファンクションキーレイヤー',
    keys: {
      Y: 'F1', U: 'F2', I: 'F3', O: 'F4', P: 'F5',
      H: 'F6', J: 'F7', K: 'F8', L: 'F9', semi: 'F10',
      slash: 'F11', bslash: 'F12',
    },
  },
]

const mona2 = mona2Centered()
const keys = Object.keys(mona2.pos)
const shown = computed(() => Math.min(Math.ceil(stage / 2), LAYERS.length))
const counted = computed(() => Math.min(Math.floor(stage / 2), LAYERS.length))
const active = computed(() => (shown.value >= 1 ? LAYERS[shown.value - 1] : undefined))
const holdLabel = (id: string) => LABELS[id] || id

const label = (id: string) => active.value?.keys[id] ?? LABELS[id] ?? id

// 集計: デフォルトレイヤー + ここまでに見せたレイヤーのキー数
const DEFAULT_COUNT = keys.length
const tally = computed(() => [
  { name: 'デフォルト', count: DEFAULT_COUNT },
  ...LAYERS.slice(0, counted.value).map((l) => ({
    name: l.name.replace('レイヤー', ''),
    count: Object.keys(l.keys).length,
  })),
])
const total = computed(() => tally.value.reduce((sum, t) => sum + t.count, 0))
</script>

<template>
  <div class="kb">
    <div
      class="kb__canvas"
      :style="{ width: `calc(var(--u) * ${CANVAS_W})`, height: `calc(var(--u) * ${CANVAS_H})` }"
    >
      <div class="kb__case">
        <div
          v-for="(piece, i) in mona2.casePieces"
          :key="i"
          class="kb__case-piece"
          :style="{ ...rectStyle(piece), transform: piece.rot ? `rotate(${piece.rot}deg)` : undefined }"
        />
      </div>
      <div class="kb__knob" :style="rectStyle(mona2.knob)" />
      <div class="kb__ball" :style="rectStyle(mona2.ball)" />
      <div
        v-for="id in keys"
        :key="id"
        class="kb__key"
        :class="{
          'is-long': label(id).length >= 5,
          'is-held': active && id === active.hold,
          'is-number': active && id in active.keys,
          'is-dim': active && id !== active.hold && !(id in active.keys),
        }"
        :style="{ ...rectStyle(mona2.pos[id]), transform: mona2.pos[id].rot ? `rotate(${mona2.pos[id].rot}deg)` : undefined }"
      >
        <span class="kb__label">{{ label(id) }}</span>
      </div>
    </div>
    <div class="kb__caption">
      <span v-if="active"><b>{{ holdLabel(active.hold) }}</b> を長押し → {{ active.name }}</span>
      <span v-else>デフォルトレイヤーには数字も記号もほぼ無い</span>
    </div>
    <div class="kb__tally">
      <template v-for="(t, i) in tally" :key="t.name">
        <span v-if="i > 0" class="kb__tally-op">+</span>
        <span class="kb__tally-item" :class="{ 'is-new': i === tally.length - 1 && i > 0 }">
          <span class="kb__tally-name">{{ t.name }}</span>
          <b>{{ t.count }}</b>
        </span>
      </template>
      <span class="kb__tally-op">=</span>
      <span class="kb__tally-item kb__tally-item--total">
        <span class="kb__tally-name">合計</span>
        <b>{{ total }}</b>
      </span>
    </div>
  </div>
</template>

<style scoped src="./keyboard.css"></style>

<style scoped>
.kb {
  gap: 0.5rem;
}
.kb__tally {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.kb__tally-op {
  font-size: 1.2rem;
  color: #8e8e93;
}
.kb__tally-item {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  background: #f1f1f4;
}
.kb__tally-item b {
  font-size: 1.4rem;
  font-variant-numeric: tabular-nums;
}
.kb__tally-name {
  font-size: 0.75rem;
  color: #6e6e73;
}
.kb__tally-item.is-new {
  background: #dbeafe;
}
.kb__tally-item--total {
  background: #1d4ed8;
  color: #fff;
}
.kb__tally-item--total .kb__tally-name {
  color: rgba(255, 255, 255, 0.8);
}
.kb__key {
  transition:
    background 0.35s ease,
    color 0.35s ease,
    opacity 0.35s ease,
    box-shadow 0.35s ease;
}
.kb__key.is-held {
  background: #1d4ed8;
  border-color: #1e40af;
  box-shadow: none;
  translate: 0 1px;
}
.kb__key.is-number {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1e3a8a;
  font-size: 0.8rem;
  font-weight: 700;
}
.kb__key.is-dim {
  opacity: 0.45;
}
</style>
