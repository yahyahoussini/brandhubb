import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, TrendingUp, Users } from "lucide-react";
import { getStringProp } from "../../utils/analyticsTypes";

interface WhatsAppData {
  totalLeads: number;
  leadsBySource: Record<string, number>;
  leadsByService: Record<string, number>;
  replyTimeStats: {
    median: number;
    under15min: number;
    under1hour: number;
    over1hour: number;
  };
  conversionBySource: Record<string, { leads: number; qualified: number; closed: number }>;
}

const WhatsAppAnalytics = () => {
  const [data, setData] = useState<WhatsAppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhatsAppAnalytics();
  }, []);

  const fetchWhatsAppAnalytics = async () => {
    try {
      // Fetch WhatsApp leads (clicks/redirects)
      const { data: waEvents } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'whatsapp_redirect')
        .gte('occurred_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Fetch lead data
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Process WhatsApp events by source
      const leadsBySource = waEvents?.reduce((acc: Record<string, number>, event) => {
        const source = getStringProp(event.props, 'utm_source') || getStringProp(event.props, 'source', 'direct');
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {}) || {};

      // Process by service
      const leadsByService = waEvents?.reduce((acc: Record<string, number>, event) => {
        const service = getStringProp(event.props, 'service', 'general');
        acc[service] = (acc[service] || 0) + 1;
        return acc;
      }, {}) || {};

      // Calculate reply time statistics
      const replyTimes = leads?.map(l => l.reply_time_minutes).filter(Boolean) || [];
      const sortedReplyTimes = replyTimes.sort((a, b) => a - b);
      
      const median = sortedReplyTimes.length > 0 
        ? sortedReplyTimes[Math.floor(sortedReplyTimes.length / 2)] 
        : 0;

      const under15min = replyTimes.filter(t => t <= 15).length;
      const under1hour = replyTimes.filter(t => t <= 60).length;
      const over1hour = replyTimes.filter(t => t > 60).length;

      // Calculate conversion by source
      const conversionBySource: Record<string, any> = {};
      
      Object.keys(leadsBySource).forEach(source => {
        const sourceLeads = leads?.filter(l => l.source === source) || [];
        const qualified = sourceLeads.filter(l => l.status !== 'new').length;
        const closed = sourceLeads.filter(l => l.status === 'won').length;
        
        conversionBySource[source] = {
          leads: leadsBySource[source],
          qualified,
          closed
        };
      });

      setData({
        totalLeads: waEvents?.length || 0,
        leadsBySource,
        leadsByService,
        replyTimeStats: {
          median,
          under15min,
          under1hour,
          over1hour
        },
        conversionBySource
      });

    } catch (error) {
      console.error('Error fetching WhatsApp analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-40 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Total WA Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalLeads}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Median Reply Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.replyTimeStats.median}m</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Fast Replies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.replyTimeStats.under15min}</div>
            <p className="text-xs text-muted-foreground">Under 15 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(data.leadsByService).length}</div>
            <p className="text-xs text-muted-foreground">Different services</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.leadsBySource)
                .sort(([,a], [,b]) => b - a)
                .map(([source, count]) => {
                  const percentage = (count / data.totalLeads) * 100;
                  const conversion = data.conversionBySource[source];
                  const qualifiedRate = conversion?.leads > 0 ? (conversion.qualified / conversion.leads) * 100 : 0;
                  
                  return (
                    <div key={source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{source}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{count} leads</Badge>
                          <Badge variant="secondary">{qualifiedRate.toFixed(0)}% qualified</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Leads by Service */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.leadsByService)
                .sort(([,a], [,b]) => b - a)
                .map(([service, count]) => {
                  const percentage = (count / data.totalLeads) * 100;
                  
                  return (
                    <div key={service} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{service}</span>
                        <Badge>{count} leads</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Reply Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Under 15 minutes', count: data.replyTimeStats.under15min, color: 'bg-green-600' },
                { label: '15 min - 1 hour', count: data.replyTimeStats.under1hour - data.replyTimeStats.under15min, color: 'bg-yellow-600' },
                { label: 'Over 1 hour', count: data.replyTimeStats.over1hour, color: 'bg-red-600' }
              ].map(({ label, count, color }) => {
                const total = data.replyTimeStats.under1hour + data.replyTimeStats.over1hour;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{label}</span>
                      <Badge variant="outline">{count} leads ({percentage.toFixed(0)}%)</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">✅ Strengths</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• {data.replyTimeStats.under15min} leads replied to within 15 minutes</li>
                  <li>• {Object.keys(data.leadsBySource).length} different traffic sources</li>
                  <li>• {Object.keys(data.leadsByService).length} services generating leads</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">⚡ Opportunities</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Improve response time for {data.replyTimeStats.over1hour} slow replies</li>
                  <li>• Focus on top-performing sources for scaling</li>
                  <li>• Analyze service-specific conversion patterns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppAnalytics;