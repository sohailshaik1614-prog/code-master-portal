/**
 * Permission & Override Service Interface
 * Connected to Supabase RPCs for administrative controls and audit trails:
 * - admin_reopen_round_for_participant
 * - admin_reset_warning_count
 * - admin_reenable_participant
 * - admin_unlock_submission
 * - admin_permit_round
 * - admin_qualify_participant
 * - admin_audit
 */

import { Participant, RoundPermission } from '../types';
import { supabase } from './supabaseClient';

export const permissionService = {
  STORAGE_KEY: 'codemasters_permissions',

  /**
   * Grants round entry permission to a participant via backend RPC
   */
  async grantRoundPermission(
    participantId: string,
    roundNumber: 1 | 2,
    reason: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('admin_permit_round', {
        p_participant_id: participantId,
        p_round_id: roundNumber,
        p_reason: reason,
      });

      if (!error) {
        await this.logAdminAudit('GRANT_ROUND_PERMISSION', { roundNumber, reason }, participantId, 'participant');
        return true;
      }
      console.warn('admin_permit_round error:', error.message);
    } catch (e) {
      console.warn('grantRoundPermission error:', e);
    }
    return false;
  },

  /**
   * Re-enables a disqualified participant and resets warnings via backend RPC
   */
  async reEnableParticipant(
    participant: Participant,
    roundNumber: 1 | 2,
    reason: string
  ): Promise<Participant> {
    try {
      await supabase.rpc('admin_reenable_participant', {
        p_participant_id: participant.id,
        p_round_id: roundNumber,
        p_reason: reason,
      });
      await this.logAdminAudit('REENABLE_PARTICIPANT', { roundNumber, reason }, participant.id, 'participant');
    } catch (e) {
      console.warn('admin_reenable_participant RPC notice:', e);
    }

    // Return optimistic updated participant
    return {
      ...participant,
      warningsCount: 0,
      isDisqualified: false,
      disqualificationReason: undefined,
      status: roundNumber === 1 ? 'Round 1 Eligible' : 'Round 2 Eligible',
      round1Status: roundNumber === 1 ? 'Available' : participant.round1Status,
      round2Status: roundNumber === 2 ? 'Available' : participant.round2Status,
    };
  },

  /**
   * Resets warning count for a participant via backend RPC
   */
  async resetWarnings(participant: Participant, roundNumber: 1 | 2 = 1, reason = 'Admin Reset'): Promise<Participant> {
    try {
      await supabase.rpc('admin_reset_warning_count', {
        p_participant_id: participant.id,
        p_round_id: roundNumber,
        p_reason: reason,
      });
      await this.logAdminAudit('RESET_WARNINGS', { roundNumber, reason }, participant.id, 'participant');
    } catch (e) {
      console.warn('admin_reset_warning_count RPC notice:', e);
    }

    return {
      ...participant,
      warningsCount: 0,
      isDisqualified: false,
      disqualificationReason: undefined,
      round1Status: participant.round1Status === 'Disqualified' ? 'Available' : participant.round1Status,
      round2Status: participant.round2Status === 'Disqualified' ? 'Available' : participant.round2Status,
    };
  },

  /**
   * Unlocks submission so a participant can re-enter via backend RPC
   */
  async unlockSubmission(
    participant: Participant,
    roundNumber: 1 | 2,
    reason = 'Admin Submission Unlock'
  ): Promise<Participant> {
    try {
      await supabase.rpc('admin_unlock_submission', {
        p_participant_id: participant.id,
        p_round_id: roundNumber,
        p_reason: reason,
      });
      await this.logAdminAudit('UNLOCK_SUBMISSION', { roundNumber, reason }, participant.id, 'participant');
    } catch (e) {
      console.warn('admin_unlock_submission RPC notice:', e);
    }

    return {
      ...participant,
      round1Status: roundNumber === 1 ? 'Available' : participant.round1Status,
      round2Status: roundNumber === 2 ? 'Available' : participant.round2Status,
    };
  },

  /**
   * Reopens a round for a participant via backend RPC
   */
  async reopenRoundForParticipant(
    participant: Participant,
    roundNumber: 1 | 2,
    reason: string
  ): Promise<Participant> {
    try {
      await supabase.rpc('admin_reopen_round_for_participant', {
        p_participant_id: participant.id,
        p_round_id: roundNumber,
        p_reason: reason,
      });
      await this.logAdminAudit('REOPEN_ROUND', { roundNumber, reason }, participant.id, 'participant');
    } catch (e) {
      console.warn('admin_reopen_round_for_participant RPC notice:', e);
    }

    return {
      ...participant,
      round1Status: roundNumber === 1 ? 'Available' : participant.round1Status,
      round2Status: roundNumber === 2 ? 'Available' : participant.round2Status,
    };
  },

  /**
   * Qualifies a participant for Round 2 via backend RPC
   */
  async qualifyForRound2(participant: Participant, reason = 'Admin Manual Qualification'): Promise<Participant> {
    try {
      await supabase.rpc('admin_qualify_participant', {
        p_participant_id: participant.id,
        p_reason: reason,
      });
      await this.logAdminAudit('QUALIFY_PARTICIPANT', { reason }, participant.id, 'participant');
    } catch (e) {
      console.warn('admin_qualify_participant RPC notice:', e);
    }

    return {
      ...participant,
      status: 'Qualified',
      round2Status: 'Available',
    };
  },

  /**
   * Writes an entry to the database audit_logs table via admin_audit RPC
   */
  async logAdminAudit(
    action: string,
    details: any,
    entityId: string,
    entityType: string
  ): Promise<void> {
    try {
      await supabase.rpc('admin_audit', {
        p_action: action,
        p_details: typeof details === 'string' ? details : JSON.stringify(details),
        p_entity_id: entityId,
        p_entity_type: entityType,
      });
    } catch (e) {
      console.warn('admin_audit RPC notice:', e);
    }
  },

  /**
   * Fetches stored permissions from round_permissions table
   */
  async fetchPermissions(): Promise<Record<string, RoundPermission>> {
    try {
      const { data, error } = await supabase.from('round_permissions').select('*');
      if (!error && data) {
        const record: Record<string, RoundPermission> = {};
        data.forEach((p) => {
          const key = `${p.participant_id}_round${p.round_id}`;
          record[key] = {
            participantId: p.participant_id,
            vtuNumber: p.vtu_number || '',
            roundNumber: Number(p.round_id) as 1 | 2,
            hasPermission: Boolean(p.has_permission),
            reason: p.reason,
            grantedBy: p.granted_by,
            grantedAt: p.granted_at,
          };
        });
        return record;
      }
    } catch (e) {
      console.warn('fetchPermissions error:', e);
    }
    return this.getStoredPermissions();
  },

  getStoredPermissions(): Record<string, RoundPermission> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  savePermissions(permissions: Record<string, RoundPermission>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(permissions));
    } catch (e) {
      console.warn('Failed to save permissions cache', e);
    }
  },
};
