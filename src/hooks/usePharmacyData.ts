import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Prescription {
  id: string;
  patient_name: string;
  patient_dob?: string;
  patient_phone?: string;
  patient_address?: string;
  medication: string;
  dosage: string;
  quantity: number;
  prescriber: string;
  status: 'pending' | 'ready' | 'collected';
  date_created: string;
  date_ready?: string;
  date_collected?: string;
  insurance_info?: string;
  special_instructions?: string;
  created_by?: string;
}

export interface CustomerOrder {
  id: string;
  customer_name: string;
  customer_phone?: string;
  item_name: string;
  order_type: 'special_order' | 'missed_pickup' | 'back_order';
  status: 'awaiting_arrival' | 'ready_for_collection' | 'overdue' | 'collected';
  date_ordered: string;
  expected_date?: string;
  notes?: string;
  created_by?: string;
}

export interface StockItem {
  id: string;
  name: string;
  current_stock: number;
  minimum_stock: number;
  location?: string;
  supplier?: string;
  supplier_contact?: string;
  last_updated: string;
  updated_by?: string;
}

export interface OrderTodo {
  id: string;
  item_name: string;
  current_stock: number;
  order_quantity: number;
  supplier: string;
  supplier_contact?: string;
  notes?: string;
  status: 'pending' | 'ordered' | 'cancelled';
  created_by?: string;
  created_at: string;
}

export interface DeliveryLog {
  id: string;
  item_name: string;
  quantity_received: number;
  supplier: string;
  received_by?: string;
  received_at: string;
  notes?: string;
}

export const usePharmacyData = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [ordersTodo, setOrdersTodo] = useState<OrderTodo[]>([]);
  const [deliveryLog, setDeliveryLog] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [prescriptionsRes, ordersRes, stockRes, todosRes, deliveryRes] = await Promise.all([
        supabase.from('prescriptions').select('*').order('date_created', { ascending: false }),
        supabase.from('customer_orders').select('*').order('date_ordered', { ascending: false }),
        supabase.from('stock_items').select('*').order('name'),
        supabase.from('orders_todo').select('*').order('created_at', { ascending: false }),
        supabase.from('delivery_log').select('*').order('received_at', { ascending: false }).limit(20)
      ]);

      if (prescriptionsRes.error) throw prescriptionsRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (stockRes.error) throw stockRes.error;
      if (todosRes.error) throw todosRes.error;
      if (deliveryRes.error) throw deliveryRes.error;

      setPrescriptions(prescriptionsRes.data as Prescription[] || []);
      setCustomerOrders(ordersRes.data as CustomerOrder[] || []);
      setStockItems(stockRes.data as StockItem[] || []);
      setOrdersTodo(todosRes.data as OrderTodo[] || []);
      setDeliveryLog(deliveryRes.data as DeliveryLog[] || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load pharmacy data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Prescription operations
  const addPrescription = async (prescription: Omit<Prescription, 'id' | 'date_created'>) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .insert([prescription])
        .select()
        .single();

      if (error) throw error;

      setPrescriptions(prev => [data as Prescription, ...prev]);
      toast({
        title: "Success",
        description: "Prescription added successfully"
      });
      return data;
    } catch (error) {
      console.error('Error adding prescription:', error);
      toast({
        title: "Error",
        description: "Failed to add prescription",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePrescriptionStatus = async (id: string, status: Prescription['status']) => {
    try {
      const updateData: any = { status };
      if (status === 'ready') updateData.date_ready = new Date().toISOString();
      if (status === 'collected') updateData.date_collected = new Date().toISOString();

      const { error } = await supabase
        .from('prescriptions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setPrescriptions(prev => prev.map(p => 
        p.id === id 
          ? { ...p, status, ...updateData }
          : p
      ));

      toast({
        title: "Success",
        description: `Prescription marked as ${status}`
      });
    } catch (error) {
      console.error('Error updating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to update prescription status",
        variant: "destructive"
      });
    }
  };

  const deletePrescription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrescriptions(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Prescription deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast({
        title: "Error",
        description: "Failed to delete prescription",
        variant: "destructive"
      });
    }
  };

  // Customer Order operations
  const addCustomerOrder = async (order: Omit<CustomerOrder, 'id' | 'date_ordered'>) => {
    try {
      const { data, error } = await supabase
        .from('customer_orders')
        .insert([order])
        .select()
        .single();

      if (error) throw error;

      setCustomerOrders(prev => [data as CustomerOrder, ...prev]);
      toast({
        title: "Success",
        description: "Customer order created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error adding customer order:', error);
      toast({
        title: "Error",
        description: "Failed to create customer order",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: CustomerOrder['status']) => {
    try {
      const { error } = await supabase
        .from('customer_orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setCustomerOrders(prev => prev.map(o => 
        o.id === id ? { ...o, status } : o
      ));

      toast({
        title: "Success",
        description: `Order marked as ${status.replace('_', ' ')}`
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomerOrders(prev => prev.filter(o => o.id !== id));
      toast({
        title: "Success",
        description: "Order deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
    }
  };

  // Stock operations
  const updateStock = async (id: string, currentStock: number) => {
    try {
      const { error } = await supabase
        .from('stock_items')
        .update({ 
          current_stock: currentStock,
          last_updated: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setStockItems(prev => prev.map(s => 
        s.id === id 
          ? { ...s, current_stock: currentStock, last_updated: new Date().toISOString() }
          : s
      ));

      toast({
        title: "Success",
        description: "Stock updated successfully"
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive"
      });
    }
  };

  const addOrderTodo = async (stockItem: StockItem, orderQuantity: number, notes?: string) => {
    try {
      const orderTodo = {
        item_name: stockItem.name,
        current_stock: stockItem.current_stock,
        order_quantity: orderQuantity,
        supplier: stockItem.supplier || 'Unknown Supplier',
        supplier_contact: stockItem.supplier_contact,
        notes: notes || `Reorder for ${stockItem.name}`,
        created_by: 'System'
      };

      const { data, error } = await supabase
        .from('orders_todo')
        .insert([orderTodo])
        .select()
        .single();

      if (error) throw error;

      setOrdersTodo(prev => [data as OrderTodo, ...prev]);
      toast({
        title: "Success",
        description: "Item added to orders to-do list"
      });
    } catch (error) {
      console.error('Error adding order todo:', error);
      toast({
        title: "Error",
        description: "Failed to add item to orders list",
        variant: "destructive"
      });
    }
  };

  const markOrderTodoAsOrdered = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders_todo')
        .update({ status: 'ordered' })
        .eq('id', id);

      if (error) throw error;

      setOrdersTodo(prev => prev.map(o => 
        o.id === id ? { ...o, status: 'ordered' as OrderTodo['status'] } : o
      ));

      toast({
        title: "Success",
        description: "Order marked as ordered"
      });
    } catch (error) {
      console.error('Error marking order as ordered:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const deleteOrderTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders_todo')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOrdersTodo(prev => prev.filter(o => o.id !== id));
      toast({
        title: "Success",
        description: "Order removed from to-do list"
      });
    } catch (error) {
      console.error('Error deleting order todo:', error);
      toast({
        title: "Error",
        description: "Failed to remove order",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    // Data
    prescriptions,
    customerOrders,
    stockItems,
    ordersTodo,
    deliveryLog,
    loading,
    
    // Actions
    fetchData,
    
    // Prescription actions
    addPrescription,
    updatePrescriptionStatus,
    deletePrescription,
    
    // Order actions
    addCustomerOrder,
    updateOrderStatus,
    deleteOrder,
    
    // Stock actions
    updateStock,
    addOrderTodo,
    markOrderTodoAsOrdered,
    deleteOrderTodo
  };
};