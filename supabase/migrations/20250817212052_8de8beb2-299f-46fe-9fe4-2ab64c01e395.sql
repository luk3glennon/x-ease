-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_dob DATE,
  patient_phone TEXT,
  patient_address TEXT,
  medication TEXT NOT NULL,
  dosage TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  prescriber TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'collected')),
  date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_ready TIMESTAMP WITH TIME ZONE,
  date_collected TIMESTAMP WITH TIME ZONE,
  insurance_info TEXT,
  special_instructions TEXT,
  created_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer_orders table
CREATE TABLE public.customer_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  item_name TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('special_order', 'missed_pickup', 'back_order')),
  status TEXT NOT NULL DEFAULT 'awaiting_arrival' CHECK (status IN ('awaiting_arrival', 'ready_for_collection', 'overdue', 'collected')),
  date_ordered TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expected_date DATE,
  notes TEXT,
  created_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock_items table
CREATE TABLE public.stock_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 10,
  location TEXT,
  supplier TEXT,
  supplier_contact TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by TEXT
);

-- Create orders_todo table
CREATE TABLE public.orders_todo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  order_quantity INTEGER NOT NULL,
  supplier TEXT NOT NULL,
  supplier_contact TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'cancelled')),
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery_log table
CREATE TABLE public.delivery_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  quantity_received INTEGER NOT NULL,
  supplier TEXT NOT NULL,
  received_by TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_todo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - in production you'd restrict by pharmacy_id)
CREATE POLICY "Allow all operations on prescriptions" ON public.prescriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on customer_orders" ON public.customer_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on stock_items" ON public.stock_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on orders_todo" ON public.orders_todo FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on delivery_log" ON public.delivery_log FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_orders_updated_at
  BEFORE UPDATE ON public.customer_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_todo_updated_at
  BEFORE UPDATE ON public.orders_todo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.prescriptions (patient_name, medication, dosage, quantity, prescriber, status) VALUES
  ('Sarah Johnson', 'Amoxicillin 500mg', '500mg', 30, 'Dr. Smith', 'pending'),
  ('Mike Chen', 'Lisinopril 10mg', '10mg', 90, 'Dr. Brown', 'ready'),
  ('Emma Davis', 'Metformin 1000mg', '1000mg', 60, 'Dr. Wilson', 'collected');

INSERT INTO public.customer_orders (customer_name, customer_phone, item_name, order_type, status) VALUES
  ('John Doe', '555-0123', 'Insulin Pens', 'special_order', 'awaiting_arrival'),
  ('Jane Smith', '555-0456', 'Blood Pressure Monitor', 'back_order', 'ready_for_collection'),
  ('Bob Wilson', '555-0789', 'Pain Relief Gel', 'missed_pickup', 'overdue');

INSERT INTO public.stock_items (name, current_stock, minimum_stock, location, supplier, supplier_contact) VALUES
  ('Paracetamol 500mg', 5, 50, 'Shelf A1', 'MedSupply Co', 'orders@medsupply.com'),
  ('Ibuprofen 400mg', 25, 30, 'Shelf A2', 'PharmaCorp', 'sales@pharmacorp.com'),
  ('Aspirin 75mg', 80, 40, 'Shelf B1', 'MedSupply Co', 'orders@medsupply.com');

INSERT INTO public.orders_todo (item_name, current_stock, order_quantity, supplier, supplier_contact, notes) VALUES
  ('Paracetamol 500mg', 5, 100, 'MedSupply Co', 'orders@medsupply.com', 'Urgent - very low stock'),
  ('Vitamin D3', 15, 50, 'HealthPlus', 'orders@healthplus.com', 'Regular restock');

INSERT INTO public.delivery_log (item_name, quantity_received, supplier, received_by, notes) VALUES
  ('Amoxicillin 500mg', 200, 'MedSupply Co', 'Sarah T.', 'All items in good condition'),
  ('Blood Test Strips', 50, 'DiabCare', 'Mike R.', 'Expiry date checked');