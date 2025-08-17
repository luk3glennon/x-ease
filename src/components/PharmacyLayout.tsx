import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Archive, 
  Settings,
  Search,
  Plus,
  Zap,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { PharmacyView } from '@/types/pharmacy';

interface PharmacyLayoutProps {
  activeView: PharmacyView;
  onViewChange: (view: PharmacyView) => void;
  children: React.ReactNode;
}

export function PharmacyLayout({ activeView, onViewChange, children }: PharmacyLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'dashboard' as PharmacyView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prescriptions' as PharmacyView, label: 'Prescriptions', icon: FileText },
    { id: 'orders' as PharmacyView, label: 'Customer Orders', icon: Package },
    { 
      id: 'stock' as PharmacyView, 
      label: 'Stock', 
      icon: Archive, 
      hasNotification: true,
      notificationCount: 8
    },
    { id: 'settings' as PharmacyView, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-gray-900">MedFlow</h1>
              <p className="text-sm text-gray-500">Pharmacy System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.hasNotification && (
                  <Badge variant="destructive" className="text-xs">
                    {item.notificationCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white text-sm font-medium">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500">Pharmacist</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prescriptions, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <Button className="bg-primary hover:bg-primary-hover text-white">
              <Plus className="h-4 w-4 mr-2" />
              Log Prescription
            </Button>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Quick Dispense
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}