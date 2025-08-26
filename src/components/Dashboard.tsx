import { 
  AlertTriangle, 
  Package, 
  Clock, 
  FileText, 
  Archive, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrescriptionDialog } from '@/components/PrescriptionDialog';
import { CustomerOrderDialog } from '@/components/CustomerOrderDialog';
import { usePharmacyData } from '@/hooks/usePharmacyData';
import { useEffect } from 'react';
import type { PharmacyView } from '@/types/pharmacy';

interface DashboardProps {
  onViewChange: (view: PharmacyView) => void;
}

export function Dashboard({ onViewChange }: DashboardProps) {
  const { 
    prescriptions, 
    customerOrders, 
    stockItems, 
    ordersTodo, 
    loading, 
    fetchData 
  } = usePharmacyData();

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate live counts
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length;
  const readyPrescriptions = prescriptions.filter(p => p.status === 'ready').length;
  const awaitingOrders = customerOrders.filter(o => o.status === 'awaiting_arrival').length;
  const overdueOrders = customerOrders.filter(o => o.status === 'overdue').length;
  const lowStockItems = stockItems.filter(item => item.current_stock <= item.minimum_stock).length;
  const pendingOrdersTodo = ordersTodo.filter(o => o.status === 'pending').length;

  const alertCards = [
    {
      title: 'Orders To-Do',
      count: pendingOrdersTodo,
      description: 'Items to order',
      icon: Package,
      color: 'bg-blue-500',
      hasNotification: pendingOrdersTodo > 0,
      view: 'stock' as PharmacyView,
      onClick: () => onViewChange('stock')
    },
    {
      title: 'Low Stock Items',
      count: lowStockItems,
      description: 'Below minimum threshold',
      icon: AlertTriangle,
      color: 'bg-warning',
      hasNotification: lowStockItems > 0,
      view: 'stock' as PharmacyView,
      onClick: () => onViewChange('stock')
    },
    {
      title: 'Awaiting Orders',
      count: awaitingOrders,
      description: 'Customer orders pending',
      icon: Clock,
      color: 'bg-blue-600',
      hasNotification: awaitingOrders > 0,
      view: 'orders' as PharmacyView,
      onClick: () => onViewChange('orders')
    }
  ];

  const navigationTiles = [
    {
      title: 'Prescriptions',
      description: `${pendingPrescriptions} pending, ${readyPrescriptions} ready`,
      icon: FileText,
      color: 'bg-green-500',
      view: 'prescriptions' as PharmacyView,
      onClick: () => onViewChange('prescriptions')
    },
    {
      title: 'Customer Orders',
      description: `${awaitingOrders} awaiting, ${overdueOrders} overdue`,
      icon: ClipboardList,
      color: 'bg-blue-500',
      view: 'orders' as PharmacyView,
      onClick: () => onViewChange('orders')
    },
    {
      title: 'Stock Management',
      description: `${stockItems.length} items tracked`,
      icon: Archive,
      color: 'bg-purple-500',
      view: 'stock' as PharmacyView,
      onClick: () => onViewChange('stock')
    },
    {
      title: 'Settings',
      description: 'Configure pharmacy settings',
      icon: Settings,
      color: 'bg-gray-500',
      view: 'settings' as PharmacyView,
      onClick: () => onViewChange('settings')
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Loading pharmacy data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const recentActivity = [
    {
      id: 1,
      action: 'Prescription logged',
      patient: 'Sarah Johnson',
      medication: 'Amoxicillin 500mg',
      time: '2 minutes ago',
      status: 'pending',
      user: 'John Doe'
    },
    {
      id: 2,
      action: 'Prescription ready',
      patient: 'Mike Chen',
      medication: 'Lisinopril 10mg',
      time: '15 minutes ago',
      status: 'ready',
      user: 'Jane Smith'
    },
    {
      id: 3,
      action: 'Order placed',
      patient: 'Emma Wilson',
      medication: 'Insulin pen',
      time: '1 hour ago',
      status: 'ordered',
      user: 'John Doe'
    },
    {
      id: 4,
      action: 'Stock updated',
      patient: 'System',
      medication: 'Paracetamol 500mg',
      time: '2 hours ago',
      status: 'completed',
      user: 'Auto'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ordered':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your pharmacy today.</p>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alertCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card 
              key={index} 
              className="relative overflow-hidden cursor-pointer hover:shadow-md transition-smooth hover-scale"
              onClick={card.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                {card.hasNotification && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.count}</div>
                <p className="text-xs text-gray-600 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation Tiles */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {navigationTiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-smooth hover-scale"
                onClick={tile.onClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${tile.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{tile.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tile.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PrescriptionDialog onPrescriptionCreated={fetchData}>
            <Card className="cursor-pointer hover:shadow-md transition-smooth hover-scale">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">Add New Prescription</h3>
                    <p className="text-sm text-gray-600 mt-1">Log a new prescription to the system</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </PrescriptionDialog>

          <CustomerOrderDialog onOrderCreated={fetchData}>
            <Card className="cursor-pointer hover:shadow-md transition-smooth hover-scale">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">Add Customer Order</h3>
                    <p className="text-sm text-gray-600 mt-1">Create a new customer order</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </CustomerOrderDialog>

          <Card 
            className="cursor-pointer hover:shadow-md transition-smooth hover-scale"
            onClick={() => onViewChange('stock')}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Archive className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">Stock Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Check and update inventory levels</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-smooth hover-scale"
            onClick={() => onViewChange('prescriptions')}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">View Prescriptions</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage pending and ready prescriptions</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-smooth">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{activity.action}</span>
                        <Badge variant="secondary" className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.patient !== 'System' && `${activity.patient} - `}
                        {activity.medication}
                      </p>
                    </div>
                    <div className="flex flex-col items-end text-xs text-gray-500">
                      <span>{activity.time}</span>
                      <span>by {activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}