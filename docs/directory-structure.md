# ディレクトリ構造

```
/home/project/
├── docs/                    # プロジェクトドキュメント
├── public/                  # 静的ファイル
├── src/                     # ソースコード
│   ├── api/                 # APIクライアント
│   │   ├── approval-flows/  # 承認フロー関連
│   │   │   ├── actions.ts   # 承認アクション
│   │   │   ├── approval-history.ts # 承認履歴
│   │   │   ├── client.ts    # メインクライアント
│   │   │   ├── status.ts    # ステータス管理
│   │   │   └── types.ts     # 型定義
│   │   ├── quotations/      # 見積関連
│   │   ├── purchase-orders/ # 発注関連
│   │   └── supabase.ts     # Supabase設定
│   ├── components/          # 共通コンポーネント
│   │   ├── activity-timeline.tsx # 活動タイムライン
│   │   ├── button.tsx      # ボタン
│   │   ├── form.tsx        # フォーム
│   │   ├── header.tsx      # ヘッダー
│   │   ├── modal.tsx       # モーダル
│   │   ├── sidebar.tsx     # サイドバー
│   │   └── table.tsx       # テーブル
│   ├── features/           # 機能モジュール
│   │   ├── accounts/       # 取引先管理
│   │   ├── approval-flows/ # 承認フロー管理
│   │   ├── auth/          # 認証
│   │   ├── projects/      # 案件管理
│   │   ├── purchase-orders/# 発注管理
│   │   ├── quotations/    # 見積管理
│   │   ├── suppliers/     # 仕入先管理
│   │   ├── tasks/         # タスク管理
│   │   └── users/         # ユーザー管理
│   ├── hooks/              # カスタムフック
│   │   ├── useAuth.ts     # 認証フック
│   │   ├── useData.ts     # データ取得フック
│   │   └── useMenuAccess.ts # メニューアクセス制御
│   ├── layouts/            # レイアウト
│   │   └── main-layout.tsx # メインレイアウト
│   ├── types/              # 型定義
│   │   ├── menu.ts        # メニュー型定義
│   │   └── supabase.ts    # Supabase型定義
│   ├── utils/              # ユーティリティ
│   │   └── date.ts        # 日付ユーティリティ
│   ├── App.tsx            # アプリケーションルート
│   └── main.tsx           # エントリーポイント
├── supabase/               # Supabase設定
│   └── migrations/         # データベースマイグレーション
├── .env                    # 環境変数
├── package.json           # 依存関係
├── tailwind.config.js     # Tailwind設定
├── tsconfig.json         # TypeScript設定
└── vite.config.ts        # Vite設定
```

## 主要なディレクトリの説明

### src/api/
APIクライアントとデータアクセス層。機能ごとにモジュール化され、Supabaseとの通信を担当。

### src/components/
再利用可能なUIコンポーネント。各コンポーネントは単一の責任を持ち、props経由で必要なデータを受け取る。

### src/features/
機能ごとにモジュール化されたコンポーネントとロジック。各機能は以下を含む：
- 一覧表示 (*-list.tsx)
- 詳細表示 (*-detail.tsx)
- 作成/編集フォーム
- 機能固有のコンポーネント

### src/hooks/
再利用可能なロジックをカスタムフックとして実装：
- useAuth: 認証状態管理
- useData: データフェッチング
- useMenuAccess: メニューアクセス制御

### src/layouts/
ページレイアウトを定義：
- ヘッダー
- サイドバー
- メインコンテンツ領域

### src/types/
TypeScript型定義：
- Supabaseデータベース型
- コンポーネントprops型
- APIレスポンス型