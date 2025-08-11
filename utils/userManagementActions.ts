import { toast } from '@/components/ui/use-toast';
import type { UserProfile, NewUser } from '../types';

export const handleSaveUser = async (
  editingUser: UserProfile,
  updateProfile: (id: string, updates: Partial<UserProfile>) => Promise<void>,
  onSuccess: () => void
) => {
  try {
    await updateProfile(editingUser.id, editingUser);
    toast({
      title: "Success",
      description: "User updated successfully",
    });
    onSuccess();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

export const handleCreateUser = async (
  newUser: NewUser,
  updateProfile: (id: string, updates: Partial<UserProfile>) => Promise<void>,
  onSuccess: () => void
) => {
  try {
    // Create user via Supabase Edge Function
    const response = await fetch(`https://ufvingocbzegpgjknzhm.supabase.co/functions/v1/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdmluZ29jYnplZ3BnamtuemhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjQ2MTUsImV4cCI6MjA2Mzk0MDYxNX0.lEUYYYZnZcWtJLdcDk4qUm2M_zL5Xv58N0FheSHgGp0`
      },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user');
    }

    const { user } = await response.json();

    // Update profile with additional data
    if (user?.id) {
      await updateProfile(user.id, {
        full_name: newUser.full_name,
        username: newUser.username,
        role: newUser.role,
        department: newUser.department,
        phone: newUser.phone,
        location: newUser.location,
        location_id: newUser.location_id,
        status: newUser.status,
        access_level: newUser.access_level,
        bio: newUser.bio,
        employee_id: newUser.employee_id,
      });

      // Handle department assignment if specified
      if (newUser.department) {
        // This would require additional logic to assign department/role combinations
        // For now, we'll just log it
        console.log('Department assignment needed for user:', user.id, 'department:', newUser.department);
      }
    }

    toast({
      title: "Success",
      description: "User created successfully",
    });
    
    onSuccess();
  } catch (error: any) {
    console.error('Error creating user:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to create user",
      variant: "destructive",
    });
  }
};

export const handleDeleteUser = async (userId: string) => {
  try {
    const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!confirmed) return;

    const response = await fetch(`https://ufvingocbzegpgjknzhm.supabase.co/rest/v1/profiles?id=eq.${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdmluZ29jYnplZ3BnamtuemhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjQ2MTUsImV4cCI6MjA2Mzk0MDYxNX0.lEUYYYZnZcWtJLdcDk4qUm2M_zL5Xv58N0FheSHgGp0',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdmluZ29jYnplZ3BnamtuemhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjQ2MTUsImV4cCI6MjA2Mzk0MDYxNX0.lEUYYYZnZcWtJLdcDk4qUm2M_zL5Xv58N0FheSHgGp0`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete user",
      variant: "destructive",
    });
  }
};