import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrganizationSettings {
  id: string;
  pharmacy_id: string;
  name: string;
  license_number?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface NotificationSettings {
  id: string;
  pharmacy_id: string;
  sms_enabled: boolean;
  email_enabled: boolean;
  ready_pickup_sms_template: string;
  ready_pickup_email_template: string;
  overdue_reminder_sms_template: string;
  overdue_reminder_email_template: string;
  special_order_sms_template: string;
  special_order_email_template: string;
}

export interface UserProfile {
  id: string;
  user_id?: string;
  pharmacy_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role: 'admin' | 'pharmacist' | 'technician';
  created_at: string;
}

export function useSettings() {
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>('technician');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrganizationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setOrganizationSettings(data);
    } catch (error) {
      console.error('Error fetching organization settings:', error);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setNotificationSettings(data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const fetchUserProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setUserProfiles(data || []);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  };

  const updateOrganizationSettings = async (updates: Partial<OrganizationSettings>) => {
    try {
      if (!organizationSettings) {
        const { data, error } = await supabase
          .from('organization_settings')
          .insert([updates])
          .select()
          .single();

        if (error) throw error;
        setOrganizationSettings(data);
      } else {
        const { data, error } = await supabase
          .from('organization_settings')
          .update(updates)
          .eq('id', organizationSettings.id)
          .select()
          .single();

        if (error) throw error;
        setOrganizationSettings(data);
      }

      toast({
        title: "Settings Updated",
        description: "Organization settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating organization settings:', error);
      toast({
        title: "Error",
        description: "Failed to update organization settings.",
        variant: "destructive",
      });
    }
  };

  const updateNotificationSettings = async (updates: Partial<NotificationSettings>) => {
    try {
      if (!notificationSettings) {
        const { data, error } = await supabase
          .from('notification_settings')
          .insert([updates])
          .select()
          .single();

        if (error) throw error;
        setNotificationSettings(data);
      } else {
        const { data, error } = await supabase
          .from('notification_settings')
          .update(updates)
          .eq('id', notificationSettings.id)
          .select()
          .single();

        if (error) throw error;
        setNotificationSettings(data);
      }

      toast({
        title: "Settings Updated",
        description: "Notification settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    }
  };

  const addUserProfile = async (userData: Omit<UserProfile, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      setUserProfiles(prev => [...prev, data]);
      toast({
        title: "User Added",
        description: "New user has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding user profile:', error);
      toast({
        title: "Error",
        description: "Failed to add user profile.",
        variant: "destructive",
      });
    }
  };

  const updateUserProfile = async (id: string, updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setUserProfiles(prev => prev.map(user => user.id === id ? data : user));
      toast({
        title: "User Updated",
        description: "User profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast({
        title: "Error",
        description: "Failed to update user profile.",
        variant: "destructive",
      });
    }
  };

  const deleteUserProfile = async (id: string) => {
    if (currentUserRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only administrators can delete users.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUserProfiles(prev => prev.filter(user => user.id !== id));
      toast({
        title: "User Deleted",
        description: "User profile has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting user profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete user profile.",
        variant: "destructive",
      });
    }
  };

  const isAdmin = () => currentUserRole === 'admin';
  const isPharmacist = () => currentUserRole === 'pharmacist' || currentUserRole === 'admin';

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      await Promise.all([
        fetchOrganizationSettings(),
        fetchNotificationSettings(),
        fetchUserProfiles(),
      ]);
      setLoading(false);
    };

    loadSettings();
  }, []);

  return {
    organizationSettings,
    notificationSettings,
    userProfiles,
    currentUserRole,
    loading,
    updateOrganizationSettings,
    updateNotificationSettings,
    addUserProfile,
    updateUserProfile,
    deleteUserProfile,
    isAdmin,
    isPharmacist,
  };
}