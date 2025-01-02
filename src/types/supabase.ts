// Database interfaceに追加
project_activities: {
  Row: {
    id: string;
    project_id: string;
    type: string;
    title: string;
    description: string | null;
    created_at: string;
    created_by: string;
    created_by_user?: {
      email: string;
    } | null;
  };
  Insert: Omit<Database['public']['Tables']['project_activities']['Row'], 'id' | 'created_at' | 'created_by_user'>;
  Update: Partial<Database['public']['Tables']['project_activities']['Insert']>;
};