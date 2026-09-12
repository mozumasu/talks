---
layout: section
color: blue
toc: conftest で Terraform を検査する
---

# conftest で Terraform を検査する

コマンドは 2 つ、入力は 2 系統

---
layout: content
eyebrowNum: 4
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
eyebrowNum: 4
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
eyebrowNum: 4
eyebrow: conftest で Terraform を検査する
ratio: 1/1.1
valign: center
class: code-sm code-tight
---

# .tf が input になるとどんな形か: conftest parse で見る

<FindyAnnotatedCode>

```hcl
# terraform.tf
terraform {
  cloud {
    workspaces {
      name = "myapp-staging-network"
    }
  }
}
```

<FindyCodeRegion :line="2" text="terraform" color="#3b82f6" />
<FindyCodeRegion :line="3" text="cloud" color="#10b981" />
<FindyCodeRegion :line="4" text="workspaces" color="#f0b866" />

</FindyAnnotatedCode>

<v-click>

<FindyAnnotatedCode>

```rego
deny contains msg if {
	ws := input.terraform[_].cloud[_].workspaces[_]
	not contains(ws.name, "staging")
	msg := sprintf("%s: staging が無い", [ws.name])
}
```

<FindyCodeRegion :line="2" text="terraform[_]" color="#3b82f6" />
<FindyCodeRegion :line="2" text="cloud[_]" color="#10b981" />
<FindyCodeRegion :line="2" text="workspaces[_]" color="#f0b866" />

</FindyAnnotatedCode>

</v-click>

::right::

<FindyAnnotatedCode>

```json
// $ conftest parse --parser hcl2 terraform.tf
{
  "terraform": [{
    "cloud": [{
      "workspaces": [{
        "name": "myapp-staging-network"
      }]
    }]
  }]
}
```

<FindyCodeRegion :line="3" text="&quot;terraform&quot;: [" color="#3b82f6" />
<FindyCodeRegion :line="4" text="&quot;cloud&quot;: [" color="#10b981" />
<FindyCodeRegion :line="5" text="&quot;workspaces&quot;: [" color="#f0b866" />

</FindyAnnotatedCode>

<v-click at="1">

<div class="mt-2">
<FindyCallout label="ブロックは 1 個でも配列">
HCL のブロック名が JSON のキーになり、値は必ず配列。だから Rego では <code>[_]</code> を 1 段ずつ挟んで辿る
</FindyCallout>
</div>

</v-click>

<!--
ポリシーを書く前に conftest parse で input の形を出しておくと、キー名と配列の段数をそのまま写せる。
terraform { cloud { workspaces {} } } と 1 個ずつでも terraform[_].cloud[_].workspaces[_]。
plan JSON も同じ発想で、jq で階層を確認してから書く。
実行結果は conftest 0.69.0 で確認したもの。
-->

---
layout: two-cols
eyebrowNum: 4
eyebrow: conftest で Terraform を検査する
ratio: 1/1.2
valign: center
---

# --combine の input はファイルの配列

<v-clicks>

- 要素は `{path, contents}`。`path` は実行ディレクトリ相対
- `contents` は前のページの parse 結果そのもの
- 変数参照は `"${var.x}"` という **文字列**
- `--combine` なしだとファイルごとに評価され、`path` が input に入らない

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
eyebrowNum: 4
eyebrow: conftest で Terraform を検査する
ratio: 1/1.2
valign: center
---

# HCL ポリシーの例: env が workspace 名に含まれること

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
