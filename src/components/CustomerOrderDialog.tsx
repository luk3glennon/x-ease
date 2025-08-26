import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePharmacyData } from '@/hooks/usePharmacyData';
import { Plus } from 'lucide-react';

interface CustomerOrderDialogProps {
  children?: React.ReactNode;
  onOrderCreated?: () => void;
}

export function CustomerOrderDialog({ children, onOrderCreated }: CustomerOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    item_name: '',
    order_type: 'special_order' as 'special_order' | 'missed_pickup' | 'back_order',
    expected_date: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addCustomerOrder } = usePharmacyData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.item_name) return;

    setIsSubmitting(true);
    try {
      await addCustomerOrder({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone || undefined,
        item_name: formData.item_name,
        order_type: formData.order_type,
        expected_date: formData.expected_date || undefined,
        notes: formData.notes || undefined,
        status: 'awaiting_arrival'
      });
      
      // Reset form
      setFormData({
        customer_name: '',
        customer_phone: '',
        item_name: '',
        order_type: 'special_order',
        expected_date: '',
        notes: ''
      });
      
      setOpen(false);
      onOrderCreated?.();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Customer Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone">Phone Number</Label>
              <Input
                id="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name *</Label>
            <Input
              id="item_name"
              value={formData.item_name}
              onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
              placeholder="Enter item/medication name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order_type">Order Type</Label>
              <Select 
                value={formData.order_type} 
                onValueChange={(value: 'special_order' | 'missed_pickup' | 'back_order') => 
                  setFormData(prev => ({ ...prev, order_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="special_order">Special Order</SelectItem>
                  <SelectItem value="missed_pickup">Missed Pickup</SelectItem>
                  <SelectItem value="back_order">Back Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_date">Expected Date</Label>
              <Input
                id="expected_date"
                type="date"
                value={formData.expected_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or instructions"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.customer_name || !formData.item_name}>
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}