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
footerLink: { label: "ハンズオン 08_terraform_plan", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/08_terraform_plan" }
---

# 入力は 2 系統: plan JSON と HCL

<div class="text-sm">

| | plan JSON | HCL |
| --- | --- | --- |
| 作り方 | `terraform show -json tfplan` | `--parser hcl2 --combine *.tf` |
| 見えるもの | **解決済みの値** (CIDR、instance_type) | **`.tf` の構造** (workspace 名、パス) |
| 必要なもの | `terraform init` と plan | ファイルだけ (plan 不要) |
| 置き場の例 | `policy/main/*.rego` | `policy/hcl/*.rego` |

</div>

<div class="grid grid-cols-2 gap-6 mt-5 text-sm">
<div v-click>
<FindyCallout label="HCL が必要な理由">
workspace 名は plan JSON に現れない
</FindyCallout>
</div>
<div v-click>
<FindyCallout label="plan JSON が必要な理由">
<code>instance_type = var.x</code> は HCL では値が分からない
</FindyCallout>
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
ratio: 1/1.05
valign: top
class: code-sm code-tight
footerLink: { label: "ハンズオン 08_terraform_plan", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/08_terraform_plan" }
---

# plan JSON はどんな形か: 見るのは resource_changes だけ

```sh
# init 済みで provider の認証が通る環境で
terraform plan -out=tfplan
terraform show -json tfplan > plan.json
```

<FindyAnnotatedCode>

```json [plan.json (抜粋)]
{ "resource_changes": [{
    "address": "module.network.aws_vpc.this",
    "type": "aws_vpc",
    "change": {
      "actions": ["create"],
      "after": { "cidr_block": "192.168.0.0/16" }
    }
  }, ...] }
```

<FindyCodeRegion v-click="1" :line="1" text="&quot;resource_changes&quot;" color="#3b82f6" />
<FindyCodeRegion v-click="1" :line="3" text="&quot;type&quot;" color="#10b981" />
<FindyCodeRegion v-click="1" :line="5" text="&quot;actions&quot;" color="#f0b866" />
<FindyCodeRegion v-click="1" :line="6" text="&quot;after&quot;" color="#a78bfa" />

</FindyAnnotatedCode>

::right::

<div v-click="1">

<FindyAnnotatedCode>

```rego
deny contains msg if {
	some rc in input.resource_changes
	rc.type == "aws_vpc"
	"create" in rc.change.actions
	cidr := rc.change.after.cidr_block
	not net.cidr_contains("10.0.0.0/12", cidr)
	msg := sprintf("%s: CIDR %s は割当外", [rc.address, cidr])
}
```

<FindyCodeRegion :line="2" text="input.resource_changes" color="#3b82f6" />
<FindyCodeRegion :line="3" text="rc.type" color="#10b981" />
<FindyCodeRegion :line="4" text="rc.change.actions" color="#f0b866" />
<FindyCodeRegion :line="5" text="rc.change.after" color="#a78bfa" />

</FindyAnnotatedCode>

</div>

<v-click at="2">

```sh
$ opa eval -d policy/ -i plan.json 'data.main.deny' -f pretty
[
  "module.network.aws_vpc.this: CIDR 192.168.0.0/16 は割当外"
]
```

</v-click>

<div v-click="3" class="mt-2">
<FindyCallout label="plan を打てる環境が無くても試せる">
ハンズオン 08 に plan.json を同梱。この出力もそれで採った
</FindyCallout>
</div>

<!--
plan JSON は巨大だが、ポリシーで見るのはほぼ resource_changes。各要素の type で対象を絞り、
actions で create / update を選び、after に適用後の値が入る。
after に無いキーは after_unknown に入る (apply まで確定しない値)。これが次の「値が未確定」の話に繋がる。
出力は conftest 0.69.0 で、ハンズオン 08 の plans/ng.json に対して実行したもの。
-->

---
layout: two-cols
eyebrowNum: 4
eyebrow: conftest で Terraform を検査する
ratio: 1/1.1
valign: center
class: code-sm code-tight
footerLink: { label: "ハンズオン 09_conftest_hcl", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/09_conftest_hcl" }
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

<FindyCodeRegion v-click="1" :line="2" text="terraform" color="#3b82f6" />
<FindyCodeRegion v-click="1" :line="3" text="cloud" color="#10b981" />
<FindyCodeRegion v-click="1" :line="4" text="workspaces" color="#f0b866" />

</FindyAnnotatedCode>

<v-click at="2">

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

<FindyCodeRegion v-click="1" :line="3" text="&quot;terraform&quot;: [" color="#3b82f6" />
<FindyCodeRegion v-click="1" :line="4" text="&quot;cloud&quot;: [" color="#10b981" />
<FindyCodeRegion v-click="1" :line="5" text="&quot;workspaces&quot;: [" color="#f0b866" />

</FindyAnnotatedCode>

<v-click at="1">

<div class="mt-2">
<FindyCallout label="ブロック名が JSON のキーになり、値は 1 個でも配列">
同じ色の枠が対応する。Rego では <code>[_]</code> を 1 段ずつ挟んで辿る
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
ratio: 1/1.1
valign: top
class: code-sm
footerLink: { label: "ハンズオン 09_conftest_hcl", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/09_conftest_hcl" }
---

# ファイルのパスも検査したい: --combine で input にパスが入る

<div class="text-sm leading-relaxed">

**やりたいこと**: `environments/staging/` 配下の `.tf` は workspace 名に `staging` を含むこと

<div v-click="1" class="mt-2">

`.tf` の中身だけでは分からない。**置かれているパス**が要る

</div>

<div v-click="2" class="mt-3">

```sh
conftest test -p policy/ --parser hcl2 --combine \
  environments/**/*.tf
```

</div>

<div v-click="3" class="mt-3">

- `--combine` で input が **ファイルの配列**になる
- `path` は実行ディレクトリ相対。`contents` は前のページの parse 結果そのもの
- 付けないとファイルごとに評価され、`path` が input に入らない

</div>

</div>

::right::

<div v-click="2" class="code-compact">

<FindyAnnotatedCode>

```json
// $ conftest parse --parser hcl2 --combine environments/**/*.tf
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

<FindyCodeRegion v-click="3" :line="3" text="&quot;path&quot;" label="どこにあるか" color="#f0b866" />
<FindyCodeRegion v-click="3" :line="4" text="&quot;contents&quot;" label="中身 (parse 結果)" label-position="right" color="#3b82f6" />

</FindyAnnotatedCode>

</div>

<!--
前のページは 1 ファイルの中身だけ。パスと突き合わせたいので --combine で複数ファイルを 1 つの input にまとめ、
各要素に path を持たせる。付けないとファイルごとに評価され、path が input に入らないので「パスと名前の突合」ができない。
変数参照は "${var.x}" という文字列で入る (値は分からない)。
実行結果は conftest 0.69.0 で確認したもの。
-->

---
layout: two-cols
eyebrowNum: 4
eyebrow: conftest で Terraform を検査する
ratio: 1/1.2
valign: center
class: code-sm code-tight
footerLink: { label: "ハンズオン 09_conftest_hcl", href: "https://github.com/mozumasu/rego-playground/tree/main/exercises/09_conftest_hcl" }
---

# HCL ポリシーの例: env が workspace 名に含まれること

<div class="code-compact">

```rego
package hcl

import rego.v1

# environments/<env>/... の <env> を取る
path_env(path) := parts[i + 1] if {
	parts := split(path, "/")    # "/" で切って配列に
	some i                      # 添字 i を全部試す
	parts[i] == "environments"  # environments が i 番目
}                               # 返り値は parts[i + 1]
```

</div>

<v-click>

<div class="mt-3 text-sm op80">

`environments/staging/network/terraform.tf` を渡すと<br>
`parts` = `["environments", "staging", "network", ...]`, `i` = `0` → `parts[1]` = `staging`

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
