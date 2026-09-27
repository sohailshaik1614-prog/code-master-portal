/**
 * Live Monitoring Service Interface
 * Connected to Supabase RPC `get_live_monitoring` and Realtime channels
 * for 100+ concurrent participant telemetry without polling.
 */

import { Participant } from '../types';
import { supabase } from './supabaseClient';
import { mapDbToParticipant } from './participantService';

export interface ParticipantMonitoringRow {
  id: string;
  name: string;
  vtuNumber: string;
  currentRound: string;
  loginStatus: 'Logged In' | 'Logged Out';
  activityStatus: 'Active' | 'Idle' | 'Disqualified' | 'Not Started';
  timeRemaining: string;
  questionsAttempted: number;
  warnings: number;
  submissionStatus: 'Not Submitted' | 'In Progress' | 'Submitted' | 'Auto-Submitted' | 'Disqualified';
  score: number | string;
  qualificationStatus: string;
}

export const monitoringService = {
  /**
   * Fetches live monitoring dataset for Admin Portal from backend RPC
   */
  async fetchLiveMonitoring(eventId?: string): Promise<ParticipantMonitoringRow[]> {
    try {
      // 1. Call backend RPC get_live_monitoring
      const { data, error } = await supabase.rpc('get_live_monitoring', {
        p_event_id: eventId || '00000000-0000-0000-0000-000000000000',
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: row.participant_id || row.id,
          name: row.name || row.full_name || 'Participant',
          vtuNumber: row.vtu_number || '',
          currentRound: row.current_round ? `Round ${row.current_round}` : 'None',
          loginStatus: 'Logged In',
          activityStatus: (row.activity_status || (row.is_disqualified ? 'Disqualified' : 'Active')) as any,
          timeRemaining: row.time_remaining || '--:--',
          questionsAttempted: Number(row.questions_attempted || 0),
          warnings: Number(row.warnings_count ?? row.warnings ?? 0),
          submissionStatus: row.submission_status || (row.is_disqualified ? 'Disqualified' : 'In Progress'),
          score: row.total_score ?? row.score ?? 0,
          qualificationStatus: row.status || 'Active',
        }));
      }

      // 2. Query participants table directly
      const { data: participants, error: pErr } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (!pErr && participants) {
        return participants.map((p) => this.toMonitoringRow(mapDbToParticipant(p)));
      }
    } catch (e) {
      console.warn('fetchLiveMonitoring notice:', e);
    }
    return [];
  },

  /**
   * Subscribes to Realtime updates for live administrative monitoring.
   * Avoids continuous database polling across 100+ concurrent participants.
   */
  subscribeToMonitoring(onUpdate: () => void): () => void {
    const channel = supabase
      .channel('admin-live-monitoring')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        () => onUpdate()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'warnings' },
        () => onUpdate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Transforms a participant record into a monitoring dashboard row
   */
  toMonitoringRow(p: Participant): ParticipantMonitoringRow {
    let activityStatus: 'Active' | 'Idle' | 'Disqualified' | 'Not Started' = 'Not Started';
    if (p.isDisqualified) {
      activityStatus = 'Disqualified';
    } else if (p.round1Status === 'In Progress' || p.round2Status === 'In Progress') {
      activityStatus = 'Active';
    } else if (p.round1Status === 'Completed' || p.round2Status === 'Completed') {
      activityStatus = 'Idle';
    }

    return {
      id: p.id,
      name: p.fullName,
      vtuNumber: p.vtuNumber,
      currentRound: p.currentRound ? `Round ${p.currentRound}` : 'None',
      loginStatus: 'Logged In',
      activityStatus,
      timeRemaining: '--:--',
      questionsAttempted: p.round1Score !== null ? 1 : 0,
      warnings: p.warningsCount,
      submissionStatus: p.isDisqualified
        ? 'Disqualified'
        : (p.round2Status === 'Completed' || p.round1Status === 'Completed' ? 'Submitted' : 'In Progress'),
      score: p.totalScore,
      qualificationStatus: p.status,
    };
  },
};
