import { useState, useEffect } from "react";
import { supabase } from "@/shared/api/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ArrowDown, MousePointer, Eye, Clock } from "lucide-react";
import { getStringProp } from "../lib/analyticsTypes";

interface FunnelStep {
  name: string;
  count: number;
  percentage: number;
  dropoff?: number;
}

const PricingFunnel = () => {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [ctaPerformance, setCTAPerformance] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricingAnalytics();
  }, []);

  const fetchPricingAnalytics = async () => {
    try {
      // Get pricing page views
      const { data: pricingViews } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'pricing_view')
        .gte('occurred_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get WhatsApp clicks from pricing
      const { data: waClicks } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'pricing_cta_click')
        .gte('occurred_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get page views for landing pages
      const { data: pageViews } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'page_view')
        .gte('occurred_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Calculate funnel
      const landingViews = pageViews?.filter(pv => {
        const path = getStringProp(pv.props, 'path');
        return path === '/' || path.startsWith('/services');
      }).length || 0;

      const pricingPageViews = pricingViews?.length || 0;
      const whatsappClicks = waClicks?.length || 0;

      const funnel: FunnelStep[] = [
        {
          name: 'Landing Page Views',
          count: landingViews,
          percentage: 100
        },
        {
          name: 'Pricing Page Views', 
          count: pricingPageViews,
          percentage: landingViews > 0 ? (pricingPageViews / landingViews) * 100 : 0,
          dropoff: landingViews - pricingPageViews
        },
        {
          name: 'WhatsApp Clicks',
          count: whatsappClicks,
          percentage: pricingPageViews > 0 ? (whatsappClicks / pricingPageViews) * 100 : 0,
          dropoff: pricingPageViews - whatsappClicks
        }
      ];

      setFunnelData(funnel);

      // Calculate CTA performance by placement
      const ctaByPlacement = waClicks?.reduce((acc: Record<string, any>, click) => {
        const placement = getStringProp(click.props, 'placement', 'unknown');
        if (!acc[placement]) {
          acc[placement] = { clicks: 0, services: new Set() };
        }
        acc[placement].clicks++;
        const service = getStringProp(click.props, 'service');
        if (service) {
          acc[placement].services.add(service);
        }
        return acc;
      }, {});

      setCTAPerformance(ctaByPlacement || {});

    } catch (error) {
      console.error('Error fetching pricing analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="h-40 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="h-40 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5" />
            Pricing Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((step, index) => (
              <div key={step.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{step.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{step.count.toLocaleString()}</Badge>
                    <Badge variant="secondary">{step.percentage.toFixed(1)}%</Badge>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>

                {/* Dropoff indicator */}
                {step.dropoff !== undefined && step.dropoff > 0 && (
                  <div className="text-sm text-red-600 flex items-center gap-1">
                    <ArrowDown className="h-3 w-3" />
                    {step.dropoff.toLocaleString()} users dropped off
                  </div>
                )}

                {/* Separator */}
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="h-5 w-5" />
            CTA Performance by Placement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(ctaPerformance).map(([placement, data]) => (
              <div key={placement} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{placement}</h4>
                  <Badge>{data.clicks} clicks</Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Services: {Array.from(data.services).join(', ') || 'Various'}
                </div>
                
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(100, (data.clicks / Math.max(...Object.values(ctaPerformance).map((d: any) => d.clicks))) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            ))}

            {Object.keys(ctaPerformance).length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No CTA click data available for the selected period.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Behavior Insights */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Pricing Page Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {funnelData.find(f => f.name === 'Pricing Page Views')?.count || 0}
              </div>
              <p className="text-sm text-muted-foreground">Total Page Views</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {funnelData.find(f => f.name === 'WhatsApp Clicks')?.percentage.toFixed(1) || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Pricing → WA Conversion</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(ctaPerformance).length}
              </div>
              <p className="text-sm text-muted-foreground">Active CTA Placements</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Optimization Tips:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Test different CTA placements to improve conversion rates</li>
              <li>• Add scroll depth tracking to see where users drop off</li>
              <li>• A/B test pricing page layouts and messaging</li>
              <li>• Consider exit-intent popups for users who don't convert</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingFunnel;