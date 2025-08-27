-- Create analytics events table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  user_id UUID,
  click_id UUID,
  props JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics sessions table  
CREATE TABLE public.analytics_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  page_views INTEGER DEFAULT 0,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  country TEXT,
  device_type TEXT,
  is_returning BOOLEAN DEFAULT false,
  landing_page TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leads table for tracking conversion funnel
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  click_id UUID,
  phone TEXT,
  email TEXT,
  service_interest TEXT,
  budget_band TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'proposal', 'won', 'lost')),
  deal_value DECIMAL(10,2),
  source TEXT,
  medium TEXT,
  campaign TEXT,
  whatsapp_conversation_id TEXT,
  first_contact_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  qualified_at TIMESTAMP WITH TIME ZONE,
  proposal_sent_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  reply_time_minutes INTEGER,
  reason_lost TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS policies for analytics_events
CREATE POLICY "Admin can view all analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can insert analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for analytics_sessions  
CREATE POLICY "Admin can view all analytics sessions" 
ON public.analytics_sessions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can insert/update analytics sessions" 
ON public.analytics_sessions 
FOR ALL 
WITH CHECK (true);

-- RLS policies for leads
CREATE POLICY "Admin can manage all leads" 
ON public.leads 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Add indexes for performance
CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_occurred_at ON public.analytics_events(occurred_at);
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_props ON public.analytics_events USING GIN(props);

CREATE INDEX idx_analytics_sessions_started_at ON public.analytics_sessions(started_at);
CREATE INDEX idx_analytics_sessions_utm_source ON public.analytics_sessions(utm_source);

CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_source ON public.leads(source);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_analytics_sessions_updated_at
BEFORE UPDATE ON public.analytics_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at  
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();