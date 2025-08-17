import { useState } from 'react';
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
import type { Prescription } from '@/types/pharmacy';

export function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const prescriptions: Prescription[] = [
    {
      id: '1',
      pharmacyId: 'ph1',
      patientName: 'Sarah Johnson',
      patientDob: '1985-03-15',
      patientPhone: '(555) 123-4567',
      medication: 'Amoxicillin 500mg',
      dosage: '1 tablet',
      quantity: 30,
      prescriber: 'Dr. Smith',
      status: 'pending',
      dateCreated: '2024-01-15T10:30:00Z',
      specialInstructions: 'Take with food'
    },
    {
      id: '2',
      pharmacyId: 'ph1',
      patientName: 'Mike Chen',
      patientDob: '1972-08-22',
      patientPhone: '(555) 987-6543',
      medication: 'Lisinopril 10mg',
      dosage: '1 tablet daily',
      quantity: 90,
      prescriber: 'Dr. Wilson',
      status: 'ready',
      dateCreated: '2024-01-14T14:20:00Z',
      dateReady: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      pharmacyId: 'ph1',
      patientName: 'Emma Wilson',
      patientDob: '1990-12-03',
      patientPhone: '(555) 456-7890',
      medication: 'Metformin 500mg',
      dosage: '2 tablets daily',
      quantity: 60,
      prescriber: 'Dr. Brown',
      status: 'collected',
      dateCreated: '2024-01-13T16:45:00Z',
      dateReady: '2024-01-14T11:30:00Z',
      dateCollected: '2024-01-14T15:20:00Z'
    }
  ];

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

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.prescriber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Manage and track all prescription orders</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          Log New Prescription
        </Button>
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
                      <div className="font-medium text-gray-900">{prescription.patientName}</div>
                      <div className="text-sm text-gray-600">{prescription.patientPhone}</div>
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
                    {formatDate(prescription.dateCreated)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {prescription.status === 'pending' && (
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
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