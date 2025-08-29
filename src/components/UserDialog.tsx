import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit } from 'lucide-react';
import { UserProfile } from '@/hooks/useSettings';

interface UserDialogProps {
  user?: UserProfile;
  onSave: (userData: Omit<UserProfile, 'id' | 'created_at'>) => Promise<void>;
  onUpdate?: (id: string, updates: Partial<UserProfile>) => Promise<void>;
  isAdmin: boolean;
}

export function UserDialog({ user, onSave, onUpdate, isAdmin }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    role: user?.role || 'technician' as 'admin' | 'pharmacist' | 'technician',
    pharmacy_id: user?.pharmacy_id || crypto.randomUUID(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (user && onUpdate) {
        await onUpdate(user.id, formData);
      } else {
        await onSave(formData);
      }
      setOpen(false);
      if (!user) {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          role: 'technician',
          pharmacy_id: crypto.randomUUID(),
        });
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {user ? (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <Button className="bg-primary hover:bg-primary-hover text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {user ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john.doe@pharmacy.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'admin' | 'pharmacist' | 'technician') => 
                handleInputChange('role', value)
              }
              disabled={!isAdmin}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
            {!isAdmin && (
              <p className="text-xs text-muted-foreground">
                Only administrators can change user roles
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover text-white">
              {user ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}