---
theme: partnerprop
title: ブラウザ好き語り! ardia編
# 登壇イベントと日付が決まるまで非公開にする (ビルドせず一覧にも載せない)。
# 決まったら date: / event: / tagline を足し、ディレクトリ名に日付を付け、この行を消す
draft: true
info: |
  ブラウザ好き語り! ardia編
# 会社のテーマは CI から読めないので、手元のビルド結果 (prebuilt/) を配信する
prebuilt: true
# 会社のマーク (public/favicon.png)。--base 付きで配信するので相対パスで書く
favicon: favicon.png
addons:
  - slidev-addon-partnerprop
layout: cover
variant: talk
subtitle: mozumasu
avatar: https://github.com/mozumasu.png
---

::title::

ブラウザ好き語り!<br>*ardia*編

---
layout: profile
title: 自己紹介
image: https://github.com/mozumasu.png
name: mozumasu
affiliation: SRE / PartnerProp, Inc.
links:
  - { label: 'X: @mozumasu', url: 'https://x.com/mozumasu', icon: x-logo }
  - { label: 'GitHub: mozumasu', url: 'https://github.com/mozumasu', icon: github-logo }
---

- **Environment** macOS / WezTerm / Neovim / macSKK
- **Browser** ardia

---
layout: toc
title: 今日話すこと
---

---
layout: section
title: '00'
toc: 背景
---

# 背景

---
title: Arc 終わっちまうってよ〜!?
---

*Arc* 終わっちまうってよ〜!?

<figure class="announce">
  <img :src="$asset('arc-end.png')" alt="Arc の公式 X の投稿。2026年12月22日に Arc を終了すると書かれている">
  <figcaption><a href="https://x.com/arcinternet/status/2113301454597640570" target="_blank">Arc 公式 X (@arcinternet) の投稿</a> (X による日本語訳)</figcaption>
</figure>

---
layout: section
title: '01'
toc: 好きなところ 1 タブ管理の自動化
---

# タブ管理の自動化

---
title: タブ管理の自動化
---

タブを片付けるのは*ブラウザ*の仕事

<div class="likes">
  <div v-click><dt>縦タブ</dt><dd>タブが増えても、タイトルが読める</dd></div>
  <div v-click><dt>時間がたったタブを消す</dt><dd>しばらく開いていないタブは、勝手に閉じてくれる</dd></div>
  <div v-click><dt>アーカイブ (<kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>D</kbd>)</dt><dd>自動で消す対象から外せる<br><small>ブックマークするほどではないけれど、直近では使う。そんなタブはこれ</small></dd></div>
  <div v-click><dt>タブの自動グループ分け</dt><dd><kbd>⌘</kbd> + クリックでページを開いても、どの作業のタブか分かる</dd></div>
</div>

---
title: タブの自動グループ分け
---

開いた元のタブの下にまとまる

<div class="shot">
  <img :src="$asset('tab-groups.png')" alt="ardia の縦タブ。開いた元のページごとにタブがグループにまとまっている">
  <ul>
    <li><kbd>⌘</kbd> + クリックで開いたタブは、元のタブのグループに入る</li>
    <li>グループは折りたためる</li>
  </ul>
</div>

---
layout: section
title: '02'
toc: 好きなところ 2 プロファイルの切り替え
---

# プロファイルの切り替え

---
title: 複数アカウントのプロファイルを切り替える
---

複数のアカウントのプロファイルを*1 つのウィンドウ*で切り替えられる

<div class="likes">
  <div v-click><dt>たいていのブラウザ</dt><dd>プロファイルごとにウィンドウが分かれる</dd></div>
  <div v-click><dt>ardia</dt><dd>1 つのウィンドウのまま切り替えられる</dd></div>
</div>

---
layout: section
title: '03'
toc: 好きなところ 3 検索窓が真ん中に出る
---

# 検索窓が真ん中に出る

---
title: 検索窓が真ん中に出る
---

検索するとき、入力欄が*画面の真ん中*に出る

<div class="likes">
  <div v-click><dt>視線を動かさなくていい</dt><dd>作業を始めるとき、画面の端まで目を動かさずに済むのが楽</dd></div>
</div>

---
layout: end
message: Thank you for listening!
---
