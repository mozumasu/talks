---
layout: section
color: gray
routeAlias: appendix-windows
---

# Appendix: Windows

WSL の導入 / Ctrl キー / コピー & ペースト

---
layout: content
eyebrow: Appendix | Windows
---

# Windows は WSL 上で進める

<FindyCallout>
  このハンズオンのシェル / CLI 操作は <FindyAccentMark>WSL (Ubuntu)</FindyAccentMark> 上で行う。
  Windows の人は WezTerm を WSL につないでおく
</FindyCallout>

<div class="code-scroll" style="--findy-code-scroll-h: 13.5rem">

::code-group

```powershell [1. WSL を入れる (管理者 PowerShell)]
wsl --install

# Ubuntu 24.04 をインストール
wsl --install -d Ubuntu-24.04

# インストール済みディストリビューションの確認
wsl --list --verbose

# WSL2をデフォルトに設定
wsl --set-default-version 2

# 特定のディストリビューションをWSL2に変換
wsl --set-version Ubuntu 2

# 再起動 (必要があれば)
Restart-Computer
# 初回起動時に Linux のユーザー名とパスワードを設定する
```

```lua [2. WezTerm の起動先を WSL にする]
-- ~/.config/wezterm/wezterm.lua
-- ドメイン名は "WSL:" + ディストリビューション名 (wsl -l -v で確認)
config.default_domain = "WSL:Ubuntu"
```

::

</div>

<FindyRef>

[WSL のインストール](https://learn.microsoft.com/ja-jp/windows/wsl/install) / [default_domain](https://wezterm.org/config/lua/config/default_domain.html) / [WslDomain](https://wezterm.org/config/lua/WslDomain.html)

</FindyRef>

---
layout: content
eyebrow: Appendix | Windows
---

# Windows で Ctrl キーを快適に使う

Windows キーボードの `Ctrl` は小指の端にあって押しづらい。<FindyAccentMark>CapsLock を Ctrl にリマップ</FindyAccentMark>するとかなり楽になる

<FindyKeyValueList size="0.95rem">
  <FindyKeyValue label="PowerToys">Microsoft 公式。Keyboard Manager で GUI 設定</FindyKeyValue>
  <FindyKeyValue label="Ctrl2Cap">Sysinternals 製。インストールして再起動するだけ</FindyKeyValue>
  <FindyKeyValue label="レジストリ">Scancode Map を直接書き換え。ツール不要だが手順がやや複雑</FindyKeyValue>
</FindyKeyValueList>

<FindyCallout variant="info">
  Mac は「システム設定 → キーボード → 修飾キー」で CapsLock → Control に変更できる
</FindyCallout>

<FindyRef label="参照">

[PowerToys Keyboard Manager](https://learn.microsoft.com/ja-jp/windows/powertoys/keyboard-manager) / [Ctrl2Cap](https://learn.microsoft.com/ja-jp/sysinternals/downloads/ctrl2cap)

</FindyRef>

---
layout: content
eyebrow: Appendix | Windows
---

# ターミナルのコピー & ペースト

Mac は `Cmd` (GUI) と `Ctrl` (ターミナル) で物理的にキーが分かれている

Windows は両方 `Ctrl` なので、ターミナルでは <FindyAccentMark>Shift を足して区別</FindyAccentMark>する

<FindyKeyValueList size="1rem">
  <FindyKeyValue label="Ctrl+Shift+C">コピー（ターミナル内）</FindyKeyValue>
  <FindyKeyValue label="Ctrl+Shift+V">ペースト（ターミナル内）</FindyKeyValue>
  <FindyKeyValue label="Ctrl+C">プロセス中断 (SIGINT)</FindyKeyValue>
  <FindyKeyValue label="Ctrl+V">リテラル入力モード</FindyKeyValue>
</FindyKeyValueList>

<FindyRef label="参照">

[WezTerm Default Key Assignments](https://wezterm.org/config/default-keys.html)

</FindyRef>
