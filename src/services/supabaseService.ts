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

export const fetchContentByAreaMonth = async (): Promise<{ area: string; month: string; count: number; hours_saved: number; total_cost: number }[]> => {
  const { data, error } = await supabase
    .from('v_pio_metrics_by_area_month')
    .select('area, month, count, hours_saved, total_cost')
    .order('month', { ascending: false })
    .order('count', { ascending: false });

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