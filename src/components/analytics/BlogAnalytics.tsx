import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, MousePointer, ArrowRight } from "lucide-react";
import { getStringProp, getNumberProp, getBooleanProp } from "../../utils/analyticsTypes";

interface BlogData {
  topPosts: Array<{
    slug: string;
    title: string;
    views: number;
    avgReadTime: number;
    scroll75Rate: number;
    assistedLeads: number;
  }>;
  totalViews: number;
  totalAssistedLeads: number;
  avgReadTime: number;
  ctaClicksByPost: Record<string, { inline: number; banner: number; footer: number }>;
}

const BlogAnalytics = () => {
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogAnalytics();
  }, []);

  const fetchBlogAnalytics = async () => {
    try {
      // Fetch blog read events
      const { data: blogReads } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'blog_read')
        .gte('occurred_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Fetch blog CTA clicks
      const { data: blogCTAClicks } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'blog_cta_click')
        .gte('occurred_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Fetch WhatsApp clicks to calculate assisted leads
      const { data: waClicks } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', 'whatsapp_redirect')
        .gte('occurred_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Process blog read data by post
      const postStats: Record<string, any> = {};
      
      blogReads?.forEach(read => {
        const slug = getStringProp(read.props, 'post_slug');
        if (!slug) return;

        if (!postStats[slug]) {
          postStats[slug] = {
            slug,
            title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            views: 0,
            totalReadTime: 0,
            scroll75Count: 0,
            assistedLeads: 0
          };
        }

        postStats[slug].views++;
        const readTime = getNumberProp(read.props, 'read_time_sec');
        if (readTime) {
          postStats[slug].totalReadTime += readTime;
        }
        if (getBooleanProp(read.props, 'scroll_75')) {
          postStats[slug].scroll75Count++;
        }
      });

      // Calculate assisted leads (sessions that read blog then clicked WA within 7 days)
      const blogSessions = new Set(blogReads?.map(r => r.session_id));
      const assistedLeads = waClicks?.filter(wa => 
        blogSessions.has(wa.session_id)
      ) || [];

      // Count assisted leads per post (approximation based on session timing)
      assistedLeads.forEach(wa => {
        const sessionBlogReads = blogReads?.filter(br => 
          br.session_id === wa.session_id && 
          new Date(br.occurred_at) < new Date(wa.occurred_at)
        ) || [];
        
        // Attribute to the last blog post read in the session
        if (sessionBlogReads.length > 0) {
          const lastRead = sessionBlogReads[sessionBlogReads.length - 1];
          const slug = getStringProp(lastRead.props, 'post_slug');
          if (slug && postStats[slug]) {
            postStats[slug].assistedLeads++;
          }
        }
      });

      // Process CTA clicks by post and type
      const ctaClicksByPost: Record<string, any> = {};
      blogCTAClicks?.forEach(cta => {
        const slug = getStringProp(cta.props, 'post_slug');
        const type = getStringProp(cta.props, 'cta_type', 'unknown');
        
        if (!slug) return;
        
        if (!ctaClicksByPost[slug]) {
          ctaClicksByPost[slug] = { inline: 0, banner: 0, footer: 0 };
        }
        
        if (ctaClicksByPost[slug][type] !== undefined) {
          ctaClicksByPost[slug][type]++;
        }
      });

      // Convert to array and calculate averages
      const topPosts = Object.values(postStats).map((post: any) => ({
        ...post,
        avgReadTime: post.views > 0 ? Math.round(post.totalReadTime / post.views) : 0,
        scroll75Rate: post.views > 0 ? (post.scroll75Count / post.views) * 100 : 0
      })).sort((a: any, b: any) => b.views - a.views);

      const totalViews = blogReads?.length || 0;
      const totalAssistedLeads = assistedLeads.length;
      const avgReadTime = blogReads?.length > 0 
        ? Math.round(blogReads.reduce((sum, r) => sum + getNumberProp(r.props, 'read_time_sec', 0), 0) / blogReads.length)
        : 0;

      setData({
        topPosts,
        totalViews,
        totalAssistedLeads,
        avgReadTime,
        ctaClicksByPost
      });

    } catch (error) {
      console.error('Error fetching blog analytics:', error);
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
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalViews}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Assisted Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAssistedLeads}</div>
            <p className="text-xs text-muted-foreground">Blog → WhatsApp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Avg Read Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(data.avgReadTime / 60)}m {data.avgReadTime % 60}s</div>
            <p className="text-xs text-muted-foreground">Per article</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Top Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.topPosts.length}</div>
            <p className="text-xs text-muted-foreground">With engagement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPosts.slice(0, 6).map((post, index) => (
                <div key={post.slug} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-muted-foreground">/{post.slug}</p>
                    </div>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Views:</span>
                      <span className="ml-1 font-medium">{post.views}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Read:</span>
                      <span className="ml-1 font-medium">{Math.floor(post.avgReadTime / 60)}m</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Scroll:</span>
                      <span className="ml-1 font-medium">{post.scroll75Rate.toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Leads:</span>
                      <span className="ml-1 font-medium">{post.assistedLeads}</span>
                    </div>
                  </div>
                </div>
              ))}

              {data.topPosts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No blog analytics data available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CTA Performance */}
        <Card>
          <CardHeader>
            <CardTitle>CTA Performance by Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.ctaClicksByPost)
                .sort(([,a], [,b]) => (b.inline + b.banner + b.footer) - (a.inline + a.banner + a.footer))
                .slice(0, 6)
                .map(([slug, ctas]) => {
                  const totalClicks = ctas.inline + ctas.banner + ctas.footer;
                  const post = data.topPosts.find(p => p.slug === slug);
                  
                  return (
                    <div key={slug} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {post?.title || slug.replace(/-/g, ' ')}
                        </h4>
                        <Badge>{totalClicks} clicks</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(ctas).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{type}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{count}</span>
                              <div className="w-16 bg-gray-200 rounded-full h-1">
                                <div
                                  className="bg-primary h-1 rounded-full"
                                  style={{ width: totalClicks > 0 ? `${(count / totalClicks) * 100}%` : '0%' }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {Object.keys(data.ctaClicksByPost).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No CTA click data available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Blog Impact Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Blog Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {data.totalAssistedLeads}
                </div>
                <p className="text-sm text-muted-foreground">Total Assisted Leads</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.totalViews > 0 ? ((data.totalAssistedLeads / data.totalViews) * 100).toFixed(1) : 0}% conversion rate
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {data.topPosts.reduce((sum, p) => sum + p.scroll75Rate, 0) / Math.max(data.topPosts.length, 1)}%
                </div>
                <p className="text-sm text-muted-foreground">Avg Scroll Depth</p>
                <p className="text-xs text-muted-foreground mt-1">75% or more</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Object.values(data.ctaClicksByPost).reduce((sum, ctas) => 
                    sum + ctas.inline + ctas.banner + ctas.footer, 0
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Total CTA Clicks</p>
                <p className="text-xs text-muted-foreground mt-1">All placements</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium mb-2">Content Optimization Tips:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Focus on top-performing posts for promotion and internal linking</li>
                <li>• Improve CTA placement in posts with high views but low conversion</li>
                <li>• Analyze read time vs scroll depth to identify engagement issues</li>
                <li>• Create more content similar to your best-performing posts</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogAnalytics;