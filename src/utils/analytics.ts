import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface SessionInfo {
  id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  country?: string;
  device_type: string;
  landing_page: string;
  referrer?: string;
}

export class Analytics {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initializeSession();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private async initializeSession() {
    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      
      // Get or set session info
      const sessionInfo: SessionInfo = {
        id: this.sessionId,
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        device_type: this.getDeviceType(),
        landing_page: window.location.pathname,
        referrer: document.referrer || undefined,
      };

      // Store UTM params in session for future events
      if (sessionInfo.utm_source) {
        sessionStorage.setItem('analytics_utm', JSON.stringify({
          utm_source: sessionInfo.utm_source,
          utm_medium: sessionInfo.utm_medium,
          utm_campaign: sessionInfo.utm_campaign,
          utm_content: sessionInfo.utm_content,
          utm_term: sessionInfo.utm_term,
        }));
      }

      // Create or update session
      await supabase
        .from('analytics_sessions')
        .upsert({
          id: this.sessionId,
          utm_source: sessionInfo.utm_source,
          utm_medium: sessionInfo.utm_medium,
          utm_campaign: sessionInfo.utm_campaign,
          utm_content: sessionInfo.utm_content,
          utm_term: sessionInfo.utm_term,
          device_type: sessionInfo.device_type,
          landing_page: sessionInfo.landing_page,
          referrer: sessionInfo.referrer,
          page_views: 1,
        });

    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getStoredUTM() {
    try {
      const stored = sessionStorage.getItem('analytics_utm');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  async track(eventName: string, properties: Record<string, any> = {}) {
    try {
      const utm = this.getStoredUTM();
      
      await supabase
        .from('analytics_events')
        .insert({
          event_name: eventName,
          session_id: this.sessionId,
          user_id: this.userId,
          props: {
            ...properties,
            ...utm,
            page: window.location.pathname,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }
        });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async pageView(path?: string) {
    await this.track('page_view', {
      path: path || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    });

    // Update session page views using RPC function
    try {
      await supabase.rpc('increment_page_views', { session_id: this.sessionId });
    } catch (error) {
      console.error('Error incrementing page views:', error);
    }
  }

  async pricingView(plansVisible: string[], faqOpened: boolean = false) {
    await this.track('pricing_view', {
      plans_visible: plansVisible,
      faq_opened: faqOpened,
    });
  }

  async pricingCTAClick(placement: string, service: string, clickId?: string) {
    const cId = clickId || uuidv4();
    await this.track('pricing_cta_click', {
      placement,
      service,
      click_id: cId,
      whatsapp_link_type: 'wa.me',
      prefilled_text: true,
    });
    return cId;
  }

  async whatsappRedirect(clickId: string, service: string, placement: string, destinationPhone: string) {
    await this.track('whatsapp_redirect', {
      click_id: clickId,
      service,
      placement,
      destination_phone: destinationPhone,
    });
  }

  async blogRead(postSlug: string, readTimeSeconds: number, scroll75: boolean) {
    await this.track('blog_read', {
      post_slug: postSlug,
      read_time_sec: readTimeSeconds,
      scroll_75: scroll75,
    });
  }

  async blogCTAClick(postSlug: string, ctaType: string) {
    await this.track('blog_cta_click', {
      post_slug: postSlug,
      cta_type: ctaType,
    });
  }

  async scrollDepth(percentage: number) {
    await this.track('scroll_depth', {
      percentage,
      page: window.location.pathname,
    });
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  generateClickId(): string {
    return uuidv4();
  }
}

// Global analytics instance
export const analytics = new Analytics();

// Auto-track page views for SPAs
let currentPath = window.location.pathname;
const observer = new MutationObserver(() => {
  if (window.location.pathname !== currentPath) {
    currentPath = window.location.pathname;
    analytics.pageView();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});