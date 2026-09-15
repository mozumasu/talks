---
layout: section
color: blue
toc: 運用のしくみ
---

# 運用のしくみ

例外・ドキュメント・導入の手順

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
class: code-sm code-tight
footerLink: { label: "ハンズオン 08_exceptions_allowlist", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/08_exceptions_allowlist" }
---

# 免除の判定をルールごとに書くと、書き忘れで静かに消える

<div class="grid grid-cols-[1.1fr_1fr] gap-x-8 items-start">
<div>

```rego
deny contains msg if {
	...                                        # 条件
	not excepted(path, "workspace_env_match")  # 免除なら deny しない
	msg := "..."
}

deny contains msg if {
	...                                        # 条件
	# excepted を書き忘れた。エラーは出ない
	msg := "..."
}
```

</div>
<div class="text-sm leading-relaxed">

<div v-click="1">

ルールを書く人が毎回 `not excepted(...)` を呼ぶ約束

</div>

<div v-click="2" class="mt-3">
<FindyCallout label="書き忘れても緑" variant="warn">
そのルールだけ allowlist が効かず、載せたのに FAIL する。壊れても緑になる言語なので、テストでしか気付けない。ルールが増えるほど起きる
</FindyCallout>
</div>

</div>
</div>

<!--
各 deny ルールが免除ヘルパーを呼ぶ規約は「人が守る」前提。silent pass の言語なので、
1 箇所書き忘れただけで allowlist が効かなくなり、しかもエラーにならない。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
class: code-sm code-tight
footerLink: { label: "ハンズオン 08_exceptions_allowlist", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/08_exceptions_allowlist" }
---

# 免除の判定は 1 箇所に集める: ルールは finding を出すだけ

<div class="flow-fanin">
<div v-click="1" class="flow-node flow-node--rule" style="grid-column: 1; grid-row: 1"><span class="flow-term">rule</span>workspace_env_match</div>
<div v-click="1" class="flow-node flow-node--rule" style="grid-column: 1; grid-row: 2"><span class="flow-term">rule</span>workspace_separator</div>
<svg v-click="2" class="flow-arrow" style="grid-column: 2; grid-row: 1" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>
<svg v-click="2" class="flow-arrow" style="grid-column: 2; grid-row: 2" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>
<div v-click="2" class="flow-node" style="grid-column: 3; grid-row: 1 / span 2"><span class="flow-term">finding</span>同名ルールの出力が<br>1 つの集合に合算される</div>
<svg v-click="3" class="flow-arrow" style="grid-column: 4; grid-row: 1 / span 2" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>
<div v-click="3" class="flow-node flow-node--file" style="grid-column: 5; grid-row: 1 / span 2"><span class="flow-term">exceptions.rego</span>1 件ずつ allowlist と突合し<br>免除でなければ deny に</div>
<svg v-click="4" class="flow-arrow flow-arrow--left" style="grid-column: 6; grid-row: 1 / span 2" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>
<div v-click="4" class="flow-node flow-node--file" style="grid-column: 7; grid-row: 1 / span 2"><span class="flow-term">--data</span>.conftest-exceptions.yaml</div>
<div v-click="5" class="flow-arrow-wrap" style="grid-column: 5; grid-row: 3"><svg class="flow-arrow flow-arrow--down" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg></div>
<div v-click="5" class="flow-node flow-node--deny" style="grid-column: 5; grid-row: 4">deny</div>
</div>

<div class="grid grid-cols-[1.15fr_1fr] gap-x-6 items-start mt-2">
<div>

```rego
finding contains v if {
	...                                  # 条件
	v := {"path": path, "rule": "workspace_env_match", "msg": "..."}
}

finding contains v if {
	...                                  # 条件
	v := {"path": path, "rule": "workspace_separator", "msg": "..."}
}
```

</div>
<div v-click="3">

```rego
# exceptions.rego: deny を書くのはここだけ
deny contains v.msg if {
	some v in finding
	not excepted(v.path, v.rule)
}
```

</div>
</div>

<!--
finding contains v を同名で複数書くと、2 章の集合ルールと同じで 1 つの集合 finding に合算される。
exceptions.rego はその集合を 1 件ずつ見て、allowlist (--data で渡した data.exceptions) に一致しなければ deny に入れる。
ルール側は免除の存在を知らなくてよい。deny / violation / warn を conftest が直接拾うので、中間集合の名前は予約語以外 (finding) にする。
-->

---
layout: two-cols
eyebrowNum: 5
eyebrow: 運用のしくみ
ratio: 1/1.2
valign: center
footerLink: { label: "ハンズオン 08_exceptions_allowlist", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/08_exceptions_allowlist" }
---

# 例外は「禁止」ではなく「理由の明示を強制」

<div class="text-sm">

<v-clicks>

- ポリシーは `deny` を書かない
  → `finding {path, rule, msg}` を出す
- 共通の `exceptions.rego` **1 箇所** が deny に変換
- `--data` で渡す YAML と `path` × `rule` で突合
- `reason` は **必須**。空なら免除されない

</v-clicks>

</div>

<div v-click="5" class="mt-4">
<FindyCallout label="やってみよう (ハンズオン 08)">
<strong>Q1</strong> reason を空にすると?　<strong>Q2</strong> rule 単位で全ファイルを免除する
</FindyCallout>
</div>

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

# 新 rule は warn で入れて、全リポジトリが緑になったら deny に上げる

<div class="text-xs op70 mt-1">rule ごとに重大度 (level) を持つ。解決順は左が優先</div>

<div class="flow-chain">
<div v-click="1" class="flow-node flow-node--file"><span class="flow-term">rules:</span>呼び出し側の上書き<br>下げるには <code>reason</code> 必須<br>上げるのは自由</div>
<div v-click="1" class="flow-chain-gt">&gt;</div>
<div v-click="1" class="flow-node flow-node--file"><span class="flow-term">levels.yaml</span>ポリシー側の既定<br>rule 一覧を兼ねる<br>新 rule は <code>warn</code> で登録</div>
<div v-click="1" class="flow-chain-gt">&gt;</div>
<div v-click="1" class="flow-node flow-node--deny"><span class="flow-term">deny</span>どちらにも無い rule<br>(fail-closed)<br>typo もここで落ちる</div>
<svg v-click="2" class="flow-arrow" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>
<div v-click="2" class="flow-levels">
<div class="flow-node flow-node--deny"><b>deny</b>: <code>::error</code> で CI が落ちる</div>
<div class="flow-node flow-node--warn"><b>warn</b>: <code>::warning</code> で CI は通る</div>
<div class="flow-node flow-node--off"><b>disabled</b>: 出さない</div>
</div>
</div>

<div class="text-xs op70 mt-8">段階導入: 先回りの免除 PR を各リポジトリに出さなくてよい</div>

<div class="flow-steps">
<div v-click="3" class="flow-node"><span class="flow-term">1. warn で追加</span>ポリシー側の PR 1 つ<br>呼び出し側の CI は落ちない</div>
<svg v-click="4" class="flow-arrow" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>
<div v-click="4" class="flow-node"><span class="flow-term">2. 直す or 免除</span>各リポジトリが自分のペースで<br><code>::warning</code> で PR 上に見える</div>
<svg v-click="5" class="flow-arrow" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>
<div v-click="5" class="flow-node"><span class="flow-term">3. 全部 0 failures</span>ポリシー側から全呼び出し側に<br>流して確認するスクリプト</div>
<svg v-click="6" class="flow-arrow" viewBox="0 0 80 20"><line x1="4" y1="10" x2="62" y2="10"/><path d="M60 2 L76 10 L60 18 Z"/></svg>
<div v-click="6" class="flow-node flow-node--deny"><span class="flow-term">4. deny に上げる</span>levels.yaml を 1 行変えるだけ<br>以後は落とす</div>
</div>

<!--
新 rule を共通ポリシーに足すと、呼び出し側全部の CI が同時に落ちる。今までは先に免除 PR を全リポジトリに出してからでないとマージできなかった。
rule ごとの level を持たせて、新 rule は warn で入れる。warn は GitHub アノテーション (--output github) にだけ出し、Job Summary や PR コメントは作らない。--fail-on-warn も付けない。
level 解決は共通の lib に 1 箇所置き、各系統の exceptions.rego が finding を deny / warn に振り分ける。ポリシー本体は level を知らない。
呼び出し側の rules: は .conftest-exceptions.yaml のトップレベルキー (新ファイルは作らない)。既定より下げるときだけ reason 必須。空なら既定で評価して deny で知らせる。上げるのは自由。
値は deny / warn / disabled。off は YAML で真偽値になるので使わない。
rule 単位の全免除は rules: <rule>: {level: disabled, reason} に一本化する (次のスライド)。
levels.yaml が rule 一覧を兼ねるので、rules: や exceptions[].rule に無い名前があれば deny で落ちる。今までは typo が黙って無視されていた。
rule を消すときは levels.yaml に disabled で名前だけ残し、呼び出し側の掃除が済んでから消す。
助言レベルの rule (同じリソース型の重複など) は恒久 warn にして deny に上げない。
-->

---
layout: two-cols
eyebrowNum: 5
eyebrow: 運用のしくみ
ratio: 1/1.25
valign: top
class: code-xs code-tight
---

# level 解決の部品: `--data` のマージ、`import`、`else`、`warn`

<div class="text-sm leading-relaxed">

<v-clicks>

- `--data` は**複数回**渡せる。トップレベルキーがそのまま `data.levels` / `data.rules` / `data.exceptions` に
- 解決関数は別 package に置き `import data.lib.levels` で参照
- 関数の `else` は**上から順に、最初に値が決まった段で止まる**
- `deny contains` / `warn contains` に振り分ける。`warn` は警告扱いで **exit 0** (`--fail-on-warn` なし)
- `--output github` で `::error` / `::warning` になる

</v-clicks>

<div v-click="6" class="mt-2">

```sh
$ conftest test -p policy -n hcl --output github \
    --data levels.yaml \
    --data .conftest-exceptions.yaml main.tf
::warning file=main.tf,line=1::"my-vpc": not snake_case
2 tests, 1 passed, 1 warning, 0 failures, 0 exceptions
```

</div>

</div>

::right::

```rego
# policy/lib/levels.rego
package lib.levels
level(rule) := l if {
	l := data.rules[rule].level    # 呼び出し側の上書き
} else := l if {
	l := data.levels[rule]         # ポリシー側の既定
} else := "deny"                   # どちらにも無い
```

<div v-click="4">

```rego
# policy/hcl/exceptions.rego
import data.lib.levels

deny contains v.msg if {
	some v in finding
	not excepted(v.path, v.rule)
	levels.level(v.rule) == "deny"
}

warn contains v.msg if {
	...                            # deny と同じ 2 条件
	levels.level(v.rule) == "warn"
}
```

</div>

<!--
--data に同じトップレベルキーを持つファイルを 2 つ渡すと挙動を読みにくいので、ファイルごとにキーを分ける (levels.yaml は levels だけ、呼び出し側は rules と exceptions)。
「下げるには reason 必須」の検査はスライドでは略した。実装は rules の level が既定より低いときだけ reason の空を弾き、空なら既定の level で評価して deny の msg に理由を載せる。上げるのは自由。
typo 検出: data.rules のキーと data.exceptions[].rule が data.levels に無ければ deny。input を見ない deny なので、どのファイルを検査しても同じ 1 件が出る。今までは exceptions の typo が「免除されないだけ」で黙って通っていた。
テストは with data.levels as {...} with data.rules as {...} で注入する。ケースは 既定 / 下げに reason 無し / 上げ / disabled / 未登録 / typo の 6 つ。
deny と warn を書けるのは exceptions.rego だけ、を CI の grep で強制する (deny-guard)。policy/ 全体が対象。
出力は conftest 0.69.0 (OPA 1.19.0) で最小の fixture (aws_vpc 1 つ、rule 3 本、levels.yaml と rules: で 1 つを disabled) を実行したもの。
-->

---
layout: content
eyebrowNum: 5
eyebrow: 運用のしくみ
---

# rule 単位の免除は `rules:` で level を下げる

<div class="code-compact">

```yaml
# .conftest-exceptions.yaml (各リポジトリのルート)
rules:                                     # rule 単位。既定より下げるには reason 必須
  workspace_separator:
    level: disabled
    reason: "規約制定以前からのリポジトリ (既存命名 _ を維持)"
exceptions:                                # ファイル単位
  - path: environments/staging/domain/terraform.tf
    rule: workspace_path_match
    reason: "旧プロダクト名の workspace を維持している"
```

</div>

<div class="grid grid-cols-2 gap-6 mt-3">
<div v-click>

## `rules:` で下げてよいとき

- 既存の grandfather は `disabled`
- 直し終わるまでは `warn`

</div>
<div v-click>

## 避けたいとき

- ファイル単位で書けるなら **ファイル単位で**
- `disabled` は新規ファイルにも効く

</div>
</div>

<!--
免除は「消す」のではなく「理由つきで残す」。後から読む人がなぜかを追える。
path を "*" にしてファイル単位の免除を全免除に流用する書き方は作らない。rule 単位は rules: に一本化する。
上げるのは自由 (reason 不要)。rule 名が levels.yaml に無ければ typo として deny で落ちる。
plan JSON 系統 (policy/main) も finding 形式 (path の代わりにリソースアドレス) で同じ level 解決を通す。ただしアドレス単位の免除は作らない。CIDR 違反は免除ではなく直す。
-->


---
layout: two-cols
eyebrowNum: 5
eyebrow: 運用のしくみ
ratio: 1/1.15
valign: top
class: code-sm code-tight
footerLink: { label: "ハンズオン 09_write_tests", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/09_write_tests" }
---

# テストの規律: コードパスごとに 1 件、最小 3 ケース

<div class="text-sm leading-relaxed">

<v-clicks>

1. **準拠入力が pass** — 正しいものを止めていない
2. **違反入力が deny** — ポリシーが生きている。壊れても緑になる言語なので、これが唯一の検出器
3. **欠落 / 未確定入力が deny** — キーが無い・値が未確定でも黙って通していない

</v-clicks>

<div v-click="4" class="mt-3">

境界値のバリエーションや対称ケースは同じコードパスの別入力。**網羅しない**

</div>

<div v-click="5" class="mt-2">

件数は `count(deny) == N` の**完全一致**。`> 0` は別ルールの誤発火を見逃す

</div>

<div v-click="8" class="mt-3">
<FindyCallout label="やってみよう (ハンズオン 09)">
<strong>Q1</strong> rule 識別子をタイポすると落ちるのは?　<strong>Q2</strong> separator のテストを 1 本足す
</FindyCallout>
</div>

</div>

::right::

<div v-click="6">

<div class="text-sm mb-1"><code>finding</code> 方式ならさらに 2 点を固定する</div>

```rego
# rule 識別子そのもの。タイポは「免除されないだけ」で気付けない
test_rule_id if {
	{v.rule | some v in finding} == {"workspace_env_match"}
		with input as ng
}

# allowlist に載せたら deny が消える
test_excepted if {
	ex := [{"path": "environments/staging/a.tf",
	        "rule": "workspace_env_match", "reason": "旧名を維持"}]
	count(deny) == 0 with input as ng with data.exceptions as ex
}
```

</div>

<div v-click="7" class="mt-2">

```sh
$ conftest verify -p policy/
3 tests, 3 passed, 0 warnings, 0 failures, 0 exceptions, 0 skipped
```

</div>

<!--
3 ケースは 3 章「テストが採点者」の ok / ng / {} と同じ構成。ここでは規律として名前を付ける。
網羅しないのは保守コストに見合わないから。コードパスが増えたときだけテストを足す。
finding 方式では rule 識別子の typo が「免除されないだけ」で気付けないので、識別子の値そのものを固定する。
with data.exceptions as で allowlist を注入し、免除が効くことも 1 件で固定する。
出力は conftest 0.69.0 で、このスライドの 2 テスト + reason 空で免除されないテストの 3 本を実行したもの。
-->

---
layout: two-cols
eyebrowNum: 5
eyebrow: 運用のしくみ
ratio: 1/1.2
valign: center
footerLink: { label: "ハンズオン 10_metadata_docs", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/10_metadata_docs" }
---

# METADATA 注釈でポリシー一覧を自動生成

<div class="text-sm">

<v-clicks>

- rule の直前に `# METADATA` を書く
- `title` = rule 識別子 (allowlist の `rule`)
- `description` = 検査内容、`custom` = 根拠
- `conftest doc -t <template>` で表を生成
- README に埋め込み、CI で差分検出

</v-clicks>

</div>

<div v-click="6" class="mt-4">
<FindyCallout label="やってみよう (ハンズオン 10)">
<strong>Q1</strong> source を消して生成すると?　<strong>Q2</strong> package スコープに書くと?
</FindyCallout>
</div>

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
package スコープの # METADATA は package に 1 つしか書けない (2 ファイル目に書くとコンパイルエラー)。
複数ファイルで package hcl を共有しているので、各 rule の直前 (rule スコープ) に書く。
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
  A. 禁止ではなく理由の明示を強制する。`reason` 必須、ファイル単位が基本、rule 単位は `rules:` で level を下げる (既存の grandfather 専用)
- **Q. ポリシーは誰が書く?**<br>
  A. 共通リポジトリの CODEOWNERS (SRE 等) が持ち、各リポジトリ側は allowlist だけ触る。`conftest verify` が採点者なので、レビューは仕様の妥当性に集中できる

</v-clicks>
</div>

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
