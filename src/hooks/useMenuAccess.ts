import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import type { MenuItem } from '../types/menu';

const DEFAULT_MENUS = [
  { id: '1', name: '取引先', path: '/accounts', icon: 'Building2', order: 10 },
  { id: '2', name: '案件', path: '/projects', icon: 'Briefcase', order: 20 },
  { id: '3', name: '見積', path: '/quotations', icon: 'FileText', order: 25 },
  { id: '4', name: '仕入先', path: '/suppliers', icon: 'Truck', order: 30 },
  { id: '5', name: 'プロジェクトコード', path: '/project-codes', icon: 'Tag', order: 40 },
  { id: '6', name: 'タスク', path: '/tasks', icon: 'CheckSquare', order: 50 }
];

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useMenuAccess() {
  const [loading, setLoading] = useState(true);
  const [accessibleMenus, setAccessibleMenus] = useState<MenuItem[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMenuAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setAccessibleMenus([]);
          setLoading(false);
          return;
        }

        // メニュー情報を取得
        const { data: menus, error: menuError } = await supabase
          .from('menus')
          .select('*')
          .order('order');

        if (menuError) {
          console.warn('Failed to fetch menus, using default menus:', menuError);
          setAccessibleMenus(DEFAULT_MENUS);
          setLoading(false);
          return;
        }

        // ユーザーの権限を取得
        const { data: userRoles, error: roleError } = await supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', user.id);

        if (roleError) {
          console.warn('Failed to fetch user roles, using default menus:', roleError);
          setAccessibleMenus(menus || DEFAULT_MENUS);
          setLoading(false);
          return;
        }

        if (!userRoles?.length) {
          setAccessibleMenus(menus || DEFAULT_MENUS);
          setLoading(false);
          return;
        }

        const roleIds = userRoles.map(ur => ur.role_id);

        // 権限に基づいてアクセス可能なメニューを取得
        const { data: permissions, error: permError } = await supabase
          .from('menu_permissions')
          .select('menu_id')
          .in('role_id', roleIds)
          .eq('can_view', true);

        if (permError) {
          console.warn('Failed to fetch menu permissions, using default menus:', permError);
          setAccessibleMenus(menus || DEFAULT_MENUS);
          setLoading(false);
          return;
        }

        if (!permissions?.length) {
          setAccessibleMenus(menus || DEFAULT_MENUS);
          setLoading(false);
          return;
        }

        const menuIds = permissions.map(p => p.menu_id);
        const accessibleMenus = menus?.filter(menu => menuIds.includes(menu.id)) || DEFAULT_MENUS;

        setAccessibleMenus(accessibleMenus);
        setLoading(false);
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Failed to fetch menu access:', error);
        
        // Retry logic
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff
        } else {
          // After max retries, fall back to default menus
          console.warn('Max retries reached, using default menus');
          setAccessibleMenus(DEFAULT_MENUS);
          setLoading(false);
        }
      }
    };

    if (loading || retryCount > 0) {
      fetchMenuAccess();
    }
  }, [loading, retryCount]);

  return { accessibleMenus, loading };
}