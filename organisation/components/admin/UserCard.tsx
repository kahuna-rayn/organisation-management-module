import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Mail, Phone, MapPin, Building } from 'lucide-react';
import type { UserProfile } from '../../types';

interface UserCardProps {
  user: UserProfile;
  onEdit?: (user: UserProfile) => void;
  onDelete?: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url} alt={user.full_name} />
              <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">{user.full_name || 'Unknown User'}</h3>
              <p className="text-xs text-muted-foreground">@{user.username || 'no-username'}</p>
              {user.status && (
                <Badge variant={getStatusColor(user.status)} className="text-xs">
                  {user.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
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
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {user.role && (
          <div className="flex items-center space-x-2 text-sm">
            <Badge variant="outline">{user.role}</Badge>
          </div>
        )}
        
        <div className="space-y-2 text-xs text-muted-foreground">
          {user.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.department && (
            <div className="flex items-center space-x-2">
              <Building className="h-3 w-3" />
              <span>{user.department}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span>{user.location}</span>
            </div>
          )}
        </div>

        {(user.total_learning_hours || user.courses_completed || user.compliance_score) && (
          <div className="pt-2 border-t border-muted">
            <div className="grid grid-cols-3 gap-2 text-center">
              {user.total_learning_hours !== undefined && (
                <div>
                  <div className="text-xs font-medium">{user.total_learning_hours}h</div>
                  <div className="text-xs text-muted-foreground">Learning</div>
                </div>
              )}
              {user.courses_completed !== undefined && (
                <div>
                  <div className="text-xs font-medium">{user.courses_completed}</div>
                  <div className="text-xs text-muted-foreground">Courses</div>
                </div>
              )}
              {user.compliance_score !== undefined && (
                <div>
                  <div className="text-xs font-medium">{user.compliance_score}%</div>
                  <div className="text-xs text-muted-foreground">Compliance</div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};