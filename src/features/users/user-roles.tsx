import React, { useState } from 'react';
import { Shield, Plus, X } from 'lucide-react';
import { Button } from '../../components/button';
import { Modal } from '../../components/modal';
import { Select } from '../../components/form';
import { useData } from '../../hooks/useData';
import { rolesApi, type Role } from '../../api/roles';

interface UserRolesProps {
  userId: string;
  userEmail: string;
}

export const UserRoles: React.FC<UserRolesProps> = ({ userId, userEmail }) => {
  const [isAddingRole, setIsAddingRole] = useState(false);
  const { data: roles } = useData<Role[]>({ fetchFn: rolesApi.getAll });
  const { 
    data: userRoles,
    loading,
    error,
    refetch: refetchUserRoles
  } = useData({
    fetchFn: () => rolesApi.getUserRoles(userId),
    dependencies: [userId]
  });

  const handleAddRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roleId = formData.get('roleId') as string;

    try {
      await rolesApi.assignRole(userId, roleId);
      await refetchUserRoles();
      setIsAddingRole(false);
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      await rolesApi.removeRole(userId, roleId);
      await refetchUserRoles();
    } catch (error) {
      console.error('Failed to remove role:', error);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  const assignedRoleIds = userRoles?.map(ur => ur.role_id) || [];
  const availableRoles = roles?.filter(role => !assignedRoleIds.includes(role.id)) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">ユーザー権限</h2>
        <Button
          size="sm"
          onClick={() => setIsAddingRole(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          権限を追加
        </Button>
      </div>

      <div className="space-y-2">
        {userRoles?.map((userRole) => (
          <div
            key={userRole.role_id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">
                {userRole.roles.name}
              </span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleRemoveRole(userRole.role_id)}
              icon={<X className="w-4 h-4" />}
            >
              削除
            </Button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddingRole}
        onClose={() => setIsAddingRole(false)}
        title={`${userEmail} に権限を追加`}
      >
        <form onSubmit={handleAddRole}>
          <div className="space-y-4">
            <Select
              name="roleId"
              options={availableRoles.map(role => ({
                value: role.id,
                label: role.name
              }))}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAddingRole(false)}
              >
                キャンセル
              </Button>
              <Button type="submit">
                追加
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};