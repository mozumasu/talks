<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

// シェル本体と行編集の仕組みの関係を、4 つのシェルで並べる図。
// 左の 2 つ (zsh / fish) は行編集が本体の中、右の 2 つ (Bash / Nushell) は本体の外にある。
// クリック: 0 枠だけ / 1 本体の中 / 2 本体の外。スライド側に clicks: 2 以上を書く
const { $clicks } = useSlideContext()
const step = computed(() => Math.min($clicks.value, 2))
</script>

<template>
  <div class="ser" :class="`is-step-${step}`">
    <section class="ser-group is-inside">
      <p class="ser-group-title">行編集がシェル本体の<em>中</em>にある</p>
      <div class="ser-cards">
        <div class="ser-card">
          <div class="ser-shell">
            <span class="ser-shell-name">zsh</span>
            <div class="ser-editor is-module">
              <b>ZLE</b>
              <span>モジュール <code>zsh/zle</code></span>
            </div>
          </div>
          <p class="ser-note">対話シェルのときだけ読み込む</p>
        </div>
        <div class="ser-card">
          <div class="ser-shell">
            <span class="ser-shell-name">fish</span>
            <div class="ser-editor is-builtin">
              <b>行編集</b>
              <span>本体に組み込み</span>
            </div>
          </div>
          <p class="ser-note">fish の一部</p>
        </div>
      </div>
    </section>

    <section class="ser-group is-outside">
      <p class="ser-group-title">行編集がシェル本体の<em>外</em>にある (ライブラリ)</p>
      <div class="ser-cards">
        <div class="ser-card">
          <div class="ser-shell is-small"><span class="ser-shell-name">bash</span></div>
          <span class="ser-link" />
          <div class="ser-editor is-library">
            <b>GNU Readline</b>
          </div>
          <div class="ser-users">
            <span>gdb</span><span>sqlite3</span><span>Python</span>
          </div>
          <p class="ser-note">ほかのツールも使う</p>
        </div>
        <div class="ser-card">
          <div class="ser-shell is-small"><span class="ser-shell-name">nu</span></div>
          <span class="ser-link" />
          <div class="ser-editor is-library">
            <b>Reedline</b>
          </div>
          <div class="ser-users is-plain">
            <span>Rust の crate</span>
          </div>
          <p class="ser-note">主に Nushell のために開発</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ser {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.ser p {
  margin: 0;
}

.ser code {
  padding: 0;
  background: none;
  font-family: var(--slidev-code-font-family, monospace);
}

.ser-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  opacity: 0;
  transform: translateY(0.5rem);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.is-step-1 .is-inside,
.is-step-2 .is-inside,
.is-step-2 .is-outside {
  opacity: 1;
  transform: none;
}

.ser-group-title {
  font-size: 1.1rem;
  font-weight: var(--theme-font-weight-bold);
  text-align: center;
}

.ser-group-title em {
  color: var(--theme-red);
  font-style: normal;
}

.ser-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.ser-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 0.8rem;
  border-radius: 0.8rem;
  background: var(--theme-gray-50, #f6f6f7);
}

/* シェル本体の箱 */
.ser-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.7rem 0.7rem 0.9rem;
  border: 2px solid #3a3a3c;
  border-radius: 0.6rem;
  background: var(--theme-background);
}

.ser-shell.is-small {
  padding: 0.5rem;
}

.ser-shell-name {
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.1rem;
  font-weight: var(--theme-font-weight-bold);
}

/* 行編集の仕組みの箱 */
.ser-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  width: 100%;
  padding: 0.6rem 0.4rem;
  border: 2px solid var(--theme-red);
  border-radius: 0.5rem;
  background: var(--theme-red-soft);
  text-align: center;
}

.ser-editor b {
  font-size: 1rem;
}

.ser-editor span {
  color: var(--theme-muted);
  font-size: 0.72rem;
}

/* 必要なときに読み込む部品は点線 */
.ser-editor.is-module {
  border-style: dashed;
}

/* 本体とつながっている線 */
.ser-link {
  width: 2px;
  height: 1.2rem;
  background: #3a3a3c;
}

.ser-users {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3rem;
}

.ser-users span {
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--theme-gray-200);
  border-radius: 999px;
  background: var(--theme-background);
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.7rem;
}

.ser-users.is-plain span {
  border-style: dashed;
  font-family: inherit;
}

.ser-note {
  margin-top: auto !important;
  color: var(--theme-muted);
  font-size: 0.75rem;
  text-align: center;
}
</style>
