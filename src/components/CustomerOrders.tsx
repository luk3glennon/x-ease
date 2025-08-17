import { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CustomerOrder } from '@/types/pharmacy';

export function CustomerOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const orders: CustomerOrder[] = [
    {
      id: '1',
      pharmacyId: 'ph1',
      customerName: 'Alice Brown',
      customerPhone: '(555) 111-2222',
      itemName: 'Insulin pen refills',
      orderType: 'special_order',
      status: 'awaiting_arrival',
      dateOrdered: '2024-01-12T09:00:00Z',
      expectedDate: '2024-01-18T00:00:00Z',
      notes: 'Customer needs specific brand'
    },
    {
      id: '2',
      pharmacyId: 'ph1',
      customerName: 'Robert Davis',
      customerPhone: '(555) 333-4444',
      itemName: 'Metformin 500mg prescription',
      orderType: 'missed_pickup',
      status: 'ready_for_collection',
      dateOrdered: '2024-01-10T14:30:00Z',
      notes: 'Ready since Monday'
    },
    {
      id: '3',
      pharmacyId: 'ph1',
      customerName: 'Maria Garcia',
      customerPhone: '(555) 555-6666',
      itemName: 'Blood pressure monitor',
      orderType: 'back_order',
      status: 'overdue',
      dateOrdered: '2024-01-08T11:15:00Z',
      expectedDate: '2024-01-15T00:00:00Z',
      notes: 'Supplier delayed shipment'
    }
  ];

  const getStatusBadge = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'awaiting_arrival':
        return <Badge className="status-badge status-pending">Awaiting Arrival</Badge>;
      case 'ready_for_collection':
        return <Badge className="status-badge status-ready">Ready for Collection</Badge>;
      case 'overdue':
        return <Badge className="status-badge status-overdue">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getOrderTypeIcon = (type: CustomerOrder['orderType']) => {
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

  const getOrderTypeLabel = (type: CustomerOrder['orderType']) => {
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
    switch (tab) {
      case 'awaiting':
        return orders.filter(order => order.status === 'awaiting_arrival');
      case 'ready':
        return orders.filter(order => order.status === 'ready_for_collection');
      case 'overdue':
        return orders.filter(order => order.status === 'overdue');
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrdersByTab(orders, activeTab).filter(order =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTabCounts = () => {
    return {
      all: orders.length,
      awaiting: orders.filter(o => o.status === 'awaiting_arrival').length,
      ready: orders.filter(o => o.status === 'ready_for_collection').length,
      overdue: orders.filter(o => o.status === 'overdue').length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customer Orders</h1>
        <p className="text-gray-600 mt-1">Track special orders, missed pickups, and back orders</p>
      </div>

      {/* Summary Cards */}
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
                  {orders.filter(o => o.orderType === 'special_order').length}
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
                  {orders.filter(o => o.orderType === 'missed_pickup').length}
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
                  {orders.filter(o => o.orderType === 'back_order').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
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

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All Orders
            {tabCounts.all > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tabCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="awaiting" className="relative">
            Awaiting Arrival
            {tabCounts.awaiting > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tabCounts.awaiting}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ready" className="relative">
            Ready for Collection
            {tabCounts.ready > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tabCounts.ready}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="overdue" className="relative">
            Overdue
            {tabCounts.overdue > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {tabCounts.overdue}
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
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.customerPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{order.itemName}</div>
                          {order.notes && (
                            <div className="text-sm text-gray-600">{order.notes}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getOrderTypeIcon(order.orderType)}
                          <span className="text-sm">{getOrderTypeLabel(order.orderType)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(order.dateOrdered)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {order.expectedDate ? (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(order.expectedDate)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {order.status === 'awaiting_arrival' && (
                            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                              Mark Arrived
                            </Button>
                          )}
                          {order.status === 'ready_for_collection' && (
                            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
                              Mark Collected
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>
    </div>
  );
}