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
      if (record.message && typeof record.message === 'object') {
        const message = record.message;
        const generatedContent = message.data?.bot_response || 'Contenido no disponible';
        const content: VersionContent[] = [{
          format: message.formats?.join(', ') || 'Desconocido',
          title: 'Contenido generado',
          content: generatedContent
        }];
        const metadata = {
          createdBy: 'usuario', // Mock
          area: message.area || 'Desconocido',
          formats: message.formats || [],
          topic: message.details?.tema || 'Sin título',
          status: 'draft' as const,
          languages: message.languages || [],
          audience: message.details?.audiencia,
          isRefinement: false
        };
        const formData = message.details;
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