---
layout: section
color: blue
toc: 運用のしくみ
---

# 運用のしくみ

例外・ドキュメント・導入の手順

---
layout: two-cols
eyebrowNum: 5
eyebrow: 運用のしくみ
ratio: 1/1.2
valign: center
---

# 例外は「禁止」ではなく「理由の明示を強制」

<v-clicks>

- ポリシーは `deny` を書かない
  → `finding {path, rule, msg}` を出す
- 共通の `exceptions.rego` **1 箇所** が deny に変換
- `--data` で渡す YAML と `path` × `rule` で突合
- `reason` は **必須**。空なら免除されない

</v-clicks>

::right::

<div class="code-compact">

```rego
# policy/hcl/exceptions.rego
deny contains v.msg if {
	some v in finding
	not excepted(v.path, v.rule)
}

excepted(path, rule) if {
	some e in data.exceptions
	e.path == path
	e.rule == rule
	trim_space(e.reason) != ""
}
```

</div>

<!--
各 deny ルールが免除ヘルパーを呼ぶ規約にすると、呼び忘れ 1 箇所で allowlist が静かに無効化される。
構造で防ぐために deny を 1 箇所に集める。policy/hcl で deny を書けるのは exceptions.rego だけ (CI で grep 検査)。
rule 名の typo はエラーにならず「免除されないだけ」なので、ポリシー一覧の識別子をコピーする。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# `path: "*"` は rule 単位の全免除

<div class="code-compact">

```yaml
# .conftest-exceptions.yaml (各リポジトリのルート)
exceptions:
  - path: environments/staging/domain/terraform.tf   # ファイル単位
    rule: workspace_path_match
    reason: "旧プロダクト名の workspace を維持している"
  - path: "*"                                        # rule 単位で全免除
    rule: workspace_separator
    reason: "規約制定以前からのリポジトリ (既存命名 _ を維持)"
```

</div>

<div class="grid grid-cols-2 gap-6 mt-3">
<div v-click>

## `"*"` を使ってよいとき

- 既存リポジトリの grandfather
- リネームの影響範囲が広すぎる rule

</div>
<div v-click>

## 避けたいとき

- ファイル単位で書けるなら **ファイル単位で**
- `"*"` は新規ファイルにも効いてしまう

</div>
</div>

<!--
免除は「消す」のではなく「理由つきで残す」。後から読む人がなぜかを追える。
allowlist は plan JSON 系統 (policy/main) の deny には効かない。CIDR 違反は免除ではなく直す。
-->

---
layout: two-cols
eyebrowNum: 5
eyebrow: 運用のしくみ
ratio: 1/1.2
valign: center
---

# METADATA 注釈でポリシー一覧を自動生成

<v-clicks>

- rule の直前に `# METADATA` を書く
- `title` = rule 識別子 (allowlist の `rule`)
- `description` = 検査内容、`custom` = 根拠
- `conftest doc -t <template>` で表を生成
- README に埋め込み、CI で差分検出

</v-clicks>

::right::

<div class="code-compact">

```rego
# METADATA
# title: workspace_env_match
# description: env が workspace 名に含まれること
# custom:
#   source: 社内の workspace 命名規約
finding contains v if {
	...
}
```

<v-click>

```sh
$ scripts/gen-policy-docs.sh --check
# README の BEGIN_POLICY_TABLE 〜 END が古いと失敗
```

</v-click>

</div>

<!--
ポリシーを追加したら METADATA も書く。書き忘れは README の差分検出で CI が落ちるので気づける。
allowlist の rule 名は README の表からコピーする運用にすると typo が減る。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# 全体構成: ポリシーは組織で 1 リポジトリに集約

<div class="grid gap-4 mt-2 items-stretch text-sm" style="grid-template-columns: 1fr auto 1fr">
<div class="rounded-lg px-4 py-3" style="border: 2px solid var(--findy-brand)">

**各 Terraform リポジトリ** (app-a, app-b, ...)

- `.github/workflows/conftest.yml` … 呼ぶだけ
- `.conftest-exceptions.yaml` (ルート)
- `environments/<env>/**/*.tf`

</div>
<div class="flex flex-col items-center justify-center op70" style="width: 11rem">

<div class="text-xs text-center">`uses:`<br>`org/policies/...@SHA`</div>
<div class="text-2xl">→</div>
<div class="text-xs text-center">SHA は Renovate が追従</div>

</div>
<div class="rounded-lg px-4 py-3" style="border: 2px solid var(--findy-brand); background: color-mix(in srgb, var(--findy-brand) 6%, transparent)">

**ポリシーリポジトリ** (例: `org/policies`)

- `conftest-check.yml` … reusable workflow
- `policy/hcl/` … HCL 系統 (workspace 名・パス)
- `policy/main/` … plan JSON 系統 (VPC CIDR)
- `policy/README.md` … METADATA から生成

</div>
</div>

<v-click>

<div class="mt-5">

ポリシーを直すのは **ポリシーリポジトリだけ**。各リポジトリは workflow の呼び出しと allowlist だけを持つ

</div>

</v-click>

<!--
ポリシーリポジトリが private だと呼び出し側から reusable workflow が解決できないので internal か public にする。
conftest-check.yml は plan JSON を artifact で受け取るか、fixture ディレクトリから plan を作る。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# 導入の流れ: warn 期間は設けない

<div class="grid grid-cols-4 gap-3 text-sm">
  <div class="rounded-lg px-3 py-2" style="background: color-mix(in srgb, var(--findy-brand) 8%, transparent)"><b style="color: var(--findy-brand)">1</b>&nbsp; ローカルで既存違反を洗い出す</div>
  <div class="rounded-lg px-3 py-2" style="background: color-mix(in srgb, var(--findy-brand) 16%, transparent)"><b style="color: var(--findy-brand)">2</b>&nbsp; リネームか例外登録かを決める</div>
  <div class="rounded-lg px-3 py-2" style="background: color-mix(in srgb, var(--findy-brand) 24%, transparent)"><b style="color: var(--findy-brand)">3</b>&nbsp; workflow + allowlist を 1 PR で入れる</div>
  <div class="rounded-lg px-3 py-2 text-white" style="background: var(--findy-brand)"><b>4</b>&nbsp; 導入 PR 自身で緑を確認</div>
</div>

<v-click>

<div class="code-compact mt-4">

```sh
# リポジトリのルートで実行する (environments/ 内からだと env 検査が静かに無効化)
conftest test --policy ../policies/policy --namespace hcl \
  --parser hcl2 --combine --data .conftest-exceptions.yaml \
  $(find . -name '*.tf' -not -path '*/.terraform/*' | perl -pe 's|^\./||')
```

</div>

</v-click>

<v-click>

<div class="mt-4">
<FindyCallout variant="warn" label="warn 期間を作らない理由">
warn は誰も見ない。導入 PR が緑になる = 既存違反はすべてリネーム済みか理由つきで免除済み、という状態から始める
</FindyCallout>
</div>

</v-click>

<!--
洗い出しはポリシーリポジトリを隣に clone して --policy ../policies/policy で実行する。
allowlist は導入 PR に同梱し、レビューで reason を読んでもらう。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# 落とし穴 3 つ

<div class="grid gap-4 mt-2 text-sm code-compact" style="grid-template-columns: 1.3fr 1fr 1fr">
<div v-click>

## a. negation の罠

```rego
# キー欠落で rule ごと消える
not is_string(x.y.z)
```

```rego
# 値を取ってから判定する
v := object.get(x, ["y", "z"], null)
not is_string(v)
```

`not` の中の参照は外に巻き上げられ、欠落だと代入が不成立になる

</div>
<div v-click>

## b. fail-closed

値が確定しない (`after_unknown`)、ブロックが無い、形が不正

→ 「検証できない」は **deny に倒す**

「違反ではない」に倒すと a. と組み合わさって素通りする

</div>
<div v-click>

## c. METADATA の位置

`package hcl` を複数ファイルで共有している

→ package スコープの `# METADATA` は **1 つしか書けない**

各 rule の直前 (rule スコープ) に書く

</div>
</div>

<!--
a. は VPC CIDR ポリシーの初版で実際に踏んだバグ。欠落入力 (after_unknown) のテストで発覚した。
c. は 2 ファイル目に package スコープを書くとコンパイルエラーになる。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# 他のツールと何が違う?

<div class="text-sm">

| ツール | 見るもの | カスタムルール |
| --- | --- | --- |
| `terraform validate` / `fmt` | 構文とスキーマ | 書けない |
| tflint | provider 知識を持つ既製 lint (存在しない instance type、非推奨構文、バージョン固定漏れ) | Go プラグイン。既製ルールで足りるならこちら |
| trivy | セキュリティのベストプラクティス (公開 S3、暗号化なし) | Rego で書ける (スキャン内蔵) |
| checkov | 同上 + リソース間の接続 | Python / YAML。**リソースとその属性・接続**が単位 |
| `terraform test` | モジュール単体の動作 | 横断ルールではない |
| **conftest (OPA)** | 任意の構造化データ (plan JSON / HCL / YAML) | Rego。**リソースに縛られない** |

</div>

<v-click>

<div class="mt-4">
<FindyCallout label="conftest を選ぶ理由">
リソースでない設定 (workspace 名) ・ファイルパスとの突合・ファイル横断の重複は、リソース単位のモデルでは表せない
</FindyCallout>
</div>

</v-click>

<!--
「checkov では組織ルールが書けない」は誤り。Python (属性) と YAML (属性 + リソース間の接続、AND/OR/NOT) でカスタムポリシーを書けるし、
#checkov:skip=ID:理由 で理由付きの例外も書ける。接続状態の検査は Rego より書きやすいくらい。
違うのはデータモデルの範囲。checkov は「リソースとその属性・接続」が単位なので、
terraform { cloud { workspaces { name } } } のようなリソースでないブロック、ファイルパスとの突合、
ファイル横断の重複検出は守備範囲の外。conftest は入力が任意の構造化データなので、そこが書ける。
既製のセキュリティチェックが欲しいだけなら trivy / checkov で足りる。conftest は置き換えではなく併用。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# よくある質問

<div class="text-sm">
<v-clicks>

- **Q. plan を実行しないと使えない?**<br>
  A. HCL 系統 (`--parser hcl2`) は plan 不要。値の検査 (plan JSON) だけ plan が要る
- **Q. HCP Terraform の Sentinel / OPA policy set と何が違う?**<br>
  A. あちらは apply 前のゲートとして HCP 側で動く (プランによる)。conftest は CI で無料で回せ、HCL 段階でも検査でき、ローカルで同じコマンドを再現できる。併用も可
- **Q. checkov でも独自ルールを書けるのでは?**<br>
  A. 書ける。Python (属性) と YAML (属性 + リソース間の接続) があり、接続の検査はむしろ得意。単位が「リソース」なので、リソースでない設定ブロックやファイルパスの突合には向かない、という住み分け
- **Q. deny が出ないとき、どう調べる?**<br>
  A. `conftest parse` で input の形を確認し、`conftest test --trace` か `opa eval` で条件を 1 つずつ削る。大抵は `[_]` の配列忘れか `not` の中の参照 (落とし穴 a.)
- **Q. 例外はどこまで許す?**<br>
  A. 禁止ではなく理由の明示を強制する。`reason` 必須、ファイル単位が基本、`path: "*"` は既存の grandfather 専用
- **Q. ポリシーは誰が書く?**<br>
  A. 共通リポジトリの CODEOWNERS (SRE 等) が持ち、各リポジトリ側は allowlist だけ触る。`conftest verify` が採点者なので、レビューは仕様の妥当性に集中できる

</v-clicks>
</div>

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# ハンズオン: mozumasu/rego-playground

<div class="grid grid-cols-3 gap-x-6 gap-y-1 mt-2 text-sm">
<div>

1. hello deny
2. undefined
3. iteration

</div>
<div>

4. helpers
5. tests
6. plan JSON

</div>
<div>

7. HCL
8. exceptions allowlist
9. METADATA

</div>
</div>

<v-click>

```sh
git clone https://github.com/mozumasu/rego-playground
cd rego-playground && direnv allow    # conftest / opa / terraform が入る
cd exercises/01_hello_deny
conftest verify -p policy/            # TODO を埋めて全通過なら合格
```

</v-click>

<v-click>

<div class="mt-4">
<FindyCallout label="進め方">
各章の README を読み、<code>policy/*.rego</code> の <code># TODO</code> を埋める。テストが採点者
</FindyCallout>
</div>

</v-click>

<!--
今日の章立てと同じ順。06 で plan JSON、07 で HCL、08 で allowlist と、実運用に必要なものを一通りなぞる。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# 参考リンク

<FindyKeyValueList labelWidth="14rem">
  <FindyKeyValue label="OPA Policy Language">
    <a href="https://www.openpolicyagent.org/docs/policy-language">openpolicyagent.org/docs/policy-language</a>
  </FindyKeyValue>
  <FindyKeyValue label="Rego Playground">
    <a href="https://play.openpolicyagent.org/">play.openpolicyagent.org</a>。input とポリシーを貼って中間ルールを個別評価
  </FindyKeyValue>
  <FindyKeyValue label="conftest docs">
    <a href="https://www.conftest.dev/">conftest.dev</a>
  </FindyKeyValue>
  <FindyKeyValue label="Rego Style Guide">
    <a href="https://www.openpolicyagent.org/docs/style-guide">openpolicyagent.org/docs/style-guide</a>。命名・<code>some</code> / <code>in</code> の使い方などの公式規約
  </FindyKeyValue>
  <FindyKeyValue label="ハンズオン">
    <a href="https://github.com/mozumasu/rego-playground">github.com/mozumasu/rego-playground</a>
  </FindyKeyValue>
</FindyKeyValueList>
