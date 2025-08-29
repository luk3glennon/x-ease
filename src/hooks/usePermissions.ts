import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PermissionHookReturn {
  userRole: 'admin' | 'pharmacist' | 'technician' | null;
  isAdmin: () => boolean;
  isPharmacist: () => boolean;
  isTechnician: () => boolean;
  canDeleteUsers: () => boolean;
  canEditSettings: () => boolean;
  canManageInventory: () => boolean;
  canSendNotifications: () => boolean;
  loading: boolean;
}

export function usePermissions(): PermissionHookReturn {
  const [userRole, setUserRole] = useState<'admin' | 'pharmacist' | 'technician' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole(null);
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
          setUserRole('technician'); // Default to lowest permission
        } else {
          setUserRole(profile?.role || 'technician');
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        setUserRole('technician');
      } finally {
        setLoading(false);
      }
    };

    getCurrentUserRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getCurrentUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = () => userRole === 'admin';
  const isPharmacist = () => userRole === 'pharmacist' || userRole === 'admin';
  const isTechnician = () => userRole === 'technician' || userRole === 'pharmacist' || userRole === 'admin';

  // Specific permission functions
  const canDeleteUsers = () => isAdmin();
  const canEditSettings = () => isAdmin();
  const canManageInventory = () => isPharmacist();
  const canSendNotifications = () => isPharmacist();

  return {
    userRole,
    isAdmin,
    isPharmacist,
    isTechnician,
    canDeleteUsers,
    canEditSettings,
    canManageInventory,
    canSendNotifications,
    loading,
  };
}