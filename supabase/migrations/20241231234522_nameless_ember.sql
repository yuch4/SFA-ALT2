/*
  # 既存ユーザーの同期

  1. 機能
    - 既存のauth.usersのデータをpublic.usersに同期
    - 重複を防ぐためにUPSERT処理を使用
*/

-- 既存ユーザーの同期（重複を避けるためON CONFLICT使用）
INSERT INTO public.users (id, email, full_name, avatar_url)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = now();