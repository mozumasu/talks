---
theme: partnerprop
title: コミュニティから広がる、学び・仲間・キャリア
date: 2026-11-17
event: viviON 社内勉強会
info: |
  コミュニティから広がる、学び・仲間・キャリア
  〜イベント参加から登壇まで、エンジニアの可能性を広げるヒント〜
  viviON 社内勉強会
# 会社のテーマは CI から読めないので、手元のビルド結果 (prebuilt/) を配信する
prebuilt: true
# URL を知っている人にだけ見せる
unlisted: true
# 会社のマーク (public/favicon.png)。--base 付きで配信するので相対パスで書く
favicon: favicon.png
addons:
  - slidev-addon-partnerprop
layout: cover
variant: talk
subtitle: mozumasu
avatar: https://github.com/mozumasu.png
tagline: viviON 社内勉強会
taglineNote: "2026.11.17"
---

::title::

*コミュニティ*から広がる、<br>学び・仲間・キャリア

---
layout: profile
title: 自己紹介
image: https://github.com/mozumasu.png
name: mozumasu
affiliation: SRE / PartnerProp, Inc.
links:
  - { label: 'X: @mozumasu', url: 'https://x.com/mozumasu', icon: x-logo }
  - { label: 'GitHub: mozumasu', url: 'https://github.com/mozumasu', icon: github-logo }
qr: https://talks.mozumasu.com/community-career/
---

- **Environment** macOS / WezTerm / Neovim / macSKK
- **CAREER** SES → フリーランス → Platform SRE → Embedded SRE
- **Media** TECH WORLD / adachin dev / MIRAITO CHANNEL /<br>エンジニアの楽園ラジオ に出演

---
layout: toc
title: 今日話すこと
---

---
layout: section
title: きっかけ
toc: きっかけ：コミュニティとの出会い
---

# きっかけ<br>コミュニティとの出会い

---
title: 初めてのイベント参加のきっかけ
---

- RPA やテスターをやっていた
  - 自分のやりたいこととのズレ
  - エンジニアなのにマウスが必須だぁ
- 社内に相談できる人がいなかった
  - Git? AWS?

<!--
TODO: 憧れていたイメージ (フードを被ってキーボードを叩く) と、現実 (マウスから逃れられない) の画像を並べる
-->

---
title: 初めてのイベント参加
---

直近にあって、そこそこ人数がいそうなイベントに参加

[【Developers Guild】LT&交流会 7/15（土）@渋谷](https://devguil.connpass.com/event/285809/)

---
title: 初めてのイベントで感じたこと
---

- 私の技術力、低すぎ?
- 何言ってるか分かんね〜
  - めっちゃ教えてくれるし、なんなら demo してくれる
  - 技術マウントされなかった
- RPA の話は通じなかったけど、話は聞いてもらえる

<KeyMessage>楽しい! 今まで関わったことのないタイプの人がたくさん!<br>広い場所で生きていたい!</KeyMessage>

---
title: イベントでの思い出
---

- WezTerm と Neovim のオタクに出会う
- 心の底から楽しそうに話す姿に心を打たれた

---
title: イベント後日
---

- ランチ中に Vim の動画を見る → まんまとハマる
  - <https://youtu.be/5DmzNoxrgGY>
  - <https://youtu.be/fFHlfbKVi30>
- 教えてもらった設定を忘れる
  - ブログを頼りに公式ドキュメントを読み込む → WezTerm 沼へ
  - [モテるターミナルにカスタマイズしよう（WezTerm）](https://zenn.dev/mozumasu/articles/mozumasu-wezterm-customization)

<!--
TODO: WezTerm にルビを振る
-->

---
layout: statement
align: center
title: 熱量は他人を動かす
label: イベントでの学び
---

---
layout: section
title: コミュニティ
toc: コミュニティ：参加する楽しさを知る
---

# コミュニティ<br>参加する楽しさを知る

---
title: コミュニティとの出会い
---

[君もイカした Terminal 環境で開発してみなイカ？(wezterm, zsh, starship, neovim)](https://zenn.dev/monicle/articles/59ff479ae51c66)

<KeyMessage>vim-jp ではターミナルの話ができる!?</KeyMessage>

<!--
TODO: kuu-vim-jp.png を public/ に置いて載せる
-->

---
title: 初めてのコミュニティ vim-jp! 1
---

- みんな何を話しているかわからない
- 意外と初心者向けの質問もある
  - 参考になりそうなリンクを送ってくれる
- えぇ!? OS を目の前で消し始めた人がいる!?
- CLI さばきがすごい!!
  - 後にシェル沼にハマって生まれた記事: <https://zenn.dev/mozumasu/articles/mozumasu-cli-beginner>

---
title: 初めてのコミュニティ vim-jp! 2
---

- コミュニティの文化が面白い
  - !ペンギン: 初心者にワイワイ群がって布教する様子
  - グルメチャンネル: 覚悟があるやつが参加するチャンネル
  - ガジェットを買ったら「経済が回る」スタンプが押される
- スタンプで関心があることを伝えやすい
- 駅伝: <https://vim-jp.org/ekiden/>
  - 書いたもの: <https://zenn.dev/mozumasu/articles/mozumasu-translate-in-vim>

<div class="flex gap-4 mt-4">
  <img src="/keizai-chance.gif" class="h-16" />
  <img src="/spin_keizai.gif" class="h-16" />
  <img src="/spin_keizai_x2.gif" class="h-16" />
</div>

<SpeechBubble image="https://github.com/mozumasu.png">シャイなので話には混じれず見る専</SpeechBubble>

<!--
TODO: vim-jp-penguin.png を public/ に置いて載せる
-->

---
title: コミュニティで話すようになったきっかけ
---

- 自分の記事がコミュニティで流れた
- 密かに、このコミュニティに自分の記事が共有されることが夢だった

<KeyMessage>嬉しすぎて初チャット</KeyMessage>

---
title: 知らないコミュニティになじむための Tips
---

- 自己紹介がわりになる成果物を作っておく
  - dotfiles: 設定ファイルたちをまとめたリポジトリ
  - OSS: GIF などでデモがあると分かりやすい
  - 技術記事
- コミュニティのイベントに参加する
- Slack のスタンプを押しまくる / 追加しまくる
- チャットで返せるものはチャットで返す

---
layout: statement
align: center
title: チャット > スタンプ
label: 嬉しさ
---

---
title: コミュニティで得られたもの
---

- 技術の情報全般
- 近況報告をする仲間
- 新しい趣味: 自作キーボード / 謎解き
- OSS 貢献: [yuki-yano/zeno.zsh](https://github.com/yuki-yano/zeno.zsh)
- イベントの機会
  - [Vim-jp Radio](https://engineer.rakuen-radio.com/) の出演
  - 好きな技術のイベント運営: [吉祥寺.pm](https://kichijojipm.connpass.com/event/404746/)
  - コミュニティの人と登壇: [Findy のイベント](https://findy.connpass.com/event/387107/)
- モチベ

<!--
TODO: connpass はサムネを載せて、クリックでリンクに飛べるようにする
-->

---
layout: section
title: 発表
toc: 発表：参加する側から発信する側へ
---

# 発表<br>参加する側から発信する側へ

---
title: 初めてのアドカレ
---

- Vim の動画に出ていた人に出会う
- アドカレ妖怪も兼任しているらしく、アドカレに参加することに
- メモを記事に書き直して投稿
  - <https://zenn.dev/mozumasu/articles/mozumasu-lazy-git>
  - <https://zenn.dev/mozumasu/articles/mozumasu-window-costomization>

<KeyMessage>アドカレのメンバーには記事が届く。書く理由になる<br>まずは目の前の人に刺さりそうな記事を書く</KeyMessage>

---
title: 初めての登壇
---

喋りたくなった

- gh, ghq が、当時は思ったより日本で広まっていなかった
- 苦戦した Git/GitHub の学習結果を供養したくなった
  - 共感を得やすいから、ハードルが低かった
  - みんなも同窓会や久しぶりに会った友人に、思い出話をするよね?

人前で話すのムリすぎるけど、この OSS の良さは伝えたい〜

[めぐろLT #22「LT忘年会2024」](https://meguro-lt.connpass.com/event/330013/)

---
layout: statement
align: center
title: 登壇は布教駆動
---

---
title: 初めての登壇を終えて
---

- 声をかけられる側になる
- 友人ができた
- 感謝された

<KeyMessage>自分が思っていたよりも需要があった<br>記事だけでは広まらない範囲にも伝えられた</KeyMessage>

---
layout: section
title: テーマ・インプット
toc: テーマ・インプット：学びと発信を続ける仕組み
---

# テーマ・インプット<br>学びと発信を続ける仕組み

---
title: 発表テーマの探し方
---

---
title: 日々のインプットを発表につなげる
---

- インプットを効率化するツール: Raycast / Claude Code / nb
- 発表をラクにする仕組み: Slidev × Neovim
- 効率化しながら表現力を高める工夫

---
layout: section
title: キャリア
toc: キャリア：コミュニティ活動で得られたもの
---

# キャリア<br>コミュニティ活動で得られたもの

---
title: 仕事・キャリアにつながった経験
---

---
title: 強制的なアウトプットで生まれた学習習慣
---

---
title: 振り返って感じるコミュニティ活動の価値
---

---
title: まとめ
---

---
layout: end
message: Thank you for listening!
---
