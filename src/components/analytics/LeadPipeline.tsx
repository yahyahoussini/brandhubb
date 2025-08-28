import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Target,
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface DealsByService {
  count: number;
  value: number;
}

interface PipelineData {
  stages: {
    new: number;
    qualified: number;
    proposal: number;
    won: number;
    lost: number;
  };
  winRate: number;
  avgDealSize: number;
  avgTimeToClose: number;
  revenueBySource: Record<string, number>;
  dealsByService: Record<string, DealsByService>;
  timeToCloseCohorts: Record<string, number>;
}

const LeadPipeline = () => {
  const [data, setData] = useState<PipelineData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    '30d' | '90d' | 'all'
  >('30d');
  const [loading, setLoading] = useState(true);

  const fetchPipelineData = useCallback(async () => {
    try {
      // Calculate date filter
      const dateFilter =
        selectedTimeframe === 'all'
          ? new Date('2020-01-01').toISOString()
          : new Date(
              Date.now() -
                (selectedTimeframe === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000
            ).toISOString();

      // Fetch all leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', dateFilter);

      if (!leads) {
        setData({
          stages: { new: 0, qualified: 0, proposal: 0, won: 0, lost: 0 },
          winRate: 0,
          avgDealSize: 0,
          avgTimeToClose: 0,
          revenueBySource: {},
          dealsByService: {},
          timeToCloseCohorts: {},
        });
        return;
      }

      // Count leads by stage
      const stages = leads.reduce(
        (acc, lead) => {
          const status = lead.status as keyof typeof acc;
          if (acc[status] !== undefined) {
            acc[status]++;
          }
          return acc;
        },
        { new: 0, qualified: 0, proposal: 0, won: 0, lost: 0 }
      );

      // Calculate win rate
      const totalClosed = stages.won + stages.lost;
      const winRate = totalClosed > 0 ? (stages.won / totalClosed) * 100 : 0;

      // Calculate average deal size
      const wonDeals = leads.filter((l) => l.status === 'won' && l.deal_value);
      const avgDealSize =
        wonDeals.length > 0
          ? wonDeals.reduce((sum, l) => sum + (l.deal_value ?? 0), 0) /
            wonDeals.length
          : 0;

      // Calculate average time to close (in days)
      const closedLeads = leads.filter((l) => l.closed_at && l.created_at);
      const avgTimeToClose =
        closedLeads.length > 0
          ? closedLeads.reduce((sum, l) => {
              if (l.created_at && l.closed_at) {
                const created = new Date(l.created_at).getTime();
                const closed = new Date(l.closed_at).getTime();
                return sum + (closed - created) / (1000 * 60 * 60 * 24);
              }
              return sum;
            }, 0) / closedLeads.length
          : 0;

      // Revenue by source
      const revenueBySource = leads
        .filter((l) => l.status === 'won' && l.deal_value)
        .reduce((acc: Record<string, number>, l) => {
          const source = l.source ?? 'direct';
          acc[source] = (acc[source] ?? 0) + (l.deal_value ?? 0);
          return acc;
        }, {});

      // Deals by service
      const dealsByService = leads.reduce(
        (acc: Record<string, DealsByService>, l) => {
          const service = l.service_interest ?? 'general';
          if (!acc[service]) {
            acc[service] = { count: 0, value: 0 };
          }
          acc[service].count++;
          if (l.status === 'won' && l.deal_value) {
            acc[service].value += l.deal_value;
          }
          return acc;
        },
        {}
      );

      // Time to close cohorts
      const timeToCloseCohorts = closedLeads.reduce(
        (acc: Record<string, number>, l) => {
          if (l.created_at && l.closed_at) {
            const created = new Date(l.created_at).getTime();
            const closed = new Date(l.closed_at).getTime();
            const days = Math.floor(
              (closed - created) / (1000 * 60 * 60 * 24)
            );

            let cohort: string;
            if (days <= 7) cohort = '≤ 7 days';
            else if (days <= 30) cohort = '8-30 days';
            else if (days <= 60) cohort = '31-60 days';
            else cohort = '> 60 days';

            acc[cohort] = (acc[cohort] ?? 0) + 1;
          }
          return acc;
        },
        {}
      );

      setData({
        stages,
        winRate,
        avgDealSize,
        avgTimeToClose,
        revenueBySource,
        dealsByService,
        timeToCloseCohorts,
      });
    } catch (error) {
      console.error('Error fetching pipeline data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTimeframe]);

  useEffect(() => {
    void fetchPipelineData();
  }, [fetchPipelineData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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

  if (!data) return null;

  const totalLeads = Object.values(data.stages).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalRevenue = Object.values(data.revenueBySource).reduce(
    (sum, revenue) => sum + revenue,
    0
  );

  return (
    <div className="space-y-6">
      {/* Timeframe Filter */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Lead Pipeline & Revenue Analysis
        </h3>
        <div className="flex gap-2">
          {(['30d', '90d', 'all'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedTimeframe(timeframe);
              }}
            >
              {timeframe === 'all' ? 'All Time' : timeframe.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          {
            stage: 'new',
            label: 'New Leads',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
          },
          {
            stage: 'qualified',
            label: 'Qualified',
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
          },
          {
            stage: 'proposal',
            label: 'Proposal',
            icon: FileText,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
          },
          {
            stage: 'won',
            label: 'Won',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
          },
          {
            stage: 'lost',
            label: 'Lost',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
          },
        ].map(({ stage, label, icon: Icon, color, bgColor }) => (
          <Card key={stage}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className={`p-1 rounded-full ${bgColor}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stages[stage as keyof typeof data.stages]}
              </div>
              <p className="text-xs text-muted-foreground">
                {`${
                  totalLeads > 0
                    ? (
                        (data.stages[stage as keyof typeof data.stages] /
                          totalLeads) *
                        100
                      ).toFixed(1)
                    : 0
                }% of total`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{`${data.winRate.toFixed(
              1
            )}%`}</div>
            <p className="text-xs text-muted-foreground">Of closed deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Avg Deal Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {`$${data.avgDealSize.toFixed(0)}`}
            </div>
            <p className="text-xs text-muted-foreground">Per won deal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Time to Close
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {`${data.avgTimeToClose.toFixed(0)}d`}
            </div>
            <p className="text-xs text-muted-foreground">From lead to close</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {`$${totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.revenueBySource)
                .sort(([, a], [, b]) => b - a)
                .map(([source, revenue]) => {
                  const percentage =
                    totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;

                  return (
                    <div key={source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{source}</span>
                        <Badge>
                          {`$${revenue.toLocaleString()} (${percentage.toFixed(
                            1
                          )}%)`}
                        </Badge>
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

              {Object.keys(data.revenueBySource).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No revenue data available for this period.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Deals by Service */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.dealsByService)
                .sort(([, a], [, b]) => b.value - a.value)
                .map(([service, serviceData]) => (
                  <div key={service} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{service}</h4>
                      <Badge variant="outline">{`${serviceData.count} leads`}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {`Revenue: $${serviceData.value.toLocaleString()}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {`Avg: $${
                        serviceData.count > 0
                          ? (serviceData.value / serviceData.count).toFixed(0)
                          : 0
                      } per lead`}
                    </div>
                  </div>
                ))}

              {Object.keys(data.dealsByService).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No service data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time to Close Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Time to Close Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.timeToCloseCohorts).map(
                ([cohort, count]) => {
                  const total = Object.values(data.timeToCloseCohorts).reduce(
                    (sum, c) => sum + c,
                    0
                  );
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={cohort} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cohort}</span>
                        <Badge variant="outline">
                          {`${count} deals (${percentage.toFixed(0)}%)`}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}

              {Object.keys(data.timeToCloseCohorts).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No closed deals data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Health */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {data.stages.new + data.stages.qualified}
                  </div>
                  <p className="text-sm text-blue-700">Active Pipeline</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {`$${(
                      (data.stages.qualified + data.stages.proposal) *
                      data.avgDealSize
                    ).toFixed(0)}`}
                  </div>
                  <p className="text-sm text-green-700">Potential Revenue</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Pipeline Insights:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>
                    • {data.winRate > 50 ? 'Strong' : 'Average'} win rate of{' '}
                    {`${data.winRate.toFixed(1)}%`}
                  </li>
                  <li>
                    • {data.avgTimeToClose < 30 ? 'Fast' : 'Slow'} sales cycle (
                    {`${data.avgTimeToClose.toFixed(0)} days`})
                  </li>
                  <li>{`• $${data.avgDealSize.toFixed(0)} average deal size`}</li>
                  <li>
                    • {data.stages.qualified} qualified leads ready for
                    proposals
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadPipeline;
