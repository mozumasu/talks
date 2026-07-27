# ADR-0001: スライドテーマの参照方法

- Status: Accepted
- Date: 2026-07-27

## Context

デッキごとに使うテーマは異なりうる。テーマの参照方法には次の選択肢があり、
CI の複雑さ・過去デッキの凍結 (再ビルドしても発表時の見た目を保つ)・
開発時の反映速度のトレードオフがある。

| 方法 | CI への影響 | 凍結 | 開発時の反映 |
| --- | --- | --- | --- |
| `link:` (兄弟ディレクトリ参照) | テーマリポジトリごとに checkout ステップ + private なら PAT | 効かない (常に checkout 時点のテーマ) | 即時 |
| git 依存 (`github:<owner>/<repo>#<sha>&path:...`) | 不要 (public なら認証もゼロ) | SHA 固定で効く | コミット + SHA 更新が必要 |
| npm publish (バージョン指定) | 不要 | バージョン固定で効く | publish が必要 |

現状は private の findy-slidev を `link:` で参照しており、CI は
findy-slidev の checkout (PAT 必要) を特別扱いしている。

## Decision

1. **今後追加する公開テーマは git 依存 + コミット SHA 固定で参照する**

   ```json
   "slidev-theme-xxx": "github:mozumasu/<repo>#<sha>&path:packages/slidev-theme-xxx"
   ```

   CI を一切変えずにテーマの異なるデッキを追加でき、SHA 固定により
   過去デッキの凍結も成立するため。

2. **findy-slidev (private) は当面 `link:` + CI checkout を維持する**

   private リポジトリへの git 依存は pnpm 側の認証設定が必要になり、
   checkout + `link:` より複雑になる。テーマ 1 つ分の特別扱いは許容する。

3. **npm publish は OSS としてテーマを配布したくなった場合のみ検討する**

## Consequences

- テーマ開発中は即時反映のため手元で一時的に `link:` へ書き換えてよいが、
  その状態をコミットしない (コミットするのは SHA 固定の git 依存)
- テーマを更新したデッキは SHA を明示的に上げる。上げない限り
  過去デッキの見た目は変わらない
- findy-slidev を public 化した場合は 2. を 1. に統合でき、
  CI の checkout ステップと `THEME_REPO_READ_TOKEN` を削除できる
