---
theme: findy
draft: true
title: Rego / conftest 入門
date: 2026-09-16
info: |
  Rego / conftest 入門
  社内勉強会
class: text-left
comark: true
favicon: https://github.com/mozumasu.png
addons:
  - slidev-addon-findy
layout: talk-cover
event: 社内勉強会
image: https://github.com/mozumasu.png
name: mozumasu
role: Platform SRE
---

## Terraform の Policy as Code を引き継ぐために
# Rego / conftest 入門

---
layout: profile
image: https://github.com/mozumasu.png
name: mozumasu
role: Platform SRE
---

## 自己紹介

- Platform SRE。Terraform リポジトリの CI と Policy as Code を担当
- 開発環境: macOS / WezTerm / Neovim / macSKK
- X: @mozumasu / GitHub: mozumasu

<div class="mt-6">
<FindyCallout label="今日のゴール">
Rego と conftest を知らない人が、Terraform の Policy as Code の運用 (ポリシー追加・例外登録・導入) を引き継げる状態になる
</FindyCallout>
</div>

<!--
前提: Terraform は書ける。Rego / OPA / conftest は初めて、という人向け。
-->

---
layout: toc
columns: 1
---

---
layout: section
color: blue
toc: なぜ Policy as Code か
---

# なぜ Policy as Code か

レビューで人が見つけていたミスを、CI で機械的に止める

---
layout: content
eyebrowNum: 1
eyebrow: なぜ Policy as Code か
---

# Terraform 運用でよくある事故

<div class="grid grid-cols-3 gap-x-10 gap-y-5 mt-4 text-sm">
<div v-click>

## state の上書き

`environments/production/` が
staging の workspace を掴んだまま apply

</div>
<div v-click>

## workspace 名の重複

別ディレクトリで同じ workspace 名を宣言。
どちらの plan か分からない

</div>
<div v-click>

## VPC CIDR の割当外

割当表に無いレンジで VPC を作成。
後から peering できない

</div>
</div>

<v-click>

<div class="mt-8 takeaway">

どれも `.tf` か plan を見れば分かる。人の目 (レビュー) に頼っていたものを CI に移す

</div>

</v-click>

<!--
3 つとも「気づいた人がたまたまレビューにいたから止まった」で済ませがちな事故。
再発防止をレビュー観点の追加で済ませると、また人の目に依存する。
-->

---
layout: content
eyebrowNum: 1
eyebrow: なぜ Policy as Code か
---

# 登場人物は 3 つ

<FindyTermCardList>
  <FindyTermCard term="OPA">
    ポリシーを評価するエンジン (Open Policy Agent)
    <template #note>単体で使うことは今日はない</template>
  </FindyTermCard>
  <FindyTermCard term="Rego">
    OPA のポリシー記述言語
    <template #note>今日の主役。読み方に慣れる</template>
  </FindyTermCard>
  <FindyTermCard term="conftest">
    Terraform / YAML 向けの CLI ラッパー
    <template #note>OPA を内蔵。ファイルを input にして deny を集めるだけ</template>
  </FindyTermCard>
</FindyTermCardList>

<v-click>

<div class="mt-6 text-center text-xl">

**conftest = 「ファイルを読んで、Rego に渡して、deny を並べる」だけのツール**

</div>

</v-click>

<!--
conftest は OPA を内蔵しているので別途 OPA のインストールは不要。
覚えることは Rego の書き方と conftest のコマンド 2 つだけ。
-->

---
layout: section
color: blue
toc: Rego の読み方
---

# Rego の読み方

手続きではなく「成り立つ条件」を宣言する

---
layout: two-cols
title: "「ルール」とは何か: 関数でも変数でもない"
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.1
valign: center
---

```python
# Python: 手順を書く
deny = []                       # 入れ物
for tag in tags:                # ループ
    if len(tag) >= 6:           # 条件
        deny.append(tag + " は長い")
```

<v-click>

<div class="mt-4 text-sm">

Rego 側には**入れ物もループも append も無い**。
`some tag in input.tags` は「そういう tag が存在する」という条件で、
満たした束縛のぶんだけ要素が増える

</div>

</v-click>

::right::

```rego
# Rego: 成り立つ条件を書く
deny contains msg if {
	some tag in input.tags
	count(tag) >= 6
	msg := sprintf("%s は長い", [tag])
}
```

<v-click>

<div class="mt-4">
<FindyCallout label="ルールは SQL のビューに近い">
呼び出すのではなく、評価すると中身が決まる。<br>
「条件を満たすものの集まり」に名前を付けたもの
</FindyCallout>
</div>

</v-click>

<!--
他の言語に対応物が無いのがここ。関数でも変数でもなく、SQL のビューが一番近い。
CREATE VIEW deny AS SELECT ... FROM tags WHERE length(tag) >= 6 と同じ気持ち。
ボディは「手順」ではなく「あり得る束縛全部に対するフィルタ」。
-->

---
layout: content
eyebrowNum: 2
eyebrow: Rego の読み方
---

# ルールはすべて同じ形をしている

<div class="grid grid-cols-2 gap-x-5 mt-3">

<pre class="rule-shape-block"><span class="rule-name">&lt;名前&gt;</span> <span class="rule-head">&lt;値の作り方&gt;</span> if &#123;
    <span class="rule-body">&lt;ボディ&gt;</span>
&#125;</pre>

<pre class="rule-shape-block"><span class="rule-name">deny</span> <span class="rule-head">contains msg</span> if &#123;
    <span class="rule-body">input.debug == true</span>
    <span class="rule-body">msg := "..."</span>
&#125;</pre>

</div>

<div class="text-sm mb-3">
ルール = <span class="rule-name">名前</span> + <span class="rule-head">値の作り方</span> (ここまでが head) + <span class="rule-body">ボディ (body)</span>。<span class="rule-name">deny</span> は構文ではなく<strong>ルールの名前</strong>で、conftest がその名前を探しに来る
</div>

<div class="rule-table">

| 種類 | <span class="rule-head">ヘッド</span>の書き方 | 値 |
| --- | --- | --- |
| 定数 | `name := 値` (ボディなし) | その値 |
| 真偽ルール | `name if { ... }` | 成立なら true、不成立なら **undefined** |
| 集合ルール | `name contains x if { ... }` | 条件を満たした x の集合。同名を複数書くと合算 |
| オブジェクトルール | `name[key] := value if { ... }` | key → value のマップ |
| 関数 | `name(引数) := 値 if { ... }` | 引数ごとの値 |
| 内包表記 | `{x \| 条件}` / `[x \| 条件]` | 式の中に埋め込んだ集合 / 配列 |

</div>

<v-click>

<div class="mt-3">
<FindyCallout label="名前を変えると検査ごと消える">
<code>deny</code> を <code>mydeny</code> にリネームすると conftest は探しに来ず、<code>0 tests, 0 passed</code> で緑になる
</FindyCallout>
</div>

</v-click>

<!--
用語は公式ドキュメントに合わせている (rule = head + body)。英語のドキュメントを読むときにそのまま繋がる。
deny を「conftest 用の予約語」だと思っていると、finding や vpc_creations のような
自作の集合ルールが出てきたときに読めなくなる。どれも同じ「ヘッド if { ボディ }」で、名前が違うだけ。
-->

---
layout: two-cols
title: "頭の切り替え: 手順書ではなく条件の宣言"
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.2
valign: center
---

<v-clicks>

- ルールの中の各行は **AND**
- 全部真なら `msg` が `deny` 集合に入る
- 1 行でも偽なら **何も起きない** (undefined)
- for も if-else も書かない。SQL の WHERE に近い

</v-clicks>

::right::

```rego
package main

import rego.v1

deny contains msg if {
	input.environment == "production"  # AND
	input.debug == true                # AND
	msg := "production では debug を無効に"
}
```

<v-click>

<div class="mt-3 text-sm op80">

`deny contains msg if { ... }` = 「この条件がすべて真なら msg は deny に含まれる」

</div>

</v-click>

<!--
「実行する」ではなく「成り立つものを探す」。合否は deny 集合が空かどうかで決まる。
合格判定を書くのではなく、違反を列挙する。
-->

---
layout: two-cols
title: "最小の例: input と実行結果を並べて読む"
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.2
valign: center
---

```json
// input.json
{
  "environment": "production",
  "debug": true
}
```

<v-click>

```sh
$ conftest test -p policy/ input.json
FAIL - input.json - main -
  production では debug を無効に

1 test, 0 passed, 0 warnings, 1 failure
```

</v-click>

::right::

```rego
# policy/debug.rego
package main

import rego.v1

deny contains msg if {
	input.environment == "production"
	input.debug == true
	msg := "production では debug を無効に"
}
```

<v-click at="2">

<div class="mt-3 text-sm op80">

`debug: false` にすると 2 行目が偽 → deny は空 → PASS

</div>

</v-click>

<!--
input はファイルの中身がそのまま input になる。ポリシーは -p で渡したディレクトリの *.rego 全部。
package main が conftest のデフォルト namespace。
-->

---
layout: two-cols
title: パッケージ全体を opa eval で覗く
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.1
valign: center
---

```rego
package main

max_size := 10

is_big if input.size > max_size

deny contains msg if {
	is_big
	msg := "size 超過"
}
```

::right::

```sh
$ opa eval -d policy -i big.json 'data.main'
```

```json
// size: 20
{ "deny": ["size 超過"],
  "is_big": true, "max_size": 10 }
```

<v-click>

```json
// size: 3
{ "deny": [], "max_size": 10 }
```

<div class="mt-2 text-sm op80">

`is_big` が消えた = false ではなく **undefined**。
集合ルールは不成立でも `[]` なので `count(deny) == 0` と書ける

</div>

</v-click>

<!--
data.main を丸ごと出すと、deny も自作ルールも同じ土俵に並んでいるのが見える。
size 3 のとき is_big はキーごと消える (undefined)。一方、集合ルールは不成立でも空集合になる。
だから count(deny) == 0 と書けるが、count(is_big) とは書けない。次のスライドの話につながる。
-->

---
layout: two-cols
title: undefined と false は違う
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.2
valign: center
---

<v-clicks>

- 条件が成り立たないとき、ルールの値は `false` ではなく **undefined**
- キーが無い参照 (`input.user.role` で `user` が無い) も undefined
- undefined は「偽」でも「エラー」でもなく **「値が無い」**
- `default allow := false` で undefined を false に倒す

</v-clicks>

::right::

```rego
default allow := false

allow if {
	input.user.role == "admin"
}
```

<v-click>

```rego
# not は「偽 または undefined」で真
deny contains msg if {
	not input.owner   # owner が無い / false
	msg := "owner を設定してください"
}
```

</v-click>

<!--
壊れたポリシー (タイポなど) も undefined になるだけでエラーが出ない。
CI は「違反ゼロ」と同じ顔で緑になる。これが後で出てくる「テストが採点者」の理由。
-->

---
layout: two-cols
title: 繰り返しは「存在する」と「すべて」
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.2
valign: center
---

<v-clicks>

- `some name, cfg in input.services`
  → 条件を満たす要素が **1 つでもあれば** その分 msg が出る
- `every cfg in input.services { ... }`
  → **すべて** 満たすときだけ真
- ループ変数を進める、break する、という発想はない

</v-clicks>

::right::

<div class="code-compact">

```rego
deny contains msg if {
	some name, cfg in input.services
	cfg.replicas < 2
	msg := sprintf("%s: replicas は 2 以上", [name])
}
```

<v-click>

```rego
all_owned if {
	every cfg in input.services {
		cfg.owner != ""
	}
}
```

</v-click>

</div>

<!--
some は for ループの代わり。全要素が自動で試され、条件を満たした要素ごとに msg が生成される。
every は「1 つでも満たさなければ undefined」。
-->

---
layout: two-cols
title: ヘルパー関数と組み込み関数
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.2
valign: center
---

<div class="text-sm">

| 組み込み | 用途 |
| --- | --- |
| `split(s, "/")` | 分割 |
| `sprintf("%v", [x])` | 整形 |
| `net.cidr_contains(a, b)` | CIDR 包含 |
| `object.get(o, [k], def)` | 欠落時の既定値 |

</div>

<v-click>

<div class="mt-3 text-sm op80">

関数は `名前(引数) if { ... }`。deny と同じく条件の集まり

</div>

</v-click>

::right::

<div class="code-compact">

```rego
allowed := {"10.0.0.0/12", "172.16.0.0/12"}

cidr_allowed(cidr) if {
	some range in allowed
	net.cidr_contains(range, cidr)
	to_number(split(cidr, "/")[1]) == 16
}
```

<v-click>

```rego
deny contains msg if {
	cidr := object.get(input, ["cidr"], null)
	not cidr_allowed(cidr)
	msg := sprintf("CIDR %v は割当外です", [cidr])
}
```

</v-click>

</div>

<!--
object.get はキーが無いときに第 3 引数を返す。「無い」を null に変換してから判定に進む。
これが無いと後で出てくる negation の罠に落ちる。
-->

---
layout: two-cols
title: テストが採点者
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.2
valign: center
---

<v-clicks>

- `*_test.rego` に `test_` ルールを書く
- `with input as {...}` で入力を差し替え
- `count(deny) == N` の **完全一致**
- 3 ケース: 準拠 pass / 違反 deny / 欠落 deny
- 実行は `conftest verify -p policy/`

</v-clicks>

::right::

<div class="code-compact">

```rego
# cidr_test.rego (package / import は省略)
ok := {"cidr": "10.1.0.0/16"}
ng := {"cidr": "192.168.0.0/16"}

test_allowed_passes if {
	count(deny) == 0 with input as ok
}

test_out_of_range_denied if {
	count(deny) == 1 with input as ng
}

test_missing_denied if {
	count(deny) == 1 with input as {}
}
```

</div>

<!--
壊れたポリシーはエラーを出さず deny が空になるだけ。
「違反入力で deny が出る」テストが唯一の検出器。テストの無い Rego は「壊れても緑」で運用されることになる。
-->

---
layout: section
color: blue
toc: conftest で Terraform を検査する
---

# conftest で Terraform を検査する

コマンドは 2 つ、入力は 2 系統

---
layout: content
eyebrowNum: 3
eyebrow: conftest で Terraform を検査する
---

# conftest のコマンドは 2 つ

<div class="text-sm">

| | `conftest test` | `conftest verify` |
| --- | --- | --- |
| 対象 | **実データ** (plan JSON / `.tf`) | **ポリシー自体** (`*_test.rego`) |
| 場面 | PR の CI、ローカルの洗い出し | ポリシーを書いた・直したとき |
| 失敗 | Terraform 側に違反がある | ポリシーが壊れている |
| 例 | `conftest test -p policy/ plan.json` | `conftest verify -p policy/` |

</div>

<v-click>

<div class="mt-5">
<FindyCallout label="覚え方">
test は Terraform を採点、verify は Rego を採点
</FindyCallout>
</div>

</v-click>

<!--
CI では test を各 Terraform リポジトリの PR で、verify をポリシーリポジトリ側の PR で回す。
-->

---
layout: content
eyebrowNum: 3
eyebrow: conftest で Terraform を検査する
---

# 入力は 2 系統: plan JSON と HCL

| | plan JSON | HCL |
| --- | --- | --- |
| 作り方 | `terraform show -json tfplan` | `--parser hcl2 --combine *.tf` |
| 見えるもの | **解決済みの値** (CIDR、instance_type) | **`.tf` の構造** (workspace 名、パス) |
| 必要なもの | `terraform init` と plan | ファイルだけ (plan 不要) |
| 置き場の例 | `policy/main/*.rego` | `policy/hcl/*.rego` |

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**HCL が必要な理由**
workspace 名は plan JSON に現れない

</div>
<div v-click>

**plan JSON が必要な理由**
`instance_type = var.x` は HCL では値が分からない

</div>
</div>

<!--
どちらか一方では足りないので両方を使う。
plan JSON は variables / prior_state を jq で落としてから artifact に上げる (機微値対策)。
-->

---
layout: two-cols
title: "--combine の input はファイルの配列"
eyebrowNum: 3
eyebrow: conftest で Terraform を検査する
ratio: 1/1.2
valign: center
---

<v-clicks>

- 要素は `{path, contents}`。`path` は実行ディレクトリ相対
- ブロックは **1 個でも必ず配列**
  → `cloud[_].workspaces[_]` と辿る
- 変数参照は `"${var.x}"` という **文字列**
- 迷ったら `conftest parse --parser hcl2` で形を見る

</v-clicks>

::right::

<div class="code-compact">

```json
[{
  "path": "environments/staging/network/terraform.tf",
  "contents": {
    "terraform": [{
      "cloud": [{
        "workspaces": [{
          "name": "myapp-staging-network"
        }]
      }]
    }]
  }
}]
```

</div>

<!--
terraform { cloud { workspaces {} } } と 1 個ずつでも terraform[_].cloud[_].workspaces[_] と辿る。
--combine を付けないとファイルごとに評価され、path が input に入らないので「パスと名前の突合」ができない。
-->

---
layout: two-cols
title: "HCL ポリシーの例: env が workspace 名に含まれること"
eyebrowNum: 3
eyebrow: conftest で Terraform を検査する
ratio: 1/1.2
valign: center
---

<div class="code-compact">

```rego
package hcl

import rego.v1

# environments/<env>/... の <env> を取る
path_env(path) := parts[i + 1] if {
	parts := split(path, "/")
	some i
	parts[i] == "environments"
}
```

</div>

<v-click>

<div class="mt-3 text-sm op80">

`environments/staging/network/terraform.tf` → `staging`

</div>

</v-click>

::right::

<div class="code-compact">

```rego
finding contains v if {
	some f in input
	env := path_env(f.path)
	tf := f.contents.terraform[_]
	some ws in tf.cloud[_].workspaces
	segs := regex.split(`[-_]`, ws.name)
	not env in segs
	v := {
		"path": f.path,
		"rule": "workspace_env_match",
		"msg": sprintf("%s: 名前に %q が無い",
			[f.path, env]),
	}
}
```

</div>

<v-click>

<div class="mt-3 text-sm op80">

`deny` ではなく `finding` を出す理由は次の章

</div>

</v-click>

<!--
名前を - と _ の両方で分割して「セグメントとして含む」かを見る。部分文字列一致だと staging と staging-internal を取り違える。
実運用のポリシーでは environments が複数回出るパスや org セグメントの扱いも考慮する。
-->

---
layout: section
color: blue
toc: 運用のしくみ
---

# 運用のしくみ

例外・ドキュメント・導入の手順

---
layout: two-cols
title: 例外は「禁止」ではなく「理由の明示を強制」
eyebrowNum: 4
eyebrow: 運用のしくみ
ratio: 1/1.2
valign: center
---

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
eyebrowNum: 4
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
title: METADATA 注釈でポリシー一覧を自動生成
eyebrowNum: 4
eyebrow: 運用のしくみ
ratio: 1/1.2
valign: center
---

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
eyebrowNum: 4
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
eyebrowNum: 4
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
eyebrowNum: 4
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
eyebrowNum: 4
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
eyebrowNum: 4
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
eyebrowNum: 4
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
eyebrowNum: 4
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

---
layout: content
---

# まとめ

<v-clicks>

- Rego は **手順ではなく条件の宣言**。全条件が真なら deny に入り、1 つでも偽なら undefined
- **テストが採点者**。壊れたポリシーはエラーを出さず緑になる
- conftest は `test` (Terraform を採点) と `verify` (Rego を採点) の 2 つ
- 入力は **plan JSON** (解決済みの値) と **HCL** (構造・パス) の 2 系統
- 例外は禁止ではなく **理由の明示を強制**。`path` × `rule` × `reason`
- 導入は **洗い出し → 判断 → 1 PR → 緑**。warn 期間は設けない

</v-clicks>

<v-click>

<div class="mt-6 takeaway">

まずは rego-playground の 01〜05 を手を動かして通す。そこまでで Rego は読める

</div>

</v-click>

---
layout: end
---

# ありがとうございました
