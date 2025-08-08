import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2 } from 'lucide-react';
import type { UserProfile } from '../../types';

interface UserTableProps {
  profiles: UserProfile[];
  onEdit?: (user: UserProfile) => void;
  onDelete?: (userId: string) => void;
  onUpdate?: (id: string, updates: any) => Promise<{ success: boolean; error?: string }>;
}

export const UserTable: React.FC<UserTableProps> = ({ profiles, onEdit, onDelete, onUpdate }) => {
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Learning Hours</TableHead>
            <TableHead>Compliance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} alt={user.full_name} />
                    <AvatarFallback className="text-xs">{getInitials(user.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.full_name || 'Unknown User'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {user.role && <Badge variant="outline">{user.role}</Badge>}
              </TableCell>
              <TableCell>{user.department || '-'}</TableCell>
              <TableCell>{user.location || '-'}</TableCell>
              <TableCell>
                {user.status && (
                  <Badge variant={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{user.total_learning_hours || 0}h</TableCell>
              <TableCell>{user.compliance_score || 0}%</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {profiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
};