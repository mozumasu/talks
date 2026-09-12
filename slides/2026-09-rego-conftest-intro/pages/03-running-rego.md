---
layout: section
color: blue
toc: Regoを実行してみよう
---

# Regoを実行してみよう

---
layout: two-cols
class: code-xs env-setup
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.1
valign: center
---

# ConftestでRegoを動かす環境を用意

1. ハンズオン用のリポジトリを用意

```sh
gh repo create rego-handson
ghq get rego-handson
# rego-handsonディレクトリに移動
```

2. 必要なツールをインストール

```sh
# flake.nixのテンプレートを使う場合
nix flake init --template github:mozumasu/nix-templates
# pkgs.conftest と pkgs.open-policy-agent を 追記する
direnv allow
```

::right::

生成された flake.nix に 2 行追記する

<div class="flake-code">

```nix
{
  description = "defalut flake.nix";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.conftest # [!code highlight]
            pkgs.open-policy-agent # [!code highlight]
          ];
        };
      }
    );
}
```

</div>

<!--
テンプレートを取ってきて packages に 2 行足すだけ。
conftest は OPA をライブラリとして内蔵しているが opa コマンドは同梱しないので、
opa eval を使うために open-policy-agent も入れておく。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.2
valign: center
---

# inputを渡してConftestでRegoを実行する

```json
// input.json (チェック対象)
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
# policy/debug.rego (ポリシー)
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
layout: content
eyebrowNum: 3
eyebrow: Regoを実行してみよう
class: code-xs ns-demo
---

# package を分けて --namespace で選ぶ

<div class="ns-grid">

<div v-click="1">

```sh
# 既定は package main だけ
$ conftest test -p policy/ input.json
FAIL - input.json - main - debug を無効に
1 test, 0 passed, 1 failure
```

</div>

<div>

```rego
# policy/debug.rego
package main
deny contains msg if {
	input.debug == true
	msg := "debug を無効に"
}
```

</div>

<div v-click="2">

```sh
# naming の deny を見に行く
$ conftest test -p policy/ --namespace naming input.json
FAIL - input.json - naming - 名前に _ は使えない
1 test, 0 passed, 1 failure
```

</div>

<div>

```rego
# policy/naming.rego
package naming # [!code highlight]
deny contains msg if {
	contains(input.name, "_")
	msg := "名前に _ は使えない"
}
```

</div>

<div v-click="3">

```sh
# 全部まとめて
$ conftest test -p policy/ --all-namespaces input.json
FAIL - input.json - main - debug を無効に
FAIL - input.json - naming - 名前に _ は使えない
2 tests, 0 passed, 2 failures
```

</div>

<div v-click="3">
<FindyCallout label="使いどころ">
plan JSON 用と HCL 用のように<strong>入力の形が違うポリシー</strong>を同じ <code>policy/</code> に置き、CI のジョブごとに <code>--namespace</code> で使い分ける
</FindyCallout>
</div>

</div>

<!--
deny というルール名は namespace ごとに独立している。同じ deny を別 package に書いても衝突しない。
--namespace は複数回指定できる。--all-namespaces は policy/ 配下の package を全部見る。
実行結果は conftest 0.63.0 で実際に確認したもの。
-->

---
layout: two-cols
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.15
valign: top
class: code-sm code-tight
---

# 「deny が出ない」を opa eval で追う

```rego
package main

max_size := 10

is_big if input.size > max_size

deny contains msg if {
	is_big
	msg := "size 超過"
}
```

```json
// input.json
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
ratio: 1/1.2
valign: center
class: code-sm code-tight
---

# 「キーが無い」は黙って通る

<v-clicks>

- 成り立たない・キーが無い → 値は `false` ではなく **undefined**
- undefined の行があるルールは丸ごと不成立。deny は出ず、conftest は**緑**
- 条件ごとに「キーが無かったらどうしたい?」を考える。**弾きたい条件**は undefined でも真になる形 (`not ... ==`) で書く

</v-clicks>

::right::

```rego
# 事故る: tags が無いと != が undefined → deny が黙る
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
---

# テストが採点者

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
