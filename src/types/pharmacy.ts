export interface Prescription {
  id: string;
  pharmacyId: string;
  patientName: string;
  patientDob: string;
  patientPhone?: string;
  medication: string;
  dosage: string;
  quantity: number;
  prescriber: string;
  status: 'pending' | 'ready' | 'collected';
  dateCreated: string;
  dateReady?: string;
  dateCollected?: string;
  insuranceInfo?: string;
  specialInstructions?: string;
}

export interface CustomerOrder {
  id: string;
  pharmacyId: string;
  customerName: string;
  customerPhone: string;
  itemName: string;
  orderType: 'special_order' | 'missed_pickup' | 'back_order';
  status: 'awaiting_arrival' | 'ready_for_collection' | 'overdue';
  dateOrdered: string;
  expectedDate?: string;
  notes?: string;
}

export interface StockItem {
  id: string;
  pharmacyId: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  location: string;
  supplier: string;
  lastUpdated: string;
  isLowStock: boolean;
}

export interface OrderToDo {
  id: string;
  pharmacyId: string;
  itemName: string;
  currentStock: number;
  orderQuantity: number;
  supplier: string;
  supplierContact: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  status: 'pending' | 'ordered' | 'cancelled';
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

export type PharmacyView = 'dashboard' | 'prescriptions' | 'orders' | 'stock' | 'settings';