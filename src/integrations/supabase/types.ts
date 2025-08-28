export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.4';
  };
  public: {
    Tables: {
      analytics_events: {
        Row: {
          click_id: string | null;
          created_at: string;
          event_name: string;
          id: string;
          occurred_at: string;
          props: Json | null;
          session_id: string;
          user_id: string | null;
        };
        Insert: {
          click_id?: string | null;
          created_at?: string;
          event_name: string;
          id?: string;
          occurred_at?: string;
          props?: Json | null;
          session_id: string;
          user_id?: string | null;
        };
        Update: {
          click_id?: string | null;
          created_at?: string;
          event_name?: string;
          id?: string;
          occurred_at?: string;
          props?: Json | null;
          session_id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      analytics_sessions: {
        Row: {
          country: string | null;
          created_at: string;
          device_type: string | null;
          ended_at: string | null;
          id: string;
          is_returning: boolean | null;
          landing_page: string | null;
          page_views: number | null;
          referrer: string | null;
          started_at: string;
          updated_at: string;
          user_id: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          utm_term: string | null;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          device_type?: string | null;
          ended_at?: string | null;
          id: string;
          is_returning?: boolean | null;
          landing_page?: string | null;
          page_views?: number | null;
          referrer?: string | null;
          started_at?: string;
          updated_at?: string;
          user_id?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          device_type?: string | null;
          ended_at?: string | null;
          id?: string;
          is_returning?: boolean | null;
          landing_page?: string | null;
          page_views?: number | null;
          referrer?: string | null;
          started_at?: string;
          updated_at?: string;
          user_id?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          excerpt: string | null;
          featured_image: string | null;
          id: string;
          published: boolean | null;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          tags: string[] | null;
          title: string;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          published?: boolean | null;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          published?: boolean | null;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          budget_band: string | null;
          campaign: string | null;
          click_id: string | null;
          closed_at: string | null;
          created_at: string;
          deal_value: number | null;
          email: string | null;
          first_contact_at: string | null;
          id: string;
          medium: string | null;
          phone: string | null;
          proposal_sent_at: string | null;
          qualified_at: string | null;
          reason_lost: string | null;
          reply_time_minutes: number | null;
          service_interest: string | null;
          session_id: string | null;
          source: string | null;
          status: string | null;
          updated_at: string;
          whatsapp_conversation_id: string | null;
        };
        Insert: {
          budget_band?: string | null;
          campaign?: string | null;
          click_id?: string | null;
          closed_at?: string | null;
          created_at?: string;
          deal_value?: number | null;
          email?: string | null;
          first_contact_at?: string | null;
          id?: string;
          medium?: string | null;
          phone?: string | null;
          proposal_sent_at?: string | null;
          qualified_at?: string | null;
          reason_lost?: string | null;
          reply_time_minutes?: number | null;
          service_interest?: string | null;
          session_id?: string | null;
          source?: string | null;
          status?: string | null;
          updated_at?: string;
          whatsapp_conversation_id?: string | null;
        };
        Update: {
          budget_band?: string | null;
          campaign?: string | null;
          click_id?: string | null;
          closed_at?: string | null;
          created_at?: string;
          deal_value?: number | null;
          email?: string | null;
          first_contact_at?: string | null;
          id?: string;
          medium?: string | null;
          phone?: string | null;
          proposal_sent_at?: string | null;
          qualified_at?: string | null;
          reason_lost?: string | null;
          reply_time_minutes?: number | null;
          service_interest?: string | null;
          session_id?: string | null;
          source?: string | null;
          status?: string | null;
          updated_at?: string;
          whatsapp_conversation_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      increment_page_views: {
        Args: { session_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
