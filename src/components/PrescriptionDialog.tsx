import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Prescription } from '@/hooks/usePharmacyData';

interface PrescriptionDialogProps {
  onAddPrescription: (prescription: Omit<Prescription, 'id' | 'date_created'>) => Promise<any>;
  trigger?: React.ReactNode;
}

export const PrescriptionDialog = ({ onAddPrescription, trigger }: PrescriptionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_dob: '',
    patient_phone: '',
    patient_address: '',
    medication: '',
    dosage: '',
    quantity: '',
    prescriber: '',
    insurance_info: '',
    special_instructions: '',
    status: 'pending' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_name || !formData.medication || !formData.dosage || !formData.quantity || !formData.prescriber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await onAddPrescription({
        ...formData,
        quantity: parseInt(formData.quantity),
        patient_dob: formData.patient_dob || undefined,
        patient_phone: formData.patient_phone || undefined,
        patient_address: formData.patient_address || undefined,
        insurance_info: formData.insurance_info || undefined,
        special_instructions: formData.special_instructions || undefined,
        created_by: 'Pharmacy Staff'
      });
      
      // Reset form
      setFormData({
        patient_name: '',
        patient_dob: '',
        patient_phone: '',
        patient_address: '',
        medication: '',
        dosage: '',
        quantity: '',
        prescriber: '',
        insurance_info: '',
        special_instructions: '',
        status: 'pending'
      });
      
      setOpen(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" title="Add a new prescription to the system">
            <Plus className="h-4 w-4" />
            Log New Prescription
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log New Prescription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name *</Label>
              <Input
                id="patient_name"
                value={formData.patient_name}
                onChange={(e) => handleInputChange('patient_name', e.target.value)}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_dob">Date of Birth</Label>
              <Input
                id="patient_dob"
                type="date"
                value={formData.patient_dob}
                onChange={(e) => handleInputChange('patient_dob', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_phone">Phone Number</Label>
              <Input
                id="patient_phone"
                value={formData.patient_phone}
                onChange={(e) => handleInputChange('patient_phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prescriber">Prescriber *</Label>
              <Input
                id="prescriber"
                value={formData.prescriber}
                onChange={(e) => handleInputChange('prescriber', e.target.value)}
                placeholder="Enter prescriber name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient_address">Address</Label>
            <Input
              id="patient_address"
              value={formData.patient_address}
              onChange={(e) => handleInputChange('patient_address', e.target.value)}
              placeholder="Enter patient address"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medication">Medication *</Label>
              <Input
                id="medication"
                value={formData.medication}
                onChange={(e) => handleInputChange('medication', e.target.value)}
                placeholder="Enter medication name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                placeholder="e.g., 500mg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance_info">Insurance Information</Label>
            <Input
              id="insurance_info"
              value={formData.insurance_info}
              onChange={(e) => handleInputChange('insurance_info', e.target.value)}
              placeholder="Enter insurance details"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_instructions">Special Instructions</Label>
            <Textarea
              id="special_instructions"
              value={formData.special_instructions}
              onChange={(e) => handleInputChange('special_instructions', e.target.value)}
              placeholder="Enter any special instructions"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} title="Save prescription to database">
              {loading ? 'Saving...' : 'Save Prescription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};