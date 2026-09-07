<script setup lang="ts">
import { computed } from 'vue'
import { mona2Centered, rectStyle, type Placed } from './mona2'
import { RIGHT_IDS, TOUCAN_PHOTO, toucanLayout } from './toucan2'

// stage 0: 前のスライドと同じ位置に Toucan2 の図を描く。
// 1 以降: 各キーが写真の中の同じキーの位置へ縮みながら移動し、写真に溶け込む
const { stage = 0 } = defineProps<{ stage?: number }>()

const LABELS: Record<string, string> = {
  esc: 'esc', space: '', ctrl: 'control', del: 'delete', lshift: 'shift',
  semi: ';', comma: ',', period: '.', slash: '/', bslash: '\\',
}

// 前のスライド (content レイアウト + mt-6) で図のキャンバスが置かれる位置 (レイアウト左上基準、単位 u)。
// スライドをまたいでも図が動かないよう、ここでも同じ座標に描く
const DRAW_ORIGIN = { x: 3.68, y: 3.29 }
// end レイアウトで写真を置く位置。左 3.5rem (レイアウトの padding に揃える)、幅 22rem
const PHOTO_RECT: Placed = { x: 3.5 / 2.1, y: 7.95 / 2.1, w: 22 / 2.1, h: 22 / 2.1 }

const toucan = toucanLayout(mona2Centered())
const ids = Object.keys(toucan.pos)
const at = (p: Placed): Placed => ({ ...p, x: p.x + DRAW_ORIGIN.x, y: p.y + DRAW_ORIGIN.y })
const center = (p: Placed) => ({ x: p.x + p.w / 2, y: p.y + p.h / 2 })

// 写真のキー位置への写像。左手は Q、右手は Y の中心を基準に、キー間隔の比 k で縮める
const upx = PHOTO_RECT.w / TOUCAN_PHOTO.w // 写真 1px あたりの u
const k = TOUCAN_PHOTO.pitch * upx // 写真上のキー間隔 (u)
const anchors = {
  left: { draw: center(at(toucan.pos.Q)), photo: { x: PHOTO_RECT.x + TOUCAN_PHOTO.q.x * upx, y: PHOTO_RECT.y + TOUCAN_PHOTO.q.y * upx } },
  right: { draw: center(at(toucan.pos.Y)), photo: { x: PHOTO_RECT.x + TOUCAN_PHOTO.y.x * upx, y: PHOTO_RECT.y + TOUCAN_PHOTO.y.y * upx } },
}
const toPhoto = (id: string): Placed => {
  const a = RIGHT_IDS.has(id) ? anchors.right : anchors.left
  const c = center(at(toucan.pos[id]))
  return {
    x: a.photo.x + (c.x - a.draw.x) * k - k / 2,
    y: a.photo.y + (c.y - a.draw.y) * k - k / 2,
    w: k,
    h: k,
    rot: toucan.pos[id].rot,
  }
}

const isPhoto = computed(() => stage >= 1)
const keyStyle = (id: string, i: number) => {
  const p = isPhoto.value ? toPhoto(id) : at(toucan.pos[id])
  return {
    ...rectStyle(p),
    transform: p.rot ? `rotate(${p.rot}deg)` : undefined,
    transitionDelay: `${(i % 12) * 15}ms`,
  }
}
const pieceStyle = (p: Placed) => ({ ...rectStyle(at(p)), transform: p.rot ? `rotate(${p.rot}deg)` : undefined })
const photoSrc = `${import.meta.env.BASE_URL}${TOUCAN_PHOTO.src}`
</script>

<template>
  <div class="ttp" :class="{ 'is-photo': isPhoto }">
    <img class="ttp__photo" :src="photoSrc" alt="Toucan2" :style="rectStyle(PHOTO_RECT)">
    <div class="kb__case ttp__draw">
      <div v-for="(piece, i) in toucan.casePieces" :key="i" class="kb__case-piece" :style="pieceStyle(piece)" />
    </div>
    <div class="ttp__display ttp__draw" :style="pieceStyle(toucan.display)" />
    <div class="ttp__trackpad ttp__draw" :style="pieceStyle(toucan.trackpad)" />
    <div
      v-for="(id, i) in ids"
      :key="id"
      class="kb__key"
      :class="{ 'is-long': (LABELS[id] ?? id).length >= 5 }"
      :style="keyStyle(id, i)"
    >
      <span class="kb__label">{{ LABELS[id] ?? id }}</span>
    </div>
  </div>
</template>

<style scoped src="./keyboard.css"></style>

<style scoped>
/* レイアウト全体に被せ、前のスライドと同じ座標系 (u) で描く */
.ttp {
  --u: 2.1rem;
  --gap: 0.18rem;
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.ttp__photo {
  position: absolute;
  object-fit: cover;
  border-radius: 0.75rem;
  box-shadow: var(--findy-shadow-card, 0 4px 16px rgba(0, 0, 0, 0.15));
  opacity: 0;
  transition: opacity 0.9s ease 0.2s;
}
.ttp.is-photo .ttp__photo {
  opacity: 1;
}
.ttp__display {
  position: absolute;
  border-radius: 0.15rem;
  background: #1c1c1e;
  box-shadow: inset 0 0 0 2px #3a3a3c;
}
.ttp__trackpad {
  position: absolute;
  border-radius: 0.3rem;
  background: #2c2c2e;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
.ttp__draw {
  transition: opacity 0.4s ease;
}
.ttp.is-photo .ttp__draw {
  opacity: 0;
}
/* キーは写真の位置まで縮みながら移動し、着いてから消える */
.kb__key {
  transition:
    left 1s cubic-bezier(0.4, 0, 0.2, 1),
    top 1s cubic-bezier(0.4, 0, 0.2, 1),
    width 1s cubic-bezier(0.4, 0, 0.2, 1),
    height 1s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.5s ease;
}
.ttp.is-photo .kb__key {
  opacity: 0;
  transition-delay: 0s, 0s, 0s, 0s, 0.9s;
}
</style>
