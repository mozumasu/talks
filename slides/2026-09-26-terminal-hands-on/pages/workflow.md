---
layout: section
color: blue
toc: 組み合わせてワークフローに
---

# 組み合わせて<br>ワークフローに

---
layout: two-cols
ratio: 1/1
---

# ghost

::left::

バックグラウンドプロセスの管理ツール

<FindyKeyValueList size="0.95rem" gap="0.75rem">
  <FindyKeyValue label="起動">ghost run -- pnpm dev</FindyKeyValue>
  <FindyKeyValue label="一覧">ghost list</FindyKeyValue>
  <FindyKeyValue label="ログ">ghost log -f &lt;task_id&gt;</FindyKeyValue>
  <FindyKeyValue label="停止">ghost stop &lt;task_id&gt;</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout>
  <code>&</code> や <code>nohup</code> と違い、起動・ログ確認・停止がコマンド 1 つで完結する。だから AI エージェントにも任せやすい
</FindyCallout>

::right::

```sh
$ ghost run -- pnpm dev
Task started: 315681aa

$ ghost list
Task ID    Status   Command
315681aa   running  pnpm dev

$ ghost log -f 315681aa
VITE v6.3.5  ready in 347 ms
➜  Local: http://localhost:3030/

$ ghost stop 315681aa
Task stopped: 315681aa
```

<FindyRef>

[skanehira/ghost](https://github.com/skanehira/ghost)

</FindyRef>

---
layout: two-cols
ratio: 1/1
---

# portless

::left::

dev サーバーに <FindyAccentMark>安定した URL</FindyAccentMark> を自動割り当てするプロキシ

<FindyKeyValueList size="0.95rem" gap="0.75rem">
  <FindyKeyValue label="起動">portless myapp pnpm dev</FindyKeyValue>
  <FindyKeyValue label="URL">https://myapp.localhost</FindyKeyValue>
  <FindyKeyValue label="一覧">portless list</FindyKeyValue>
</FindyKeyValueList>

ポート番号を覚えなくていい。worktree ごとに URL が分かれ、並行開発でも衝突しない

::right::

```sh
$ portless myapp pnpm dev
✓ https://myapp.localhost → :3030

# 別の worktree でも同時に起動できる
$ portless myapp-feat pnpm dev
✓ https://myapp-feat.localhost → :3031

$ portless list
Name          URL                        Port
myapp         https://myapp.localhost     3030
myapp-feat    https://myapp-feat.localhost 3031
```

<FindyRef>

[vercel-labs/portless](https://github.com/vercel-labs/portless)

</FindyRef>

---
layout: content
---

# ツール単体ではなく「組み合わせ」で効く

スライド修正を Claude に頼んだとき、裏では紹介したツールがつながって動いている

<FindyFlow
  direction="horizontal"
  steps="Claude に依頼,worktree で\n作業を分離,dev サーバーで\n表示確認,PR 作成,スクショを\nPR に添付"
/>

- 編集タスクは worktree に分離するので、作業中のブランチが勝手に切り替わらない
- portless が worktree ごとに固有 URL を割り当てるので、ポートが競合しない
- この手順は dotfiles のルールとスキルに書いてあり、Claude が毎回再現する

---
layout: content
---

# 各ツールの役割分担

<FindyKeyValueList size="0.82rem">
  <FindyKeyValue label="worktree">編集タスクをブランチごとの作業ディレクトリに分離。未コミット変更の混入や index.lock の競合を防ぐ（<a href="https://github.com/mozumasu/dotfiles/blob/main/.config/claude/rules/parallel-work.md" target="_blank" class="whitespace-nowrap">parallel-work.md</a>）</FindyKeyValue>
  <FindyKeyValue label="サブエージェント">読み取り専用の並列調査 (コードリーディングや grep)。worktree を分けるコストを払わない（<a href="https://github.com/mozumasu/dotfiles/blob/main/.config/claude/rules/parallel-work.md" target="_blank" class="whitespace-nowrap">parallel-work.md</a>）</FindyKeyValue>
  <FindyKeyValue label="ghost">dev サーバーなどのバックグラウンドプロセスを起動・ログ確認・停止できる管理ツール（<a href="https://github.com/mozumasu/dotfiles/blob/main/.config/claude/rules/background-process.md" target="_blank" class="whitespace-nowrap">background-process.md</a>）</FindyKeyValue>
  <FindyKeyValue label="portless">worktree ごとに <code>https://&lt;worktree&gt;.&lt;project&gt;.localhost</code> を自動割り当て。ポート番号の管理が不要になる（<a href="https://github.com/mozumasu/dotfiles/blob/main/.config/claude/rules/background-process.md" target="_blank" class="whitespace-nowrap">background-process.md</a>）</FindyKeyValue>
  <FindyKeyValue label="スキル">PR 作成後は pr-slide-screenshots が変更スライドを dev サーバーから撮影し、PR コメントに添付（<a href="https://github.com/mozumasu/dotfiles/blob/main/.config/claude/skills/pr-slide-screenshots/SKILL.md" target="_blank" class="whitespace-nowrap">SKILL.md</a>）</FindyKeyValue>
  <FindyKeyValue label="Raycast">Script Command で Claude の git push 許可をトグル。hooks が状態ファイルを見て push をブロック / 許可する（<a href="https://github.com/mozumasu/dotfiles/blob/main/.config/claude/scripts/claude-git-push-ctl.sh" target="_blank" class="whitespace-nowrap">claude-git-push-ctl.sh</a>）</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout>
  並列作業は 3 層で使い分ける。進捗を見たい作業は herdr ペイン + worktree、
  使い捨ての調査はサブエージェント、非対話のプロセスは ghost + portless
</FindyCallout>
