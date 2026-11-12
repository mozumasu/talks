<script setup lang="ts">
// リンク先のサムネイル (YouTube や記事の OG 画像) をクリックで開けるカードとして出す
const { href, src, caption } = defineProps<{
  href: string
  src: string
  caption?: string
}>()
</script>

<template>
  <a class="link-thumb" :href="href" target="_blank" rel="noopener">
    <img :src="src" alt="">
    <span v-if="caption" class="link-thumb-caption">{{ caption }}</span>
  </a>
</template>

<style scoped>
.link-thumb {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  /* Slidev のリンクは hover で border-style: solid になるので、幅を 0 にして枠が出ないようにする */
  border-width: 0 !important;
  color: inherit;
  text-decoration: none;
}

.link-thumb img {
  height: 9rem;
  width: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 0.375rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
}

.link-thumb-caption {
  font-size: 0.75rem;
  color: var(--theme-muted);
}
</style>
