---
layout: section
color: blue
toc: Regoを実行してみよう
---

# Regoを実行してみよう

---
layout: two-cols
class: env-setup
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.1
valign: center
---

# ConftestでRegoを動かす環境を用意

::left::

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
title: inputを渡してConftestでRegoを実行する
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.2
valign: center
---

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
title: package を分けて --namespace で選ぶ
eyebrowNum: 3
eyebrow: Regoを実行してみよう
class: ns-demo
---

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
title: 「deny が出ない」を opa eval で追う
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1.15
valign: top
class: code-sm tight-code
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
title: opa eval の出力は value だけ見る
eyebrowNum: 3
eyebrow: Regoを実行してみよう
ratio: 1/1
valign: center
class: code-sm
---

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
title: undefined と false は違う
eyebrowNum: 3
eyebrow: Regoを実行してみよう
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
eyebrowNum: 3
eyebrow: Regoを実行してみよう
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
eyebrowNum: 3
eyebrow: Regoを実行してみよう
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
eyebrowNum: 3
eyebrow: Regoを実行してみよう
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
