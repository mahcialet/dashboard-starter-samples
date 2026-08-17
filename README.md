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

## 動かし方

Docker EngineとDocker Compose v2が必要です。試したいディレクトリへ移動し、次のコマンドを実行します。

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
- GUI管理型のFlameとlinkdingはDocker named volumeへデータを保存します。`docker compose down` ではデータは残り、`docker compose down -v` で削除できます。
- Docker連携を試すサンプルはDockerソケットを参照します。これは強い権限につながるため、公開環境ではソケットプロキシや権限制限を検討してください。
- `latest` タグは比較を始めやすくするためのものです。本番利用時は検証済みバージョンへ固定し、認証、TLS、バックアップを追加してください。

## 比較の観点

設定をGitで管理したい場合はHomepage、Dashy、Glance、Jumpが比較しやすく、画面から管理したい場合はFlameとlinkdingが向いています。Homepageはサービス統合、Dashyは外観と機能の幅、Glanceは情報フィード、Jumpは軽量な死活監視、linkdingはブックマークを長期的に蓄積する用途に特色があります。
