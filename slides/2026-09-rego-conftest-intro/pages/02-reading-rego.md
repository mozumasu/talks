---
layout: section
color: blue
toc: Rego の読み方
---

# Rego の読み方

手続きではなく「成り立つ条件」を宣言する

---
layout: two-cols
eyebrowNum: 2
ratio: 1/1.3
eyebrow: Rego の読み方
---

## Rego

手続きではなく、`ルール` という単位で成り立つ条件を宣言する言語

## ルール

条件が成り立つときに値が決まる **名前付きの条件** と  
 **条件を満たすものの集まり** に名前を付けたもの

::left::

```python
# Python: 手順を書く
deny = []                 # 入れ物
for tag in tags:          # ループ
    if len(tag) >= 6:     # 条件
        deny.append(tag + " は長い")
```

::right::


<div class="anno-box anno-rule" data-label="ルール">

```rego
# Rego: 成り立つ条件を書く
deny contains msg if { # deny という名前を持つ条件
	some tag in input.tags
	count(tag) >= 6
	msg := sprintf("%s は長い", [tag])
}
```

</div>

<!--
他の言語に対応物が無いのがここ。関数でも変数でもなく、SQL のビューが一番近い。
CREATE VIEW deny AS SELECT ... FROM tags WHERE length(tag) >= 6 と同じ気持ち。
ボディは「手順」ではなく「あり得る値の組み合わせ全部に対するフィルタ」。
-->

---
layout: content
eyebrowNum: 2
eyebrow: Rego の読み方
---

## ルールの構造

<div class="text-sm mb-3">
ルール = ヘッド (<span class="rule-name">ルール名</span> + <span class="rule-head">値の作り方</span>) + <span class="rule-body">ボディ (body)</span>
</div>
<div class="grid grid-cols-2 gap-x-5 mt-3">

<pre class="rule-shape-block has-anno-tl"><span class="anno anno-head anno-tl" data-label="ヘッド"><span class="rule-name">&lt;ルール名&gt;</span> <span class="rule-head">&lt;値の作り方&gt;</span></span> if &#123;
    <span class="anno anno-body anno-tl" data-label="ボディ"><span class="rule-body">&lt;ボディ&gt;</span></span>
&#125;</pre>

<pre class="rule-shape-block"><span class="rule-name">deny</span> <span class="rule-head">contains msg</span> if &#123;
    <span class="rule-body">input.debug == true</span>
    <span class="rule-body">msg := "..."</span>
# ボディは式の集まり。すべて成立するとヘッドの値が決まる
&#125;</pre>

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

<!--
用語は公式ドキュメントに合わせている (rule = head + body)。英語のドキュメントを読むときにそのまま繋がる。
どのルールも同じ「ヘッド if { ボディ }」で、名前が違うだけ。
-->

---
layout: two-cols
title: "どこまでが Rego で、どこからが conftest か"
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1
valign: center
---

#### Rego が予約している語

```text
package  import  as  default  else
not  with  some  every  in  if
contains  null  true  false
```

入り口の `input` / `data` も特別。これらはルール名にできない

```sh
$ opa check --strict policy/
rego_parse_error: not
```

::right::

#### conftest が探しに来る名前

<div class="text-sm">

| ツール | 探すルール名 |
| --- | --- |
| conftest | `deny` / `violation` / `warn` |
| Gatekeeper (k8s) | `violation` |
| 自分で `opa eval` | 好きな名前 |

</div>

<v-click>

<div class="mt-4">
<FindyCallout label="deny は Rego の予約語ではない">
<code>mydeny</code> にリネームすると conftest は探しに来ず、<code>0 tests, 0 passed</code> で緑になる
</FindyCallout>
</div>

</v-click>

<!--
ここを混同すると「deny という書き方を覚える」で止まってしまう。
言語として決まっているのは左の予約語だけで、deny / violation / warn は conftest の都合。
後半に出てくる finding も conftest が見に来る名前ではなく、exceptions.rego が deny に変換している。
opa eval 'data.main' で見ると deny も自作ルールも同列に並ぶ。
-->



---
layout: two-cols
title: ".rego ファイルの構成要素"
eyebrowNum: 2
eyebrow: Rego の読み方
ratio: 1/1
valign: center
---

<pre class="rule-shape-block">package main        <span class="anno-comment"># 必須。1 ファイルに 1 つ</span>

import rego.v1      <span class="anno-comment"># Rego のバージョンを指定</span>

<span v-click="1" class="anno anno-rule-outline anno-tl" data-label="ルール"><span v-click="2" class="anno anno-head" data-label="ヘッド">deny contains msg</span> if &#123;
<span v-click="3" class="anno anno-body" data-label="ボディ">    is_big
    msg := "size 超過"</span>
&#125;

<span v-click="2" class="anno anno-head" data-label="ヘッド (ボディなし)">max_size := 10</span>

<span v-click="2" class="anno anno-head">is_big</span> if <span v-click="3" class="anno anno-body">input.size &gt; max_size</span></span>
</pre>

::right::

<div class="quiz mt-2">

- <span v-mark.circle.red="1">Q1. ルールはどこでしょう</span>
- <span v-mark.circle.blue="2">Q2. ヘッドはどこでしょう</span>
- <span v-mark.circle.green="3">Q3. ボディはどこでしょう</span>

</div>

<div v-click="4" class="mt-6">
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
