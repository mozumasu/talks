# ADR-0002: CI から読めないテーマのデッキはビルド結果をコミットする

- Status: Accepted
- Date: 2026-10-26

## Context

会社のテーマ (partner-prop/slides の partnerprop テーマ) を使ったデッキを
talks.mozumasu.com で公開したい。個人ドメインでの公開は会社の許可を得ている。

partner-prop/slides は private で、ADR-0001 の `link:` + CI checkout には読み取り用の
トークンが要る。しかし fine-grained PAT や org の GitHub App (PROP_CI_BOT) で
個人のリポジトリから会社のリポジトリを参照することは認められていない。
git submodule も fetch に同じ認証が要るので、この制約は回避できない。

会社と個人の両方のリポジトリを読めるのは手元のマシンだけである。

## Decision

headmatter に `prebuilt: true` を書いたデッキは、手元でビルドした結果を
`prebuilt/<slug>/` にコミットし、CI はそれを配信する。

- `scripts/build.mjs` は `link:` 先のテーマがあればビルドして `prebuilt/<slug>/` を更新し、
  無ければ `prebuilt/<slug>/` をコピーする。手元も CI も入口は `pnpm build` のまま
- `prebuilt/<slug>/.source-hash` にデッキのソースのハッシュを残し、ソースを直したのに
  `prebuilt/` を更新し忘れたときは CI のビルドを失敗させる

## Consequences

- CI に会社のリポジトリへの権限を持たせずに済む
- デッキやテーマを直すたびに、手元で `pnpm build` して `prebuilt/` をコミットする必要がある
- テーマ側の変更は CI から検出できない。テーマを更新したら手元でビルドし直す
- ビルド結果 (会社のロゴ・画像を含む) が talks の git 履歴に残る。
  配信している内容と同じなので公開範囲は変わらないが、リポジトリのサイズは増える
