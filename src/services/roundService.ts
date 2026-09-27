/**
 * Round Service Interface
 * Controls round eligibility, timings, access control, and backend RPC validation.
 * Uses server-authoritative RPC `can_enter_round` and `enter_round`.
 */

import { Participant, EventSchedule, RoundStatus, RoundPermission } from '../types';
import { supabase } from './supabaseClient';

export const roundService = {
  /**
   * Authoritative backend validation to check if a participant can enter a round.
   * Calls PostgreSQL RPC `can_enter_round(p_participant_id, p_round_id)`
   */
  async canEnterRoundBackend(
    participantId: string,
    roundNumber: 1 | 2
  ): Promise<{ canEnter: boolean; reason?: string }> {
    try {
      const { data, error } = await supabase.rpc('can_enter_round', {
        p_participant_id: participantId,
        p_round_id: roundNumber,
      });

      if (error) {
        console.warn('can_enter_round RPC call notice:', error.message);
        return { canEnter: false, reason: error.message };
      }

      if (typeof data === 'boolean') {
        return {
          canEnter: data,
          reason: data ? undefined : `You are not currently eligible to enter Round ${roundNumber}.`,
        };
      }

      if (data && typeof data === 'object') {
        return {
          canEnter: Boolean(data.can_enter ?? data.allowed ?? data.success),
          reason: data.reason || data.message,
        };
      }

      return { canEnter: Boolean(data) };
    } catch (e: any) {
      console.warn('Backend can_enter_round error:', e);
      return { canEnter: false, reason: e.message || 'Error validating round access with server.' };
    }
  },

  /**
   * Informs backend that participant entered the round
   */
  async recordRoundEntry(roundNumber: 1 | 2): Promise<void> {
    try {
      await supabase.rpc('enter_round', { p_round_id: roundNumber });
    } catch (e) {
      console.warn('enter_round RPC notice:', e);
    }
  },

  /**
   * Checks if round is active according to backend is_round_active RPC
   */
  async isRoundActiveBackend(roundNumber: 1 | 2): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_round_active', {
        p_round_id: roundNumber,
      });
      if (!error && typeof data === 'boolean') {
        return data;
      }
    } catch (e) {
      console.warn('is_round_active RPC notice:', e);
    }
    return true;
  },

  /**
   * Fetches official event schedule and round status from rounds table
   */
  async fetchEventSchedule(): Promise<Partial<EventSchedule> | null> {
    try {
      const { data: rounds, error } = await supabase
        .from('rounds')
        .select('*')
        .order('id', { ascending: true });

      if (error || !rounds || rounds.length === 0) {
        return null;
      }

      const r1 = rounds.find((r) => r.id === 1 || r.round_number === 1) || rounds[0];
      const r2 = rounds.find((r) => r.id === 2 || r.round_number === 2) || rounds[1];

      return {
        round1Start: r1?.start_time || '',
        round1End: r1?.end_time || '',
        round1DurationMinutes: r1?.duration_minutes || 60,
        round1Status: (r1?.status as RoundStatus) || 'Available',
        round2Start: r2?.start_time || '',
        round2End: r2?.end_time || '',
        round2DurationMinutes: r2?.duration_minutes || 90,
        round2Status: (r2?.status as RoundStatus) || 'Locked',
      };
    } catch (e) {
      console.warn('fetchEventSchedule error:', e);
      return null;
    }
  },

  /**
   * Checks if a round is currently active according to schedule (client-side display fallback)
   */
  isRoundActive(roundNumber: 1 | 2, schedule: EventSchedule): boolean {
    const status = roundNumber === 1 ? schedule.round1Status : schedule.round2Status;
    if (status === 'Live' || status === 'Available') return true;
    if (status === 'Locked' || status === 'Ended' || status === 'Not Started' || status === 'Scheduled') {
      return false;
    }

    const startTimeStr = roundNumber === 1 ? schedule.round1Start : schedule.round2Start;
    const endTimeStr = roundNumber === 1 ? schedule.round1End : schedule.round2End;

    if (startTimeStr && endTimeStr) {
      const now = new Date().getTime();
      const start = new Date(startTimeStr).getTime();
      const end = new Date(endTimeStr).getTime();
      if (!isNaN(start) && !isNaN(end)) {
        return now >= start && now <= end;
      }
    }

    return true;
  },

  /**
   * Checks if a participant is disqualified from a round
   */
  isParticipantDisqualified(participant: Participant | null, roundNumber: 1 | 2): boolean {
    if (!participant) return true;
    if (participant.isDisqualified) return true;
    const roundStatus = roundNumber === 1 ? participant.round1Status : participant.round2Status;
    return roundStatus === 'Disqualified' || participant.warningsCount >= 3;
  },

  /**
   * Evaluates if a participant is allowed to enter (client-side preliminary display check)
   */
  canEnterRound(
    participant: Participant | null,
    roundNumber: 1 | 2,
    schedule: EventSchedule,
    adminPermissions: Record<string, RoundPermission | boolean> = {}
  ): { canEnter: boolean; reason?: string } {
    if (!participant) {
      return { canEnter: false, reason: 'Authentication required. Please log in first.' };
    }

    if (this.isParticipantDisqualified(participant, roundNumber)) {
      const key = `${participant.id}_round${roundNumber}`;
      const perm = adminPermissions[key];
      const hasPerm = typeof perm === 'boolean' ? perm : Boolean(perm?.hasPermission);
      if (!hasPerm) {
        return {
          canEnter: false,
          reason: 'You have been disqualified from this round. Contact an event administrator to request re-entry.',
        };
      }
    }

    if (roundNumber === 2) {
      const isQualified =
        participant.status === 'Qualified' ||
        participant.status === 'Round 2 Eligible' ||
        participant.round2Status === 'Available';

      if (!isQualified && participant.round1Status !== 'Completed') {
        return {
          canEnter: false,
          reason: 'Round 2 is locked. You must complete Round 1 and qualify to unlock the Python Debugging challenge.',
        };
      }
    }

    const currentRoundStatus = roundNumber === 1 ? participant.round1Status : participant.round2Status;
    if (currentRoundStatus === 'Completed') {
      const key = `${participant.id}_round${roundNumber}`;
      const perm = adminPermissions[key];
      const hasPerm = typeof perm === 'boolean' ? perm : Boolean(perm?.hasPermission);
      if (!hasPerm) {
        return {
          canEnter: false,
          reason: `You have already submitted Round ${roundNumber}. Submissions are final unless unlocked by an administrator.`,
        };
      }
    }

    const isScheduleActive = this.isRoundActive(roundNumber, schedule);
    if (!isScheduleActive) {
      const status = roundNumber === 1 ? schedule.round1Status : schedule.round2Status;
      return {
        canEnter: false,
        reason: `Round ${roundNumber} is currently ${status.toLowerCase()}. Please wait for the event coordinators to open the round.`,
      };
    }

    return { canEnter: true };
  },

  /**
   * Computes the display status badge for the participant dashboard
   */
  getRoundCardStatus(participant: Participant | null, roundNumber: 1 | 2, schedule: EventSchedule): RoundStatus {
    if (!participant) return 'Locked';
    if (this.isParticipantDisqualified(participant, roundNumber)) return 'Disqualified';

    const participantRoundStatus = roundNumber === 1 ? participant.round1Status : participant.round2Status;
    if (participantRoundStatus === 'Completed') return 'Completed';
    if (participantRoundStatus === 'In Progress') return 'In Progress';

    if (roundNumber === 2) {
      if (participant.round1Status !== 'Completed' && participant.status !== 'Qualified' && participant.status !== 'Round 2 Eligible') {
        return 'Locked';
      }
    }

    const scheduleStatus = roundNumber === 1 ? schedule.round1Status : schedule.round2Status;
    if (scheduleStatus === 'Locked' || scheduleStatus === 'Ended') return scheduleStatus;

    return 'Available';
  },
};
