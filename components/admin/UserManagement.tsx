import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List } from 'lucide-react';
import { useOrganisationContext } from '../../context/OrganisationContext';
import { useUserProfiles } from '../../hooks/useUserProfiles';
import { useUserManagement } from '../../hooks/useUserManagement';
import { useViewPreference } from '@/hooks/useViewPreference';
import { handleSaveUser, handleCreateUser, handleDeleteUser } from '../../utils/userManagementActions';
import { UserList } from './UserList';
import { UserTable } from './UserTable';
import { CreateUserDialog } from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';

const UserManagement: React.FC = () => {
  const { hasPermission, onUserAction } = useOrganisationContext();
  const { profiles, loading, updateProfile } = useUserProfiles();
  const [viewMode, setViewMode] = useViewPreference('userManagement', 'cards');
  const {
    editingUser,
    setEditingUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    newUser,
    setNewUser,
    openEditDialog,
    closeEditDialog,
    resetNewUser
  } = useUserManagement();

  const onSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    await handleSaveUser(editingUser, async (id, updates) => {
      await updateProfile(id, updates);
    }, () => {
      closeEditDialog();
      onUserAction?.('user_updated', editingUser);
    });
  };

  const onCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsCreateDialogOpen(false);
    resetNewUser();
    
    await handleCreateUser(newUser, async (id, updates) => {
      await updateProfile(id, updates);
    }, () => {
      onUserAction?.('user_created', newUser);
    });
  };

  const onDeleteUser = async (userId: string) => {
    if (!hasPermission('canDeleteUsers')) return;
    
    await handleDeleteUser(userId);
    onUserAction?.('user_deleted', { userId });
  };

  const onUpdateProfile = async (id: string, updates: any) => {
    const result = await updateProfile(id, updates);
    if (result.success) {
      onUserAction?.('user_updated', { id, updates });
    }
    return result;
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="flex items-center gap-4">
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as 'cards' | 'list')}
          >
            <ToggleGroupItem value="cards" aria-label="Card view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          {hasPermission('canCreateUsers') && (
            <CreateUserDialog
              isOpen={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              newUser={newUser}
              onUserChange={setNewUser}
              onSubmit={onCreateUser}
            />
          )}
        </div>
      </div>

      {viewMode === 'cards' ? (
        <UserList
          profiles={profiles}
          onEdit={hasPermission('canEditUsers') ? openEditDialog : undefined}
          onDelete={hasPermission('canDeleteUsers') ? onDeleteUser : undefined}
        />
      ) : (
        <UserTable
          profiles={profiles}
          onEdit={hasPermission('canEditUsers') ? openEditDialog : undefined}
          onDelete={hasPermission('canDeleteUsers') ? onDeleteUser : undefined}
          onUpdate={hasPermission('canEditUsers') ? onUpdateProfile : undefined}
        />
      )}

      {hasPermission('canEditUsers') && (
        <EditUserDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingUser={editingUser}
          onUserChange={setEditingUser}
          onSubmit={onSaveUser}
        />
      )}
    </div>
  );
};
export default UserManagement;