<script setup lang="ts">
import { computed } from 'vue'
import { CANVAS_H, CANVAS_W, mona2Centered, rectStyle, type Placed } from './mona2'

// stage はスライドのクリック回数。gone <= stage のキーが消え、SPLIT で残りが分割配列に移動する
const { stage = 0 } = defineProps<{ stage?: number }>()

// t: 上段の刻印 (Shift 側)、sensor: Touch ID (キー数には含めない)、id: moNa2 上の位置
type Key = { l: string; w?: number; gone?: number; gap?: number; t?: string; sensor?: boolean; id?: string }

const NUMPAD = 1
const FN = 2
const ARROW = 3
const NUM = 4
const EXTRA = 5
const SPLIT = 6

const k = (l: string, w = 1, gone?: number, gap?: number): Key => ({ l, w, gone, gap })
const kt = (t: string, l: string, gone?: number): Key => ({ t, l, w: 1, gone })
const seq = (chars: string) => [...chars].map((c) => k(c))
const fn = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => k(`F${from + i}`, 1, FN))
const at = (key: Key, id: string): Key => ({ ...key, id })

const alpha = Object.fromEntries([...'QWERTYUIOPASDFGHJKLZXCVBNM'].map((c) => [c, at(k(c), c)]))
const A = (chars: string) => [...chars].map((c) => alpha[c])

// Magic Keyboard (US 配列、テンキー付き) を模している
const main: Key[][] = [
  [at(k('esc', 1.5), 'esc'), ...fn(1, 12), { l: '', w: 1, sensor: true }],
  [
    kt('~', '`', NUM), kt('!', '1', NUM), kt('@', '2', NUM), kt('#', '3', NUM), kt('$', '4', NUM),
    kt('%', '5', NUM), kt('^', '6', NUM), kt('&', '7', NUM), kt('*', '8', NUM), kt('(', '9', NUM),
    kt(')', '0', NUM), kt('_', '-', NUM), kt('+', '=', NUM), at(k('delete', 1.5), 'del'),
  ],
  [at(k('tab', 1.5), 'tab'), ...A('QWERTYUIOP'), kt('{', '[', EXTRA), kt('}', ']', EXTRA), at(kt('|', '\\'), 'bslash')],
  [k('caps lock', 1.75, EXTRA), ...A('ASDFGHJKL'), at(kt(':', ';'), 'semi'), at(kt('"', "'"), 'quote'), at(k('return', 1.75), 'ret')],
  [at(k('shift', 2.25), 'lshift'), ...A('ZXCVBNM'), at(kt('<', ','), 'comma'), at(kt('>', '.'), 'period'), at(kt('?', '/'), 'slash'), k('shift', 2.25, EXTRA)],
  [
    at(k('fn'), 'fn'), at(k('control'), 'ctrl'), at(k('option'), 'opt'), at(k('command', 1.25), 'cmd'), at(k('', 7), 'space'),
    k('command', 1.25, EXTRA), k('option', 1, EXTRA), k('control', 1, EXTRA),
  ],
]

const nav: Key[][] = [
  [k('F13', 1, FN), k('F14', 1, FN), k('F15', 1, FN)],
  [k('▤', 1, ARROW), k('↖', 1, ARROW), k('⇞', 1, ARROW)],
  [k('⌦', 1, ARROW), k('↘', 1, ARROW), k('⇟', 1, ARROW)],
  [],
  [k('▲', 1, ARROW, 1)],
  [k('◀', 1, ARROW), k('▼', 1, ARROW), k('▶', 1, ARROW)],
]

const numpad: Key[][] = [
  [k('F16'), k('F17'), k('F18'), k('F19')],
  [k('clear'), k('='), k('/'), k('*')],
  ...[seq('789'), seq('456'), seq('123')].map((r, i) => [...r, k(['-', '+', 'enter'][i])]),
  [k('0', 2), k('.')],
].map((row) => row.map((key) => ({ ...key, gone: NUMPAD })))

// ---- Magic Keyboard 上の座標 (単位: u) ----
const FN_ROW_H = 0.62
const BLOCK_GAP = 0.45
const blocks: { rows: Key[][]; x0: number }[] = [
  { rows: main, x0: 0 },
  { rows: nav, x0: 14.5 + BLOCK_GAP },
  { rows: numpad, x0: 14.5 + BLOCK_GAP + 3 + BLOCK_GAP },
]
const MAC_W = CANVAS_W
const MAC_H = CANVAS_H

const macPos = new Map<Key, Placed>()
for (const { rows, x0 } of blocks) {
  rows.forEach((row, ri) => {
    let x = x0
    const y = ri === 0 ? 0 : FN_ROW_H + (ri - 1)
    const h = ri === 0 ? FN_ROW_H : 1
    for (const key of row) {
      x += key.gap ?? 0
      macPos.set(key, { x, y, w: key.w ?? 1, h })
      x += key.w ?? 1
    }
  })
}

// ---- 分割キーボード (moNa2) は Magic Keyboard の中央に重ねる ----
const mona2 = mona2Centered()
const splitPos = (key: Key) => (key.id ? mona2.pos[key.id] : undefined)

const allKeys = blocks.flatMap((b) => b.rows.flat())
const countable = allKeys.filter((key) => !key.sensor)

const isSplit = computed(() => stage >= SPLIT)
const isGone = (key: Key) =>
  (key.gone !== undefined && key.gone <= stage) || (isSplit.value && !splitPos(key))
const count = computed(() => countable.filter((key) => !isGone(key)).length)

const keyStyle = (key: Key, i: number) => {
  const placed = isSplit.value ? splitPos(key) : undefined
  return {
    ...rectStyle(placed ?? macPos.get(key)!),
    transform: placed?.rot ? `rotate(${placed.rot}deg)` : undefined,
    transitionDelay: isSplit.value ? `${(i % 12) * 25}ms` : '0ms',
  }
}

const captions = [
  'フルサイズ',
  'テンキーが無くなって (テンキーレス)',
  'ファンクションキーが無くなって',
  '矢印キーが無くなって',
  '数字キーも無くなった',
  '記号と右側の修飾キーも削った',
  '分割キーボードにあてはめると',
]
const caption = computed(() => captions[Math.min(stage, captions.length - 1)])
</script>

<template>
  <div class="kb" :class="{ 'is-split': isSplit }">
    <div
      class="kb__canvas"
      :style="{ width: `calc(var(--u) * ${MAC_W})`, height: `calc(var(--u) * ${MAC_H})` }"
    >
      <div class="kb__board kb__board--mac" />
      <div class="kb__case kb__fade">
        <div
          v-for="(piece, i) in mona2.casePieces"
          :key="i"
          class="kb__case-piece"
          :style="{ ...rectStyle(piece), transform: piece.rot ? `rotate(${piece.rot}deg)` : undefined }"
        />
      </div>
      <div class="kb__knob kb__fade kb__fade--late" :style="rectStyle(mona2.knob)" />
      <div class="kb__ball kb__fade kb__fade--late" :style="rectStyle(mona2.ball)" />
      <div
        v-for="(key, i) in allKeys"
        :key="i"
        class="kb__key"
        :class="{
          'is-gone': isGone(key),
          'is-sensor': key.sensor,
          'is-wide': !isSplit && (key.w ?? 1) > 1,
          'is-long': key.l.length >= 5,
        }"
        :style="keyStyle(key, i)"
      >
        <span v-if="key.t" class="kb__top">{{ key.t }}</span>
        <span class="kb__label">{{ key.l }}</span>
      </div>
    </div>
    <div class="kb__caption">
      <span class="kb__caption-text">{{ caption }}</span>
      <span class="kb__count"><b>{{ count }}</b> キー</span>
    </div>
  </div>
</template>

<style scoped src="./keyboard.css"></style>

<style scoped>
.kb__board {
  position: absolute;
  border-radius: 0.7rem;
  background: linear-gradient(#e4e4e8, #cfcfd4);
  box-shadow: 0 1px 0 #b8b8be, 0 3px 8px rgba(0, 0, 0, 0.12);
  transition: opacity 0.6s ease;
}
.kb__board--mac {
  inset: -0.55rem calc(-0.55rem + var(--gap)) calc(-0.55rem + var(--gap)) -0.55rem;
}
.kb__fade {
  opacity: 0;
  transition: opacity 0.6s ease;
}
.kb__fade--late {
  transition-delay: 0.4s;
}
.kb.is-split .kb__board--mac {
  opacity: 0;
}
.kb.is-split .kb__fade {
  opacity: 1;
}
.kb__key {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease,
    left 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    top 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.kb__key.is-wide .kb__label {
  align-self: flex-end;
  margin-right: 0.3rem;
}
.kb__key.is-sensor {
  background: radial-gradient(circle at 50% 50%, #e8e8ec 0 42%, transparent 46%), #fbfbfd;
}
.kb__key.is-gone {
  opacity: 0;
  transform: scale(0.4) rotate(-12deg);
}
</style>
