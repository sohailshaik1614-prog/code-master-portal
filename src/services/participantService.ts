/**
 * Participant Service Interface Layer
 * Manages participant profile, states, and Supabase database tracking.
 * Connects directly to Supabase with Realtime updates and efficient caching.
 */

import { Participant } from '../types';
import { supabase } from './supabaseClient';

export function mapDbToParticipant(row: any, fallbackEmail?: string): Participant {
  if (!row) {
    throw new Error('Cannot map empty participant row');
  }

  const vtuNum = row.vtu_number || row.vtuNumber || '';
  const email = row.vtu_email || row.vtuEmail || fallbackEmail || '';

  return {
    id: row.id || row.user_id,
    fullName: row.full_name || row.fullName || 'Participant',
    vtuNumber: vtuNum,
    vtuEmail: email,
    registeredAt: row.registered_at || row.created_at || new Date().toISOString(),
    status: row.status || 'Round 1 Eligible',
    currentRound: row.current_round ?? 1,
    round1Status: row.round_1_status || row.round1_status || row.round1Status || 'Available',
    round2Status: row.round_2_status || row.round2_status || row.round2Status || 'Locked',
    round1Score: row.round_1_score ?? row.round1_score ?? row.round1Score ?? null,
    round2Score: row.round_2_score ?? row.round2_score ?? row.round2Score ?? null,
    totalScore: Number(row.total_score ?? row.totalScore ?? 0),
    warningsCount: Number(row.warnings_count ?? row.warning_count ?? row.warningsCount ?? 0),
    isDisqualified: Boolean(row.is_disqualified ?? row.isDisqualified),
    disqualificationReason: row.disqualification_reason || row.disqualificationReason,
    submissionTimestamp: row.submission_timestamp || row.submissionTimestamp,
    lastActive: row.last_active || row.updated_at,
  };
}

export const participantService = {
  /**
   * Fetches participant profile by authenticated user ID from Supabase
   */
  async getProfile(userId: string, email?: string): Promise<Participant | null> {
    try {
      // 1. Try querying public.participants table
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .or(`user_id.eq.${userId},id.eq.${userId}`)
        .maybeSingle();

      if (!error && data) {
        return mapDbToParticipant(data, email);
      }

      // 2. If not found in participants, try profiles table
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!profileData && !data) {
        // Fallback to local session storage cache if offline
        const stored = localStorage.getItem(`codemasters_participant_${userId}`);
        if (stored) return JSON.parse(stored);
      }

      if (profileData) {
        return {
          id: profileData.id,
          fullName: profileData.full_name || 'Participant',
          vtuNumber: profileData.vtu_number || (email ? email.split('@')[0].toUpperCase() : ''),
          vtuEmail: profileData.email || email || '',
          registeredAt: profileData.created_at || new Date().toISOString(),
          status: 'Round 1 Eligible',
          currentRound: 1,
          round1Status: 'Available',
          round2Status: 'Locked',
          round1Score: null,
          round2Score: null,
          totalScore: 0,
          warningsCount: 0,
          isDisqualified: false,
        };
      }
    } catch (e) {
      console.warn('Supabase profile fetch error:', e);
      // Fallback to local storage if offline
      const stored = localStorage.getItem(`codemasters_participant_${userId}`);
      if (stored) return JSON.parse(stored);
    }
    return null;
  },

  /**
   * Subscribes to Realtime updates for a single participant
   * Ensures instant sync for warning counts, round status, and admin overrides
   */
  subscribeToParticipant(
    participantId: string,
    onUpdate: (participant: Participant) => void
  ): () => void {
    const channel = supabase
      .channel(`participant-sync-${participantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `id=eq.${participantId}`,
        },
        (payload) => {
          if (payload.new) {
            onUpdate(mapDbToParticipant(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Caches participant state locally for resilient offline recovery
   */
  saveParticipant(participant: Participant): void {
    try {
      localStorage.setItem(`codemasters_participant_${participant.id}`, JSON.stringify(participant));
      const session = localStorage.getItem('codemasters_current_participant');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.id === participant.id) {
          localStorage.setItem('codemasters_current_participant', JSON.stringify(participant));
        }
      }
    } catch (e) {
      console.warn('Failed to save local participant cache', e);
    }
  },
};
