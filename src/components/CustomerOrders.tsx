import { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Calendar,
  Search,
  Filter,
  Mail,
  MessageSquare,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderDetailDrawer } from '@/components/OrderDetailDrawer';
import { usePharmacyData } from '@/hooks/usePharmacyData';
import { formatDistanceToNow } from 'date-fns';
import type { CustomerOrder } from '@/hooks/usePharmacyData';

export function CustomerOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const { 
    customerOrders, 
    loading, 
    fetchData, 
    updateOrderStatus
  } = usePharmacyData();

  useEffect(() => {
    fetchData();
  }, []);

  const getDaysOverdue = (arrivedAt: string | undefined) => {
    if (!arrivedAt) return 0;
    const arrived = new Date(arrivedAt);
    const now = new Date();
    const diffTime = now.getTime() - arrived.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRowHighlight = (order: CustomerOrder) => {
    if (order.status === 'ready_for_collection' && order.arrived_at) {
      const daysOverdue = getDaysOverdue(order.arrived_at);
      if (daysOverdue >= 7) return 'bg-red-50 border-l-4 border-l-red-500';
      if (daysOverdue >= 3) return 'bg-amber-50 border-l-4 border-l-amber-500';
    }
    return '';
  };

  const handleMarkArrived = async (orderId: string) => {
    await updateOrderStatus(orderId, 'ready_for_collection');
  };

  const handleMarkCollected = async (orderId: string) => {
    await updateOrderStatus(orderId, 'collected');
  };

  const getStatusBadge = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'awaiting_arrival':
        return <Badge className="bg-yellow-100 text-yellow-800">Awaiting Arrival</Badge>;
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

  const getOrderTypeIcon = (type: CustomerOrder['order_type']) => {
    switch (type) {
      case 'special_order':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'missed_pickup':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'back_order':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getOrderTypeLabel = (type: CustomerOrder['order_type']) => {
    switch (type) {
      case 'special_order':
        return 'Special Order';
      case 'missed_pickup':
        return 'Missed Pickup';
      case 'back_order':
        return 'Back Order';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filterOrdersByTab = (orders: CustomerOrder[], tab: string) => {
    let filtered = orders;
    
    switch (tab) {
      case 'awaiting':
        filtered = orders.filter(order => order.status === 'awaiting_arrival');
        break;
      case 'ready':
        filtered = orders.filter(order => order.status === 'ready_for_collection');
        filtered = filtered.sort((a, b) => {
          const aDays = getDaysOverdue(a.arrived_at);
          const bDays = getDaysOverdue(b.arrived_at);
          return bDays - aDays;
        });
        break;
      case 'collected':
        filtered = orders.filter(order => order.status === 'collected');
        break;
      default:
        filtered = orders;
    }
    
    return filtered;
  };

  const filteredOrders = filterOrdersByTab(customerOrders, activeTab).filter(order =>
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTabCounts = () => {
    return {
      all: customerOrders.length,
      awaiting: customerOrders.filter(o => o.status === 'awaiting_arrival').length,
      ready: customerOrders.filter(o => o.status === 'ready_for_collection').length,
      collected: customerOrders.filter(o => o.status === 'collected').length
    };
  };

  const tabCounts = getTabCounts();

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customer Orders</h1>
        <p className="text-gray-600 mt-1">Track special orders, missed pickups, and back orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Special Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {customerOrders.filter(o => o.order_type === 'special_order').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Missed Pickups</p>
                <p className="text-xl font-bold text-gray-900">
                  {customerOrders.filter(o => o.order_type === 'missed_pickup').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Back Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {customerOrders.filter(o => o.order_type === 'back_order').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer name or item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All Orders
            {tabCounts.all > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tabCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="awaiting">
            Awaiting
            {tabCounts.awaiting > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tabCounts.awaiting}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready
            {tabCounts.ready > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tabCounts.ready}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="collected">
            Collected
            {tabCounts.collected > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tabCounts.collected}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Ordered</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <OrderDetailDrawer key={order.id} order={order}>
                      <TableRow className={`hover:bg-gray-50 cursor-pointer ${getRowHighlight(order)}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{order.customer_name}</div>
                            {order.customer_phone && (
                              <div className="text-sm text-gray-600 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {order.customer_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{order.item_name}</div>
                            {order.notes && (
                              <div className="text-sm text-gray-600">{order.notes}</div>
                            )}
                            {order.status === 'ready_for_collection' && order.arrived_at && (
                              <div className="text-xs text-red-600 mt-1">
                                {getDaysOverdue(order.arrived_at)} days overdue
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getOrderTypeIcon(order.order_type)}
                            <span className="text-sm">{getOrderTypeLabel(order.order_type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(order.date_ordered)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {order.expected_date ? (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(order.expected_date)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end space-x-2">
                            {order.status === 'awaiting_arrival' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleMarkArrived(order.id)}
                                title="Mark item as arrived and ready for collection"
                              >
                                Mark as Arrived
                              </Button>
                            )}
                            
                            {order.status === 'ready_for_collection' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-purple-600 hover:text-purple-700"
                                onClick={() => handleMarkCollected(order.id)}
                                title="Mark order as collected"
                              >
                                Mark Collected
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              title="View order details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </OrderDetailDrawer>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {customerOrders.length} orders
        </p>
      </div>
    </div>
  );
}