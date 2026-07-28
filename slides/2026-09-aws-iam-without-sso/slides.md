---
theme: findy
title: SSO が使えなくても快適に生きたい
info: |
  イベント名 (仮)
  SSO が使えない環境で IAM ユーザーと生きる選択肢
class: text-left
comark: true
favicon: https://github.com/mozumasu.png
addons:
  - slidev-addon-findy
layout: talk-cover
event: イベント名 2026.9.X
image: https://github.com/mozumasu.png
name: mozumasu
role: ファインディ / Platform SRE
---

## IAM ユーザーで生きるしかない人への選択肢マップ
# SSO が使えなくても<br>快適に生きたい

---
layout: profile
image: https://github.com/mozumasu.png
name: mozumasu
role: ファインディ / Platform SRE
---

## 自己紹介

- 開発環境: MacOS / WezTerm / Neovim / macSKK

- X: @mozumasu / GitHub: mozumasu

---
layout: toc
columns: 1
---

---
layout: section
color: blue
toc: SSO が使えないってどういうこと
---

# SSO が使えないって<br>どういうこと

---
layout: content
eyebrowNum: 1
eyebrow: SSO が使えないってどういうこと
---

# 「Identity Center 使えばいいじゃん」が通じない環境がある

- 他社管理の AWS Organization 配下で作業する受託・パートナーの立場
- Identity Center は存在する。しかし管理権は先方にある
- 先方の IdP のアカウントは外部パートナーには発行されない
- 残された手段: **アカウントごとの IAM ユーザー** (stg / prod は別アカウント)

## 日々のつらみ

- サインインのたびにアカウント ID (12 桁)・ユーザー名・パスワードを入力
- アカウント ID なんて暗記できない (stg と prod で別の 12 桁)
- コンソールは 1 セッションのみ → stg と prod でセッションの取り合い

---
layout: section
color: green
toc: 選択肢のマップ
---

# 選択肢のマップ

理想論は分かってる。<br>でも使えないんだ

---
layout: content
title: 選択肢のマップ
---

<FindyAgendaItem num="1" title="正攻法: Identity Center に乗せてもらう" gradient />
<FindyAgendaItem num="2" title="代替: スイッチロール (Jump アカウント)" gradient />
<FindyAgendaItem num="3" title="推奨: granted でログイン画面ごとスキップ" gradient />
<FindyAgendaItem num="4" title="キーレス派: aws login (ただし 12 時間の壁)" gradient />
<FindyAgendaItem num="5" title="どの道を選んでも効く軽減策 3 点" gradient />

---
layout: two-cols
eyebrowNum: 2
eyebrow: 選択肢のマップ
ratio: 1/1.2
valign: center
---

# 01. 正攻法: Identity Center に乗せてもらう

::left::

- 必要なのは構築ではなく**依頼**
  1. ユーザー作成 (IdP アカウント)
  2. Permission Set の用意
  3. アカウントへの割り当て
- CLI は `aws sso login` 1 回で全対応
- **ベストだが自社では完結しない**

<!--
IdP アカウント発行は先方のポリシー次第で止まる、が依頼のハードル。
-->


::right::

```ini [~/.aws/config]
[sso-session partner]
sso_start_url = https://xxx.awsapps.com/start
sso_region = ap-northeast-1

[profile app-stg]
sso_session = partner
sso_account_id = 111111111111
sso_role_name = AdministratorAccess
```

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# 02. 代替: スイッチロール (Jump アカウント)

- 自社管理の 1 アカウントに IAM ユーザーを集約し、stg / prod には AssumeRole 用のロールだけ置く
- ログイン先は常に Jump アカウントの 1 URL → コンソールの「ロールの切り替え」で各環境へ
- Organizations の外にあるアカウントでも構成できる

## トレードオフ

- ロールと信頼ポリシーの管理は自前
- 管理の手間と監査のしやすさは Identity Center に劣る

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# 03. 推奨: granted でログイン画面ごとスキップ

```bash
brew install common-fate/granted/granted
assume -c app-stg    # stg のコンソールがブラウザで開く。入力ゼロ
```

- クレデンシャルから federation URL を生成 → **サインイン画面自体が出ない**
- `assume -c` だけ打てば fzf ライクにプロファイルを補完選択
- Firefox は専用の Granted Containers アドオンで **stg と prod を同時に別タブで表示**できる
- 同等機能の aws-vault (`aws-vault login app-stg`) もあるが、開発状況に差がある (次のスライド)

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# 03. ツールの現在地: aws-vault と granted

- **aws-vault** (99designs 製): README で更新終了 (abandoned) を宣言。最終リリースは 2023 年の v7.2.0
  - 後継はコミュニティフォークの [ByteNess/aws-vault](https://github.com/ByteNess/aws-vault)
- **granted**: 開発元の Common Fate 社は 2025 年に事業終了。プロジェクトは非営利団体 [fwd:cloudsec](https://fwdcloudsec.org/) に寄贈され、開発継続中
  - 現リポジトリ: [fwdcloudsec/granted](https://github.com/fwdcloudsec/granted) / ドキュメント: [docs.granted.dev](https://docs.granted.dev/)
- どちらも「作った会社の手を離れた」が、**コミュニティで生きているのは granted** → 新規に選ぶならこちら

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# 03. granted と assume: 管理の顔と日常の顔

```bash
granted credentials list   # 管理は granted (登録・一覧・ローテーション)
assume app-stg             # 日常は assume: このシェルに一時クレデンシャルを export
assume -c app-stg          # -c を付けるとブラウザでコンソールが開く
```

- `assume` はバイナリではなく**シェルエイリアス** (`source` で実行される)
- バイナリは呼び出し元シェルの環境変数を書き換えられない → `source` 実行で**いま使っているシェル**に `AWS_*` を export する仕掛け
- インストール時に ~/.zshrc へエイリアスが自動追記される

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# 03. プロファイル追加は 1 コマンド

```bash
granted credentials add app-stg
# → Access Key ID / Secret Access Key を対話入力 (macOS Keychain に保存)
# → ~/.aws/config に credential_process が自動追記され、CLI / CDK はそのまま動く

assume app-stg             # もう使える
```

- region や `mfa_serial` は `~/.aws/config` の同じプロファイルに普通に書き足す
- `mfa_serial` があると assume 時にトークン入力 → 一時クレデンシャルをキャッシュ
- 既存の `~/.aws/credentials` の平文キーは `granted credentials import` で取り込む (次のスライド)

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# 03. ついでに解決: アクセスキーを平文で持たない

- `granted credentials import` でアクセスキーが macOS Keychain に移り、`~/.aws/credentials` から平文が消える
- `~/.aws/config` には `credential_process` が書き込まれ、AWS CLI / CDK は変更なしでそのまま動く

```ini [~/.aws/config]
[profile app-stg]
credential_process = granted credential-process --profile app-stg
```

- 1Password 利用者は `credential_process` + `op` で同じ構成が組める

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# 04. キーレス派: aws login (CLI 組み込みブラウザ認証)

- AWS CLI 組み込みのブラウザ認証。長期アクセスキーを保存しない**キーレス方式**

```bash
aws login --profile app-stg
```

- ただし制約がある
  - リフレッシュトークンによる自動更新は**最大 12 時間**。延長オプションなし
  - 認証は通常のブラウザサインインで行う → **アカウント ID 入力のつらみは解決しない** (解決するのはキー管理側だけ)
  - 2 回目以降は "Continue with an active session" でワンクリックにはなる
- 関連 issue (aws/aws-cli)
  - [#9978](https://github.com/aws/aws-cli/issues/9978): 保存済み `login_session` の自動選択 (open)
  - [#9869](https://github.com/aws/aws-cli/issues/9869): 平文キーが残っていると login のクレデンシャルより優先される罠

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# 05. 何を選んでも効く軽減策 3 点

- **アカウントエイリアス**: 12 桁の代わりに名前でサインインできる

  ```bash
  aws iam create-account-alias --account-alias app-stg --profile app-stg
  ```

  - 全 AWS で一意。1 アカウントに 1 つだけなので**既存エイリアスの上書きに注意**
- **パスワードマネージャ**: アカウント ID・ユーザー名・パスワードの 3 欄をまとめて自動入力
- **サインイン URL のブックマーク**: `https://<アカウントID>.signin.aws.amazon.com/console` は ID が事前入力された状態で開く

---
layout: content
eyebrowNum: 2
eyebrow: 選択肢のマップ
---

# どの手段が何を解決するか

| 手段 | CLI のキー管理 | コンソールを入力ゼロで開く |
| --- | --- | --- |
| 01 Identity Center | ✅ 長期キー不要 | ✅ ポータルから 1 クリック |
| 03 granted (`assume -c`) | ✅ Keychain 保管 | ✅ サインイン画面をスキップ |
| 04 aws login | ✅ キーレス | ❌ ブラウザログイン必要 (12h) |
| 05 軽減策 3 点 | — | 🔶 入力は残るが自動化で緩和 |

- 「入力ゼロ」に効くのは **Identity Center か granted だけ**。先方に依頼できるまでの現実解が granted

---
layout: section
color: mid
toc: 失敗談
---

# 失敗談

自作 federation の拒絶と、消えない 403

---
layout: content
eyebrowNum: 3
eyebrow: 失敗談
---

# IAM ユーザーのトークンは federation に拒否される

- granted 相当を自作: 一時クレデンシャル → `getSigninToken` → サインイン URL
- `getSigninToken` は成功するのに、**実際のログインで拒否される**
  - federation ログインが受け付けるのは **AssumeRole 由来のトークンのみ**
  - IAM ユーザーのセッションクレデンシャルは対象外 (検証は URL 生成で満足してはいけない)

## 解決: 3 段構え

```text
IAM ユーザー → AssumeRole → federation URL → コンソール直行
```

- 小技: assume 先に **CDK bootstrap の lookup ロール** (読み取り専用) を流用

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::111111111111:role/cdk-hnb659fds-lookup-role-111111111111-ap-northeast-1 \
  --role-session-name console
```

---
layout: content
eyebrowNum: 3
eyebrow: 失敗談
---

# ツールを替えても 403 が消えない

- `assume -c app-stg` → AccessDenied: **sts:TagSession** に explicit deny
- aws-vault に乗り換え → region エラーを越えたら今度は **iam:GetUser** に explicit deny
- 正体は 1 本の **MFA 必須ポリシー** (MFA なしセッションをほぼ全 deny)
  - 表面のアクション名が毎回違うだけで、真因はずっと同じ
  - **explicit deny は Allow をいくら足しても消えない**。ツールの乗り換えでも消えない

<!--
granted のソースを clone して裏取り: GetFederationToken 経路では
セッションタグ (userID/account/principalArn) を必ず付け、無効化フラグは
存在しない (pkg/cfaws/assumer_aws_iam.go)。だから TagSession deny を踏む。
-->

---
layout: content
eyebrowNum: 3
eyebrow: 失敗談
---

# STS API と MFA の相性が明暗を分ける

| STS API | 使われる場面 | MFA を渡せるか |
| --- | --- | --- |
| GetFederationToken | granted `assume -c` / `aws-vault login` | ❌ 不可 → MFA 必須環境では原理的に無理 |
| GetSessionToken | CLI の一時セッション (`mfa_serial`) | ✅ TOTP |
| AssumeRole | ロール切り替え・3 段構え | ✅ TOTP |

- MFA 必須ポリシー下のコンソール直行は **AssumeRole 経由 (3 段構え) 一択**
- おまけの罠: パスキー (FIDO) は STS に渡せない。CLI 用に **TOTP の追加登録**が要る

---
layout: content
---

# まとめ: トレードオフを選ぶ

- **キーレスだがログインが要る** (aws login) vs **ログインレスだが長期キーを持つ** (granted / aws-vault の federation 系)
- キー保持のリスクは **Keychain 暗号化 + 定期ローテーション**で抑える
- 先方に依頼できるなら Identity Center が最善。それまでの現実解が granted
- どの道を選んでも、エイリアス・パスワードマネージャ・ブックマークの軽減策は効く

---
layout: end
---

# ありがとうございました
