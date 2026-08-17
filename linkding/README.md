# linkdingサンプル

セルフホスト型ブックマーク管理ツールlinkdingのサンプルです。ダッシュボード製品と運用資料のブックマークを初回起動時に投入し、タグ、検索、メモ、未読、アーカイブ、インポート／エクスポート、PWA、REST APIをすぐ試せます。SQLiteデータはDocker named volumeへ保存します。

## 起動

既定ではCaddyの固定認証ヘッダーを使って自動ログインします。

```bash
docker compose up -d
```

<http://localhost:8080> を開くと、サンプル用の `admin` ユーザーとしてログインした状態で表示されます。ブラウザからのアクセスは同梱のCaddyを経由し、linkding本体はホストへ直接公開されません。

`linkding-init` は公式イメージの `import_netscape` 管理コマンドを使い、`bookmarks.html` を初回だけ取り込みます。再起動で利用者の編集内容を上書きしません。サンプルを再投入する場合は `docker compose down -v` でvolumeを削除してから起動してください。

別ポートなら `PORT=8081 docker compose up -d` とします。

## 認証の切り替え

既定では認証OFF相当の自動ログインです。ログイン画面と資格情報による認証を試す場合は、認証バイパスを無効にします。

```bash
LINKDING_AUTH_BYPASS=False \
LD_SUPERUSER_NAME=admin \
LD_SUPERUSER_PASSWORD='replace-with-a-strong-password' \
docker compose up -d
```

認証OFF時はCaddyが `Remote-User: admin` を固定で上書きし、linkdingは `HTTP_REMOTE_USER` を信頼して自動ログインします。ユーザー名を変える場合は `LD_SUPERUSER_NAME` も指定してください。そのCaddyへアクセスできる全員が同じユーザーとして操作できるため、認証OFFのままインターネットや信頼できないネットワークへ公開しないでください。

## 試せること

- ブックマークの登録、タグ付け、検索、一括編集
- 初期データによるメモ、未読フィルター、アーカイブ画面
- SettingsからNetscape HTML形式でインポート／エクスポート
- Admin画面でユーザーやデータを管理
- `/api/` 以下のREST APIとブラウザ拡張
- named volume `linkding-data` によるSQLiteの永続化

本番公開前には必ず強いパスワードへ変更し、TLSとバックアップを設定してください。データも含めて初期化する場合だけ `docker compose down -v` を使います。
