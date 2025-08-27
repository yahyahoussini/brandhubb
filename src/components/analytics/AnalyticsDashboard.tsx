import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign,
  Clock,
  Eye,
  MousePointer,
  Smartphone,
  Globe,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { getStringProp } from "../../utils/analyticsTypes";
import KPICards from "./KPICards";
import AcquisitionChart from "./AcquisitionChart";
import PricingFunnel from "./PricingFunnel";
import WhatsAppAnalytics from "./WhatsAppAnalytics";
import BlogAnalytics from "./BlogAnalytics";
import LeadPipeline from "./LeadPipeline";

interface AnalyticsData {
  sessions: number;
  users: number;
  whatsappLeads: number;
  pricingWAConversion: number;
  qualifiedLeadRate: number;
  closeRate: number;
  revenue: number;
  medianReplyTime: number;
  newVsReturning: { new: number; returning: number };
  topSources: Array<{ source: string; sessions: number; conversions: number }>;
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  countryStats: Array<{ country: string; sessions: number; revenue: number }>;
}

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = dateRange === 'today' 
        ? startOfDay(endDate)
        : subDays(endDate, dateRange === '7d' ? 7 : 30);

      // Fetch sessions and users
      const { data: sessions } = await supabase
        .from('analytics_sessions')
        .select('*')
        .gte('started_at', startDate.toISOString())
        .lte('started_at', endDate.toISOString());

      // Fetch WhatsApp events
      const { data: waEvents } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'whatsapp_redirect')
        .gte('occurred_at', startDate.toISOString())
        .lte('occurred_at', endDate.toISOString());

      // Fetch pricing views
      const { data: pricingViews } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'pricing_view')
        .gte('occurred_at', startDate.toISOString())
        .lte('occurred_at', endDate.toISOString());

      // Fetch leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Calculate metrics
      const totalSessions = sessions?.length || 0;
      const uniqueUsers = new Set(sessions?.map(s => s.user_id).filter(Boolean)).size;
      const whatsappLeads = waEvents?.length || 0;
      const pricingViewsCount = pricingViews?.length || 0;
      
      const qualifiedLeads = leads?.filter(l => l.status !== 'new').length || 0;
      const closedWonLeads = leads?.filter(l => l.status === 'won').length || 0;
      const totalRevenue = leads
        ?.filter(l => l.status === 'won')
        .reduce((sum, l) => sum + (l.deal_value || 0), 0) || 0;

      // Calculate conversion rates
      const pricingWAConversion = pricingViewsCount > 0 ? (whatsappLeads / pricingViewsCount) * 100 : 0;
      const qualifiedLeadRate = whatsappLeads > 0 ? (qualifiedLeads / whatsappLeads) * 100 : 0;
      const closeRate = qualifiedLeads > 0 ? (closedWonLeads / qualifiedLeads) * 100 : 0;

      // Calculate median reply time
      const replyTimes = leads?.map(l => l.reply_time_minutes).filter(Boolean) || [];
      const medianReplyTime = replyTimes.length > 0 
        ? replyTimes.sort((a, b) => a - b)[Math.floor(replyTimes.length / 2)] 
        : 0;

      // New vs returning
      const returningUsers = sessions?.filter(s => s.is_returning).length || 0;
      const newUsers = totalSessions - returningUsers;

      // Device breakdown
      const deviceStats = sessions?.reduce((acc, s) => {
        acc[s.device_type as keyof typeof acc] = (acc[s.device_type as keyof typeof acc] || 0) + 1;
        return acc;
      }, { mobile: 0, desktop: 0, tablet: 0 });

      // Top sources
      const sourceStats = sessions?.reduce((acc: Record<string, number>, s) => {
        const source = s.utm_source || 'direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      const topSources = Object.entries(sourceStats || {})
        .map(([source, sessions]) => ({
          source,
          sessions,
          conversions: waEvents?.filter(e => 
            getStringProp(e.props, 'utm_source') === source
          ).length || 0
        }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 5);

      setAnalyticsData({
        sessions: totalSessions,
        users: uniqueUsers,
        whatsappLeads,
        pricingWAConversion,
        qualifiedLeadRate,
        closeRate,
        revenue: totalRevenue,
        medianReplyTime: medianReplyTime || 0,
        newVsReturning: { new: newUsers, returning: returningUsers },
        topSources,
        deviceBreakdown: deviceStats || { mobile: 0, desktop: 0, tablet: 0 },
        countryStats: []
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {(['today', '7d', '30d'] as const).map(range => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : '30 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards data={analyticsData} />

      {/* Detailed Analytics */}
      <Tabs defaultValue="acquisition" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="acquisition" className="space-y-4">
          <AcquisitionChart data={analyticsData} />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <PricingFunnel />
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <WhatsAppAnalytics />
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <BlogAnalytics />
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <LeadPipeline />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;