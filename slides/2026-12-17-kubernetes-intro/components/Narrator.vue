<script setup lang="ts">
// 物語の語り手 (長老) と吹き出し。語りは本文 (スロット) に「〜のじゃ」で書く
const { mood = 'normal' } = defineProps<{
  mood?: 'normal' | 'happy' | 'panic' | 'tired' | 'sleep' | 'confused' | 'cry' | 'sob'
}>()
</script>

<template>
  <div class="narrator">
    <Yuru class="narrator-face" elder :mood="mood" />
    <div class="narrator-bubble">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.narrator {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.narrator-face {
  flex: none;
  height: 4.5rem;
}

.narrator-bubble {
  position: relative;
  flex: 1;
  padding: 0.6rem 1rem;
  border: 2.5px solid var(--theme-text);
  border-radius: 1rem;
  background: #fff;
}

/* 吹き出しのしっぽ */
.narrator-bubble::before {
  position: absolute;
  top: 50%;
  left: -0.75rem;
  border-width: 0.5rem 0.75rem 0.5rem 0;
  border-style: solid;
  border-color: transparent var(--theme-text) transparent transparent;
  transform: translateY(-50%);
  content: '';
}

.narrator-bubble :slotted(p) {
  margin: 0;
}
</style>
