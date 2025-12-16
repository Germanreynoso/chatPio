import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { versionHistoryService } from './versionHistoryService';
import type { ContentVersion, VersionContent } from '../types/versionHistory';

const supabaseUrl = 'https://pqabwroporfjgonaoamq.supabase.co';
const supabaseAnonKey = 'sb_publishable_g9B8DTYanaKMWqY90J9lVw_dLAOAsWH';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatHistoryRecord {
  id: number;
  session_id: string;
  message: any; // jsonb
}

export const fetchChatHistories = async (): Promise<ChatHistoryRecord[]> => {
  const { data, error } = await supabase
    .from('n8n_chat_histories')
    .select('*')
    .order('id', { ascending: false })
    .limit(10); // Limit to recent 10

  if (error) {
    console.error('Error fetching chat histories:', error);
    throw error;
  }

  console.log('Fetched chat histories:', data);

  // Save to localStorage as versions
  if (data) {
    data.forEach(record => {
      if (record.message) {
        const message = record.message;
        let sessionData = null;
        try {
          sessionData = JSON.parse(record.session_id);
        } catch (e) {
          // session_id is not JSON
        }
        let generatedContent = 'Contenido no disponible';
        let messageObj = message;
        if (typeof message === 'string') {
          try {
            messageObj = JSON.parse(message);
          } catch (e) {
            // If not JSON, use as content
            generatedContent = message;
          }
        }
        if (typeof messageObj === 'object' && messageObj !== null) {
          generatedContent = messageObj.content || messageObj.data?.bot_response || messageObj.details?.mensaje || 'Contenido no disponible';
        }
        const content: VersionContent[] = [{
          format: sessionData?.formats?.join(', ') || message.formats?.join(', ') || 'Desconocido',
          title: 'Contenido generado',
          content: generatedContent
        }];
        const metadata = {
          createdBy: 'usuario', // Mock
          area: sessionData?.area || message.area || 'Desconocido',
          formats: sessionData?.formats || message.formats || [],
          topic: sessionData?.details?.tema || message.details?.tema || message.topic || 'Sin título',
          status: 'draft' as const,
          languages: sessionData?.languages || message.languages || [],
          audience: sessionData?.details?.audiencia || message.details?.audiencia,
          isRefinement: false
        };
        const formData = sessionData?.details || message.details;
        try {
          versionHistoryService.saveVersion(record.session_id, content, metadata, formData);
        } catch (error) {
          console.error('Error saving version to localStorage:', error);
        }
      }
    });
  }

  return data || [];
};

export const fetchChatHistoryBySessionId = async (sessionId: string): Promise<ChatHistoryRecord | null> => {
  const { data, error } = await supabase
    .from('n8n_chat_histories')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    console.error('Error fetching chat history:', error);
    throw error;
  }

  return data;
};

export const fetchSummaryMetrics = async () => {
  const { data, error } = await supabase
    .from('v_pio_summary_metrics')
    .select('total_contenidos, areas_activas, horas_ahorradas, total_coste_apis')
    .single();

  if (error) {
    console.error('Error fetching summary metrics:', error);
    throw error;
  }

  return data;
};

export const fetchContentByAreaMonth = async (fromMonth?: string, toMonth?: string): Promise<{ area: string; month: string; count: number; hours_saved: number; total_cost: number }[]> => {
  let query = supabase
    .from('v_pio_metrics_by_area_month')
    .select('area, month, count, hours_saved, total_cost')
    .order('month', { ascending: false })
    .order('count', { ascending: false });

  if (fromMonth) query = query.gte('month', fromMonth);
  if (toMonth) query = query.lte('month', toMonth);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching content by area month:', error);
    throw error;
  }

  return data || [];
};

export const fetchUsageByFormat = async (): Promise<{ format: string; count: number; hours_saved: number; total_cost: number }[]> => {
  const { data, error } = await supabase
    .from('v_pio_usage_by_format')
    .select('*')
    .order('count', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching usage by format:', error);
    throw error;
  }

  return data || [];
};

export const fetchUsageByFormatArea = async (): Promise<{ area: string; format: string; count: number; hours_saved: number; total_cost: number }[]> => {
  const { data, error } = await supabase
    .from('v_pio_usage_by_format_area')
    .select('area, format, count, hours_saved, total_cost')
    .order('count', { ascending: false });

  if (error) {
    console.error('Error fetching usage by format area:', error);
    throw error;
  }

  return data || [];
};

export const fetchGlobalKpis = async () => {
  const { data, error } = await supabase
    .from('v_pio_global_kpis')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching global KPIs:', error);
    throw error;
  }

  return data;
};

export const fetchGlobalKpisByMonth = async (): Promise<{ month: string; total_contenidos: number; areas_activas: number; horas_ahorradas: number; total_coste_apis: number }[]> => {
  const { data, error } = await supabase
    .from('v_pio_global_kpis_by_month')
    .select('month, total_contenidos, areas_activas, horas_ahorradas, total_coste_apis')
    .order('month', { ascending: false })
    .limit(2);

  if (error) {
    console.error('Error fetching global KPIs by month:', error);
    throw error;
  }

  return data || [];
};

export const fetchTopDrivers = async (): Promise<{ area: string; format: string; count: number; percent_contenidos: number; percent_horas: number }[]> => {
  const { data, error } = await supabase
    .from('v_pio_top_drivers')
    .select('area, format, count, percent_contenidos, percent_horas');

  if (error) {
    console.error('Error fetching top drivers:', error);
    throw error;
  }

  return data || [];
};

export const fetchTopDriversTrend = async (fromMonth?: string, toMonth?: string): Promise<{ area: string; format: string; current_count: number; previous_count: number | null; variation_percent: number | null }[]> => {
  let query = supabase
    .from('v_pio_top_drivers_trend')
    .select('area, format, current_count, previous_count, variation_percent')
    .order('current_count', { ascending: false });

  // Note: this view may not have month, but if it does, add filter

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching top drivers trend:', error);
    throw error;
  }

  return data || [];
};

export const fetchAutoInsights = async (fromMonth?: string, toMonth?: string): Promise<{ area: string; format: string; month: string; count_variation_pct: number | null; hours_variation_pct: number | null; cost_variation_pct: number | null; insight_label: string }[]> => {
  let query = supabase
    .from('v_pio_insights_auto')
    .select('area, format, month, count_variation_pct, hours_variation_pct, cost_variation_pct, insight_label')
    .order('month', { ascending: false });

  if (fromMonth) query = query.gte('month', fromMonth);
  if (toMonth) query = query.lte('month', toMonth);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching auto insights:', error);
    throw error;
  }

  return data || [];
};

export const fetchSystemAlerts = async (): Promise<{ system_status: 'ok' | 'alert_cost' | 'alert_usage_drop' | 'alert_growth'; total_contenidos: number; total_cost: number; hours_saved: number } | null> => {
  const { data, error } = await supabase
    .from('v_pio_system_alerts')
    .select('system_status, total_contenidos, total_cost, hours_saved')
    .single();

  if (error) {
    console.error('Error fetching system alerts:', error);
    throw error;
  }

  return data;
};

export const fetchRecommendations = async (): Promise<{ area: string; format: string; cost_per_content: number; hours_per_content: number; recommendation: string }[]> => {
  const { data, error } = await supabase
    .from('v_pio_recommendations')
    .select('area, format, cost_per_content, hours_per_content, recommendation');

  if (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }

  return data || [];
};

export const fetchRecommendationsTrend = async (fromMonth?: string, toMonth?: string): Promise<{ area: string; format: string; month: string; cost_per_content: number; hours_per_content: number; cost_variation: number | null; hours_variation: number | null }[]> => {
  let query = supabase
    .from('v_pio_recommendations_trend')
    .select('area, format, month, cost_per_content, hours_per_content, cost_variation, hours_variation')
    .order('month', { ascending: false });

  if (fromMonth) query = query.gte('month', fromMonth);
  if (toMonth) query = query.lte('month', toMonth);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching recommendations trend:', error);
    throw error;
  }

  return data || [];
};