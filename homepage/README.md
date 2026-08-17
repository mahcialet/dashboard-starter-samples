# Homepageサンプル

Homelab向けダッシュボードHomepageのサンプルです。YAMLによるリンク／ウィジェット管理に加え、Dockerラベルから、このHomepageコンテナ自身をサービスとして自動検出します。

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
- `config/services.yaml`: 手動で管理するサービスリンク
- `config/bookmarks.yaml`: ブックマーク
- `config/widgets.yaml`: 検索、日時ウィジェット
- `config/docker.yaml`: ローカルDockerへの接続
- `config/kubernetes.yaml`: Kubernetes連携を無効のまま明示する空設定
- `compose.yaml` の `homepage.*` ラベル: Docker自動検出の例

設定ファイルを保存すると通常は自動で反映されます。Dockerソケットのマウントはコンテナ情報を読むために必要ですが、ホスト上のDockerへ強いアクセスを与えます。不要ならソケットのvolume、`config/docker.yaml`、`homepage.*` ラベルを外してください。
