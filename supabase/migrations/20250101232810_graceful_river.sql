-- Fix RLS policies for project activities view
DROP VIEW IF EXISTS project_activities_with_users;

CREATE VIEW project_activities_with_users AS
SELECT 
  pa.*,
  u.email as created_by_email
FROM project_activities pa
LEFT JOIN users u ON u.id = pa.created_by;

-- Re-grant access to the view
GRANT SELECT ON project_activities_with_users TO authenticated;

-- Fix RLS policies for remaining tables
ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create unified RLS policies for all tables
CREATE POLICY "Enable read access for authenticated users" ON suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON suppliers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON suppliers FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON project_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON project_codes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON project_codes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON project_codes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON tasks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON project_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable write access for authenticated users" ON project_activities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON project_activities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON project_activities FOR DELETE TO authenticated USING (true);