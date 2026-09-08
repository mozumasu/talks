<script setup lang="ts">
import { useIsSlideActive, useNav } from '@slidev/client'
import { onBeforeUnmount, ref, watch } from 'vue'
import { mona2Centered, rectStyle, type Placed } from './mona2'
import { RIGHT_IDS, TOUCAN_PHOTO, toucanLayout, type Side } from './toucan2'

// 前のスライドと同じ位置に Toucan2 の図を描いた状態で始まり、スライドが表示されると
// クリックなしでケースごと写真の中の実機の位置へ縮みながら移動し、着いてから写真に溶け込む。
// スロットの内容 (ふきだしなど) は溶け込みが終わってから出る

const LABELS: Record<string, string> = {
  esc: 'esc', space: '', ctrl: 'control', del: 'delete', lshift: 'shift',
  semi: ';', comma: ',', period: '.', slash: '/', bslash: '\\',
}

// 前のスライド (content レイアウト + mt-6) で図のキャンバスが置かれる位置 (レイアウト左上基準、単位 u)。
// スライドをまたいでも図が動かないよう、ここでも同じ座標に描く
const DRAW_ORIGIN = { x: 3.68, y: 3.29 }
// end レイアウトで写真を置く位置。左 3.5rem (レイアウトの padding に揃える)、幅 22rem
const PHOTO_RECT: Placed = { x: 3.5 / 2.1, y: 7.95 / 2.1, w: 22 / 2.1, h: 22 / 2.1 }
// スライドの fade (0.5s) が終わって図が静止して見えてから動き出すまでの間
const ENTER_DELAY_MS = 700

const toucan = toucanLayout(mona2Centered())
const ids = Object.keys(toucan.pos)
const at = (p: Placed): Placed => ({ ...p, x: p.x + DRAW_ORIGIN.x, y: p.y + DRAW_ORIGIN.y })
const center = (p: Placed) => ({ x: p.x + p.w / 2, y: p.y + p.h / 2 })

// 写真への写像。左手は Q、右手は Y の中心を基準に、キー間隔の比 k で全体を縮める
const upx = PHOTO_RECT.w / TOUCAN_PHOTO.w // 写真 1px あたりの u
const k = TOUCAN_PHOTO.pitch * upx // 写真上のキー間隔 (u)
const anchors: Record<Side, { draw: { x: number, y: number }, photo: { x: number, y: number } }> = {
  left: { draw: center(at(toucan.pos.Q)), photo: { x: PHOTO_RECT.x + TOUCAN_PHOTO.q.x * upx, y: PHOTO_RECT.y + TOUCAN_PHOTO.q.y * upx } },
  right: { draw: center(at(toucan.pos.Y)), photo: { x: PHOTO_RECT.x + TOUCAN_PHOTO.y.x * upx, y: PHOTO_RECT.y + TOUCAN_PHOTO.y.y * upx } },
}
const toPhoto = (p: Placed, side: Side): Placed => {
  const a = anchors[side]
  const c = center(at(p))
  return {
    x: a.photo.x + (c.x - a.draw.x) * k - (p.w * k) / 2,
    y: a.photo.y + (c.y - a.draw.y) * k - (p.h * k) / 2,
    w: p.w * k,
    h: p.h * k,
    rot: p.rot,
  }
}

// スライドを離れたら図に戻し、戻ってきたときにもう一度再生する。
// 印刷 / エクスポートでは全スライドが同時にアクティブになるので、待たずに最終状態にする
const active = useIsSlideActive()
const { isPrintMode } = useNav()
const isPhoto = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
watch(active, (isActive) => {
  clearTimeout(timer)
  if (!isActive)
    isPhoto.value = false
  else if (isPrintMode.value)
    isPhoto.value = true
  else
    timer = setTimeout(() => { isPhoto.value = true }, ENTER_DELAY_MS)
}, { immediate: true })
onBeforeUnmount(() => clearTimeout(timer))

const place = (p: Placed, side: Side) => (isPhoto.value ? toPhoto(p, side) : at(p))
const styleOf = (p: Placed) => ({ ...rectStyle(p), transform: p.rot ? `rotate(${p.rot}deg)` : undefined })
const keyStyle = (id: string, i: number) => ({
  ...styleOf(place(toucan.pos[id], RIGHT_IDS.has(id) ? 'right' : 'left')),
  transitionDelay: isPhoto.value ? `${(i % 12) * 15}ms, ${(i % 12) * 15}ms, ${(i % 12) * 15}ms, ${(i % 12) * 15}ms, 0.9s` : '0s',
})
const photoSrc = `${import.meta.env.BASE_URL}${TOUCAN_PHOTO.src}`
</script>

<template>
  <div class="ttp" :class="{ 'is-photo': isPhoto }">
    <img class="ttp__photo" :src="photoSrc" alt="Toucan2" :style="rectStyle(PHOTO_RECT)">
    <div class="kb__case ttp__fade">
      <div v-for="(piece, i) in toucan.casePieces" :key="i" class="kb__case-piece ttp__move" :style="styleOf(place(piece, piece.side))" />
    </div>
    <div class="ttp__display ttp__move ttp__fade" :style="styleOf(place(toucan.display, toucan.display.side))" />
    <div class="ttp__trackpad ttp__move ttp__fade" :style="styleOf(place(toucan.trackpad, toucan.trackpad.side))" />
    <div
      v-for="(id, i) in ids"
      :key="id"
      class="kb__key ttp__move ttp__fade"
      :class="{ 'is-long': (LABELS[id] ?? id).length >= 5 }"
      :style="keyStyle(id, i)"
    >
      <span class="kb__label">{{ LABELS[id] ?? id }}</span>
    </div>
    <div class="ttp__after">
      <slot />
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
  transition: opacity 0.9s ease 0.55s;
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
/* 図の部品はすべて写真の中の位置まで縮みながら移動し、着いてから消える。
   ttp__move と ttp__fade を両方持つ要素では後に書いた ttp__move の transition が勝つ必要がある */
.ttp__fade {
  transition: opacity 0.5s ease;
}
.ttp__move {
  transition:
    left 1s cubic-bezier(0.4, 0, 0.2, 1),
    top 1s cubic-bezier(0.4, 0, 0.2, 1),
    width 1s cubic-bezier(0.4, 0, 0.2, 1),
    height 1s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.5s ease;
}
.ttp.is-photo .ttp__fade {
  opacity: 0;
  transition-delay: 0.9s;
}
.ttp.is-photo .ttp__move.ttp__fade {
  transition-delay: 0s, 0s, 0s, 0s, 0.9s;
}
/* スロットは v-click と同じ左からの滑り込みで、溶け込みが終わってから出す */
.ttp__after {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateX(-0.6rem);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.ttp.is-photo .ttp__after {
  opacity: 1;
  transform: none;
  transition-delay: 1.3s;
}
/* end レイアウトの左上ロゴと背景のウォーターマークは、ページが切り替わった瞬間には出さず、
   ふきだしと同じタイミングで出す。ウォーターマークは外側に inline の opacity があるので img 側を動かす */
:global(.slidev-layout.end:has(.ttp) .end-head) {
  opacity: 0;
  transition: opacity 0.4s ease;
}
:global(.slidev-layout.end:has(.ttp) .findy-watermark__img) {
  opacity: 0;
  transition: opacity 0.8s ease;
}
:global(.slidev-layout.end:has(.ttp.is-photo) .end-head),
:global(.slidev-layout.end:has(.ttp.is-photo) .findy-watermark__img) {
  opacity: 1;
  transition-delay: 1.3s;
}
</style>
