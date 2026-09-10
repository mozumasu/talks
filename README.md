# Slidev deck

Slidev + 自作テーマ (link 参照) のスライドプロジェクト。
テーマ参照はすべて `CHANGE_ME` プレースホルダーになっているので、
**置換してから** `pnpm install` する。

## 初期化

```sh
nix flake init -t github:mozumasu/nix-templates#slidev
direnv allow
# CHANGE_ME を置換してから:
cd slides && pnpm install
```

## CHANGE_ME の置換箇所

1. **テーマ** (必須。置換するまで `pnpm install` は失敗する)
   - `slides/package.json`: `slidev-theme-CHANGE_ME` / `slidev-addon-CHANGE_ME` と
     `link:../../CHANGE_ME/...` のリポジトリ名。隣にチェックアウトした
     テーマリポジトリを参照する前提 (ghq の標準配置)。
     npm 公開テーマを使うならバージョン指定に書き換える
   - デッキとテーマが**別オーナー配下**にある場合 (例: デッキが `github.com/<org>/`、
     テーマが `github.com/<user>/`) は `link:../../../<owner>/<theme-repo>/packages/...` と
     1 階層深くする。macOS はパスの大文字小文字を区別しないため、
     誤ったパスでもディレクトリ自体には解決されてしまい気づきにくい
   - `slides/slides.md`: headmatter の `theme:` / `addons:`
   - `slides/slides.md` のレイアウト名 (`talk-cover` / `profile` / `toc`) は
     テーマ側に存在する必要がある。無いテーマでは `cover` / `default` 等へ変更する
2. **プロジェクト名**
   - `slides/package.json` の `name`: `<リポジトリ名>-slides` 推奨。
     portless の worktree URL (`https://<worktree>.<name>.localhost`) に使われる
   - `slides/wrangler.jsonc` の `name`: リポジトリ名推奨 (Workers のサブドメインになる)
3. **本文**: `slides/slides.md` のタイトル・イベント名・所属
4. **デプロイ CI**: `.github/workflows/deploy-slides.yml` の
   `repository` / `path` / `working-directory` / `cache-dependency-path` の
   `CHANGE_ME` をテーマリポジトリ名に置換し、`ref` を固定したいコミット SHA にする

## デプロイ用 Secrets

- `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`
- `THEME_REPO_READ_TOKEN` (テーマリポジトリが private の場合の contents:read fine-grained PAT)

## 開発

```sh
cd slides
pnpm dev      # dev サーバー (--port ${PORT:-3030} 対応済みなので portless でも動く)
pnpm build    # dist/ に SPA ビルド
pnpm export   # PDF/PNG エクスポート (playwright-chromium は devDependencies に同梱)
```

Claude Code から起動する場合は `ghost run -- portless <name> pnpm dev`。

## 非公開 (作成中) のデッキ

`slides/<deck>/slides.md` の headmatter に `draft: true` を書くと、
そのデッキはビルドされず一覧にも載らない (`https://talks.mozumasu.com/<slug>/` も 404)。
公開するときに行を消す。

```yaml
---
draft: true
title: ...
---
```

draft も含めてビルドを確認したいときは `INCLUDE_DRAFTS=1 node scripts/build.mjs`。
slug の重複検出は draft も対象なので、公開に切り替えた時点で衝突することはない。

## 一覧に載せないデッキ (URL を知っている人にだけ見せる)

レビュー依頼など、配信はするが一覧には出したくないときは `unlisted: true` を書く。
`dist/<slug>/` は作られ `https://talks.mozumasu.com/<slug>/` で開けるが、
一覧には載らず、`<meta name="robots" content="noindex, nofollow">` が入る。

```yaml
---
unlisted: true
title: ...
---
```

`unlisted` は URL に関与しないので、公開するときは行を消すだけでよく URL は変わらない。
public リポジトリなので slug は隠せない。閲覧者を本当に制限したいときは
Cloudflare Access を `talks.mozumasu.com/<slug>/*` に掛ける (デッキ側の変更は不要)。

| | ビルド | 一覧 | URL |
| --- | --- | --- | --- |
| (指定なし) | する | 載る | 開ける |
| `unlisted: true` | する | 載らない | 開ける |
| `draft: true` | しない | 載らない | 404 |

## 一覧の並び順と docswell

一覧 (`https://talks.mozumasu.com/`) には、このリポジトリのデッキに加えて
docswell (<https://www.docswell.com/user/mozumasu>) で公開しているスライドも載る。
`scripts/build.mjs` がビルド時に RSS `https://www.docswell.com/user/mozumasu/feed` を取得し、
全エントリを日付降順で並べる。RSS の取得に失敗するとビルドは失敗する。

デッキ側は headmatter に次を書く。

```yaml
---
title: ...
date: 2026-09-09          # 一覧のソートキー。無ければディレクトリ名の日付 (月のみなら 1 日扱い)
docswell: https://www.docswell.com/s/mozumasu/XXXX  # 同じ登壇を docswell にも上げたとき
---
```

`docswell:` を書くと、RSS 側の同じ URL のエントリはデッキのカードにまとめられ、
カード内に「docswell ›」リンクが付く。タイトル一致などの自動突合はしない。
docswell 単独のエントリは RSS のサムネイルを直リンクし、別タブで docswell に遷移する。

docswell に新しくスライドを投稿しただけでは何も push されないので、
一覧に反映するには GitHub Actions のデプロイ workflow を手動で `workflow_dispatch` する
(`gh workflow run deploy-slides.yml` など)。cron での定期ビルドは入れていない。

## 注意

- スライドの md は `.rumdl.toml` で formatter から除外している
  (rumdl がスライド区切りの `---` を壊すため)。新しいページを
  `slides/pages/` 以外に置くなら exclude に追加する
- `/<slug>/2` のようなページ URL は実ファイルが無いので、静的アセットに一致しない
  リクエストだけ `worker.js` が受けて `/<slug>/index.html` を返す
  (`not_found_handling: single-page-application` だとルートの一覧ページが返ってしまう)。
  `_redirects` の 200 プロキシは、実在するファイルより先にルールが効いて画像や JS まで
  飛ばされるため使えない
- スライド内の画像は `slides/<deck>/public/` に置き、`:src="$asset('foo.jpg')"` /
  `:image="$asset('foo.jpg')"` で参照する。`$asset` は `setup/main.ts` で定義する
  ヘルパー (`slides/2026-09-terminal-keyboard/setup/main.ts` をコピーする) で、
  `--base /<slug>/` を前置する。静的 `src="/..."` は slide-import-guard に引っかかり、
  `:src="'/...'"` は Vite の asset 変換を通らず base が付かないので、どちらも使わない
- 一覧ページのサムネイルは `scripts/build.mjs` が各デッキの 1 ページ目を
  `slidev export --format png` で書き出して作る (`dist/<slug>/cover.png`)。
  Chromium が必要なので CI では `playwright install-deps` を実行している
- OGP (`og:image` / `og:url` / `twitter:card` など) は `scripts/build.mjs` がビルド後の
  `dist/<slug>/index.html` に足す。`og:image` は `cover.png`、`og:description` は
  `event` から組み立てる。デッキの headmatter `seoMeta` で書いたタグはそのまま残るので、
  個別に変えたいときは `seoMeta` に絶対 URL で書く (Slidev は `--base` を付けない)
- `scripts/build.mjs` はデッキごとに入力 (デッキのファイル、`link:` 先のテーマとその
  lockfile、`pnpm-lock.yaml`、スクリプト自身) をハッシュし、`.cache/decks/<slug>/<hash>/`
  に成果物があればビルドと export を飛ばす。CI では `actions/cache` で持ち越す。
  強制的に全部ビルドし直すなら `DECK_CACHE=0 node scripts/build.mjs`
