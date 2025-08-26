import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Calendar,
  User,
  MessageSquare,
  History
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CustomerOrder } from '@/hooks/usePharmacyData';

interface OrderDetailDrawerProps {
  order: CustomerOrder;
  children: React.ReactNode;
}

export function OrderDetailDrawer({ order, children }: OrderDetailDrawerProps) {
  const [open, setOpen] = useState(false);

  const getStatusBadge = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'awaiting_arrival':
        return <Badge className="bg-blue-100 text-blue-800">Awaiting Arrival</Badge>;
      case 'ready_for_collection':
        return <Badge className="bg-green-100 text-green-800">Ready for Collection</Badge>;
      case 'collected':
        return <Badge className="bg-gray-100 text-gray-800">Collected</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getOrderTypeInfo = (type: CustomerOrder['order_type']) => {
    switch (type) {
      case 'special_order':
        return { icon: Package, label: 'Special Order', color: 'text-blue-500' };
      case 'missed_pickup':
        return { icon: Clock, label: 'Missed Pickup', color: 'text-amber-500' };
      case 'back_order':
        return { icon: AlertTriangle, label: 'Back Order', color: 'text-red-500' };
      default:
        return { icon: Package, label: 'Unknown', color: 'text-gray-400' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderTypeInfo = getOrderTypeInfo(order.order_type);
  const OrderTypeIcon = orderTypeInfo.icon;

  // Create activity timeline
  const activities = [
    {
      id: 1,
      action: 'Order Created',
      timestamp: order.date_ordered,
      icon: Package,
      color: 'bg-blue-500'
    },
    ...(order.arrived_at ? [{
      id: 2,
      action: 'Item Arrived',
      timestamp: order.arrived_at,
      icon: CheckCircle,
      color: 'bg-green-500'
    }] : []),
    ...(order.notified_at ? [{
      id: 3,
      action: 'Customer Notified',
      timestamp: order.notified_at,
      icon: MessageSquare,
      color: 'bg-purple-500'
    }] : []),
    ...(order.collected_at ? [{
      id: 4,
      action: 'Order Collected',
      timestamp: order.collected_at,
      icon: CheckCircle,
      color: 'bg-gray-500'
    }] : [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <OrderTypeIcon className={`h-5 w-5 ${orderTypeInfo.color}`} />
            <span>Order Details</span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <div className="flex items-center space-x-2">
                  <OrderTypeIcon className={`h-4 w-4 ${orderTypeInfo.color}`} />
                  <span className="text-sm">{orderTypeInfo.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Item:</span>
                <span className="text-sm font-medium">{order.item_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Order Date:</span>
                <span className="text-sm">{formatDate(order.date_ordered)}</span>
              </div>
              {order.expected_date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Expected Date:</span>
                  <span className="text-sm">{formatDate(order.expected_date)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="text-sm font-medium">{order.customer_name}</span>
              </div>
              {order.customer_phone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Phone:</span>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3" />
                    <span className="text-sm">{order.customer_phone}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Activity Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <ActivityIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.timestamp)} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}