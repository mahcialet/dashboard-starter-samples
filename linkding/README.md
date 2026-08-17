# linkdingサンプル

セルフホスト型ブックマーク管理ツールlinkdingのサンプルです。タグ、検索、メモ、既読管理、インポート／エクスポート、PWA、REST APIを試せます。SQLiteデータはDocker named volumeへ保存します。

## 起動

サンプル用のユーザー名とパスワードを指定して起動します。

```bash
LD_SUPERUSER_NAME=admin \
LD_SUPERUSER_PASSWORD='replace-with-a-strong-password' \
docker compose up -d
```

<http://localhost:8080> を開き、指定した資格情報でログインします。環境変数を省略した場合は、サンプル用の `admin` / `change-me` が作成されます。既存volumeに同名ユーザーがいる場合、資格情報は作り直されません。

別ポートなら `PORT=8081 docker compose up -d` とします。

## 試せること

- ブックマークの登録、タグ付け、検索、一括編集
- SettingsからNetscape HTML形式でインポート／エクスポート
- Admin画面でユーザーやデータを管理
- `/api/` 以下のREST APIとブラウザ拡張
- named volume `linkding-data` によるSQLiteの永続化

本番公開前には必ず強いパスワードへ変更し、TLSとバックアップを設定してください。データも含めて初期化する場合だけ `docker compose down -v` を使います。
