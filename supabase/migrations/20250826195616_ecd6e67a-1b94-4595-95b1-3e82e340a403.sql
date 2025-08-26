-- Add status tracking fields to customer_orders table
ALTER TABLE public.customer_orders 
ADD COLUMN IF NOT EXISTS arrived_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS collected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE;

-- Add index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_customer_orders_status ON public.customer_orders(status);
CREATE INDEX IF NOT EXISTS idx_customer_orders_arrived_at ON public.customer_orders(arrived_at) WHERE arrived_at IS NOT NULL;