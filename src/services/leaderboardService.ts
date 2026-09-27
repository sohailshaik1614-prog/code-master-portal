/**
 * Leaderboard Service Interface
 * Connected to Supabase backend RPC `get_leaderboard` and authoritative sorting.
 * 
 * TIE-BREAKER RULE:
 * 1. Higher total score first
 * 2. Earlier final submission timestamp second (server-authoritative timestamps)
 */

import { LeaderboardEntry } from '../types';
import { supabase } from './supabaseClient';

export const leaderboardService = {
  /**
   * Fetches authoritative leaderboard from Supabase backend RPC `get_leaderboard`
   */
  async fetchLeaderboard(eventId?: string): Promise<LeaderboardEntry[]> {
    try {
      // 1. Call backend RPC get_leaderboard
      const { data, error } = await supabase.rpc('get_leaderboard', {
        p_event_id: eventId || '00000000-0000-0000-0000-000000000000',
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: LeaderboardEntry[] = data.map((row: any, index: number) => ({
          rank: Number(row.rank || index + 1),
          participantId: row.participant_id || row.id,
          fullName: row.full_name || row.participant_name || 'Participant',
          vtuNumber: row.vtu_number || '',
          round1Score: Number(row.round_1_score ?? row.round1_score ?? 0),
          round2Score: Number(row.round_2_score ?? row.round2_score ?? 0),
          totalScore: Number(row.total_score ?? 0),
          submissionTimestamp: row.submission_timestamp || row.submitted_at || new Date().toISOString(),
          status: row.status || (row.is_disqualified ? 'Disqualified' : 'Active'),
        }));

        return this.sortLeaderboard(mapped);
      }

      // 2. Query participants table directly with authoritative database order
      const { data: participants, error: pErr } = await supabase
        .from('participants')
        .select('*')
        .order('total_score', { ascending: false })
        .order('submission_timestamp', { ascending: true })
        .limit(100);

      if (!pErr && participants && participants.length > 0) {
        const entries: LeaderboardEntry[] = participants.map((p) => ({
          rank: 0,
          participantId: p.id || p.user_id,
          fullName: p.full_name,
          vtuNumber: p.vtu_number,
          round1Score: Number(p.round_1_score ?? p.round1_score ?? 0),
          round2Score: Number(p.round_2_score ?? p.round2_score ?? 0),
          totalScore: Number(p.total_score || 0),
          submissionTimestamp: p.submission_timestamp || p.created_at || new Date().toISOString(),
          status: p.is_disqualified ? 'Disqualified' : 'Active',
        }));

        return this.sortLeaderboard(entries);
      }
    } catch (e) {
      console.warn('fetchLeaderboard notice:', e);
    }
    return [];
  },

  /**
   * Sorts entries strictly following the CODEMASTERS authoritative rules:
   * 1. Descending Total Score (higher score = higher rank)
   * 2. Ascending Submission Timestamp (earlier submission = higher rank)
   */
  sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    const sorted = [...entries].sort((a, b) => {
      // 1. Total score descending
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }

      // 2. Submission timestamp ascending (earlier submission wins tie)
      const timeA = new Date(a.submissionTimestamp || '9999-12-31').getTime();
      const timeB = new Date(b.submissionTimestamp || '9999-12-31').getTime();

      return timeA - timeB;
    });

    // Re-assign authoritative ranks 1..N based on sorted order
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  },

  /**
   * Computes rank for a specific participant
   */
  getParticipantRank(participantId: string, entries: LeaderboardEntry[]): number | null {
    const sorted = this.sortLeaderboard(entries);
    const index = sorted.findIndex((e) => e.participantId === participantId);
    return index !== -1 ? sorted[index].rank : null;
  },
};
