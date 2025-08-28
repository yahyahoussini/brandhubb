import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  Clock,
  Target,
  MousePointer,
  CheckCircle,
} from 'lucide-react';

interface KPIData {
  sessions: number;
  users: number;
  whatsappLeads: number;
  pricingWAConversion: number;
  qualifiedLeadRate: number;
  closeRate: number;
  revenue: number;
  medianReplyTime: number;
}

interface KPICardsProps {
  data: KPIData;
}

const KPICards = ({ data }: KPICardsProps) => {
  const kpis = [
    {
      title: 'WhatsApp Leads',
      value: data.whatsappLeads,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+12%',
      primary: true,
    },
    {
      title: 'Pricing → WA Conversion',
      value: `${data.pricingWAConversion.toFixed(1)}%`,
      icon: MousePointer,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+5%',
      primary: true,
    },
    {
      title: 'Qualified Lead Rate',
      value: `${data.qualifiedLeadRate.toFixed(1)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8%',
      primary: true,
    },
    {
      title: 'Close Rate',
      value: `${data.closeRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+3%',
      primary: true,
    },
    {
      title: 'Revenue',
      value: `$${data.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+25%',
      primary: true,
    },
    {
      title: 'Median Reply Time',
      value: `${data.medianReplyTime}m`,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-2m',
      primary: true,
    },
    {
      title: 'Sessions',
      value: data.sessions.toLocaleString(),
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      trend: '+18%',
      primary: false,
    },
    {
      title: 'Users',
      value: data.users.toLocaleString(),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      trend: '+15%',
      primary: false,
    },
  ];

  // Separate primary and secondary KPIs
  const primaryKPIs = kpis.filter((kpi) => kpi.primary);
  const secondaryKPIs = kpis.filter((kpi) => !kpi.primary);

  return (
    <div className="space-y-4">
      {/* Primary KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Primary KPIs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {primaryKPIs.map((kpi, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      kpi.trend.startsWith('+')
                        ? 'text-green-700 bg-green-100'
                        : kpi.trend.startsWith('-') &&
                            kpi.title.includes('Reply')
                          ? 'text-green-700 bg-green-100' // Negative reply time is good
                          : 'text-red-700 bg-red-100'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpi.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Secondary KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Secondary KPIs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secondaryKPIs.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold">{kpi.value}</div>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpi.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPICards;
