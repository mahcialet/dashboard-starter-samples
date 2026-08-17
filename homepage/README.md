# Homepageサンプル

Homelab向けダッシュボードHomepageのサンプルです。8製品と運用資料のリンク、ブックマーク、コンテナリソース、東京の天気、検索、日時を初期表示します。Dockerラベルから、対応するコンテナをサービスとして自動検出する例も含みます。

## 起動

```bash
docker compose up -d
```

<http://localhost:8080> を開きます。別ポートではHostヘッダーも許可してください。

```bash
PORT=8081 HOMEPAGE_ALLOWED_HOSTS=localhost:8081 docker compose up -d
```

## 主な構成

- `config/settings.yaml`: タイトル、テーマ、レイアウト
- `config/services.yaml`: ダッシュボード製品と運用資料のサービスリンク
- `config/bookmarks.yaml`: 開発、ドキュメント、コミュニティのブックマーク
- `config/widgets.yaml`: コンテナリソース、天気、検索、日時ウィジェット
- `config/docker.yaml`: ローカルDockerへの接続
- `config/kubernetes.yaml`: Kubernetes連携を無効のまま明示する空設定
- `config/proxmox.yaml`: Proxmox連携を無効のまま明示する空設定
- `config/custom.css`／`custom.js`: 任意の見た目とブラウザ処理
- `compose.yaml` の `homepage.*` ラベル: Docker自動検出の例

設定ファイルを保存すると通常は自動で反映されます。Dockerソケットのマウントはコンテナ情報を読むために必要ですが、ホスト上のDockerへ強いアクセスを与えます。不要ならソケットのvolume、`config/docker.yaml`、`homepage.*` ラベルを外してください。
