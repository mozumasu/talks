---
theme: findy
title: 5分で初めるNix
info: |
  LT (仮)
  5分で初めるNix
class: text-left
comark: true
favicon: https://github.com/mozumasu.png
addons:
  - slidev-addon-findy
layout: talk-cover
event: イベント名 2026.9.X
image: https://github.com/mozumasu.png
name: mozumasu
role: ファインディ / Platform SRE
---

## 5 分で flake.nix デビュー
# 5分で初めるNix

---
layout: content
---

# 今日のゴール

<div class="text-center mt-24">

## あなたのプロジェクトに `flake.nix` が置かれること

</div>

---
layout: content
---

# グローバルにインストールする辛み

- `brew` でインストールしたものは宣言されていない
- プロジェクトに必要なツールの境界が曖昧になる
- 依存していることに気づかないまま、環境が壊れる

---
layout: content
center: true
---

<div class="text-center">

そして人は言う ───

<v-click>

# 「自分のマシンでは動くのに」

</v-click>

</div>

---
layout: content
center: true
---

<div class="text-center">

そこで

# Nix !

</div>

---
layout: content
center: true
---

<div class="text-center">

# flake.nix を導入して、おま環問題から卒業しましょう

</div>

---
layout: content
---

# どれどれ、flake.nix とやらはどんなもんかな…?

<v-click>

<div class="code-compact" style="--findy-code-compact-size: 0.5rem">

```nix [flake.nix]
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfreePredicate = pkg: builtins.elem (nixpkgs.lib.getName pkg) [ "terraform" ];
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [ pkgs.terraform ];
        };
      }
    );
}
```

</div>

</v-click>

---
layout: content
center: true
---

<div class="text-center">

# Nix 読めないし、書けないよ〜ん 😇

<v-click>

大丈夫、書かなくていい

```sh
nix flake init
```

</v-click>

</div>

---
layout: content
---

# Nix で定義したツールをさっそく使ってみよう!

```sh
nix develop
```

```sh
which terraform
# /nix/store/...
```

- パスが `/nix/store/...` になっている → **グローバルから分離されている**

---
layout: content
---

# ここで不満

- いちいち `nix develop` を実行するの面倒
- Nix が用意したシェルだと、ローカルのシェル設定が効かないじゃん

<v-click>

→ それ、`direnv` と `nix-direnv` で解決できるよ

</v-click>

---
layout: content
---

# cd しただけで必要なものが揃っている!?

- `direnv` と `nix-direnv` をインストール
- `.envrc` に `use flake` を書く
- `direnv allow` する

これだけで、リポジトリに入った瞬間に devShell が自動で有効になる

---
layout: content
center: true
---

<div class="text-center">

いちいち flake.nix 書くの面倒!

# テンプレートにしちゃえばいいじゃない

</div>

---
layout: content
center: true
---

<div class="text-center">

# Nix Template

人類はもっとこの機能を使うべき

</div>

---
layout: content
---

# let's try

```sh
curl -fsSL https://install.determinate.systems/nix | sh -s -- install
```

あたらしいシェルを開いてチェック

```sh
nix --version
```

---
layout: content
---

# 出でよ、俺の flake.nix!

```sh
nix flake init --template "github:mozumasu/nix-templates#terraform"
```

---
layout: content
---

# あら不思議! コマンド 1 つで flake.nix ができちゃった

```sh
ls -a
# .envrc  flake.lock  flake.nix
```

<div class="text-center mt-12 text-2xl">

Nix is <ruby>venry<rt>便利</rt></ruby>

</div>

---
layout: end
---

# ご清聴いただきありがとうございました

<div class="absolute top-10 right-8 overflow-hidden rounded-xl" style="height: 302px">
  <Tweet id="2058515100626309361" scale="0.85" />
</div>

<span class="op60">〜このスライドはシラフで作成されています〜</span>
