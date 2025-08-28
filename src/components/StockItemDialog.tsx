import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface StockItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: any;
  onSubmit: (data: any) => Promise<void>;
}

export function StockItemDialog({ open, onOpenChange, item, onSubmit }: StockItemDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    current_stock: 0,
    minimum_stock: 0,
    location: '',
    supplier: '',
    supplier_contact: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        current_stock: item.current_stock || 0,
        minimum_stock: item.minimum_stock || 0,
        location: item.location || '',
        supplier: item.supplier || '',
        supplier_contact: item.supplier_contact || ''
      });
    } else {
      setFormData({
        name: '',
        current_stock: 0,
        minimum_stock: 0,
        location: '',
        supplier: '',
        supplier_contact: ''
      });
    }
  }, [item, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Stock Item' : 'Add New Stock Item'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_stock">Current Stock *</Label>
                <Input
                  id="current_stock"
                  type="number"
                  min="0"
                  value={formData.current_stock}
                  onChange={(e) => handleInputChange('current_stock', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="minimum_stock">Minimum Stock *</Label>
                <Input
                  id="minimum_stock"
                  type="number"
                  min="0"
                  value={formData.minimum_stock}
                  onChange={(e) => handleInputChange('minimum_stock', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Shelf A1, Storage Room B"
              />
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>

            <div>
              <Label htmlFor="supplier_contact">Supplier Contact</Label>
              <Input
                id="supplier_contact"
                value={formData.supplier_contact}
                onChange={(e) => handleInputChange('supplier_contact', e.target.value)}
                placeholder="Phone or email"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}