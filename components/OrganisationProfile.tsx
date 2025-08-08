import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, Mail, Phone, MapPin, Globe, Edit3, Save, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useOrganisationContext } from '../context/OrganisationContext';

interface OrganisationData {
  id?: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo_url: string;
  created_at?: string;
  updated_at?: string;
}

export const OrganisationProfile: React.FC = () => {
  const { supabaseClient, hasPermission } = useOrganisationContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orgData, setOrgData] = useState<OrganisationData>({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logo_url: '',
  });

  const fetchOrganisationProfile = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabaseClient
        .from('organisation_profile')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setOrgData(data);
      }
    } catch (err: any) {
      console.error('Error fetching organisation profile:', err);
      toast({
        title: "Error",
        description: "Failed to load organisation profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveOrganisationProfile = async () => {
    try {
      setSaving(true);

      if (orgData.id) {
        // Update existing profile
        const { error } = await supabaseClient
          .from('organisation_profile')
          .update({
            name: orgData.name,
            description: orgData.description,
            email: orgData.email,
            phone: orgData.phone,
            address: orgData.address,
            website: orgData.website,
            logo_url: orgData.logo_url,
          })
          .eq('id', orgData.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { data, error } = await supabaseClient
          .from('organisation_profile')
          .insert([{
            name: orgData.name,
            description: orgData.description,
            email: orgData.email,
            phone: orgData.phone,
            address: orgData.address,
            website: orgData.website,
            logo_url: orgData.logo_url,
          }])
          .select()
          .single();

        if (error) throw error;
        setOrgData(data);
      }

      toast({
        title: "Success",
        description: "Organisation profile updated successfully",
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving organisation profile:', err);
      toast({
        title: "Error",
        description: "Failed to save organisation profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchOrganisationProfile(); // Reset to original data
  };

  const updateField = (field: keyof OrganisationData, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchOrganisationProfile();
  }, [supabaseClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organisation Profile
              </CardTitle>
              <CardDescription>
                Manage your organisation's public information and settings
              </CardDescription>
            </div>
            {hasPermission('canManageProfile') && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} disabled={saving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={saveOrganisationProfile} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo and Basic Info */}
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={orgData.logo_url} alt={orgData.name} />
              <AvatarFallback className="text-lg">
                {orgData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'ORG'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organisation Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={orgData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Enter organisation name"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{orgData.name || 'Not set'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  {isEditing ? (
                    <Input
                      id="logo_url"
                      value={orgData.logo_url}
                      onChange={(e) => updateField('logo_url', e.target.value)}
                      placeholder="Enter logo URL"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {orgData.logo_url || 'No logo set'}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={orgData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Enter organisation description"
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {orgData.description || 'No description available'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={orgData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                ) : (
                  <p className="text-sm">{orgData.email || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={orgData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-sm">{orgData.phone || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </Label>
                {isEditing ? (
                  <Input
                    id="website"
                    value={orgData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="Enter website URL"
                  />
                ) : (
                  <p className="text-sm">
                    {orgData.website ? (
                      <a 
                        href={orgData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {orgData.website}
                      </a>
                    ) : (
                      'Not set'
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={orgData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Enter full address"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-line">
                    {orgData.address || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {orgData.created_at && (
            <div className="pt-4 border-t border-muted">
              <p className="text-xs text-muted-foreground">
                Profile created on {new Date(orgData.created_at).toLocaleDateString()}
                {orgData.updated_at && orgData.updated_at !== orgData.created_at && (
                  <> • Last updated on {new Date(orgData.updated_at).toLocaleDateString()}</>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};