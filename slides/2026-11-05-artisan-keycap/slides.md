---
theme: swiss
title: アルチザンキーキャップにチャレンジ！
date: 2026-11-05
event: //localboast Tokyo
info: |
  アルチザンキーキャップにチャレンジ！
  https://localboast-tokyo.connpass.com/event/406024/
# テーマは CI で checkout していないので、手元のビルド結果 (prebuilt/) を配信する
prebuilt: true
favicon: https://github.com/mozumasu.png
addons:
  - slidev-addon-swiss
layout: cover
eyebrow: //localboast Tokyo — 2026.11.05 @MOSH
subtitle: mozumasu
titleSize: 3.8rem
---

::title::

*アルチザンキーキャップ*に<br>チャレンジ！

---
layout: profile
variant: split
title: 自己紹介
image: https://github.com/mozumasu.png
name: mozumasu
affiliation: SRE / PartnerProp, Inc.
links:
  - { label: 'X: @mozumasu', url: 'https://x.com/mozumasu' }
  - { label: 'GitHub: mozumasu', url: 'https://github.com/mozumasu' }
---

- **Environment** macOS / WezTerm / Neovim / macSKK
- **Like** ラーメン
- **一言** タマザラシはいいぞ

---
---

# アルチザンキーキャップとは

<SwissKeyMessage>

職人 (*artisan*) が手作りする、一点ものに近いキーキャップ

</SwissKeyMessage>

- 樹脂や粘土で形を作り、色を塗って仕上げる
- 少量しか作られないので、作品のように集める人もいる
- Esc など 1 キーだけ差し替えて、自分のキーボードの主役にできる

---
layout: two-cols
title: 使う物
---

- 樹脂粘土
- オーブントースター (食用と併用×)
- やすり
- へら

::right::

- アクリル絵の具
- レジン
- レジンを固める UV ライト
- キーキャップ用の軸 (自作ムズい)

<SwissSpeechBubble v-click pinned image="https://github.com/mozumasu.png">
  ハンドメイドあるある: 料理で使わない調理器具が増えがち
</SwissSpeechBubble>

---
---

# 作成の流れ

<SwissCodeSteps :current="0" :steps="[
  { title: '樹脂粘土をコネる' },
  { title: 'オーブントースターで焼く' },
  { title: 'やすりがけ' },
  { title: 'アクリル絵の具で塗る' },
  { title: 'レジンでコーティング' },
  { title: '軸を付ける' },
]" />

---
layout: two-cols
title: 1. 樹脂粘土をコネる
align: center
---

<img :src="$asset('/images/knead.jpg')" alt="タマザラシの形にこねた樹脂粘土" class="w-full h-80 object-cover">

::right::

<div class="flex flex-col gap-6">
  <SwissSpeechBubble v-click image="https://github.com/mozumasu.png">自分の爪の跡が残る〜</SwissSpeechBubble>
  <SwissSpeechBubble v-click image="https://github.com/mozumasu.png">別のパーツを付けてる間にゆがむ〜</SwissSpeechBubble>
</div>

---
layout: two-cols
title: 2. オーブントースターで焼く 120度 12min
---

<img :src="$asset('/images/oven.jpg')" alt="オーブントースターに入れた樹脂粘土" class="w-full h-72 object-cover">

::right::

<img v-click :src="$asset('/images/dock.jpg')" alt="3D プリンターで作ったドック下の収納" class="w-full h-72 object-cover">

<SwissSpeechBubble v-click pinned image="https://github.com/mozumasu.png">
  虚無なので 3D プリンタータイム。ドック下収納作ったYo
</SwissSpeechBubble>

---
layout: two-cols
title: 3. やすりがけ
---

<img :src="$asset('/images/sanding.jpg')" alt="やすりがけした樹脂粘土" class="w-full h-52 object-cover">

- P120, P800 で大きい傷をとる
- P1000, P2000, P3000 で表面を滑らかにする

::right::

<img v-click :src="$asset('/images/file-case.jpg')" alt="3D プリンターで作ったやすりの収納ケース" class="w-full h-72 object-cover">

<SwissSpeechBubble v-click pinned image="https://github.com/mozumasu.png">
  やすりの収納が欲しくなって作った。やすりケースお披露目
</SwissSpeechBubble>

---
layout: two-cols
title: 4. アクリル絵の具で塗る
---

<img :src="$asset('/images/paint-1.jpg')" alt="アクリル絵の具で塗ったキーキャップを持っているところ" class="w-full h-80 object-cover">

::right::

<img :src="$asset('/images/paint-2.jpg')" alt="塗り終えたキーキャップの横からの写真" class="w-full h-80 object-cover">

---
layout: two-cols
title: 5. レジンでコーティング
align: center
---

<img :src="$asset('/images/resin.jpg')" alt="レジンでつやが出たキーキャップ" class="w-full h-80 object-cover">

::right::

<SwissSpeechBubble v-click image="https://github.com/mozumasu.png">シリコンの台を用意しとくといいよ (戒め)</SwissSpeechBubble>

---
layout: two-cols
title: 6. 軸を付ける
---

<div class="grid grid-cols-2 gap-4">
  <img :src="$asset('/images/stem-1.jpg')" alt="軸を付けてキーボードに差したキーキャップ">
  <img :src="$asset('/images/stem-2.jpg')" alt="土台ごとキーボードに差したキーキャップ">
</div>

::right::

- キーキャップの土台を印刷する
- or 軸を別で買う

<SwissSpeechBubble v-click class="mt-6" image="https://github.com/mozumasu.png">
  レジンで軸まで作るのもいいんだけど、気泡抜くの大変 and 軸の精度が出ないと絶望
</SwissSpeechBubble>

---
layout: two-cols
title: 完成！
---

<img :src="$asset('/images/done-1.jpg')" alt="キーボードに付けた完成品を上から見た写真" class="w-full h-72 object-cover">

::right::

<img :src="$asset('/images/done-2.jpg')" alt="キーボードに付けた完成品の背中側の写真" class="w-full h-72 object-cover">

<SwissSpeechBubble v-click pinned image="https://github.com/mozumasu.png">
  どの角度から見てもカワイー!!!
</SwissSpeechBubble>

---
layout: section
variant: red
eyebrow: おまけ
title: 待ち時間のお供に
---

〜3D プリンターを添えて〜

---
---

# おまけ: 3D プリンターはいいぞ

<div class="swiss-grid">
  <figure class="col-span-4 m-0">
    <img :src="$asset('/images/perfume-tray.jpg')" alt="香水のサンプルを並べたトレー" class="w-full aspect-4/3 object-cover">
    <figcaption class="mt-2 font-bold">香水トレー</figcaption>
  </figure>
  <figure class="col-span-4 m-0">
    <img :src="$asset('/images/small-cases.jpg')" alt="重ねて置いた小物入れ" class="w-full aspect-4/3 object-cover">
    <figcaption class="mt-2 font-bold">小物入れ</figcaption>
  </figure>
  <figure class="col-span-4 m-0">
    <img :src="$asset('/images/trash-box.jpg')" alt="磁石付きのゴミ箱" class="w-full aspect-4/3 object-cover">
    <figcaption class="mt-2 font-bold">磁石付きゴミ箱</figcaption>
  </figure>
</div>

---
---

# おまけ: 磁石付きワイヤレス充電器

<div class="swiss-grid">
  <figure class="col-span-4 m-0">
    <img :src="$asset('/images/charger.jpg')" alt="ワイヤレス充電器" class="w-full aspect-4/3 object-cover">
    <figcaption class="mt-2 font-bold">充電器</figcaption>
  </figure>
  <figure class="col-span-4 m-0">
    <img :src="$asset('/images/charger-magnet.jpg')" alt="丸型の強力マグネット" class="w-full aspect-4/3 object-cover">
    <figcaption class="mt-2 font-bold">磁石</figcaption>
  </figure>
  <figure class="col-span-4 m-0">
    <img :src="$asset('/images/charger-case.jpg')" alt="磁石付きケースに入れた充電器" class="w-full aspect-4/3 object-cover">
    <figcaption class="mt-2 font-bold">磁石付きケース</figcaption>
  </figure>
</div>

---
---

# まとめ

- 樹脂粘土はいいぞ
- 3D プリンターはいいぞ
