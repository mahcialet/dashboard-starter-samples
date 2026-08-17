# Flameサンプル

シンプルなSpeedDial型スタートページFlameのサンプルです。アプリ、ブックマーク、テーマをGUIで編集し、SQLiteへ保存できます。Docker連携用ラベルもコンテナ自身に設定済みです。

## 起動

```bash
docker compose up -d
```

<http://localhost:8080> を開きます。設定画面の初期パスワードは `change-me` です。別の値で起動する場合は次のようにします。

```bash
FLAME_PASSWORD='replace-with-a-strong-password' docker compose up -d
```

## 試せること

- Applications／Bookmarksの追加、編集、ピン留め
- 検索プロバイダー、テーマ、天気の設定
- Settings > DockerでDocker APIを有効にした後のラベル自動検出
- named volume `flame-data` によるSQLiteデータの永続化

DockerソケットにはホストDockerへ強い権限があります。Docker連携が不要ならソケットのvolumeと `flame.*` ラベルを削除してください。本番公開前には必ず初期パスワードを変更してください。
