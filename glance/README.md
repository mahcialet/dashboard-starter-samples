# Glanceサンプル

複数の情報フィードを一画面にまとめるGlanceのサンプルです。カレンダー、ブックマーク、検索、RSS、天気、GitHubリリース、Dockerコンテナ状態を確認できます。

## 起動

```bash
docker compose up -d
```

<http://localhost:8080> を開きます。別ポートなら `PORT=8081 docker compose up -d` とします。RSS、天気、リリース情報の取得にはコンテナからインターネットへ接続できる必要があります。

## 主な構成

- `config/glance.yml`: 3カラムのページと各ウィジェット
- `docker-containers`: Dockerソケットと `glance.*` ラベルによる状態表示
- `rss`／`weather`／`releases`: 外部情報をキャッシュして表示するウィジェット

設定を編集するとGlanceが自動的に再読み込みします。Docker連携が不要ならソケットのvolume、Dockerウィジェット、`glance.*` ラベルを削除してください。
