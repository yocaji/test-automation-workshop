# 新機能仕様書：試したことの追加・削除

本書は「はまったいまー」に **新たに追加する機能「試したことの追加・削除」** の仕様書です。
アプリ全体の仕様は [SPEC.md](SPEC.md) を参照してください。

---

## 1. 目的・背景

メモ画面の「試したこと（Trial）」は、これまで **1件のみ**で運用していた。
しかし実際のデバッグでは複数の試行錯誤を重ねるため、1件では記録しきれない。

本機能では、ユーザーが**試したことを任意の件数だけ追加・削除できる**ようにし、試行錯誤のプロセスを過不足なく記録できるようにする。

---

## 2. 用語

| 用語 | 説明 |
|------|------|
| **Trial（試したこと）** | 試行錯誤の1回分。`guess`（考えたこと・調べたこと）/ `operation`（やったこと）/ `result`（やった結果）の3項目を持つ。 |
| **trials** | Trial の配列。`localStorage` のキー `trials` に JSON 配列として保存される。 |

Trial 単体の入力項目仕様は [SPEC.md 4.2.2 試したこと（Trial）](SPEC.md) を参照。

---

## 3. 現状（変更前）と変更点

| | 変更前 | 変更後（本機能） |
|---|--------|------------------|
| Trial の件数 | 1件固定 | 0件以上の任意件数 |
| 追加 | 不可 | 「試したこと」追加ボタンで末尾に1件追加 |
| 削除 | 不可 | 各 Trial の削除ボタンで個別に削除（確認あり） |

---

## 4. 機能要件

### 4.1 試したことの追加

- 「試したこと」一覧の末尾に**追加ボタン**を配置する。
- 押下すると、空の Trial（`guess` / `operation` / `result` がすべて空）を**末尾に1件追加**する。
- 追加した Trial の見出しは、件数に応じて「その1」「その2」…と連番で表示する。
- 追加件数の上限は設けない。

### 4.2 試したことの削除

- 各 Trial に**削除ボタン**を配置する。
- 押下すると**確認モーダル**を表示し、ユーザーが確定した場合のみ該当 Trial を削除する。
- 削除後は、残った Trial の見出し連番（「その1」「その2」…）を振り直す。

### 4.3 初期表示

- 画面を開いたとき、保存済みの `trials` が無い場合は、空の Trial を**1件**自動生成して表示する。

### 4.4 リセット時の初期化

- リセット（[SPEC.md 4.6 リセット／解決完了](SPEC.md)）を実行したとき、`trials` を**空の Trial 1件**に初期化する。
- これにより、追加した Trial はすべて取り除かれ、空の Trial が1件だけ残る。

---

## 5. 画面・UI 仕様

### 5.1 追加ボタン

実装: [ButtonAddTrial.jsx](src/components/molecules/ButtonAddTrial.jsx)（[Trials.jsx](src/components/organisms/Trials.jsx) 内に配置）

| 項目 | 内容 |
|------|------|
| 配置 | 「試したこと」一覧の末尾、中央寄せ |
| ラベル | `＋ 試したこと`（`MdAdd` アイコン＋テキスト） |
| スタイル | primary / 角丸（`is-rounded`）/ 太字 |

### 5.2 削除ボタンと確認モーダル

実装: [ButtonRemoveTrial.jsx](src/components/molecules/ButtonRemoveTrial.jsx)

| 項目 | 内容 |
|------|------|
| 配置 | 各 Trial（box）のヘッダー右側 |
| ラベル | `削除`（`MdDelete` アイコン＋テキスト）/ small サイズ |
| 確認モーダル タイトル | `試したこと そのN`（N は表示連番） |
| 確認モーダル 本文 | `削除してもよろしいですか？` |
| 確定ボタン | `削除する` |
| キャンセルボタン | `やめる` |

---

## 6. 振る舞い詳細（データ）

### 6.1 追加時

実装: [Trials.jsx](src/components/organisms/Trials.jsx) `addTrial()`

1. 既存の `trials` 配列の末尾に `{ id: <一意値>, guess: '', operation: '', result: '' }` を追加する。
2. 追加後の配列で状態（`TrialsContext`）を更新する。
3. `localStorage` の `trials` を更新後の配列で上書き保存する。
4. Markdown を再生成する（プレビューに反映）。

- `id` は Trial を一意に識別するキー（採番方式は実装に従う／重複しない値）。

### 6.2 削除時

実装: [ButtonRemoveTrial.jsx](src/components/molecules/ButtonRemoveTrial.jsx) `removeTrial(id)`

1. `trials` 配列から、対象の `id` を持つ Trial を除外する（`id` 一致で `filter`）。
2. 除外後の配列で状態（`TrialsContext`）を更新する。
3. `localStorage` の `trials` を更新後の配列で上書き保存する。
4. Markdown を再生成する（プレビューに反映）。

### 6.3 リセット時

実装: [ButtonReset.jsx](src/components/molecules/ButtonReset.jsx) `resetAll()`

1. `trials` を `[{ id: <一意値>, guess: '', operation: '', result: '' }]`（空の Trial 1件）に置き換える。
2. 状態（`TrialsContext`）と `localStorage` の `trials` を更新する。

- 追加されていた Trial はすべて取り除かれ、空の Trial が1件だけ残る。

### 6.4 Markdown への反映

Trial の件数・順序は、生成される Markdown の「# 試したこと」配下の
「## その1」「## その2」…に対応する（[SPEC.md 6.2](SPEC.md) 参照）。
追加・削除の結果はプレビューおよびエクスポート内容に即時反映される。
