import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  Calendar,
  User,
  Pill,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PrescriptionDialog } from './PrescriptionDialog';
import { usePharmacyData } from '@/hooks/usePharmacyData';
import { useToast } from '@/hooks/use-toast';
import type { Prescription } from '@/hooks/usePharmacyData';

export function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { prescriptions, loading, updatePrescriptionStatus, deletePrescription } = usePharmacyData();
  const { toast } = useToast();

  const getStatusBadge = (status: Prescription['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="status-badge status-pending">Pending</Badge>;
      case 'ready':
        return <Badge className="status-badge status-ready">Ready</Badge>;
      case 'collected':
        return <Badge className="status-badge status-collected">Collected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleMarkReady = async (prescriptionId: string) => {
    try {
      await updatePrescriptionStatus(prescriptionId, 'ready');
      toast({
        title: "Success",
        description: "Prescription marked as ready for collection.",
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleMarkCollected = async (prescriptionId: string) => {
    try {
      await updatePrescriptionStatus(prescriptionId, 'collected');
      toast({
        title: "Success",
        description: "Prescription marked as collected.",
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.prescriber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-8">Loading prescriptions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Manage and track all prescription orders</p>
        </div>
        <PrescriptionDialog>
          <Button className="bg-primary hover:bg-primary-hover text-white">
            <Plus className="h-4 w-4 mr-2" />
            Log New Prescription
          </Button>
        </PrescriptionDialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'pending').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'ready').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Pill className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'collected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Today</p>
                <p className="text-xl font-bold text-gray-900">{prescriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient, medication, or prescriber..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="collected">Collected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Prescriber</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{prescription.patient_name}</div>
                      <div className="text-sm text-gray-600">{prescription.patient_phone || 'N/A'}</div>
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
                    {getStatusBadge(prescription.status)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(prescription.date_created)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" title="View prescription details">
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
                              <p className="text-gray-600">{prescription.patient_phone || 'No phone'}</p>
                              <p className="text-gray-600">{prescription.patient_address || 'No address'}</p>
                              {prescription.patient_dob && (
                                <p className="text-gray-600">DOB: {formatDate(prescription.patient_dob)}</p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Medication</h4>
                              <p className="text-gray-600">{prescription.medication}</p>
                              <p className="text-gray-600">{prescription.dosage} × {prescription.quantity}</p>
                              <p className="text-gray-600">Prescribed by: {prescription.prescriber}</p>
                            </div>
                            {prescription.special_instructions && (
                              <div>
                                <h4 className="font-semibold text-gray-900">Special Instructions</h4>
                                <p className="text-gray-600">{prescription.special_instructions}</p>
                              </div>
                            )}
                            {prescription.insurance_info && (
                              <div>
                                <h4 className="font-semibold text-gray-900">Insurance Information</h4>
                                <p className="text-gray-600">{prescription.insurance_info}</p>
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-900">Status Information</h4>
                              <p className="text-gray-600">Created: {formatDate(prescription.date_created)}</p>
                              {prescription.date_ready && (
                                <p className="text-gray-600">Ready: {formatDate(prescription.date_ready)}</p>
                              )}
                              {prescription.date_collected && (
                                <p className="text-gray-600">Collected: {formatDate(prescription.date_collected)}</p>
                              )}
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                      
                      {prescription.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleMarkReady(prescription.id)}
                          title="Mark as ready for collection"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {prescription.status === 'ready' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleMarkCollected(prescription.id)}
                          title="Mark as collected"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredPrescriptions.length} of {prescriptions.length} prescriptions
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}