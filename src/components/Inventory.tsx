import { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus,
  ShoppingCart,
  Truck,
  CheckCircle,
  Eye,
  Edit,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePharmacyData } from '@/hooks/usePharmacyData';
import { StockItemDialog } from './StockItemDialog';
import { ItemHistoryDrawer } from './ItemHistoryDrawer';
import { useToast } from '@/hooks/use-toast';

export function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('in-stock');
  const [stockItemDialogOpen, setStockItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  const { 
    stockItems, 
    ordersTodo, 
    deliveryLog, 
    loading,
    addStockItem,
    updateStockItem,
    markAsOrdered,
    markAsReceived
  } = usePharmacyData();

  const { toast } = useToast();

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
    if (percentage <= 25) return { level: 'critical', color: 'bg-destructive' };
    if (percentage <= 50) return { level: 'low', color: 'bg-warning' };
    return { level: 'good', color: 'bg-success' };
  };

  const filteredStockItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const inStockItems = filteredStockItems;
  const orderedItems = ordersTodo.filter(order => order.status === 'ordered');
  const receivedItems = deliveryLog;

  const handleMarkAsOrdered = async (item: any) => {
    try {
      await markAsOrdered(item.id, 50); // Default order quantity
      toast({
        title: "Success",
        description: `${item.name} marked as ordered`
      });
    } catch (error) {
      console.error('Error marking as ordered:', error);
    }
  };

  const handleMarkAsReceived = async (orderId: string, quantity: number) => {
    try {
      await markAsReceived(orderId, quantity);
      toast({
        title: "Success",
        description: "Item marked as received"
      });
    } catch (error) {
      console.error('Error marking as received:', error);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setStockItemDialogOpen(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setStockItemDialogOpen(true);
  };

  const handleViewHistory = (itemId: string) => {
    setSelectedItemId(itemId);
    setHistoryDrawerOpen(true);
  };

  const tabCounts = {
    inStock: inStockItems.length,
    ordered: orderedItems.length,
    received: receivedItems.length
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track stock levels and manage orders & deliveries</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                <p className="text-xl font-bold text-foreground">{tabCounts.inStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ordered</p>
                <p className="text-xl font-bold text-foreground">{tabCounts.ordered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Received</p>
                <p className="text-xl font-bold text-foreground">{tabCounts.received}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items or suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="in-stock" className="relative">
            In Stock
            <Badge variant="secondary" className="ml-2 text-xs">
              {tabCounts.inStock}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ordered" className="relative">
            Ordered
            <Badge variant="secondary" className="ml-2 text-xs">
              {tabCounts.ordered}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="received">
            Received
            <Badge variant="secondary" className="ml-2 text-xs">
              {tabCounts.received}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* In Stock Tab */}
        <TabsContent value="in-stock">
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
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inStockItems.map((item) => {
                    const stockLevel = getStockLevel(item.current_stock, item.minimum_stock);
                    const isLowStock = item.current_stock <= item.minimum_stock;
                    
                    return (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${stockLevel.color}`}></div>
                            <span className="font-medium text-foreground">{item.name}</span>
                            {isLowStock && <AlertTriangle className="h-4 w-4 text-destructive" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-mono ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
                            {item.current_stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-muted-foreground">{item.minimum_stock}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.supplier || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground">{item.location || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(item.last_updated)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewHistory(item.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsOrdered(item)}
                              disabled={!isLowStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Order
                            </Button>
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

        {/* Ordered Tab */}
        <TabsContent value="ordered">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Order Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Ordered Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderedItems.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell>
                        <span className="font-medium text-foreground">{order.item_name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-foreground">{order.order_quantity}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-foreground">{order.supplier}</div>
                          {order.supplier_contact && (
                            <div className="text-sm text-muted-foreground">{order.supplier_contact}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {order.notes || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsReceived(order.id, order.order_quantity)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Received
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Received Tab */}
        <TabsContent value="received">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity Received</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Received By</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedItems.map((delivery) => (
                    <TableRow key={delivery.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {delivery.item_name}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-foreground">{delivery.quantity_received}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {delivery.supplier}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {delivery.received_by || 'N/A'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(delivery.received_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {delivery.notes || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs and Drawers */}
      <StockItemDialog
        open={stockItemDialogOpen}
        onOpenChange={setStockItemDialogOpen}
        item={editingItem}
        onSubmit={async (data: any) => {
          if (editingItem) {
            await updateStockItem(editingItem.id, data);
          } else {
            await addStockItem(data);
          }
        }}
      />
      
      <ItemHistoryDrawer
        open={historyDrawerOpen}
        onOpenChange={setHistoryDrawerOpen}
        itemId={selectedItemId}
      />
    </div>
  );
}