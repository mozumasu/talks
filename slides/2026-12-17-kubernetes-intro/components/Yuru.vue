<script setup lang="ts">
// 物語の場面で使う、ゆるい人のイラスト。丸い頭と線の体だけで描く。
// mood で表情とポーズを変え、elder で語り手の長老 (ひげと杖) にする
const { mood = 'normal', elder = false } = defineProps<{
  mood?: 'normal' | 'happy' | 'panic' | 'tired' | 'sleep' | 'confused' | 'cry' | 'sob'
  elder?: boolean
}>()

// 腕の形。慌てる・喜ぶときは上げる
const arms = {
  normal: 'M60,86 L40,108 M60,86 L80,108',
  happy: 'M60,86 L36,66 M60,86 L84,66',
  panic: 'M60,86 L32,70 M60,86 L88,70',
  tired: 'M60,88 L46,116 M60,88 L74,116',
  sleep: 'M60,86 L42,104 M60,86 L78,104',
  confused: 'M60,86 L40,108 M60,86 L82,62',
  cry: 'M60,86 L34,64 M60,86 L86,64',
  sob: 'M60,88 L46,116 M60,88 L74,116',
}
</script>

<template>
  <svg class="yuru" viewBox="0 0 120 160" role="img" :aria-label="elder ? '語り手の長老' : '人'">
    <!-- 体・腕・脚 -->
    <path class="yuru-line" d="M60,74 V116 M60,116 L45,148 M60,116 L75,148" />
    <path class="yuru-line" :d="arms[mood]" />
    <!-- 長老の杖 -->
    <path v-if="elder" class="yuru-line" d="M86,92 V150 M86,92 q0,-8 -7,-8" />

    <!-- 頭 -->
    <circle class="yuru-head" cx="60" cy="45" r="28" />


    <!-- 顔 -->
    <g v-if="mood === 'normal'">
      <circle class="yuru-dot" cx="50" cy="43" r="3" />
      <circle class="yuru-dot" cx="70" cy="43" r="3" />
      <path v-if="!elder" class="yuru-line is-thin" d="M51,55 Q60,62 69,55" />
    </g>
    <g v-else-if="mood === 'happy'">
      <path class="yuru-line is-thin" d="M45,45 Q50,38 55,45 M65,45 Q70,38 75,45" />
      <path v-if="!elder" class="yuru-mouth" d="M48,53 Q60,68 72,53 z" />
    </g>
    <g v-else-if="mood === 'panic'">
      <circle class="yuru-eye" cx="49" cy="42" r="6" />
      <circle class="yuru-eye" cx="71" cy="42" r="6" />
      <circle class="yuru-dot" cx="49" cy="42" r="2" />
      <circle class="yuru-dot" cx="71" cy="42" r="2" />
      <ellipse class="yuru-mouth" cx="60" cy="58" rx="5" ry="7" />
      <!-- 冷や汗 -->
      <path class="yuru-sweat" d="M90,26 q5,9 0,12 q-5,-3 0,-12 z M96,42 q4,7 0,9 q-4,-2 0,-9 z" />
    </g>
    <g v-else-if="mood === 'tired'">
      <path class="yuru-line is-thin" d="M45,43 H55 M65,43 H75" />
      <!-- 目の下のクマ -->
      <path class="yuru-bags" d="M45,49 Q50,53 55,49 M65,49 Q70,53 75,49" />
      <path class="yuru-line is-thin" d="M50,60 q3,-3 5,0 q3,3 5,0 q3,-3 5,0" />
    </g>
    <g v-else-if="mood === 'sleep'">
      <path class="yuru-line is-thin" d="M45,42 Q50,47 55,42 M65,42 Q70,47 75,42" />
      <path class="yuru-line is-thin" d="M56,57 H64" />
      <text class="yuru-mark" x="88" y="22">Z</text>
      <text class="yuru-mark is-small" x="100" y="10">z</text>
    </g>
    <g v-else-if="mood === 'cry'">
      <!-- ぎゅっとつぶった > < の目と、寄せた眉 -->
      <path class="yuru-line is-thin" d="M44,36 L55,41 L44,46 M76,36 L65,41 L76,46" />
      <path class="yuru-line is-thin" d="M43,30 L53,33 M77,30 L67,33" />
      <!-- 滝のような涙 -->
      <path class="yuru-tear" d="M44,47 C39,58 37,68 41,78 C46,76 48,64 48,49 Z M76,47 C81,58 83,68 79,78 C74,76 72,64 72,49 Z" />
      <!-- 大きく開けて泣く口 -->
      <path class="yuru-cry-mouth" d="M48,54 Q60,49 72,54 Q74,71 60,73 Q46,71 48,54 Z" />
      <ellipse class="yuru-tongue" cx="60" cy="68" rx="7" ry="3.5" />
      <!-- 怒りマークと、ぶるぶる震える線 -->
      <path class="yuru-line is-thin" d="M22,14 l9,9 M31,14 l-9,9" />
      <path class="yuru-line is-thin" d="M92,18 l7,-6 M96,26 l9,-4 M98,35 l10,-1" />
    </g>
    <g v-else-if="mood === 'sob'">
      <!-- こらえきれずに泣く顔: 眉間のしわ、赤く腫れた目、筋になって流れる涙、食いしばった歯 -->
      <path class="yuru-line is-thin" d="M40,37 Q47,36 56,29 M80,37 Q73,36 64,29" />
      <path class="yuru-wrinkle" d="M58,33 q-1,-5 1,-10 M62,33 q1,-5 -1,-10 M42,48 q7,4 13,0 M65,48 q7,4 13,0 M38,46 q-3,4 -1,9 M82,46 q3,4 1,9" />
      <ellipse class="yuru-red-eye" cx="49" cy="42" rx="5.5" ry="3" />
      <ellipse class="yuru-red-eye" cx="71" cy="42" rx="5.5" ry="3" />
      <circle class="yuru-dot" cx="49" cy="42" r="1.8" />
      <circle class="yuru-dot" cx="71" cy="42" r="1.8" />
      <path class="yuru-stream" d="M46,46 C45,56 47,64 45,74 M50,46 C51,58 49,66 50,78 M70,46 C69,58 71,66 70,78 M74,46 C75,56 73,64 75,74" />
      <!-- への字に食いしばった歯 -->
      <path class="yuru-teeth" d="M48,59 Q60,52 72,59 L71,66 Q60,61 49,66 Z" />
      <path class="yuru-teeth-line" d="M48.5,62.5 Q60,56.5 71.5,62.5 M54,56.5 V64 M60,55 V62 M66,56.5 V64" />
    </g>
    <g v-else-if="mood === 'confused'">
      <circle class="yuru-dot" cx="50" cy="43" r="3" />
      <circle class="yuru-dot" cx="70" cy="43" r="3" />
      <path class="yuru-line is-thin" d="M48,58 l4,-3 l4,3 l4,-3 l4,3 l4,-3" />
      <text class="yuru-mark is-red" x="92" y="30">?</text>
    </g>
    <!-- 長老のひげと眉。顔のあとに描いて、口をひげで隠す -->
    <template v-if="elder">
      <!-- もこもこの長いあごひげ。胸の下まで垂らす -->
      <path
        class="yuru-beard"
        d="M34,48 C30,62 34,72 40,76 C38,86 44,94 50,96 C50,106 56,112 60,116 C64,112 70,106 70,96 C76,94 82,86 80,76 C86,72 90,62 86,48 C78,58 70,62 60,62 C50,62 42,58 34,48 Z"
      />
      <path class="yuru-wisp" d="M48,72 q3,9 0,16 M60,70 v24 M72,72 q-3,9 0,16" />
      <!-- 口ひげ -->
      <path class="yuru-beard" d="M60,56 C54,49 44,49 37,57 C46,60 54,59 60,56 Z M60,56 C66,49 76,49 83,57 C74,60 66,59 60,56 Z" />
      <!-- 太い眉 -->
      <path class="yuru-beard" d="M41,35 C45,27 53,27 57,33 C52,34 46,34 41,35 Z M79,35 C75,27 67,27 63,33 C68,34 74,34 79,35 Z" />
    </template>
  </svg>
</template>

<style scoped>
/* 高さは使う側のクラスで決める (ここで決めると、scoped のほうが強くて上書きできない) */
.yuru {
  display: block;
  overflow: visible;
  color: var(--theme-text);
}

.yuru-line {
  fill: none;
  stroke: currentColor;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.yuru-line.is-thin {
  stroke-width: 3;
}

.yuru-head {
  fill: #fff;
  stroke: currentColor;
  stroke-width: 4;
}

.yuru-beard {
  fill: #fff;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linejoin: round;
}

.yuru-wisp {
  fill: none;
  stroke: var(--theme-gray-500);
  stroke-width: 2;
  stroke-linecap: round;
}

.yuru-dot {
  fill: currentColor;
}

.yuru-eye {
  fill: #fff;
  stroke: currentColor;
  stroke-width: 2.5;
}

.yuru-mouth {
  fill: var(--theme-red);
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.yuru-wrinkle {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.yuru-red-eye {
  fill: #fecaca;
  stroke: var(--theme-red);
  stroke-width: 2;
}

.yuru-stream {
  fill: none;
  stroke: #60a5fa;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.yuru-teeth {
  fill: #fff;
  stroke: currentColor;
  stroke-width: 2.5;
}

.yuru-teeth-line {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
}

.yuru-tear {
  fill: #60a5fa;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linejoin: round;
}

.yuru-cry-mouth {
  fill: #1e1e2e;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.yuru-tongue {
  fill: var(--theme-red);
}

.yuru-sweat {
  fill: #60a5fa;
}

.yuru-bags {
  fill: none;
  stroke: var(--theme-gray-500);
  stroke-width: 3;
  stroke-linecap: round;
}

.yuru-mark {
  fill: currentColor;
  font-size: 22px;
  font-weight: 700;
}

.yuru-mark.is-small {
  font-size: 15px;
}

.yuru-mark.is-red {
  fill: var(--theme-red);
  font-size: 30px;
}
</style>
