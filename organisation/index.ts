// Main exports for the organisation module
export { OrganisationPanel } from './components/OrganisationPanel';
export { OrganisationProvider, useOrganisationContext } from './context/OrganisationContext';

// Component exports
export { UserManagement } from './components/admin/UserManagement';
export { UserList } from './components/admin/UserList';
export { UserCard } from './components/admin/UserCard';
export { UserTable } from './components/admin/UserTable';
export { CreateUserDialog } from './components/admin/CreateUserDialog';
export { EditUserDialog } from './components/admin/EditUserDialog';

// Hook exports
export { useUserManagement } from './hooks/useUserManagement';
export { useUserProfiles } from './hooks/useUserProfiles';

// Type exports
export type {
  OrganisationConfig,
  ThemeConfig,
  PermissionConfig,
  UserProfile,
  NewUser,
  Role,
  Department,
  Location,
  OrgCertificate,
} from './types';

// Utility exports
export { handleSaveUser, handleCreateUser, handleDeleteUser } from './utils/userManagementActions';