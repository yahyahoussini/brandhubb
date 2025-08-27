import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Globe, Smartphone, Users } from "lucide-react";

interface AcquisitionData {
  topSources: Array<{ source: string; sessions: number; conversions: number }>;
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  newVsReturning: { new: number; returning: number };
}

interface AcquisitionChartProps {
  data: AcquisitionData;
}

const AcquisitionChart = ({ data }: AcquisitionChartProps) => {
  const totalDevices = data.deviceBreakdown.mobile + data.deviceBreakdown.desktop + data.deviceBreakdown.tablet;
  const totalUsers = data.newVsReturning.new + data.newVsReturning.returning;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Top Traffic Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topSources.map((source, index) => {
              const conversionRate = source.sessions > 0 ? (source.conversions / source.sessions) * 100 : 0;
              return (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {source.source === 'direct' ? 'Direct' : source.source}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {source.sessions} sessions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {source.conversions} conversions
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conversionRate.toFixed(1)}% CR
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.deviceBreakdown).map(([device, count]) => {
              const percentage = totalDevices > 0 ? (count / totalDevices) * 100 : 0;
              return (
                <div key={device} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-medium">{device}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* New vs Returning Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            New vs Returning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'New Users', count: data.newVsReturning.new, color: 'bg-blue-500' },
              { label: 'Returning Users', count: data.newVsReturning.returning, color: 'bg-green-500' }
            ].map(({ label, count, color }) => {
              const percentage = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
              return (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{label}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Total Sessions</span>
              <span className="font-bold text-lg">{totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">WhatsApp Clicks</span>
              <span className="font-bold text-lg">
                {data.topSources.reduce((sum, s) => sum + s.conversions, 0)}
              </span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Detailed funnel data available in Pricing tab
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcquisitionChart;