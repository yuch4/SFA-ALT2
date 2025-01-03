
# SFA-ALT2

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/yuch4/SFA-ALT2)

## 概要
SFA-ALT2は、営業活動を効率化するためのモダンなSFA（Sales Force Automation）アプリケーションです。
取引先管理から案件管理、見積・発注の承認フローまでをシームレスに統合し、営業プロセス全体をデジタル化します。

## 主要機能
- ダッシュボード：重要な指標と活動の可視化
  - 案件数
  - 承認待ち見積数
  - 承認待ち発注数
  - 未完了タスク数
  - 最近の活動タイムライン
- 取引先管理：顧客情報の一元管理
- 案件管理：商談の進捗管理
- 見積管理：承認フローと履歴管理
- 発注管理：承認フローと履歴管理
- タスク管理：営業活動のタスク管理
- ユーザー管理：権限に基づくアクセス制御

## 技術スタック
- フロントエンド
  - React 18.3.1
  - TypeScript
  - Vite
  - TailwindCSS 3.4.1
- バックエンド
  - Supabase
  - PostgreSQL

## 開発環境のセットアップ
1. リポジトリのクローン
```bash
git clone [repository-url]
cd SFA-ALT2
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
`.env`ファイルを作成し、必要な環境変数を設定

4. 開発サーバーの起動
```bash
npm run dev
```

## プロジェクト構造
詳細な構造は[ディレクトリ構造](docs/directory-structure.md)を参照してください。

## 技術詳細
詳細な技術スタックについては[技術スタック](docs/tech-stack.md)を参照してください。

## ドキュメント更新
ソースコードの変更時は[README更新ワークフロー](README_UPDATE_WORKFLOW.md)に従ってドキュメントを更新してください。