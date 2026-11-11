---
layout: section
title: '03'
toc: kubectlの向き先 is どこ!?
---

# kubectlの向き先 is どこ!?

---
title: kubectl はどこにつながっている?
---

kubectl は *kubeconfig* の *current-context* が指すクラスターを操作する

<div class="kc-cols">
<div>

<div class="term">
<div class="term-bar"><span></span><span></span><span></span><em>ターミナル</em></div>

````md magic-move {at:1}
```sh
$ kubectl config current-context
stg
```
```sh
$ kubectl config use-context prod
Switched to context "prod".
```
````

</div>

</div>
<div>

<p class="kc-label">~/.kube/config (環境変数 KUBECONFIG があればそちら)</p>

<div class="hl-soft">

````md magic-move {at:1}
```yaml {4}
contexts:
  - name: stg    # どのクラスターに、どのユーザーでつなぐか
  - name: prod
current-context: stg   # ← kubectl はここを見る
```
```yaml {4}
contexts:
  - name: stg    # どのクラスターに、どのユーザーでつなぐか
  - name: prod
current-context: prod  # ← use-context で書き換わった
```
````

</div>

</div>
</div>

<div v-click="2" class="warn">

*use-context はファイルを書き換える*ので、1 つのペインで切り替えると全部のペインが向きを変える

</div>

<style>
.kc-cols {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 1.25rem;
}

.kc-label {
  margin: 0 0 0.25rem;
  color: var(--theme-muted);
  font-size: var(--theme-font-size-caption);
}

.warn {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border-left: 4px solid var(--theme-red);
  background: var(--theme-red-50);
}

.warn p {
  margin: 0;
}
</style>

---
title: 向き先を切り替えるツール
---

<div class="tool-table">

| | kubectx | kubeswitch |
| --- | --- | --- |
| うれしいこと | use-context と同じ仕組みを打ちやすくしたもの<br>(別名・一覧から選ぶ・`kubectx -` で戻る) | ペインごとに別の向き先にできる |
| 切り替え方 | kubeconfig の current-context を書き換える | kubeconfig の一時コピーを作って、それを書き換える |
| 切り替えが効く範囲 | そのファイルを使うターミナル全部 | 切り替えたシェル (ペイン) だけ |
| 探す場所 | 1 つの kubeconfig | 複数の kubeconfig (ファイル・Vault・EKS など) |
| コマンド | `kubectx prod` | `switch` (一覧から選ぶ) |

</div>

<div v-click>

ペインごとに stg と prod を分けて開きたいので、*kubeswitch* にした

</div>

<div class="refs">

参考: [kubectx](https://github.com/ahmetb/kubectx) / [kubeswitch](https://github.com/danielfoehrKn/kubeswitch)

</div>

<style>
.tool-table {
  font-size: 0.85em;
}

.tool-table td:first-child {
  white-space: nowrap;
}
</style>

---
title: kubeswitch ならペインごとに向き先が分かれる
---

<div class="panes">
  <div class="pane">
    <p class="pane-title">左のペイン</p>
    <pre><span class="cmd">❯ switch</span>  → stg を選ぶ
KUBECONFIG=/tmp/…/stg のコピー
<span class="cmd">❯ kubectl get pods</span>  → stg の Pod</pre>
  </div>
  <div class="pane is-prod">
    <p class="pane-title">右のペイン</p>
    <pre><span class="cmd">❯ switch</span>  → prod を選ぶ
KUBECONFIG=/tmp/…/prod のコピー
<span class="cmd">❯ kubectl get pods</span>  → prod の Pod</pre>
  </div>
</div>

- `switch` はシェルの環境変数 `KUBECONFIG` を一時コピーに向け直す。だから隣のペインには影響しない
- kubeconfig は 1 クラスター 1 ファイルで `~/.kube/clusters/` に置き、そこを探させる

<div class="code-sm">

```yaml
# ~/.kube/switch-config.yaml
kind: SwitchConfig
version: v1alpha1
kubeconfigStores:
  - kind: filesystem
    kubeconfigName: "*.yaml"
    paths:
      - ~/.kube/clusters
```

</div>

<div class="refs">

参考: [dotfiles の switch-config.yaml](https://github.com/mozumasu/demo-dotfiles/blob/master/.config/kubeswitch/switch-config.yaml)

</div>

<style>
.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.pane {
  padding: 0.5rem 0.75rem;
  border-top: 4px solid #0891b2;
  border-radius: var(--theme-radius-sm);
  background: #1e1e2e;
  color: #e5e7eb;
}

.pane.is-prod {
  border-top-color: var(--theme-red);
}

.pane-title {
  margin: 0 0 0.25rem;
  color: #9ca3af;
  font-size: var(--theme-font-size-caption);
}

.pane pre {
  margin: 0;
  background: none;
  color: inherit;
  font-size: 0.7rem;
  line-height: 1.6;
  white-space: pre;
}

.pane .cmd {
  color: #86efac;
}
</style>

---
title: どこにつながっているかをプロンプトに出す
---

<div class="prompts">
  <pre><span class="dir">~/src/app</span> <span class="git">(main)</span> <span class="stg">⎈ stg</span> <span class="ok">❯</span></pre>
  <pre><span class="dir">~/src/app</span> <span class="git">(main)</span> <span class="prod">⎈ prod</span> <span class="ok">❯</span></pre>
</div>

- 今の向き先 (current-context) を毎回プロンプトに出す。*prod は赤*にして目立たせる
- kubectl を起動せず kubeconfig を直接読むので、プロンプトが遅くならない

<div class="code-sm">

```zsh
_kube_prompt() {
  kube_prompt=
  local cfg=${${KUBECONFIG:-$HOME/.kube/config}%%:*} line ctx
  [[ -r $cfg ]] || return
  for line in "${(@f)$(<$cfg)}"; do
    [[ $line == current-context:* ]] && { ctx=${${line#current-context:}// /}; break; }
  done
  [[ -n $ctx ]] || return
  local name=${ctx##*/}
  if [[ $name == prod* ]]; then kube_prompt=" %F{red}⎈ $name%f"
  else kube_prompt=" %F{cyan}⎈ $name%f"; fi
}
precmd() { vcs_info; _kube_prompt }
```

</div>

<div class="refs">

参考: [dotfiles の .zshrc](https://github.com/mozumasu/demo-dotfiles/blob/master/.config/zsh/.zshrc)

</div>

<style>
.prompts {
  display: grid;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.prompts pre {
  margin: 0;
  padding: 0.4rem 0.75rem;
  border-radius: var(--theme-radius-sm);
  background: #1e1e2e;
  color: #e5e7eb;
  font-size: 0.8rem;
}

.prompts .dir { color: #60a5fa; }
.prompts .git { color: #facc15; }
.prompts .stg { color: #22d3ee; }
.prompts .prod { color: #f87171; font-weight: 700; }
.prompts .ok { color: #4ade80; }
</style>
