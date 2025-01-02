/*
  # ユーザー同期の実装

  1. 新規テーブル
    - `users`: auth.usersの情報を同期するテーブル
      - `id` (uuid, primary key): auth.usersのid
      - `email` (text): メールアドレス
      - `full_name` (text): フルネーム
      - `avatar_url` (text): アバターURL
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. 機能
    - auth.usersの変更を自動的にpublic.usersに同期
    - 新規ユーザー作成時の自動同期
    - ユーザー更新時の自動同期

  3. セキュリティ
    - RLSポリシーの設定
    - ユーザーは自分の情報のみ更新可能
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own record"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Function to handle user sync
CREATE OR REPLACE FUNCTION handle_user_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url'
    );
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.users
    SET
      email = NEW.email,
      full_name = NEW.raw_user_meta_data->>'full_name',
      avatar_url = NEW.raw_user_meta_data->>'avatar_url',
      updated_at = now()
    WHERE id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    -- CASCADEが設定されているため、明示的な削除は不要
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for user sync
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_sync();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_sync();

-- Function to update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert existing users
INSERT INTO public.users (id, email, full_name, avatar_url)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users ON CONFLICT (id) DO NOTHING;