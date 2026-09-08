<script setup lang="ts">
import { computed } from 'vue'
import { CANVAS_H, CANVAS_W, mona2Centered, rectStyle, type Placed } from './mona2'
import { toucanLayout } from './toucan2'

// stage 0: moNa2 (42 キー)、1 以降: Toucan2 (36 キー) の配列へ移動する
const { stage = 0 } = defineProps<{ stage?: number }>()

const LABELS: Record<string, string> = {
  esc: 'esc', space: '', ctrl: 'control', del: 'delete', lshift: 'shift',
  tab: 'tab', fn: 'fn', cmd: 'command', opt: 'option',
  quote: "'", ret: 'return', semi: ';', comma: ',', period: '.', slash: '/', bslash: '\\',
}

const mona2 = mona2Centered()
const toucan = toucanLayout(mona2)
const keys = Object.keys(mona2.pos)

const isToucan = computed(() => stage >= 1)
const isGone = (id: string) => isToucan.value && !(id in toucan.pos)
const count = computed(() => (isToucan.value ? Object.keys(toucan.pos).length : keys.length))

const keyStyle = (id: string, i: number) => {
  const p = (isToucan.value && toucan.pos[id]) || mona2.pos[id]
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
        <div v-for="(piece, i) in toucan.casePieces" :key="i" class="kb__case-piece" :style="pieceStyle(piece)" />
      </div>
      <div class="kb__knob kb__mona2-only" :style="rectStyle(mona2.knob)" />
      <div class="kb__ball kb__mona2-only" :style="rectStyle(mona2.ball)" />
      <div class="kb__display kb__toucan-only" :style="pieceStyle(toucan.display)" />
      <div class="kb__trackpad kb__toucan-only" :style="pieceStyle(toucan.trackpad)" />
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
      <span>{{ isToucan ? 'さらに 6 キー減った' : '' }}</span>
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
