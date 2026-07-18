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

## 注意

- スライドの md は `.rumdl.toml` で formatter から除外している
  (rumdl がスライド区切りの `---` を壊すため)。新しいページを
  `slides/pages/` 以外に置くなら exclude に追加する
- スライド内の画像は `slides/public/` に置き、静的 `src="/..."` ではなく
  `:src="'/...'"` のバインディング形式で参照する (slide-import-guard 対策)
