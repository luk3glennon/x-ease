-- Add renewal tracking fields to prescriptions table
ALTER TABLE public.prescriptions ADD COLUMN renewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.prescriptions ADD COLUMN renewal_due_date DATE;

-- Create reminder_events table for tracking renewal reminders
CREATE TABLE public.reminder_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE NOT NULL,
    reminder_type TEXT NOT NULL, -- 'renewal_reminder', 'follow_up', etc.
    channel TEXT NOT NULL, -- 'email', 'sms', 'phone'
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    sent_by TEXT,
    notes TEXT,
    pharmacy_id UUID NOT NULL DEFAULT gen_random_uuid()
);

-- Enable RLS on reminder_events table
ALTER TABLE public.reminder_events ENABLE ROW LEVEL SECURITY;

-- Create policy for reminder_events
CREATE POLICY "Allow all operations on reminder_events" 
ON public.reminder_events 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_reminder_events_prescription_id ON public.reminder_events(prescription_id);
CREATE INDEX idx_reminder_events_pharmacy_id ON public.reminder_events(pharmacy_id);
CREATE INDEX idx_prescriptions_renewal_due_date ON public.prescriptions(renewal_due_date);

-- Create trigger for reminder_events updated_at if needed
CREATE TRIGGER update_reminder_events_updated_at
BEFORE UPDATE ON public.reminder_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();