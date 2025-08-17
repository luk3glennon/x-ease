import { useState } from 'react';
import { 
  AlertTriangle, 
  Package, 
  Search, 
  Filter,
  ShoppingCart,
  Truck,
  CheckCircle,
  X,
  Plus,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StockItem, OrderToDo } from '@/types/pharmacy';

export function Stock() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('low-stock');

  // Mock data
  const stockItems: StockItem[] = [
    {
      id: '1',
      pharmacyId: 'ph1',
      name: 'Paracetamol 500mg',
      currentStock: 15,
      minimumStock: 50,
      location: 'Shelf A1',
      supplier: 'MedSupply Co',
      lastUpdated: '2024-01-15T08:30:00Z',
      isLowStock: true
    },
    {
      id: '2',
      pharmacyId: 'ph1',
      name: 'Amoxicillin 250mg',
      currentStock: 8,
      minimumStock: 30,
      location: 'Shelf B2',
      supplier: 'PharmaCorp',
      lastUpdated: '2024-01-14T14:20:00Z',
      isLowStock: true
    },
    {
      id: '3',
      pharmacyId: 'ph1',
      name: 'Lisinopril 10mg',
      currentStock: 85,
      minimumStock: 40,
      location: 'Shelf C1',
      supplier: 'MedSupply Co',
      lastUpdated: '2024-01-15T10:15:00Z',
      isLowStock: false
    }
  ];

  const ordersToDo: OrderToDo[] = [
    {
      id: '1',
      pharmacyId: 'ph1',
      itemName: 'Insulin pens',
      currentStock: 3,
      orderQuantity: 50,
      supplier: 'DiabetesCare Ltd',
      supplierContact: '(555) 999-0000',
      notes: 'Priority order - patient waiting',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-15T09:00:00Z',
      status: 'pending'
    },
    {
      id: '2',
      pharmacyId: 'ph1',
      itemName: 'Blood pressure monitors',
      currentStock: 0,
      orderQuantity: 10,
      supplier: 'MedDevices Inc',
      supplierContact: '(555) 888-1111',
      notes: 'Customer special order',
      createdBy: 'John Doe',
      createdAt: '2024-01-14T16:30:00Z',
      status: 'pending'
    }
  ];

  const deliveryLog = [
    {
      id: '1',
      supplier: 'MedSupply Co',
      items: 'Paracetamol 500mg (100 units)',
      receivedBy: 'John Doe',
      timestamp: '2024-01-15T08:30:00Z'
    },
    {
      id: '2',
      supplier: 'PharmaCorp',
      items: 'Vitamin D3 (50 units), Calcium tablets (30 units)',
      receivedBy: 'Jane Smith',
      timestamp: '2024-01-14T14:45:00Z'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStockLevel = (current: number, minimum: number) => {
    const percentage = (current / minimum) * 100;
    if (percentage <= 25) return { level: 'critical', color: 'bg-red-500' };
    if (percentage <= 50) return { level: 'low', color: 'bg-amber-500' };
    return { level: 'good', color: 'bg-green-500' };
  };

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = filteredItems.filter(item => item.isLowStock);

  const tabCounts = {
    lowStock: stockItems.filter(item => item.isLowStock).length,
    allItems: stockItems.length,
    ordersToDo: ordersToDo.length,
    deliveryLog: deliveryLog.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Stock Management</h1>
          <p className="text-gray-600 mt-1">Monitor inventory levels and manage orders</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Stock Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-xl font-bold text-gray-900">{tabCounts.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-xl font-bold text-gray-900">{tabCounts.allItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Orders To-Do</p>
                <p className="text-xl font-bold text-gray-900">{tabCounts.ordersToDo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Deliveries</p>
                <p className="text-xl font-bold text-gray-900">{tabCounts.deliveryLog}</p>
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
                  placeholder="Search items or suppliers..."
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

      {/* Stock Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="low-stock" className="relative">
            Low Stock
            {tabCounts.lowStock > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {tabCounts.lowStock}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all-items">
            All Items
            <Badge variant="secondary" className="ml-2 text-xs">
              {tabCounts.allItems}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="orders-todo" className="relative">
            Orders To-Do
            {tabCounts.ordersToDo > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tabCounts.ordersToDo}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivery-log">
            Delivery Log
          </TabsTrigger>
        </TabsList>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Minimum Stock</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item) => {
                    const stockLevel = getStockLevel(item.currentStock, item.minimumStock);
                    return (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${stockLevel.color}`}></div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-red-600">{item.currentStock}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-gray-600">{item.minimumStock}</span>
                        </TableCell>
                        <TableCell className="text-gray-600">{item.supplier}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" className="bg-primary hover:bg-primary-hover text-white">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Items Tab */}
        <TabsContent value="all-items">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Minimum Stock</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockLevel = getStockLevel(item.currentStock, item.minimumStock);
                    return (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${stockLevel.color}`}></div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-mono ${item.isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                            {item.currentStock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-gray-600">{item.minimumStock}</span>
                        </TableCell>
                        <TableCell className="text-gray-600">{item.supplier}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(item.lastUpdated)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders To-Do Tab */}
        <TabsContent value="orders-todo">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Order Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersToDo.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell>
                        <span className="font-medium text-gray-900">{order.itemName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-red-600">{order.currentStock}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-gray-900">{order.orderQuantity}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-gray-900">{order.supplier}</div>
                          <div className="text-sm text-gray-600">{order.supplierContact}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-gray-900">{order.createdBy}</div>
                          <div className="text-sm text-gray-600">{formatDateTime(order.createdAt)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">
                        {order.notes}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" className="bg-success hover:bg-success-hover text-white">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Ordered
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <X className="h-4 w-4" />
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

        {/* Delivery Log Tab */}
        <TabsContent value="delivery-log">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items Received</TableHead>
                    <TableHead>Received By</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryLog.map((delivery) => (
                    <TableRow key={delivery.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {delivery.supplier}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {delivery.items}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {delivery.receivedBy}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDateTime(delivery.timestamp)}</span>
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
    </div>
  );
}