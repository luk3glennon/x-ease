import { useState, useEffect } from 'react';
import { 
  Save, 
  Users, 
  MessageSquare, 
  Settings as SettingsIcon,
  Building,
  Bell,
  Trash2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/hooks/useSettings';
import { UserDialog } from '@/components/UserDialog';

export function Settings() {
  const {
    organizationSettings,
    notificationSettings,
    userProfiles,
    loading,
    updateOrganizationSettings,
    updateNotificationSettings,
    addUserProfile,
    updateUserProfile,
    deleteUserProfile,
    isAdmin,
    isPharmacist,
  } = useSettings();

  const [orgForm, setOrgForm] = useState({
    name: '',
    license_number: '',
    address: '',
    phone: '',
    email: '',
  });

  const [notifForm, setNotifForm] = useState({
    sms_enabled: true,
    email_enabled: true,
    ready_pickup_sms_template: '',
    ready_pickup_email_template: '',
    overdue_reminder_sms_template: '',
    overdue_reminder_email_template: '',
    special_order_sms_template: '',
    special_order_email_template: '',
  });

  // Update forms when settings load
  useEffect(() => {
    if (organizationSettings) {
      setOrgForm({
        name: organizationSettings.name || '',
        license_number: organizationSettings.license_number || '',
        address: organizationSettings.address || '',
        phone: organizationSettings.phone || '',
        email: organizationSettings.email || '',
      });
    }
  }, [organizationSettings]);

  useEffect(() => {
    if (notificationSettings) {
      setNotifForm({
        sms_enabled: notificationSettings.sms_enabled,
        email_enabled: notificationSettings.email_enabled,
        ready_pickup_sms_template: notificationSettings.ready_pickup_sms_template || '',
        ready_pickup_email_template: notificationSettings.ready_pickup_email_template || '',
        overdue_reminder_sms_template: notificationSettings.overdue_reminder_sms_template || '',
        overdue_reminder_email_template: notificationSettings.overdue_reminder_email_template || '',
        special_order_sms_template: notificationSettings.special_order_sms_template || '',
        special_order_email_template: notificationSettings.special_order_email_template || '',
      });
    }
  }, [notificationSettings]);

  const handleOrgFormChange = (field: string, value: string) => {
    setOrgForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNotifFormChange = (field: string, value: string | boolean) => {
    setNotifForm(prev => ({ ...prev, [field]: value }));
  };

  const saveOrganizationSettings = () => {
    updateOrganizationSettings(orgForm);
  };

  const saveNotificationSettings = () => {
    updateNotificationSettings(notifForm);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'pharmacist': return 'bg-blue-100 text-blue-800';
      case 'technician': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your pharmacy system configuration</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organization">
            <Building className="h-4 w-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users & Roles
          </TabsTrigger>
        </TabsList>

        {/* Organization Settings */}
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                  <Input 
                    id="pharmacy-name"
                    value={orgForm.name}
                    onChange={(e) => handleOrgFormChange('name', e.target.value)}
                    placeholder="MedFlow Pharmacy"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="license-number">License Number</Label>
                  <Input 
                    id="license-number"
                    value={orgForm.license_number}
                    onChange={(e) => handleOrgFormChange('license_number', e.target.value)}
                    placeholder="PH123456"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="pharmacy-address">Address</Label>
                  <Textarea 
                    id="pharmacy-address"
                    value={orgForm.address}
                    onChange={(e) => handleOrgFormChange('address', e.target.value)}
                    placeholder="123 Main Street, City, State, ZIP"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pharmacy-phone">Phone Number</Label>
                  <Input 
                    id="pharmacy-phone"
                    value={orgForm.phone}
                    onChange={(e) => handleOrgFormChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pharmacy-email">Email</Label>
                  <Input 
                    id="pharmacy-email"
                    type="email"
                    value={orgForm.email}
                    onChange={(e) => handleOrgFormChange('email', e.target.value)}
                    placeholder="info@medflowpharmacy.com"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={saveOrganizationSettings} disabled={!isAdmin()}>
                <Save className="h-4 w-4 mr-2" />
                Save Information
              </Button>
              {!isAdmin() && (
                <p className="text-xs text-muted-foreground">
                  Only administrators can update organization settings
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable SMS notifications for customers</p>
                  </div>
                  <Switch 
                    checked={notifForm.sms_enabled}
                    onCheckedChange={(checked) => handleNotifFormChange('sms_enabled', checked)}
                    disabled={!isPharmacist()}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable email notifications for customers</p>
                  </div>
                  <Switch 
                    checked={notifForm.email_enabled}
                    onCheckedChange={(checked) => handleNotifFormChange('email_enabled', checked)}
                    disabled={!isPharmacist()}
                  />
                </div>
                <Button onClick={saveNotificationSettings} disabled={!isPharmacist()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Ready for Pickup Notification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ready-sms">SMS Template</Label>
                  <Textarea 
                    id="ready-sms"
                    value={notifForm.ready_pickup_sms_template}
                    onChange={(e) => handleNotifFormChange('ready_pickup_sms_template', e.target.value)}
                    placeholder="Your prescription {medication} is ready for pickup at {pharmacy_name}. Please collect within 7 days."
                    className="mt-1"
                    disabled={!isPharmacist()}
                  />
                </div>
                <div>
                  <Label htmlFor="ready-email">Email Template</Label>
                  <Textarea 
                    id="ready-email"
                    value={notifForm.ready_pickup_email_template}
                    onChange={(e) => handleNotifFormChange('ready_pickup_email_template', e.target.value)}
                    placeholder="Dear {patient_name}, your prescription for {medication} is ready for pickup..."
                    className="mt-1"
                    rows={4}
                    disabled={!isPharmacist()}
                  />
                </div>
                <Button onClick={saveNotificationSettings} disabled={!isPharmacist()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Overdue Pickup Reminder</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="overdue-sms">SMS Template</Label>
                  <Textarea 
                    id="overdue-sms"
                    value={notifForm.overdue_reminder_sms_template}
                    onChange={(e) => handleNotifFormChange('overdue_reminder_sms_template', e.target.value)}
                    placeholder="Reminder: Your prescription {medication} is still waiting for pickup at {pharmacy_name}."
                    className="mt-1"
                    disabled={!isPharmacist()}
                  />
                </div>
                <div>
                  <Label htmlFor="overdue-email">Email Template</Label>
                  <Textarea 
                    id="overdue-email"
                    value={notifForm.overdue_reminder_email_template}
                    onChange={(e) => handleNotifFormChange('overdue_reminder_email_template', e.target.value)}
                    placeholder="Dear {patient_name}, this is a friendly reminder that your prescription..."
                    className="mt-1"
                    rows={4}
                    disabled={!isPharmacist()}
                  />
                </div>
                <Button onClick={saveNotificationSettings} disabled={!isPharmacist()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Special Order Arrival</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="arrival-sms">SMS Template</Label>
                  <Textarea 
                    id="arrival-sms"
                    value={notifForm.special_order_sms_template}
                    onChange={(e) => handleNotifFormChange('special_order_sms_template', e.target.value)}
                    placeholder="Good news! Your special order {item_name} has arrived at {pharmacy_name}."
                    className="mt-1"
                    disabled={!isPharmacist()}
                  />
                </div>
                <div>
                  <Label htmlFor="arrival-email">Email Template</Label>
                  <Textarea 
                    id="arrival-email"
                    value={notifForm.special_order_email_template}
                    onChange={(e) => handleNotifFormChange('special_order_email_template', e.target.value)}
                    placeholder="Dear {customer_name}, we're pleased to inform you that your special order..."
                    className="mt-1"
                    rows={4}
                    disabled={!isPharmacist()}
                  />
                </div>
                <Button onClick={saveNotificationSettings} disabled={!isPharmacist()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Staff Accounts</span>
                  <UserDialog 
                    onSave={addUserProfile}
                    isAdmin={isAdmin()}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userProfiles.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                          {getInitials(user.first_name, user.last_name)}
                        </div>
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        <UserDialog 
                          user={user}
                          onSave={addUserProfile}
                          onUpdate={updateUserProfile}
                          isAdmin={isAdmin()}
                        />
                        {isAdmin() && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteUserProfile(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {userProfiles.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No users found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permission Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Administrator</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Full Access</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Full system access, user management, settings configuration</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Pharmacist</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Standard</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Prescription management, stock oversight, customer communication</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Technician</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Limited</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Basic prescription entry, stock updates, order processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}