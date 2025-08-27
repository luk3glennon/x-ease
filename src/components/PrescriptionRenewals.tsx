import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Pill,
  Eye,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PrescriptionDialog } from './PrescriptionDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PrescriptionRenewal {
  id: string;
  pharmacy_id: string;
  patient_name: string;
  patient_phone: string | null;
  medication: string;
  dosage: string;
  quantity: number;
  prescriber: string;
  status: string;
  date_created: string;
  renewed_at: string | null;
  renewal_due_date: string | null;
}

interface ReminderEvent {
  id: string;
  prescription_id: string;
  reminder_type: string;
  channel: string;
  sent_at: string;
  sent_by: string | null;
  notes: string | null;
}

export function PrescriptionRenewals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('due-soon');
  const [prescriptions, setPrescriptions] = useState<PrescriptionRenewal[]>([]);
  const [reminders, setReminders] = useState<ReminderEvent[]>([]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch prescriptions and reminders from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')
        .order('date_created', { ascending: false });

      if (prescriptionsError) throw prescriptionsError;

      // Fetch reminder events
      const { data: remindersData, error: remindersError } = await supabase
        .from('reminder_events')
        .select('*')
        .order('sent_at', { ascending: false });

      if (remindersError) throw remindersError;

      setPrescriptions(prescriptionsData || []);
      setReminders(remindersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prescription data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate renewal categories
  const getDaysUntilRenewal = (renewalDate: string | null) => {
    if (!renewalDate) return null;
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const categorizedPrescriptions = {
    'due-soon': prescriptions.filter(p => {
      if (p.renewed_at || !p.renewal_due_date) return false;
      const days = getDaysUntilRenewal(p.renewal_due_date);
      return days !== null && days <= 7 && days >= 0;
    }),
    'overdue': prescriptions.filter(p => {
      if (p.renewed_at || !p.renewal_due_date) return false;
      const days = getDaysUntilRenewal(p.renewal_due_date);
      return days !== null && days < 0;
    }),
    'completed': prescriptions.filter(p => p.renewed_at !== null)
  };

  // Filter prescriptions based on search
  const getFilteredPrescriptions = (category: keyof typeof categorizedPrescriptions) => {
    return categorizedPrescriptions[category].filter(prescription => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        prescription.patient_name.toLowerCase().includes(query) ||
        prescription.medication.toLowerCase().includes(query) ||
        prescription.id.toLowerCase().includes(query)
      );
    });
  };

  // Handle reminder sending
  const sendReminderAction = async (prescriptionId: string, channel: 'email' | 'sms') => {
    try {
      const { error } = await supabase
        .from('reminder_events')
        .insert({
          prescription_id: prescriptionId,
          reminder_type: 'renewal_reminder',
          channel: channel,
          sent_by: 'current_user', // In a real app, this would be the logged-in user
          notes: `Renewal reminder sent via ${channel}`
        });

      if (error) throw error;

      toast({
        title: "Reminder Sent",
        description: `${channel.toUpperCase()} reminder sent successfully.`,
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error",
        description: `Failed to send ${channel} reminder.`,
        variant: "destructive",
      });
    }
  };

  // Handle marking as renewed
  const markAsRenewed = async (prescriptionId: string) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({ renewed_at: new Date().toISOString() })
        .eq('id', prescriptionId);

      if (error) throw error;

      toast({
        title: "Prescription Renewed",
        description: "Prescription marked as renewed successfully.",
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error marking as renewed:', error);
      toast({
        title: "Error",
        description: "Failed to mark prescription as renewed.",
        variant: "destructive",
      });
    }
  };

  // Handle bulk reminders
  const sendBulkReminders = async (channel: 'email' | 'sms') => {
    try {
      const reminderData = selectedPrescriptions.map(prescriptionId => ({
        prescription_id: prescriptionId,
        reminder_type: 'renewal_reminder',
        channel: channel,
        sent_by: 'current_user',
        notes: `Bulk renewal reminder sent via ${channel}`
      }));

      const { error } = await supabase
        .from('reminder_events')
        .insert(reminderData);

      if (error) throw error;

      toast({
        title: "Bulk Reminders Sent",
        description: `${selectedPrescriptions.length} ${channel.toUpperCase()} reminders sent successfully.`,
      });

      setSelectedPrescriptions([]);
      fetchData();
    } catch (error) {
      console.error('Error sending bulk reminders:', error);
      toast({
        title: "Error",
        description: `Failed to send bulk ${channel} reminders.`,
        variant: "destructive",
      });
    }
  };

  // Get reminder history for a prescription
  const getReminderHistory = (prescriptionId: string) => {
    return reminders.filter(r => r.prescription_id === prescriptionId);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Get badge for days until renewal
  const getDaysBadge = (renewalDate: string | null) => {
    if (!renewalDate) return null;
    const days = getDaysUntilRenewal(renewalDate);
    if (days === null) return null;

    if (days < 0) {
      return <Badge variant="destructive">{Math.abs(days)} days overdue</Badge>;
    } else if (days <= 3) {
      return <Badge className="bg-amber-100 text-amber-800">{days} days left</Badge>;
    } else {
      return <Badge variant="outline">{days} days left</Badge>;
    }
  };

  const renderPrescriptionTable = (prescriptionList: PrescriptionRenewal[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          {activeTab !== 'completed' && (
            <TableHead className="w-12">
              <Checkbox
                checked={selectedPrescriptions.length === prescriptionList.length && prescriptionList.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPrescriptions(prescriptionList.map(p => p.id));
                  } else {
                    setSelectedPrescriptions([]);
                  }
                }}
              />
            </TableHead>
          )}
          <TableHead>Patient</TableHead>
          <TableHead>Medication</TableHead>
          <TableHead>Prescriber</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prescriptionList.map((prescription) => (
          <TableRow key={prescription.id} className="hover:bg-gray-50">
            {activeTab !== 'completed' && (
              <TableCell>
                <Checkbox
                  checked={selectedPrescriptions.includes(prescription.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPrescriptions(prev => [...prev, prescription.id]);
                    } else {
                      setSelectedPrescriptions(prev => prev.filter(id => id !== prescription.id));
                    }
                  }}
                />
              </TableCell>
            )}
            <TableCell>
              <div>
                <div className="font-medium text-gray-900">{prescription.patient_name}</div>
                <div className="text-sm text-gray-600">{prescription.patient_phone}</div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium text-gray-900">{prescription.medication}</div>
                <div className="text-sm text-gray-600">
                  {prescription.dosage} × {prescription.quantity}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{prescription.prescriber}</span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                {prescription.renewal_due_date ? formatDate(prescription.renewal_due_date) : 'Not set'}
                <div className="mt-1">{getDaysBadge(prescription.renewal_due_date)}</div>
              </div>
            </TableCell>
            <TableCell>
              {prescription.renewed_at ? (
                <Badge className="bg-green-100 text-green-800">Renewed</Badge>
              ) : (
                <Badge variant="outline">Pending</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Prescription Details</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Patient Information</h4>
                        <p className="text-gray-600">{prescription.patient_name}</p>
                        <p className="text-gray-600">{prescription.patient_phone}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Medication</h4>
                        <p className="text-gray-600">{prescription.medication}</p>
                        <p className="text-gray-600">{prescription.dosage} × {prescription.quantity}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Reminder History</h4>
                        <div className="space-y-2">
                          {getReminderHistory(prescription.id).length > 0 ? (
                            getReminderHistory(prescription.id).map((reminder) => (
                              <div key={reminder.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  {reminder.channel === 'email' ? (
                                    <Mail className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <MessageSquare className="h-4 w-4 text-green-600" />
                                  )}
                                  <span className="font-medium">{reminder.channel.toUpperCase()}</span>
                                  <span className="text-sm text-gray-600">
                                    {formatDateTime(reminder.sent_at)}
                                  </span>
                                </div>
                                {reminder.notes && (
                                  <p className="text-sm text-gray-600 mt-1">{reminder.notes}</p>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 italic">No reminders sent yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {!prescription.renewed_at && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendReminderAction(prescription.id, 'email')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendReminderAction(prescription.id, 'sms')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRenewed(prescription.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Prescription Renewals</h1>
          <p className="text-gray-600 mt-1">Manage prescription renewals and send reminders</p>
        </div>
        <PrescriptionDialog
          onPrescriptionCreated={() => {
            fetchData();
          }}
        >
          <Button className="bg-primary hover:bg-primary-hover text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Prescription
          </Button>
        </PrescriptionDialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Due Soon</p>
                <p className="text-xl font-bold text-gray-900">{categorizedPrescriptions['due-soon'].length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-xl font-bold text-gray-900">{categorizedPrescriptions['overdue'].length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">{categorizedPrescriptions['completed'].length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, medication, or prescription ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {selectedPrescriptions.length > 0 && activeTab !== 'completed' && (
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email ({selectedPrescriptions.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Send Bulk Email Reminders</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to send email reminders to {selectedPrescriptions.length} selected patients?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => sendBulkReminders('email')}>
                        Send Emails
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send SMS ({selectedPrescriptions.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Send Bulk SMS Reminders</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to send SMS reminders to {selectedPrescriptions.length} selected patients?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => sendBulkReminders('sms')}>
                        Send SMS
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="due-soon">Due Soon ({categorizedPrescriptions['due-soon'].length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({categorizedPrescriptions['overdue'].length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({categorizedPrescriptions['completed'].length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="due-soon">
          <Card>
            <CardContent className="p-0">
              {getFilteredPrescriptions('due-soon').length > 0 ? (
                renderPrescriptionTable(getFilteredPrescriptions('due-soon'))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No prescriptions due for renewal soon.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overdue">
          <Card>
            <CardContent className="p-0">
              {getFilteredPrescriptions('overdue').length > 0 ? (
                renderPrescriptionTable(getFilteredPrescriptions('overdue'))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No overdue prescriptions.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardContent className="p-0">
              {getFilteredPrescriptions('completed').length > 0 ? (
                renderPrescriptionTable(getFilteredPrescriptions('completed'))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No completed renewals yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}