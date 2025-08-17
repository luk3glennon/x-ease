import { 
  Save, 
  Users, 
  MessageSquare, 
  Settings as SettingsIcon,
  Building,
  Bell,
  Database,
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

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your pharmacy system configuration</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">
            <MessageSquare className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="stock">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Stock Settings
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="system">
            <Building className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* SMS/Email Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
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
                    placeholder="Your prescription {medication} is ready for pickup at {pharmacy_name}. Please collect within 7 days."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available variables: {"{patient_name}, {medication}, {pharmacy_name}, {pickup_deadline}"}
                  </p>
                </div>
                <div>
                  <Label htmlFor="ready-email">Email Template</Label>
                  <Textarea 
                    id="ready-email"
                    placeholder="Dear {patient_name}, your prescription for {medication} is ready for pickup..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <Button className="bg-primary hover:bg-primary-hover text-white">
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
                    placeholder="Reminder: Your prescription {medication} is still waiting for pickup at {pharmacy_name}."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="overdue-email">Email Template</Label>
                  <Textarea 
                    id="overdue-email"
                    placeholder="Dear {patient_name}, this is a friendly reminder that your prescription..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <Button className="bg-primary hover:bg-primary-hover text-white">
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
                    placeholder="Good news! Your special order {item_name} has arrived at {pharmacy_name}."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="arrival-email">Email Template</Label>
                  <Textarea 
                    id="arrival-email"
                    placeholder="Dear {customer_name}, we're pleased to inform you that your special order..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <Button className="bg-primary hover:bg-primary-hover text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stock Settings */}
        <TabsContent value="stock" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prescription-threshold">Prescription Medications</Label>
                    <Input 
                      id="prescription-threshold"
                      type="number"
                      placeholder="50"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="otc-threshold">Over-the-Counter</Label>
                    <Input 
                      id="otc-threshold"
                      type="number"
                      placeholder="100"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medical-devices">Medical Devices</Label>
                    <Input 
                      id="medical-devices"
                      type="number"
                      placeholder="10"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vitamins-threshold">Vitamins & Supplements</Label>
                    <Input 
                      id="vitamins-threshold"
                      type="number"
                      placeholder="75"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary-hover text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Thresholds
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automatic Reorder Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reorder">Enable Automatic Reorders</Label>
                    <p className="text-sm text-gray-600">Automatically create order suggestions when items reach low stock</p>
                  </div>
                  <Switch id="auto-reorder" />
                </div>
                <div>
                  <Label htmlFor="reorder-multiplier">Reorder Quantity Multiplier</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select multiplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x minimum stock</SelectItem>
                      <SelectItem value="1.5">1.5x minimum stock</SelectItem>
                      <SelectItem value="2">2x minimum stock</SelectItem>
                      <SelectItem value="2.5">2.5x minimum stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-primary hover:bg-primary-hover text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">MedSupply Co</p>
                      <p className="text-sm text-gray-600">(555) 123-4567 • orders@medsupply.com</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">PharmaCorp</p>
                      <p className="text-sm text-gray-600">(555) 987-6543 • contact@pharmacorp.com</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Supplier
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
                  <Button className="bg-primary hover:bg-primary-hover text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                        JD
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-600">john.doe@pharmacy.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        Pharmacist
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                        JS
                      </div>
                      <div>
                        <p className="font-medium">Jane Smith</p>
                        <p className="text-sm text-gray-600">jane.smith@pharmacy.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Technician
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
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
                    <p className="text-sm text-gray-600">Full system access, user management, settings configuration</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Pharmacist</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Standard</span>
                    </div>
                    <p className="text-sm text-gray-600">Prescription management, stock oversight, customer communication</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Technician</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Limited</span>
                    </div>
                    <p className="text-sm text-gray-600">Basic prescription entry, stock updates, order processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                    <Input 
                      id="pharmacy-name"
                      placeholder="MedFlow Pharmacy"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="license-number">License Number</Label>
                    <Input 
                      id="license-number"
                      placeholder="PH123456"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="pharmacy-address">Address</Label>
                    <Textarea 
                      id="pharmacy-address"
                      placeholder="123 Main Street, City, State, ZIP"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pharmacy-phone">Phone Number</Label>
                    <Input 
                      id="pharmacy-phone"
                      placeholder="(555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pharmacy-email">Email</Label>
                    <Input 
                      id="pharmacy-email"
                      type="email"
                      placeholder="info@medflowpharmacy.com"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary-hover text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Information
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-20">
                        <span className="text-sm font-medium">{day}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input placeholder="9:00 AM" className="w-24" />
                        <span>to</span>
                        <Input placeholder="6:00 PM" className="w-24" />
                      </div>
                      <Switch />
                    </div>
                  ))}
                </div>
                <Button className="bg-primary hover:bg-primary-hover text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Hours
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-gray-600">Email notifications when items reach low stock</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Overdue Pickup Reminders</Label>
                      <p className="text-sm text-gray-600">Daily reminder emails for overdue prescriptions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Maintenance Alerts</Label>
                      <p className="text-sm text-gray-600">Notifications about system updates and maintenance</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Data Backup</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Daily Backup</Label>
                    <p className="text-sm text-gray-600">Backup all data daily at 2:00 AM</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label>Last Backup</Label>
                  <p className="text-sm text-gray-600 mt-1">January 15, 2024 at 2:05 AM</p>
                </div>
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Run Backup Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}