<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

// どのシェルにも共通する「キー → 割り当て → 操作 → 画面」の流れを、見た目で追える図。
// キーの割り当ては行の並んだ表で描き、押したキーの行だけが光る。操作は履歴から単語を取り出す様子を描く。
// 最後に、シェルごとの具体的な名前を下に並べる (抽象 → 具体)。
// クリック: 0 キーを押す / 1 割り当てを探す / 2 操作が動く / 3 画面の行が変わる / 4 シェルごとの名前。
// スライド側に clicks: 4 を書く
const { $clicks } = useSlideContext()
const step = computed(() => Math.min($clicks.value, 4))

// その段まで進んだかを、クラス (at-1 〜 at-4) で積み上げて持つ
const stepClasses = computed(() => [1, 2, 3, 4].filter(n => step.value >= n).map(n => `at-${n}`))

const rows = [
  { key: 'Ctrl+A', op: '行頭へ移る' },
  { key: 'Ctrl+W', op: '単語を消す' },
  { key: 'Esc → .', op: '最後の引数を入れる', hit: true },
  { key: 'Ctrl+-', op: '取り消す' },
]

// 4 クリック目に出す、シェルごとの具体的な名前 (行編集の仕組み / 操作の種類と名前)
const shells = [
  { name: 'zsh', editor: 'ZLE', kind: 'Widget', op: 'insert-last-word' },
  { name: 'Bash', editor: 'GNU Readline', kind: 'Readline の関数', op: 'yank-last-arg' },
  { name: 'fish', editor: 'fish 本体', kind: '入力関数', op: 'history-token-search-backward' },
  { name: 'Nushell', editor: 'Reedline', kind: 'イベント', op: 'なし (!$ で代用)' },
]
</script>

<template>
  <div class="kmf-wrap" :class="[`is-step-${step}`, ...stepClasses]">
    <div class="kmf">
      <div class="kmf-key">
        <kbd>Esc → .</kbd>
        <p class="kmf-caption">キーを押す</p>
      </div>

      <span class="kmf-arrow is-1" />

      <div class="kmf-editor">
        <span class="kmf-badge">行編集の仕組み</span>

        <div class="kmf-box is-map">
          <p class="kmf-name"><span class="kmf-no">①</span>キーの割り当てを探す</p>
          <table class="kmf-table">
            <tbody>
            <tr class="kmf-thead">
              <th>キー</th>
              <th>割り当てた操作</th>
            </tr>
            <tr v-for="r in rows" :key="r.key" :class="{ 'is-hit': r.hit }">
              <td><code>{{ r.key }}</code></td>
              <td>{{ r.op }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <span class="kmf-arrow is-2" />

        <div class="kmf-box is-op">
          <p class="kmf-name"><span class="kmf-no">②</span>操作が動く</p>
          <p class="kmf-op">最後の引数を入れる</p>
          <div class="kmf-history">
            <p class="kmf-caption">履歴</p>
            <p class="kmf-hline">cp config.yml <mark>backup/</mark></p>
          </div>
          <p class="kmf-pick">↓ 取り出す</p>
          <p class="kmf-word"><code>backup/</code></p>
        </div>
      </div>

      <span class="kmf-arrow is-3" />

      <div class="kmf-screen">
        <p class="kmf-name"><span class="kmf-no">③</span>画面の行が変わる</p>
        <div class="kmf-term">
          <p class="kmf-past"><span class="kmf-prompt">❯</span>cp config.yml backup/</p>
          <p><span class="kmf-prompt">❯</span>vim <mark class="kmf-new">backup/</mark><span class="kmf-cursor" /></p>
        </div>
      </div>
    </div>

    <div class="kmf-shells">
      <span />
      <b v-for="sh in shells" :key="sh.name" class="kmf-shell-name">{{ sh.name }}</b>

      <span class="kmf-label is-editor">行編集の仕組み</span>
      <span v-for="sh in shells" :key="sh.name">{{ sh.editor }}</span>

      <span class="kmf-label">操作</span>
      <span v-for="sh in shells" :key="sh.name">{{ sh.kind }}<br><code>{{ sh.op }}</code></span>
    </div>
  </div>
</template>

<style scoped>
.kmf-wrap {
  --kmf-dim: 0.25;
}

.kmf {
  display: grid;
  grid-template-columns: 6.5rem 1.6rem 2.1fr 1.6rem 1fr;
  align-items: stretch;
  margin-top: 1rem;
}

.kmf-wrap p {
  margin: 0;
}

.kmf-wrap code {
  padding: 0;
  background: none;
  font-family: var(--slidev-code-font-family, monospace);
  font-variant-ligatures: none;
}

.kmf-key {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.kmf kbd {
  padding: 0.25em 0.6em;
  border: 1px solid var(--theme-gray-200);
  border-bottom-width: 5px;
  border-radius: 0.45em;
  background: var(--theme-background);
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.25rem;
  font-weight: var(--theme-font-weight-bold);
  white-space: nowrap;
}

/* 押した瞬間のへこみ */
.is-step-0 kbd {
  animation: kmf-press 1.2s ease 0.4s 2;
}

@keyframes kmf-press {
  0%, 40%, 100% { transform: none; border-bottom-width: 5px; }
  20% { transform: translateY(3px); border-bottom-width: 2px; }
}

.kmf-caption {
  color: var(--theme-muted);
  font-size: 0.75rem;
}

.kmf-name {
  font-size: 1rem;
  font-weight: var(--theme-font-weight-bold);
}

.kmf-no {
  margin-right: 0.3em;
  color: var(--theme-red);
}

/* 行編集の仕組みの枠 */
.kmf-editor {
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 1.6rem 1fr;
  padding: 1.5rem 0.9rem 0.9rem;
  border: 2px solid var(--theme-red);
  border-radius: 0.9rem;
  background: var(--theme-red-soft);
}

.kmf-badge {
  position: absolute;
  top: -0.85rem;
  left: 1rem;
  padding: 0.1rem 1rem;
  border-radius: 999px;
  background: var(--theme-red);
  color: var(--theme-background);
  font-size: 0.95rem;
  font-weight: var(--theme-font-weight-bold);
  line-height: 1.5;
}

.kmf-box,
.kmf-screen {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.8rem;
  border: 1px solid var(--theme-gray-100);
  border-radius: 0.6rem;
  background: var(--theme-background);
  opacity: var(--kmf-dim);
  transition: opacity 0.3s ease, box-shadow 0.3s ease;
}

/* キーの割り当て */
.kmf-table {
  width: 100%;
  margin: 0;
  border-collapse: separate;
  border-spacing: 0 0.2rem;
  font-size: 0.8rem;
}

.kmf-table th {
  padding: 0 0.5rem;
  border: none;
  color: var(--theme-muted);
  font-size: 0.7rem;
  font-weight: var(--theme-font-weight-bold);
  text-align: left;
}

.kmf-table td {
  padding: 0.25rem 0.5rem;
  border: none;
  background: var(--theme-gray-50, #f6f6f7);
  transition: background 0.3s ease, color 0.3s ease, opacity 0.3s ease;
}

.kmf-table td:first-child {
  width: 4.6rem;
  white-space: nowrap;
  border-radius: 0.3rem 0 0 0.3rem;
}

.kmf-table td:last-child {
  border-radius: 0 0.3rem 0.3rem 0;
}

/* 探すときは、ほかの行を薄くして押したキーの行を光らせる */
.at-1 .kmf-table tr:not(.is-hit) td {
  opacity: 0.4;
}

.at-1 .kmf-table .is-hit td {
  background: var(--theme-red);
  color: var(--theme-background);
  font-weight: var(--theme-font-weight-bold);
}

/* 操作 */
.kmf-op {
  color: var(--theme-red);
  font-size: 0.95rem;
  font-weight: var(--theme-font-weight-bold);
}

.kmf-history {
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  background: var(--theme-gray-50, #f6f6f7);
}

.kmf-hline {
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.8rem;
  white-space: nowrap;
}

.kmf-history mark {
  background: none;
  color: inherit;
  transition: background 0.3s ease 0.3s, color 0.3s ease 0.3s;
}

.at-2 .kmf-history mark {
  border-radius: 0.2rem;
  background: var(--theme-red);
  color: var(--theme-background);
}

.kmf-pick {
  color: var(--theme-red);
  font-size: 0.75rem;
  font-weight: var(--theme-font-weight-bold);
  text-align: center;
}

.kmf-word {
  align-self: center;
  padding: 0.15rem 0.7rem;
  border: 2px dashed var(--theme-red);
  border-radius: 0.4rem;
  font-size: 0.9rem;
}

.kmf-pick,
.kmf-word {
  opacity: 0;
  transform: translateY(-0.4rem);
  transition: opacity 0.3s ease 0.6s, transform 0.3s ease 0.6s;
}

.at-2 .kmf-pick,
.at-2 .kmf-word {
  opacity: 1;
  transform: none;
}

/* 画面 */
.kmf-term {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 0.3rem;
  padding: 0.6rem 0.7rem;
  border-radius: 0.4rem;
  background: #16181d;
  color: #e6e6e6;
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.85rem;
  white-space: pre;
}

.kmf-past {
  opacity: 0.6;
}

.kmf-prompt {
  margin-right: 0.6ch;
  color: #7ee787;
}

.kmf-new {
  display: inline-block;
  max-width: 0;
  overflow: hidden;
  background: none;
  color: #ff7b72;
  font-weight: var(--theme-font-weight-bold);
  vertical-align: bottom;
  transition: max-width 0.5s steps(7) 0.3s;
}

.at-3 .kmf-new {
  max-width: 7ch;
}

.kmf-cursor {
  display: inline-block;
  width: 0.6ch;
  height: 1.1em;
  background: #e6e6e6;
  vertical-align: text-bottom;
}

/* 矢印 */
.kmf-arrow {
  position: relative;
  opacity: var(--kmf-dim);
  transition: opacity 0.3s ease;
}

.kmf-arrow::before {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: var(--theme-red);
  content: '▶';
  font-size: 1rem;
}

/* クリックで 1 段ずつ濃くする */
.at-1 .is-1,
.at-1 .is-map,
.at-2 .is-2,
.at-2 .is-op,
.at-3 .is-3,
.at-3 .kmf-screen {
  opacity: 1;
}

/* 今の段だけ影を付ける */
.is-step-1 .is-map,
.is-step-2 .is-op,
.is-step-3 .kmf-screen {
  box-shadow: 0 0.4rem 1.2rem rgb(0 0 0 / 0.12);
}

/* 最初のコマは画面を見せておく (押す前の状態) */
.is-step-0 .kmf-screen {
  opacity: 0.6;
}

/* 4 クリック目: シェルごとの具体的な名前。枠は付けず、線だけの表にする */
.kmf-shells {
  display: grid;
  grid-template-columns: 7rem repeat(4, 1fr);
  column-gap: 0.8rem;
  row-gap: 0.25rem;
  margin-top: 0.9rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--theme-gray-200);
  font-size: 0.75rem;
  line-height: 1.4;
  opacity: 0;
  transform: translateY(0.5rem);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.at-4 .kmf-shells {
  opacity: 1;
  transform: none;
}

.kmf-shells > * {
  white-space: nowrap;
}

.kmf-shell-name {
  font-size: 0.9rem;
}

/* 図の部品と同じ呼び名。行編集の仕組みは図の枠と同じ赤 */
.kmf-label {
  color: var(--theme-muted);
  font-weight: var(--theme-font-weight-bold);
}

.kmf-label.is-editor {
  color: var(--theme-red);
}

.kmf-shells code {
  color: var(--theme-red);
  font-size: 0.7rem;
  font-weight: var(--theme-font-weight-bold);
}
</style>
