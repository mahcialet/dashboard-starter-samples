# Dashboard Starter Samples

セルフホスト型のダッシュボード／スタートページを、同じ手順で比較できるDocker Composeサンプル集です。各ディレクトリは独立しており、ホストへNode.js、Python、PHPなどをインストールせずに試せます。

## 収録サンプル

| ディレクトリ | OSS | 向いている用途 | 主な設定／データ |
| --- | --- | --- | --- |
| `homepage` | Homepage | Homelab、Dockerサービス一覧 | YAML、Dockerラベル |
| `dashy` | Dashy | 多機能なスタートページ | YAML、UIエディタ |
| `flame` | Flame | シンプルなSpeedDial | SQLite、GUI |
| `glance` | Glance | RSS、天気、Docker情報 | YAML、ウィジェット |
| `jump` | Jump | リンク集、リアルタイム死活監視 | JSON、Dockerラベル |
| `linkding` | linkding | タグ付きブックマーク管理 | SQLite、REST API、GUI |
| `homarr` | Homarr | GUI編集型Homelabダッシュボード | SQLite、ドラッグ＆ドロップ |
| `homer` | Homer | 軽量な静的ランチャー | YAML、静的ファイル |

## 動かし方

Docker EngineとDocker Compose v2が必要です。

### 全サービスをまとめて試す

リポジトリルートで `start.sh` を実行すると、Caddyのインデックスページと8製品をまとめて起動できます。

```bash
./start.sh
```

8080番から順に空きポートを探すため、使用中のポートは自動的にスキップされます。起動後に表示されるIndex URLを開くと製品一覧が表示され、各カードが実際に割り当てられたCaddyリバースプロキシを別タブで開きます。探索開始位置は `START_PORT=18080 ./start.sh` のように変更できます。

衝突がない場合の既定URLは次のとおりです。

| 既定URL | サービス |
| --- | --- |
| <http://localhost:8080> | インデックス |
| <http://localhost:8081> | Homepage |
| <http://localhost:8082> | Dashy |
| <http://localhost:8083> | Flame |
| <http://localhost:8084> | Glance |
| <http://localhost:8085> | Jump |
| <http://localhost:8086> | linkding |
| <http://localhost:8087> | Homarr |
| <http://localhost:8088> | Homer |

linkdingはサンプルをすぐ試せるよう、既定で認証OFF相当の自動ログインです。認証を有効にする場合は `LINKDING_AUTH_BYPASS=False ./start.sh` とし、ユーザー名 `admin`、パスワード `change-me` でログインします。`LD_SUPERUSER_NAME` と `LD_SUPERUSER_PASSWORD` で資格情報を変更できます。既定の認証バイパス状態はインターネットへ公開しないでください。

Homarrは初回アクセス時にオンボーディングが表示され、管理ユーザーなどをGUIで設定します。公式スターターボードは自動生成されます。連携情報の暗号化に使う既定鍵はサンプル専用です。本番利用では初回起動前に `HOMARR_SECRET_ENCRYPTION_KEY` へ64文字の16進数鍵を設定し、その後は同じ値を保管・再利用してください。

各製品には比較用の初期コンテンツまたは初回セットアップを用意しています。Homepage、Dashy、Glance、Jump、HomerはGit管理できる設定ファイルからリンクやウィジェットを読み込みます。Flameは初期化API、linkdingは公式のNetscapeブックマーク取り込みコマンドで、named volumeへ初回だけデータを投入します。Homarrは公式スターターボードを生成し、GUI編集を体験できるオンボーディングから開始します。

統合起動時も各アプリ本体はホストへ直接公開されず、すべてCaddyを経由します。停止はリポジトリルートで `docker compose down` とします。ポートを明示管理したい場合は、`INDEX_PORT`、`HOMEPAGE_PORT`、`DASHY_PORT`、`FLAME_PORT`、`GLANCE_PORT`、`JUMP_PORT`、`LINKDING_PORT`、`HOMARR_PORT`、`HOMER_PORT` を指定して `docker compose up -d` を直接実行できます。

### 1サービスだけ試す

試したいディレクトリへ移動し、そのディレクトリの `compose.yaml` を起動します。

```bash
cd homepage
docker compose up -d
```

ブラウザで <http://localhost:8080> を開いてください。ログ確認と停止は次のとおりです。

```bash
docker compose logs -f
docker compose down
```

8080番ポートが使用中なら、ホスト側のポートだけ変更できます。

```bash
PORT=8081 docker compose up -d
```

HomepageだけはHostヘッダーの許可も必要なため、ポート変更時は次のように起動します。

```bash
PORT=8081 HOMEPAGE_ALLOWED_HOSTS=localhost:8081 docker compose up -d
```

## 共通方針

- 各サンプルは公式コンテナイメージ、`compose.yaml`、初期設定または永続ボリューム、日本語READMEを含みます。
- 設定ファイル型の製品には、リンク、フィード、死活監視、Docker表示などをすぐ比較できる初期データを用意しています。
- GUI管理型のFlame、linkding、HomarrはDocker named volumeへデータを保存します。Flameとlinkdingは初期リンク／ブックマークを自動投入し、Homarrは初回オンボーディングで設定します。`docker compose down` ではデータは残り、`docker compose down -v` で初期化できます。
- Docker連携を試すサンプルはDockerソケットを参照します。これは強い権限につながるため、公開環境ではソケットプロキシや権限制限を検討してください。
- `latest` タグは比較を始めやすくするためのものです。本番利用時は検証済みバージョンへ固定し、認証、TLS、バックアップを追加してください。

## 比較の観点

設定をGitで管理したい場合はHomepage、Dashy、Glance、Jump、Homerが比較しやすく、画面から視覚的に配置したい場合はHomarr、シンプルにリンクを管理したい場合はFlame、ブックマークを蓄積したい場合はlinkdingが向いています。Homerは特に軽量で動的機能を持たず、HomarrはGUI編集とサービス統合に重点があります。
