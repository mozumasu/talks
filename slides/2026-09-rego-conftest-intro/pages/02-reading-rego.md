---
layout: section
color: blue
toc: Rego の読み方
---

# Rego の読み方

手続きではなく「成り立つ条件」を宣言する

---
layout: two-cols
class: code-sm
eyebrowNum: 2
ratio: 1/1.3
eyebrow: Rego の読み方
---

## Rego

手続きではなく、`ルール` という単位で成り立つ条件を宣言する言語

## ルール

「名前 + 条件」の宣言。条件が成り立つときだけ、名前に値が入る  
右の例では、条件がすべて成り立った `msg` が `deny` に集まる

::left::

```python
# Python: 手順を書く
deny = []                 # 入れ物
for tag in tags:          # ループ
    if len(tag) >= 6:     # 条件
        deny.append(tag + " は長い")
```

::right::

<FindyAnnotatedCode>

```rego
deny contains msg if {
	some tag in input.tags
	count(tag) >= 6
	msg := sprintf("%s は長い", [tag])
}
```

<FindyCodeRegion :line="1" text="deny" label="名前" color="#3b82f6" />
<FindyCodeRegion :line="2" :end-line="4" label="条件" label-position="below-left" color="#10b981" />

</FindyAnnotatedCode>

<!--
他の言語に対応物が無いのがここ。関数でも変数でもなく、SQL のビューが一番近い。
CREATE VIEW deny AS SELECT ... FROM tags WHERE length(tag) >= 6 と同じ気持ち。
ボディは「手順」ではなく「あり得る値の組み合わせ全部に対するフィルタ」。
-->

---
layout: content
class: code-sm
eyebrowNum: 2
eyebrow: Rego の読み方
---

## ルールの構造

<div class="text-sm mb-3">
ルール = <span class="rule-head">ヘッド</span> (<span class="rule-name">ルール名</span> + <span class="rule-head">値の作り方</span>) + <span class="rule-body">ボディ</span>
</div>
<div class="grid grid-cols-2 gap-x-5 mt-3 items-start">

<pre class="rule-shape-block has-anno-tl"><span class="anno anno-head anno-tl" data-label="ヘッド"><span class="rule-name">&lt;ルール名&gt;</span> <span class="rule-head">&lt;値の作り方&gt;</span></span> if &#123;
    <span class="anno anno-body anno-tl" data-label="ボディ"><span class="rule-body">&lt;ボディ&gt;</span></span>
&#125;</pre>

<FindyAnnotatedCode :line-height="1.6">

```rego
deny contains msg if {
	is_big
	msg := "size 超過"
}
```

<FindyCodeRegion :line="1" text="deny" color="#f0b866" />
<FindyCodeRegion :line="1" text="contains msg" color="#7cc4ff" />
<FindyCodeRegion :line="2" :end-line="3" color="#7ee0a8" />

</FindyAnnotatedCode>

</div>


<div class="compact-table">

| 種類 | <span class="rule-head">ヘッド</span>の書き方 | 値 |
| --- | --- | --- |
| 定数 | `name := 値` (ボディなし) | その値 |
| 真偽ルール | `name if { ... }` | 成立なら true、不成立なら **undefined** |
| 集合ルール | `name contains x if { ... }` | 条件を満たした x の集合。同名を複数書くと合算 |
| オブジェクトルール | `name[key] := value if { ... }` | key → value のマップ |
| 関数 | `name(引数) := 値 if { ... }` | 引数ごとの値 |
| 内包表記 | `{x \| 条件}` / `[x \| 条件]` | 式の中に埋め込んだ集合 / 配列 |

</div>

<!--
用語は公式ドキュメントに合わせている (rule = head + body)。英語のドキュメントを読むときにそのまま繋がる。
どのルールも同じ「ヘッド if { ボディ }」で、名前が違うだけ。
-->

---
layout: two-cols
title: 省略できる部分
class: code-sm
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.2
valign: center
---

完全形は `ヘッド if { ボディ }`。省略した部分は既定値になる

<div class="compact-table">

| 省略するもの | 意味 |
| --- | --- |
| <span class="rule-body">ボディ</span> | 条件なしで常に成り立つ = **定数** |
| <span class="rule-head">値の作り方</span> | 値は **true** |
| `{ }` | 式が 1 つなら省略できる |

</div>

::right::

<FindyAnnotatedCode>

```rego
deny contains msg if {
	is_big
	msg := "size 超過"
}

max_size := 10

is_big if input.size > max_size
```

<FindyCodeRegion :line="6" label="ボディを省略 → 常に 10" color="#7ee0a8" />
<FindyCodeRegion :line="8" label="値の作り方を省略 → true。{ } も省略" color="#7cc4ff" />

</FindyAnnotatedCode>

<!--
どれも同じ「ヘッド if { ボディ }」の省略形。max_size は「ボディが無いルール」であって変数ではない。
is_big は値を書いていないので true。条件が成り立たないと undefined になる (次のスライド以降で効いてくる)。
-->

---
layout: two-cols
title: ".rego ファイルの構成要素"
class: code-sm
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1
valign: center
---

<FindyAnnotatedCode :line-height="1.7">

```rego
package main        # 必須。1 ファイルに 1 つ

import rego.v1      # Rego のバージョンを指定

deny contains msg if {
	is_big
	msg := "size 超過"
}

max_size := 10

is_big if input.size > max_size
```

<FindyCodeRegion v-click="1" :line="5" :end-line="12" label="ルール" label-position="right" color="#ff8080" />
<FindyCodeRegion v-click="2" :line="5" text="deny contains msg" label="ヘッド" color="#7cc4ff" />
<FindyCodeRegion v-click="3" :line="10" label="ヘッド (ボディなし)" color="#7cc4ff" />
<FindyCodeRegion v-click="4" :line="12" text="is_big" label="ヘッド" color="#7cc4ff" />
<FindyCodeRegion v-click="5" :line="6" :end-line="7" label="ボディ" label-position="below-left" color="#7ee0a8" />
<FindyCodeRegion v-click="6" :line="12" text="input.size > max_size" label="ボディ" label-position="right" color="#7ee0a8" />

</FindyAnnotatedCode>

::right::

<div class="quiz mt-2">

- <span v-mark.circle.red="1">Q1. ルールはどこでしょう</span>
- <span v-mark.circle.blue="2">Q2. ヘッドはどこでしょう</span>
- <span v-mark.circle.green="5">Q3. ボディはどこでしょう</span>

</div>

<div v-click="7" class="mt-6">
<FindyCallout label="「変数」は構成要素ではない">
<code>max_size := 10</code> はボディの無い<strong>ルール</strong>。<br>
<code>msg</code> は式の中の<strong>ローカル変数</strong>で、ルールの外からは見えない
</FindyCallout>
</div>

<!--
package はファイルの名前空間。conftest は既定で package main の deny を見る。
「変数を宣言する」文法は無い。max_size は data.main.max_size として外から引けるルールで、
msg はボディの中だけで有効な変数。ここを混ぜると次のスライドの表が読めなくなる。
-->

---
layout: two-cols
title: "ルール名は自由。ただし制約は 2 つ"
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1
valign: center
---

#### ① 言語の制約: 予約語・グローバル変数は不可

<div class="text-sm leading-relaxed">

`package` `import` `as` `default` `else` `not` `with` `some` `every` `in` `if` `contains` `null` `true` `false`

`input` / `data` は全部の値の入り口 (`input.debug`、`data.main.deny`) なので、ルール名で隠せない

</div>

```sh
$ opa check --strict policy/
policy/a.rego:5: rego_parse_error:
  not keyword cannot be used for rule name
```

::right::

#### ② ツールの制約: 拾う名前が決まっている

<div class="text-sm">

| ツール | 拾うルール名 |
| --- | --- |
| conftest | `deny` / `violation` / `warn` |
| Gatekeeper (k8s) | `violation` |
| 自分で `opa eval` | 好きな名前 |

</div>

<v-click>

<div class="mt-4">
<FindyCallout label="deny は Rego の予約語ではなく conftest との約束">
<code>mydeny</code> にリネームすると conftest は拾わず、<code>0 tests, 0 passed</code> で緑になる
</FindyCallout>
</div>

</v-click>

<!--
さっき conftest が deny を拾ったのは Rego の仕様ではなく conftest の約束。
言語として決まっているのは左の予約語だけで、deny / violation / warn は conftest の都合。
ここを混同すると「deny という書き方を覚える」で止まってしまう。
後半に出てくる finding も conftest が見に来る名前ではなく、exceptions.rego が deny に変換している。
opa eval 'data.main' で見ると deny も自作ルールも同列に並ぶ。
-->

---
layout: two-cols
title: "さっそくRegoを読んでみよう"
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1.2
valign: center
---

<v-clicks>

- ルールの中の各行は **AND**
- 全部真なら `msg` が `deny` 集合に入る
- 1 行でも偽なら **deny には何も入らない**

</v-clicks>

::right::

```rego {none|6-7|5,8|6-7}{at:1}
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
