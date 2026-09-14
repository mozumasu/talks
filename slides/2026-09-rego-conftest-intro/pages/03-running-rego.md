---
layout: section
color: blue
toc: Regoを実行してみよう
---

# Regoを実行してみよう

---
layout: content
class: code-xs env-setup
eyebrowNum: 3
eyebrow: Regoを実行してみよう
---

# ConftestでRegoを動かす環境を用意

<FindyTabs :tabs="{ nix: 'Nix', brew: 'Homebrew' }">

<template v-slot:nix>

<div class="env-cols">
<div>

1. ハンズオンのリポジトリを取ってくる

```sh
ghq get mozumasu/rego-playground
cd $(ghq root)/github.com/mozumasu/rego-playground
```

2. flake でツールを入れる

```sh
direnv allow
conftest --version
opa version
```

</div>
<div>

同梱の flake.nix。自分のリポジトリで使うときは `packages` にこの 2 行を足すだけ

```nix [flake.nix (抜粋)]
devShells.default = pkgs.mkShell {
  packages = [
    pkgs.open-policy-agent # [!code highlight]
    pkgs.conftest # [!code highlight]
  ];
};
```

</div>
</div>

</template>

<template v-slot:brew>

<div class="env-cols">
<div>

1. ハンズオンのリポジトリを取ってくる

```sh
git clone https://github.com/mozumasu/rego-playground
cd rego-playground
```

2. 必要なツールをインストール

```sh
brew install conftest opa
```

</div>
<div>

入ったことを確認する

```sh
conftest --version
opa version
```

</div>
</div>

</template>

</FindyTabs>

<!--
どちらのタブも rego-playground を取ってくるところから。Nix なら同梱の flake.nix で direnv allow だけ
(自分のリポジトリで使うときは packages にこの 2 行を足すだけ)、
Homebrew なら brew install で conftest と opa を入れる。
conftest は OPA をライブラリとして内蔵しているが opa コマンドは同梱しないので、
opa eval を使うために open-policy-agent も入れておく。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.2
valign: center
footerLink: { label: "ハンズオン 01_run_conftest", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/01_run_conftest" }
---

# ファイルを用意

```json [input.json (チェック対象)]
{
  "environment": "production",
  "debug": true
}
```

::right::

```rego [policy/debug.rego (ポリシー)]
package main

import rego.v1

deny contains msg if {
	input.environment == "production"
	input.debug == true
	msg := "production では debug を無効に"
}
```

<!--
用意するのはこの 2 つだけ。チェック対象の JSON と、ポリシーの .rego。
input はファイルの中身がそのまま input になる。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1.3/1
valign: center
footerLink: { label: "ハンズオン 01_run_conftest", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/01_run_conftest" }
---

# conftest test で実行する

<div class="code-compact">

<FindyAnnotatedCode>

```sh
$ conftest test -p policy/ input.json
FAIL - input.json - main - production では debug を無効に

1 test, 0 passed, 0 warnings, 1 failure, 0 exceptions
```

<FindyCodeRegion v-click="1" :line="1" text="-p policy/" label="ポリシー" color="#3b82f6" />
<FindyCodeRegion v-click="2" :line="1" text="input.json" label="チェック対象" label-position="right" color="#10b981" />
<FindyCodeRegion v-click="3" :line="2" text="main" color="#a78bfa" />
<FindyCodeRegion v-click="3" :line="2" text="production では debug を無効に" label="deny の msg" label-position="below-left" color="#f0b866" />
<FindyCodeRegion v-click="4" :line="4" label="集計" color="#ef4444" />

</FindyAnnotatedCode>

<v-click at="5">

```sh [debug: false にすると]
$ conftest test -p policy/ input.json

1 test, 1 passed, 0 warnings, 0 failures, 0 exceptions
```

</v-click>

</div>

::right::

<div class="text-sm leading-relaxed">

<div v-click="1">

**`-p`** に渡したディレクトリの `*.rego` を全部読む

</div>

<div v-click="2" class="mt-2">

引数のファイルが **`input`** になる

</div>

<div v-click="3" class="mt-2">

`deny` に入った **msg がそのまま FAIL 行**になる。<span style="color:#7c3aed">main</span> は package 名

</div>

<div v-click="4" class="mt-2">

最後の行が集計。failure が 1 つでもあれば**終了コード 1** で CI が止まる

</div>

<div v-click="5" class="mt-4">

条件が 1 つ偽になると `deny` は空 → **PASS**

</div>

</div>

<!--
package main が conftest のデフォルト namespace。他の package を見るには --namespace (次のスライド)。
出力は conftest 0.69.0 の実物。FAIL 行の形式は "FAIL - <ファイル> - <namespace> - <msg>"。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.25
valign: top
class: code-sm code-tight
footerLink: { label: "ハンズオン 01_run_conftest", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/01_run_conftest" }
---

# package を分けると、指定した package だけ評価される

<FindyAnnotatedCode :line-height="1.45">

```rego [policy/debug.rego]
package main
deny contains msg if {
	input.debug == true
	msg := "debug を無効に"
}
```

<FindyCodeRegion :line="1" text="main" color="#3b82f6" />

</FindyAnnotatedCode>

<FindyAnnotatedCode :line-height="1.45">

```rego [policy/naming.rego]
package naming
deny contains msg if {
	contains(input.name, "_")
	msg := "名前に _ は使えない"
}
```

<FindyCodeRegion :line="1" text="naming" color="#a78bfa" />

</FindyAnnotatedCode>

<div v-click="4" class="mt-3 text-xs op80">

**使いどころ**: plan JSON 用と HCL 用のように入力の形が違うポリシーを同じ `policy/` に置き、CI のジョブごとに `--namespace` で使い分ける

</div>

::right::

<div class="text-sm">

<div v-click="1">

**指定なし** → <span style="color:#2563eb">main</span> だけ

<FindyAnnotatedCode :line-height="1.45">

```sh
$ conftest test -p policy/ input.json
FAIL - input.json - main - debug を無効に
1 test, 0 passed, 0 warnings, 1 failure, 0 exceptions
```

<FindyCodeRegion :line="2" text="main" color="#3b82f6" />

</FindyAnnotatedCode>

</div>

<div v-click="2" class="mt-1">

**`--namespace naming`** → <span style="color:#7c3aed">naming</span> だけ

<FindyAnnotatedCode :line-height="1.45">

```sh
$ conftest test -p policy/ --namespace naming input.json
FAIL - input.json - naming - 名前に _ は使えない
1 test, 0 passed, 0 warnings, 1 failure, 0 exceptions
```

<FindyCodeRegion :line="2" text="naming" color="#a78bfa" />

</FindyAnnotatedCode>

</div>

<div v-click="3" class="mt-1">

**`--all-namespaces`** → 全部

<FindyAnnotatedCode :line-height="1.45">

```sh
$ conftest test -p policy/ --all-namespaces input.json
FAIL - input.json - main - debug を無効に
FAIL - input.json - naming - 名前に _ は使えない
2 tests, 0 passed, 0 warnings, 2 failures, 0 exceptions
```

<FindyCodeRegion :line="2" text="main" color="#3b82f6" />
<FindyCodeRegion :line="3" text="naming" color="#a78bfa" />

</FindyAnnotatedCode>

</div>

</div>

<!--
package は conftest が評価する単位。指定しなければ main だけを見るので、別 package に書いた deny は無視される。
deny というルール名は package ごとに独立していて、同じ deny を別 package に書いても衝突しない。
--namespace は複数回指定できる。--all-namespaces は policy/ 配下の package を全部見る。
実行結果は conftest 0.69.0 の実物 (input は {"debug": true, "name": "my_app"})。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.15
valign: top
class: code-sm code-tight
footerLink: { label: "ハンズオン 01_run_conftest", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/01_run_conftest" }
---

# 「deny が出ない」を opa eval で追う

```rego [policy/size.rego]
package main

max_size := 10

is_big if input.size > max_size

deny contains msg if {
	is_big
	msg := "size 超過"
}
```

```json [input.json]
{ "Size": 30 }
```

::right::

<v-click>

```sh
$ conftest test -p policy/ input.json
1 test, 1 passed, 0 warnings, 0 failures
# 30 > 10 なのに PASS。conftest は deny が空としか言わない
```

</v-click>

<v-click>

```sh
$ opa eval -d policy -i input.json 'data.main' --format pretty
{ "deny": [], "max_size": 10 }
# is_big が無い = 成り立っていない
```

</v-click>

<v-click>

```sh
$ opa eval -d policy -i input.json 'input.size' --format pretty
undefined
# input.size 自体が無い → input.json のキーが Size だった
```

</v-click>

<v-click>

<div class="mt-1">
<FindyCallout label="opa eval = OPA 本体のコマンド。聞いたクエリの答えをそのまま返す">
conftest は deny しか見せない。「なぜ出ない / なぜ出る」は途中のルールや input を 1 つずつ聞いて追う
</FindyCallout>
</div>

</v-click>

<!--
conftest は deny が空なら PASS としか言わない。期待と違うときに中を見る道具が opa eval。
data.main でルール全部を並べると is_big がキーごと無い (undefined)。is_big の条件 input.size を聞くと undefined。
input.json のキーが Size で、ポリシーは size を見ていた。Terraform の plan JSON でも同じ手順で
「どの階層のキーが違うか」を追える (後半の落とし穴に出てくる [_] の配列忘れも同じ)。
実行結果は opa 1.19.1 / conftest 0.69.0 で確認したもの。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1
valign: center
class: code-sm
footerLink: { label: "ハンズオン 01_run_conftest", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/01_run_conftest" }
---

# opa eval の出力は value だけ見る

<FindyAnnotatedCode>

```json
// opa eval -d policy -i big.json 'data.main'
{
  "result": [
    {
      "expressions": [
        {
          "value": { "deny": ["size 超過"],
                     "is_big": true, "max_size": 10 },
          "text": "data.main",
          "location": { "row": 1, "col": 1 }
        }
      ]
    }
  ]
}
```

<FindyCodeRegion :line="3" text="&quot;result&quot;" color="#f0b866" />
<FindyCodeRegion :line="5" text="&quot;expressions&quot;" color="#7cc4ff" />
<FindyCodeRegion :line="7" :end-line="8" color="#7ee0a8" />
<FindyCodeRegion :line="9" :end-line="10" color="#9ca3af" />

</FindyAnnotatedCode>

::right::

<FindyLegend size="0.95rem">
  <FindyLegendItem color="#f0b866" term="result">クエリ 1 回分の結果。配列だが普段は 1 件</FindyLegendItem>
  <FindyLegendItem color="#7cc4ff" term="expressions">クエリの式ごと。今回は <code>data.main</code> の 1 件</FindyLegendItem>
  <FindyLegendItem color="#7ee0a8" term="value">式の答え。<strong>見るのはここだけ</strong></FindyLegendItem>
  <FindyLegendItem color="#9ca3af" term="text / location">評価した式とその位置。読み飛ばしてよい</FindyLegendItem>
</FindyLegend>

<v-click>

<div class="mt-3">
<FindyCallout label="value だけ出す">
<code>--format pretty</code> を付けると value だけが整形されて出る。他のスライドはこの形で載せている<br>
クエリが undefined のときは <code>{}</code> だけが返る
</FindyCallout>
</div>

</v-click>

<!--
result / expressions が配列なのは、opa eval が複数クエリ・複数解を返せる作りだから。
普段の使い方では 1 件ずつなので、value まで潜って読む。
--format pretty は value だけを整形して出す。raw なら 1 行 JSON。
undefined は result 自体が無くなり {} だけになる。次の「undefined と false は違う」で効く。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.1
valign: center
class: code-sm code-tight
footerLink: { label: "ハンズオン 01_run_conftest", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/01_run_conftest" }
---

# input は検査対象、data はルールの値と設定

<div v-click="1">

```text
input                    # conftest test に渡したファイル 1 件
└─ size: 30              # big.json の中身
```

</div>

<div v-click="2">

````md magic-move {at:3}
```text
data                     # ルールの値がここに載る
└─ main                  # package main
   ├─ deny: ["size 超過"]
   ├─ is_big: true
   └─ max_size: 10
```
```text
data                     # ルールの値がここに載る
├─ main                  # package main
│  ├─ deny: ["size 超過"]
│  ├─ is_big: true
│  └─ max_size: 10
└─ exceptions: [...]     # --data exceptions.yaml (5 章)
```
````

</div>

::right::

<div class="table-compact data-table">

| | `input` | `data` |
| --- | --- | --- |
| 中身 | 検査対象 1 件 | ルールの値 + `--data` で渡した設定 |
| 誰が入れる | conftest がファイルごとに差し替える | `package` ごとに自動で載る |
| 変わる単位 | ファイルごと | 評価中ずっと同じ |
| 書き方 | `input.size` | `data.main.max_size` |

</div>

<div v-click="4" class="mt-4">
<FindyCallout label="ルールの中で max_size とだけ書けるのはなぜ?">
<code>data.main.max_size</code> の省略形。同じ <code>package</code> の中では <code>data.main.</code> を省ける
</FindyCallout>
</div>

<!--
input と data は Rego から見える 2 本の根。input は conftest がファイルごとに差し替え、
data にはポリシーのルールの値が package 名の下に自動で載る。--data で渡した YAML も同じ木に生える。
5 章の allowlist (data.exceptions) はここの伏線。
-->

<style>
.data-table td:first-child { white-space: nowrap; }
</style>

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.2
valign: center
class: code-sm code-tight
footerLink: { label: "ハンズオン 03_undefined", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/03_undefined" }
---

# 「キーが無い」は黙って通る

<div class="text-base leading-relaxed">

<div v-click="1">

**1. キーが無い → 式は `false` ではなく undefined**

</div>

<div v-click="1" class="mt-1">

**2. undefined を含むルールは黙って不成立** → deny が出ない → conftest は緑

</div>

<div v-click="2" class="mt-4">

**3.** 条件ごとに「キーが無かったら通す? 弾く?」を決める

</div>

<div v-click="3" class="mt-1">

**4.** 弾きたい条件は `not x == 値` で書く。`not` は undefined でも真

</div>

</div>

::right::

```rego
# 事故る: tags が無いと != が undefined → ルールごと黙る
deny contains "env が prod ではない" if {
	input.tags.env != "prod"
}
```

<v-click at="3">

```rego
# 防げる: not は undefined でも真
deny contains "env が prod ではない" if {
	not input.tags.env == "prod"
}
```

</v-click>

<v-click at="2">

<div class="table-compact">

| input の tags | `!=` | `not ==` |
| --- | --- | --- |
| `env: dev` | deny | deny |
| `env: prod` | 通る | 通る |
| tags 自体が無い | **通る (事故)** | deny |

</div>

</v-click>

<!--
壊れたポリシー (タイポ、キー欠落) も undefined になるだけでエラーが出ない。
CI は「違反ゼロ」と同じ顔で緑になる。18 枚目の Size のキー違いと同じ現象。
not は「偽 または undefined」で真なので、欠落を弾く側に倒せる。後半の「落とし穴 a. negation の罠」
「b. fail-closed」はこの続き。
not 必須という話ではない。input.debug == true で deny する条件は、debug が無い plan を通して正しい。
欠落を弾きたい条件だけ書き方を変える。弾き方は 3 通り: not ... == (1 行で済む) /
欠落専用の deny を分ける (メッセージで「無い」と「違う」を区別) /
object.get で既定値を入れてから比較 (not の中で変数を使いたいとき)。
真偽ルールを allow == false のように比べたいときは default allow := false で undefined を false に倒す。
conftest の deny 形式では出番が少ないのでスライドからは外した。
表の結果は opa 1.19.1 で確認したもの。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.2
valign: center
class: code-sm code-tight
footerLink: { label: "ハンズオン 05_iteration", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/05_iteration" }
---

# ループは書かない。some で列挙、every で全件

```json
// input.json
{ "services": {
    "api":   { "replicas": 1, "owner": "sre" },
    "web":   { "replicas": 3, "owner": "" },
    "batch": { "replicas": 1, "owner": "data" } } }
```

<v-clicks>

- `some` = 条件を満たす要素を**列挙**。for + if + append を 1 行で
- `every` = **全件**満たすときだけ真。1 つでも外れると undefined
- ループ変数を進める、break する、という発想はない

</v-clicks>

::right::

```rego
deny contains msg if {
	some name, cfg in input.services   # 全要素を試す
	cfg.replicas < 2                   # 満たした要素だけ残る
	msg := sprintf("%s: replicas は 2 以上", [name])
}
```

<v-click at="1">

```json
"deny": ["api: replicas は 2 以上", "batch: replicas は 2 以上"]
```

</v-click>

<v-click at="2">

```rego
all_owned if {
	every cfg in input.services { cfg.owner != "" }
}
```

```json
// web の owner が空 → all_owned は出力に無い (undefined)
```

</v-click>

<!--
some は for ループの代わり。全要素が自動で試され、条件を満たした要素ごとに msg が生成される。
api と batch の 2 件が deny に入り、web は replicas 3 なので入らない。
every は「1 つでも満たさなければ undefined」。web の owner が空なので all_owned は消える。
出力は opa 1.19.1 で確認したもの。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.2
valign: center
class: code-sm
footerLink: { label: "ハンズオン 06_helpers", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/06_helpers" }
---

# ヘルパー関数 (自作) と組み込み関数

<div class="text-sm">

**組み込み関数** (用意されているもの)

| 関数 | 用途 |
| --- | --- |
| `split(s, "/")` | 分割 |
| `sprintf("%v", [x])` | 整形 |
| `net.cidr_contains(a, b)` | CIDR 包含 |
| `object.get(o, [k], def)` | 欠落時の既定値 |

</div>

<v-click>

<div class="mt-3 text-sm">

**ヘルパー関数** (自作) は `名前(引数) if { ... }`。deny の条件を切り出して名前を付けたもの

</div>

</v-click>

::right::

<FindyAnnotatedCode>

```rego
allowed := {"10.0.0.0/12", "172.16.0.0/12"}

cidr_allowed(cidr) if {
	some range in allowed
	net.cidr_contains(range, cidr)
	to_number(split(cidr, "/")[1]) == 16
}
```

<FindyCodeRegion :line="3" text="cidr_allowed(cidr)" label="ヘルパー関数 (自作)" color="#f0b866" />
<FindyCodeRegion :line="5" label="組み込み" label-position="right" color="#7cc4ff" />

</FindyAnnotatedCode>

<v-click>

<FindyAnnotatedCode>

```rego
deny contains msg if {
	cidr := object.get(input, ["cidr"], null)
	not cidr_allowed(cidr)
	msg := sprintf("CIDR %v は割当外です", [cidr])
}
```

<FindyCodeRegion :line="3" text="cidr_allowed(cidr)" label="呼び出し" label-position="right" color="#f0b866" />

</FindyAnnotatedCode>

</v-click>

<!--
object.get はキーが無いときに第 3 引数を返す。「無い」を null に変換してから判定に進む。
これが無いと後で出てくる negation の罠に落ちる。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.2
valign: center
class: code-sm code-tight
footerLink: { label: "ハンズオン 04_silent_failure", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/04_silent_failure" }
---

# テストが採点者

<div class="text-sm">

前の CIDR ポリシーに 3 つの input を通すと

</div>

<div class="table-compact">

| input | deny の中身 | `count(deny)` |
| --- | --- | --- |
| `ok` (10.1.0.0/16) | `[]` | 0 |
| `ng` (192.168.0.0/16) | `["…は割当外です"]` | 1 |
| `{}` (欠落) | `["CIDR null は…"]` | 1 |

</div>

<v-clicks>

<div class="text-sm mt-3">

`count(deny)` = **違反の件数**。テストは input ごとにこの数を固定する

</div>

<div class="text-sm mt-2">

`with input as` はその 1 行だけ input を差し替え。`test_` ルールが真なら pass

</div>

</v-clicks>

::right::

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

<v-click at="3">

```sh
$ conftest verify -p policy/
3 tests, 3 passed, 0 warnings, 0 failures
```

</v-click>

<v-click at="4">

```sh
# ポリシーの "cidr" を "cidrs" にタイポすると
FAIL - policy/cidr_test.rego - data.main.test_allowed_passes
```

</v-click>

<!--
壊れたポリシーはエラーを出さず、deny が空になるか全部に出るかのどちらかに倒れる。
CI の conftest test は「違反ゼロ」と同じ顔で緑になるので、期待する件数を固定したテストが唯一の検出器。
タイポの例では cidr が常に null になり ok まで deny されるので、test_allowed_passes が落ちる。
テストの無い Rego は「壊れても緑」で運用されることになる。
結果は opa 1.19.1 / conftest 0.69.0 で確認したもの。
-->
