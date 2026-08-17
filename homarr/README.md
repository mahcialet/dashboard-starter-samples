# Homarrサンプル

GUIでボード、アプリ、ウィジェットをドラッグ＆ドロップ配置できるHomarrのサンプルです。YAMLを書かず、ブラウザ上でHomelabダッシュボードを組み立てたい場合に向いています。公式イメージのSQLite構成を使い、設定とデータをDocker named volumeへ保存します。

## 起動

```bash
docker compose up -d
```

<http://localhost:8080> を開くと、オンボーディングやログインを挟まず、作成済みの `demo` 管理者でサンプルボードが表示されます。公式のデモ用アプリとウィジェットが投入され、読み取り専用ではないため、そのままGUI編集を試せます。別ポートなら `PORT=8081 docker compose up -d` とします。

## 認証の切り替え

Homarr本体には認証を完全に無効化する設定がないため、既定ではCaddyが作成済み管理者のサンプルセッションを付与し、認証OFF相当の操作感にしています。通常のログイン画面を有効にする場合は次のように起動します。

```bash
HOMARR_AUTH_ENABLED=True docker compose up -d
```

ユーザー名とパスワードはいずれも `demo` です。認証OFFへ戻す場合は `HOMARR_AUTH_ENABLED=False docker compose up -d` とします。固定のセッショントークン、`demo / demo`、後述の暗号鍵はローカル比較用です。認証のON/OFFにかかわらず、このサンプル設定のままインターネットへ公開しないでください。

## 表示言語

Homarrの言語Cookieがまだない初回アクセスでは、Caddyがブラウザの `Accept-Language` をHomarrの対応言語へ変換します。Homarr上で言語を選択すると `homarr.locale` Cookieへ保存され、以降はその選択が優先されます。Compose側で日本語や英語へ固定する必要はありません。

## 試せること

- アプリ、カテゴリ、ウィジェットのドラッグ＆ドロップ配置
- 画面上でのボード、配色、レイアウト編集
- Docker連携や各種サービス統合
- 管理ユーザー、グループ、権限によるアクセス管理
- named volume `homarr-data` によるSQLiteデータの永続化

## 暗号鍵とDockerソケット

Homarrは連携情報の暗号化に64文字の16進数鍵を必要とします。すぐ試せるよう既定のサンプル鍵を設定していますが、本番利用では初回起動前に一意の値を指定してください。次のコマンドが出力する1行を `.env` に保存してから起動します。

```bash
printf 'HOMARR_SECRET_ENCRYPTION_KEY=%s\n' "$(openssl rand -hex 32)"
docker compose up -d
```

データ作成後に鍵を変更すると、保存済みの連携情報を復号できなくなります。鍵はパスワード管理ツールなどへ保管してください。

Docker連携用にDockerソケットを読み取り専用でマウントしています。ソケットへ接続できるコンテナはホスト上で強い権限を得る可能性があります。不要なら該当volumeを削除してください。データも含めて初期化する場合だけ `docker compose down -v` を使います。
