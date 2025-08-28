import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Truck, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';

interface ItemHistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
}

interface HistoryEvent {
  id: string;
  type: 'ordered' | 'received' | 'stock_update';
  date: string;
  quantity?: number;
  supplier?: string;
  notes?: string;
  created_by?: string;
}

export function ItemHistoryDrawer({ open, onOpenChange, itemId }: ItemHistoryDrawerProps) {
  const [item, setItem] = useState<any>(null);
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && itemId) {
      fetchItemHistory();
    }
  }, [open, itemId]);

  const fetchItemHistory = async () => {
    setLoading(true);
    try {
      // Fetch item details
      const { data: itemData, error: itemError } = await supabase
        .from('stock_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (itemError) throw itemError;
      setItem(itemData);

      // Fetch order history
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders_todo')
        .select('*')
        .eq('item_name', itemData.name)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch delivery history
      const { data: deliveryData, error: deliveryError } = await supabase
        .from('delivery_log')
        .select('*')
        .eq('item_name', itemData.name)
        .order('received_at', { ascending: false });

      if (deliveryError) throw deliveryError;

      // Combine and sort history
      const events: HistoryEvent[] = [
        ...(ordersData || []).map(order => ({
          id: order.id,
          type: 'ordered' as const,
          date: order.created_at,
          quantity: order.order_quantity,
          supplier: order.supplier,
          notes: order.notes,
          created_by: order.created_by
        })),
        ...(deliveryData || []).map(delivery => ({
          id: delivery.id,
          type: 'received' as const,
          date: delivery.received_at,
          quantity: delivery.quantity_received,
          supplier: delivery.supplier,
          notes: delivery.notes,
          created_by: delivery.received_by
        }))
      ];

      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHistory(events);

    } catch (error) {
      console.error('Error fetching item history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ordered':
        return <ShoppingCart className="h-4 w-4 text-warning" />;
      case 'received':
        return <Truck className="h-4 w-4 text-success" />;
      default:
        return <Package className="h-4 w-4 text-primary" />;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'ordered':
        return <Badge variant="outline" className="text-warning border-warning">Ordered</Badge>;
      case 'received':
        return <Badge variant="outline" className="text-success border-success">Received</Badge>;
      default:
        return <Badge variant="outline">Update</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Item History</span>
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading history...</div>
          </div>
        ) : item ? (
          <div className="space-y-6 mt-6">
            {/* Item Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-mono font-medium">{item.current_stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Stock:</span>
                  <span className="font-mono">{item.minimum_stock}</span>
                </div>
                {item.supplier && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supplier:</span>
                    <span>{item.supplier}</span>
                  </div>
                )}
                {item.location && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{item.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="text-sm">{formatDateTime(item.last_updated)}</span>
                </div>
              </CardContent>
            </Card>

            {/* History Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Activity History</h3>
              
              {history.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                      No history available for this item
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {history.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              {getEventBadge(event.type)}
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDateTime(event.date)}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              {event.quantity && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Quantity: </span>
                                  <span className="font-mono font-medium">{event.quantity}</span>
                                </div>
                              )}
                              {event.supplier && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Supplier: </span>
                                  <span>{event.supplier}</span>
                                </div>
                              )}
                              {event.created_by && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">By: </span>
                                  <span>{event.created_by}</span>
                                </div>
                              )}
                              {event.notes && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Notes: </span>
                                  <span className="italic">{event.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Item not found</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}