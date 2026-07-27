---
theme: findy
title: brew/mise をやめて flake.nix で開発環境をつくる
info: |
  ハンズオン (仮)
  brew/mise をやめて flake.nix で開発環境をつくる
class: text-left
comark: true
favicon: https://github.com/mozumasu.png
addons:
  - slidev-addon-findy
layout: talk-cover
event: ハンズオンイベント名 2026.9.X
image: https://github.com/mozumasu.png
name: mozumasu
role: ファインディ / Platform SRE
---

## flake.nix + direnv ハンズオン
# brew/mise をやめて flake.nix で開発環境をつくる

---
layout: profile
image: https://github.com/mozumasu.png
name: mozumasu
role: ファインディ / Platform SRE
---

## 自己紹介

- 開発環境: MacOS / WezTerm / Neovim / macSKK
- 社内の Node.js モノレポの開発環境を brew + mise から flake.nix + direnv に移行した

- X: @mozumasu / GitHub: mozumasu

---
layout: content
---

# 今日のゴール

- flake.nix + direnv で「リポジトリに入ると開発ツールが揃う」環境を自分の手で作る
- brew / mise で入れていたツールを devShell に移せるようになる
- flake.lock の運用 (更新・チーム共有) のイメージを持ち帰る
- 発展: Dockerfile まで置き換えるか? の判断材料を知る

想定: 60〜90 分、手元で Nix をインストールして進めるハンズオン形式

---
layout: toc
columns: 1
---

---
layout: section
color: blue
eyebrow: Chapter 1
toc: なぜ brew/mise をやめたのか
---

# なぜ brew/mise を<br>やめたのか

---
layout: content
eyebrow: なぜ brew/mise をやめたのか
eyebrowNum: 1
---

# よくある開発環境の構成

- brew: `coreutils` `curl` `git` などの CLI ツール
- mise: `gh` `jq` `nodejs` などのバージョン管理
- Dockerfile: 本番イメージ用の Node.js
- つまり「同じツールチェーン」の定義が 3 箇所に分散している

```sh
brew install coreutils curl git
mise install   # gh / jq / nodejs
```

---
layout: two-cols
ratio: 1/1
eyebrow: なぜ brew/mise をやめたのか
eyebrowNum: 1
---

# 実話: バージョンはズレていた

::left::

## 本番イメージ

```dockerfile [Dockerfile]
FROM node:24.16.0
```

## 手元の開発環境

```toml [mise.toml]
[tools]
node = "24.16.0"   # のはずだった
```

::right::

- 社内の Node.js モノレポでの話
- 実際に確認したら手元の Node.js と本番イメージがズレていた
- 「揃えているつもり」は定義が分散している限り再発する

---
layout: content
eyebrow: なぜ brew/mise をやめたのか
eyebrowNum: 1
---

# なぜズレるのか

- 定義が複数ファイルにあり、更新は人間の運用頼み
- brew はバージョン固定がそもそも苦手 (基本は常に最新)
- mise はプロジェクトごとに固定できるが、本番イメージとは別管理
- レビューで「両方直したか」を毎回確認するのは現実的でない

---
layout: content
eyebrow: なぜ brew/mise をやめたのか
eyebrowNum: 1
---

# もう 1 つの問題: グローバルに入れることの副作用

- `brew install` はマシン全体で 1 バージョン
  - プロジェクトごとに欲しいバージョンが違っても選べない
- `brew upgrade` は全部まとめて進む
  - 共有ライブラリごと動くので、無関係なツールが巻き添えで壊れる
  - 「昨日まで動いていた」に戻す手段がほぼない
- 入れたことがどこにも宣言されない
  - 環境構築が「口伝の brew install リスト」になり、新メンバーで再現しない
  - 「自分のマシンでは動く」の温床

---
layout: content
eyebrow: なぜ brew/mise をやめたのか
eyebrowNum: 1
---

# キーメッセージ: flake.nix は「brew + mise の代わり」

- flake.nix は「Docker の代わり」ではない
- プロセス隔離はしない。ホストで動くツールチェーンの宣言と固定をする
- devShell と本番イメージが同じ pkgs のピンを参照できる → 定義上ズレない
- devShell はプロジェクト単位。グローバル状態を汚さず、他プロジェクトを巻き添えにしない
- ホストのツールチェーン統一という目的では devcontainer より速く、エディタ連携も自然

---
layout: two-cols
ratio: 1/1
eyebrow: なぜ brew/mise をやめたのか
eyebrowNum: 1
---

# 比較: devcontainer / mise / flake.nix

::left::

## devcontainer

- プロセス隔離あり、環境の再現性は高い
- コンテナ越しのファイル I/O・エディタ連携にコストがかかる
- 「ホストのツールを揃えたい」だけには重い

::right::

## flake.nix + direnv

- 隔離はしないがツールのバージョンは厳密に固定
- ホストで直接動くのでエディタ連携が自然
- `cd` するだけで環境が切り替わる

---
layout: section
color: blue
eyebrow: Chapter 2
toc: ハンズオン準備
---

# ハンズオン準備:<br>Nix と direnv を入れる

---
layout: content
eyebrow: ハンズオン準備
eyebrowNum: 2
---

# Nix のインストール

- Determinate Systems のインストーラを使う (flakes がデフォルト有効)

```sh
curl -fsSL https://install.determinate.systems/nix | sh -s -- install
```

- インストール後、新しいシェルを開いて確認

```sh
nix --version
```

---
layout: content
eyebrow: ハンズオン準備
eyebrowNum: 2
---

# direnv と nix-direnv のインストール

- [direnv](https://github.com/direnv/direnv): ディレクトリに入ると環境変数を自動で読み込む
- [nix-direnv](https://github.com/nix-community/nix-direnv): `use flake` を高速化・キャッシュ化する拡張

```sh
brew install direnv                      # 本体 (あとで devShell に移せる)
nix profile install nixpkgs#nix-direnv   # 拡張
```

```sh [セットアップ]
# ~/.zshrc に追記
eval "$(direnv hook zsh)"
# ~/.config/direnv/direnvrc に追記 (要 mkdir -p)
source ~/.nix-profile/share/nix-direnv/direnvrc
```

---
layout: content
eyebrow: ハンズオン準備
eyebrowNum: 2
---

# チェックポイント 1

- 以下が全部動けば準備完了

```sh
nix --version
direnv --version
nix run nixpkgs#hello
```

- `Hello, world!` が出れば nixpkgs からのパッケージ取得も OK
- 動かない人はここで挙手 (トラブルシュートタイム)

---
layout: section
color: blue
eyebrow: Chapter 3
toc: はじめての flake.nix
---

# ハンズオン 1:<br>はじめての flake.nix

---
layout: content
eyebrow: はじめての flake.nix
eyebrowNum: 3
---

# nix flake init でテンプレートから始める

```sh
mkdir nix-handson && cd nix-handson
git init
nix flake init
```

- `flake.nix` が生成される
- 注意: flake は git 管理下のファイルしか見ない → `git add flake.nix` を忘れずに

---
layout: content
eyebrow: はじめての flake.nix
eyebrowNum: 3
---

# flake.nix の読み方

- inputs: 依存する flake (実質 nixpkgs のリビジョン指定)
- outputs: この flake が提供するもの (今日は devShells だけ使う)

```nix [flake.nix]
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "aarch64-darwin"; # Apple Silicon の場合
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.${system}.default = pkgs.mkShell {
        packages = [ pkgs.git pkgs.jq ];
      };
    };
}
```

---
layout: content
eyebrow: はじめての flake.nix
eyebrowNum: 3
---

# nix develop で devShell に入る

```sh
git add flake.nix
nix develop
```

```sh
# devShell の中で
which jq
jq --version
```

- `which jq` が `/nix/store/...` を指せば成功
- `exit` で抜けると元の環境に戻る

---
layout: content
eyebrow: はじめての flake.nix
eyebrowNum: 3
---

# nix flake show と dirty warning

```sh
nix flake show
```

- この flake が提供する outputs のツリーが見える
- `warning: Git tree ... is dirty` は「未コミットの変更がある」だけの警告
- flake.lock が生成されていることも確認する

```sh
git add flake.lock
git commit -m "init flake"
```

---
layout: content
eyebrow: はじめての flake.nix
eyebrowNum: 3
---

# チェックポイント 2

- `nix develop` で shell に入れる
- `which jq` が `/nix/store/...` を指す
- `nix flake show` で `devShells` が見える
- flake.nix と flake.lock をコミットした

---
layout: section
color: blue
eyebrow: Chapter 4
toc: パッケージを揃える
---

# ハンズオン 2:<br>brew/mise のツールを<br>devShell に移す

---
layout: content
eyebrow: パッケージを揃える
eyebrowNum: 4
---

# パッケージ名の探し方

- search.nixos.org で検索するのが基本
- CLI からは `nix search`

```sh
nix search nixpkgs gh
nix search nixpkgs nodejs
```

---
layout: content
eyebrow: パッケージを揃える
eyebrowNum: 4
---

# 罠: brew と名前が違うパッケージ

- brew の名前のまま探すと見つからないものがある

| brew | nixpkgs |
| --- | --- |
| gnu-sed | gnused |
| awscli | awscli2 |
| coreutils | coreutils (同名) |

- 見つからないときは search.nixos.org でコマンド名 (`sed` など) から逆引きする

---
layout: content
eyebrow: パッケージを揃える
eyebrowNum: 4
---

# 実例: brew + mise のツールを全部移す

- 移行対象: brew の `coreutils` `curl` `git`、mise の `gh` `jq` `nodejs`

```nix [flake.nix]
devShells.${system}.default = pkgs.mkShell {
  packages = [
    pkgs.coreutils
    pkgs.curl
    pkgs.git
    pkgs.gh
    pkgs.jq
    pkgs.nodejs_24
  ];
};
```

---
layout: content
eyebrow: パッケージを揃える
eyebrowNum: 4
---

# Node.js のバージョンを固定する

- `pkgs.nodejs_24` はメジャーバージョンの指定
- パッチバージョンまでは nixpkgs のリビジョン (= flake.lock) が決める
- 「nixpkgs のピン = ツールチェーン全体のピン」という考え方に頭を切り替える

```sh
nix develop
node --version
```

---
layout: content
eyebrow: パッケージを揃える
eyebrowNum: 4
---

# チェックポイント 3

```sh
nix develop
node --version   # nixpkgs が提供する Node.js 24.x
gh --version
jq --version
which git curl   # /nix/store/... を指す
```

- ここまでで brew / mise 相当の宣言が flake.nix 1 ファイルに集約された

---
layout: section
color: blue
eyebrow: Chapter 5
toc: direnv で自動化
---

# ハンズオン 3: direnv で「cd するだけ」にする

---
layout: content
eyebrow: direnv で自動化
eyebrowNum: 5
---

# .envrc で use flake

- 毎回 `nix develop` と打つのはつらい → direnv に任せる

```sh [.envrc]
use flake
```

```sh
direnv allow
```

- 以後、このディレクトリに `cd` すると自動で devShell の環境になる

---
layout: content
eyebrow: direnv で自動化
eyebrowNum: 5
---

# チームに flake を強制しない工夫

- チームのリポジトリに個人環境ファイルをコミットしたくない場合
- `.gitignore` を汚さず、自分だけ無視リストに入れる

```sh
echo '.envrc' >> .git/info/exclude
echo 'flake.nix' >> .git/info/exclude
echo 'flake.lock' >> .git/info/exclude
# flake は git が知るファイルしか見ない → 追跡だけさせる (コミットには入らない)
git add --intent-to-add --force flake.nix flake.lock
```

- `--intent-to-add` はパスだけ登録するので、コミットに混入しない
- 共有すると決めたら普通に `git add -f` してコミット (個人 → 合意 → 共有)

---
layout: content
eyebrow: direnv で自動化
eyebrowNum: 5
---

# flake.lock 更新の運用

- flake.lock が nixpkgs のリビジョンを固定している
- 更新は明示的に行う (勝手には上がらない)

```sh
nix flake update
git diff flake.lock
```

- lock ファイルの差分レビュー = ツールチェーン更新のレビュー
- Renovate / dependabot 的な定期更新 PR にするのがチーム運用の定石

---
layout: content
eyebrow: direnv で自動化
eyebrowNum: 5
---

# チェックポイント 4

- リポジトリに `cd` するだけで `node --version` が devShell のものになる
- リポジトリの外に出ると元の環境に戻る
- `nix flake update` で flake.lock の差分が見える

---
layout: section
color: blue
eyebrow: Chapter 6
toc: "実戦: 社内モノレポでの移行"
---

# 実戦: 社内 Node.js<br>モノレポでの移行

---
layout: two-cols
ratio: 1/1
eyebrow: "実戦: 社内モノレポでの移行"
eyebrowNum: 6
---

# Before / After

::left::

## Before

- brew: coreutils / curl / git
- mise: gh / jq / nodejs
- Dockerfile: `FROM node:24.16.0`
- 定義が 3 箇所、実際にバージョンがズレていた

::right::

## After

- flake.nix (devShell) + direnv に集約
- Node.js のバージョンは nixpkgs のピンが決める
- devShell と本番イメージが同じ pkgs を参照すれば定義上ズレない

---
layout: content
eyebrow: "実戦: 社内モノレポでの移行"
eyebrowNum: 6
---

# 移行してどうだったか

- 新メンバーのセットアップ: 手順書の「brew install...」の列挙が `direnv allow` に置き換わる
- 「手元で動くのに CI で落ちる」系のツールバージョン差分が消える
- macOS アップデートや brew upgrade で環境が壊れる不安から解放される
- (発表までに定量的な効果・エピソードを追記する)

---
layout: section
color: blue
eyebrow: Chapter 7
toc: "発展: Dockerfile も置き換えられるか"
---

# 発展: Dockerfile も Nix で置き換えられるか

---
layout: content
eyebrow: "発展: Dockerfile も置き換えられるか"
eyebrowNum: 7
---

# pkgs.dockerTools という選択肢

- Nix はコンテナイメージも作れる: `dockerTools.buildLayeredImage`
- Docker デーモン不要でイメージを生成できる
- `apt-get update` のような「実行時期でビルド結果が変わる」要素がない
- 依存グラフに基づくレイヤー分割でキャッシュ効率が良い

```nix
dockerTools.buildLayeredImage {
  name = "my-app";
  contents = [ app pkgs.nodejs_24 ];
  config.Cmd = [ "node" "server.js" ];
}
```

---
layout: content
eyebrow: "発展: Dockerfile も置き換えられるか"
eyebrowNum: 7
---

# それでも Dockerfile 継続を選んだ

- 技術的には可能。見送りを検討した理由は 3 つ
- 理由 1: npmDepsHash の維持コスト (依存更新のたびにハッシュ更新)
- 理由 2: macOS からは Linux イメージをビルドできない
- 理由 3: CI・レビュー体制が Dockerfile 前提で回っている
- ただし調べると、理由 1・2 には解決策がある

---
layout: two-cols
ratio: 1/1
eyebrow: "発展: Dockerfile も置き換えられるか"
eyebrowNum: 7
---

# 理由 1・2 には解決策がある

::left::

## 理由 1: ハッシュ申告

- npm なら公式の `importNpmLock` で解決
  - lockfile の integrity を直接使うので申告不要
- ただし npm 限定
  - pnpm はハッシュが残る (`nix-update` で緩和)

::right::

## 理由 2: Linux ビルド

- `nix.linux-builder` (公式) / nix-rosetta-builder
- Determinate Nix の native builder (申請制)
- CI の Linux ランナー限定ビルド

→ 「できない」ではなく「VM ビルダーという配布物が一段増える」

---
layout: content
eyebrow: "発展: Dockerfile も置き換えられるか"
eyebrowNum: 7
---

# それでも見送った主因は理由 3

- 理由 1・2 は解決策を積めば潰せる
- しかし解決策を積むほど「維持できるのが自分だけ」になる
- importNpmLock の制約、Linux ビルダーの面倒を見られる人が何人いるか
- 技術の壁ではなくバス係数の壁

---
layout: content
eyebrow: "発展: Dockerfile も置き換えられるか"
eyebrowNum: 7
---

# 学び: 技術的可否と運用判断を分ける

- 「できるか」と「チームでやるべきか」は別の問い
- devShell (brew/mise の代替) は導入コストが低く、個人から始められる
- イメージビルド (Dockerfile の代替) は CI・レビュー・チーム習熟まで含めた投資判断
- 今日の持ち帰り: まず devShell だけ、が現実的な第一歩

---
layout: section
color: blue
eyebrow: Chapter 8
toc: まとめ
---

# まとめ

---
layout: content
eyebrow: まとめ
eyebrowNum: 8
---

# まとめ

- flake.nix は「Docker の代わり」ではなく「brew + mise の代わり」
- 定義の分散がバージョンのズレを生む。devShell は定義を 1 箇所に集約する
- direnv と組み合わせると「cd するだけ」で環境が揃う
- `.git/info/exclude` で個人導入から始め、チーム合意後に `git add -f` で共有する
- Dockerfile の置き換えは技術的には可能。見送った主因は技術ではなく運用 (バス係数)

---
layout: content
eyebrow: まとめ
eyebrowNum: 8
---

# 参考リンク

- Nix Flakes: <https://nixos.wiki/wiki/Flakes>
- パッケージ検索: <https://search.nixos.org/packages>
- nix-direnv: <https://github.com/nix-community/nix-direnv>
- dockerTools: <https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-dockerTools>

---
layout: content
eyebrow: まとめ
eyebrowNum: 8
---

# Appendix: よくある反論

- 「importNpmLock があるのでは?」
  - npm ならその通り。うちは pnpm + Nx モノレポで残コストがあり、かつ主因は運用
- 「CI でビルドすればいい」
  - 正しい。手元の docker build 相当の確認ループが CI 往復になるトレードオフ

<div class="text-xs op60 mt-8">
出典: nixpkgs マニュアル JavaScript section / github.com/Mic92/nix-update / github.com/cpick/nix-rosetta-builder / docs.determinate.systems/determinate-nix/linux-builder/
</div>

---
layout: end
---

# ありがとうございました
