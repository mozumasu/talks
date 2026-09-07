---
theme: findy
draft: false
title: CLIオタクのキーボード事情
info: |
  CLIオタクのキーボード事情
  https://mosh.connpass.com/event/400858/
class: text-left
comark: true
routerMode: hash
favicon: https://github.com/mozumasu.png
addons:
  - slidev-addon-findy
layout: talk-cover
event: MOSH Tech Meetup 2026.9.9
image: https://github.com/mozumasu.png
name: mozumasu
role: ファインディ / Platform SRE
---

# CLIオタクのキーボード事情

---
layout: profile
image: https://github.com/mozumasu.png
name: mozumasu
role: ファインディ / Platform SRE
---

## 自己紹介

<div class="grid grid-cols-2 gap-4 mt-4">
  <FindyStat label="分割キーボード" value="3" unit="台" />
  <FindyStat label="キーボード" value="5" unit="台" color="green" />
</div>

- 圧倒的無刻印派
- 40% キーボード派

<div class="grid grid-cols-3 gap-3 mt-4">
  <figure v-click class="m-0">
    <img :src="$asset('desk-underside.jpg')" class="w-full h-32 object-cover rounded-lg" />
    <figcaption class="text-sm text-center mt-1 op70">机の裏に貼ったり</figcaption>
  </figure>
  <figure v-click class="m-0">
    <img :src="$asset('oshi-pouch.jpg')" class="w-full h-32 object-cover rounded-lg" />
    <figcaption class="text-sm text-center mt-1 op70">推し活ポーチに入れたり</figcaption>
  </figure>
  <figure v-click class="m-0">
    <img :src="$asset('hanami.jpg')" class="w-full h-32 object-cover rounded-lg" />
    <figcaption class="text-sm text-center mt-1 op70">花見をしたり</figcaption>
  </figure>
</div>

---
layout: toc
columns: 1
---

---
layout: section
color: blue
toc: 40% キーボードってどんなもん?
---

# 40% キーボードってどんなもん?

キーはどこまで減らせるのか

---
layout: content
eyebrowNum: 1
eyebrow: 40% キーボードってどんなもん?
clicks: 6
---

# キーが減っていく様子

<KeyboardShrink :stage="$clicks" class="mt-2" />

---
layout: content
eyebrowNum: 1
eyebrow: 40% キーボードってどんなもん?
clicks: 4
---

# 無いキーはレイヤーで補う

<Mona2Layer :stage="$clicks" class="mt-2" />

---
layout: section
color: blue
toc: キー数を減らす Tips
---

# キー数を減らす Tips

1\. 削れるキーは削る<br>
2\. ロータリーエンコーダーはいいぞ

---
layout: content
eyebrowNum: 2
eyebrow: キー数を減らす Tips
---

# 1. 削れるキーは削る

- かな <span v-click class="ml-4 op80">→ SKK ユーザーには不要</span>

<div class="flex items-center gap-4">
<div>

- Enter <span v-click="3" class="ml-3 op80">… <kbd>control</kbd> + <kbd>M</kbd></span>
- Delete <span v-click="3" class="ml-3 op80">… <kbd>control</kbd> + <kbd>H</kbd></span>
- 矢印キー <span v-click="3" class="ml-3 op80">… <kbd>control</kbd> + <kbd>F</kbd> <kbd>B</kbd> <kbd>N</kbd> <kbd>P</kbd></span>

</div>
<div v-click class="flex items-center gap-4">
  <span class="font-light op40" style="font-size: 6rem; line-height: 1">}</span>
  <span class="text-2xl font-bold">CLI のキーバインドで代用</span>
</div>
</div>

---
layout: two-cols
title: 2. ロータリーエンコーダーはいいぞ
eyebrowNum: 2
eyebrow: キー数を減らす Tips
ratio: 1/1.2
valign: center
---

## 割り当てる機能

- スクロール
- 音量
- 明るさ
- ズーム

<v-click>

機能を1箇所に集約できる

</v-click>

::right::

<div class="mx-auto" style="width: 24rem">
  <FindyAnnotatedImage :image="$asset('encoder.jpg')" alt="moNa2 のロータリーエンコーダー" caption="moNa2 のロータリーエンコーダー">
    <FindyImageRegion label="ここ" label-position="above-left" color="high" :x="58" :y="33" :w="26" :h="34" />
  </FindyAnnotatedImage>
</div>

---
layout: section
color: blue
toc: キーマップの決め方
---

# キーマップの決め方

設定前に整理しておくといいこと

---
layout: content
eyebrowNum: 3
eyebrow: キーマップの決め方
---

# 設定前に整理しておくこと

<div class="grid grid-cols-3 gap-8 mt-6">
<div v-click>

## 片手でやりたい操作

- スクロール
- クリック
- ウィンドウ切り替え
- タブ切り替え

</div>
<div v-click>

## 長押し / 単押し

- 単押し: <kbd>esc</kbd> <kbd>space</kbd> <kbd>return</kbd> <kbd>tab</kbd>
- 長押し: <kbd>control</kbd> <kbd>option</kbd> <kbd>shift</kbd> <kbd>command</kbd>

</div>
<div v-click>

## 同時押し

- 3 キーまでにする
- 小指と親指は隣り合うより離す
  - 例: レイヤーキーと <kbd>command</kbd> / <kbd>option</kbd>

</div>
</div>

---
layout: content
eyebrowNum: 3
eyebrow: キーマップの決め方
---

# シェルのキーバインドが使いやすいか

例: 引数を使いまわすキーバインド

| やりたいこと | キー |
| --- | --- |
| 最後の引数を入力 | <kbd>esc</kbd> → <kbd>.</kbd> |
| 後ろから引数を順に辿って入力 | <kbd>esc</kbd> → <kbd>,</kbd> ※要設定 |
| 後ろから 2 つめの引数を入力 | <kbd>esc</kbd> → <kbd>2</kbd> → <kbd>esc</kbd> → <kbd>.</kbd> |

<v-click>

<div class="text-center mt-8 text-2xl">

**Terminal Night (10/15) に行こう!**

</div>

</v-click>

---
layout: content
eyebrow: 宣伝
---

# 9〜10 月のキーボードイベント

<div class="grid grid-cols-3 gap-5 mt-4">
  <a v-click href="https://keyflea.connpass.com/event/389888/" target="_blank" class="no-external-mark block rounded-xl overflow-hidden shadow-sm !text-current !no-underline" style="border: 1px solid #e5e7eb">
    <img :src="$asset('event-keyflea.png')" class="w-full h-28 object-cover" />
    <div class="p-3">
      <div class="text-base font-bold leading-snug">キーボードフリーマーケット トーキョー 2026</div>
      <div class="text-sm mt-1"><b>9/19 (土)</b> 13:00〜16:00</div>
      <div class="text-sm op70">AP 秋葉原</div>
      <div class="text-sm mt-2">自作キーボードの余り物・訳アリ品が並ぶフリマ。1,000 円 (15 時以降無料)</div>
    </div>
  </a>
  <a v-click href="https://tkx.yushakobo.jp/tkx2026/" target="_blank" class="no-external-mark block rounded-xl overflow-hidden shadow-sm !text-current !no-underline" style="border: 1px solid #e5e7eb">
    <img :src="$asset('event-tkx.jpg')" class="w-full h-28 object-cover object-left" />
    <div class="p-3">
      <div class="text-base font-bold leading-snug">TOKYO KEYBOARD EXPO 2026</div>
      <div class="text-sm mt-1"><b>9/23 (水・祝)</b> 11:00〜16:30</div>
      <div class="text-sm op70">東京流通センター F ホール</div>
      <div class="text-sm mt-2">世界中のブランドが集まる日本最大級の展示・販売会。前売 1,000 円 / 当日 1,500 円</div>
    </div>
  </a>
  <a v-click href="https://tenkey.connpass.com/event/397843/" target="_blank" class="no-external-mark block rounded-xl overflow-hidden shadow-sm !text-current !no-underline" style="border: 1px solid #e5e7eb">
    <img :src="$asset('event-tenkey.png')" class="w-full h-28 object-cover" />
    <div class="p-3">
      <div class="text-base font-bold leading-snug">天下一キーボードわいわい会 Vol.12</div>
      <div class="text-sm mt-1"><b>10/3 (土)</b> 13:00〜17:00</div>
      <div class="text-sm op70">DMM.com セミナールーム (六本木一丁目)</div>
      <div class="text-sm mt-2">自分のキーボードを持ち寄る定員 370 名の交流会。申込は 9/26 まで</div>
    </div>
  </a>
</div>

<v-click>

<div class="text-center mt-8 text-2xl">

お気に入りのキーボードを見つけに行こう😼

</div>

</v-click>

---
layout: end
---

# ありがとうございました
