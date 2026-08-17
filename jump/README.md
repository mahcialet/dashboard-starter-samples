# Jumpサンプル

リンク集とリアルタイムステータスページを兼ねるJumpのサンプルです。JSONで管理するリンク／検索エンジン、タグ絞り込み、死活監視、Dockerラベル自動検出を試せます。

## 起動

```bash
docker compose up -d
```

<http://localhost:8080> を開きます。別ポートなら `PORT=8081 docker compose up -d` とします。外部サイトのステータス判定にはコンテナからインターネットへ接続できる必要があります。

## 主な構成

- `sites/sites.json`: リンク、説明、タグ、既定動作
- `search/searchengines.json`: 検索ボックスの検索エンジン
- `CHECKSTATUS`／`STATUSCACHE`: 死活監視と5分キャッシュ
- `jump.*` ラベル: Jumpコンテナ自身の自動検出
- `dockerproxy`: Docker APIのコンテナ一覧だけを公開する読み取り専用プロキシ

背景画像や天気も利用できます。詳しい環境変数はJump公式READMEを参照してください。Docker連携が不要なら `dockerproxy`、`DOCKERPROXYURL`、`depends_on`、`jump.*` ラベルを外せます。
