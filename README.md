# test-automation-workshop

自動テスト研修用のリポジトリです。[はまったいまー](https://hamattimer.app/)を対象に、Playwrightを使ったE2Eテストの作成を学びます。

## はまったいまーとは

ユーザーがプログラミングで問題解決に取り組む際に、時間を浪費してしまうのを防ぐためのWebアプリです。

## セットアップ

### インストール

```bash
npm install
npx playwright install
```

## コマンド一覧

| コマンド | 説明 |
| --- | --- |
| `npm test` | テスト実行 |
| `npm run test:ui` | Playwright UI モードで対話的にテスト実行 |
| `npm run test:headless` | ヘッドレスでのテスト実行 |
| `npm run check` | Biome フォーマット + リント（自動修正） |
| `npm run format` | Biome フォーマットのみ |
| `npm run lint` | Biome リントのみ |
