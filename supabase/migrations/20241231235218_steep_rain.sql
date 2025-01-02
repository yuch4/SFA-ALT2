-- Function to assign default role to new users
CREATE OR REPLACE FUNCTION handle_new_user_role()
RETURNS TRIGGER AS $$
DECLARE
  default_role_id uuid;
BEGIN
  -- Get the default user role ID
  SELECT id INTO default_role_id
  FROM roles
  WHERE name = 'user'
  LIMIT 1;

  -- Assign default role to the new user
  IF default_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id)
    VALUES (NEW.id, default_role_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic role assignment
DROP TRIGGER IF EXISTS on_user_created_assign_role ON public.users;
CREATE TRIGGER on_user_created_assign_role
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_role();