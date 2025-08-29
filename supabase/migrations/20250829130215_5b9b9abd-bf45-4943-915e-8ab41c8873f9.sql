-- Create organization settings table
CREATE TABLE public.organization_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'MedFlow Pharmacy',
  license_number text,
  address text,
  phone text,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on organization_settings
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for organization_settings
CREATE POLICY "Allow all operations on organization_settings" 
ON public.organization_settings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create notification settings table
CREATE TABLE public.notification_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id uuid NOT NULL DEFAULT gen_random_uuid(),
  sms_enabled boolean NOT NULL DEFAULT true,
  email_enabled boolean NOT NULL DEFAULT true,
  ready_pickup_sms_template text DEFAULT 'Your prescription {medication} is ready for pickup at {pharmacy_name}. Please collect within 7 days.',
  ready_pickup_email_template text DEFAULT 'Dear {patient_name}, your prescription for {medication} is ready for pickup...',
  overdue_reminder_sms_template text DEFAULT 'Reminder: Your prescription {medication} is still waiting for pickup at {pharmacy_name}.',
  overdue_reminder_email_template text DEFAULT 'Dear {patient_name}, this is a friendly reminder that your prescription...',
  special_order_sms_template text DEFAULT 'Good news! Your special order {item_name} has arrived at {pharmacy_name}.',
  special_order_email_template text DEFAULT 'Dear {customer_name}, we''re pleased to inform you that your special order...',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on notification_settings
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for notification_settings
CREATE POLICY "Allow all operations on notification_settings" 
ON public.notification_settings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'pharmacist', 'technician');

-- Create user profiles table with roles
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  pharmacy_id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  role user_role NOT NULL DEFAULT 'technician',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_profiles
CREATE POLICY "Allow all operations on user_profiles" 
ON public.user_profiles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for updating updated_at column
CREATE TRIGGER update_organization_settings_updated_at
  BEFORE UPDATE ON public.organization_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default organization settings
INSERT INTO public.organization_settings (name, pharmacy_id) 
VALUES ('MedFlow Pharmacy', gen_random_uuid());

-- Insert default notification settings
INSERT INTO public.notification_settings (pharmacy_id) 
VALUES (gen_random_uuid());