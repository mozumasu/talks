---
layout: content
transition: view-transition
toc: ターミナル生活を支えるやつらの紹介
---

# ターミナル生活を支えるやつらを紹介するぜ！

今日はこの 3 つを一つずつ自分好みにしていく

<FindyKeyValueList size="1.05rem" gap="1rem">
  <FindyKeyValue label="ターミナルエミュレータ">WezTerm</FindyKeyValue>
  <FindyKeyValue label="ターミナルマルチプレクサ">herdr</FindyKeyValue>
  <FindyKeyValue label="シェル">zsh</FindyKeyValue>
</FindyKeyValueList>

ハンズオンのサンプル設定
https://github.com/mozumasu/talks/tree/main/slides/2026-09-26-terminal-hands-on/sample-code

---
layout: section
color: blue
transition: view-transition
---

# 設定前に知っておくとお得<br>...かもしれないもの {.inline-block.view-transition-f}

---
layout: content
center: true
transition: view-transition
---

# 設定前に知っておくとお得 ...かもしれないもの {.inline-block.view-transition-f}

<div class="mt-4">
<FindyAgendaItem gradient num="1" title="dotfiles" class="view-transition-dotfiles">
設定ファイル群のこと。GitHub で管理すればどの環境でも同じ設定を再現できる
</FindyAgendaItem>
<FindyAgendaItem gradient num="2" title="DeepWiki">
GitHub リポジトリを AI が解説してくれるサイト。設定前に仕組みをざっくり掴める
</FindyAgendaItem>
<FindyAgendaItem gradient num="3" title="キーバインド">
手に馴染むキー操作は自分にしか決められない。内側から外側の順に設定する
</FindyAgendaItem>
</div>

---
layout: two-cols
ratio: 1/1
eyebrow: dotfiles
eyebrowNum: 1
---

# dotfiles とは {.inline-block.view-transition-dotfiles}

::left::

<FindyTermCardList>
  <FindyTermCard term="dotfile">
    設定ファイルのこと
    <template #note>名前が <code>.</code> で始まることが由来 (例: <code>.bashrc</code>, <code>.zshrc</code>)</template>
  </FindyTermCard>
  <FindyTermCard term="dotfiles">
    設定ファイル<strong>群</strong>のこと
    <template #note><FindyAccentMark>PCの環境を再現できる</FindyAccentMark>ように GitHub などで管理することが多い</template>
  </FindyTermCard>
</FindyTermCardList>

公開している人も多く、エンジニアの名刺的存在

::right::

<FindyRepoPage repo="mozumasu/dotfiles" :image="$asset('/screenshots/dotfiles-repo.png')" />

---
layout: content
eyebrow: dotfiles
eyebrowNum: 1
---

# dotfilesのリポジトリを用意しよう

`~/dotfiles` に置くのが一般的

```sh
# ホームディレクトリへ移動
cd

# リモートリポジトリを作成してcloneする
gh repo create dotfiles --public --clone

# clone できたか確認
ls -la | grep dotfiles
```

---
layout: two-cols
ratio: 1/1
eyebrow: dotfiles
eyebrowNum: 1
---

# 設定ファイルはどこに置く?

::left::

**XDG Base Directory**:
設定ファイルなどの置き場所を標準化する仕様

<FindyKeyValueList size="1.05rem">
  <FindyKeyValue label="設定"><code>~/.config</code></FindyKeyValue>
  <FindyKeyValue label="キャッシュ"><code>~/.cache</code></FindyKeyValue>
  <FindyKeyValue label="データ"><code>~/.local/share</code></FindyKeyValue>
  <FindyKeyValue label="状態"><code>~/.local/state</code> (ログ・履歴など)</FindyKeyValue>
</FindyKeyValueList>

::right::

環境変数で明示しておくと `~/.config` に集約できる

::code-group

```sh [zsh / bash]
# zsh: ~/.zshenv / bash: ~/.bashrc
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"
```

```fish [fish]
# ~/.config/fish/config.fish
set -gx XDG_CONFIG_HOME "$HOME/.config"
set -gx XDG_CACHE_HOME "$HOME/.cache"
set -gx XDG_DATA_HOME "$HOME/.local/share"
set -gx XDG_STATE_HOME "$HOME/.local/state"
```

::

<FindyCallout variant="warn">
  macOS では未設定だと <code>~/Library/Application Support</code> に設定を置くツールがある (例: lazygit)
</FindyCallout>

---
layout: two-cols
ratio: 1/1
eyebrow: dotfiles
eyebrowNum: 1
---

# シンボリックリンクとは

::left::

ファイルの<FindyAccentMark>住所を書いた案内板</FindyAccentMark>。開くと案内先の実体が開く

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="コピー">中身が 2 つに増える。片方を直してももう片方は古いまま</FindyKeyValue>
  <FindyKeyValue label="リンク">中身は 1 つ。どちらから開いても同じ実体を編集する</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout>
  Windows のショートカット、macOS のエイリアスに近い。違いはアプリ側が「本物のファイル」として透過的に読めること
</FindyCallout>

::right::

<FindyFlow
  steps="アプリが ~/.config/wezterm/wezterm.lua を開く,案内板 (リンク) が実体の場所を教える,実体 ~/dotfiles/… が開く"
/>

<div class="code-compact mt-3" style="--findy-code-compact-size: 0.75rem">

```sh
ls -l ~/.config/wezterm
# lrwxr-xr-x wezterm.lua -> ~/dotfiles/.config/wezterm/…
# 先頭の l がリンクの印。-> の先が実体
```

</div>

---
layout: two-cols
ratio: 1/1
eyebrow: dotfiles
eyebrowNum: 1
---

# 実体は dotfiles、参照はシンボリックリンク

::left::

設定ファイルの実体は dotfiles リポジトリに置き、アプリが読む場所には<FindyAccentMark>シンボリックリンク</FindyAccentMark> (実体を指す参照) を貼る

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="実体"><code>~/dotfiles/.config/…</code> 編集・Git 管理</FindyKeyValue>
  <FindyKeyValue label="リンク"><code>~/.config/…</code> アプリが読む場所</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout>
  コピーだと編集のたびに dotfiles へ書き戻すことになる。リンクなら実体は 1 つだけ
</FindyCallout>

::right::

引数の順番は「実体 → リンク」

<div class="code-compact" style="--findy-code-compact-size: 0.75rem">

```sh
# ln -s <実体> <リンク>
ln -s ~/dotfiles/.config/wezterm/wezterm.lua \
  ~/.config/wezterm/wezterm.lua

# 確認: リンクは -> で実体を指す
ls -l ~/.config/wezterm
# wezterm.lua -> ~/dotfiles/.config/...
```

</div>

<FindyCallout>
  GNU Stow や chezmoi でリンク貼りを自動化する人も多い。今日は <code>ln -s</code> を手で貼っていく
</FindyCallout>

---
layout: two-cols
ratio: 1/1
eyebrow: dotfiles
eyebrowNum: 1
---

# コラム: Nix でシンボリックリンクを管理

::left::

ツールが増えるたびに `ln -s` を手で貼るのは大変。<FindyAccentMark>home-manager</FindyAccentMark> (Nix) なら「どこに何をリンクするか」を宣言的に書ける

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="一覧性">リンク定義が 1 ファイルに集まる</FindyKeyValue>
  <FindyKeyValue label="再現性">新しいマシンでも switch 一発で全リンク再現</FindyKeyValue>
  <FindyKeyValue label="即反映">mkOutOfStoreSymlink なら実体は dotfiles のまま。編集がすぐ効く</FindyKeyValue>
</FindyKeyValueList>

<FindyRef>

[home-manager](https://nix-community.github.io/home-manager/) / [mozumasu/dotfiles の実際の設定](https://github.com/mozumasu/dotfiles/blob/main/.config/nix/home-manager/dotfiles.nix)

</FindyRef>

::right::

<div class="code-compact" style="--findy-code-compact-size: 0.75rem">

```nix [dotfiles.nix (実際の設定を抜粋)]
let
  dotfiles = "${config.home.homeDirectory}/dotfiles";
  mkLink = path:
    config.lib.file.mkOutOfStoreSymlink
      "${dotfiles}/${path}";
in
{
  # ~/.config/ 配下へのリンクを宣言する
  xdg.configFile = {
    "wezterm".source = mkLink ".config/wezterm";
    "nvim".source = mkLink ".config/nvim";
    "herdr/config.toml".source =
      mkLink ".config/herdr/config.toml";
  };
}
```

</div>

---
layout: content
eyebrow: DeepWiki
eyebrowNum: 2
---

# DeepWiki とは

<FindyTermCardList>
  <FindyTermCard term="DeepWiki">
    GitHub リポジトリを AI が解説してくれるサイト
    <template #note>Cognition (Devin の開発元) が提供・パブリックリポジトリは<FindyAccentMark>無料</FindyAccentMark></template>
  </FindyTermCard>
</FindyTermCardList>

<p class="lead mt-8">
リポジトリの構成図とドキュメントを自動生成してくれて、リポジトリについて AI に質問もできる
</p>

<p class="lead">
ツールを設定する前に仕組みをざっくり掴んだり、README に載っていない挙動を調べるのに使う
</p>

---
layout: two-cols
ratio: 2/5
valign: center
eyebrow: DeepWiki
eyebrowNum: 2
---

# DeepWiki への質問例

::left::

<FindyLegend>
  <FindyLegendItem color="#3b82f6" term="質問">自然言語でリポジトリに問いかける</FindyLegendItem>
  <FindyLegendItem color="#10b981" term="回答">該当ファイル・行番号を引用しながら説明</FindyLegendItem>
  <FindyLegendItem color="#f59e0b" term="ソース">引用元のコードがそのまま並んで表示される</FindyLegendItem>
</FindyLegend>

::right::

<FindyAnnotatedImage
  :image="$asset('/screenshots/deepwiki-yazi-help.png')"
  alt="DeepWiki で yazi のヘルプ表示方法を質問した画面。左に質問と引用付きの回答、右に引用元の keymap-default.toml が表示されている"
>
  <FindyImageRegion label="質問" color="#3b82f6" :x="6" :y="9" :w="34" :h="9" />
  <FindyImageRegion label="回答（引用付き）" color="#10b981" :x="6" :y="19" :w="34" :h="30" />
  <FindyImageRegion label="引用元のコード" color="#f59e0b" :x="40" :y="9" :w="58" :h="89" />
</FindyAnnotatedImage>

<div class="mt-2 text-xs text-center">
  <a href="https://deepwiki.com/search/_1b649b74-1735-4598-b35f-5bb60d735926?mode=fast" target="_blank">この質問のページを実際に見る</a>
</div>

---
layout: two-cols
eyebrow: キーバインド
eyebrowNum: 3
---

# キーバインドをどう決めるか

::left::

- どのキー操作が手に馴染むかは AI には決められない
- 一度慣れると後から変更するのが辛い


<FindyCallout>
  内側から外側の順に設定するのがオススメ
</FindyCallout>

::right::


<FindyFlow
  from="内側"
  to="外側"
  steps="シェル\nTUI アプリ (Neovim / lazygit など),ターミナルマルチプレクサ,ターミナルエミュレータ,キーボード"
/>

